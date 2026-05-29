import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#0d1117]">
      <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-4xl">
        🏟️
      </div>
      <div className="text-7xl font-black text-blue-500 mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-3">Arena not found</h1>
      <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
        This arena doesn&apos;t exist or has already ended. Head back to discover active tournaments.
      </p>
      <div className="flex gap-3">
        <Link
          href="/arena"
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          Browse Arenas
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
