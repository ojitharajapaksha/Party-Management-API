const mongoose = require('mongoose');

// TMF632 Individual Party Model
const IndividualSchema = new mongoose.Schema({
  // Core Individual attributes per TMF632
  givenName: {
    type: String,
    required: true,
    trim: true
  },
  familyName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  formattedName: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  countryOfBirth: {
    type: String,
    trim: true
  },
  deathDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown'],
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', 'separated', 'unknown'],
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  placeOfBirth: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['initialized', 'validated', 'active', 'inactive', 'terminated'],
    default: 'active'
  },
  
  // Contact information per TMF632
  contactMedium: [{
    mediumType: {
      type: String,
      required: true,
      enum: ['email', 'phone', 'mobile', 'fax', 'pager', 'sms', 'landline', 'other']
    },
    preferred: {
      type: Boolean,
      default: false
    },
    characteristic: {
      emailAddress: String,
      phoneNumber: String,
      faxNumber: String,
      city: String,
      country: String,
      postCode: String,
      stateOrProvince: String,
      street1: String,
      street2: String
    },
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    }
  }],
  
  // Language abilities
  languageAbility: [{
    languageCode: String,
    languageName: String,
    listeningProficiency: String,
    readingProficiency: String,
    speakingProficiency: String,
    writingProficiency: String,
    isFavouriteLanguage: Boolean
  }],
  
  // Skills
  skill: [{
    skillCode: String,
    skillName: String,
    comment: String,
    evaluatedLevel: String,
    skillCategory: String
  }],
  
  // Identification documents
  individualIdentification: [{
    identificationType: {
      type: String,
      required: true,
      enum: ['passport', 'nationalId', 'drivingLicense', 'socialSecurity', 'other']
    },
    identificationId: {
      type: String,
      required: true
    },
    issuingAuthority: String,
    issuingDate: Date,
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    }
  }],
  
  // External references
  externalReference: [{
    externalReferenceType: String,
    name: String,
    href: String
  }],
  
  // Party characteristics
  partyCharacteristic: [{
    name: String,
    value: String,
    valueType: String
  }],
  
  // Tax exemption certificates
  taxExemptionCertificate: [{
    attachment: {
      attachmentType: String,
      content: String,
      description: String,
      mimeType: String,
      name: String,
      url: String,
      size: Number
    },
    taxDefinition: [{
      id: String,
      name: String,
      taxType: String
    }],
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    }
  }],
  
  // Related parties
  relatedParty: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedParty.type'
    },
    href: String,
    name: String,
    role: String,
    type: {
      type: String,
      enum: ['Individual', 'Organization']
    }
  }],
  
  // Additional fields for user authentication context
  authenticationContext: {
    email: String,
    hashedPassword: String,
    lastLoginDate: Date,
    accountCreationDate: {
      type: Date,
      default: Date.now
    },
    agreedToTerms: {
      type: Boolean,
      default: false
    },
    subscribedToNewsletter: {
      type: Boolean,
      default: false
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name if not provided
IndividualSchema.virtual('computedFullName').get(function() {
  return this.fullName || `${this.givenName} ${this.familyName}`;
});

// Index for better query performance
IndividualSchema.index({ 'contactMedium.characteristic.emailAddress': 1 });
IndividualSchema.index({ givenName: 1, familyName: 1 });
IndividualSchema.index({ status: 1 });

module.exports = mongoose.model('Individual', IndividualSchema);