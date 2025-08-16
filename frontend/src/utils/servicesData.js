import { 
  Stethoscope, Heart, Brain, Eye, Baby, Bone, Ear, 
  Microscope, Shield, Wind, Pill, Zap, Dna, 
  Users, Activity, Droplets, Scissors, Bug,
  Syringe, Smile, TestTube, FileText, Package,
  Calendar, Clock, MapPin, Home, Building
} from 'lucide-react';

// Medical specialties data matching Apollo Healthcare 247 structure
export const medicalSpecialties = [
  {
    id: 'general-physician',
    name: 'General Physician',
    fullName: 'General Physician/ Internal Medicine',
    icon: Stethoscope,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Comprehensive primary healthcare for adults with focus on prevention, diagnosis, and treatment of a wide range of conditions.',
    services: [
      'Annual Health Checkups',
      'Chronic Disease Management',
      'Preventive Care',
      'Health Screenings',
      'Vaccinations',
      'Minor Procedures'
    ],
    conditions: [
      'Diabetes',
      'Hypertension',
      'Common Cold & Flu',
      'Digestive Issues',
      'Respiratory Infections',
      'General Health Issues'
    ],
    waitTime: '15-30 mins',
    consultationFee: '₹500-800',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    fullName: 'Dermatology',
    icon: Shield,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Specialized care for skin, hair, and nail conditions with advanced treatment options.',
    services: [
      'Skin Condition Treatment',
      'Cosmetic Dermatology',
      'Hair Loss Treatment',
      'Acne Treatment',
      'Skin Cancer Screening',
      'Laser Treatments'
    ],
    conditions: [
      'Acne & Pimples',
      'Eczema',
      'Psoriasis',
      'Hair Fall',
      'Skin Allergies',
      'Moles & Pigmentation'
    ],
    waitTime: '20-40 mins',
    consultationFee: '₹700-1200',
    availability: 'Mon-Fri',
    popular: true
  },
  {
    id: 'obstetrics-gynaecology',
    name: 'Obstetrics & Gynaecology',
    fullName: 'Obstetrics & Gynaecology',
    icon: Baby,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    description: "Women's health specialists providing comprehensive care for reproductive health, pregnancy, and childbirth.",
    services: [
      'Pregnancy Care',
      'Gynecological Exams',
      'Family Planning',
      'Menstrual Disorders',
      'Fertility Treatment',
      'Maternity Care'
    ],
    conditions: [
      'Pregnancy Complications',
      'PCOS',
      'Irregular Periods',
      'Infertility',
      'Menopause',
      'Urinary Infections'
    ],
    waitTime: '25-45 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    fullName: 'Orthopaedics',
    icon: Bone,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Specialized treatment for bones, joints, muscles, and sports-related injuries.',
    services: [
      'Joint Replacement',
      'Sports Medicine',
      'Fracture Treatment',
      'Spine Surgery',
      'Arthritis Care',
      'Physical Therapy'
    ],
    conditions: [
      'Back Pain',
      'Joint Pain',
      'Arthritis',
      'Sports Injuries',
      'Fractures',
      'Muscle Strains'
    ],
    waitTime: '30-50 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Sat',
    popular: false
  },
  {
    id: 'ent',
    name: 'ENT',
    fullName: 'ENT',
    icon: Ear,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    description: 'Expert care for ear, nose, and throat conditions with advanced diagnostic facilities.',
    services: [
      'Hearing Tests',
      'Sinus Treatment',
      'Throat Surgery',
      'Voice Disorders',
      'Sleep Apnea',
      'Allergy Treatment'
    ],
    conditions: [
      'Hearing Loss',
      'Sinus Problems',
      'Throat Infections',
      'Tonsillitis',
      'Voice Problems',
      'Ear Infections'
    ],
    waitTime: '20-35 mins',
    consultationFee: '₹600-1000',
    availability: 'Mon-Sat',
    popular: false
  },
  {
    id: 'neurology',
    name: 'Neurology',
    fullName: 'Neurology',
    icon: Brain,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Comprehensive care for brain, spine, and nervous system disorders.',
    services: [
      'Neurological Evaluation',
      'EEG Testing',
      'Stroke Care',
      'Headache Treatment',
      'Epilepsy Management',
      'Memory Disorders'
    ],
    conditions: [
      'Migraine',
      'Epilepsy',
      'Stroke',
      'Parkinson\'s Disease',
      'Multiple Sclerosis',
      'Memory Loss'
    ],
    waitTime: '35-60 mins',
    consultationFee: '₹1000-2000',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    fullName: 'Cardiology',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    description: 'Advanced cardiac care with state-of-the-art diagnostic and treatment facilities.',
    services: [
      'Heart Health Checkups',
      'ECG & Echo',
      'Angiography',
      'Cardiac Surgery',
      'Pacemaker Implant',
      'Heart Rehabilitation'
    ],
    conditions: [
      'Heart Disease',
      'High Blood Pressure',
      'Chest Pain',
      'Heart Attack',
      'Arrhythmia',
      'Heart Failure'
    ],
    waitTime: '40-60 mins',
    consultationFee: '₹1200-2500',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'urology',
    name: 'Urology',
    fullName: 'Urology',
    icon: Droplets,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Specialized care for urinary tract and male reproductive system conditions.',
    services: [
      'Kidney Stone Treatment',
      'Prostate Care',
      'Urinary Infections',
      'Male Fertility',
      'Incontinence Treatment',
      'Minimally Invasive Surgery'
    ],
    conditions: [
      'Kidney Stones',
      'UTI',
      'Prostate Problems',
      'Erectile Dysfunction',
      'Bladder Issues',
      'Male Infertility'
    ],
    waitTime: '25-40 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Sat',
    popular: false
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    fullName: 'Gastroenterology/GI medicine',
    icon: Activity,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Comprehensive digestive health care with advanced endoscopic procedures.',
    services: [
      'Endoscopy',
      'Colonoscopy',
      'Liver Disease Treatment',
      'IBD Management',
      'GERD Treatment',
      'Digestive Health'
    ],
    conditions: [
      'Acid Reflux',
      'IBS',
      'Liver Disease',
      'Ulcers',
      'Gallstones',
      'Digestive Disorders'
    ],
    waitTime: '30-45 mins',
    consultationFee: '₹900-1800',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    fullName: 'Psychiatry',
    icon: Brain,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    description: 'Mental health care with compassionate treatment for psychological conditions.',
    services: [
      'Mental Health Assessment',
      'Therapy Sessions',
      'Medication Management',
      'Counseling',
      'Addiction Treatment',
      'Crisis Intervention'
    ],
    conditions: [
      'Depression',
      'Anxiety',
      'Bipolar Disorder',
      'PTSD',
      'Addiction',
      'Sleep Disorders'
    ],
    waitTime: '45-60 mins',
    consultationFee: '₹1000-2000',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'paediatrics',
    name: 'Paediatrics',
    fullName: 'Paediatrics',
    icon: Baby,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Comprehensive healthcare for infants, children, and adolescents.',
    services: [
      'Child Health Checkups',
      'Vaccinations',
      'Growth Monitoring',
      'Developmental Assessment',
      'Pediatric Surgery',
      'Emergency Care'
    ],
    conditions: [
      'Common Cold',
      'Fever',
      'Growth Issues',
      'Behavioral Problems',
      'Allergies',
      'Childhood Infections'
    ],
    waitTime: '20-35 mins',
    consultationFee: '₹500-1000',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    fullName: 'Pulmonology/ Respiratory Medicine',
    icon: Wind,
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    description: 'Specialized care for respiratory and lung conditions with advanced diagnostics.',
    services: [
      'Lung Function Tests',
      'Bronchoscopy',
      'Asthma Management',
      'COPD Treatment',
      'Sleep Studies',
      'Respiratory Therapy'
    ],
    conditions: [
      'Asthma',
      'COPD',
      'Pneumonia',
      'Bronchitis',
      'Lung Cancer',
      'Sleep Apnea'
    ],
    waitTime: '30-45 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology',
    fullName: 'Endocrinology',
    icon: Pill,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    description: 'Hormone disorders and endocrine system specialized care.',
    services: [
      'Diabetes Management',
      'Thyroid Treatment',
      'Hormone Therapy',
      'Metabolic Disorders',
      'PCOS Treatment',
      'Growth Disorders'
    ],
    conditions: [
      'Diabetes',
      'Thyroid Disorders',
      'PCOS',
      'Obesity',
      'Hormone Imbalance',
      'Metabolic Syndrome'
    ],
    waitTime: '25-40 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'nephrology',
    name: 'Nephrology',
    fullName: 'Nephrology',
    icon: Droplets,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    description: 'Kidney and renal system specialized care with dialysis facilities.',
    services: [
      'Kidney Function Tests',
      'Dialysis',
      'Transplant Care',
      'Hypertension Management',
      'Chronic Kidney Disease',
      'Acute Kidney Injury'
    ],
    conditions: [
      'Chronic Kidney Disease',
      'Kidney Failure',
      'Kidney Stones',
      'High Blood Pressure',
      'Proteinuria',
      'Electrolyte Imbalance'
    ],
    waitTime: '35-50 mins',
    consultationFee: '₹1000-2000',
    availability: 'Mon-Sat',
    popular: false
  },
  {
    id: 'neurosurgery',
    name: 'Neurosurgery',
    fullName: 'Neurosurgery',
    icon: Zap,
    color: 'from-gray-600 to-gray-700',
    bgColor: 'bg-gray-50',
    description: 'Advanced surgical treatment for brain, spine, and nervous system disorders.',
    services: [
      'Brain Surgery',
      'Spine Surgery',
      'Tumor Removal',
      'Trauma Surgery',
      'Minimally Invasive Surgery',
      'Stereotactic Surgery'
    ],
    conditions: [
      'Brain Tumors',
      'Spinal Disorders',
      'Head Injuries',
      'Stroke',
      'Epilepsy',
      'Aneurysms'
    ],
    waitTime: '60-90 mins',
    consultationFee: '₹2000-5000',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'rheumatology',
    name: 'Rheumatology',
    fullName: 'Rheumatology',
    icon: Bone,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Specialized care for autoimmune and inflammatory joint conditions.',
    services: [
      'Arthritis Treatment',
      'Autoimmune Disease Care',
      'Joint Injections',
      'Biologic Therapy',
      'Pain Management',
      'Rehabilitation'
    ],
    conditions: [
      'Rheumatoid Arthritis',
      'Lupus',
      'Fibromyalgia',
      'Gout',
      'Osteoarthritis',
      'Psoriatic Arthritis'
    ],
    waitTime: '30-45 mins',
    consultationFee: '₹900-1800',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    fullName: 'Ophthalmology',
    icon: Eye,
    color: 'from-lime-500 to-lime-600',
    bgColor: 'bg-lime-50',
    description: 'Comprehensive eye care with advanced surgical and treatment options.',
    services: [
      'Eye Exams',
      'Cataract Surgery',
      'LASIK Surgery',
      'Retinal Treatment',
      'Glaucoma Care',
      'Pediatric Ophthalmology'
    ],
    conditions: [
      'Cataracts',
      'Glaucoma',
      'Diabetic Retinopathy',
      'Macular Degeneration',
      'Vision Problems',
      'Eye Infections'
    ],
    waitTime: '25-40 mins',
    consultationFee: '₹700-1500',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'surgical-gastroenterology',
    name: 'Surgical Gastroenterology',
    fullName: 'Surgical Gastroenterology',
    icon: Scissors,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    description: 'Advanced surgical treatment for digestive system disorders.',
    services: [
      'Laparoscopic Surgery',
      'Liver Surgery',
      'Pancreatic Surgery',
      'Colorectal Surgery',
      'Hernia Repair',
      'Gallbladder Surgery'
    ],
    conditions: [
      'Gallstones',
      'Hernia',
      'Liver Tumors',
      'Pancreatic Disorders',
      'Colorectal Cancer',
      'IBD Complications'
    ],
    waitTime: '45-60 mins',
    consultationFee: '₹1500-3000',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'infectious-disease',
    name: 'Infectious Disease',
    fullName: 'Infectious Disease',
    icon: Bug,
    color: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    description: 'Specialized care for infectious diseases and complex infections.',
    services: [
      'Infection Control',
      'Travel Medicine',
      'HIV Care',
      'Tuberculosis Treatment',
      'Antibiotic Therapy',
      'Vaccination'
    ],
    conditions: [
      'HIV/AIDS',
      'Tuberculosis',
      'Hepatitis',
      'Tropical Diseases',
      'Hospital Infections',
      'Immune Deficiency'
    ],
    waitTime: '30-45 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'general-laparoscopic-surgeon',
    name: 'General & Laparoscopic Surgeon',
    fullName: 'General & Laparoscopic Surgeon',
    icon: Scissors,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Minimally invasive surgical procedures with faster recovery times.',
    services: [
      'Laparoscopic Surgery',
      'General Surgery',
      'Appendectomy',
      'Hernia Repair',
      'Gallbladder Surgery',
      'Trauma Surgery'
    ],
    conditions: [
      'Appendicitis',
      'Hernia',
      'Gallbladder Disease',
      'Abdominal Injuries',
      'Surgical Emergencies',
      'Post-surgical Care'
    ],
    waitTime: '40-60 mins',
    consultationFee: '₹1200-2500',
    availability: 'Mon-Sat',
    popular: false
  },
  {
    id: 'psychology',
    name: 'Psychology',
    fullName: 'Psychology',
    icon: Users,
    color: 'from-indigo-600 to-indigo-700',
    bgColor: 'bg-indigo-50',
    description: 'Mental health support through counseling and psychological therapies.',
    services: [
      'Psychological Assessment',
      'Cognitive Therapy',
      'Behavioral Therapy',
      'Family Counseling',
      'Stress Management',
      'Mental Health Support'
    ],
    conditions: [
      'Anxiety',
      'Depression',
      'Stress',
      'Relationship Issues',
      'Behavioral Problems',
      'Learning Disabilities'
    ],
    waitTime: '45-60 mins',
    consultationFee: '₹800-1500',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'medical-oncology',
    name: 'Medical Oncology',
    fullName: 'Medical Oncology',
    icon: Microscope,
    color: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    description: 'Comprehensive cancer care with advanced treatment options.',
    services: [
      'Cancer Diagnosis',
      'Chemotherapy',
      'Immunotherapy',
      'Targeted Therapy',
      'Palliative Care',
      'Cancer Screening'
    ],
    conditions: [
      'Breast Cancer',
      'Lung Cancer',
      'Blood Cancer',
      'Solid Tumors',
      'Metastatic Cancer',
      'Cancer Prevention'
    ],
    waitTime: '60-90 mins',
    consultationFee: '₹2000-4000',
    availability: 'Mon-Fri',
    popular: false
  },
  {
    id: 'diabetology',
    name: 'Diabetology',
    fullName: 'Diabetology',
    icon: Syringe,
    color: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    description: 'Specialized diabetes care and management with comprehensive support.',
    services: [
      'Diabetes Management',
      'Blood Sugar Monitoring',
      'Insulin Therapy',
      'Diet Counseling',
      'Diabetic Complications',
      'Continuous Glucose Monitoring'
    ],
    conditions: [
      'Type 1 Diabetes',
      'Type 2 Diabetes',
      'Gestational Diabetes',
      'Diabetic Neuropathy',
      'Diabetic Retinopathy',
      'Pre-diabetes'
    ],
    waitTime: '25-40 mins',
    consultationFee: '₹700-1200',
    availability: 'Mon-Sat',
    popular: true
  },
  {
    id: 'dentist',
    name: 'Dentist',
    fullName: 'Dentist',
    icon: Smile,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    description: 'Comprehensive dental care for oral health and cosmetic treatments.',
    services: [
      'Dental Checkups',
      'Teeth Cleaning',
      'Fillings',
      'Root Canal',
      'Teeth Whitening',
      'Orthodontics'
    ],
    conditions: [
      'Tooth Decay',
      'Gum Disease',
      'Tooth Pain',
      'Dental Infections',
      'Misaligned Teeth',
      'Oral Health Issues'
    ],
    waitTime: '15-30 mins',
    consultationFee: '₹300-800',
    availability: 'Mon-Sat',
    popular: true
  }
];

