// app/lib/utils.ts
export function toSnakeCase<T>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map(toSnakeCase) as T;
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/([A-Z])/g, '_$1').toLowerCase(),
          toSnakeCase(value),
        ])
      ) as T;
    }
    return obj;
  }

  export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};