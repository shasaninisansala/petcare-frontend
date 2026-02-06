import React from 'react';
import { MapPin, CheckCircle, Eye, Home, Mail, Heart } from 'lucide-react';

export default function AdoptionPetDetail({ onApply, onMessage }) {
  const pet = {
    name: 'Cooper',
    breed: 'Beagle',
    age: '2 years',
    gender: 'Male',
    size: 'Medium Size',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=600&fit=crop',
    shelter: {
      name: 'Happy Paws Shelter',
      location: 'Austin TX',
      responseTime: '< 2 hours'
    },
    attributes: [
      { icon: CheckCircle, label: 'Vaccinated', color: 'text-green-600' },
      { icon: Eye, label: 'Kid Friendly', color: 'text-blue-600' },
      { icon: Home, label: 'House Trained', color: 'text-green-600' }
    ],
    description: {
      intro: 'Cooper is a lovable, high-energy Beagle who is looking for his forever adventure buddy. He was rescued from a local park and has since become the favorite at Happy Paws. He has a nose for fun (and treats!) and absolutely loves long walks where he can explore every scent.',
      personality: "When he's not on the trail, Cooper is a world-class snuggler who enjoys curling up on a soft rug. He's great with other dogs and has a very gentle temperament with children."
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Image */}
          <div className="bg-gray-200">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>

          {/* Right - Details */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{pet.name}</h1>
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{pet.shelter.name}, {pet.shelter.location}</span>
              </div>
              <p className="text-gray-600">
                {pet.breed} • {pet.age} • {pet.gender} • {pet.size}
              </p>
            </div>

            {/* Attributes */}
            <div className="flex gap-4 mb-6">
              {pet.attributes.map((attr, index) => {
                const Icon = attr.icon;
                return (
                  <div key={index} className="flex-1 text-center py-3 bg-gray-50 rounded-lg">
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${attr.color}`} />
                    <p className="text-xs text-gray-700 font-medium">{attr.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Meet {pet.name}</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                {pet.description.intro}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {pet.description.personality}
              </p>
            </div>

            {/* Shelter Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{pet.shelter.name}</p>
                  <p className="text-sm text-gray-600">Response time: {pet.shelter.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={onMessage}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Message
              </button>
              <button 
                onClick={onApply}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Apply to Adopt
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
