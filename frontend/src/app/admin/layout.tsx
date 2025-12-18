import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-black">
            OrderBean
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/order"
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              주문하기
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm border-2 border-gray-800 rounded font-medium"
            >
              관리자
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

