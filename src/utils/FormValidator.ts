import {
  FieldElement,
  FieldSchema,
  ValidationSchema,
  InputError,
} from '../interfaces/formValidatorInterface.js';

/**
 * Form input validator
 * @property accessor - A html attribute that will be used to
 * access each input element in the form
 */
export default class FormValidator {
  protected inputSchemas: FieldSchema[] = [];
  inputErrors: {}[] = [];

  constructor(private accessor: string) {}

  /**
   * adds validatiion to each input
   */
  addValidation<T extends FieldElement>(
    inputField: T,
    schemaDescription: ValidationSchema
  ): this {
    const accessor = schemaDescription.accessor || this.accessor;

    this.inputSchemas.push({
      ...schemaDescription,
      accessor,
      inputField,
      value: schemaDescription.value || inputField.value,
    });

    return this;
  }

  private checkRequired(schema: FieldSchema, inputError: InputError): void {
    let message = '';
    if (schema.inputField.value.length === 0) {
      message = `${inputError.name} is required.`;
      inputError.errors.push(message);
    }
  }

  private checkType(schema: FieldSchema, inputError: InputError): void {
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
  private runValidation(schema: FieldSchema) {
    const field = schema.inputField; // We're sure the accessor will be set
    const name = schema.alias as string;
    const errors: string[] = [];
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
  validateAll(): void {
    this.inputErrors = [];

    this.inputSchemas.forEach((schema) => {
      this.runValidation(schema);
    });
  }
}