// Diagnostic Tests Data
export const diagnosticTests = [
  {
    id: 'glucose-fasting',
    name: 'Glucose Fasting',
    category: 'Diabetes',
    sampleType: 'Blood',
    fasting: true,
    price: 150,
    description: 'Measures blood sugar levels after 8-12 hours of fasting',
    preparation: 'Fast for 8-12 hours before test',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'glucose-postprandial',
    name: 'Glucose Postprandial',
    category: 'Diabetes',
    sampleType: 'Blood',
    fasting: false,
    price: 150,
    description: 'Measures blood sugar levels 2 hours after meal',
    preparation: 'Eat normal meal, test after 2 hours',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Diabetes',
    sampleType: 'Blood',
    fasting: false,
    price: 800,
    description: 'Measures average blood sugar over 2-3 months',
    preparation: 'No fasting required',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    category: 'General Health',
    sampleType: 'Blood',
    fasting: false,
    price: 400,
    description: 'Complete blood cell analysis including RBC, WBC, platelets',
    preparation: 'No fasting required',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'urine-sugar',
    name: 'Urine Sugar',
    category: 'Diabetes',
    sampleType: 'Urine',
    fasting: false,
    price: 100,
    description: 'Detects glucose in urine sample',
    preparation: 'First morning urine preferred',
    reportTime: '4 hours',
    popular: false
  },
  {
    id: 'g6pd',
    name: 'G6PD Test',
    category: 'Blood Disorders',
    sampleType: 'Blood',
    fasting: false,
    price: 600,
    description: 'Tests for glucose-6-phosphate dehydrogenase deficiency',
    preparation: 'No fasting required',
    reportTime: '48 hours',
    popular: false
  },
  {
    id: 'c-peptide',
    name: 'C-Peptide',
    category: 'Diabetes',
    sampleType: 'Blood',
    fasting: true,
    price: 1200,
    description: 'Measures insulin production in pancreas',
    preparation: 'Fast for 8-12 hours before test',
    reportTime: '48 hours',
    popular: false
  },
  {
    id: 'alp',
    name: 'Alkaline Phosphatase (ALP)',
    category: 'Liver Health',
    sampleType: 'Blood',
    fasting: true,
    price: 300,
    description: 'Liver and bone enzyme test',
    preparation: 'Fast for 8-12 hours before test',
    reportTime: '24 hours',
    popular: false
  },
  {
    id: 'alt',
    name: 'Alanine Transaminase (ALT)',
    category: 'Liver Health',
    sampleType: 'Blood',
    fasting: true,
    price: 300,
    description: 'Liver function test',
    preparation: 'Fast for 8-12 hours before test',
    reportTime: '24 hours',
    popular: false
  },
  {
    id: 'albumin',
    name: 'Albumin',
    category: 'Liver Health',
    sampleType: 'Blood',
    fasting: true,
    price: 250,
    description: 'Protein level in blood',
    preparation: 'Fast for 8-12 hours before test',
    reportTime: '24 hours',
    popular: false
  },
  {
    id: 'alcohol-testing',
    name: 'Alcohol Testing',
    category: 'Toxicology',
    sampleType: 'Blood',
    fasting: false,
    price: 1500,
    description: 'Detects alcohol in bloodstream',
    preparation: 'No preparation required',
    reportTime: '24 hours',
    popular: false
  },
  {
    id: 'lipid-profile',
    name: 'Lipid Profile',
    category: 'Cardiovascular',
    sampleType: 'Blood',
    fasting: true,
    price: 600,
    description: 'Complete cholesterol and triglyceride analysis',
    preparation: 'Fast for 12-14 hours before test',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'thyroid-profile',
    name: 'Thyroid Profile',
    category: 'Endocrinology',
    sampleType: 'Blood',
    fasting: false,
    price: 800,
    description: 'TSH, T3, T4 levels for thyroid function',
    preparation: 'No fasting required',
    reportTime: '24 hours',
    popular: true
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D (25-OH)',
    category: 'Nutrition',
    sampleType: 'Blood',
    fasting: false,
    price: 1200,
    description: 'Vitamin D deficiency screening',
    preparation: 'No fasting required',
    reportTime: '48 hours',
    popular: true
  },
  {
    id: 'psa',
    name: 'PSA (Prostate Specific Antigen)',
    category: 'Men Health',
    sampleType: 'Blood',
    fasting: false,
    price: 800,
    description: 'Prostate cancer screening test',
    preparation: 'No fasting required',
    reportTime: '24 hours',
    popular: false
  },
  {
    id: 'ca-125',
    name: 'CA-125',
    category: 'Women Health',
    sampleType: 'Blood',
    fasting: false,
    price: 1200,
    description: 'Ovarian cancer marker test',
    preparation: 'No fasting required',
    reportTime: '48 hours',
    popular: false
  }
];

