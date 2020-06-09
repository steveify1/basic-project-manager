import TemplateExtractor from '../utils/TemplateExtractor.js';
import ProjectList from '../abstracts/ProjectList.js';
import Project from './Project.js';
import ProjectTemplate from './ProjectTemplate.js';

/**
 * Creates and manages a list of completed projects
 */
export default class CompletedProjects extends ProjectList {
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
