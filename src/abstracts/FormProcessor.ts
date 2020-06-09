import autobind from '../decorators/autobind.js';
import FormValidator from '../utils/FormValidator.js';

/**
 * A custom form processor that implements it's custom
 * validation and submission.
 */
export default abstract class FormProcessor extends FormValidator {
  protected abstract form: HTMLFormElement;
  constructor() {
    super('id');
  }

  /**
   * Attaches an event handler to the form's submit event
   */
  protected setFormSubmitEventHandler(): void {
    this.form.addEventListener('submit', this.beginSubmit);
  }

  /**
   * Handles the form submisison. It is an async method.
   * The inheriting class is expected to implement this method.
   * @param { Event } event - The submit event on the form
   */
  abstract handleSubmit(event: Event): unknown | Promise<unknown>;

  /**
   * Starts the form submisison. It is an async method.
   * @param { Event } event - The submit event on the form
   */
  @autobind
  private beginSubmit(event: Event): void {
    event.preventDefault();
    this.validateAll();
    this.handleSubmit(event);
  }
}
