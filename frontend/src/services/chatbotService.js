// Chatbot service for Google Gemini integration
import { CHATBOT_CONFIG } from '../config/chatbotConfig';

class ChatbotService {
  constructor() {
    // Use configuration for API settings
    this.apiEndpoint = CHATBOT_CONFIG.GEMINI_API;
    this.apiKey = CHATBOT_CONFIG.GEMINI_API_KEY;
    this.trainingData = CHATBOT_CONFIG.HEALTHCARE_KNOWLEDGE;
    this.trainingResponses = CHATBOT_CONFIG.TRAINING_RESPONSES;
  }

  // Initialize the chatbot with user context
  async initializeChat(userRole, userContext = {}) {
    try {
      const systemPrompt = this.generateSystemPrompt(userRole, userContext);
      
      // Store the system prompt for future conversations
      localStorage.setItem('chatbot_system_prompt', systemPrompt);
      
      return {
        success: true,
        message: 'Chatbot initialized successfully',
        systemPrompt
      };
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      return {
        success: false,
        message: 'Failed to initialize chatbot',
        error: error.message
      };
    }
  }

  // Generate system prompt based on user role
  generateSystemPrompt(userRole, userContext = {}) {
    // Get role-specific system prompt from configuration
    const rolePrompt = CHATBOT_CONFIG.SYSTEM_PROMPTS[userRole] || CHATBOT_CONFIG.SYSTEM_PROMPTS.patient;
    
    // Add user context to the prompt
    const contextInfo = `Current user role: ${userRole}
User context: ${JSON.stringify(userContext)}
Platform: ${CHATBOT_CONFIG.PLATFORM_NAME} v${CHATBOT_CONFIG.PLATFORM_VERSION}`;

    return `${rolePrompt}

${contextInfo}`;
  }

