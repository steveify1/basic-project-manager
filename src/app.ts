/**
 * @fileoverview The entry file of the `Project` app
 */
/// <reference path="./interfaces/dragAndDropInterface.ts" />
/// <reference path="./interfaces/projectInterface.ts" />
/// <reference path="./interfaces/observerSubscriberInterface.ts" />
/// <reference path="./interfaces/hasValueInterface.ts" />
/// <reference path="./interfaces/creatorInterface.ts" />
/// <reference path="./interfaces/formValidatorInterface.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./utils/TemplateExtractor.ts" />
/// <reference path="./utils/FormValidator.ts" />
/// <reference path="./abstracts/FormProcessor.ts" />
/// <reference path="./models/ProjectManager.ts" />
/// <reference path="./models/Project.ts" />
/// <reference path="./models/ProjectTemplate.ts" />
/// <reference path="./abstracts/ProjectList.ts" />
/// <reference path="./models/ActiveProjects.ts" />
/// <reference path="./models/CompletedProjects.ts" />
/// <reference path="./models/ProjectDragManager.ts" />
/// <reference path="./models/ProjectForm.ts" />

namespace App {
  // ***********************************************
  // ***********************************************
  // **************** APP EXECUTION ****************
  // ***********************************************
  // ***********************************************
  // TEMPLATE EXTRACTORS
  const projectFormTemplateExtractor = new TemplateExtractor<HTMLFormElement>(
    'project-form',
    'app'
  );
  const projectListTemplateExtractor1 = new TemplateExtractor<HTMLDivElement>(
    'project-list',
    'app'
  );
  const projectListTemplateExtractor2 = new TemplateExtractor<HTMLDivElement>(
    'project-list',
    'app'
  );

  const projectForm: ProjectForm = new ProjectForm(
    projectFormTemplateExtractor
  );

  const activeProjects: ProjectList = new ActiveProjects(
    projectListTemplateExtractor1
  );
  const completedProjects: ProjectList = new CompletedProjects(
    projectListTemplateExtractor2
  );

  const projectManager: ProjectManager = new ProjectManager(
    Project,
    ProjectTemplate
  );
  projectManager.addSubscriber(activeProjects);
  projectManager.addSubscriber(completedProjects);

  const projectDragManager = new ProjectDragManager(projectManager);

  activeProjects.addSubscriber(projectDragManager);
  completedProjects.addSubscriber(projectDragManager);

  projectForm.addSubscriber(projectManager);
}
