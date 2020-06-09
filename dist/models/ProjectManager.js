var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import autobind from '../decorators/autobind.js';
/**
 * Manages all in-project operations
 */
export default class ProjectManager {
    constructor(projectCreator, projectTemplateCreator) {
        this.projectCreator = projectCreator;
        this.projectTemplateCreator = projectTemplateCreator;
        this.subscribers = [];
        this.projects = [];
    }
    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }
    broadcast(project, action, projectTemplate) {
        this.subscribers.forEach((subscriber) => {
            subscriber.recieveBroadcast(project, action, projectTemplate);
        });
    }
    /**
     * Creates a new project instance and return same.
     * @param { IProject } fields form fields broadcasted from the ProjectForm observer
     * @returns { Project } a Project object.
     */
    createProject(fields) {
        return this.projectCreator.create(fields.title, fields.description, fields.people);
    }
    /**
     * Updates a projecs state
     */
    updateProjectState(projectId, newState) {
        const project = this.projects.find((project) => Number(project.id) === Number(projectId));
        if (project.state === newState) {
            return;
        }
        if (newState === 'active') {
            project.markAsActive();
        }
        else if (newState === 'completed') {
            project.markAsComplete();
        }
        const projectTemplate = this.setupProjectTemplate(project);
        this.broadcast(project, 'move', projectTemplate);
    }
    /**
     * Creates and adds event listeners on a project Template
     */
    setupProjectTemplate(project) {
        const projectTemplate = this.projectTemplateCreator.create(project);
        projectTemplate.on('state-change', (project) => {
            if (project.state === 'active') {
                project.markAsComplete();
            }
            else {
                project.markAsActive();
            }
            // console.log(`State changed from  ${oldState} to ${project.state}`);
            this.broadcast(project, 'move', projectTemplate);
        });
        projectTemplate.on('delete', (project) => {
            // console.log(`Deleting ` + project);
            this.broadcast(project, 'delete', projectTemplate);
        });
        return projectTemplate;
    }
    /**
     * Recieves fields from project form and proceeds to call the `createProject` method.
     */
    recieveBroadcast(fields) {
        const project = this.createProject(fields);
        const projectTemplate = this.setupProjectTemplate(project);
        this.projects.push(project);
        this.broadcast(project, 'new', projectTemplate);
    }
}
__decorate([
    autobind
], ProjectManager.prototype, "recieveBroadcast", null);
//# sourceMappingURL=ProjectManager.js.map