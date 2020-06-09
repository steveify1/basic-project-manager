"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    /**
     * A decorator function that automatically binds a method to
     * it's class instance.
     */
    App.autobind = function (_, _2, descriptor) {
        return {
            configurable: true,
            get: function () {
                return descriptor.value.bind(this);
            },
        };
    };
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Extracts the content of template elememt which later gets added
     * to the DOM.
     * @class TemplateExtractor
     * @property
     */
    var TemplateExtractor = /** @class */ (function () {
        function TemplateExtractor(templateElementId, targetElementId) {
            this.targetElementId = targetElementId;
            this.templateElement = document.getElementById("" + templateElementId);
            this.targetElement = document.getElementById("" + targetElementId);
            var importedNode = document.importNode(this.templateElement.content, true);
            this.templateContentElement = importedNode.firstElementChild;
        }
        TemplateExtractor.prototype.fillTarget = function (position) {
            this.targetElement.insertAdjacentElement(position, this.templateContentElement);
        };
        return TemplateExtractor;
    }());
    App.TemplateExtractor = TemplateExtractor;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Form input validator
     * @property accessor - A html attribute that will be used to
     * access each input element in the form
     */
    var FormValidator = /** @class */ (function () {
        function FormValidator(accessor) {
            this.accessor = accessor;
            this.inputSchemas = [];
            this.inputErrors = [];
        }
        /**
         * adds validatiion to each input
         */
        FormValidator.prototype.addValidation = function (inputField, schemaDescription) {
            var accessor = schemaDescription.accessor || this.accessor;
            this.inputSchemas.push(__assign(__assign({}, schemaDescription), { accessor: accessor,
                inputField: inputField, value: schemaDescription.value || inputField.value }));
            return this;
        };
        FormValidator.prototype.checkRequired = function (schema, inputError) {
            var message = '';
            if (schema.inputField.value.length === 0) {
                message = inputError.name + " is required.";
                inputError.errors.push(message);
            }
        };
        FormValidator.prototype.checkType = function (schema, inputError) {
            var message = '';
            var schemaValue = schema.type === 'number' ? +schema.value : schema.value;
            if (schema.inputField.value.length &&
                typeof schemaValue !== schema.type) {
                message = inputError.name + " is required.";
                inputError.errors.push(message);
            }
        };
        /**
         * Validates each input field
         */
        FormValidator.prototype.runValidation = function (schema) {
            var field = schema.inputField; // We're sure the accessor will be set
            var name = schema.alias;
            var errors = [];
            var inputError = { field: field, errors: errors, name: name };
            if (schema.required) {
                this.checkRequired(schema, inputError);
            }
            if (schema.type) {
                this.checkType(schema, inputError);
            }
            // if (schema.)
            if (inputError.errors.length) {
                this.inputErrors.push(inputError);
            }
        };
        /**
         *  runs validation on the object
         */
        FormValidator.prototype.validateAll = function () {
            var _this = this;
            this.inputErrors = [];
            this.inputSchemas.forEach(function (schema) {
                _this.runValidation(schema);
            });
        };
        return FormValidator;
    }());
    App.FormValidator = FormValidator;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * A custom form processor that implements it's custom
     * validation and submission.
     */
    var FormProcessor = /** @class */ (function (_super) {
        __extends(FormProcessor, _super);
        function FormProcessor() {
            return _super.call(this, 'id') || this;
        }
        /**
         * Attaches an event handler to the form's submit event
         */
        FormProcessor.prototype.setFormSubmitEventHandler = function () {
            this.form.addEventListener('submit', this.beginSubmit);
        };
        /**
         * Starts the form submisison. It is an async method.
         * @param { Event } event - The submit event on the form
         */
        FormProcessor.prototype.beginSubmit = function (event) {
            event.preventDefault();
            this.validateAll();
            this.handleSubmit(event);
        };
        __decorate([
            App.autobind
        ], FormProcessor.prototype, "beginSubmit", null);
        return FormProcessor;
    }(App.FormValidator));
    App.FormProcessor = FormProcessor;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Creates a new project with empty data
     */
    var Project = /** @class */ (function () {
        function Project(_title, _description, _people) {
            this._title = _title;
            this._description = _description;
            this._people = _people;
            this._state = 'active';
            this._id = "" + Date.now().toString();
        }
        /**
         * A static method that creates and returns a new `Project` instance
         */
        Project.create = function (title, description, people) {
            return new Project(title, description, people);
        };
        Object.defineProperty(Project.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "title", {
            get: function () {
                return this._title;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "description", {
            get: function () {
                return this._description;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "people", {
            get: function () {
                return this._people;
            },
            set: function (n) {
                this.people = n;
            },
            enumerable: true,
            configurable: true
        });
        Project.prototype.markAsComplete = function () {
            this._state = 'completed';
        };
        Project.prototype.markAsActive = function () {
            this._state = 'active';
        };
        return Project;
    }());
    App.Project = Project;
})(App || (App = {}));
/// <reference path="Project.ts" />
var App;
(function (App) {
    /**
     * Manages all in-project operations
     */
    var ProjectManager = /** @class */ (function () {
        function ProjectManager(projectCreator, projectTemplateCreator) {
            this.projectCreator = projectCreator;
            this.projectTemplateCreator = projectTemplateCreator;
            this.subscribers = [];
            this.projects = [];
        }
        ProjectManager.prototype.addSubscriber = function (subscriber) {
            this.subscribers.push(subscriber);
        };
        ProjectManager.prototype.broadcast = function (project, action, projectTemplate) {
            this.subscribers.forEach(function (subscriber) {
                subscriber.recieveBroadcast(project, action, projectTemplate);
            });
        };
        /**
         * Creates a new project instance and return same.
         * @param { IProject } fields form fields broadcasted from the ProjectForm observer
         * @returns { Project } a Project object.
         */
        ProjectManager.prototype.createProject = function (fields) {
            return this.projectCreator.create(fields.title, fields.description, fields.people);
        };
        /**
         * Updates a projecs state
         */
        ProjectManager.prototype.updateProjectState = function (projectId, newState) {
            var project = this.projects.find(function (project) { return Number(project.id) === Number(projectId); });
            if (project.state === newState) {
                return;
            }
            if (newState === 'active') {
                project.markAsActive();
            }
            else if (newState === 'completed') {
                project.markAsComplete();
            }
            var projectTemplate = this.setupProjectTemplate(project);
            this.broadcast(project, 'move', projectTemplate);
        };
        /**
         * Creates and adds event listeners on a project Template
         */
        ProjectManager.prototype.setupProjectTemplate = function (project) {
            var _this = this;
            var projectTemplate = this.projectTemplateCreator.create(project);
            projectTemplate.on('state-change', function (project) {
                if (project.state === 'active') {
                    project.markAsComplete();
                }
                else {
                    project.markAsActive();
                }
                // console.log(`State changed from  ${oldState} to ${project.state}`);
                _this.broadcast(project, 'move', projectTemplate);
            });
            projectTemplate.on('delete', function (project) {
                // console.log(`Deleting ` + project);
                _this.broadcast(project, 'delete', projectTemplate);
            });
            return projectTemplate;
        };
        /**
         * Recieves fields from project form and proceeds to call the `createProject` method.
         */
        ProjectManager.prototype.recieveBroadcast = function (fields) {
            var project = this.createProject(fields);
            var projectTemplate = this.setupProjectTemplate(project);
            this.projects.push(project);
            this.broadcast(project, 'new', projectTemplate);
        };
        __decorate([
            App.autobind
        ], ProjectManager.prototype, "recieveBroadcast", null);
        return ProjectManager;
    }());
    App.ProjectManager = ProjectManager;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Creates a new project template
     */
    var ProjectTemplate = /** @class */ (function () {
        function ProjectTemplate(project) {
            this.project = project;
            this.events = [];
            this.stateButton = document.createElement('button');
            this.deleteButton = document.createElement('button');
        }
        ProjectTemplate.prototype.dragStartHandler = function (event) {
            var _a;
            var dataTransfer = event.dataTransfer;
            dataTransfer.setData('text/plain', (_a = this.project) === null || _a === void 0 ? void 0 : _a.id);
            dataTransfer.effectAllowed = 'move';
        };
        ProjectTemplate.prototype.dragEndHandler = function (_) {
            console.log('Dragging Done');
        };
        ProjectTemplate.prototype.configureDraggable = function () {
            var projectTemplateInDOM = document.getElementById(this.project.id);
            projectTemplateInDOM.addEventListener('dragstart', this.dragStartHandler);
            projectTemplateInDOM.addEventListener('dragend', this.dragEndHandler);
        };
        ProjectTemplate.create = function (project) {
            return new ProjectTemplate(project);
        };
        ProjectTemplate.prototype.on = function (eventType, callback) {
            this.events.push([eventType, callback]);
        };
        ProjectTemplate.prototype.getEventCallback = function (eventType) {
            var e = this.events.filter(function (event) { return event[0] === eventType; })[0];
            return e[1];
        };
        ProjectTemplate.prototype.getTemplate = function () {
            var li = document.createElement('li');
            li.id = this.project.id;
            li.className = "project " + this.project.state;
            li.draggable = true;
            // Project body
            var body = document.createElement('div');
            body.className = 'project-body';
            var h2 = document.createElement('h2');
            h2.className = 'project-title';
            h2.innerHTML = this.project.title;
            var p1 = document.createElement('p');
            p1.className = 'project-desc';
            p1.innerHTML = this.project.description;
            var p2 = document.createElement('p');
            p2.className = 'project-people';
            p2.innerHTML = "Participants: " + this.project.people;
            body.appendChild(p1);
            body.appendChild(p2);
            // Buttons
            // const stateButton = document.createElement('button');
            this.stateButton.className = 'state-btn btn';
            this.stateButton.id = "state-" + this.project.id;
            this.stateButton.innerHTML = "mark as " + (this.project.state === 'active' ? 'completed' : 'active');
            // const deleteButton = document.createElement('button');
            this.deleteButton.id = "delete-" + this.project.id;
            this.deleteButton.className = 'delete-btn btn';
            this.deleteButton.innerHTML = 'delete';
            var buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';
            buttonGroup.appendChild(this.deleteButton);
            buttonGroup.appendChild(this.stateButton);
            li.appendChild(h2);
            li.appendChild(body);
            li.appendChild(buttonGroup);
            return li;
        };
        ProjectTemplate.prototype.activateEventListeners = function () {
            var stateBtnInDONM = document.querySelector("button#state-" + this.project.id);
            stateBtnInDONM.addEventListener('click', this.handleStateChange);
            var deleteBtnInDONM = document.querySelector("button#delete-" + this.project.id);
            deleteBtnInDONM.addEventListener('click', this.handleDelete);
            this.configureDraggable();
        };
        ProjectTemplate.prototype.handleDelete = function (event) {
            var deleteCallback = this.getEventCallback('delete');
            if (deleteCallback) {
                deleteCallback(this.project);
            }
        };
        ProjectTemplate.prototype.handleStateChange = function (event) {
            var stateChangeCallback = this.getEventCallback('state-change');
            if (stateChangeCallback) {
                stateChangeCallback(this.project);
            }
        };
        __decorate([
            App.autobind
        ], ProjectTemplate.prototype, "dragStartHandler", null);
        __decorate([
            App.autobind
        ], ProjectTemplate.prototype, "dragEndHandler", null);
        __decorate([
            App.autobind
        ], ProjectTemplate.prototype, "handleDelete", null);
        __decorate([
            App.autobind
        ], ProjectTemplate.prototype, "handleStateChange", null);
        return ProjectTemplate;
    }());
    App.ProjectTemplate = ProjectTemplate;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * An abstract class used creates a project list
     */
    var ProjectList = /** @class */ (function () {
        function ProjectList(templateExtractor, type) {
            this.templateExtractor = templateExtractor;
            this.type = type;
            this.project = null;
            // projects: Project[] = [];
            this.subscribers = [];
            this.projectTemplates = [];
            this.container = this.templateExtractor.templateContentElement;
            this.container.className = "project-list";
            this.container.id = type + "-project-list";
            var h2 = this.container.querySelector('h2');
            h2.innerHTML = (this.type + " projects").toUpperCase();
            this.templateExtractor.fillTarget('beforeend');
            this.configureDroppable(this.getContainerFromDOM());
        }
        ProjectList.prototype.addSubscriber = function (subscriber) {
            this.subscribers.push(subscriber);
        };
        ProjectList.prototype.broadcast = function (projectId, type) {
            this.subscribers.forEach(function (subscriber) {
                subscriber.recieveBroadcast(projectId, type);
            });
        };
        ProjectList.prototype.getContainerFromDOM = function () {
            return document.getElementById(this.type + "-project-list");
        };
        ProjectList.prototype.dragOverHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                var containerInDOM = this.getContainerFromDOM();
                containerInDOM.classList.add('droppable');
            }
        };
        ProjectList.prototype.dragLeaveHandler = function (event) {
            var containerInDOM = this.getContainerFromDOM();
            containerInDOM.classList.remove('droppable');
        };
        ProjectList.prototype.dropHandler = function (event) {
            var id = event.dataTransfer.getData('text/plain');
            this.broadcast(id, this.type);
        };
        ProjectList.prototype.activateListeners = function () {
            this.projectTemplates.forEach(function (projectTemplate) {
                projectTemplate.activateEventListeners();
            });
        };
        ProjectList.prototype.configureDroppable = function (containerInDOM) {
            containerInDOM.addEventListener('dragover', this.dragOverHandler);
            containerInDOM.addEventListener('dragleave', this.dragLeaveHandler);
            containerInDOM.addEventListener('drop', this.dropHandler);
        };
        /**
         * Curates the project list if `projects` is not empty
         */
        ProjectList.prototype.curateList = function () {
            var ul = this.container.querySelector('ul');
            ul.innerHTML = '';
            if (this.projectTemplates.length) {
                var template_1 = document.createElement('span');
                this.projectTemplates.forEach(function (projectTemplate, index) {
                    template_1.appendChild(projectTemplate.getTemplate());
                });
                ul.innerHTML = template_1.innerHTML;
                this.activateListeners();
            }
        };
        /**
         * Adds a project to the project list
         * @param { Project } project - A `Project` instance
         */
        ProjectList.prototype.add = function (project, projectTemplate) {
            if (project.state === this.type) {
                this.project = project;
                // this.projects.push(project);
                this.projectTemplates.push(projectTemplate);
            }
        };
        /**
         * Removes a project from the current project list
         * @param { Project } project - A `Project` instance
         */
        ProjectList.prototype.delete = function (project, projectTemplate) {
            if (project.state === this.type) {
                this.remove(project, projectTemplate);
            }
        };
        ProjectList.prototype.remove = function (project, projectTemplate) {
            // this.projects = this.projects.filter((currentProject) => {
            //   return currentProject.id !== project.id;
            // });
            this.projectTemplates = this.projectTemplates.filter(function (currentProjectTemplate) {
                return currentProjectTemplate.getTemplate().id !==
                    projectTemplate.getTemplate().id;
            });
        };
        /**
         * Recieves a message from the `Project` instance to create a new project,
         * move a project or delete it.
         */
        ProjectList.prototype.recieveBroadcast = function (project, action, projectTemplate) {
            var initialProjectCount = this.projectTemplates.length;
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
        };
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dragOverHandler", null);
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dragLeaveHandler", null);
        __decorate([
            App.autobind
        ], ProjectList.prototype, "dropHandler", null);
        __decorate([
            App.autobind
        ], ProjectList.prototype, "recieveBroadcast", null);
        return ProjectList;
    }());
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Creates and manages a list of active projects
     */
    var ActiveProjects = /** @class */ (function (_super) {
        __extends(ActiveProjects, _super);
        function ActiveProjects(templateExtractor) {
            return _super.call(this, templateExtractor, 'active') || this;
        }
        ActiveProjects.prototype.move = function (project, projectTemplates) {
            // console.log(this.type + ' list recieved new ' + project.state + ' project');
            if (project.state === 'active') {
                this.add(project, projectTemplates);
            }
            else if (project.state === 'completed') {
                this.remove(project, projectTemplates);
            }
        };
        return ActiveProjects;
    }(App.ProjectList));
    App.ActiveProjects = ActiveProjects;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * Creates and manages a list of completed projects
     */
    var CompletedProjects = /** @class */ (function (_super) {
        __extends(CompletedProjects, _super);
        function CompletedProjects(templateExtractor) {
            return _super.call(this, templateExtractor, 'completed') || this;
        }
        CompletedProjects.prototype.move = function (project, projectTemplates) {
            // console.log(this.type + ' list recieved new ' + project.state + ' project');
            if (project.state === 'active') {
                this.remove(project, projectTemplates);
            }
            else if (project.state === 'completed') {
                this.add(project, projectTemplates);
            }
        };
        return CompletedProjects;
    }(App.ProjectList));
    App.CompletedProjects = CompletedProjects;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * A sunscriber that manages the projects after a drag and drop
     */
    var ProjectDragManager = /** @class */ (function () {
        function ProjectDragManager(projectManager) {
            this.projectManager = projectManager;
        }
        ProjectDragManager.prototype.recieveBroadcast = function (id, newState) {
            this.projectManager.updateProjectState(id, newState);
        };
        return ProjectDragManager;
    }());
    App.ProjectDragManager = ProjectDragManager;
})(App || (App = {}));
var App;
(function (App) {
    /**
     * @class ProjectForm
     */
    var ProjectForm = /** @class */ (function (_super) {
        __extends(ProjectForm, _super);
        function ProjectForm(templateExtractor) {
            var _this = _super.call(this) || this;
            _this.templateExtractor = templateExtractor;
            _this.subscribers = [];
            _this.form = _this.templateExtractor.templateContentElement;
            _this.setFormSubmitEventHandler();
            _this.templateExtractor.fillTarget('afterbegin');
            _this.title = document.querySelector('input#title');
            _this.description = document.querySelector('textarea#description');
            _this.people = document.querySelector('input#people');
            // Define Validation for all the fields
            _this.defineValidation();
            return _this;
        }
        ProjectForm.prototype.addSubscriber = function (subscriber) {
            this.subscribers.push(subscriber);
        };
        ProjectForm.prototype.broadcast = function () {
            var project = {
                title: this.title.value,
                description: this.description.value,
                people: +this.people.value,
            };
            this.subscribers.forEach(function (subscriber) {
                subscriber.recieveBroadcast(project);
            });
        };
        ProjectForm.prototype.defineValidation = function () {
            this.addValidation(this.title, {
                type: 'string',
                required: true,
                alias: 'title',
            });
            this.addValidation(this.description, {
                type: 'string',
                required: true,
                alias: 'description',
            });
            this.addValidation(this.people, {
                type: 'number',
                required: true,
                alias: 'people',
            });
        };
        ProjectForm.prototype.handleSubmit = function (event) {
            var _this = this;
            this.inputSchemas.forEach(function (schema) {
                var errorObj = _this.inputErrors.find(function (inputError) {
                    return inputError.field === schema.inputField;
                });
                schema.inputField.nextElementSibling.textContent = errorObj
                    ? errorObj.errors[0]
                    : '';
            });
            if (this.inputErrors.length === 0) {
                this.broadcast();
                this.form.reset();
            }
        };
        return ProjectForm;
    }(App.FormProcessor));
    App.ProjectForm = ProjectForm;
})(App || (App = {}));
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
var App;
(function (App) {
    // ***********************************************
    // ***********************************************
    // **************** APP EXECUTION ****************
    // ***********************************************
    // ***********************************************
    // TEMPLATE EXTRACTORS
    var projectFormTemplateExtractor = new App.TemplateExtractor('project-form', 'app');
    var projectListTemplateExtractor1 = new App.TemplateExtractor('project-list', 'app');
    var projectListTemplateExtractor2 = new App.TemplateExtractor('project-list', 'app');
    var projectForm = new App.ProjectForm(projectFormTemplateExtractor);
    var activeProjects = new App.ActiveProjects(projectListTemplateExtractor1);
    var completedProjects = new App.CompletedProjects(projectListTemplateExtractor2);
    var projectManager = new App.ProjectManager(App.Project, App.ProjectTemplate);
    projectManager.addSubscriber(activeProjects);
    projectManager.addSubscriber(completedProjects);
    var projectDragManager = new App.ProjectDragManager(projectManager);
    activeProjects.addSubscriber(projectDragManager);
    completedProjects.addSubscriber(projectDragManager);
    projectForm.addSubscriber(projectManager);
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map