/**
 * @fileoverview The entry file of the `Project` app
 */
import TemplateExtractor from './utils/TemplateExtractor.js';
import ProjectForm from './models/ProjectForm.js';
import ActiveProjects from './models/ActiveProjects.js';
import CompletedProjects from './models/CompletedProjects.js';
import ProjectDragManager from './models/ProjectDragManager.js';
import Project from './models/Project.js';
import ProjectManager from './models/ProjectManager.js';
import ProjectTemplate from './models/ProjectTemplate.js';
// ***********************************************
// ***********************************************
// **************** APP EXECUTION ****************
// ***********************************************
// ***********************************************
// TEMPLATE EXTRACTORS
const projectFormTemplateExtractor = new TemplateExtractor('project-form', 'app');
const projectListTemplateExtractor1 = new TemplateExtractor('project-list', 'app');
const projectListTemplateExtractor2 = new TemplateExtractor('project-list', 'app');
const projectForm = new ProjectForm(projectFormTemplateExtractor);
const activeProjects = new ActiveProjects(projectListTemplateExtractor1);
const completedProjects = new CompletedProjects(projectListTemplateExtractor2);
const projectManager = new ProjectManager(Project, ProjectTemplate);
projectManager.addSubscriber(activeProjects);
projectManager.addSubscriber(completedProjects);
const projectDragManager = new ProjectDragManager(projectManager);
activeProjects.addSubscriber(projectDragManager);
completedProjects.addSubscriber(projectDragManager);
projectForm.addSubscriber(projectManager);
//# sourceMappingURL=app.js.map