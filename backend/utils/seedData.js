import mongoose from 'mongoose';
import User from '../models/User.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import Appointment from '../models/Appointment.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await DoctorAvailability.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample doctors - covering ALL specialties
    const doctors = [
      // Existing doctors (updated specializations to match services data)
      {
        email: 'dr.sarah.wilson@takecare.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'doctor',
        specialization: 'Cardiology',
        experience: 12,
        consultationFee: 800,
        qualifications: [
          { degree: 'MBBS', institution: 'Harvard Medical School', year: 2008 },
          { degree: 'MD Cardiology', institution: 'Johns Hopkins', year: 2012 }
        ],
        languages: ['English', 'Spanish'],
        licenseNumber: 'MD12345',
        bio: 'Experienced cardiologist specializing in preventive heart care and cardiac interventions.',
        phone: '+1-555-0101',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.michael.chen@takecare.com',
        password: 'password123',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'doctor',
        specialization: 'Dermatology',
        experience: 8,
        consultationFee: 600,
        qualifications: [
          { degree: 'MBBS', institution: 'Stanford University', year: 2012 },
          { degree: 'MD Dermatology', institution: 'UCLA', year: 2016 }
        ],
        languages: ['English', 'Mandarin'],
        licenseNumber: 'MD12346',
        bio: 'Board-certified dermatologist with expertise in cosmetic and medical dermatology.',
        phone: '+1-555-0102',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.priya.sharma@takecare.com',
        password: 'password123',
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'doctor',
        specialization: 'Paediatrics',
        experience: 10,
        consultationFee: 500,
        qualifications: [
          { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2010 },
          { degree: 'MD Pediatrics', institution: 'AIIMS Delhi', year: 2014 }
        ],
        languages: ['English', 'Hindi', 'Bengali'],
        licenseNumber: 'MD12347',
        bio: 'Dedicated pediatrician committed to providing comprehensive care for children from infancy through adolescence.',
        phone: '+1-555-0103',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.james.rodriguez@takecare.com',
        password: 'password123',
        firstName: 'James',
        lastName: 'Rodriguez',
        role: 'doctor',
        specialization: 'Orthopaedics',
        experience: 15,
        consultationFee: 900,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Michigan', year: 2005 },
          { degree: 'MS Orthopedics', institution: 'Mayo Clinic', year: 2009 }
        ],
        languages: ['English', 'Spanish'],
        licenseNumber: 'MD12348',
        bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement procedures.',
        phone: '+1-555-0104',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.emily.johnson@takecare.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'doctor',
        specialization: 'Psychiatry',
        experience: 7,
        consultationFee: 700,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Pennsylvania', year: 2013 },
          { degree: 'MD Psychiatry', institution: 'Columbia University', year: 2017 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12349',
        bio: 'Psychiatrist focused on anxiety, depression, and cognitive behavioral therapy.',
        phone: '+1-555-0105',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.david.kim@takecare.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Kim',
        role: 'doctor',
        specialization: 'General Physician',
        experience: 5,
        consultationFee: 400,
        qualifications: [
          { degree: 'MBBS', institution: 'University of California, SF', year: 2016 },
          { degree: 'MD Internal Medicine', institution: 'UCSF', year: 2019 }
        ],
        languages: ['English', 'Korean'],
        licenseNumber: 'MD12350',
        bio: 'General practitioner providing comprehensive primary care services.',
        phone: '+1-555-0106',
        isActive: true,
        isEmailVerified: true
      },

      // Additional doctors for ALL remaining specialties
      {
        email: 'dr.anna.smith@takecare.com',
        password: 'password123',
        firstName: 'Anna',
        lastName: 'Smith',
        role: 'doctor',
        specialization: 'Obstetrics & Gynaecology',
        experience: 11,
        consultationFee: 850,
        qualifications: [
          { degree: 'MBBS', institution: 'Johns Hopkins', year: 2009 },
          { degree: 'MD Obstetrics & Gynecology', institution: 'Mayo Clinic', year: 2013 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12351',
        bio: 'Experienced OB-GYN specializing in high-risk pregnancies and reproductive health.',
        phone: '+1-555-0107',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.robert.jones@takecare.com',
        password: 'password123',
        firstName: 'Robert',
        lastName: 'Jones',
        role: 'doctor',
        specialization: 'ENT',
        experience: 9,
        consultationFee: 600,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Chicago', year: 2011 },
          { degree: 'MS ENT', institution: 'Northwestern', year: 2015 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12352',
        bio: 'ENT specialist focusing on ear, nose, and throat disorders with advanced surgical techniques.',
        phone: '+1-555-0108',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.lisa.wang@takecare.com',
        password: 'password123',
        firstName: 'Lisa',
        lastName: 'Wang',
        role: 'doctor',
        specialization: 'Neurology',
        experience: 13,
        consultationFee: 950,
        qualifications: [
          { degree: 'MBBS', institution: 'Yale University', year: 2007 },
          { degree: 'MD Neurology', institution: 'Harvard Medical School', year: 2011 }
        ],
        languages: ['English', 'Mandarin'],
        licenseNumber: 'MD12353',
        bio: 'Neurologist specializing in stroke care, epilepsy, and movement disorders.',
        phone: '+1-555-0109',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.ahmed.hassan@takecare.com',
        password: 'password123',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        role: 'doctor',
        specialization: 'Urology',
        experience: 12,
        consultationFee: 800,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Pennsylvania', year: 2008 },
          { degree: 'MS Urology', institution: 'Johns Hopkins', year: 2012 }
        ],
        languages: ['English', 'Arabic'],
        licenseNumber: 'MD12354',
        bio: 'Urologist with expertise in minimally invasive procedures and kidney stone treatment.',
        phone: '+1-555-0110',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.maria.garcia@takecare.com',
        password: 'password123',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'doctor',
        specialization: 'Gastroenterology',
        experience: 10,
        consultationFee: 750,
        qualifications: [
          { degree: 'MBBS', institution: 'UCLA', year: 2010 },
          { degree: 'MD Gastroenterology', institution: 'UCSF', year: 2014 }
        ],
        languages: ['English', 'Spanish'],
        licenseNumber: 'MD12355',
        bio: 'Gastroenterologist specializing in digestive disorders and endoscopic procedures.',
        phone: '+1-555-0111',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.thomas.brown@takecare.com',
        password: 'password123',
        firstName: 'Thomas',
        lastName: 'Brown',
        role: 'doctor',
        specialization: 'Pulmonology',
        experience: 8,
        consultationFee: 700,
        qualifications: [
          { degree: 'MBBS', institution: 'Duke University', year: 2012 },
          { degree: 'MD Pulmonology', institution: 'Mayo Clinic', year: 2016 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12356',
        bio: 'Pulmonologist expert in respiratory diseases and critical care medicine.',
        phone: '+1-555-0112',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.jennifer.davis@takecare.com',
        password: 'password123',
        firstName: 'Jennifer',
        lastName: 'Davis',
        role: 'doctor',
        specialization: 'Endocrinology',
        experience: 9,
        consultationFee: 750,
        qualifications: [
          { degree: 'MBBS', institution: 'Stanford University', year: 2011 },
          { degree: 'MD Endocrinology', institution: 'Harvard Medical School', year: 2015 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12357',
        bio: 'Endocrinologist specializing in diabetes management and hormone disorders.',
        phone: '+1-555-0113',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.kevin.miller@takecare.com',
        password: 'password123',
        firstName: 'Kevin',
        lastName: 'Miller',
        role: 'doctor',
        specialization: 'Nephrology',
        experience: 11,
        consultationFee: 800,
        qualifications: [
          { degree: 'MBBS', institution: 'Johns Hopkins', year: 2009 },
          { degree: 'MD Nephrology', institution: 'Cleveland Clinic', year: 2013 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12358',
        bio: 'Nephrologist with expertise in kidney diseases and dialysis care.',
        phone: '+1-555-0114',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.sophia.lee@takecare.com',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Lee',
        role: 'doctor',
        specialization: 'Neurosurgery',
        experience: 16,
        consultationFee: 1200,
        qualifications: [
          { degree: 'MBBS', institution: 'Harvard Medical School', year: 2004 },
          { degree: 'MS Neurosurgery', institution: 'Johns Hopkins', year: 2008 }
        ],
        languages: ['English', 'Korean'],
        licenseNumber: 'MD12359',
        bio: 'Neurosurgeon specializing in brain and spine surgery with minimally invasive techniques.',
        phone: '+1-555-0115',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.ryan.taylor@takecare.com',
        password: 'password123',
        firstName: 'Ryan',
        lastName: 'Taylor',
        role: 'doctor',
        specialization: 'Rheumatology',
        experience: 7,
        consultationFee: 650,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Michigan', year: 2013 },
          { degree: 'MD Rheumatology', institution: 'Mayo Clinic', year: 2017 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12360',
        bio: 'Rheumatologist expert in autoimmune diseases and joint disorders.',
        phone: '+1-555-0116',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.rachel.white@takecare.com',
        password: 'password123',
        firstName: 'Rachel',
        lastName: 'White',
        role: 'doctor',
        specialization: 'Ophthalmology',
        experience: 10,
        consultationFee: 750,
        qualifications: [
          { degree: 'MBBS', institution: 'Northwestern University', year: 2010 },
          { degree: 'MS Ophthalmology', institution: 'University of Chicago', year: 2014 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12361',
        bio: 'Ophthalmologist specializing in cataract surgery and retinal diseases.',
        phone: '+1-555-0117',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.mark.wilson@takecare.com',
        password: 'password123',
        firstName: 'Mark',
        lastName: 'Wilson',
        role: 'doctor',
        specialization: 'Surgical Gastroenterology',
        experience: 14,
        consultationFee: 1000,
        qualifications: [
          { degree: 'MBBS', institution: 'Yale University', year: 2006 },
          { degree: 'MS Surgical Gastroenterology', institution: 'Cleveland Clinic', year: 2010 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12362',
        bio: 'Surgical gastroenterologist specializing in complex abdominal surgeries.',
        phone: '+1-555-0118',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.linda.anderson@takecare.com',
        password: 'password123',
        firstName: 'Linda',
        lastName: 'Anderson',
        role: 'doctor',
        specialization: 'Infectious Disease',
        experience: 12,
        consultationFee: 850,
        qualifications: [
          { degree: 'MBBS', institution: 'Emory University', year: 2008 },
          { degree: 'MD Infectious Disease', institution: 'CDC Atlanta', year: 2012 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12363',
        bio: 'Infectious disease specialist with expertise in complex infections and immunocompromised patients.',
        phone: '+1-555-0119',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.peter.clark@takecare.com',
        password: 'password123',
        firstName: 'Peter',
        lastName: 'Clark',
        role: 'doctor',
        specialization: 'General Laparoscopic Surgeon',
        experience: 13,
        consultationFee: 950,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Pennsylvania', year: 2007 },
          { degree: 'MS General Surgery', institution: 'Johns Hopkins', year: 2011 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12364',
        bio: 'General and laparoscopic surgeon specializing in minimally invasive procedures.',
        phone: '+1-555-0120',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.sarah.psychology@takecare.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Thompson',
        role: 'doctor',
        specialization: 'Psychology',
        experience: 6,
        consultationFee: 600,
        qualifications: [
          { degree: 'PhD Psychology', institution: 'Stanford University', year: 2014 },
          { degree: 'Licensed Clinical Psychologist', institution: 'California Board', year: 2016 }
        ],
        languages: ['English'],
        licenseNumber: 'PSY12365',
        bio: 'Clinical psychologist specializing in cognitive behavioral therapy and trauma counseling.',
        phone: '+1-555-0121',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.daniel.oncology@takecare.com',
        password: 'password123',
        firstName: 'Daniel',
        lastName: 'Roberts',
        role: 'doctor',
        specialization: 'Medical Oncology',
        experience: 15,
        consultationFee: 1100,
        qualifications: [
          { degree: 'MBBS', institution: 'Harvard Medical School', year: 2005 },
          { degree: 'MD Medical Oncology', institution: 'Memorial Sloan Kettering', year: 2009 }
        ],
        languages: ['English'],
        licenseNumber: 'MD12366',
        bio: 'Medical oncologist specializing in cancer treatment and immunotherapy.',
        phone: '+1-555-0122',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.nina.diabetes@takecare.com',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Patel',
        role: 'doctor',
        specialization: 'Diabetology',
        experience: 8,
        consultationFee: 700,
        qualifications: [
          { degree: 'MBBS', institution: 'University of Mumbai', year: 2012 },
          { degree: 'MD Diabetology', institution: 'AIIMS Delhi', year: 2016 }
        ],
        languages: ['English', 'Hindi', 'Gujarati'],
        licenseNumber: 'MD12367',
        bio: 'Diabetologist expert in diabetes management and lifestyle interventions.',
        phone: '+1-555-0123',
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'dr.alex.dentist@takecare.com',
        password: 'password123',
        firstName: 'Alex',
        lastName: 'Johnson',
        role: 'doctor',
        specialization: 'Dentist',
        experience: 9,
        consultationFee: 550,
        qualifications: [
          { degree: 'DDS', institution: 'University of California, LA', year: 2011 },
          { degree: 'Advanced Cosmetic Dentistry', institution: 'UCLA', year: 2013 }
        ],
        languages: ['English'],
        licenseNumber: 'DDS12368',
        bio: 'General dentist with expertise in cosmetic dentistry and preventive oral care.',
        phone: '+1-555-0124',
        isActive: true,
        isEmailVerified: true
      }
    ];

    // Create doctors (let User model handle password hashing)
    const createdDoctors = [];
    for (const doctorData of doctors) {
      const doctor = new User(doctorData);
      await doctor.save();
      createdDoctors.push(doctor);
    }
    console.log(`👨‍⚕️ Created ${createdDoctors.length} doctors`);

    // Create sample patients
    const patients = [
      {
        email: 'john.doe@email.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'patient',
        phone: '+1-555-0201',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'male',
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1-555-0202'
        },
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'alice.smith@email.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'patient',
        phone: '+1-555-0203',
        dateOfBirth: new Date('1990-03-22'),
        gender: 'female',
        bloodGroup: 'A+',
        emergencyContact: {
          name: 'Bob Smith',
          relationship: 'Father',
          phone: '+1-555-0204'
        },
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'robert.brown@email.com',
        password: 'password123',
        firstName: 'Robert',
        lastName: 'Brown',
        role: 'patient',
        phone: '+1-555-0205',
        dateOfBirth: new Date('1978-11-08'),
        gender: 'male',
        bloodGroup: 'B+',
        emergencyContact: {
          name: 'Mary Brown',
          relationship: 'Wife',
          phone: '+1-555-0206'
        },
        address: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'jane.miller@email.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Miller',
        role: 'patient',
        phone: '+1-555-0207',
        dateOfBirth: new Date('1995-12-05'),
        gender: 'female',
        bloodGroup: 'AB-',
        emergencyContact: {
          name: 'Tom Miller',
          relationship: 'Brother',
          phone: '+1-555-0208'
        },
        address: {
          street: '321 Maple St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        isActive: true,
        isEmailVerified: true
      },
      {
        email: 'emily.jones@email.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Jones',
        role: 'patient',
        phone: '+1-555-0209',
        dateOfBirth: new Date('2000-07-19'),
        gender: 'female',
        bloodGroup: 'O-',
        emergencyContact: {
          name: 'Sarah Jones',
          relationship: 'Mother',
          phone: '+1-555-0210'
        },
        address: {
          street: '654 Cedar Ave',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        isActive: true,
        isEmailVerified: true
      }
    ];

    // Create patients (let User model handle password hashing)
    const createdPatients = [];
    for (const patientData of patients) {
      const patient = new User(patientData);
      await patient.save();
      createdPatients.push(patient);
    }
    console.log(`👤 Created ${createdPatients.length} patients`);

    // Create admin user
    const adminData = {
      email: 'admin@takecare.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1-555-0001',
      isActive: true,
      isEmailVerified: true
    };

    // Let the User model's pre-save middleware handle password hashing
    const admin = new User(adminData);
    await admin.save();
    console.log('👨‍💼 Created admin user');

    // Generate time slots for each day
    const generateTimeSlots = (startTime, endTime) => {
      const slots = [];
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const duration = 30; // 30 minutes
      const buffer = 10; // 10 minutes buffer
      const totalSlotTime = duration + buffer;

      let current = start;
      while (current < end) {
        const slotEnd = new Date(current.getTime() + (duration * 60000));
        if (slotEnd <= end) {
          slots.push({
            startTime: current.toTimeString().substring(0, 5),
            endTime: slotEnd.toTimeString().substring(0, 5),
            isBooked: false
          });
        }
        current = new Date(current.getTime() + (totalSlotTime * 60000));
      }
      return slots;
    };

    // Create availability for doctors
    const availabilityData = [
      // Dr. Sarah Wilson (Cardiology) - Mon, Wed, Fri
      {
        doctor: createdDoctors[0]._id,
        weeklySchedule: {
          monday: {
            isAvailable: true,
            slots: generateTimeSlots('09:00', '17:00')
          },
          tuesday: { isAvailable: false, slots: [] },
          wednesday: {
            isAvailable: true,
            slots: generateTimeSlots('10:00', '16:00')
          },
          thursday: { isAvailable: false, slots: [] },
          friday: {
            isAvailable: true,
            slots: generateTimeSlots('09:00', '15:00')
          },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 30,
        bufferTime: 10,
        maxAdvanceBooking: 30,
        isAcceptingNewPatients: true
      },
      // Dr. Michael Chen (Dermatology) - Tue, Thu, Sat
      {
        doctor: createdDoctors[1]._id,
        weeklySchedule: {
          monday: { isAvailable: false, slots: [] },
          tuesday: {
            isAvailable: true,
            slots: generateTimeSlots('10:00', '18:00')
          },
          wednesday: { isAvailable: false, slots: [] },
          thursday: {
            isAvailable: true,
            slots: generateTimeSlots('09:00', '17:00')
          },
          friday: { isAvailable: false, slots: [] },
          saturday: {
            isAvailable: true,
            slots: generateTimeSlots('10:00', '14:00')
          },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 30,
        bufferTime: 10,
        maxAdvanceBooking: 45,
        isAcceptingNewPatients: true
      },
      // Dr. Priya Sharma (Pediatrics) - Mon to Fri
      {
        doctor: createdDoctors[2]._id,
        weeklySchedule: {
          monday: {
            isAvailable: true,
            slots: generateTimeSlots('08:00', '16:00')
          },
          tuesday: {
            isAvailable: true,
            slots: generateTimeSlots('08:00', '16:00')
          },
          wednesday: {
            isAvailable: true,
            slots: generateTimeSlots('08:00', '16:00')
          },
          thursday: {
            isAvailable: true,
            slots: generateTimeSlots('08:00', '16:00')
          },
          friday: {
            isAvailable: true,
            slots: generateTimeSlots('08:00', '14:00')
          },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 30,
        bufferTime: 15,
        maxAdvanceBooking: 60,
        isAcceptingNewPatients: true
      },
      // Dr. James Rodriguez (Orthopedics) - Mon, Wed, Fri
      {
        doctor: createdDoctors[3]._id,
        weeklySchedule: {
          monday: {
            isAvailable: true,
            slots: generateTimeSlots('11:00', '19:00')
          },
          tuesday: { isAvailable: false, slots: [] },
          wednesday: {
            isAvailable: true,
            slots: generateTimeSlots('11:00', '19:00')
          },
          thursday: { isAvailable: false, slots: [] },
          friday: {
            isAvailable: true,
            slots: generateTimeSlots('11:00', '17:00')
          },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 45,
        bufferTime: 15,
        maxAdvanceBooking: 30,
        isAcceptingNewPatients: true
      },
      // Dr. Emily Johnson (Psychiatry) - Tue to Sat
      {
        doctor: createdDoctors[4]._id,
        weeklySchedule: {
          monday: { isAvailable: false, slots: [] },
          tuesday: {
            isAvailable: true,
            slots: generateTimeSlots('12:00', '20:00')
          },
          wednesday: {
            isAvailable: true,
            slots: generateTimeSlots('12:00', '20:00')
          },
          thursday: {
            isAvailable: true,
            slots: generateTimeSlots('12:00', '20:00')
          },
          friday: {
            isAvailable: true,
            slots: generateTimeSlots('12:00', '18:00')
          },
          saturday: {
            isAvailable: true,
            slots: generateTimeSlots('10:00', '16:00')
          },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 60,
        bufferTime: 0,
        maxAdvanceBooking: 21,
        isAcceptingNewPatients: true
      },
      // Dr. David Kim (General Medicine) - All weekdays
      {
        doctor: createdDoctors[5]._id,
        weeklySchedule: {
          monday: {
            isAvailable: true,
            slots: generateTimeSlots('07:00', '15:00')
          },
          tuesday: {
            isAvailable: true,
            slots: generateTimeSlots('07:00', '15:00')
          },
          wednesday: {
            isAvailable: true,
            slots: generateTimeSlots('07:00', '15:00')
          },
          thursday: {
            isAvailable: true,
            slots: generateTimeSlots('07:00', '15:00')
          },
          friday: {
            isAvailable: true,
            slots: generateTimeSlots('07:00', '13:00')
          },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        },
        defaultSlotDuration: 30,
        bufferTime: 10,
        maxAdvanceBooking: 14,
        isAcceptingNewPatients: true
      }
    ];

    // Create availability records for ALL doctors
    const allAvailabilityData = [];
    
    // Add the specific availability records for first 6 doctors
    allAvailabilityData.push(...availabilityData);
    
    // Generate basic availability for remaining doctors (index 6 onwards)
    for (let i = 6; i < createdDoctors.length; i++) {
      const doctor = createdDoctors[i];
      const schedulePattern = i % 4; // Cycle through 4 different patterns
      
      let weeklySchedule;
      let slotDuration = 30;
      
      if (doctor.specialization === 'Psychiatry' || doctor.specialization === 'Psychology') {
        slotDuration = 60;
      } else if (doctor.specialization === 'Neurosurgery' || doctor.specialization === 'Surgical Gastroenterology') {
        slotDuration = 45;
      }
      
      switch (schedulePattern) {
        case 0: // Mon, Wed, Fri
          weeklySchedule = {
            monday: { isAvailable: true, slots: generateTimeSlots('09:00', '17:00') },
            tuesday: { isAvailable: false, slots: [] },
            wednesday: { isAvailable: true, slots: generateTimeSlots('10:00', '16:00') },
            thursday: { isAvailable: false, slots: [] },
            friday: { isAvailable: true, slots: generateTimeSlots('09:00', '15:00') },
            saturday: { isAvailable: false, slots: [] },
            sunday: { isAvailable: false, slots: [] }
          };
          break;
        case 1: // Tue, Thu, Sat
          weeklySchedule = {
            monday: { isAvailable: false, slots: [] },
            tuesday: { isAvailable: true, slots: generateTimeSlots('10:00', '18:00') },
            wednesday: { isAvailable: false, slots: [] },
            thursday: { isAvailable: true, slots: generateTimeSlots('09:00', '17:00') },
            friday: { isAvailable: false, slots: [] },
            saturday: { isAvailable: true, slots: generateTimeSlots('10:00', '14:00') },
            sunday: { isAvailable: false, slots: [] }
          };
          break;
        case 2: // Mon to Fri
          weeklySchedule = {
            monday: { isAvailable: true, slots: generateTimeSlots('08:00', '16:00') },
            tuesday: { isAvailable: true, slots: generateTimeSlots('08:00', '16:00') },
            wednesday: { isAvailable: true, slots: generateTimeSlots('08:00', '16:00') },
            thursday: { isAvailable: true, slots: generateTimeSlots('08:00', '16:00') },
            friday: { isAvailable: true, slots: generateTimeSlots('08:00', '14:00') },
            saturday: { isAvailable: false, slots: [] },
            sunday: { isAvailable: false, slots: [] }
          };
          break;
        case 3: // Mon to Sat
          weeklySchedule = {
            monday: { isAvailable: true, slots: generateTimeSlots('08:00', '18:00') },
            tuesday: { isAvailable: true, slots: generateTimeSlots('08:00', '18:00') },
            wednesday: { isAvailable: true, slots: generateTimeSlots('08:00', '18:00') },
            thursday: { isAvailable: true, slots: generateTimeSlots('08:00', '18:00') },
            friday: { isAvailable: true, slots: generateTimeSlots('08:00', '16:00') },
            saturday: { isAvailable: true, slots: generateTimeSlots('09:00', '13:00') },
            sunday: { isAvailable: false, slots: [] }
          };
          break;
      }
      
      allAvailabilityData.push({
        doctor: doctor._id,
        weeklySchedule,
        defaultSlotDuration: slotDuration,
        bufferTime: slotDuration === 60 ? 10 : slotDuration === 45 ? 15 : 5,
        maxAdvanceBooking: 30,
        isAcceptingNewPatients: true
      });
    }
    
    // Create all availability records
    for (const availData of allAvailabilityData) {
      const availability = new DoctorAvailability(availData);
      await availability.save();
    }
    console.log(`📅 Created availability for ${allAvailabilityData.length} doctors`);

    // Create sample appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const sampleAppointments = [
      // Confirmed appointment
      {
        patient: createdPatients[0]._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        duration: 30,
        type: 'consultation',
        status: 'confirmed',
        reason: 'Chest pain and irregular heartbeat',
        symptoms: ['chest pain', 'palpitations', 'shortness of breath'],
        consultationFee: 800,
        meetingId: `takecare-meeting-${Date.now()}-1`,
        meetingLink: `https://meet.jit.si/takecare-meeting-${Date.now()}-1`,
        notes: {
          patient: 'Experiencing symptoms for the past week',
          doctor: 'Confirmed appointment for cardiac evaluation'
        }
      },
      // Pending appointment
      {
        patient: createdPatients[1]._id,
        doctor: createdDoctors[1]._id,
        appointmentDate: dayAfterTomorrow,
        appointmentTime: '14:00',
        duration: 30,
        type: 'consultation',
        status: 'pending',
        reason: 'Skin rash and irritation',
        symptoms: ['rash', 'itching', 'redness'],
        consultationFee: 600,
        notes: {
          patient: 'Rash appeared after using new skincare product'
        }
      },
      // Completed appointment
      {
        patient: createdPatients[2]._id,
        doctor: createdDoctors[2]._id,
        appointmentDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        appointmentTime: '11:00',
        duration: 30,
        type: 'followup',
        status: 'completed',
        reason: 'Child vaccination follow-up',
        symptoms: ['fever', 'irritability'],
        consultationFee: 500,
        diagnosis: 'Normal post-vaccination reaction',
        prescription: [
          {
            medicine: 'Paracetamol',
            dosage: '250mg',
            frequency: 'Every 6 hours',
            duration: '3 days',
            instructions: 'Only if fever persists'
          }
        ],
        notes: {
          patient: 'Follow-up after MMR vaccination',
          doctor: 'Normal reaction, advised monitoring'
        }
      }
    ];

    // Create appointments
    for (const appointmentData of sampleAppointments) {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
    }
    console.log(`📋 Created ${sampleAppointments.length} sample appointments`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('='.repeat(50));
    console.log('ADMIN:');
    console.log('  Email: admin@takecare.com');
    console.log('  Password: admin123');
    console.log('\nDOCTORS:');
    doctors.forEach((doctor, index) => {
      console.log(`  ${index + 1}. Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialization})`);
      console.log(`     Email: ${doctor.email}`);
      console.log(`     Password: password123`);
    });
    console.log('\nPATIENTS:');
    patients.forEach((patient, index) => {
      console.log(`  ${index + 1}. ${patient.firstName} ${patient.lastName}`);
      console.log(`     Email: ${patient.email}`);
      console.log(`     Password: password123`);
    });
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

export default seedData; 