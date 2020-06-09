// Drag and Drop Interface
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

/**
 * @fileoverview The entry file of the `Project` app
 */

interface IProject {
  id?: string;
  title: string;
  description: string;
  people: number;
  state?: string;
}

interface IProjectWithTemplate extends IProject {
  template: any;
}

/**
 * An interface that defines an object with one method that is capable of
 * creating and returning a Project instance.
 */
interface ICreator {
  create(...arg: any[]): any;
}

interface ISubscriber {
  /**
   * An channel through which the Observer sends off messages
   * to it's subsribers.
   * @param arg - An arbitrary list of arguments of any type.
   * @return  { any | void } Depending on the actual subscriber, this
   * method may or may not return a value.
   */
  recieveBroadcast(...arg: any[]): any | void;
}

interface IObserver {
  subscribers: ISubscriber[];
  /**
   * Adds a new subscriber to the list of subscribers
   * @param { ISubscriber } subscriber - a subscriber object
   */
  addSubscriber(subscriber: ISubscriber): void;
  /**
   * Broadcasts a message to all subscribers
   */
  broadcast(...arg: any[]): void;
}

/**
 * A decorator function that automatically binds a method to
 * it's class instance.
 */
const autobind = (
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  return {
    configurable: true,
    get() {
      return descriptor.value.bind(this);
    },
  };
};

/**
 * A function that is called in another function and receives
 * an arbitrary number of argument of n types
 */
type Callback = Function;

/**
 * A HTML Element with a `value` attribute
 */
interface HasValueProp {
  value: string;
}

/**
 * A validator schema interface
 */
interface ValidationSchema {
  /**@property an attribute of the form element used to identify it, maybe it's id or data-type */
  accessor?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type: string | number;
  alias?: string;
  min?: number;
  max?: number;
  value?: string;
}

/**
 * An error object with details of an invalid input field
 */
interface InputError {
  field: FieldElement;
  name: string;
  errors: string[];
}

/**
 * A HTML input, select or textarea element.
 */
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type FieldSchema = ValidationSchema &
  HasValueProp & {
    inputField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  };

/**
 * Form input validator
 * @property accessor - A html attribute that will be used to
 * access each input element in the form
 */
class FormValidator {
  protected inputSchemas: FieldSchema[] = [];
  inputErrors: {}[] = [];

  constructor(private accessor: string) {}

  /**
   * adds validatiion to each input
   */
  addValidation<T extends FieldElement>(
    inputField: T,
    schemaDescription: ValidationSchema
  ): this {
    const accessor = schemaDescription.accessor || this.accessor;

    this.inputSchemas.push({
      ...schemaDescription,
      accessor,
      inputField,
      value: schemaDescription.value || inputField.value,
    });

    return this;
  }

  private checkRequired(schema: FieldSchema, inputError: InputError): void {
    let message = '';
    if (schema.inputField.value.length === 0) {
      message = `${inputError.name} is required.`;
      inputError.errors.push(message);
    }
  }

  private checkType(schema: FieldSchema, inputError: InputError): void {
    let message = '';
    const schemaValue = schema.type === 'number' ? +schema.value : schema.value;
    if (schema.inputField.value.length && typeof schemaValue !== schema.type) {
      message = `${inputError.name} is required.`;
      inputError.errors.push(message);
    }
  }

  /**
   * Validates each input field
   */
  private runValidation(schema: FieldSchema) {
    const field = schema.inputField; // We're sure the accessor will be set
    const name = schema.alias as string;
    const errors: string[] = [];
    const inputError = { field, errors, name };

    if (schema.required) {
      this.checkRequired(schema, inputError);
    }

    if (schema.type) {
      this.checkType(schema, inputError);
    }

    // if (schema.)
    if (inputError.errors.length) {
      this.inputErrors.push(inputError);
    }
  }

  /**
   *  runs validation on the object
   */
  validateAll(): void {
    this.inputErrors = [];

    this.inputSchemas.forEach((schema) => {
      this.runValidation(schema);
    });
  }
}

/**
 * A custom form processor that implements it's custom
 * validation and submission.
 */
abstract class FormProcessor extends FormValidator {
  protected abstract form: HTMLFormElement;
  constructor() {
    super('id');
  }

