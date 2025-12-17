import Link from 'next/link'

export default function Home() {
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
              className="px-4 py-2 text-sm text-black hover:text-gray-600"
            >
              관리자
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold text-center mb-8">
            OrderBean ☕
          </h1>
          <p className="text-center text-lg mb-8">
            바쁜 직장인을 위한 시간 절약형 커피 주문 웹 서비스
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/order"
              className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              주문하기
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
            >
              관리자
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

