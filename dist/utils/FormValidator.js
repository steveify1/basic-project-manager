/**
 * Form input validator
 * @property accessor - A html attribute that will be used to
 * access each input element in the form
 */
export default class FormValidator {
    constructor(accessor) {
        this.accessor = accessor;
        this.inputSchemas = [];
        this.inputErrors = [];
    }
    /**
     * adds validatiion to each input
     */
    addValidation(inputField, schemaDescription) {
        const accessor = schemaDescription.accessor || this.accessor;
        this.inputSchemas.push(Object.assign(Object.assign({}, schemaDescription), { accessor,
            inputField, value: schemaDescription.value || inputField.value }));
        return this;
    }
    checkRequired(schema, inputError) {
        let message = '';
        if (schema.inputField.value.length === 0) {
            message = `${inputError.name} is required.`;
            inputError.errors.push(message);
        }
    }
    checkType(schema, inputError) {
        let message = '';
        const schemaValue = schema.type === 'number' ? +schema.value : schema.value;
        if (schema.inputField.value.length && typeof schemaValue !== schema.type) {
            message = `${inputError.name} is required.`;
            inputError.errors.push(message);
        }
    }
    /**
     * Validates each input field
     */
    runValidation(schema) {
        const field = schema.inputField; // We're sure the accessor will be set
        const name = schema.alias;
        const errors = [];
        const inputError = { field, errors, name };
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
    }
    /**
     *  runs validation on the object
     */
    validateAll() {
        this.inputErrors = [];
        this.inputSchemas.forEach((schema) => {
            this.runValidation(schema);
        });
    }
}
//# sourceMappingURL=FormValidator.js.map