import Link from 'next/link'
import React from 'react'

function footer() {
  return (
    <footer className="border-t border-white/10 py-6 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6">
      <p className="text-center text-sm text-white/50">
        © {new Date().getFullYear()} MusicRoom. All rights reserved.
      </p>
      <div className="flex gap-4">
        <Link
          href="#"
          className="text-sm text-white/50 hover:text-white hover:underline"
        >
          Terms
        </Link>
        <Link
          href="#"
          className="text-sm text-white/50 hover:text-white hover:underline"
        >
          Privacy
        </Link>
      </div>
    </div>
  </footer>
  )
}

export default footer