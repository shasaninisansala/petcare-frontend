import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, CheckCircle, Clock, Calendar, Download, Edit, Trash2, Search, Syringe, Activity } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';
import AIPetCareModal from './AIHealth';
import AddVaccinationModal from './AddVaccinationModel';
import AddGrowthRecordModal from './AddGrowthRecordModal';
import AddMedicalRecordModal from './AddMedicalRecordModal';

export default function PetDetailComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vaccination');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  
  // State for pet data
  const [pet, setPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [latestGrowth, setLatestGrowth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get petId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const petId = queryParams.get('petId');

  useEffect(() => {
    if (petId) {
      fetchPetData();
    } else {
      toast.error('No pet selected');
      navigate('/pet-owner/mypets');
    }
  }, [petId, navigate]);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [petData, vaccinationsData, growthData, medicalData, latestGrowthData] = await Promise.all([
        api.getPetById(petId),
        api.getVaccinations(petId),
        api.getGrowthRecords(petId),
        api.getMedicalRecords(petId),
        api.getLatestGrowthRecord(petId)
      ]);

      setPet(petData);
      setVaccinations(vaccinationsData || []);
      setGrowthRecords(growthData || []);
      setMedicalRecords(medicalData || []);
      setLatestGrowth(latestGrowthData);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      toast.error('Failed to load pet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPetData();
  };

  const tabs = [
    { id: 'vaccination', label: 'Vaccination Timeline', icon: '💉' },
    { id: 'growth', label: 'Growth', icon: '📊' },
    { id: 'medical', label: 'Medical History', icon: '🩺' }
  ];

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      const months = today.getMonth() - birthDate.getMonth();
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  const handleVaccinationStatusUpdate = async (vaccinationId, newStatus) => {
    try {
      const result = await api.updateVaccinationStatus(petId, vaccinationId, newStatus);
      if (result.message) {
        toast.success('Vaccination status updated');
        handleRefresh(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to update vaccination status');
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    if (!window.confirm('Are you sure you want to delete this vaccination record?')) {
      return;
    }
    
    try {
      const result = await api.deleteVaccination(petId, vaccinationId);
      if (result.message) {
        toast.success('Vaccination deleted');
        handleRefresh(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to delete vaccination');
    }
  };

  const handleDeleteGrowthRecord = async (growthId) => {
    if (!window.confirm('Are you sure you want to delete this growth record?')) {
      return;
    }
    
    try {
      const result = await api.deleteGrowthRecord(petId, growthId);
      if (result.message) {
        toast.success('Growth record deleted');
        handleRefresh(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to delete growth record');
    }
  };

  const handleDeleteMedicalRecord = async (medicalId) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) {
      return;
    }
    
    try {
      const result = await api.deleteMedicalRecord(petId, medicalId);
      if (result.message) {
        toast.success('Medical record deleted');
        handleRefresh(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to delete medical record');
    }
  };

  const getPetImage = (pet) => {
    // If pet has uploaded image (stored as URL), use it
    if (pet.imageUrl && pet.imageUrl.startsWith('/')) {
      // Make sure the URL is complete
      if (pet.imageUrl.startsWith('/petowner-app/')) {
        return `http://localhost:8080${pet.imageUrl}`;
      } else {
        return `http://localhost:8080/petowner-app${pet.imageUrl}`;
      }
    }
    
    // If it's already a full URL
    if (pet.imageUrl && (pet.imageUrl.startsWith('http://') || pet.imageUrl.startsWith('https://'))) {
      return pet.imageUrl;
    }
    
    // Otherwise use default based on species
    if (pet.species === 'dog') {
      return 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop';
    } else if (pet.species === 'cat') {
      return 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'due soon': return 'bg-orange-100 text-orange-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'due soon': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'overdue': return <Activity className="w-5 h-5 text-red-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Pet not found</p>
          <button 
            onClick={() => navigate('/pet-owner/mypets')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Back to My Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/pet-owner/mypets')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Pets</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {refreshing ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>↻</span>
              )}
              Refresh
            </button>
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl">🐾</span>
              <span className="font-bold text-xl text-green-600">PetCare</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Pet Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                <img
                  src={getPetImage(pet)}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, use default
                    if (pet.species === 'dog') {
                      e.target.src = 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop';
                    } else if (pet.species === 'cat') {
                      e.target.src = 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop';
                    } else {
                      e.target.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop';
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.petName}</h1>
                <p className="text-green-600 text-lg mb-3">
                  {pet.breed || 'Unknown breed'}, {calculateAge(pet.dateOfBirth)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {pet.status || 'Active'}
                  </span>
                  <span className="text-sm text-gray-500">• {pet.species}</span>
                  {pet.weight && (
                    <span className="text-sm text-gray-500">• Weight: {pet.weight} kg</span>
                  )}
                  {pet.height && (
                    <span className="text-sm text-gray-500">• Height: {pet.height} cm</span>
                  )}
                </div>
                {pet.healthNotes && (
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Health Notes:</span> {pet.healthNotes}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsVaccinationModalOpen(true)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              Add Vaccination
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              Emergency Help
              <span>🏥</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex border-b border-gray-200 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'vaccination' && (
              <VaccinationTab 
                vaccinations={vaccinations}
                onStatusUpdate={handleVaccinationStatusUpdate}
                onDelete={handleDeleteVaccination}
              />
            )}
            {activeTab === 'growth' && (
              <GrowthTab 
                growthRecords={growthRecords}
                latestGrowth={latestGrowth}
                onAddRecord={() => setIsGrowthModalOpen(true)}
                onDelete={handleDeleteGrowthRecord}
                petName={pet.petName}
                petSpecies={pet.species}
              />
            )}
            {activeTab === 'medical' && (
              <MedicalTab 
                medicalRecords={medicalRecords}
                onAddRecord={() => setIsMedicalModalOpen(true)}
                onDelete={handleDeleteMedicalRecord}
                petId={petId}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AIPetCareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AddVaccinationModal
        isOpen={isVaccinationModalOpen}
        onClose={() => setIsVaccinationModalOpen(false)}
        petId={petId}
        petName={pet.petName}
        petType={pet.species}
        petBreed={pet.breed}
        onSuccess={handleRefresh}
      />

      <AddGrowthRecordModal
        isOpen={isGrowthModalOpen}
        onClose={() => setIsGrowthModalOpen(false)}
        petId={petId}
        petName={pet.petName}
        onSuccess={handleRefresh}
      />

      <AddMedicalRecordModal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        petId={petId}
        petName={pet.petName}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

// Vaccination Timeline Tab Component
function VaccinationTab({ vaccinations, onStatusUpdate, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = vaccination.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaccination.clinicName && vaccination.clinicName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || 
      vaccination.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'due soon': return 'bg-orange-100 text-orange-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'due soon': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'overdue': return <Activity className="w-5 h-5 text-red-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Vaccination Timeline</h3>
          <p className="text-sm text-gray-600 mt-1">{vaccinations.length} vaccination records</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search vaccinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Overdue">Overdue</option>
            <option value="Planned">Planned</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Syringe className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No vaccination records found</h4>
            <p className="text-gray-600 text-sm">
              {searchTerm || filterStatus !== 'All' 
                ? 'Try changing your search or filter' 
                : 'Add your first vaccination record to get started'}
            </p>
          </div>
        ) : (
          filteredVaccinations.map((vaccination) => {
            const daysUntilDue = vaccination.nextDueDate ? getDaysUntilDue(vaccination.nextDueDate) : null;
            
            return (
              <div key={vaccination.vaccinationId} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                    {getStatusIcon(vaccination.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{vaccination.vaccineName}</h4>
                        <p className="text-sm text-gray-600">
                          {vaccination.clinicName && `• ${vaccination.clinicName}`}
                          {vaccination.veterinarianName && ` • Dr. ${vaccination.veterinarianName}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vaccination.status)}`}>
                          {vaccination.status}
                        </span>
                        <button
                          onClick={() => onDelete(vaccination.vaccinationId)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="space-y-1">
                        <p className="text-gray-700 flex items-center gap-2">
                          <span className="text-gray-500">📅</span> 
                          <span className="font-medium">Vaccination Date:</span> 
                          <span>{formatDate(vaccination.vaccinationDate)}</span>
                        </p>
                        {vaccination.nextDueDate && (
                          <p className="text-gray-700 flex items-center gap-2">
                            <span className="text-gray-500">⏰</span> 
                            <span className="font-medium">Next Due:</span> 
                            <span>{formatDate(vaccination.nextDueDate)}</span>
                            {daysUntilDue !== null && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                daysUntilDue <= 7 ? 'bg-red-100 text-red-700' :
                                daysUntilDue <= 30 ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {daysUntilDue > 0 ? `in ${daysUntilDue} days` : `${Math.abs(daysUntilDue)} days ago`}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div>
                        {vaccination.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-gray-500 mb-1">Notes:</p>
                            <p className="text-gray-700">{vaccination.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        value={vaccination.status}
                        onChange={(e) => onStatusUpdate(vaccination.vaccinationId, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
                      >
                        <option value="Planned">Mark as Planned</option>
                        <option value="Completed">Mark as Completed</option>
                        <option value="Due Soon">Mark as Due Soon</option>
                        <option value="Overdue">Mark as Overdue</option>
                      </select>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                        Set Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// Growth Tab Component
function GrowthTab({ growthRecords, latestGrowth, onAddRecord, onDelete, petName, petSpecies = 'dog' }) {
  const [chartType, setChartType] = useState('both'); // 'weight', 'height', 'both'
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate growth trends
  const calculateGrowthTrend = () => {
    if (growthRecords.length < 2) return { weightTrend: 'stable', heightTrend: 'stable', weightDiff: 0, heightDiff: 0 };
    
    const sortedRecords = [...growthRecords].sort((a, b) => 
      new Date(a.measurementDate) - new Date(b.measurementDate)
    );
    
    const first = sortedRecords[0];
    const last = sortedRecords[sortedRecords.length - 1];
    
    const weightDiff = last.weight - first.weight;
    const heightDiff = last.height - first.height;
    
    const weightTrend = weightDiff > 2 ? 'increasing' : weightDiff < -2 ? 'decreasing' : 'stable';
    const heightTrend = heightDiff > 5 ? 'increasing' : heightDiff < -5 ? 'decreasing' : 'stable';
    
    return { weightTrend, heightTrend, weightDiff, heightDiff };
  };

  // Get breed standards based on species and breed
  const getBreedStandards = () => {
    const standards = {
      'dog': {
        weight: { min: 10, max: 40, unit: 'kg' },
        height: { min: 30, max: 70, unit: 'cm' },
        description: 'Medium to Large Breed Standards'
      },
      'cat': {
        weight: { min: 3, max: 7, unit: 'kg' },
        height: { min: 20, max: 30, unit: 'cm' },
        description: 'Domestic Cat Standards'
      },
      'rabbit': {
        weight: { min: 1, max: 3, unit: 'kg' },
        height: { min: 15, max: 25, unit: 'cm' },
        description: 'Domestic Rabbit Standards'
      },
      'bird': {
        weight: { min: 0.1, max: 0.5, unit: 'kg' },
        height: { min: 10, max: 25, unit: 'cm' },
        description: 'Small Bird Standards'
      }
    };

    return standards[petSpecies?.toLowerCase()] || standards['dog'];
  };

  const { weightTrend, heightTrend, weightDiff, heightDiff } = calculateGrowthTrend();
  const breedStandards = getBreedStandards();

  // Check if current measurements are within breed standards
  const isWithinStandards = () => {
    if (!latestGrowth) return { weight: false, height: false };
    
    const weightOk = latestGrowth.weight >= breedStandards.weight.min && 
                    latestGrowth.weight <= breedStandards.weight.max;
    const heightOk = latestGrowth.height >= breedStandards.height.min && 
                    latestGrowth.height <= breedStandards.height.max;
    
    return { weight: weightOk, height: heightOk };
  };

  const standardsCheck = isWithinStandards();

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  // Calculate averages
  const calculateAverages = () => {
    if (growthRecords.length === 0) return { avgWeight: 0, avgHeight: 0 };
    
    const totalWeight = growthRecords.reduce((sum, record) => sum + record.weight, 0);
    const totalHeight = growthRecords.reduce((sum, record) => sum + record.height, 0);
    
    return {
      avgWeight: totalWeight / growthRecords.length,
      avgHeight: totalHeight / growthRecords.length
    };
  };

  const { avgWeight, avgHeight } = calculateAverages();

  // Generate chart data
  const getChartData = () => {
    const sortedRecords = [...growthRecords].sort((a, b) => 
      new Date(a.measurementDate) - new Date(b.measurementDate)
    );
    
    return sortedRecords.map(record => ({
      date: formatDate(record.measurementDate),
      weight: record.weight,
      height: record.height,
      shortDate: new Date(record.measurementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  const chartData = getChartData();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Growth Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">{growthRecords.length} growth records</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={onAddRecord}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Growth Record
          </button>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">⚖️</span>
            <span className="text-sm text-gray-600">Current Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestGrowth?.weight ? `${latestGrowth.weight} kg` : 'Not recorded'}
          </p>
          {weightDiff !== undefined && (
            <p className="text-sm mt-1">
              <span className={getTrendColor(weightTrend)}>
                {getTrendIcon(weightTrend)} {Math.abs(weightDiff).toFixed(1)} kg {weightTrend}
              </span>
            </p>
          )}
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">📏</span>
            <span className="text-sm text-gray-600">Current Height</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestGrowth?.height ? `${latestGrowth.height} cm` : 'Not recorded'}
          </p>
          {heightDiff !== undefined && (
            <p className="text-sm mt-1">
              <span className={getTrendColor(heightTrend)}>
                {getTrendIcon(heightTrend)} {Math.abs(heightDiff).toFixed(1)} cm {heightTrend}
              </span>
            </p>
          )}
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-600">📊</span>
            <span className="text-sm text-gray-600">Average Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {avgWeight ? `${avgWeight.toFixed(1)} kg` : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Based on {growthRecords.length} records
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600">📅</span>
            <span className="text-sm text-gray-600">Last Updated</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {latestGrowth?.measurementDate ? formatDate(latestGrowth.measurementDate) : 'Never'}
          </p>
          {growthRecords.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {growthRecords.length} records total
            </p>
          )}
        </div>
      </div>

      {/* Growth Chart Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Growth Analytics Chart</h4>
            <p className="text-sm text-gray-600">Visualize weight & height progress trends</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('weight')}
              className={`px-3 py-1 rounded text-sm ${
                chartType === 'weight' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Weight
            </button>
            <button
              onClick={() => setChartType('height')}
              className={`px-3 py-1 rounded text-sm ${
                chartType === 'height' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Height
            </button>
            <button
              onClick={() => setChartType('both')}
              className={`px-3 py-1 rounded text-sm ${
                chartType === 'both' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Both
            </button>
          </div>
        </div>
        
        {chartData.length > 1 ? (
          <div className="h-64">
            {/* Simple Bar Chart */}
            <div className="h-48 flex items-end space-x-2 mt-4">
              {chartData.map((data, index) => {
                const maxWeight = Math.max(...chartData.map(d => d.weight));
                const maxHeight = Math.max(...chartData.map(d => d.height));
                
                const weightHeight = (data.weight / maxWeight) * 120;
                const heightHeight = (data.height / maxHeight) * 120;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-gray-500 mb-2">{data.shortDate}</div>
                    <div className="flex items-end space-x-1 w-full justify-center">
                      {chartType !== 'height' && (
                        <div 
                          className="bg-green-500 rounded-t w-4"
                          style={{ height: `${weightHeight}px` }}
                          title={`Weight: ${data.weight} kg`}
                        ></div>
                      )}
                      {chartType !== 'weight' && (
                        <div 
                          className="bg-blue-500 rounded-t w-4"
                          style={{ height: `${heightHeight}px` }}
                          title={`Height: ${data.height} cm`}
                        ></div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      <div>W: {data.weight}kg</div>
                      <div>H: {data.height}cm</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-center gap-4 mt-4">
              {chartType !== 'height' && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Weight (kg)</span>
                </div>
              )}
              {chartType !== 'weight' && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Height (cm)</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-500">Insufficient data for chart</p>
            <p className="text-gray-400 text-sm mt-1">
              Add at least 2 growth records to see the chart
            </p>
          </div>
        )}
      </div>

      {/* Breed Standards Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Breed Standards Analysis</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Ideal Weight Range</span>
                <span className="text-sm font-semibold">{breedStandards.weight.min} - {breedStandards.weight.max} {breedStandards.weight.unit}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full relative">
                <div 
                  className="h-full bg-green-500 rounded-full absolute"
                  style={{ 
                    left: '0%', 
                    width: '100%',
                    opacity: 0.3 
                  }}
                ></div>
                {latestGrowth?.weight && (
                  <div 
                    className="h-5 w-5 bg-green-600 rounded-full absolute -top-1 transform -translate-x-1/2"
                    style={{ 
                      left: `${((latestGrowth.weight - breedStandards.weight.min) / (breedStandards.weight.max - breedStandards.weight.min)) * 100}%` 
                    }}
                    title={`Current: ${latestGrowth.weight} kg`}
                  ></div>
                )}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{breedStandards.weight.min}{breedStandards.weight.unit}</span>
                <span>{breedStandards.weight.max}{breedStandards.weight.unit}</span>
              </div>
              <p className={`text-sm mt-2 ${standardsCheck.weight ? 'text-green-600' : 'text-orange-600'}`}>
                {standardsCheck.weight 
                  ? '✓ Within ideal weight range' 
                  : latestGrowth?.weight 
                    ? `⚠️ ${latestGrowth.weight < breedStandards.weight.min ? 'Underweight' : 'Overweight'}`
                    : 'No weight data available'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Ideal Height Range</span>
                <span className="text-sm font-semibold">{breedStandards.height.min} - {breedStandards.height.max} {breedStandards.height.unit}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full relative">
                <div 
                  className="h-full bg-blue-500 rounded-full absolute"
                  style={{ 
                    left: '0%', 
                    width: '100%',
                    opacity: 0.3 
                  }}
                ></div>
                {latestGrowth?.height && (
                  <div 
                    className="h-5 w-5 bg-blue-600 rounded-full absolute -top-1 transform -translate-x-1/2"
                    style={{ 
                      left: `${((latestGrowth.height - breedStandards.height.min) / (breedStandards.height.max - breedStandards.height.min)) * 100}%` 
                    }}
                    title={`Current: ${latestGrowth.height} cm`}
                  ></div>
                )}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{breedStandards.height.min}{breedStandards.height.unit}</span>
                <span>{breedStandards.height.max}{breedStandards.height.unit}</span>
              </div>
              <p className={`text-sm mt-2 ${standardsCheck.height ? 'text-green-600' : 'text-orange-600'}`}>
                {standardsCheck.height 
                  ? '✓ Within ideal height range' 
                  : latestGrowth?.height 
                    ? `⚠️ ${latestGrowth.height < breedStandards.height.min ? 'Below average' : 'Above average'}`
                    : 'No height data available'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 italic">
            {breedStandards.description}
          </p>
        </div>

        {/* Growth Insights */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Growth Insights</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600">📈</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Growth Trend Analysis</p>
                <p className="text-sm text-gray-600">
                  {weightTrend === 'increasing' && heightTrend === 'increasing' 
                    ? 'Both weight and height are showing healthy growth.'
                    : weightTrend === 'stable' && heightTrend === 'stable'
                    ? 'Growth appears to be stable and consistent.'
                    : 'Monitor growth patterns regularly for any significant changes.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600">📅</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Recording Frequency</p>
                <p className="text-sm text-gray-600">
                  {growthRecords.length < 2 
                    ? 'Record growth monthly for puppies/kittens, every 3-6 months for adults.'
                    : `You have ${growthRecords.length} records. ${growthRecords.length >= 3 ? 'Great tracking!' : 'Keep adding more records for better analysis.'}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600">💡</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Recommendations</p>
                <p className="text-sm text-gray-600">
                  {latestGrowth?.weight 
                    ? `Maintain regular feeding schedule and monitor ${petName}'s activity levels.`
                    : `Start tracking ${petName}'s growth to monitor health and development.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Tip */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-lg p-6 text-white mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl text-green-900">💡</span>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-lg">Growth Monitoring Tip</h4>
            <p className="text-sm text-green-100">
              For optimal health tracking: 
              {petSpecies === 'dog' ? ' Puppies: monthly, Adults: every 3 months.' : 
               petSpecies === 'cat' ? ' Kittens: monthly, Adults: every 6 months.' : 
               ' Record weight weekly during growth phases, monthly for maintenance.'}
              Consistent monitoring helps detect health issues early.
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900">Growth History Table</h4>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Weight (kg)</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Height (cm)</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Notes</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {growthRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📊</span>
                      </div>
                      <p className="text-gray-500">No growth records found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Add your first growth record to track {petName}'s progress
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                [...growthRecords]
                  .sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate))
                  .map((record, index) => (
                    <tr key={record.growthId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatDate(record.measurementDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.weight}</span>
                          <span className="text-gray-500">kg</span>
                          {index === 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Latest</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.height}</span>
                          <span className="text-gray-500">cm</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {record.notes ? (
                          <div className="line-clamp-1">{record.notes}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onDelete(record.growthId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          {growthRecords.length > 5 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {Math.min(5, growthRecords.length)} of {growthRecords.length} records
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Load More History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Medical History Tab Component
function MedicalTab({ medicalRecords, onAddRecord, onDelete, petId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await api.searchMedicalRecords(petId, searchTerm);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const getFilteredRecords = () => {
    let records = searchTerm ? searchResults : medicalRecords;
    
    if (filterType !== 'All') {
      records = records.filter(record => 
        record.recordType?.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    return records;
  };

  const displayRecords = getFilteredRecords();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'routine': return 'bg-green-100 text-green-700';
      case 'illness': return 'bg-red-100 text-red-700';
      case 'vaccine': return 'bg-blue-100 text-blue-700';
      case 'injury': return 'bg-orange-100 text-orange-700';
      case 'other': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Medical Records</h3>
          <p className="text-sm text-gray-600 mt-1">{medicalRecords.length} medical records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-48"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="All">All Types</option>
              <option value="Routine">Routine</option>
              <option value="Illness">Illness</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Injury">Injury</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            onClick={onAddRecord}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Condition / Event</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Treatment</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Notes</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isSearching ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3"></div>
                    <p className="text-sm text-gray-600">Searching medical records...</p>
                  </div>
                </td>
              </tr>
            ) : displayRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">🩺</span>
                    </div>
                    <p className="text-gray-500">
                      {searchTerm || filterType !== 'All' 
                        ? 'No matching records found' 
                        : 'No medical records found'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm || filterType !== 'All' 
                        ? 'Try changing your search or filter' 
                        : 'Add your first medical record'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayRecords
                .sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))
                .map((record) => (
                  <tr key={record.medicalId} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatDate(record.recordDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-gray-900">{record.conditionName}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(record.recordType)}`}>
                          {record.recordType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {record.treatment ? (
                          <div className="line-clamp-2">{record.treatment}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {record.notes ? (
                          <div className="line-clamp-2">{record.notes}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onDelete(record.medicalId)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        {displayRecords.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {displayRecords.length} of {medicalRecords.length} records
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}