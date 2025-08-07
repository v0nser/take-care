import { useSocket } from '../contexts/SocketContext';
import ConnectionStatus, { useConnectionStatus } from '../components/ui/ConnectionStatus';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { RefreshCw, Wifi, WifiOff, Database, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ConnectionTestPage = () => {
  const { 
    socket, 
    isConnected, 
    connectionStatus, 
    lastConnected, 
    reconnectAttempts, 
    maxReconnectAttempts 
  } = useSocket();
  
  const { isHealthy } = useConnectionStatus();
  const [testMessage, setTestMessage] = useState('Hello from frontend!');

  const sendTestMessage = () => {
    if (socket && isConnected) {
      socket.emit('test_notification', { 
        message: testMessage || 'Test message from connection page'
      });
      toast.success('Test message sent!');
    } else {
      toast.error('Not connected to server');
    }
  };

  const forceReconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
      toast.info('Attempting to reconnect...');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connection Status Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Debug page for testing socket connections and real-time features
          </p>
        </div>

        {/* Connection Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Overall Status</h3>
              <ConnectionStatus showDetails={false} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Healthy:</span>
                <span className={`font-medium ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {isHealthy ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Browser Online:</span>
                <span className={`font-medium ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
                  {navigator.onLine ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Socket Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Socket Connection</h3>
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`font-medium capitalize ${
                  connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'connecting' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {connectionStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Socket ID:</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white">
                  {socket?.id || 'N/A'}
                </span>
              </div>
              {lastConnected && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Connected At:</span>
                  <span className="text-xs text-gray-900 dark:text-white">
                    {lastConnected.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reconnection Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Reconnection</h3>
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reconnectAttempts} / {maxReconnectAttempts}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(reconnectAttempts / maxReconnectAttempts) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detailed Status</h3>
          <ConnectionStatus showDetails={true} className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Connection Info</h4>
              <div className="space-y-1">
                <div>Connected: <span className={isConnected ? 'text-green-600' : 'text-red-600'}>{isConnected ? 'Yes' : 'No'}</span></div>
                <div>Status: <span className="capitalize">{connectionStatus}</span></div>
                <div>Transport: <span className="font-mono">{socket?.io?.engine?.transport?.name || 'N/A'}</span></div>
                <div>URL: <span className="font-mono text-xs">{socket?.io?.uri || 'N/A'}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Browser Info</h4>
              <div className="space-y-1">
                <div>Online: <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>{navigator.onLine ? 'Yes' : 'No'}</span></div>
                <div>User Agent: <span className="font-mono text-xs break-all">{navigator.userAgent.substring(0, 50)}...</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Test Controls</h3>
          
          <div className="space-y-4">
            {/* Test Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Message
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
                <button
                  onClick={sendTestMessage}
                  disabled={!isConnected}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </button>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={forceReconnect}
                className="btn-outline flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Reconnect
              </button>
              
              <button
                onClick={() => {
                  if (socket) {
                    socket.disconnect();
                    toast.info('Disconnected from server');
                  }
                }}
                disabled={!isConnected}
                className="btn-outline flex items-center disabled:opacity-50"
              >
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to Test</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• The indicator should be <span className="font-medium text-green-600">green</span> when connected</li>
            <li>• Try disconnecting your internet to see the offline state</li>
            <li>• Send test messages to verify real-time communication</li>
            <li>• Check browser console for detailed connection logs</li>
            <li>• Connection status appears in the navbar and dashboard header</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConnectionTestPage; 