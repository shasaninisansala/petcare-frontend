const API_BASE_URL = 'http://localhost:8080/petowner-app';

// Get current user from localStorage
const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Get headers with authentication
const getHeaders = () => {
  const user = getCurrentUser();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (user && user.userId) {
    headers['X-User-Id'] = user.userId.toString();
  }
  
  return headers;
};

// Handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

// API calls
export const api = {
  // Pet APIs
  addPet: async (petData) => {
    const response = await fetch(`${API_BASE_URL}/api/pets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(petData)
    });
    return handleResponse(response);
  },

  getPets: async () => {
    const response = await fetch(`${API_BASE_URL}/api/pets`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getPetById: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updatePet: async (petId, petData) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(petData)
    });
    return handleResponse(response);
  },

  deletePet: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Image Upload API
  uploadPetImage: async (imageFile) => {
    const user = getCurrentUser();
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Note: Don't set Content-Type header for FormData
    const response = await fetch(`${API_BASE_URL}/api/upload/pet-image`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  // Vaccination APIs
  addVaccination: async (petId, vaccinationData) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/vaccinations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vaccinationData)
    });
    return handleResponse(response);
  },

  getVaccinations: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/vaccinations`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateVaccinationStatus: async (petId, vaccinationId, status) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/vaccinations/${vaccinationId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  deleteVaccination: async (petId, vaccinationId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/vaccinations/${vaccinationId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Growth APIs
  addGrowthRecord: async (petId, growthData) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/growth`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(growthData)
    });
    return handleResponse(response);
  },

  getGrowthRecords: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/growth`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getLatestGrowthRecord: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/growth/latest`, {
      headers: getHeaders()
    });
    const data = await handleResponse(response);
    // Handle case where response is { message: "No growth records found" }
    if (data.message && data.message.includes("No growth records")) {
      return null;
    }
    return data;
  },

  deleteGrowthRecord: async (petId, growthId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/growth/${growthId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Medical Record APIs
  addMedicalRecord: async (petId, medicalData) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/medical`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(medicalData)
    });
    return handleResponse(response);
  },

  getMedicalRecords: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/medical`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  searchMedicalRecords: async (petId, condition) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/medical/search?condition=${encodeURIComponent(condition)}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  deleteMedicalRecord: async (petId, medicalId) => {
    const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/medical/${medicalId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Pet Statistics
  getPetStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/pets/stats`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};