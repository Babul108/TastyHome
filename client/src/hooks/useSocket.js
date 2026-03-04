import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'

const useSocket = () => {
  const { socket } = useSocketContext()

  const joinOrderRoom = (orderId) => {
    if (socket) socket.emit('join:order', orderId)
  }

  const leaveOrderRoom = (orderId) => {
    if (socket) socket.emit('leave:order', orderId)
  }

  const onOrderUpdate = (callback) => {
    if (!socket) return
    socket.on('order:updated', callback)
    return () => socket.off('order:updated', callback)
  }

  const onDeliveryLocation = (callback) => {
    if (!socket) return
    socket.on('delivery:location', callback)
    return () => socket.off('delivery:location', callback)
  }

  const onNotification = (callback) => {
    if (!socket) return
    socket.on('notification', callback)
    return () => socket.off('notification', callback)
  }

  return {
    socket,
    joinOrderRoom,
    leaveOrderRoom,
    onOrderUpdate,
    onDeliveryLocation,
    onNotification,
    isConnected: socket?.connected || false
  }
}

export default useSocket