// Diagnostic Conditions Data
export const diagnosticConditions = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    icon: Syringe,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    description: 'Comprehensive diabetes screening and monitoring',
    tests: ['glucose-fasting', 'glucose-postprandial', 'hba1c', 'urine-sugar', 'c-peptide'],
    symptoms: ['Frequent urination', 'Increased thirst', 'Fatigue', 'Blurred vision'],
    popular: true
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular Health',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    description: 'Heart and blood vessel health assessment',
    tests: ['lipid-profile', 'cbc', 'glucose-fasting'],
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Swelling'],
    popular: true
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    icon: Activity,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Blood pressure monitoring and related tests',
    tests: ['lipid-profile', 'glucose-fasting', 'cbc', 'albumin'],
    symptoms: ['Headache', 'Dizziness', 'Chest pain', 'Vision problems'],
    popular: true
  },
  {
    id: 'gut-health',
    name: 'Gut Health',
    icon: Activity,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Digestive system and gut microbiome assessment',
    tests: ['cbc', 'albumin', 'alt', 'alp'],
    symptoms: ['Abdominal pain', 'Bloating', 'Diarrhea', 'Constipation'],
    popular: false
  },
  {
    id: 'bone-health',
    name: 'Bone Health',
    icon: Bone,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Bone density and calcium metabolism tests',
    tests: ['vitamin-d', 'alp', 'albumin'],
    symptoms: ['Bone pain', 'Fractures', 'Loss of height', 'Back pain'],
    popular: false
  },
  {
    id: 'cancer',
    name: 'Cancer Screening',
    icon: Microscope,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Early detection and monitoring of various cancers',
    tests: ['psa', 'ca-125', 'cbc', 'albumin'],
    symptoms: ['Unexplained weight loss', 'Fatigue', 'Pain', 'Lumps'],
    popular: true
  },
  {
    id: 'depression',
    name: 'Depression & Mental Health',
    icon: Brain,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Mental health assessment and monitoring',
    tests: ['vitamin-d', 'thyroid-profile', 'cbc'],
    symptoms: ['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep changes'],
    popular: false
  },
  {
    id: 'liver-health',
    name: 'Liver Health',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Liver function and disease screening',
    tests: ['alt', 'alp', 'albumin', 'cbc'],
    symptoms: ['Jaundice', 'Abdominal pain', 'Fatigue', 'Nausea'],
    popular: true
  },
  {
    id: 'kidney-health',
    name: 'Kidney Health',
    icon: Droplets,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Kidney function and disease assessment',
    tests: ['albumin', 'cbc', 'urine-sugar'],
    symptoms: ['Swelling', 'Fatigue', 'Urination changes', 'Back pain'],
    popular: false
  }
];

