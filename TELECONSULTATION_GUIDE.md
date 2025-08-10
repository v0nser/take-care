# TakeCare Teleconsultation Feature Guide

## Overview

The TakeCare platform now includes a comprehensive teleconsultation feature with end-to-end video calling capabilities using Jitsi Meet integration. This feature allows patients and doctors to conduct secure video consultations with unique room IDs for each appointment.

## Features

### 🎥 Video Consultation
- **Jitsi Meet Integration**: Secure, high-quality video calls
- **Unique Room IDs**: Each appointment gets a unique meeting room
- **Real-time Communication**: Audio, video, and chat capabilities
- **Screen Sharing**: Doctors can share screens for better consultation

### 📝 Pre-Consultation Form
- **Patient Information**: Comprehensive pre-consultation data collection
- **Vital Signs**: Optional vital signs input
- **Medical History**: Current medications and allergies
- **Urgency Level**: Four-tier urgency classification

### 🔐 Security & Access Control
- **Time-based Access**: Join meetings 15 minutes before start time
- **Role-based Permissions**: Different interfaces for doctors and patients
- **Secure Meeting IDs**: Cryptographically secure room names
- **Authentication Required**: All participants must be authenticated

### 📊 Meeting Management
- **Real-time Status**: Live meeting status updates
- **Duration Tracking**: Automatic meeting duration calculation
- **Attendee Tracking**: Monitor who joins and leaves
- **Meeting Recording**: Optional consultation recording

## How It Works

### For Patients

1. **Book Teleconsultation**
   - Select "Teleconsultation" during appointment booking
   - Choose preferred date and time
   - Pay consultation fee

2. **Pre-Consultation Preparation**
   - Fill out pre-consultation form
   - Test camera and microphone
   - Ensure stable internet connection

3. **Join Meeting**
   - Access becomes available 15 minutes before appointment
   - Click "Join Meeting" button
   - Automatic browser-based video call (no downloads required)

4. **During Consultation**
   - Video and audio communication with doctor
   - Chat functionality for text messages
   - Screen sharing (if doctor initiates)

### For Doctors

1. **Appointment Management**
   - Review teleconsultation appointments in dashboard
   - Access patient pre-consultation forms
   - Confirm appointments to generate meeting links

2. **Pre-Consultation Review**
   - Review patient's pre-consultation form
   - Check vital signs and medical history
   - Prepare for the consultation

3. **Conduct Consultation**
   - Join meeting room
   - Full video consultation capabilities
   - Add diagnosis and prescription during/after call

4. **Post-Consultation**
   - Complete appointment with diagnosis
   - Add prescription and notes
   - Meeting automatically recorded for records

## Technical Implementation

### Backend Components

#### Enhanced Appointment Model
```javascript
// New fields added to Appointment schema
{
  consultationType: 'in-person' | 'teleconsultation',
  meetingId: 'unique-meeting-id',
  jitsiRoomName: 'meeting-room-name',
  meetingStartTime: Date,
  meetingEndTime: Date,
  actualDuration: Number,
  meetingAttendees: Array,
  preConsultationForm: Object
}
```

#### Meeting Routes
- `POST /api/meetings/:id/start` - Start a meeting
- `POST /api/meetings/:id/end` - End a meeting
- `GET /api/meetings/:id/join` - Get meeting join details
- `GET /api/meetings/upcoming` - Get upcoming teleconsultations
- `PUT /api/meetings/:id/pre-consultation` - Update pre-consultation form

### Frontend Components

#### TeleconsultationInterface
- Full-screen video call interface
- Jitsi Meet integration
- Real-time status updates
- Meeting controls

#### TeleconsultationCard
- Appointment preview with join functionality
- Status indicators
- Time-based access control

#### PreConsultationForm
- Comprehensive patient information collection
- Vital signs input
- Medical history management

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:
```bash
JITSI_MEET_DOMAIN=https://meet.jit.si
# Or use your own Jitsi server
JITSI_MEET_DOMAIN=https://your-jitsi-domain.com
```

### 2. Frontend Dependencies
The implementation uses the Jitsi Meet External API which is loaded dynamically. No additional package installations required.

### 3. Database Migration
The enhanced Appointment model includes new fields that will be automatically added when you restart your application.

## Usage Examples

### Booking a Teleconsultation
```javascript
const appointmentData = {
  doctorId: "doctor-id",
  appointmentDate: "2024-01-15",
  appointmentTime: "10:00",
  reason: "Follow-up consultation",
  type: "followup",
  consultationType: "teleconsultation" // Key field
};
```

### Joining a Meeting
```javascript
// Navigate to teleconsultation interface
navigate(`/teleconsultation/${appointmentId}`);
```

### Pre-consultation Form
```javascript
const formData = {
  chiefComplaint: "Persistent headaches",
  currentMedications: ["Ibuprofen 400mg"],
  allergies: ["Penicillin"],
  vitalSigns: {
    temperature: 98.6,
    bloodPressure: "120/80",
    heartRate: 72
  },
  urgencyLevel: "medium"
};
```

## Security Considerations

### Meeting Room Security
- **Unique Room IDs**: Each meeting gets a cryptographically secure room name
- **Time-limited Access**: Meetings can only be joined within the appointment window
- **Authentication Required**: Both participants must be authenticated users
- **No Recording by Default**: Meetings are not recorded unless explicitly enabled

### Data Privacy
- **HIPAA Compliance**: All medical data handled according to privacy standards
- **Encrypted Communication**: Video calls use encrypted channels
- **Audit Trail**: All meeting activities are logged for compliance

## Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Check browser permissions
   - Ensure latest browser version
   - Test hardware before meeting

2. **Cannot Join Meeting**
   - Verify appointment is confirmed
   - Check if within allowed time window (15 min before to 30 min after)
   - Ensure stable internet connection

3. **Video Quality Issues**
   - Check internet bandwidth
   - Close other applications using camera/microphone
   - Try refreshing the browser

### Browser Compatibility
- **Chrome**: Fully supported
- **Firefox**: Fully supported
- **Safari**: Supported (iOS 12+)
- **Edge**: Supported

## API Reference

### Start Meeting
```http
POST /api/meetings/:appointmentId/start
Authorization: Bearer <token>
```

### End Meeting
```http
POST /api/meetings/:appointmentId/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "diagnosis": "Patient diagnosis",
  "prescription": [
    {
      "medicine": "Medicine name",
      "dosage": "Dosage",
      "frequency": "Frequency"
    }
  ],
  "notes": "Consultation notes"
}
```

### Get Meeting Details
```http
GET /api/meetings/:appointmentId/join
Authorization: Bearer <token>
```

## Future Enhancements

### Planned Features
- **Meeting Recording**: Automatic consultation recording
- **Prescription Integration**: Digital prescription generation
- **Health Monitoring**: Integration with wearable devices
- **AI Assistant**: AI-powered consultation assistance
- **Multi-participant**: Support for consultations with multiple healthcare providers

### Integration Possibilities
- **Electronic Health Records (EHR)**: Sync with existing EHR systems
- **Pharmacy Integration**: Direct prescription sending to pharmacies
- **Insurance Claims**: Automated insurance claim processing
- **Follow-up Scheduling**: Automatic follow-up appointment scheduling

## Support

For technical support or feature requests:
- Email: support@takecare.com
- Documentation: [docs.takecare.com](https://docs.takecare.com)
- GitHub Issues: [github.com/takecare/issues](https://github.com/takecare/issues)

---

**Note**: This teleconsultation feature provides a comprehensive solution for remote healthcare delivery while maintaining the highest standards of security and privacy. 