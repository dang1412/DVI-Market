export interface SaleItem {
  id: number
  price: number
  type: number
  info: ItemInfo | null
}

export interface ItemInfo {
  type: string
  startX: number
  endX: number
  startY: number
  endY: number
  image: string
}
