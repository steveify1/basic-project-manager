/**
 * A decorator function that automatically binds a method to
 * it's class instance.
 */
export default (
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  return {
    configurable: true,
    get() {
      return descriptor.value.bind(this);
    },
  };
};

/**
 * A function that is called in another function and receives
 * an arbitrary number of argument of n types
 */
export type Callback = Function;
