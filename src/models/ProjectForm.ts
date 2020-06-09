namespace App {
  /**
   * @class ProjectForm
   */
  export class ProjectForm extends FormProcessor implements IObserver {
    subscribers: ISubscriber[] = [];
    form: HTMLFormElement;
    title: HTMLInputElement;
    description: HTMLInputElement;
    people: HTMLInputElement;

    constructor(private templateExtractor: TemplateExtractor<HTMLFormElement>) {
      super();

      this.form = this.templateExtractor.templateContentElement;
      this.setFormSubmitEventHandler();

      this.templateExtractor.fillTarget('afterbegin');

      this.title = document.querySelector('input#title')! as HTMLInputElement;
      this.description = document.querySelector(
        'textarea#description'
      )! as HTMLInputElement;
      this.people = document.querySelector('input#people')! as HTMLInputElement;

      // Define Validation for all the fields
      this.defineValidation();
    }

    addSubscriber(subscriber: ISubscriber): void {
      this.subscribers.push(subscriber);
    }

    broadcast(): void {
      const project: IProject = {
        title: this.title.value,
        description: this.description.value,
        people: +this.people.value,
      };

      this.subscribers.forEach((subscriber) => {
        subscriber.recieveBroadcast(project);
      });
    }

    defineValidation(): void {
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

    handleSubmit(event: Event) {
      this.inputSchemas.forEach((schema) => {
        const errorObj = this.inputErrors.find((inputError) => {
          return (inputError as InputError).field === schema.inputField;
        }) as InputError;

        schema.inputField.nextElementSibling!.textContent = errorObj
          ? errorObj.errors[0]
          : '';
      });

      if (this.inputErrors.length === 0) {
        this.broadcast();
        this.form.reset();
      }
    }
  }
}
