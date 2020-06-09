export interface ISubscriber {
  /**
   * An channel through which the Observer sends off messages
   * to it's subsribers.
   * @param arg - An arbitrary list of arguments of any type.
   * @return  { any | void } Depending on the actual subscriber, this
   * method may or may not return a value.
   */
  recieveBroadcast(...arg: any[]): any | void;
}

export interface IObserver {
  subscribers: ISubscriber[];
  /**
   * Adds a new subscriber to the list of subscribers
   * @param { ISubscriber } subscriber - a subscriber object
   */
  addSubscriber(subscriber: ISubscriber): void;
  /**
   * Broadcasts a message to all subscribers
   */
  broadcast(...arg: any[]): void;
}
