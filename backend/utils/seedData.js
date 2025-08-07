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

    // Create sample doctors
    const doctors = [
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
        specialization: 'Pediatrics',
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
        specialization: 'Orthopedics',
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
        specialization: 'General Medicine',
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

    // Create availability records
    for (const availData of availabilityData) {
      const availability = new DoctorAvailability(availData);
      await availability.save();
    }
    console.log(`📅 Created availability for ${availabilityData.length} doctors`);

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