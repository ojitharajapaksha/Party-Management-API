const Organization = require('../models/Organization');

exports.createOrganization = async (req, res) => {
  try {
    const organization = new Organization(req.body);
    await organization.save();
    res.status(201).json(organization);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrganizations = async (req, res) => {
  const organizations = await Organization.find();
  res.json(organizations);
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ message: 'Not found' });
    res.json(organization);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};