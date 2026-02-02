import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, Clock, Calendar, Download, Edit, Trash2, Search } from 'lucide-react';
import { Link } from "react-router-dom";
import AIPetCareModal from './AIHealth';
import AddVaccinationModal from './AddVaccinationModel';
import AddGrowthRecordModal from './AddGrowthRecordModal';
import AddMedicalRecordModal from './AddMedicalRecordModal';



export default function PetDetailComplete() {
  const [activeTab, setActiveTab] = useState('vaccination');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);



  const tabs = [
    { id: 'vaccination', label: 'Vaccination Timeline', icon: '💉' },
    { id: 'growth', label: 'Growth', icon: '📊' },
    { id: 'medical', label: 'Medical History', icon: '🩺' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            to="/pet-owner/mypets"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Pets</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">🐾</span>
            <span className="font-bold text-xl text-green-600">PetCare</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Pet Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop"
                  alt="Cooper"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Cooper</h1>
                <p className="text-green-600 text-lg mb-3">Golden Retriever, 3years</p>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Healthy
                  </span>
                  <span className="text-sm text-gray-500">• Last checkup: 2 weeks ago</span>
                </div>
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
            {activeTab === 'vaccination' && <VaccinationTab />}
            {activeTab === 'growth' && <GrowthTab />}
            {activeTab === 'medical' && <MedicalTab />}
          </div>
        </div>

        {/* Footer (only on medical tab) */}
        {activeTab === 'medical' && (
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-green-600">🐾</span>
              <span className="font-semibold text-gray-900">PetCare Dashboard</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 PetCare Services. All health records are securely encrypted.
            </p>
          </div>
        )}
      </div>
      <AIPetCareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
     />

    <AddVaccinationModal
        isOpen={isVaccinationModalOpen}
        onClose={() => setIsVaccinationModalOpen(false)}
        petName="Cooper"
        petType="Dog"
        petBreed="Golden Retriever"
    />

    </div>

  );
}

// Vaccination Timeline Tab
function VaccinationTab() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Vaccination Timeline</h3>
        <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
          <span>☰</span> Filter: All
        </button>
      </div>

      <div className="space-y-4">
        {/* Completed */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-500">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">Rabies</h4>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Completed
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700 flex items-center gap-2">
                  <span>📅</span> Oct 14, 2023
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span>🏥</span> City Vet Clinic • Dr. Sarah Wilson
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-500">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">
                  DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)
                </h4>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  Due Soon
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-orange-700 flex items-center gap-2 font-medium">
                  <span>📅</span> Nov 12, 2024 (in 15 days)
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span>🏥</span> Scheduled at City Vet Clinic
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  Confirm Appointment
                </button>
                <button className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Planned */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">Bordetella</h4>
                <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                  Planned
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Dec 2024 • Recommended annual booster</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Growth Tab
function GrowthTab() {
  const growthData = [
    { date: 'Sep 15, 2023', weight: '32 | kg', height: '57.9 cm' },
    { date: 'Sep 15, 2023', weight: '32 | kg', height: '57.9 cm' },
    { date: 'Sep 15, 2023', weight: '32 | kg', height: '57.9 cm' }
  ];
  const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Growth Analytics</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => setIsGrowthModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Growth Record
          </button>

        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">⚖️</span>
            <span className="text-sm text-gray-600">Current Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">32.5 kg</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">📏</span>
            <span className="text-sm text-gray-600">Current Height</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">58.2 cm</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600">📅</span>
            <span className="text-sm text-gray-600">Last Updated</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Oct 12, 2023</p>
        </div>
      </div>

      {/* Analytics and Standards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-1">Growth Analytics</h4>
            <p className="text-sm text-gray-600">Visualize weight & height progress trends</p>
          </div>
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">View Weight</button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">View Height</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">View Both</button>
          </div>
          <div className="h-48 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <p className="text-gray-400">Growth Chart</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Breed Standards</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Ideal Weight (Male)</span>
                <span className="text-sm font-semibold">29 - 34 kg</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Ideal Height (Male)</span>
                <span className="text-sm font-semibold">56 - 61 cm</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 italic">
            Buddy is perfectly showing in the height range due to both nutrients.
          </p>
        </div>
      </div>

      {/* Growth Tip */}
      <div className="bg-gray-900 rounded-lg p-6 text-white mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-lg">Growth Tip</h4>
            <p className="text-sm text-gray-300">
              Regular weight monitoring detect early a series of reachable changes in their weight.
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900">Growth History Table</h4>
          <button className="text-green-600 text-sm font-medium">Download CSV</button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Weight (kg)</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Height (cm)</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {growthData.map((record, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">{record.weight}</td>
                  <td className="px-6 py-4 text-sm">{record.height}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-1 text-gray-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t text-center">
            <button className="text-gray-600 text-sm font-medium">Load More History</button>
          </div>
        </div>
        <AddGrowthRecordModal
            isOpen={isGrowthModalOpen}
            onClose={() => setIsGrowthModalOpen(false)}
            petName="Cooper"
        />

      </div>
    </>
  );
}

// Medical History Tab
function MedicalTab() {
  const records = [
    { date: 'Oct 12, 2023', condition: 'Annual Checkup', type: 'Routine', treatment: 'General physical exam, weight check', notes: 'Buddy is at a healthy weight (72 lbs). Vital signs normal.' },
    { date: 'Aug 05, 2023', condition: 'Ear Infection (Left)', type: 'Illness', treatment: 'Antibiotic drops (Mometamax)', notes: '7-day course, 4 drops daily. Follow-up unnecessary unless irritation persists.' },
    { date: 'Apr 19, 2023', condition: 'Rabies Vaccination', type: 'Vaccine', treatment: '3-Year Booster Shot', notes: 'Next due: April 2026. No adverse reactions observed.' },
    { date: 'Jan 14, 2023', condition: 'Limping (Front Right)', type: 'Injury', treatment: 'Rest and NSAID (Carprofen)', notes: 'X-ray clear. Likely soft tissue strain from park. Symptoms cleared in 4 days.' }
  ];
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Medical Records</h3>
        <div className="flex gap-3">
          <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMedicalModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium flex items-center gap-2"
            >
            <Plus className="w-4 h-4" />
            Add Record
        </button>

        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Condition / Event</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Treatment</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{record.date}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 mb-1">{record.condition}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    record.type === 'Routine' ? 'bg-green-100 text-green-700' :
                    record.type === 'Illness' ? 'bg-red-100 text-red-700' :
                    record.type === 'Vaccine' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{record.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{record.treatment}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddMedicalRecordModal
            isOpen={isMedicalModalOpen}
            onClose={() => setIsMedicalModalOpen(false)}
            petName="Cooper"
        />

      </div>
    </>
  );
}
