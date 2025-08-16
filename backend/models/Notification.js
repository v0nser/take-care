// models/Notification.js
import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, index: true }, // optional for broadcast
    type: { type: String, required: true }, // e.g., 'payment_success', 'new_appointment', etc.
    title: String,
    message: String,
    meta: Object,
    readAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default mongoose.model('Notification', notificationSchema)
