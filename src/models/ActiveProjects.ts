namespace App {
  /**
   * Creates and manages a list of active projects
   */
  export class ActiveProjects extends ProjectList {
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
}
