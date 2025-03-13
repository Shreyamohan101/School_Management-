const School = require('../models/School');

const validateSchoolData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('School name required');
  }
  
  if (!data.address || data.address.trim() === '') {
    errors.push('School address is mrequired');
  }
  
  if (!data.latitude || isNaN(parseFloat(data.latitude))) {
    errors.push('Valid latitude is required (must be a number)');
  } else {
    const lat = parseFloat(data.latitude);
    if (lat < -90 || lat > 90) {
      errors.push('Latitude must be between -90 and 90');
    }
  }
  
  if (!data.longitude || isNaN(parseFloat(data.longitude))) {
    errors.push('Valid longitude is required (must be a number)');
  } else {
    const lng = parseFloat(data.longitude);
    if (lng < -180 || lng > 180) {
      errors.push('Longitude must be between -180 and 180');
    }
  }
  
  return errors;
};

// new school
exports.addSchool = async (req, res) => {
  try {
    const schoolData = {
      name: req.body.name,
      address: req.body.address,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude)
    };
    
    // valodating dataa
    const validationErrors = validateSchoolData(schoolData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    //adding school data
    const newSchool = await School.addSchool(schoolData);
    
    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: newSchool
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
};

// List all schools sorted by proximity
exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate location parameters
    if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // Validate coordinates
    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates out of range'
      });
    }

    // Get schools sorted by proximity
    const schools = await School.getSchoolsByProximity(userLat, userLng);

    // Check if no schools found
    if (!schools || schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No schools found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
};