  /**
   * Attaches an event handler to the form's submit event
   */
  protected setFormSubmitEventHandler(): void {
    this.form.addEventListener('submit', this.beginSubmit);
  }

  /**
   * Handles the form submisison. It is an async method.
   * The inheriting class is expected to implement this method.
   * @param { Event } event - The submit event on the form
   */
  abstract handleSubmit(event: Event): unknown | Promise<unknown>;

  /**
   * Starts the form submisison. It is an async method.
   * @param { Event } event - The submit event on the form
   */
  @autobind
  private beginSubmit(event: Event): void {
    event.preventDefault();
    this.validateAll();
    this.handleSubmit(event);
  }
}

/**
 * Extracts the content of template elememt which later gets added
 * to the DOM.
 * @class TemplateExtractor
 * @property
 */
class TemplateExtractor<T extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected targetElement: HTMLElement;
  readonly templateContentElement: T;

  constructor(templateElementId: string, private targetElementId: string) {
    this.templateElement = document.getElementById(
      `${templateElementId}`
    )! as HTMLTemplateElement;

    this.targetElement = document.getElementById(`${targetElementId}`)!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.templateContentElement = importedNode.firstElementChild as T;
  }

  fillTarget(
    position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
  ): void {
    this.targetElement.insertAdjacentElement(
      position,
      this.templateContentElement
    );
  }
}

/**
 * Manages all in-project operations
 */
class ProjectManager implements ISubscriber, IObserver {
  subscribers: ISubscriber[] = [];
  private projects: Project[] = [];

  constructor(
    private projectCreator: ICreator,
    private projectTemplateCreator: ICreator
  ) {}

  addSubscriber(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
  }

  broadcast(
    project: Project,
    action: string,
    projectTemplate: ProjectTemplate
  ): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.recieveBroadcast(project, action, projectTemplate);
    });
  }

  /**
   * Creates a new project instance and return same.
   * @param { IProject } fields form fields broadcasted from the ProjectForm observer
   * @returns { Project } a Project object.
   */
  createProject(fields: IProject): Project {
    return this.projectCreator.create(
      fields.title,
      fields.description,
      fields.people
    );
  }

  /**
   * Updates a projecs state
   */
  updateProjectState(
    projectId: string | number,
    newState: 'active' | 'completed'
  ) {
    const project = this.projects.find(
      (project) => Number(project.id) === Number(projectId)
    )!;

    if (project.state === newState) {
      return;
    }

    if (newState === 'active') {
      project.markAsActive();
    } else if (newState === 'completed') {
      project.markAsComplete();
    }

    const projectTemplate = this.setupProjectTemplate(project);
    this.broadcast(project, 'move', projectTemplate);
  }

  /**
   * Creates and adds event listeners on a project Template
   */
  setupProjectTemplate(project: Project) {
    const projectTemplate = this.projectTemplateCreator.create(
      project
    ) as ProjectTemplate;

    projectTemplate.on('state-change', (project: Project) => {
      if (project.state === 'active') {
        project.markAsComplete();
      } else {
        project.markAsActive();
      }
      // console.log(`State changed from  ${oldState} to ${project.state}`);
      this.broadcast(project, 'move', projectTemplate);
    });

    projectTemplate.on('delete', (project: Project) => {
      // console.log(`Deleting ` + project);
      this.broadcast(project, 'delete', projectTemplate);
    });

    return projectTemplate;
  }

  /**
   * Recieves fields from project form and proceeds to call the `createProject` method.
   */
  @autobind
  recieveBroadcast(fields: IProject) {
    const project = this.createProject(fields);
    const projectTemplate = this.setupProjectTemplate(project);
    this.projects.push(project);
    this.broadcast(project, 'new', projectTemplate);
  }
}

/**
 * Creates a new project template
 */
class ProjectTemplate implements Draggable {
  private events: [string, Function][] = [];
  stateButton: HTMLButtonElement = document.createElement('button');
  deleteButton: HTMLButtonElement = document.createElement('button');

  constructor(private project: Project) {}

