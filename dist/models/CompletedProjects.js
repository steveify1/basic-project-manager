import ProjectList from '../abstracts/ProjectList.js';
/**
 * Creates and manages a list of completed projects
 */
export default class CompletedProjects extends ProjectList {
    constructor(templateExtractor) {
        super(templateExtractor, 'completed');
    }
    move(project, projectTemplates) {
        // console.log(this.type + ' list recieved new ' + project.state + ' project');
        if (project.state === 'active') {
            this.remove(project, projectTemplates);
        }
        else if (project.state === 'completed') {
            this.add(project, projectTemplates);
        }
    }
}
//# sourceMappingURL=CompletedProjects.js.map