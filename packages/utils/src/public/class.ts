type UnionToIntersection<U> = 
(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * 混入函数，用于将多个类的方法和属性合并到一个类中(继承多个类)
 * @param {*} target 
 * @param  {...any} sources 
 */
export function mixin<T extends Constructor[]>(...constructors: T): Constructor<UnionToIntersection<InstanceType<T[number]>>> {
  class MixinClass {}

  for (const constructor of constructors) {
    Object.getOwnPropertyNames(constructor.prototype).forEach((name) => {
      if (name !== 'constructor') {
        const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
        if (descriptor) {
          Object.defineProperty(MixinClass.prototype, name, descriptor);
        }
      }
    });
  }

  return MixinClass as Constructor<UnionToIntersection<InstanceType<T[number]>>>;
}