  // Enhanced message processing with training data
  async sendMessage(message, conversationHistory = [], userRole = 'patient') {
    try {
      // First, check if we can provide a trained response
      const trainedResponse = this.getTrainedResponse(message.toLowerCase());
      if (trainedResponse) {
        return {
          success: true,
          content: trainedResponse,
          usage: { totalTokenCount: 0 },
          model: 'gemini-pro-trained'
        };
      }

      // Check if we have API key (in production)
      if (!this.apiKey && process.env.NODE_ENV === 'production') {
        throw new Error('Google Gemini API key not configured');
      }

      // For development/demo, use simulated responses
      if (!this.apiKey || CHATBOT_CONFIG.ENABLE_SIMULATION) {
        return this.simulateGeminiResponse(message, userRole, conversationHistory);
      }

      // Real API call to Google Gemini
      const systemPrompt = localStorage.getItem('chatbot_system_prompt') || 
                          this.generateSystemPrompt(userRole);

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `System: ${systemPrompt}\n\nConversation History:\n${conversationHistory.map(msg => 
                  `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
                ).join('\n')}\n\nUser: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: CHATBOT_CONFIG.MAX_TOKENS,
          temperature: CHATBOT_CONFIG.TEMPERATURE,
          topP: CHATBOT_CONFIG.TOP_P,
          topK: CHATBOT_CONFIG.TOP_K
        },
        safetySettings: CHATBOT_CONFIG.SAFETY_SETTINGS
      };

      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TakeCare-Healthcare-Platform/1.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return {
          success: true,
          content: data.candidates[0].content.parts[0].text,
          usage: data.usageMetadata || { totalTokenCount: 0 },
          model: 'gemini-pro'
        };
      } else {
        throw new Error('Invalid response format from Google Gemini API');
      }

    } catch (error) {
      console.error('Error sending message to Google Gemini:', error);
      
      // Fallback to simulated response
      return this.simulateGeminiResponse(message, userRole, conversationHistory);
    }
  }

  // Get trained response based on message content
  getTrainedResponse(message) {
    for (const [key, training] of Object.entries(this.trainingResponses)) {
      if (training.query.some(query => message.includes(query))) {
        return training.response;
      }
    }
    return null;
  }

  // Enhanced simulated responses using training data
  simulateGeminiResponse(message, userRole, conversationHistory = []) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = this.generateEnhancedSimulatedResponse(message, userRole);
        resolve({
          success: true,
          content: response,
          usage: { totalTokenCount: Math.floor(Math.random() * 100) + 50 },
          model: 'gemini-pro-simulated'
        });
      }, 1000 + Math.random() * 2000);
    });
  }

  // Generate enhanced simulated responses using training data
  generateEnhancedSimulatedResponse(message, userRole) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific healthcare queries first
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      const condition = this.trainingData.COMMON_CONDITIONS.diabetes;
      return `I can help you with diabetes-related information! 

**Common Symptoms:**
${condition.symptoms.map(s => `• ${s}`).join('\n')}

**Recommended Tests:**
${condition.tests.map(t => `• ${t}`).join('\n')}

**Prevention Tips:**
${condition.prevention.map(p => `• ${p}`).join('\n')}

Would you like me to help you book a diabetes screening package or schedule a consultation with a specialist?`;
    }
    
    if (lowerMessage.includes('hypertension') || lowerMessage.includes('blood pressure') || lowerMessage.includes('high bp')) {
      const condition = this.trainingData.COMMON_CONDITIONS.hypertension;
      return `I can help you with hypertension (high blood pressure) information!

**Common Symptoms:**
${condition.symptoms.map(s => `• ${s}`).join('\n')}

**Recommended Tests:**
${condition.tests.map(t => `• ${t}`).join('\n')}

**Prevention Tips:**
${condition.prevention.map(p => `• ${p}`).join('\n')}

Would you like me to help you book a cardiovascular health checkup or schedule a consultation?`;
    }
    
    if (lowerMessage.includes('heart') || lowerMessage.includes('cardiac') || lowerMessage.includes('chest pain')) {
      const condition = this.trainingData.COMMON_CONDITIONS.cardiovascular;
      return `I can help you with cardiovascular health information!

**Common Symptoms:**
${condition.symptoms.map(s => `• ${s}`).join('\n')}

**Recommended Tests:**
${condition.tests.map(t => `• ${t}`).join('\n')}

**Prevention Tips:**
${condition.prevention.map(p => `• ${p}`).join('\n')}

Would you like me to help you book a cardiac health checkup or schedule a consultation with a cardiologist?`;
    }
    
    // Check for diagnostic service queries
    if (lowerMessage.includes('diagnostic') || lowerMessage.includes('test') || lowerMessage.includes('lab')) {
      const categories = this.trainingData.DIAGNOSTIC_CATEGORIES;
      const categoryNames = categories.map(cat => {
        const words = cat.split('-');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      });
      
      return `I can help you with diagnostic services! TakeCare offers comprehensive health checkups in these categories:

**Available Categories:**
${categoryNames.map(cat => `• ${cat}`).join('\n')}

**Features:**
• Home collection available
• Quick report delivery (usually 24-48 hours)
• Affordable packages with discounts
• Professional lab services
• Online report access

Would you like me to show you the diagnostic services section or help you choose a specific test category?`;
    }
    
    // Check for appointment queries
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      const types = this.trainingData.APPOINTMENT_TYPES;
      const consultationTypes = this.trainingData.CONSULTATION_TYPES;
      
      return `I can help you book an appointment! Here's what you need to know:

**Appointment Types:**
${types.map(type => `• ${type.charAt(0).toUpperCase() + type.slice(1)}`).join('\n')}

**Consultation Types:**
${consultationTypes.map(type => `• ${type.charAt(0).toUpperCase() + type.slice(1)}`).join('\n')}

**How to Book:**
1. Visit "Book Appointment" in your dashboard
2. Choose your preferred doctor
3. Select date & time from available slots
4. Choose appointment and consultation type
5. Add symptoms and reason for visit
6. Complete payment (Razorpay, cash, or insurance)

Would you like me to guide you to the appointment booking section?`;
    }
    
    // Check for teleconsultation queries
    if (lowerMessage.includes('teleconsultation') || lowerMessage.includes('video call') || lowerMessage.includes('online')) {
      return `TakeCare offers convenient teleconsultation services! Here's what you need to know:

**Benefits:**
• Consult from anywhere with internet access
• No travel time or transportation costs
• Secure, encrypted video calls
• Same quality care as in-person visits
• Digital prescription delivery
• Follow-up scheduling

**How it works:**
1. Book a teleconsultation appointment
2. Receive meeting link via email/SMS
3. Join the video call at scheduled time
4. Consult with your doctor
5. Receive digital prescription and recommendations

**Requirements:**
• Stable internet connection
• Quiet, private environment
• Valid ID proof
• Payment completed before consultation

Would you like me to help you book a teleconsultation appointment?`;
    }
    
    // Check for payment queries
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('razorpay')) {
      const methods = this.trainingData.PAYMENT_METHODS;
      
      return `TakeCare offers multiple secure payment options:

**Payment Methods:**
• **Razorpay**: Secure online payments (credit/debit cards, UPI, net banking, wallets)
• **Cash**: Pay at the clinic/hospital
• **Insurance**: Use your health insurance coverage

**What's covered:**
• Consultation fees
• Diagnostic test packages
• Health checkup packages
• Teleconsultation services
• Prescription medications

**Security Features:**
• All online payments are encrypted
• PCI DSS compliant
• Secure payment gateway
• Transaction receipts

Would you like me to help you with payment options for a specific service?`;
    }
    
    // Role-based responses using training data
    const roleResponses = {
      patient: {
        default: [
          "I'm here to help you with your healthcare needs! I can assist with appointments, diagnostics, medical records, and more. What would you like to know?",
          "Welcome to TakeCare! I can help you navigate the platform, book services, and access your health information. How may I assist you today?",
          "I'm your AI healthcare assistant! I can help you schedule appointments, book tests, and manage your health records. What do you need help with?"
        ]
      },
      doctor: {
        default: [
          "I'm here to support your medical practice! I can help you manage appointments, access patient records, and optimize your schedule. What do you need assistance with?",
          "Welcome to your doctor dashboard! I can help you manage patients, appointments, and practice operations. How may I help you today?",
          "I'm your AI practice assistant! I can help you streamline your workflow, manage patient care, and optimize your practice. What would you like to do?"
        ]
      },
      admin: {
        default: [
          "I'm here to help you manage the platform! I can assist with user management, system monitoring, and platform administration. What administrative task do you need help with?",
          "Welcome to the admin panel! I can help you monitor platform health, manage users, and maintain system security. How may I assist you today?",
          "I'm your AI platform assistant! I can help you optimize platform performance, manage user accounts, and maintain system stability. What do you need help with?"
        ]
      }
    };

    const responses = roleResponses[userRole]?.default || roleResponses.patient.default;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get conversation history from localStorage
  getConversationHistory() {
    try {
      const history = localStorage.getItem('chatbot_conversation_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  }

  // Save conversation history to localStorage
  saveConversationHistory(history) {
    try {
      // Keep only last N messages to prevent localStorage overflow
      const limitedHistory = history.slice(-CHATBOT_CONFIG.MAX_MESSAGES);
      localStorage.setItem('chatbot_conversation_history', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }

  // Clear conversation history
  clearConversationHistory() {
    try {
      localStorage.removeItem('chatbot_conversation_history');
      return { success: true, message: 'Conversation history cleared' };
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      return { success: false, message: 'Failed to clear conversation history' };
    }
  }

  // Get platform knowledge for specific queries
  getPlatformKnowledge(category) {
    return this.trainingData[category] || null;
  }

  // Suggest relevant services based on symptoms
  suggestServices(symptoms) {
    const suggestions = [];
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());
    
    if (lowerSymptoms.some(s => ['frequent urination', 'thirst', 'hunger', 'weight loss'].includes(s))) {
      suggestions.push('diabetes');
    }
    
    if (lowerSymptoms.some(s => ['headache', 'chest pain', 'dizziness'].includes(s))) {
      suggestions.push('hypertension');
      suggestions.push('cardiovascular');
    }
    
    if (lowerSymptoms.some(s => ['chest pain', 'shortness of breath', 'fatigue'].includes(s))) {
      suggestions.push('cardiovascular');
    }
    
    return suggestions;
  }
}

export default new ChatbotService(); 