// Add some test data to MongoDB for development
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

async function seedTestData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/manyani_rentals');
    
    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    
    // Create test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+254700000001',
      password: 'password123',
      nationalId: '12345678',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      role: 'tenant',
      isVerified: true,
      isActive: true
    });
    
    // Create test landlord
    const landlord = await User.create({
      firstName: 'John',
      lastName: 'Kamau',
      email: 'landlord@example.com',
      phone: '+254700000002',
      password: 'password123',
      nationalId: '87654321',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'male',
      role: 'landlord',
      isVerified: true,
      isActive: true
    });
    
    // Create test properties
    const property1 = await Property.create({
      name: 'Green Valley Apartments',
      description: 'Modern luxury apartments in Nairobi',
      type: 'apartment',
      address: {
        street: '123 Moi Avenue',
        city: 'Nairobi',
        county: 'Nairobi County',
        postalCode: '00100'
      },
      buildingName: 'Green Valley Towers',
      totalUnits: 12,
      availableUnits: 3,
      floors: 8,
      yearBuilt: 2020,
      units: [
        {
          unitNumber: '4B',
          floor: 4,
          bedrooms: 2,
          bathrooms: 1,
          size: 850,
          price: 35000,
          deposit: 70000,
          status: 'available',
          features: ['Balcony', 'AC', 'Fitted Kitchen']
        },
        {
          unitNumber: '7A',
          floor: 7,
          bedrooms: 3,
          bathrooms: 2,
          size: 1200,
          price: 55000,
          deposit: 110000,
          status: 'available',
          features: ['Penthouse', 'Panoramic View']
        }
      ],
      amenities: {
        water: true,
        electricity: true,
        wifi: true,
        parking: true,
        security: true,
        gym: true,
        laundry: true,
        elevator: true
      },
      amenityCosts: {
        water: 1500,
        electricity: 3000,
        garbage: 500,
        maintenance: 2000,
        security: 1000,
        parking: 2000
      },
      landlord: landlord._id,
      policies: {
        petsAllowed: false,
        smokingAllowed: false,
        maxOccupants: 4,
        noticePeriod: 30
      },
      isActive: true
    });
    
    const property2 = await Property.create({
      name: 'Royal Gardens Estate',
      description: 'Luxury houses with gardens in Mombasa',
      type: 'house',
      address: {
        street: '456 Nyali Road',
        city: 'Mombasa',
        county: 'Mombasa County',
        postalCode: '80100'
      },
      buildingName: 'Royal Gardens',
      totalUnits: 8,
      availableUnits: 1,
      floors: 2,
      yearBuilt: 2018,
      units: [
        {
          unitNumber: 'B1',
          floor: 1,
          bedrooms: 3,
          bathrooms: 2,
          size: 1200,
          price: 85000,
          deposit: 170000,
          status: 'available',
          features: ['Garden', 'Garage', 'Swimming Pool']
        }
      ],
      amenities: {
        water: true,
        electricity: true,
        wifi: true,
        parking: true,
        security: true,
        gym: true,
        pool: true,
        laundry: true
      },
      amenityCosts: {
        water: 2000,
        electricity: 4000,
        garbage: 800,
        maintenance: 3000,
        security: 1500,
        parking: 3000
      },
      landlord: landlord._id,
      policies: {
        petsAllowed: true,
        smokingAllowed: false,
        maxOccupants: 6,
        noticePeriod: 60
      },
      isActive: true
    });
    
    // Create a test booking
    const booking = await Booking.create({
      bookingNumber: 'MANY241200001',
      property: property1._id,
      unit: {
        unitNumber: '4B',
        unitId: property1.units[0]._id
      },
      tenant: testUser._id,
      moveInDate: new Date('2024-01-15'),
      leaseStartDate: new Date('2024-01-15'),
      leaseEndDate: new Date('2024-12-14'),
      monthlyRent: 35000,
      securityDeposit: 70000,
      amenityFees: property1.amenityCosts,
      totalMonthlyFee: 35000 + Object.values(property1.amenityCosts).reduce((a, b) => a + b, 0),
      status: 'active'
    });
    
    // Create test payments
    await Payment.create([
      {
        paymentId: 'PAY241200001',
        booking: booking._id,
        tenant: testUser._id,
        property: property1._id,
        amount: 35000,
        description: 'January Rent - Unit 4B',
        paymentType: 'rent',
        periodMonth: 'January',
        periodYear: 2024,
        dueDate: new Date('2024-01-05'),
        paidDate: new Date('2024-01-04'),
        paymentMethod: 'mpesa',
        status: 'completed',
        receiptNumber: 'RCT241200001'
      },
      {
        paymentId: 'PAY241200002',
        booking: booking._id,
        tenant: testUser._id,
        property: property1._id,
        amount: 1500,
        description: 'January Water Bill',
        paymentType: 'utility',
        periodMonth: 'January',
        periodYear: 2024,
        dueDate: new Date('2024-01-10'),
        paidDate: new Date('2024-01-09'),
        paymentMethod: 'mpesa',
        status: 'completed',
        receiptNumber: 'RCT241200002'
      },
      {
        paymentId: 'PAY241200003',
        booking: booking._id,
        tenant: testUser._id,
        property: property1._id,
        amount: 35000,
        description: 'February Rent - Unit 4B',
        paymentType: 'rent',
        periodMonth: 'February',
        periodYear: 2024,
        dueDate: new Date('2024-02-05'),
        status: 'pending'
      }
    ]);
    
    console.log('✅ Test data seeded successfully!');
    console.log(`👤 Test User: test@example.com / password123`);
    console.log(`🏠 Test Properties: ${property1.name}, ${property2.name}`);
    console.log(`💰 Test Payments: 3 payments created`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

seedTestData();
