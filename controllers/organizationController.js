const Organization = require('../models/Organization');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Helper function to transform frontend form data to TMF632 format
const transformFormDataToTMF632 = (formData) => {
  const tmfData = {
    name: formData.name || formData.organizationName,
    tradingName: formData.tradingName || formData.organizationName,
    organizationType: formData.organizationType || 'company',
    isLegalEntity: formData.isLegalEntity !== undefined ? formData.isLegalEntity : true,
    isHeadOffice: formData.isHeadOffice !== undefined ? formData.isHeadOffice : true,
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

  // Add business registration if provided
  if (formData.businessRegistrationNumber) {
    tmfData.organizationIdentification = [{
      identificationType: 'businessRegistration',
      identificationId: formData.businessRegistrationNumber,
      issuingDate: new Date()
    }];
  }

  // Add authentication context if password is provided
  if (formData.password) {
    tmfData.authenticationContext = {
      contactEmail: formData.email,
      contactPersonName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      agreedToTerms: formData.agreeToTerms || false,
      subscribedToNewsletter: formData.subscribeToNewsletter || false,
      accountCreationDate: new Date()
    };
  }

  return tmfData;
};

exports.createOrganization = async (req, res) => {
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
    if (tmfData.authenticationContext?.contactEmail) {
      const existingOrganization = await Organization.findOne({
        'contactMedium.characteristic.emailAddress': tmfData.authenticationContext.contactEmail
      });
      
      if (existingOrganization) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An organization with this email address already exists'
        });
      }
    }

    const organization = new Organization(tmfData);
    const savedOrganization = await organization.save();
    
    // Remove sensitive data from response
    const response = savedOrganization.toObject();
    if (response.authenticationContext) {
      delete response.authenticationContext.hashedPassword;
    }
    
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating organization:', err);
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate key error',
        message: 'An organization with this information already exists'
      });
    }
    res.status(400).json({ 
      error: 'Bad Request',
      message: err.message 
    });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, name, organizationType } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (name) filter.name = new RegExp(name, 'i');
    if (organizationType) filter.organizationType = organizationType;
    
    const organizations = await Organization.find(filter)
      .select('-authenticationContext.hashedPassword') // Exclude password hash
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });
      
    const total = await Organization.countDocuments(filter);
    
    res.json({
      data: organizations,
      meta: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: organizations.length
      }
    });
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .select('-authenticationContext.hashedPassword'); // Exclude password hash
      
    if (!organization) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Organization not found' 
      });
    }
    
    res.json(organization);
  } catch (err) {
    console.error('Error fetching organization:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid organization ID format'
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};

exports.updateOrganization = async (req, res) => {
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

    const updated = await Organization.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).select('-authenticationContext.hashedPassword');
    
    if (!updated) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Organization not found'
      });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating organization:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid organization ID format'
      });
    }
    res.status(400).json({ 
      error: 'Bad Request',
      message: err.message 
    });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Organization not found'
      });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting organization:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid organization ID format'
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message 
    });
  }
};