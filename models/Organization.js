const mongoose = require('mongoose');

// TMF632 Organization Party Model
const OrganizationSchema = new mongoose.Schema({
  // Core Organization attributes per TMF632
  name: {
    type: String,
    required: true,
    trim: true
  },
  tradingName: {
    type: String,
    trim: true
  },
  nameType: {
    type: String,
    enum: ['legal', 'trading', 'brand', 'other'],
    default: 'legal'
  },
  organizationType: {
    type: String,
    enum: ['company', 'partnership', 'sole_proprietorship', 'nonprofit', 'government', 'corporation', 'llc', 'other'],
    default: 'company'
  },
  existsDuring: {
    startDateTime: Date,
    endDateTime: Date
  },
  isHeadOffice: {
    type: Boolean,
    default: true
  },
  isLegalEntity: {
    type: Boolean,
    default: true
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
      enum: ['email', 'phone', 'mobile', 'fax', 'pager', 'sms', 'landline', 'website', 'other']
    },
    preferred: {
      type: Boolean,
      default: false
    },
    characteristic: {
      emailAddress: String,
      phoneNumber: String,
      faxNumber: String,
      website: String,
      socialNetworkId: String,
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
  
  // External references
  externalReference: [{
    externalReferenceType: String,
    name: String,
    href: String
  }],
  
  // Organization relationships
  organizationChildRelationship: [{
    relationshipType: String,
    child: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
      },
      href: String,
      name: String
    }
  }],
  
  organizationParentRelationship: [{
    relationshipType: String,
    parent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
      },
      href: String,
      name: String
    }
  }],
  
  // Identification documents
  organizationIdentification: [{
    identificationType: {
      type: String,
      required: true,
      enum: ['businessRegistration', 'taxId', 'vatNumber', 'duns', 'lei', 'other']
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
  
  // Credit ratings
  creditRating: [{
    creditAgency: String,
    creditDate: Date,
    creditRate: String,
    creditScore: Number,
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
    contactEmail: String,
    contactPersonName: String,
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

// Virtual for display name
OrganizationSchema.virtual('displayName').get(function() {
  return this.tradingName || this.name;
});

// Index for better query performance
OrganizationSchema.index({ 'contactMedium.characteristic.emailAddress': 1 });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ organizationType: 1 });
OrganizationSchema.index({ status: 1 });

module.exports = mongoose.model('Organization', OrganizationSchema);