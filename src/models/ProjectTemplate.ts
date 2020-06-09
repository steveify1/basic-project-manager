namespace App {
  /**
   * Creates a new project template
   */
  export class ProjectTemplate implements Draggable {
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
}
