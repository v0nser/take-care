// Comprehensive Training Data for TakeCare Healthcare Chatbot
// This file contains detailed healthcare knowledge and platform-specific information

export const CHATBOT_TRAINING_DATA = {
  // Platform Overview
  PLATFORM_INFO: {
    name: 'TakeCare Healthcare Platform',
    description: 'A comprehensive healthcare platform offering appointment booking, diagnostic services, teleconsultation, and medical record management',
    features: [
      'Appointment Management',
      'Diagnostic Services',
      'Teleconsultation',
      'Medical Records',
      'Payment Processing',
      'Health Monitoring',
      'Prescription Management'
    ],
    targetUsers: ['Patients', 'Doctors', 'Administrators', 'Healthcare Providers']
  },

  // Diagnostic Services Detailed Information
  DIAGNOSTIC_SERVICES: {
    categories: {
      diabetes: {
        name: 'Diabetes & Metabolic Health',
        description: 'Comprehensive screening and monitoring for diabetes and related metabolic conditions',
        tests: [
          'HbA1c (Glycated Hemoglobin)',
          'Fasting Blood Sugar',
          'Postprandial Blood Sugar',
          'Glucose Tolerance Test',
          'Insulin Level Test',
          'C-Peptide Test',
          'Kidney Function Tests',
          'Lipid Profile'
        ],
        packages: [
          'Basic Diabetes Screening',
          'Comprehensive Diabetes Panel',
          'Diabetes + Kidney Health',
          'Metabolic Syndrome Panel'
        ],
        symptoms: [
          'Frequent urination',
          'Excessive thirst',
          'Increased hunger',
          'Unexplained weight loss',
          'Fatigue',
          'Blurred vision',
          'Slow-healing sores',
          'Frequent infections'
        ],
        prevention: [
          'Maintain healthy weight',
          'Regular exercise (150 minutes/week)',
          'Balanced diet with low glycemic index',
          'Avoid smoking and excessive alcohol',
          'Regular health checkups',
          'Monitor blood sugar levels'
        ]
      },
      
      'cardiovascular-diseases': {
        name: 'Cardiovascular Health',
        description: 'Heart health screening and cardiovascular disease prevention',
        tests: [
          'ECG (Electrocardiogram)',
          'Echocardiogram',
          'Stress Test',
          'Cardiac CT Scan',
          'Cardiac MRI',
          'Troponin Test',
          'BNP Test',
          'Lipid Profile',
          'CRP Test'
        ],
        packages: [
          'Basic Heart Health',
          'Comprehensive Cardiac Panel',
          'Heart + Diabetes Screening',
          'Executive Health Checkup'
        ],
        symptoms: [
          'Chest pain or discomfort',
          'Shortness of breath',
          'Fatigue',
          'Swelling in legs/ankles',
          'Irregular heartbeat',
          'Dizziness',
          'Nausea',
          'Cold sweats'
        ],
        prevention: [
          'Quit smoking',
          'Regular exercise',
          'Heart-healthy diet',
          'Manage stress',
          'Control blood pressure',
          'Maintain healthy weight',
          'Limit alcohol intake'
        ]
      },
      
      hypertension: {
        name: 'Hypertension Screening',
        description: 'Blood pressure monitoring and hypertension management',
        tests: [
          'Blood Pressure Monitoring',
          '24-Hour Ambulatory BP',
          'ECG',
          'Echocardiogram',
          'Kidney Function Tests',
          'Thyroid Function Tests',
          'Lipid Profile',
          'Uric Acid Test'
        ],
        packages: [
          'Hypertension Screening',
          'BP + Heart Health',
          'Complete Health Checkup'
        ],
        symptoms: [
          'Headaches',
          'Shortness of breath',
          'Nosebleeds',
          'Chest pain',
          'Dizziness',
          'Vision problems',
          'Irregular heartbeat',
          'Anxiety'
        ],
        prevention: [
          'Reduce salt intake',
          'Regular exercise',
          'Stress management',
          'Healthy diet (DASH diet)',
          'Limit alcohol',
          'Quit smoking',
          'Regular monitoring'
        ]
      },
      
      'gut-health': {
        name: 'Gut Health & Digestion',
        description: 'Digestive system health and gastrointestinal screening',
        tests: [
          'Complete Blood Count',
          'Liver Function Tests',
          'Kidney Function Tests',
          'Stool Analysis',
          'H. Pylori Test',
          'Celiac Disease Test',
          'Inflammatory Markers',
          'Vitamin B12 Test'
        ],
        packages: [
          'Basic Digestive Health',
          'Comprehensive Gut Health',
          'Liver + Kidney Panel'
        ],
        symptoms: [
          'Abdominal pain',
          'Bloating',
          'Nausea',
          'Diarrhea',
          'Constipation',
          'Acid reflux',
          'Loss of appetite',
          'Weight loss'
        ],
        prevention: [
          'High-fiber diet',
          'Stay hydrated',
          'Regular exercise',
          'Manage stress',
          'Avoid processed foods',
          'Eat slowly',
          'Probiotic foods'
        ]
      }
    },
    
    generalFeatures: {
      homeCollection: 'Available for most tests',
      reportTime: '24-48 hours for most tests',
      fasting: 'Some tests require 8-12 hours fasting',
      preparation: 'Specific instructions provided before tests',
      onlineReports: 'Access reports through patient portal',
      doctorConsultation: 'Free consultation with test packages'
    }
  },

  // Appointment System
  APPOINTMENT_SYSTEM: {
    types: {
      consultation: {
        name: 'Consultation',
        description: 'First-time visit or general consultation',
        duration: '30-45 minutes',
        preparation: 'Bring previous medical records, list of symptoms'
      },
      followup: {
        name: 'Follow-up',
        description: 'Follow-up visit after treatment',
        duration: '15-30 minutes',
        preparation: 'Bring previous prescription, test results'
      },
      checkup: {
        name: 'Health Checkup',
        description: 'Routine health examination',
        duration: '45-60 minutes',
        preparation: 'Fasting may be required, bring ID proof'
      },
      emergency: {
        name: 'Emergency',
        description: 'Urgent medical attention',
        duration: 'As needed',
        preparation: 'Immediate attention, no preparation needed'
      }
    },
    
    consultationTypes: {
      'in-person': {
        name: 'In-Person Consultation',
        description: 'Physical visit to clinic/hospital',
        requirements: ['Valid ID proof', 'Previous medical records', 'Payment completed'],
        benefits: ['Direct physical examination', 'Immediate tests if needed', 'Personal interaction']
      },
      teleconsultation: {
        name: 'Teleconsultation',
        description: 'Online video consultation',
        requirements: ['Stable internet', 'Quiet environment', 'Valid ID proof', 'Payment completed'],
        benefits: ['No travel time', 'Consult from anywhere', 'Secure video calls', 'Digital prescriptions']
      }
    },
    
    bookingProcess: [
      'Select doctor and specialty',
      'Choose preferred date and time',
      'Select appointment type',
      'Choose consultation type',
      'Provide symptoms and reason',
      'Complete payment',
      'Receive confirmation'
    ]
  },

  // Payment System
  PAYMENT_SYSTEM: {
    methods: {
      razorpay: {
        name: 'Razorpay',
        description: 'Secure online payment gateway',
        accepted: ['Credit/Debit Cards', 'UPI', 'Net Banking', 'Digital Wallets', 'EMI'],
        security: ['PCI DSS Compliant', '256-bit encryption', 'Secure payment gateway'],
        benefits: ['Instant confirmation', 'Multiple payment options', 'Secure transactions']
      },
      cash: {
        name: 'Cash Payment',
        description: 'Pay at clinic/hospital',
        accepted: ['Indian Rupees'],
        process: ['Pay at reception', 'Get receipt', 'Schedule appointment'],
        benefits: ['No online setup required', 'Immediate payment', 'Traditional method']
      },
      insurance: {
        name: 'Health Insurance',
        description: 'Use your health insurance coverage',
        accepted: ['All major insurance providers'],
        process: ['Provide insurance details', 'Verification process', 'Co-pay if applicable'],
        benefits: ['Coverage for medical expenses', 'Reduced out-of-pocket costs', 'Comprehensive coverage']
      }
    },
    
    coverage: [
      'Consultation fees',
      'Diagnostic test packages',
      'Health checkup packages',
      'Teleconsultation services',
      'Prescription medications',
      'Follow-up consultations'
    ]
  },

  // Common Health Queries and Responses
  COMMON_QUERIES: {
    'how to book appointment': {
      query: ['book appointment', 'schedule', 'make appointment', 'how to book'],
      response: `I can help you book an appointment! Here's the step-by-step process:

**Booking Steps:**
1. **Access Dashboard**: Go to "Book Appointment" in your TakeCare dashboard
2. **Select Doctor**: Choose from available healthcare professionals by specialty
3. **Pick Date & Time**: Select from available appointment slots
4. **Choose Type**: Select appointment type (consultation, followup, checkup, emergency)
5. **Consultation Mode**: Choose in-person or teleconsultation
6. **Provide Details**: Add symptoms, reason for visit, and any notes
7. **Payment**: Complete payment via Razorpay, cash, or insurance
8. **Confirmation**: Receive appointment confirmation via email/SMS

**What You'll Need:**
• Valid ID proof
• Previous medical records (if any)
• Payment method
• List of symptoms or concerns

Would you like me to guide you to the appointment booking section?`
    },
    
    'diagnostic test information': {
      query: ['diagnostic test', 'lab test', 'health checkup', 'blood test', 'what tests'],
      response: `TakeCare offers comprehensive diagnostic services! Here's what's available:

**Test Categories:**
• **Diabetes & Metabolic Health**: HbA1c, Blood Sugar, Insulin tests
• **Cardiovascular Health**: ECG, Echo, Stress tests, Cardiac markers
• **Hypertension Screening**: BP monitoring, Kidney function, Heart health
• **Gut Health**: Liver function, Stool analysis, Digestive health
• **Bone Health**: Calcium, Vitamin D, Bone density tests
• **Mental Health**: Depression screening, Stress markers
• **Cancer Screening**: Various cancer markers and screening tests

**Package Features:**
• Home collection available
• Quick report delivery (24-48 hours)
• Affordable packages with discounts
• Professional lab services
• Online report access
• Free doctor consultation with packages

**Popular Packages:**
• Basic Health Checkup
• Executive Health Package
• Diabetes Screening
• Cardiac Health Package
• Complete Body Checkup

Would you like me to show you specific test categories or help you choose a package?`
    },
    
    'teleconsultation guide': {
      query: ['teleconsultation', 'video call', 'online consultation', 'remote consultation', 'how does it work'],
      response: `TakeCare's teleconsultation service lets you consult doctors from anywhere! Here's how it works:

**How Teleconsultation Works:**
1. **Book Appointment**: Schedule a teleconsultation appointment
2. **Receive Link**: Get meeting link via email/SMS before appointment
3. **Join Call**: Click the link at scheduled time to join video call
4. **Consult Doctor**: Have your consultation via secure video call
5. **Get Prescription**: Receive digital prescription and recommendations
6. **Follow-up**: Schedule follow-up if needed

**Benefits:**
• No travel time or costs
• Consult from anywhere with internet
• Secure, encrypted video calls
• Same quality care as in-person
• Digital prescription delivery
• Easy follow-up scheduling

**Requirements:**
• Stable internet connection
• Quiet, private environment
• Valid ID proof
• Payment completed before consultation
• Device with camera and microphone

**What to Prepare:**
• List of symptoms
• Previous medical records
• Current medications
• Questions for doctor
• Good lighting for video

Would you like me to help you book a teleconsultation appointment?`
    },
    
    'payment options': {
      query: ['payment', 'pay', 'razorpay', 'insurance', 'cash', 'how to pay'],
      response: `TakeCare offers multiple secure payment options for your convenience:

**Payment Methods:**

**1. Razorpay (Online)**
• Credit/Debit Cards (Visa, MasterCard, RuPay)
• UPI (Google Pay, PhonePe, Paytm)
• Net Banking (All major banks)
• Digital Wallets
• EMI options available
• Instant confirmation

**2. Cash Payment**
• Pay at clinic/hospital reception
• Get immediate receipt
• No online setup required
• Traditional payment method

**3. Health Insurance**
• All major insurance providers accepted
• Coverage verification process
• Co-pay may apply
• Reduced out-of-pocket costs

**What's Covered:**
• Consultation fees
• Diagnostic test packages
• Health checkup packages
• Teleconsultation services
• Prescription medications

**Security Features:**
• PCI DSS compliant
• 256-bit encryption
• Secure payment gateway
• Transaction receipts
• Payment confirmation

Would you like me to help you with payment options for a specific service?`
    }
  },

  // Platform Navigation Help
  PLATFORM_NAVIGATION: {
    sections: {
      dashboard: {
        name: 'Dashboard',
        description: 'Main overview of your health information and recent activities',
        features: ['Recent appointments', 'Upcoming consultations', 'Test results', 'Quick actions']
      },
      appointments: {
        name: 'Appointments',
        description: 'Manage all your appointments and consultations',
        features: ['Book new appointment', 'View upcoming', 'Reschedule', 'Cancel', 'History']
      },
      diagnostics: {
        name: 'Diagnostic Services',
        description: 'Book lab tests and health checkup packages',
        features: ['Browse tests', 'Book packages', 'View results', 'Download reports']
      },
      records: {
        name: 'Medical Records',
        description: 'Access your complete health history and medical documents',
        features: ['View history', 'Download reports', 'Share records', 'Track progress']
      },
      payments: {
        name: 'Payments',
        description: 'Manage all your payments and transactions',
        features: ['Payment history', 'Invoices', 'Refunds', 'Insurance claims']
      }
    },
    
    quickActions: [
      'Book Appointment',
      'Schedule Test',
      'View Results',
      'Download Report',
      'Contact Support',
      'Update Profile'
    ]
  },

  // Health Tips and Prevention
  HEALTH_TIPS: {
    general: [
      'Maintain regular exercise routine (150 minutes/week)',
      'Eat a balanced diet with fruits and vegetables',
      'Stay hydrated (8-10 glasses of water daily)',
      'Get 7-9 hours of quality sleep',
      'Manage stress through meditation or hobbies',
      'Avoid smoking and excessive alcohol',
      'Regular health checkups (annual)',
      'Maintain healthy weight'
    ],
    
    seasonal: {
      summer: [
        'Stay hydrated',
        'Avoid peak sun hours',
        'Use sunscreen',
        'Eat light meals',
        'Wear light clothing'
      ],
      monsoon: [
        'Avoid street food',
        'Drink boiled water',
        'Use mosquito protection',
        'Keep surroundings clean',
        'Avoid walking in water'
      ],
      winter: [
        'Stay warm',
        'Eat warm foods',
        'Exercise indoors',
        'Moisturize skin',
        'Get adequate vitamin D'
      ]
    }
  }
};

export default CHATBOT_TRAINING_DATA; 