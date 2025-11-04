import mongoose from 'mongoose';

export interface IProfile extends mongoose.Document {
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  weight: string;
  color: string;
  cast: string;
  maslak: string;
  maritalStatus: 'Single' | 'Divorced' | 'Widowed' | 'Separated';
  motherTongue: string;
  belongs: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  houseType: 'Own House' | 'Rent' | 'Family House' | 'Apartment';
  country: string;
  city: string;
  contactNumber: string;
  photoUrl?: string;
  status?: 'Active' | 'Matched' | 'Engaged' | 'Married' | 'Inactive';
  matchedWith?: string;
  matchedDate?: Date;
  sharedCount: number;
  requirements: {
    ageRange: {
      min: number;
      max: number;
    };
    heightRange: {
      min: string;
      max: string;
    };
    education: string;
    occupation: string;
    familyType: string;
    location: string[];
    cast: string[];
    maslak: string[];
    maritalStatus: string[];
    motherTongue: string[];
    belongs: string[];
    houseType: string[];
  };
  isMatched: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 80,
  },
  height: {
    type: String,
    required: false,
  },
  weight: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  cast: {
    type: String,
    required: true,
    trim: true,
  },
  maslak: {
    type: String,
    required: true,
    trim: true,
    enum: [
      // Sunni Islam
      'Hanafi', 'Shafi\'i', 'Maliki', 'Hanbali', 'Ahle Hadith', 'Deobandi', 'Barelvi', 'Jamaat-e-Islami',
      // Shia Islam
      'Twelver Shia', 'Ismaili', 'Zaidi', 'Alavi Bohra', 'Dawoodi Bohra',
      // Sufi Orders
      'Chishti', 'Qadri', 'Naqshbandi', 'Suhrawardi',
      // Other Islamic Sects
      'Ahmadiyya', 'Quranist', 'Non-denominational',
      // Other Religions
      'Christian', 'Hindu', 'Sikh', 'Other Religion'
    ]
  },
  maritalStatus: {
    type: String,
    required: true,
    trim: true,
    enum: ['Single', 'Divorced', 'Widowed', 'Separated'],
    default: 'Single'
  },
  motherTongue: {
    type: String,
    required: true,
    trim: true,
    enum: ['Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi', 'Saraiki', 'Hindko', 'Kashmiri', 'Arabic', 'Persian', 'Turkish', 'Other']
  },
  belongs: {
    type: String,
    required: true,
    trim: true,
    enum: ['Pakistan', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia', 'Other']
  },
  education: {
    type: String,
    required: true,
    trim: true,
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  income: {
    type: String,
    required: false,
    trim: true,
  },
  familyDetails: {
    type: String,
    required: false,
    trim: true,
  },
  houseType: {
    type: String,
    required: true,
    enum: ['Own House', 'Rent', 'Family House', 'Apartment'],
    default: 'Family House'
  },
  country: {
    type: String,
    required: true,
    trim: true,
    enum: ['Pakistan', 'Bangladesh', 'India', 'Afghanistan', 'Iran', 'Turkey', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada', 'Australia', 'Other'],
    default: 'Pakistan'
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  photoUrl: {
    type: String,
    required: false,
    trim: true,
  },
  requirements: {
    ageRange: {
      min: {
        type: Number,
        required: true,
        default: 18,
      },
      max: {
        type: Number,
        required: true,
        default: 35,
      },
    },
    heightRange: {
      min: {
        type: String,
        required: false,
        default: '5.0',
      },
      max: {
        type: String,
        required: false,
        default: '6.0',
      },
    },
    education: {
      type: String,
      required: false,
      trim: true,
    },
    occupation: {
      type: String,
      required: false,
      trim: true,
    },
    familyType: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: [String],
      required: false,
      default: [],
    },
    cast: {
      type: [String],
      required: false,
      default: [],
    },
    maslak: {
      type: [String],
      required: false,
      default: [],
    },
    maritalStatus: {
      type: [String],
      required: false,
      default: [],
    },
    motherTongue: {
      type: [String],
      required: false,
      default: [],
    },
    belongs: {
      type: [String],
      required: false,
      default: [],
    },
    houseType: {
      type: [String],
      required: false,
      default: [],
    },
  },
  status: {
    type: String,
    enum: ['Active', 'Matched', 'Engaged', 'Married', 'Inactive'],
    default: 'Active',
  },
  matchedWith: {
    type: String,
    required: false,
  },
  matchedDate: {
    type: Date,
    required: false,
  },
  isMatched: {
    type: Boolean,
    default: false,
  },
  sharedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt automatically
});

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;