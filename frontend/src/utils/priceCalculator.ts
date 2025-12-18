import { SHOT_PRICE } from '@/constants/prices'
import type { CartItem, MenuOptions } from '@/types'

/**
 * 메뉴 옵션을 고려한 단가 계산
 * @param basePrice 기본 가격
 * @param options 메뉴 옵션
 * @returns 계산된 단가
 */
export function calculateUnitPrice(
  basePrice: number,
  options: MenuOptions
): number {
  let price = basePrice
  if (options.shot) {
    price += SHOT_PRICE
  }
  if (options.syrup) {
    // SYRUP_PRICE는 0이지만 확장성을 위해 유지
    price += 0
  }
  return price
}

/**
 * 장바구니 아이템의 단가 계산 (별칭 함수)
 * @param basePrice 기본 가격
 * @param options 메뉴 옵션
 * @returns 계산된 단가
 */
export function calculateItemUnitPrice(
  basePrice: number,
  options: MenuOptions
): number {
  return calculateUnitPrice(basePrice, options)
}

/**
 * 장바구니 아이템의 총 가격 계산
 * @param item 장바구니 아이템
 * @returns 계산된 총 가격
 */
export function calculateItemPrice(item: CartItem): number {
  const unitPrice = calculateUnitPrice(item.base_price, item.options)
  return unitPrice * item.quantity
}

/**
 * 장바구니 아이템 목록의 총 가격 계산
 * @param items 장바구니 아이템 배열
 * @returns 계산된 총 가격
 */
export function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateItemPrice(item), 0)
}

