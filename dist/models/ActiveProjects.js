import ProjectList from '../abstracts/ProjectList.js';
/**
 * Creates and manages a list of active projects
 */
export default class ActiveProjects extends ProjectList {
    constructor(templateExtractor) {
        super(templateExtractor, 'active');
    }
    move(project, projectTemplates) {
        // console.log(this.type + ' list recieved new ' + project.state + ' project');
        if (project.state === 'active') {
            this.add(project, projectTemplates);
        }
        else if (project.state === 'completed') {
            this.remove(project, projectTemplates);
        }
    }
}
//# sourceMappingURL=ActiveProjects.js.map