var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import autobind from '../decorators/autobind.js';
/**
 * An abstract class used creates a project list
 */
export default class ProjectList {
    constructor(templateExtractor, type) {
        this.templateExtractor = templateExtractor;
        this.type = type;
        this.project = null;
        // projects: Project[] = [];
        this.subscribers = [];
        this.projectTemplates = [];
        this.container = this.templateExtractor.templateContentElement;
        this.container.className = `project-list`;
        this.container.id = `${type}-project-list`;
        const h2 = this.container.querySelector('h2');
        h2.innerHTML = `${this.type} projects`.toUpperCase();
        this.templateExtractor.fillTarget('beforeend');
        this.configureDroppable(this.getContainerFromDOM());
    }
    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }
    broadcast(projectId, type) {
        this.subscribers.forEach((subscriber) => {
            subscriber.recieveBroadcast(projectId, type);
        });
    }
    getContainerFromDOM() {
        return document.getElementById(`${this.type}-project-list`);
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const containerInDOM = this.getContainerFromDOM();
            containerInDOM.classList.add('droppable');
        }
    }
    dragLeaveHandler(event) {
        const containerInDOM = this.getContainerFromDOM();
        containerInDOM.classList.remove('droppable');
    }
    dropHandler(event) {
        const id = event.dataTransfer.getData('text/plain');
        this.broadcast(id, this.type);
    }
    activateListeners() {
        this.projectTemplates.forEach((projectTemplate) => {
            projectTemplate.activateEventListeners();
        });
    }
    configureDroppable(containerInDOM) {
        containerInDOM.addEventListener('dragover', this.dragOverHandler);
        containerInDOM.addEventListener('dragleave', this.dragLeaveHandler);
        containerInDOM.addEventListener('drop', this.dropHandler);
    }
    /**
     * Curates the project list if `projects` is not empty
     */
    curateList() {
        const ul = this.container.querySelector('ul');
        ul.innerHTML = '';
        if (this.projectTemplates.length) {
            const template = document.createElement('span');
            this.projectTemplates.forEach((projectTemplate, index) => {
                template.appendChild(projectTemplate.getTemplate());
            });
            ul.innerHTML = template.innerHTML;
            this.activateListeners();
        }
    }
    /**
     * Adds a project to the project list
     * @param { Project } project - A `Project` instance
     */
    add(project, projectTemplate) {
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
    delete(project, projectTemplate) {
        if (project.state === this.type) {
            this.remove(project, projectTemplate);
        }
    }
    remove(project, projectTemplate) {
        // this.projects = this.projects.filter((currentProject) => {
        //   return currentProject.id !== project.id;
        // });
        this.projectTemplates = this.projectTemplates.filter((currentProjectTemplate) => currentProjectTemplate.getTemplate().id !==
            projectTemplate.getTemplate().id);
    }
    /**
     * Recieves a message from the `Project` instance to create a new project,
     * move a project or delete it.
     */
    recieveBroadcast(project, action, projectTemplate) {
        const initialProjectCount = this.projectTemplates.length;
        if (action === 'new') {
            this.add(project, projectTemplate);
        }
        else if (action === 'move') {
            this.move(project, projectTemplate);
        }
        else if (action === 'delete') {
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
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "recieveBroadcast", null);
//# sourceMappingURL=ProjectList.js.map