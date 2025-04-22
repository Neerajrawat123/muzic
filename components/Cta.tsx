import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

function Cta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white md:text-4xl/tight">
              Ready to start your musical journey?
            </h2>
            <p className="max-w-[600px] text-white/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of users who are already sharing and discovering
              new music together.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
            <Button
              size="lg"
              asChild
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>                
  )
}

export default Cta