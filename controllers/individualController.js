const Individual = require('../models/Individual');

exports.createIndividual = async (req, res) => {
  try {
    const individual = new Individual(req.body);
    await individual.save();
    res.status(201).json(individual);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIndividuals = async (req, res) => {
  const individuals = await Individual.find();
  res.json(individuals);
};

exports.getIndividualById = async (req, res) => {
  try {
    const individual = await Individual.findById(req.params.id);
    if (!individual) return res.status(404).json({ message: 'Not found' });
    res.json(individual);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateIndividual = async (req, res) => {
  try {
    const updated = await Individual.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteIndividual = async (req, res) => {
  try {
    await Individual.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};