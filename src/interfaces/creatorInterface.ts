namespace App {
  /**
   * An interface that defines an object with one method that is capable of
   * creating and returning a Project instance.
   */
  export interface ICreator {
    create(...arg: any[]): any;
  }
}
