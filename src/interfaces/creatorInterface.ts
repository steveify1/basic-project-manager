/**
 * An interface that defines an object with one method that is capable of
 * creating and returning a Project instance.
 */
export default interface ICreator {
  create(...arg: any[]): any;
}
