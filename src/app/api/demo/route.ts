import { NextResponse } from 'next/server';

// Debug endpoint to check database connection and data
export async function GET() {
  try {
    console.log('🔍 Debug endpoint called');
    
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const mongoUriPreview = process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set';
    
    let profileCount = 0;
    let connectionStatus = 'unknown';
    let errorDetails = null;
    
    try {
      console.log('🔄 Trying MongoDB connection...');
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      
      const dbConnect = dbModule.default;
      const Profile = profileModule.default;
      
      await dbConnect();
      profileCount = await Profile.countDocuments();
      connectionStatus = 'mongodb-connected';
      console.log(`✅ MongoDB connected, ${profileCount} profiles found`);
      
    } catch (dbError) {
      console.log('❌ MongoDB check failed:', dbError);
      connectionStatus = 'mongodb-failed';
      errorDetails = dbError instanceof Error ? dbError.message : String(dbError);
      
      try {
        console.log('🔄 Trying in-memory storage...');
        const storageModule = await import('@/lib/storage');
        const InMemoryStorage = storageModule.InMemoryStorage;
        const profiles = await InMemoryStorage.getAllProfiles();
        profileCount = profiles.length;
        connectionStatus = 'in-memory';
        console.log(`✅ In-memory storage: ${profileCount} profiles found`);
      } catch (storageError) {
        connectionStatus = 'storage-failed';
        console.log('❌ All storage methods failed');
      }
    }

    return NextResponse.json({
      status: 'debug-info',
      timestamp: new Date().toISOString(),
      environment: {
        hasMongoUri,
        mongoUriPreview,
        nodeEnv: process.env.NODE_ENV,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL
      },
      database: {
        connectionStatus,
        profileCount,
        errorDetails
      },
      instructions: {
        loadDemoData: 'POST /api/demo',
        clearAllData: 'DELETE /api/demo',
        viewProfiles: 'GET /api/profiles'
      }
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed', 
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Demo profiles data - 20 diverse profiles
const demoProfiles = [
  {
    name: "Ahmed Hassan",
    fatherName: "Muhammad Hassan",
    age: 28,
    height: "5'8\"",
    weight: "70 kg",
    color: "Fair",
    address: "Gulberg, Lahore",
    occupation: "Software Engineer",
    education: "Bachelor's in Computer Science",
    income: "50,000 - 80,000",
    contactNumber: "0300-1234567",
    familyDetails: "Small family with 2 siblings. Father is a retired teacher, mother is a housewife. Looking for a well-educated and understanding life partner.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 22, max: 26 },
      heightRange: { min: "5'2\"", max: "5'6\"" },
      education: "Bachelor's or higher",
      occupation: "Any respectable profession",
      familyType: "Nuclear or Joint",
      location: "Lahore or nearby cities"
    }
  },
  {
    name: "Fatima Khan",
    fatherName: "Abdul Rahman Khan",
    age: 24,
    height: "5'4\"",
    weight: "55 kg",
    color: "Wheatish",
    address: "Defence, Karachi",
    occupation: "Teacher",
    education: "Master's in Education",
    income: "30,000 - 50,000",
    contactNumber: "0321-7654321",
    familyDetails: "Religious family with strong values. Father is a businessman, mother is also a teacher. We believe in mutual respect and understanding.",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 26, max: 32 },
      heightRange: { min: "5'6\"", max: "6'0\"" },
      education: "Bachelor's or higher",
      occupation: "Government job or business",
      familyType: "Educated family",
      location: "Karachi or Islamabad"
    }
  },
  {
    name: "Aisha Malik",
    fatherName: "Tariq Malik",
    age: 26,
    height: "5'3\"",
    weight: "52 kg",
    color: "Fair",
    address: "Johar Town, Lahore",
    occupation: "Graphic Designer",
    education: "Bachelor's in Fine Arts",
    income: "40,000 - 60,000",
    contactNumber: "0300-5555444",
    familyDetails: "Creative and modern family. Father is an architect, mother is a homemaker. We appreciate art, culture, and modern thinking while maintaining our values.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 28, max: 35 },
      heightRange: { min: "5'7\"", max: "6'2\"" },
      education: "Bachelor's or Master's",
      occupation: "Professional job",
      familyType: "Modern and understanding",
      location: "Lahore, Karachi, or Islamabad"
    }
  },
  {
    name: "Omar Siddiqui",
    fatherName: "Jameel Siddiqui",
    age: 32,
    height: "6'0\"",
    weight: "80 kg",
    color: "Wheatish",
    address: "Clifton, Karachi",
    occupation: "Business Owner",
    education: "MBA",
    income: "150,000+",
    contactNumber: "0321-1111222",
    familyDetails: "Business family from Karachi. Father has textile business, mother manages household. We value honesty, hard work, and family traditions.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 25, max: 30 },
      heightRange: { min: "5'3\"", max: "5'8\"" },
      education: "Bachelor's degree minimum",
      occupation: "Any respectable profession",
      familyType: "Traditional values",
      location: "Karachi or nearby"
    }
  },
  {
    name: "Zainab Ahmed",
    fatherName: "Rashid Ahmed",
    age: 23,
    height: "5'5\"",
    weight: "58 kg",
    color: "Fair",
    address: "Model Town, Lahore",
    occupation: "Pharmacist",
    education: "Pharm.D",
    income: "45,000 - 65,000",
    contactNumber: "0300-7777888",
    familyDetails: "Healthcare professional family. Father is a doctor, mother is a nurse. We believe in serving humanity and maintaining work-life balance.",
    photoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 26, max: 33 },
      heightRange: { min: "5'8\"", max: "6'1\"" },
      education: "Medical or Engineering field",
      occupation: "Doctor, Engineer, or Pharmacist",
      familyType: "Professional family",
      location: "Major cities"
    }
  },
  {
    name: "Hassan Raza",
    fatherName: "Iqbal Raza",
    age: 29,
    height: "5'9\"",
    weight: "73 kg",
    color: "Wheatish",
    address: "Satellite Town, Rawalpindi",
    occupation: "Civil Engineer",
    education: "Bachelor's in Civil Engineering",
    income: "60,000 - 90,000",
    contactNumber: "0333-4444555",
    familyDetails: "Engineering family from twin cities. Father is a retired engineer, mother is a teacher. We value education, respect, and mutual understanding.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 22, max: 27 },
      heightRange: { min: "5'1\"", max: "5'6\"" },
      education: "Bachelor's degree",
      occupation: "Teacher, Engineer, or Doctor",
      familyType: "Educated family",
      location: "Islamabad, Rawalpindi, or Lahore"
    }
  },
  {
    name: "Maryam Shah",
    fatherName: "Nasir Shah",
    age: 25,
    height: "5'2\"",
    weight: "50 kg",
    color: "Fair",
    address: "Hayatabad, Peshawar",
    occupation: "Bank Officer",
    education: "Master's in Economics",
    income: "55,000 - 75,000",
    contactNumber: "0300-2222333",
    familyDetails: "Respectable family from Peshawar. Father is a government officer, mother manages home. We follow Islamic values and believe in women's education and career.",
    photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 27, max: 34 },
      heightRange: { min: "5'6\"", max: "6'0\"" },
      education: "Master's degree preferred",
      occupation: "Government job or banking",
      familyType: "Conservative but progressive",
      location: "Peshawar, Islamabad, or Lahore"
    }
  },
  {
    name: "Bilal Sheikh",
    fatherName: "Mahmood Sheikh",
    age: 27,
    height: "5'11\"",
    weight: "78 kg",
    color: "Fair",
    address: "DHA, Karachi",
    occupation: "Chartered Accountant",
    education: "CA",
    income: "80,000 - 120,000",
    contactNumber: "0334-5678901",
    familyDetails: "Professional family with CA practice. Father is also a CA, mother is a homemaker. We believe in financial stability and career growth.",
    photoUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 22, max: 26 },
      heightRange: { min: "5'2\"", max: "5'7\"" },
      education: "Bachelor's in Commerce or Business",
      occupation: "Professional or business",
      familyType: "Business minded family",
      location: "Karachi, Lahore, or Islamabad"
    }
  },
  {
    name: "Sara Baig",
    fatherName: "Tariq Baig",
    age: 22,
    height: "5'6\"",
    weight: "54 kg",
    color: "Fair",
    address: "Wapda Town, Lahore",
    occupation: "Content Writer",
    education: "Bachelor's in Mass Communication",
    income: "25,000 - 40,000",
    contactNumber: "0300-9988776",
    familyDetails: "Media family with journalism background. Father is a senior journalist, mother is an English teacher. We value creativity and expression.",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 25, max: 32 },
      heightRange: { min: "5'7\"", max: "6'1\"" },
      education: "Bachelor's or Master's",
      occupation: "Media, IT, or creative field",
      familyType: "Open minded and supportive",
      location: "Lahore, Islamabad, or Karachi"
    }
  },
  {
    name: "Usman Tariq",
    fatherName: "Saleem Tariq",
    age: 31,
    height: "5'7\"",
    weight: "68 kg",
    color: "Wheatish",
    address: "Blue Area, Islamabad",
    occupation: "Government Officer",
    education: "Master's in Public Administration",
    income: "70,000 - 95,000",
    contactNumber: "0345-1122334",
    familyDetails: "Government service family. Father is a retired secretary, mother is a retired headmistress. We serve the nation with honesty and dedication.",
    photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 24, max: 29 },
      heightRange: { min: "5'1\"", max: "5'6\"" },
      education: "Bachelor's minimum",
      occupation: "Teacher, officer, or professional",
      familyType: "Service oriented family",
      location: "Islamabad, Rawalpindi, or nearby"
    }
  },
  {
    name: "Nida Malik",
    fatherName: "Amin Malik",
    age: 26,
    height: "5'4\"",
    weight: "56 kg",
    color: "Wheatish",
    address: "Cantt, Multan",
    occupation: "Dentist",
    education: "BDS",
    income: "60,000 - 85,000",
    contactNumber: "0300-6655443",
    familyDetails: "Medical family from South Punjab. Father is a surgeon, mother is a gynecologist. We believe in helping people and maintaining high ethical standards.",
    photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 28, max: 35 },
      heightRange: { min: "5'6\"", max: "6'0\"" },
      education: "Medical or Engineering",
      occupation: "Doctor, Engineer, or Officer",
      familyType: "Professional medical family",
      location: "Multan, Lahore, or Faisalabad"
    }
  },
  {
    name: "Adnan Qureshi",
    fatherName: "Rasheed Qureshi",
    age: 29,
    height: "6'1\"",
    weight: "82 kg",
    color: "Fair",
    address: "Shadman, Lahore",
    occupation: "Architect",
    education: "Bachelor's in Architecture",
    income: "55,000 - 75,000",
    contactNumber: "0321-3344556",
    familyDetails: "Creative professional family. Father is a contractor, mother is an interior designer. We appreciate art, design, and innovative thinking.",
    photoUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 23, max: 28 },
      heightRange: { min: "5'2\"", max: "5'8\"" },
      education: "Bachelor's in any field",
      occupation: "Creative or professional field",
      familyType: "Understanding and artistic",
      location: "Lahore, Karachi, or Islamabad"
    }
  },
  {
    name: "Ayesha Shahid",
    fatherName: "Shahid Hussain",
    age: 24,
    height: "5'3\"",
    weight: "51 kg",
    color: "Fair",
    address: "Nazimabad, Karachi",
    occupation: "HR Manager",
    education: "MBA in Human Resources",
    income: "50,000 - 70,000",
    contactNumber: "0333-7788990",
    familyDetails: "Corporate family with business background. Father manages import/export business, mother is involved in social work. We believe in professional growth.",
    photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 26, max: 33 },
      heightRange: { min: "5'6\"", max: "6'2\"" },
      education: "Bachelor's or MBA",
      occupation: "Business or corporate job",
      familyType: "Progressive business family",
      location: "Karachi, Lahore, or Dubai"
    }
  },
  {
    name: "Fahad Malik",
    fatherName: "Arshad Malik",
    age: 33,
    height: "5'8\"",
    weight: "76 kg",
    color: "Wheatish",
    address: "Bahria Town, Rawalpindi",
    occupation: "Marketing Manager",
    education: "Master's in Marketing",
    income: "85,000 - 110,000",
    contactNumber: "0344-2233445",
    familyDetails: "Marketing professional family. Father owns advertising agency, mother is a fashion designer. We understand modern lifestyle and career demands.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 26, max: 31 },
      heightRange: { min: "5'2\"", max: "5'7\"" },
      education: "Bachelor's or Master's",
      occupation: "Professional career woman",
      familyType: "Modern and career focused",
      location: "Twin cities or Lahore"
    }
  },
  {
    name: "Samina Chaudhry",
    fatherName: "Ghulam Chaudhry",
    age: 27,
    height: "5'5\"",
    weight: "59 kg",
    color: "Fair",
    address: "Samanabad, Faisalabad",
    occupation: "Computer Programmer",
    education: "Bachelor's in Computer Science",
    income: "45,000 - 65,000",
    contactNumber: "0300-4455667",
    familyDetails: "Technology enthusiast family from industrial city. Father is an engineer in textile, mother manages household. We embrace technology and innovation.",
    photoUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 29, max: 36 },
      heightRange: { min: "5'7\"", max: "6'1\"" },
      education: "Engineering or IT field",
      occupation: "Engineer, programmer, or analyst",
      familyType: "Tech savvy family",
      location: "Faisalabad, Lahore, or Islamabad"
    }
  },
  {
    name: "Imran Siddique",
    fatherName: "Yousuf Siddique",
    age: 30,
    height: "5'9\"",
    weight: "71 kg",
    color: "Fair",
    address: "Gulshan-e-Iqbal, Karachi",
    occupation: "Sales Manager",
    education: "Bachelor's in Business Administration",
    income: "65,000 - 90,000",
    contactNumber: "0321-5566778",
    familyDetails: "Business family with retail background. Father has clothing business, mother is active in community services. We believe in hard work and customer service.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 24, max: 28 },
      heightRange: { min: "5'1\"", max: "5'6\"" },
      education: "Bachelor's degree",
      occupation: "Any respectable profession",
      familyType: "Business oriented family",
      location: "Karachi or nearby cities"
    }
  },
  {
    name: "Rubina Akhtar",
    fatherName: "Akbar Akhtar",
    age: 25,
    height: "5'2\"",
    weight: "53 kg",
    color: "Wheatish",
    address: "Satellite Town, Gujranwala",
    occupation: "School Principal",
    education: "Master's in Education",
    income: "40,000 - 60,000",
    contactNumber: "0300-8899001",
    familyDetails: "Educational family dedicated to teaching. Father is a retired headmaster, mother also taught primary school. We believe education transforms society.",
    photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 28, max: 35 },
      heightRange: { min: "5'6\"", max: "6'0\"" },
      education: "Master's degree preferred",
      occupation: "Teacher, officer, or professional",
      familyType: "Education loving family",
      location: "Gujranwala, Lahore, or Sialkot"
    }
  },
  {
    name: "Khadija Umer",
    fatherName: "Umer Farooq",
    age: 23,
    height: "5'4\"",
    weight: "52 kg",
    color: "Fair",
    address: "Allama Iqbal Town, Lahore",
    occupation: "Physiotherapist",
    education: "Doctor of Physical Therapy",
    income: "35,000 - 55,000",
    contactNumber: "0300-3344557",
    familyDetails: "Healthcare family committed to patient care. Father is a physiotherapist, mother is a nurse. We believe in healing and helping people recover.",
    photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    requirements: {
      ageRange: { min: 26, max: 32 },
      heightRange: { min: "5'6\"", max: "6'1\"" },
      education: "Medical or paramedical field",
      occupation: "Healthcare professional",
      familyType: "Medical background family",
      location: "Lahore, Karachi, or Islamabad"
    }
  }
];

