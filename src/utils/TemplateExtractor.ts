namespace App {
  /**
   * Extracts the content of template elememt which later gets added
   * to the DOM.
   * @class TemplateExtractor
   * @property
   */
  export class TemplateExtractor<T extends HTMLElement> {
    protected templateElement: HTMLTemplateElement;
    protected targetElement: HTMLElement;
    readonly templateContentElement: T;

    constructor(templateElementId: string, private targetElementId: string) {
      this.templateElement = document.getElementById(
        `${templateElementId}`
      )! as HTMLTemplateElement;

      this.targetElement = document.getElementById(`${targetElementId}`)!;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );

      this.templateContentElement = importedNode.firstElementChild as T;
    }

    fillTarget(
      position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
    ): void {
      this.targetElement.insertAdjacentElement(
        position,
        this.templateContentElement
      );
    }
  }
}
