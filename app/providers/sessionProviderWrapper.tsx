'use client'

import { getSession, SessionProvider, useSession } from "next-auth/react"
import React from "react"


export default  function SessionProviderWrapper ({children}: {children: React.ReactNode, })  {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
    )

}