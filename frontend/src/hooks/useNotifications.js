import { useEffect, useMemo, useState } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { useApi } from '../contexts/ApiContext'

const EVENTS = [
  'notification', // generic catch-all if you emit unified events
  'test_notification',
  'admin_broadcast',
  'broadcast_all',
  'broadcast_patient',
  'broadcast_doctor',

  // domain events you already listen to in SocketContext
  'new_appointment',
  'appointment_update',
  'appointment_cancelled',
  'appointment_completed',
  'payment_success',
  'meeting_created',
  'meeting_ended',
  'new_medical_record',
  'medical_record_updated',
  'medical_record_shared',
]

export function useNotifications() {
  const { socket } = useSocket()
  const { apiCall } = useApi()
  const [items, setItems] = useState([])

  // initial load
  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await apiCall('/notifications', 'GET')
        if (!ignore && res?.success && Array.isArray(res.notifications)) {
          setItems(res.notifications)
        }
      } catch {}
    })()
    return () => { ignore = true }
  }, [apiCall])

  // live updates
  useEffect(() => {
    if (!socket) return

    const onEvt = (type) => (payload) => {
      const n = normalize(type, payload)
      setItems((prev) => [n, ...prev])
    }

    EVENTS.forEach((evt) => socket.on(evt, onEvt(evt)))
    return () => {
      EVENTS.forEach((evt) => socket.off(evt))
    }
  }, [socket])

  const unreadCount = useMemo(() => items.filter((n) => !n.readAt).length, [items])

  const markRead = async (id) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, readAt: new Date().toISOString() } : n)))
    try {
      await apiCall('/notifications/read', 'POST', { id })
    } catch {}
  }

  return { items, unreadCount, markRead }
}

function normalize(type, payload) {
  const createdAt = payload.createdAt || payload.timestamp || new Date().toISOString()
  const title =
    payload.title ||
    prettyTitle(type)

  const message =
    payload.message ||
    payload.body ||
    payload?.meta?.note ||
    payload?.email ||
    ''

  return {
    _id: payload._id || clientId(),
    type,
    title,
    message,
    createdAt,
    readAt: payload.readAt || null,
    ...payload,
  }
}

function prettyTitle(e) {
  switch (e) {
    case 'payment_success': return 'Payment received'
    case 'new_appointment': return 'New appointment'
    case 'appointment_update': return 'Appointment updated'
    case 'appointment_cancelled': return 'Appointment cancelled'
    case 'appointment_completed': return 'Appointment completed'
    case 'meeting_created': return 'Meeting ready'
    case 'meeting_ended': return 'Meeting ended'
    case 'new_medical_record': return 'New medical record'
    case 'medical_record_updated': return 'Record updated'
    case 'medical_record_shared': return 'Record shared'
    case 'admin_broadcast':
    case 'broadcast_all':
    case 'broadcast_patient':
    case 'broadcast_doctor': return 'Announcement'
    default: return 'Notification'
  }
}

function clientId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
