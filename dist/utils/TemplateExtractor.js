/**
 * Extracts the content of template elememt which later gets added
 * to the DOM.
 * @class TemplateExtractor
 * @property
 */
export default class TemplateExtractor {
    constructor(templateElementId, targetElementId) {
        this.targetElementId = targetElementId;
        this.templateElement = document.getElementById(`${templateElementId}`);
        this.targetElement = document.getElementById(`${targetElementId}`);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.templateContentElement = importedNode.firstElementChild;
    }
    fillTarget(position) {
        this.targetElement.insertAdjacentElement(position, this.templateContentElement);
    }
}
//# sourceMappingURL=TemplateExtractor.js.map