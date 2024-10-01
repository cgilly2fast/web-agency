/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export default function deepMerge<
  T extends Record<string, unknown>,
  S extends Record<string, unknown>,
>(target: T, source: S): T & S {
  const output = { ...target } as T & S

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          ;(output as Record<string, unknown>)[key] = source[key]
        } else {
          ;(output as Record<string, unknown>)[key] = deepMerge(
            (target as Record<string, unknown>)[key] as Record<string, unknown>,
            (source as Record<string, unknown>)[key] as Record<string, unknown>,
          )
        }
      } else {
        ;(output as Record<string, unknown>)[key] = source[key]
      }
    })
  }

  return output
}
