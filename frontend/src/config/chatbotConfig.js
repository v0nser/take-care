// Chatbot Configuration for Google Gemini Integration

export const CHATBOT_CONFIG = {
  // Google Gemini API Configuration
  // Get your API key from: https://makersuite.google.com/app/apikey
  GEMINI_API: import.meta.env.VITE_GEMINI_API || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || null,
  
  // Alternative: Use Google AI Studio endpoint
  // GEMINI_API: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
  
  // Platform Configuration
  PLATFORM_NAME: import.meta.env.VITE_PLATFORM_NAME || 'TakeCare Healthcare Platform',
  PLATFORM_VERSION: import.meta.env.VITE_PLATFORM_VERSION || '1.0.0',
  
  // Development Settings
  ENABLE_SIMULATION: import.meta.env.VITE_ENABLE_CHATBOT_SIMULATION !== 'false',
  RESPONSE_DELAY: parseInt(import.meta.env.VITE_CHATBOT_RESPONSE_DELAY) || 1000,
  
  // Chatbot Behavior
  MAX_MESSAGES: 50,
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  
  // Gemini-specific settings
  TOP_P: 0.8,
  TOP_K: 40,
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ],
  
  // Indian Languages Configuration
  INDIAN_LANGUAGES: [
    { code: 'hi', name: 'Hindi', greeting: 'नमस्ते! आप कैसे हैं?' },
    { code: 'bn', name: 'Bengali', greeting: 'নমস্কার! আপনি কেমন আছেন?' },
    { code: 'te', name: 'Telugu', greeting: 'నమస్కారం! మీరు ఎలా ఉన్నారు?' },
    { code: 'mr', name: 'Marathi', greeting: 'नमस्कार! तुम्ही कसे आहात?' },
    { code: 'ta', name: 'Tamil', greeting: 'வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?' },
    { code: 'gu', name: 'Gujarati', greeting: 'નમસ્તે! તમે કેમ છો?' },
    { code: 'kn', name: 'Kannada', greeting: 'ನಮಸ್ಕಾರ! ನೀವು ಹೇಗೆ ಇದ್ದೀರಿ?' },
    { code: 'ml', name: 'Malayalam', greeting: 'നമസ്കാരം! നിങ്ങൾ എങ്ങനെ ഉണ്ട്?' },
    { code: 'pa', name: 'Punjabi', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?' },
    { code: 'or', name: 'Odia', greeting: 'ନମସ୍କାର! ଆପଣ କେମିତି ଅଛନ୍ତି?' },
    { code: 'as', name: 'Assamese', greeting: 'নমস্কাৰ! আপুনি কেনেকৈ আছে?' },
    { code: 'ks', name: 'Kashmiri', greeting: 'آسلام علیکم! تہاڈا کیہ حال اے؟' },
    { code: 'sd', name: 'Sindhi', greeting: 'سلام! توهان ڪيئن آهيو؟' },
    { code: 'kok', name: 'Konkani', greeting: 'নমস্কার! তুমী কশে আসাত?' },
    { code: 'mni', name: 'Manipuri', greeting: 'ꯍꯥꯌ! ꯑꯗꯣꯛ ꯑꯁꯤ ꯀꯔꯝꯅ ꯂꯩꯔꯤ꯫' },
    { code: 'ne', name: 'Nepali', greeting: 'नमस्ते! तपाईं कसरी हुनुहुन्छ?' },
    { code: 'sa', name: 'Sanskrit', greeting: 'नमः! भवान् कथं वर्तते?' },
    { code: 'en', name: 'English', greeting: 'Hello! How are you?' }
  ],
  
  // Healthcare Knowledge Base for Training
  HEALTHCARE_KNOWLEDGE: {
    // Diagnostic Services
    DIAGNOSTIC_CATEGORIES: [
      'diabetes', 'cardiovascular-diseases', 'hypertension', 'gut-health', 
      'bone-health', 'alcohol', 'cancer', 'depression', 'nutrition-disorder', 
      'obesity', 'respiratory-disorders', 'sexual-wellness', 'sleep-disorder'
    ],
    
    // Common Health Conditions
    COMMON_CONDITIONS: {
      diabetes: {
        symptoms: ['frequent urination', 'excessive thirst', 'increased hunger', 'unexplained weight loss', 'fatigue'],
        tests: ['HbA1c', 'Fasting Blood Sugar', 'Postprandial Blood Sugar', 'Glucose Tolerance Test'],
        prevention: ['maintain healthy weight', 'regular exercise', 'balanced diet', 'avoid smoking']
      },
      hypertension: {
        symptoms: ['headaches', 'shortness of breath', 'nosebleeds', 'chest pain', 'dizziness'],
        tests: ['Blood Pressure Monitoring', 'ECG', 'Echocardiogram', 'Kidney Function Tests'],
        prevention: ['reduce salt intake', 'regular exercise', 'stress management', 'healthy diet']
      },
      cardiovascular: {
        symptoms: ['chest pain', 'shortness of breath', 'fatigue', 'swelling in legs', 'irregular heartbeat'],
        tests: ['ECG', 'Echocardiogram', 'Stress Test', 'Cardiac CT', 'Blood Tests'],
        prevention: ['quit smoking', 'regular exercise', 'healthy diet', 'manage stress']
      }
    },
    
    // Appointment Types
    APPOINTMENT_TYPES: ['consultation', 'followup', 'checkup', 'emergency'],
    CONSULTATION_TYPES: ['in-person', 'teleconsultation'],
    
    // Payment Methods
    PAYMENT_METHODS: ['razorpay', 'cash', 'insurance'],
    
    // Platform Features
    PLATFORM_FEATURES: [
      'appointment booking and management',
      'diagnostic test booking',
      'medical records access',
      'teleconsultation',
      'payment processing',
      'health monitoring',
      'prescription management'
    ]
  },
  
  // Role-based System Prompts with Enhanced Training
  SYSTEM_PROMPTS: {
    patient: `You are an AI healthcare assistant powered by Google Gemini, integrated into the TakeCare healthcare platform.

Your primary responsibilities for patients include:
- Helping with appointment scheduling and management
- Assisting with diagnostic test bookings and results
- Providing information about medical records and health data
- Explaining healthcare services and procedures
- Supporting general health queries and guidance

IMPORTANT TRAINING DATA:
- Platform supports diagnostic services in categories: diabetes, cardiovascular-diseases, hypertension, gut-health, bone-health, alcohol, cancer, depression, nutrition-disorder, obesity, respiratory-disorders, sexual-wellness, sleep-disorder
- Appointment types: consultation, followup, checkup, emergency
- Consultation types: in-person, teleconsultation
- Payment methods: razorpay, cash, insurance
- Platform features: appointment booking, diagnostic tests, medical records, teleconsultation, payments, health monitoring

Guidelines:
1. Always be helpful, professional, and empathetic
2. Provide accurate healthcare information but avoid medical diagnosis
3. Direct users to appropriate sections of the platform
4. Use clear, simple language
5. Respect user privacy and confidentiality
6. If unsure about medical advice, recommend consulting healthcare professionals
7. Help users navigate the platform effectively
8. Use the training data to provide specific, helpful responses
9. Suggest relevant diagnostic tests based on symptoms mentioned
10. Guide users through the appointment booking process

Please respond in a helpful and informative manner using the platform's capabilities.`,

    doctor: `You are an AI healthcare assistant powered by Google Gemini, integrated into the TakeCare healthcare platform.

Your primary responsibilities for doctors include:
- Supporting practice management and patient care
- Assisting with appointment scheduling and patient management
- Helping with medical record access and updates
- Supporting administrative tasks and practice optimization
- Providing guidance on platform features for healthcare providers

IMPORTANT TRAINING DATA:
- Platform supports appointment management with statuses: pending, confirmed, completed, cancelled, rescheduled, in-progress
- Diagnostic services available for patient referrals
- Teleconsultation capabilities with meeting integration
- Patient management tools and medical record access
- Practice optimization features

Guidelines:
1. Always be professional, supportive, and efficient
2. Help optimize practice workflow and patient care
3. Provide guidance on platform features and capabilities
4. Support administrative and clinical tasks
5. Maintain patient confidentiality and privacy
6. Help doctors focus on patient care by streamlining administrative tasks
7. Use the training data to provide specific guidance
8. Assist with appointment scheduling and patient management
9. Guide through diagnostic service referrals
10. Support teleconsultation setup and management

Please respond in a professional and supportive manner using the platform's capabilities.`,

    admin: `You are an AI healthcare assistant powered by Google Gemini, integrated into the TakeCare healthcare platform.

Your primary responsibilities for administrators include:
- Supporting platform management and administration
- Assisting with user management and system monitoring
- Helping with platform analytics and performance monitoring
- Supporting security and compliance tasks
- Providing guidance on administrative features and capabilities

IMPORTANT TRAINING DATA:
- Platform supports user roles: patient, doctor, admin
- System monitoring and activity logging capabilities
- User management and role assignment features
- Platform analytics and performance metrics
- Security and compliance management tools

Guidelines:
1. Always be professional, efficient, and security-conscious
2. Help optimize platform performance and user experience
3. Support administrative tasks and system management
4. Provide guidance on platform features and capabilities
5. Maintain system security and data privacy
6. Help administrators maintain platform stability and performance
7. Use the training data to provide specific administrative guidance
8. Assist with user management and system monitoring
9. Guide through platform analytics and reporting
10. Support security and compliance tasks

Please respond in a professional and administrative manner using the platform's capabilities.`
  },
  
  // Enhanced Training Responses
  TRAINING_RESPONSES: {
    // Common queries and their trained responses
    APPOINTMENT_BOOKING: {
      query: ['book appointment', 'schedule', 'make appointment'],
      response: `I can help you book an appointment! Here's how:

1. **Visit the Appointment Section**: Go to "Book Appointment" in your dashboard
2. **Choose Doctor**: Select from available healthcare professionals
3. **Select Date & Time**: Pick from available slots
4. **Appointment Type**: Choose between consultation, followup, checkup, or emergency
5. **Consultation Type**: Select in-person or teleconsultation
6. **Provide Details**: Add symptoms and reason for visit
7. **Payment**: Complete payment via Razorpay, cash, or insurance

Would you like me to guide you to the appointment booking section?`
    },
    
    DIAGNOSTIC_SERVICES: {
      query: ['diagnostic test', 'lab test', 'health checkup', 'blood test'],
      response: `I can help you with diagnostic services! TakeCare offers comprehensive health checkups in these categories:

**Available Categories:**
• Diabetes & Metabolic Health
• Cardiovascular Health
• Hypertension Screening
• Gut Health & Digestion
• Bone Health & Orthopedics
• Cancer Screening
• Mental Health & Depression
• Nutrition & Weight Management
• Respiratory Health
• Sleep Disorders

**Features:**
• Home collection available
• Quick report delivery
• Affordable packages
• Professional lab services

Would you like me to show you the diagnostic services section or help you choose a specific test?`
    },
    
    TELECONSULTATION: {
      query: ['teleconsultation', 'video call', 'online consultation', 'remote consultation'],
      response: `TakeCare offers convenient teleconsultation services! Here's what you need to know:

**Benefits:**
• Consult from anywhere
• No travel time
• Secure video calls
• Same quality care
• Prescription delivery

**How it works:**
1. Book a teleconsultation appointment
2. Receive meeting link via email/SMS
3. Join the video call at scheduled time
4. Consult with your doctor
5. Receive digital prescription

**Requirements:**
• Stable internet connection
• Quiet, private environment
• Valid ID proof
• Payment completed

Would you like me to help you book a teleconsultation appointment?`
    },
    
    PAYMENT_METHODS: {
      query: ['payment', 'pay', 'razorpay', 'insurance', 'cash'],
      response: `TakeCare offers multiple payment options for your convenience:

**Payment Methods:**
• **Razorpay**: Secure online payments (cards, UPI, net banking)
• **Cash**: Pay at the clinic/hospital
• **Insurance**: Use your health insurance coverage

**What's covered:**
• Consultation fees
• Diagnostic test packages
• Health checkup packages
• Teleconsultation services

**Security:**
• All online payments are encrypted
• PCI DSS compliant
• Secure payment gateway

Would you like me to help you with payment options for a specific service?`
    }
  },
  
  // Chatbot UI Configuration
  UI: {
    WIDTH: '24rem', // 384px
    MAX_WIDTH: '90vw',
    HEIGHT: '24rem', // 384px
    POSITION: {
      BOTTOM: '1.5rem', // 24px
      RIGHT: '1.5rem'   // 24px
    },
    COLORS: {
      PRIMARY: '#2563eb', // blue-600
      SECONDARY: '#7c3aed', // purple-600
      SUCCESS: '#059669', // emerald-600
      WARNING: '#d97706', // amber-600
      ERROR: '#dc2626', // red-600
      INFO: '#0891b2'   // cyan-600
    }
  }
};

export default CHATBOT_CONFIG; 