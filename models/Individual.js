const mongoose = require('mongoose');

const IndividualSchema = new mongoose.Schema({
  givenName: String,
  familyName: String,
  birthDate: Date,
  gender: String,
  nationality: String,
  status: String,
  contactMedium: [Object],
  languageAbility: [Object],
  skill: [Object],
  individualIdentification: [Object],
  externalReference: [Object],
  partyCharacteristic: [Object],
  taxExemptionCertificate: [Object],
  relatedParty: [Object]
}, { timestamps: true });

module.exports = mongoose.model('Individual', IndividualSchema);