  @autobind
  dragStartHandler(event: DragEvent): void {
    const { dataTransfer } = event;
    dataTransfer!.setData('text/plain', this.project?.id);
    dataTransfer!.effectAllowed = 'move';
  }
  @autobind
  dragEndHandler(_: DragEvent): void {
    console.log('Dragging Done');
  }

  configureDraggable() {
    const projectTemplateInDOM = document.getElementById(this.project.id)!;

    projectTemplateInDOM.addEventListener('dragstart', this.dragStartHandler);
    projectTemplateInDOM.addEventListener('dragend', this.dragEndHandler);
  }

  static create(project: Project) {
    return new ProjectTemplate(project);
  }

  on(eventType: 'state-change' | 'delete', callback: Function) {
    this.events.push([eventType, callback]);
  }

  private getEventCallback(eventType: 'state-change' | 'delete') {
    const e = this.events.filter(
      (event: [string, Function]) => event[0] === eventType
    )[0];

    return e[1];
  }

  getTemplate() {
    const li = document.createElement('li');
    li.id = this.project.id;
    li.className = `project ${this.project.state}`;
    li.draggable = true;

    // Project body
    const body = document.createElement('div');
    body.className = 'project-body';

    const h2 = document.createElement('h2');
    h2.className = 'project-title';
    h2.innerHTML = this.project.title;

    const p1 = document.createElement('p');
    p1.className = 'project-desc';
    p1.innerHTML = this.project.description;
    const p2 = document.createElement('p');
    p2.className = 'project-people';
    p2.innerHTML = `Participants: ${this.project.people}`;

    body.appendChild(p1);
    body.appendChild(p2);

    // Buttons
    // const stateButton = document.createElement('button');
    this.stateButton.className = 'state-btn btn';
    this.stateButton.id = `state-${this.project.id}`;
    this.stateButton.innerHTML = `mark as ${
      this.project.state === 'active' ? 'completed' : 'active'
    }`;

    // const deleteButton = document.createElement('button');
    this.deleteButton.id = `delete-${this.project.id}`;
    this.deleteButton.className = 'delete-btn btn';
    this.deleteButton.innerHTML = 'delete';

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';
    buttonGroup.appendChild(this.deleteButton);
    buttonGroup.appendChild(this.stateButton);

    li.appendChild(h2);
    li.appendChild(body);
    li.appendChild(buttonGroup);
    return li;
  }

  activateEventListeners() {
    const stateBtnInDONM = document.querySelector(
      `button#state-${this.project.id}`
    )!;
    stateBtnInDONM.addEventListener('click', this.handleStateChange);

    const deleteBtnInDONM = document.querySelector(
      `button#delete-${this.project.id}`
    )!;
    deleteBtnInDONM.addEventListener('click', this.handleDelete);

    this.configureDraggable();
  }

  @autobind
  private handleDelete(event: Event) {
    const deleteCallback = this.getEventCallback('delete');
    if (deleteCallback) {
      deleteCallback(this.project);
    }
  }

  @autobind
  private handleStateChange(event: Event) {
    const stateChangeCallback = this.getEventCallback('state-change');
    if (stateChangeCallback) {
      stateChangeCallback(this.project);
    }
  }
}

/**
 * Creates a new project with empty data
 */
class Project implements IProject {
  private _state: 'active' | 'completed' = 'active';
  private _id: string;

  /**
   * A static method that creates and returns a new `Project` instance
   */
  static create(title: string, description: string, people: number): Project {
    return new Project(title, description, people);
  }

  private constructor(
    private _title: string,
    private _description: string,
    private _people: number
  ) {
    this._id = `${Date.now().toString()}`;
  }

  get state(): string {
    return this._state;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get people(): number {
    return this._people;
  }

  set people(n: number) {
    this.people = n;
  }

  markAsComplete() {
    this._state = 'completed';
  }

  markAsActive() {
    this._state = 'active';
  }
}

/**
 * An abstract class used creates a project list
 */
abstract class ProjectList implements ISubscriber, IObserver, DragTarget {
  container: HTMLDivElement;
  project: Project | null = null;
  // projects: Project[] = [];
  subscribers: ISubscriber[] = [];
  projectTemplates: ProjectTemplate[] = [];

