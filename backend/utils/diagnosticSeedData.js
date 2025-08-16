import DiagnosticTest from '../models/DiagnosticTest.js';
import DiagnosticPackage from '../models/DiagnosticPackage.js';

const diagnosticTests = [
  {
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
    name: 'CA-125',
    category: 'Women Health',
    sampleType: 'Blood',
    fasting: false,
    price: 1200,
    description: 'Ovarian cancer marker test',
    preparation: 'No fasting required',
    reportTime: '48 hours',
    popular: false
  },
  {
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
    name: 'Alcohol Testing',
    category: 'Toxicology',
    sampleType: 'Blood',
    fasting: false,
    price: 1500,
    description: 'Detects alcohol in bloodstream',
    preparation: 'No preparation required',
    reportTime: '24 hours',
    popular: false
  }
];

const diagnosticPackages = [
  {
    name: 'Men Under 30',
    category: 'Age & Gender',
    description: 'Comprehensive health screening for young men',
    tests: [], // Will be populated with test IDs
    price: 2500,
    originalPrice: 3200,
    savings: 700,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Men 30-45',
    category: 'Age & Gender',
    description: 'Health assessment for men in prime working years',
    tests: [],
    price: 3500,
    originalPrice: 4500,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Men 45-60',
    category: 'Age & Gender',
    description: 'Comprehensive screening for middle-aged men',
    tests: [],
    price: 4500,
    originalPrice: 5800,
    savings: 1300,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Women Under 30',
    category: 'Age & Gender',
    description: 'Health screening for young women',
    tests: [],
    price: 2500,
    originalPrice: 3200,
    savings: 700,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Women 30-45',
    category: 'Age & Gender',
    description: 'Comprehensive health assessment for women',
    tests: [],
    price: 3500,
    originalPrice: 4500,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Diabetes Care Pack',
    category: 'Health Need',
    description: 'Complete diabetes monitoring and management',
    tests: [],
    price: 2800,
    originalPrice: 3800,
    savings: 1000,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  },
  {
    name: 'Liver Health Pack',
    category: 'Health Need',
    description: 'Comprehensive liver function assessment',
    tests: [],
    price: 2200,
    originalPrice: 2800,
    savings: 600,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: false
  },
  {
    name: 'Cardiac Wellness',
    category: 'Health Need',
    description: 'Complete heart health assessment',
    tests: [],
    price: 3000,
    originalPrice: 3900,
    savings: 900,
    preparation: '12 hours fasting required',
    reportTime: '24-48 hours',
    popular: true
  }
];

const seedDiagnosticData = async () => {
  try {
    console.log('🌱 Seeding diagnostic data...');

    // Clear existing data
    await DiagnosticTest.deleteMany({});
    await DiagnosticPackage.deleteMany({});

    // Insert tests
    const createdTests = await DiagnosticTest.insertMany(diagnosticTests);
    console.log(`✅ Created ${createdTests.length} diagnostic tests`);

    // Create test ID mapping for packages
    const testMap = {};
    createdTests.forEach(test => {
      testMap[test.name] = test._id;
    });

    // Update packages with test IDs
    const packagesWithTests = diagnosticPackages.map(pkg => {
      const pkgCopy = { ...pkg };
      
      // Assign tests based on package name
      switch (pkg.name) {
        case 'Men Under 30':
          pkgCopy.tests = [
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile'],
            testMap['Thyroid Profile'],
            testMap['Vitamin D (25-OH)']
          ];
          break;
        case 'Men 30-45':
          pkgCopy.tests = [
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile'],
            testMap['Thyroid Profile'],
            testMap['PSA (Prostate Specific Antigen)'],
            testMap['Vitamin D (25-OH)'],
            testMap['Alanine Transaminase (ALT)'],
            testMap['Alkaline Phosphatase (ALP)']
          ];
          break;
        case 'Men 45-60':
          pkgCopy.tests = [
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile'],
            testMap['Thyroid Profile'],
            testMap['PSA (Prostate Specific Antigen)'],
            testMap['Vitamin D (25-OH)'],
            testMap['Alanine Transaminase (ALT)'],
            testMap['Alkaline Phosphatase (ALP)'],
            testMap['Albumin'],
            testMap['HbA1c (Glycated Hemoglobin)']
          ];
          break;
        case 'Women Under 30':
          pkgCopy.tests = [
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile'],
            testMap['Thyroid Profile'],
            testMap['Vitamin D (25-OH)']
          ];
          break;
        case 'Women 30-45':
          pkgCopy.tests = [
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile'],
            testMap['Thyroid Profile'],
            testMap['CA-125'],
            testMap['Vitamin D (25-OH)'],
            testMap['Alanine Transaminase (ALT)'],
            testMap['Alkaline Phosphatase (ALP)']
          ];
          break;
        case 'Diabetes Care Pack':
          pkgCopy.tests = [
            testMap['Glucose Fasting'],
            testMap['Glucose Postprandial'],
            testMap['HbA1c (Glycated Hemoglobin)'],
            testMap['Urine Sugar'],
            testMap['C-Peptide'],
            testMap['Lipid Profile'],
            testMap['Alanine Transaminase (ALT)'],
            testMap['Albumin']
          ];
          break;
        case 'Liver Health Pack':
          pkgCopy.tests = [
            testMap['Alanine Transaminase (ALT)'],
            testMap['Alkaline Phosphatase (ALP)'],
            testMap['Albumin'],
            testMap['Complete Blood Count (CBC)'],
            testMap['Glucose Fasting'],
            testMap['Lipid Profile']
          ];
          break;
        case 'Cardiac Wellness':
          pkgCopy.tests = [
            testMap['Lipid Profile'],
            testMap['Glucose Fasting'],
            testMap['HbA1c (Glycated Hemoglobin)'],
            testMap['Complete Blood Count (CBC)'],
            testMap['Alanine Transaminase (ALT)'],
            testMap['Albumin']
          ];
          break;
        default:
          pkgCopy.tests = [];
      }
      
      return pkgCopy;
    });

    // Insert packages
    const createdPackages = await DiagnosticPackage.insertMany(packagesWithTests);
    console.log(`✅ Created ${createdPackages.length} diagnostic packages`);

    console.log('🎉 Diagnostic data seeding completed successfully!');
    return { tests: createdTests, packages: createdPackages };
  } catch (error) {
    console.error('❌ Error seeding diagnostic data:', error);
    throw error;
  }
};

export { seedDiagnosticData }; 