// Diagnostic Packages Data
export const diagnosticPackages = [
  {
    id: 'men-under-30',
    name: 'Men Under 30',
    category: 'Age & Gender',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Comprehensive health screening for young men',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'vitamin-d'],
    price: 2500,
    originalPrice: 3200,
    savings: 700,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'men-30-45',
    name: 'Men 30-45',
    category: 'Age & Gender',
    icon: Users,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    description: 'Health assessment for men in prime working years',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'psa', 'vitamin-d', 'alt', 'alp'],
    price: 3500,
    originalPrice: 4500,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'men-45-60',
    name: 'Men 45-60',
    category: 'Age & Gender',
    icon: Users,
    color: 'from-blue-700 to-blue-800',
    bgColor: 'bg-blue-50',
    description: 'Comprehensive screening for middle-aged men',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'psa', 'vitamin-d', 'alt', 'alp', 'albumin', 'hba1c'],
    price: 4500,
    originalPrice: 5800,
    savings: 1300,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'women-under-30',
    name: 'Women Under 30',
    category: 'Age & Gender',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Health screening for young women',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'vitamin-d'],
    price: 2500,
    originalPrice: 3200,
    savings: 700,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'women-30-45',
    name: 'Women 30-45',
    category: 'Age & Gender',
    icon: Users,
    color: 'from-pink-600 to-pink-700',
    bgColor: 'bg-pink-50',
    description: 'Comprehensive health assessment for women',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'ca-125', 'vitamin-d', 'alt', 'alp'],
    price: 3500,
    originalPrice: 4500,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'diabetes-care',
    name: 'Diabetes Care Pack',
    category: 'Health Need',
    icon: Syringe,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    description: 'Complete diabetes monitoring and management',
    tests: ['glucose-fasting', 'glucose-postprandial', 'hba1c', 'urine-sugar', 'c-peptide', 'lipid-profile', 'alt', 'albumin'],
    price: 2800,
    originalPrice: 3800,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'liver-health-pack',
    name: 'Liver Health Pack',
    category: 'Health Need',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Comprehensive liver function assessment',
    tests: ['alt', 'alp', 'albumin', 'cbc', 'glucose-fasting', 'lipid-profile'],
    price: 2200,
    originalPrice: 2800,
    savings: 600,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: false
  },
  {
    id: 'neuromuscular',
    name: 'Neuromuscular Pack',
    category: 'Health Need',
    icon: Brain,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Nerve and muscle health assessment',
    tests: ['cbc', 'vitamin-d', 'thyroid-profile', 'alt', 'albumin'],
    price: 2000,
    originalPrice: 2600,
    savings: 600,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: false
  },
  {
    id: 'cardiac-wellness',
    name: 'Cardiac Wellness',
    category: 'Health Need',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    description: 'Complete heart health assessment',
    tests: ['lipid-profile', 'glucose-fasting', 'hba1c', 'cbc', 'alt', 'albumin'],
    price: 3000,
    originalPrice: 3900,
    savings: 900,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    id: 'executive-health',
    name: 'Executive Health',
    category: 'Health Need',
    icon: Users,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Premium health screening for executives',
    tests: ['cbc', 'glucose-fasting', 'lipid-profile', 'thyroid-profile', 'psa', 'ca-125', 'vitamin-d', 'alt', 'alp', 'albumin', 'hba1c'],
    price: 5500,
    originalPrice: 7200,
    savings: 1700,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: false
  }
];

