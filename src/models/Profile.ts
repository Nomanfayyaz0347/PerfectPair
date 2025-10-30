import mongoose from 'mongoose';

export interface IProfile extends mongoose.Document {
  name: string;
  fatherName: string;
  age: number;
  height: string;
  weight: string;
  color: string;
  education: string;
  occupation: string;
  income: string;
  familyDetails: string;
  address: string;
  contactNumber: string;
  photoUrl?: string;
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
    location: string;
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
  address: {
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
      type: String,
      required: false,
      trim: true,
    },
  },
  isMatched: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt automatically
});

const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;