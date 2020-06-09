/**
 * A decorator function that automatically binds a method to
 * it's class instance.
 */
export default (_, _2, descriptor) => {
    return {
        configurable: true,
        get() {
            return descriptor.value.bind(this);
        },
    };
};
//# sourceMappingURL=autobind.js.map