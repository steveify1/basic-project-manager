var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import autobind from '../decorators/autobind.js';
/**
 * Creates a new project template
 */
export default class ProjectTemplate {
    constructor(project) {
        this.project = project;
        this.events = [];
        this.stateButton = document.createElement('button');
        this.deleteButton = document.createElement('button');
    }
    dragStartHandler(event) {
        var _a;
        const { dataTransfer } = event;
        dataTransfer.setData('text/plain', (_a = this.project) === null || _a === void 0 ? void 0 : _a.id);
        dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) {
        console.log('Dragging Done');
    }
    configureDraggable() {
        const projectTemplateInDOM = document.getElementById(this.project.id);
        projectTemplateInDOM.addEventListener('dragstart', this.dragStartHandler);
        projectTemplateInDOM.addEventListener('dragend', this.dragEndHandler);
    }
    static create(project) {
        return new ProjectTemplate(project);
    }
    on(eventType, callback) {
        this.events.push([eventType, callback]);
    }
    getEventCallback(eventType) {
        const e = this.events.filter((event) => event[0] === eventType)[0];
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
        this.stateButton.innerHTML = `mark as ${this.project.state === 'active' ? 'completed' : 'active'}`;
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
        const stateBtnInDONM = document.querySelector(`button#state-${this.project.id}`);
        stateBtnInDONM.addEventListener('click', this.handleStateChange);
        const deleteBtnInDONM = document.querySelector(`button#delete-${this.project.id}`);
        deleteBtnInDONM.addEventListener('click', this.handleDelete);
        this.configureDraggable();
    }
    handleDelete(event) {
        const deleteCallback = this.getEventCallback('delete');
        if (deleteCallback) {
            deleteCallback(this.project);
        }
    }
    handleStateChange(event) {
        const stateChangeCallback = this.getEventCallback('state-change');
        if (stateChangeCallback) {
            stateChangeCallback(this.project);
        }
    }
}
__decorate([
    autobind
], ProjectTemplate.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectTemplate.prototype, "dragEndHandler", null);
__decorate([
    autobind
], ProjectTemplate.prototype, "handleDelete", null);
__decorate([
    autobind
], ProjectTemplate.prototype, "handleStateChange", null);
//# sourceMappingURL=ProjectTemplate.js.map