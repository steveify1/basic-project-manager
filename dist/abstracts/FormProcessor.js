var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import autobind from '../decorators/autobind.js';
import FormValidator from '../utils/FormValidator.js';
/**
 * A custom form processor that implements it's custom
 * validation and submission.
 */
export default class FormProcessor extends FormValidator {
    constructor() {
        super('id');
    }
    /**
     * Attaches an event handler to the form's submit event
     */
    setFormSubmitEventHandler() {
        this.form.addEventListener('submit', this.beginSubmit);
    }
    /**
     * Starts the form submisison. It is an async method.
     * @param { Event } event - The submit event on the form
     */
    beginSubmit(event) {
        event.preventDefault();
        this.validateAll();
        this.handleSubmit(event);
    }
}
__decorate([
    autobind
], FormProcessor.prototype, "beginSubmit", null);
//# sourceMappingURL=FormProcessor.js.map