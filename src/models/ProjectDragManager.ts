import { ISubscriber } from '../interfaces/observerSubscriberInterface.js';
import ProjectManager from './ProjectManager.js';
/**
 * A sunscriber that manages the projects after a drag and drop
 */
export default class ProjectDragManager implements ISubscriber {
  constructor(private projectManager: ProjectManager) {}

  recieveBroadcast(
    id: string | number,
    newState: 'active' | 'completed'
  ): void {
    this.projectManager.updateProjectState(id, newState);
  }
}
