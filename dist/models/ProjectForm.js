import FormProcessor from '../abstracts/FormProcessor.js';
/**
 * @class ProjectForm
 */
export default class ProjectForm extends FormProcessor {
    constructor(templateExtractor) {
        super();
        this.templateExtractor = templateExtractor;
        this.subscribers = [];
        this.form = this.templateExtractor.templateContentElement;
        this.setFormSubmitEventHandler();
        this.templateExtractor.fillTarget('afterbegin');
        this.title = document.querySelector('input#title');
        this.description = document.querySelector('textarea#description');
        this.people = document.querySelector('input#people');
        // Define Validation for all the fields
        this.defineValidation();
    }
    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }
    broadcast() {
        const project = {
            title: this.title.value,
            description: this.description.value,
            people: +this.people.value,
        };
        this.subscribers.forEach((subscriber) => {
            subscriber.recieveBroadcast(project);
        });
    }
    defineValidation() {
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
    }
    handleSubmit(event) {
        this.inputSchemas.forEach((schema) => {
            const errorObj = this.inputErrors.find((inputError) => {
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
    }
}
//# sourceMappingURL=ProjectForm.js.map