// Sample Types
export const sampleTypes = [
  { id: 'blood', name: 'Blood', icon: TestTube, color: 'text-red-500' },
  { id: 'urine', name: 'Urine', icon: Droplets, color: 'text-yellow-500' },
  { id: 'stool', name: 'Stool', icon: FileText, color: 'text-brown-500' },
  { id: 'saliva', name: 'Saliva', icon: Activity, color: 'text-blue-500' },
  { id: 'tissue', name: 'Tissue', icon: Microscope, color: 'text-purple-500' }
];

// Collection Types
export const collectionTypes = [
  {
    id: 'lab-visit',
    name: 'Lab Visit',
    icon: Building,
    description: 'Visit our nearest lab for sample collection',
    available: true,
    isMain: true
  },
  {
    id: 'home-collection',
    name: 'Home Collection',
    icon: Home,
    description: 'Sample collection at your doorstep',
    available: false,
    isMain: false,
    note: 'Coming Soon'
  }
];

// Get popular specialties
export const getPopularSpecialties = () => {
  return medicalSpecialties.filter(specialty => specialty.popular);
};

// Get specialty by ID
export const getSpecialtyById = (id) => {
  return medicalSpecialties.find(specialty => specialty.id === id);
};

// Get all specialty names for dropdown/filter
export const getAllSpecialtyNames = () => {
  return medicalSpecialties.map(specialty => specialty.name);
};

