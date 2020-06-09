namespace App {
  /**
   * A validator schema interface
   */
  export interface ValidationSchema {
    /**@property an attribute of the form element used to identify it, maybe it's id or data-type */
    accessor?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    type: string | number;
    alias?: string;
    min?: number;
    max?: number;
    value?: string;
  }

  /**
   * An error object with details of an invalid input field
   */
  export interface InputError {
    field: FieldElement;
    name: string;
    errors: string[];
  }

  /**
   * A HTML input, select or textarea element.
   */
  export type FieldElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

  export type FieldSchema = ValidationSchema &
    HasValueProp & {
      inputField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    };
}
