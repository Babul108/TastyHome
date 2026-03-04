import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { token } = useSelector(state => state.auth)

  useEffect(() => {
    if (token) {
      const newSocket = io('/', { auth: { token }, reconnection: true })
      setSocket(newSocket)
      return () => newSocket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
