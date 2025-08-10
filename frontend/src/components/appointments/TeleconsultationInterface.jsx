import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { useSocket } from '../../contexts/SocketContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Users,
  Clock,
  Calendar,
  User,
  Stethoscope,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const TeleconsultationInterface = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  
  // State
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [duration, setDuration] = useState(0);
  const [showEndMeetingModal, setShowEndMeetingModal] = useState(false);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Doctor-specific state for ending consultation
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [notes, setNotes] = useState('');

  const { meetings } = useApi();

  useEffect(() => {
    if (appointmentId) {
      fetchMeetingDetails();
    }
  }, [appointmentId]);

  useEffect(() => {
    if (appointment && !meetingStarted) {
      initializeJitsiMeet();
    }
  }, [appointment, meetingStarted]);

  useEffect(() => {
    // Socket event listeners
    if (socket) {
      socket.on('meeting_started', handleMeetingStarted);
      socket.on('meeting_ended', handleMeetingEnded);
      socket.on('participant_joined', handleParticipantJoined);
      
      return () => {
        socket.off('meeting_started', handleMeetingStarted);
        socket.off('meeting_ended', handleMeetingEnded);
        socket.off('participant_joined', handleParticipantJoined);
      };
    }
  }, [socket]);

  // Duration timer
  useEffect(() => {
    let interval;
    if (meetingStarted && !meetingEnded) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meetingStarted, meetingEnded]);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      const response = await meetings.joinMeeting(appointmentId);
      setAppointment(response.data.meeting);
      setMeetingStarted(response.data.meeting.meetingStarted);
    } catch (error) {
      toast.error('Failed to load meeting details');
      console.error('Error fetching meeting details:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const initializeJitsiMeet = async () => {
    if (!appointment || !window.JitsiMeetExternalAPI) {
      // Load Jitsi Meet API script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => setupJitsiMeet();
      document.head.appendChild(script);
    } else {
      setupJitsiMeet();
    }
  };

  const setupJitsiMeet = () => {
    if (!appointment || !jitsiContainerRef.current) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: appointment.jitsiRoomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: user.role === 'doctor' 
          ? `Dr. ${user.firstName} ${user.lastName}`
          : `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableThirdPartyRequests: true,
        enableUserRolesBasedOnToken: false
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#474747',
        DISABLE_PRESENCE_STATUS: true,
        HIDE_INVITE_MORE_HEADER: true
      }
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    jitsiApiRef.current = api;

    // Set up event listeners
    api.addEventListener('videoConferenceJoined', handleVideoConferenceJoined);
    api.addEventListener('videoConferenceLeft', handleVideoConferenceLeft);
    api.addEventListener('participantJoined', handleJitsiParticipantJoined);
    api.addEventListener('participantLeft', handleJitsiParticipantLeft);
    api.addEventListener('audioMuteStatusChanged', handleAudioMuteStatusChanged);
    api.addEventListener('videoMuteStatusChanged', handleVideoMuteStatusChanged);

    setConnectionStatus('connected');
  };

  const handleVideoConferenceJoined = async (event) => {
    console.log('User joined the conference:', event);
    setConnectionStatus('connected');
    
    // Start the meeting if not already started
    if (!meetingStarted) {
      try {
        await meetings.startMeeting(appointmentId);
        setMeetingStarted(true);
        
        // Send join notification to other participant
        await meetings.sendJoinNotification(appointmentId);
      } catch (error) {
        console.error('Error starting meeting:', error);
      }
    }
  };

  const handleVideoConferenceLeft = () => {
    console.log('User left the conference');
    setMeetingEnded(true);
  };

  const handleJitsiParticipantJoined = (event) => {
    console.log('Participant joined:', event);
    setParticipants(prev => [...prev, event.id]);
  };

  const handleJitsiParticipantLeft = (event) => {
    console.log('Participant left:', event);
    setParticipants(prev => prev.filter(id => id !== event.id));
  };

  const handleAudioMuteStatusChanged = (event) => {
    setIsAudioMuted(event.muted);
  };

  const handleVideoMuteStatusChanged = (event) => {
    setIsVideoMuted(event.muted);
  };

  const handleMeetingStarted = (data) => {
    if (data.appointment.appointmentId === appointmentId) {
      setMeetingStarted(true);
      toast.success('Meeting started!');
    }
  };

  const handleMeetingEnded = (data) => {
    if (data.appointment.appointmentId === appointmentId) {
      setMeetingEnded(true);
      toast.info('Meeting ended');
    }
  };

  const handleParticipantJoined = (data) => {
    if (data.appointmentId === appointmentId) {
      toast.success(`${data.participant.name} joined the meeting`);
    }
  };

  const endMeeting = async () => {
    try {
      const endData = user.role === 'doctor' ? {
        diagnosis,
        prescription,
        notes
      } : {};
      
      await meetings.endMeeting(appointmentId, endData);
      
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      
      setMeetingEnded(true);
      setShowEndMeetingModal(false);
      
      toast.success('Meeting ended successfully');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to end meeting');
      console.error('Error ending meeting:', error);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Meeting Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested meeting could not be found or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (meetingEnded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Meeting Ended
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The teleconsultation has ended successfully. Duration: {formatDuration(duration)}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full"
            >
              Back to Dashboard
            </button>
            {user.role === 'patient' && (
              <button
                onClick={() => navigate(`/dashboard/appointments/${appointmentId}`)}
                className="btn-outline w-full"
              >
                View Appointment Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Teleconsultation
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.appointmentTime}
                </span>
                {meetingStarted && (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    {formatDuration(duration)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.role === 'patient' ? (
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowEndMeetingModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <PhoneOff className="h-4 w-4" />
              <span>End Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Container */}
        <div className="flex-1 relative">
          <div
            ref={jitsiContainerRef}
            className="w-full h-full"
          />
          
          {/* Connection Status Overlay */}
          {connectionStatus === 'connecting' && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Connecting to meeting...</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.sender === user._id
                      ? 'bg-blue-600 text-white ml-auto max-w-xs'
                      : 'bg-gray-100 dark:bg-gray-700 max-w-xs'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Handle send message
                    }
                  }}
                />
                <button
                  onClick={() => {
                    // Handle send message
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* End Meeting Modal */}
      {showEndMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              End Meeting
            </h3>
            
            {user.role === 'doctor' ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the consultation by adding diagnosis and notes:
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter diagnosis..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter consultation notes..."
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to end this meeting?
              </p>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEndMeetingModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={endMeeting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                End Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationInterface; 