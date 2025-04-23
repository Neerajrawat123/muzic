'use client'

import React, { createContext,  useState } from 'react'

type RoomContextType = {
    room: string,
    setRoom: React.Dispatch<React.SetStateAction<string>>
}

export const RoomContext = createContext<RoomContextType | null>(null)

function RoomProvider({children}: {children: React.ReactNode}) {

    const [room, setRoom] = useState('')
  return (
    <RoomContext.Provider value={{room, setRoom}}>
        {children}

    </RoomContext.Provider>

  )
}

export default RoomProvider