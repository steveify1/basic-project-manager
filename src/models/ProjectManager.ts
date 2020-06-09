/// <reference path="Project.ts" />

namespace App {
  /**
   * Manages all in-project operations
   */
  export class ProjectManager implements ISubscriber, IObserver {
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
}
