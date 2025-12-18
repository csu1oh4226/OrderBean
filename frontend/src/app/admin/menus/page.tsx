'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface Menu {
  menu_id: string
  store_id: string
  name: string
  price: number
  status: 'AVAILABLE' | 'SOLD_OUT'
}

const menuSchema = z.object({
  name: z.string().min(1, '메뉴 이름을 입력하세요'),
  price: z.number().min(0, '가격을 입력하세요'),
  status: z.enum(['AVAILABLE', 'SOLD_OUT']),
})

type MenuFormData = z.infer<typeof menuSchema>

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      status: 'AVAILABLE',
    },
  })

  useEffect(() => {
    // TODO: API 호출로 메뉴 목록 가져오기
    // 임시 데이터
    setTimeout(() => {
      setMenus([
        {
          menu_id: 'menu-001',
          store_id: 'store-001',
          name: '아메리카노(ICE)',
          price: 4000,
          status: 'AVAILABLE',
        },
        {
          menu_id: 'menu-002',
          store_id: 'store-001',
          name: '아메리카노(HOT)',
          price: 4000,
          status: 'AVAILABLE',
        },
        {
          menu_id: 'menu-003',
          store_id: 'store-001',
          name: '카페라떼',
          price: 5000,
          status: 'AVAILABLE',
        },
        {
          menu_id: 'menu-004',
          store_id: 'store-001',
          name: '바닐라라떼',
          price: 5500,
          status: 'SOLD_OUT',
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const onSubmit = async (data: MenuFormData) => {
    // TODO: API 호출로 메뉴 생성/수정
    if (editingMenu) {
      setMenus(
        menus.map((menu) =>
          menu.menu_id === editingMenu.menu_id
            ? { ...menu, ...data }
            : menu
        )
      )
    } else {
      setMenus([
        ...menus,
        {
          menu_id: `menu-${Date.now()}`,
          store_id: 'store-001',
          ...data,
        },
      ])
    }
    reset()
    setShowForm(false)
    setEditingMenu(null)
  }

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu)
    reset({
      name: menu.name,
      price: menu.price,
      status: menu.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (menuId: string) => {
    // TODO: API 호출로 메뉴 삭제
    if (confirm('정말 삭제하시겠습니까?')) {
      setMenus(menus.filter((menu) => menu.menu_id !== menuId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">메뉴 관리</h1>
        <button
          onClick={() => {
            setEditingMenu(null)
            reset()
            setShowForm(true)
          }}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          메뉴 추가
        </button>
      </div>

      {/* 메뉴 추가/수정 폼 */}
      {showForm && (
        <div className="border border-gray-300 rounded p-6">
          <h2 className="text-xl font-bold text-black mb-4">
            {editingMenu ? '메뉴 수정' : '메뉴 추가'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                메뉴 이름
              </label>
              <input
                {...register('name')}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="예: 아메리카노(ICE)"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                가격 (원)
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="4000"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                상태
              </label>
              <select
                {...register('status')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="AVAILABLE">판매중</option>
                <option value="SOLD_OUT">품절</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                {editingMenu ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingMenu(null)
                  reset()
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 메뉴 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.menu_id}
            className="border border-gray-300 rounded p-6 space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-black">{menu.name}</h3>
              <p className="text-xl font-bold text-black mt-2">
                {menu.price.toLocaleString()}원
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded text-xs font-medium ${
                  menu.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {menu.status === 'AVAILABLE' ? '판매중' : '품절'}
              </span>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(menu)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(menu.menu_id)}
                className="flex-1 px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

