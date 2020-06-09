/**
 * A sunscriber that manages the projects after a drag and drop
 */
export default class ProjectDragManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }
    recieveBroadcast(id, newState) {
        this.projectManager.updateProjectState(id, newState);
    }
}
//# sourceMappingURL=ProjectDragManager.js.map