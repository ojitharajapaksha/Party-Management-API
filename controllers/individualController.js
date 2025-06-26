const Individual = require('../models/Individual');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Helper function to transform frontend form data to TMF632 format
const transformFormDataToTMF632 = (formData) => {
  const tmfData = {
    givenName: formData.givenName || formData.firstName,
    familyName: formData.familyName || formData.lastName,
    fullName: formData.fullName || `${formData.givenName || formData.firstName} ${formData.familyName || formData.lastName}`,
    status: 'active',
    contactMedium: []
  };

  // Add email contact medium
  if (formData.email) {
    tmfData.contactMedium.push({
      mediumType: 'email',
      preferred: true,
      characteristic: {
        emailAddress: formData.email
      }
    });
  }

  // Add phone contact medium
  if (formData.phone) {
    tmfData.contactMedium.push({
      mediumType: 'phone',
      preferred: false,
      characteristic: {
        phoneNumber: formData.phone
      }
    });
  }

  // Add authentication context if password is provided
  if (formData.password) {
    tmfData.authenticationContext = {
      email: formData.email,
      agreedToTerms: formData.agreeToTerms || false,
      subscribedToNewsletter: formData.subscribeToNewsletter || false,
      accountCreationDate: new Date()
    };
  }

  return tmfData;
};

exports.createIndividual = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Transform form data to TMF632 format
    const tmfData = transformFormDataToTMF632(req.body);

    // Hash password if provided
    if (req.body.password) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      tmfData.authenticationContext.hashedPassword = hashedPassword;
    }

    // Check if email already exists
    if (tmfData.authenticationContext?.email) {
      const existingIndividual = await Individual.findOne({
        'contactMedium.characteristic.emailAddress': tmfData.authenticationContext.email
      });
      
      if (existingIndividual) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An individual with this email address already exists'
        });
      }
    }

    const individual = new Individual(tmfData);
    const savedIndividual = await individual.save();
    
    // Remove sensitive data from response
    const response = savedIndividual.toObject();
    if (response.authenticationContext) {
      delete response.authenticationContext.hashedPassword;
    }
    
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating individual:', err);
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate key error',
        message: 'An individual with this information already exists'
      });
    }
    res.status(400).json({ 
      error: 'Bad Request',
      message: err.message 
    });
  }
};

exports.getIndividuals = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, givenName, familyName } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (givenName) filter.givenName = new RegExp(givenName, 'i');
    if (familyName) filter.familyName = new RegExp(familyName, 'i');
    
    const individuals = await Individual.find(filter)
      .select('-authenticationContext.hashedPassword') // Exclude password hash
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });
      
    const total = await Individual.countDocuments(filter);
    
    res.json({
      data: individuals,
      meta: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: individuals.length
      }
    });
  } catch (err) {
    console.error('Error fetching individuals:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};

exports.getIndividualById = async (req, res) => {
  try {
    const individual = await Individual.findById(req.params.id)
      .select('-authenticationContext.hashedPassword'); // Exclude password hash
      
    if (!individual) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Individual not found' 
      });
    }
    
    res.json(individual);
  } catch (err) {
    console.error('Error fetching individual:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid individual ID format'
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};

exports.updateIndividual = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Transform update data
    const updateData = transformFormDataToTMF632(req.body);
    
    // Handle password update if provided
    if (req.body.password) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      updateData['authenticationContext.hashedPassword'] = hashedPassword;
    }

    const updated = await Individual.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).select('-authenticationContext.hashedPassword');
    
    if (!updated) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Individual not found'
      });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating individual:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid individual ID format'
      });
    }
    res.status(400).json({ 
      error: 'Bad Request',
      message: err.message 
    });
  }
};

exports.deleteIndividual = async (req, res) => {
  try {
    const deleted = await Individual.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Individual not found'
      });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting individual:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid individual ID format'
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};