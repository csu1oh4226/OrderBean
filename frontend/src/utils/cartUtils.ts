import type { CartItem, MenuOptions } from '@/types'

/**
 * 두 메뉴 옵션이 동일한지 비교
 * @param options1 첫 번째 옵션
 * @param options2 두 번째 옵션
 * @returns 옵션이 동일하면 true
 */
export function compareOptions(
  options1: MenuOptions,
  options2: MenuOptions
): boolean {
  return (
    options1.shot === options2.shot && options1.syrup === options2.syrup
  )
}

/**
 * 장바구니 아이템의 고유 키 생성
 * @param item 장바구니 아이템
 * @returns 고유 키
 */
export function getCartItemKey(item: CartItem): string {
  return `${item.menu_id}-${JSON.stringify(item.options)}`
}

/**
 * 장바구니에서 동일한 메뉴와 옵션을 가진 아이템 찾기
 * @param items 장바구니 아이템 배열
 * @param menuId 메뉴 ID
 * @param options 메뉴 옵션
 * @returns 찾은 아이템의 인덱스, 없으면 -1
 */
export function findCartItemIndex(
  items: CartItem[],
  menuId: string,
  options: MenuOptions
): number {
  return items.findIndex(
    (item) => item.menu_id === menuId && compareOptions(item.options, options)
  )
}

/**
 * 단일 아이템이 주어진 메뉴 ID와 옵션과 일치하는지 확인
 * @param item 장바구니 아이템
 * @param menuId 메뉴 ID
 * @param options 메뉴 옵션
 * @returns 일치하면 true
 */
export function isMatchingCartItem(
  item: CartItem,
  menuId: string,
  options: MenuOptions
): boolean {
  return item.menu_id === menuId && compareOptions(item.options, options)
}

