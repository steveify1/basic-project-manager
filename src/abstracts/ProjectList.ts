import {
  IObserver,
  ISubscriber,
} from '../interfaces/observerSubscriberInterface.js';
import { DragTarget } from '../interfaces/dragAndDropInterface.js';
import Project from '../models/Project.js';
import ProjectTemplate from '../models/ProjectTemplate.js';
import TemplateExtractor from '../utils/TemplateExtractor.js';
import autobind from '../decorators/autobind.js';

/**
 * An abstract class used creates a project list
 */
export default abstract class ProjectList
  implements ISubscriber, IObserver, DragTarget {
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
