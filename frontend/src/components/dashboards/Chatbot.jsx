import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, Info, BookOpen, Stethoscope, CreditCard } from 'lucide-react';
import chatbotService from '../../services/chatbotService';
import { CHATBOT_CONFIG } from '../../config/chatbotConfig';

// Define the custom keyframe animation directly in the component for clarity.
// In a real project, this would be in the global CSS file (e.g., globals.css or a dedicated CSS module).
// For the purpose of this fix, I will assume a way to inject or define this.
// A simpler, pure Tailwind approach is to use a combination of existing classes.
// I will use a simple transition for appearance and a non-conflicting animation for the "bounce".

const Chatbot = ({ role = 'patient' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  // Removed popupAnimation state as it's no longer needed for the refactored logic.

  const messagesEndRef = useRef(null);
  const greetingIntervalRef = useRef(null);
  const popupTimeoutRef = useRef(null);
  const hasShownPopupRef = useRef(false);
  const indianGreetings = CHATBOT_CONFIG.INDIAN_LANGUAGES || [];

  // Initialize chatbot
  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        await chatbotService.initializeChat(role, {
          timestamp: new Date().toISOString(),
          platform: 'TakeCare Healthcare Platform',
          userRole: role,
        });
      } catch (error) {
        console.error('Failed to initialize chatbot:', error);
      }
    };

    initializeChatbot();

    // Show popup on first load
    if (!hasShownPopupRef.current) {
      hasShownPopupRef.current = true;
      setShowPopup(true); // Simply set showPopup to true. The CSS will handle the animation.

      // Auto-hide after 6 seconds
      popupTimeoutRef.current = setTimeout(() => {
        setShowPopup(false); // The transition will handle the smooth fade-out
      }, 6000);
    }

    // Initialize messages
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        content: `Welcome to TakeCare chatbot! I'm your AI healthcare assistant. I can help you with:

• **Appointments**: Book, manage, and schedule consultations
• **Diagnostic Services**: Lab tests and health checkup packages
• **Teleconsultation**: Online video consultations
• **Medical Records**: Access your health information
• **Payment Options**: Secure payment methods

How can I assist you today?`,
        timestamp: new Date(),
        language: 'English',
      };

      setMessages([welcomeMessage]);
      setCurrentGreeting('TakeCare AI: Hey, how can I help?');
    }

    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
      if (greetingIntervalRef.current) clearInterval(greetingIntervalRef.current);
    };
  }, [role, messages.length]);

  // Greeting animation
  const startGreetingAnimation = useCallback(() => {
    if (indianGreetings.length < 2) return;

    let currentIndex = 0;
    if (greetingIntervalRef.current) clearInterval(greetingIntervalRef.current);

    const animateGreeting = () => {
      if (currentIndex >= indianGreetings.length) currentIndex = 0;
      const greeting = indianGreetings[currentIndex];
      const fullText = `${greeting.name}: ${greeting.greeting}`;

      setCurrentGreeting('');
      setTimeout(() => setCurrentGreeting(fullText), 200);
      currentIndex++;
    };

    setTimeout(() => {
      animateGreeting();
      greetingIntervalRef.current = setInterval(animateGreeting, 3500);
    }, 2000);

    return () => {
      if (greetingIntervalRef.current) clearInterval(greetingIntervalRef.current);
    };
  }, [indianGreetings]);

  useEffect(() => {
    if (messages.length > 0 && indianGreetings.length > 1) {
      const cleanup = startGreetingAnimation();
      return cleanup;
    }
  }, [messages.length, indianGreetings.length, startGreetingAnimation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentGreeting]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(inputMessage, messages, role);
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        chatbotService.saveConversationHistory([...messages, userMessage, botMessage]);
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setShowPopup(false); // Close the popup when the main chat window opens.
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'appointment':
        message = 'I want to book an appointment. How do I do that?';
        break;
      case 'diagnostic':
        message = 'Tell me about diagnostic services and health checkup packages.';
        break;
      case 'teleconsultation':
        message = 'How does teleconsultation work? Can you explain the process?';
        break;
      case 'payment':
        message = 'What payment methods do you accept?';
        break;
      default:
        message = action;
    }

    setInputMessage(message);
    setShowQuickActions(false);
    if (isOpen && isMinimized) setIsMinimized(false);
  };

  const getQuickActions = () => [
    { key: 'appointment', label: 'Book Appointment', icon: BookOpen, color: 'bg-blue-500' },
    { key: 'diagnostic', label: 'Diagnostic Services', icon: Stethoscope, color: 'bg-green-500' },
    { key: 'teleconsultation', label: 'Teleconsultation', icon: Info, color: 'bg-purple-500' },
    { key: 'payment', label: 'Payment Options', icon: CreditCard, color: 'bg-orange-500' },
  ];

  // Comic Cloud Speech Bubble Popup
  const ComicPopup = () => {
      // Added a separate class for the initial animation to prevent conflict with the bounce.
      // A more robust solution involves a custom animation in the CSS file.
      // Here, I'm using a combination of Tailwind classes that work well together.
    return (
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-500 ease-out transform-gpu ${
          showPopup
            ? 'translate-y-0 opacity-100 scale-100 animate-pop-in'
            : 'translate-y-10 opacity-0 scale-95'
        } `}
      >
        <div className="relative">
          <div
            className="relative bg-gradient-to-b from-blue-400 via-blue-500 to-purple-600 text-white px-5 py-4 rounded-full max-w-xs text-center shadow-2xl leading-tight font-medium"
            style={{
              clipPath:
                'circle(42% at 48% 15%), circle(30% at 20% 30%), circle(30% at 80% 30%), circle(35% at 40% 65%), circle(35% at 60% 65%)',
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, #000 0%, transparent 70%)',
                top: '5px',
                left: '5px',
                right: '5px',
                bottom: '5px',
              }}
            ></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Bot size={16} className="drop-shadow" />
                <span className="text-sm font-bold drop-shadow-sm">TakeCare AI</span>
              </div>
              <p className="text-sm drop-shadow">
                Hey! I'm here to help. 💬
              </p>
            </div>

            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-80"></div>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>

          <div
            className="absolute right-8 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gradient-to-r border-t-from-blue-400 border-t-to-purple-600 -rotate-12 transform -translate-x-1/2"
            style={{
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
            }}
          ></div>

          <div className="absolute -top-3 -right-4 text-yellow-300 text-lg animate-pulse font-bold">*</div>

          <button
            onClick={toggleChat}
            className="mt-3 mx-auto block w-28 bg-white text-blue-600 hover:bg-blue-50 font-bold py-1.5 px-3 rounded-full text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-blue-200"
          >
            💬 Chat Now
          </button>
        </div>
      </div>
    );
  };
  
  // NOTE: To make the `animate-pop-in` class work, you need to add the following
  // keyframes to your global CSS file (e.g., globals.css or main.css):
  /*
  @keyframes pop-in {
    0% {
      transform: translateY(20px) scale(0.8);
      opacity: 0;
    }
    50% {
      transform: translateY(-5px) scale(1.05);
      opacity: 1;
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  .animate-pop-in {
    animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  */

  if (!isOpen) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Chat with TakeCare AI"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </button>
        </div>

        {showPopup && <ComicPopup />}
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[500px]">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot size={20} />
            <div>
              <h3 className="font-semibold">TakeCare AI</h3>
              <p className="text-xs text-blue-100">Powered by Google Gemini</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="text-blue-100 hover:text-white transition-colors focus:outline-none"
              title={isMinimized ? 'Maximize' : 'Minimize'}
              aria-label="Minimize chat"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={toggleChat}
              className="text-blue-100 hover:text-white transition-colors focus:outline-none"
              title="Close"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {currentGreeting && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-3 max-w-[80%] shadow-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot size={14} className="text-white" />
                      <span className="text-xs opacity-75">Greetings</span>
                    </div>
                    <div className="text-sm font-medium">{currentGreeting}</div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'user' ? (
                        <User size={14} className="text-blue-200" />
                      ) : (
                        <Bot size={14} className="text-blue-600" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.language && `${message.language} • `}
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br>')
                          .replace(/•/g, '• '),
                      }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot size={14} className="text-blue-600" />
                      <span className="text-xs opacity-75">AI is thinking...</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showQuickActions && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {getQuickActions().map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.key}
                        onClick={() => handleQuickAction(action.key)}
                        className={`${action.color} hover:opacity-90 text-white text-xs p-2 rounded-lg flex flex-col items-center space-y-1 transition-all`}
                      >
                        <IconComponent size={16} />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about healthcare services..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                  aria-label="Type your message"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showQuickActions ? 'Hide' : 'Show'} Quick Actions
                </button>
                <p className="text-xs text-gray-500">
                  Press Enter to send
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;