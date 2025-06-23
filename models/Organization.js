const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: String,
  tradingName: String,
  organizationType: String,
  isLegalEntity: Boolean,
  isHeadOffice: Boolean,
  status: String,
  contactMedium: [Object],
  externalReference: [Object],
  organizationChildRelationship: [Object],
  organizationParentRelationship: [Object],
  organizationIdentification: [Object],
  partyCharacteristic: [Object],
  taxExemptionCertificate: [Object],
  creditRating: [Object],
  relatedParty: [Object]
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);