const { pool } = require('../db');

class School {
  //adding new school
  static async addSchool(schoolData) {
    try {
      const { name, address, latitude, longitude } = schoolData;
      
      const query = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await pool.query(query, [name, address, latitude, longitude]);
      return { id: result.insertId, ...schoolData };
    } catch (error) {
      throw error;
    }
  }

  static async getAllSchools() {
    try {
      const [rows] = await pool.query('SELECT * FROM schools');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  //I am using Haversine formula for distance
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; //km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; 
    return distance;
  }

 
  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  
  static async getSchoolsByProximity(userLat, userLng) {
    try {
      const schools = await this.getAllSchools();
      
      const schoolsWithDistance = schools.map(school => {
        const distance = this.calculateDistance(
          userLat, 
          userLng, 
          school.latitude, 
          school.longitude
        );
        
        return {
          ...school,
          distance: parseFloat(distance.toFixed(2)) 
        };
      });
      
      return schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = School;