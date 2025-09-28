import type { Collection } from "../types"

export const getCollectionsByType = (collections: Collection[], type: string) => {
  return collections.filter((collection) => {
    if (!collection.defineShapeStyle) return false

    try {
      const shapeStyles = JSON.parse(collection.defineShapeStyle)
      return Array.isArray(shapeStyles) && shapeStyles.includes(type)
    } catch (error) {
      console.warn("Error parsing defineShapeStyle:", collection.defineShapeStyle)
      return false
    }
  })
}