  constructor(
    private templateExtractor: TemplateExtractor<HTMLDivElement>,
    protected readonly type: 'active' | 'completed'
  ) {
    this.container = this.templateExtractor.templateContentElement;
    this.container.className = `project-list`;
    this.container.id = `${type}-project-list`;
    const h2 = this.container.querySelector('h2')!;
    h2.innerHTML = `${this.type} projects`.toUpperCase();

    this.templateExtractor.fillTarget('beforeend');

    this.configureDroppable(this.getContainerFromDOM());
  }
  addSubscriber(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
  }
  broadcast(projectId: string | number, type: string): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.recieveBroadcast(projectId, type);
    });
  }

  private getContainerFromDOM(): HTMLElement {
    return document.getElementById(`${this.type}-project-list`)!;
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();

      const containerInDOM = this.getContainerFromDOM();
      containerInDOM.classList.add('droppable');
    }
  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    const containerInDOM = this.getContainerFromDOM();
    containerInDOM.classList.remove('droppable');
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const id = event.dataTransfer!.getData('text/plain');
    this.broadcast(id, this.type);
  }

  activateListeners() {
    this.projectTemplates.forEach((projectTemplate) => {
      projectTemplate.activateEventListeners();
    });
  }

  configureDroppable(containerInDOM: HTMLElement): void {
    containerInDOM.addEventListener('dragover', this.dragOverHandler);
    containerInDOM.addEventListener('dragleave', this.dragLeaveHandler);
    containerInDOM.addEventListener('drop', this.dropHandler);
  }

  /**
   * Curates the project list if `projects` is not empty
   */
  curateList() {
    const ul = this.container.querySelector('ul')!;
    ul.innerHTML = '';

    if (this.projectTemplates.length) {
      const template = document.createElement('span');
      this.projectTemplates.forEach((projectTemplate, index) => {
        template.appendChild(projectTemplate.getTemplate());
      });

      ul.innerHTML = template.innerHTML!;
      this.activateListeners();
    }
  }

  /**
   * Adds a project to the project list
   * @param { Project } project - A `Project` instance
   */
  add(project: Project, projectTemplate: ProjectTemplate): void {
    if (project.state === this.type) {
      this.project = project;
      // this.projects.push(project);
      this.projectTemplates.push(projectTemplate);
    }
  }

  /**
   * Removes a project from the current project list
   * @param { Project } project - A `Project` instance
   */
  delete(project: Project, projectTemplate: ProjectTemplate): void {
    if (project.state === this.type) {
      this.remove(project, projectTemplate);
    }
  }

  remove(project: Project, projectTemplate: ProjectTemplate): void {
    // this.projects = this.projects.filter((currentProject) => {
    //   return currentProject.id !== project.id;
    // });

    this.projectTemplates = this.projectTemplates.filter(
      (currentProjectTemplate) =>
        currentProjectTemplate.getTemplate().id !==
        projectTemplate.getTemplate().id
    );
  }

  /**
   * Adds or removes a project from the current project list depending on
   * the project list's type and the project's state.
   * @param { Project } project - A Project instance
   */
  abstract move(project: Project, projectTemplates: ProjectTemplate): void;

  /**
   * Recieves a message from the `Project` instance to create a new project,
   * move a project or delete it.
   */
  @autobind
  recieveBroadcast(
    project: Project,
    action: 'new' | 'move' | 'delete',
    projectTemplate: ProjectTemplate
  ): void {
    const initialProjectCount = this.projectTemplates.length;

    if (action === 'new') {
      this.add(project, projectTemplate);
    } else if (action === 'move') {
      this.move(project, projectTemplate);
    } else if (action === 'delete') {
      // console.log(project);
      this.delete(project, projectTemplate);
    }

    // console.log(this.type);
    // console.log(this.projects);

    if (this.projectTemplates.length !== initialProjectCount) {
      this.curateList();
    }
  }
}

/**
 * Creates and manages a list of active projects
 */
class ActiveProjects extends ProjectList {
  constructor(templateExtractor: TemplateExtractor<HTMLDivElement>) {
    super(templateExtractor, 'active');
  }

