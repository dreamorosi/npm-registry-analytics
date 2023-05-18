/**
 * Utility type that allows to "see" inside another type.
 *
 * Wrap a type and hover on it to see its properties.
 * @example Prettify<MyType>
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
};

export { Prettify };