export async function POST() {
  try {
    console.log('Adding demo profiles...');

    // Try MongoDB first, fallback to in-memory
    let useInMemory = false;
    let dbConnect, Profile, InMemoryStorage;
    let addedProfiles = [];
    
    try {
      // Dynamic imports to avoid build-time evaluation
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      const storageModule = await import('@/lib/storage');
      
      dbConnect = dbModule.default;
      Profile = profileModule.default;
      InMemoryStorage = storageModule.InMemoryStorage;
      
      await dbConnect();
      console.log('Connected to MongoDB successfully');
      
      // Add profiles to MongoDB
      for (const profileData of demoProfiles) {
        try {
          const profile = new Profile(profileData);
          const savedProfile = await profile.save();
          addedProfiles.push(savedProfile);
          console.log(`Added profile: ${profileData.name}`);
        } catch (error) {
          console.error(`Error adding profile ${profileData.name}:`, error);
        }
      }
      
    } catch (dbError) {
      console.log('MongoDB connection failed, using in-memory storage:', dbError);
      useInMemory = true;
      
      // Use in-memory storage as fallback
      try {
        const storageModule = await import('@/lib/storage');
        InMemoryStorage = storageModule.InMemoryStorage;
        
        for (const profileData of demoProfiles) {
          try {
            const profile = await InMemoryStorage.saveProfile(profileData);
            addedProfiles.push(profile);
            console.log(`Added profile to memory: ${profileData.name}`);
          } catch (error) {
            console.error(`Error adding profile ${profileData.name} to memory:`, error);
          }
        }
        
      } catch (storageError) {
        console.error('In-memory storage failed:', storageError);
        return NextResponse.json(
          { error: 'Failed to initialize storage' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: `Successfully added ${addedProfiles.length} demo profiles`,
      method: useInMemory ? 'in-memory' : 'mongodb',
      profiles: addedProfiles.map(p => ({ 
        id: p._id || p.id, 
        name: p.name, 
        age: p.age, 
        occupation: p.occupation 
      }))
    });

  } catch (error) {
    console.error('Demo data setup error:', error);
    return NextResponse.json(
      { error: 'Failed to add demo profiles' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    console.log('Clearing all profiles...');

    let useInMemory = false;
    let dbConnect, Profile, InMemoryStorage;
    
    try {
      // Try MongoDB first
      const dbModule = await import('@/lib/mongodb');
      const profileModule = await import('@/models/Profile');
      const storageModule = await import('@/lib/storage');
      
      dbConnect = dbModule.default;
      Profile = profileModule.default;
      InMemoryStorage = storageModule.InMemoryStorage;
      
      await dbConnect();
      
      // Clear MongoDB
      const result = await Profile.deleteMany({});
      console.log(`Deleted ${result.deletedCount} profiles from MongoDB`);
      
      return NextResponse.json({
        message: `Cleared ${result.deletedCount} profiles from MongoDB`,
        method: 'mongodb'
      });
      
    } catch (dbError) {
      console.log('MongoDB operation failed, clearing in-memory storage:', dbError);
      
      try {
        const storageModule = await import('@/lib/storage');
        InMemoryStorage = storageModule.InMemoryStorage;
        
        // Clear functionality not implemented in InMemoryStorage
        console.log('Clear profiles functionality needs to be implemented');
        
        return NextResponse.json({
          message: 'Cleared all profiles from memory storage',
          method: 'in-memory'
        });
        
      } catch (storageError) {
        console.error('Failed to clear in-memory storage:', storageError);
        return NextResponse.json(
          { error: 'Failed to clear profiles' },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Clear profiles error:', error);
    return NextResponse.json(
      { error: 'Failed to clear profiles' },
      { status: 500 }
    );
  }
}