  move(project: Project, projectTemplates: ProjectTemplate): void {
    // console.log(this.type + ' list recieved new ' + project.state + ' project');
    if (project.state === 'active') {
      this.add(project, projectTemplates);
    } else if (project.state === 'completed') {
      this.remove(project, projectTemplates);
    }
  }
}

/**
 * Creates and manages a list of completed projects
 */
class CompletedProjects extends ProjectList {
  constructor(templateExtractor: TemplateExtractor<HTMLDivElement>) {
    super(templateExtractor, 'completed');
  }

  move(project: Project, projectTemplates: ProjectTemplate): void {
    // console.log(this.type + ' list recieved new ' + project.state + ' project');
    if (project.state === 'active') {
      this.remove(project, projectTemplates);
    } else if (project.state === 'completed') {
      this.add(project, projectTemplates);
    }
  }
}

/**
 * A sunscriber that manages the projects after a drag and drop
 */
class ProjectDragManager implements ISubscriber {
  constructor(private projectManager: ProjectManager) {}

  recieveBroadcast(
    id: string | number,
    newState: 'active' | 'completed'
  ): void {
    this.projectManager.updateProjectState(id, newState);
  }
}

/**
 * @class ProjectForm
 */
class ProjectForm extends FormProcessor implements IObserver {
  subscribers: ISubscriber[] = [];
  form: HTMLFormElement;
  title: HTMLInputElement;
  description: HTMLInputElement;
  people: HTMLInputElement;

  constructor(private templateExtractor: TemplateExtractor<HTMLFormElement>) {
    super();

    this.form = this.templateExtractor.templateContentElement;
    this.setFormSubmitEventHandler();

    this.templateExtractor.fillTarget('afterbegin');

    this.title = document.querySelector('input#title')! as HTMLInputElement;
    this.description = document.querySelector(
      'textarea#description'
    )! as HTMLInputElement;
    this.people = document.querySelector('input#people')! as HTMLInputElement;

    // Define Validation for all the fields
    this.defineValidation();
  }

  addSubscriber(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
  }

  broadcast(): void {
    const project: IProject = {
      title: this.title.value,
      description: this.description.value,
      people: +this.people.value,
    };

    this.subscribers.forEach((subscriber) => {
      subscriber.recieveBroadcast(project);
    });
  }

  defineValidation(): void {
    this.addValidation(this.title, {
      type: 'string',
      required: true,
      alias: 'title',
    });
    this.addValidation(this.description, {
      type: 'string',
      required: true,
      alias: 'description',
    });
    this.addValidation(this.people, {
      type: 'number',
      required: true,
      alias: 'people',
    });
  }

  handleSubmit(event: Event) {
    this.inputSchemas.forEach((schema) => {
      const errorObj = this.inputErrors.find((inputError) => {
        return (inputError as InputError).field === schema.inputField;
      }) as InputError;

      schema.inputField.nextElementSibling!.textContent = errorObj
        ? errorObj.errors[0]
        : '';
    });

    if (this.inputErrors.length === 0) {
      this.broadcast();
      this.form.reset();
    }
  }
}

// ***********************************************
// ***********************************************
// **************** APP EXECUTION ****************
// ***********************************************
// ***********************************************
// TEMPLATE EXTRACTORS
const projectFormTemplateExtractor = new TemplateExtractor<HTMLFormElement>(
  'project-form',
  'app'
);
const projectListTemplateExtractor1 = new TemplateExtractor<HTMLDivElement>(
  'project-list',
  'app'
);
const projectListTemplateExtractor2 = new TemplateExtractor<HTMLDivElement>(
  'project-list',
  'app'
);

const projectForm: ProjectForm = new ProjectForm(projectFormTemplateExtractor);

const activeProjects: ProjectList = new ActiveProjects(
  projectListTemplateExtractor1
);
const completedProjects: ProjectList = new CompletedProjects(
  projectListTemplateExtractor2
);

const projectManager: ProjectManager = new ProjectManager(
  Project,
  ProjectTemplate
);
projectManager.addSubscriber(activeProjects);
projectManager.addSubscriber(completedProjects);

const projectDragManager = new ProjectDragManager(projectManager);

activeProjects.addSubscriber(projectDragManager);
completedProjects.addSubscriber(projectDragManager);

projectForm.addSubscriber(projectManager);