// Search specialties
export const searchSpecialties = (query) => {
  const searchTerm = query.toLowerCase();
  return medicalSpecialties.filter(specialty => 
    specialty.name.toLowerCase().includes(searchTerm) ||
    specialty.fullName.toLowerCase().includes(searchTerm) ||
    specialty.description.toLowerCase().includes(searchTerm) ||
    specialty.conditions.some(condition => condition.toLowerCase().includes(searchTerm))
  );
}; 

// Get popular tests
export const getPopularTests = () => {
  return diagnosticTests.filter(test => test.popular);
};

// Get tests by category
export const getTestsByCategory = (category) => {
  return diagnosticTests.filter(test => test.category === category);
};

// Get tests by sample type
export const getTestsBySampleType = (sampleType) => {
  return diagnosticTests.filter(test => test.sampleType === sampleType);
};

// Get popular packages
export const getPopularPackages = () => {
  return diagnosticPackages.filter(pkg => pkg.popular);
};

// Get packages by category
export const getPackagesByCategory = (category) => {
  return diagnosticPackages.filter(pkg => pkg.category === category);
};

// Get test by ID
export const getTestById = (id) => {
  return diagnosticTests.find(test => test.id === id);
};

// Get package by ID
export const getPackageById = (id) => {
  return diagnosticPackages.find(pkg => pkg.id === id);
};

// Search tests
export const searchTests = (query) => {
  const searchTerm = query.toLowerCase();
  return diagnosticTests.filter(test => 
    test.name.toLowerCase().includes(searchTerm) ||
    test.category.toLowerCase().includes(searchTerm) ||
    test.description.toLowerCase().includes(searchTerm)
  );
};

// Search packages
export const searchPackages = (query) => {
  const searchTerm = query.toLowerCase();
  return diagnosticPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm) ||
    pkg.category.toLowerCase().includes(searchTerm) ||
    pkg.description.toLowerCase().includes(searchTerm)
  );
};

// Check fasting requirements
export const checkFastingRequirements = (testIds) => {
  const tests = testIds.map(id => getTestById(id)).filter(Boolean);
  const fastingTests = tests.filter(test => test.fasting);
  
  if (fastingTests.length > 0) {
    const currentHour = new Date().getHours();
    if (currentHour >= 12) {
      return {
        warning: true,
        message: `Warning: ${fastingTests.map(t => t.name).join(', ')} require fasting. Consider booking for morning slots.`,
        tests: fastingTests
      };
    }
  }
  
  return { warning: false };
}; 