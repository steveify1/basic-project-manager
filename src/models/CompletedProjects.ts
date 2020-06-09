namespace App {
  /**
   * Creates and manages a list of completed projects
   */
  export class CompletedProjects extends ProjectList {
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
}
