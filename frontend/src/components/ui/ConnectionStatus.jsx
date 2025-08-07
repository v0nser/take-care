import { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { Wifi, WifiOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ConnectionStatus = ({ className = '', showDetails = false }) => {
  const { 
    isConnected, 
    connectionStatus, 
    lastConnected, 
    reconnectAttempts, 
    maxReconnectAttempts,
    isOnline 
  } = useSocket();
  
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
        icon: WifiOff,
        text: 'Offline',
        description: 'No internet connection'
      };
    }

    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
          icon: CheckCircle,
          text: 'Online',
          description: 'Connected to server'
        };
      case 'connecting':
        return {
          color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
          icon: Loader2,
          text: 'Connecting',
          description: 'Establishing connection...'
        };
      case 'error':
        return {
          color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
          icon: AlertCircle,
          text: 'Error',
          description: `Connection failed (${reconnectAttempts}/${maxReconnectAttempts} attempts)`
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-800',
          icon: WifiOff,
          text: 'Disconnected',
          description: 'Not connected to server'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  if (!showDetails) {
    // Compact version - just the indicator dot
    return (
      <div 
        className={`relative ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`w-3 h-3 rounded-full ${statusInfo.color} ${
          connectionStatus === 'connecting' ? 'animate-pulse' : ''
        }`} />
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
            <div className="font-medium">{statusInfo.text}</div>
            <div className="text-xs opacity-75">{statusInfo.description}</div>
            {lastConnected && isConnected && (
              <div className="text-xs opacity-75">
                Connected at {format(lastConnected, 'HH:mm:ss')}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed version - full status display
  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${statusInfo.color} ${className}`}>
      <Icon className={`h-4 w-4 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{statusInfo.text}</span>
        <span className="text-xs opacity-75">{statusInfo.description}</span>
        {lastConnected && isConnected && (
          <span className="text-xs opacity-75">
            Connected at {format(lastConnected, 'HH:mm:ss')}
          </span>
        )}
      </div>
    </div>
  );
};

// Hook for programmatic access to connection status
export const useConnectionStatus = () => {
  const { isConnected, connectionStatus, isOnline } = useSocket();
  
  return {
    isConnected: isConnected && isOnline,
    isOnline,
    status: !isOnline ? 'offline' : connectionStatus,
    isHealthy: isConnected && isOnline && connectionStatus === 'connected'
  };
};

export default ConnectionStatus; 