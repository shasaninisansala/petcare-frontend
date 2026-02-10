import React, { useState, useEffect } from 'react';
import { Users, Zap, Star, Heart, AlertTriangle, Scissors, Dumbbell, Droplets, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import CTAAndFooter from '../components/CTAAndFooter';

// Breed data
const breedData = {
  Dog: [
    {
      id: 1,
      name: 'Golden Retriever',
      tagline: 'The Ultimate Family Companion',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop',
      size: 'Large',
      lifespan: '10-12 yrs',
      energy: 'High',
      temperament: [
        { icon: Users, title: 'Friendly & Social', description: 'Excellent with strangers and other pets alike.' },
        { icon: Zap, title: 'High Energy', description: 'Requires daily long walks and active play sessions.' },
        { icon: Star, title: 'Easy to Train', description: 'Eager to please and highly responsive to positive reinforcement.' },
        { icon: Heart, title: 'Good with Kids', description: 'Naturally patient and gentle with children of all ages.' }
      ],
      diet: [
        'Require high-quality kibble with real meat as the first ingredient.',
        'Highly prone to obesity. Stick to twice-daily measured feeding.',
        'Consider Glucosamine and Chondroitin for joint health.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Daily brushing is recommended to manage their heavy double-coat shedding.' },
        { icon: Dumbbell, title: 'Exercise', description: 'At least 60-90 minutes of active movement daily, including fetching or swimming.' },
        { icon: Droplets, title: 'Bathing', description: 'Occasional baths (every 4-6 weeks) to keep the skin healthy and coat shiny.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Hip & Elbow Dysplasia',
          description: 'Genetic condition where joints don\'t fit perfectly. Can lead to arthritis.',
          prevention: 'Maintain healthy weight & low-impact exercise.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Heart Conditions',
          description: 'Prone to Subaortic Stenosis (SAS), a narrowing of the vessel carrying blood from the heart.',
          prevention: 'Regular veterinary screenings and cardiac checkups.',
          color: 'orange'
        }
      ]
    },
    {
      id: 2,
      name: 'Labrador Retriever',
      tagline: 'America\'s Favorite Family Dog',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
      size: 'Large',
      lifespan: '10-12 yrs',
      energy: 'Very High',
      temperament: [
        { icon: Users, title: 'Outgoing & Friendly', description: 'Extremely social and loves to be part of family activities.' },
        { icon: Zap, title: 'Energetic', description: 'Needs plenty of exercise to prevent destructive behavior.' },
        { icon: Star, title: 'Highly Intelligent', description: 'Quick learners, excel in obedience and field trials.' },
        { icon: Heart, title: 'Loyal Companion', description: 'Forms strong bonds with family members.' }
      ],
      diet: [
        'Requires a balanced diet with protein and healthy fats.',
        'Prone to overeating; portion control is essential.',
        'Monitor weight carefully to prevent obesity.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Weekly brushing to control shedding; daily during shedding seasons.' },
        { icon: Dumbbell, title: 'Exercise', description: 'Minimum 1-2 hours of vigorous exercise daily.' },
        { icon: Droplets, title: 'Bathing', description: 'Regular baths to manage oil in their double coat.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Obesity',
          description: 'Labradors have a tendency to overeat and gain weight quickly.',
          prevention: 'Strict portion control and regular exercise.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Joint Issues',
          description: 'Prone to hip and elbow dysplasia like many large breeds.',
          prevention: 'Proper nutrition and avoiding excessive jumping.',
          color: 'orange'
        }
      ]
    },
    {
      id: 3,
      name: 'German Shepherd',
      tagline: 'The Versatile Working Dog',
      image: 'https://i.pinimg.com/1200x/14/b1/56/14b156bdb9133b45e97fbc122ff59a1d.jpg',
      size: 'Large',
      lifespan: '9-13 yrs',
      energy: 'High',
      temperament: [
        { icon: Users, title: 'Loyal & Protective', description: 'Devoted to family and naturally protective.' },
        { icon: Zap, title: 'Working Drive', description: 'Thrives when given a job or purpose.' },
        { icon: Star, title: 'Highly Trainable', description: 'Excels in obedience, protection, and service work.' },
        { icon: Heart, title: 'Intelligent & Alert', description: 'Constantly aware of surroundings and quick to learn.' }
      ],
      diet: [
        'High-quality large breed formula with joint supplements.',
        'Protein-rich diet to support muscle mass and energy.',
        'Multiple small meals to prevent bloat risk.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Daily brushing required due to heavy shedding.' },
        { icon: Dumbbell, title: 'Exercise', description: 'Needs both physical exercise and mental stimulation daily.' },
        { icon: Droplets, title: 'Bathing', description: 'Only when necessary to preserve natural oils.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Hip Dysplasia',
          description: 'Common genetic issue affecting mobility.',
          prevention: 'Regular exercise and joint supplements.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Digestive Issues',
          description: 'Prone to bloat; requires careful feeding practices.',
          prevention: 'Multiple small meals and rest after eating.',
          color: 'orange'
        }
      ]
    },
    {
      id: 4,
      name: 'Beagle',
      tagline: 'The Merry Little Hound',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv2SjVOvEt4gSABZX4G44FIbIA7LfjI3yNmQ&s',
      size: 'Medium',
      lifespan: '12-15 yrs',
      energy: 'Moderate-High',
      temperament: [
        { icon: Users, title: 'Friendly & Curious', description: 'Gets along with everyone including other pets.' },
        { icon: Zap, title: 'Active Scent Hound', description: 'Loves to follow scents and explore.' },
        { icon: Star, title: 'Independent Thinker', description: 'Can be stubborn but food-motivated for training.' },
        { icon: Heart, title: 'Great Family Dog', description: 'Gentle and patient with children.' }
      ],
      diet: [
        'Controlled portions due to tendency to overeat.',
        'High-quality food for active small-medium breeds.',
        'Monitor treat intake carefully.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Weekly brushing; more during shedding seasons.' },
        { icon: Dumbbell, title: 'Exercise', description: 'Daily walks plus playtime in secure areas.' },
        { icon: Droplets, title: 'Bathing', description: 'Monthly baths or as needed.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Obesity',
          description: 'Prone to weight gain which affects joints and health.',
          prevention: 'Strict diet control and regular exercise.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Ear Infections',
          description: 'Floppy ears trap moisture and debris.',
          prevention: 'Regular ear cleaning and inspection.',
          color: 'orange'
        }
      ]
    },
    {
      id: 5,
      name: 'Poodle',
      tagline: 'The Intelligent Aristocrat',
      image: 'https://puppymansionmiami.com/cdn/shop/articles/Discovering_the_World_of_Poodles.webp?v=1723277648',
      size: 'Varies (Toy, Miniature, Standard)',
      lifespan: '10-18 yrs',
      energy: 'Moderate-High',
      temperament: [
        { icon: Users, title: 'Intelligent & Alert', description: 'One of the most intelligent dog breeds.' },
        { icon: Zap, title: 'Active & Agile', description: 'Excels in dog sports and activities.' },
        { icon: Star, title: 'Highly Trainable', description: 'Quick to learn commands and tricks.' },
        { icon: Heart, title: 'Loyal & Affectionate', description: 'Forms strong bonds with family.' }
      ],
      diet: [
        'High-quality food appropriate for their size.',
        'Monitor for food allergies common in the breed.',
        'Small, frequent meals for toy varieties.'
      ],
      grooming: [
        { icon: Scissors, title: 'Professional Grooming', description: 'Requires regular professional grooming every 4-6 weeks.' },
        { icon: Dumbbell, title: 'Mental Exercise', description: 'Needs mental stimulation to prevent boredom.' },
        { icon: Droplets, title: 'Regular Brushing', description: 'Daily brushing to prevent matting of curly coat.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Eye Problems',
          description: 'Prone to progressive retinal atrophy and cataracts.',
          prevention: 'Regular eye examinations.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Skin Conditions',
          description: 'Sensitive skin prone to allergies and infections.',
          prevention: 'Regular grooming and hypoallergenic diet.',
          color: 'orange'
        }
      ]
    }
  ],
  Cat: [
    {
      id: 6,
      name: 'Maine Coon',
      tagline: 'The Gentle Giant of Cats',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      size: 'Large',
      lifespan: '12-15 yrs',
      energy: 'Moderate',
      temperament: [
        { icon: Users, title: 'Gentle & Friendly', description: 'Known as the "gentle giants" of the cat world.' },
        { icon: Zap, title: 'Playful & Intelligent', description: 'Enjoys puzzle toys and interactive play.' },
        { icon: Star, title: 'Dog-like Personality', description: 'Often follows owners and can be leash-trained.' },
        { icon: Heart, title: 'Good with Children', description: 'Patient and tolerant with family members.' }
      ],
      diet: [
        'High-protein diet to support large frame and muscle.',
        'Controlled portions to prevent obesity.',
        'Fresh water always available; prone to kidney issues.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Daily brushing to prevent mats in long fur.' },
        { icon: Dumbbell, title: 'Play Time', description: 'Regular interactive play sessions.' },
        { icon: Droplets, title: 'Water Play', description: 'Many enjoy water and may join you in showers.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Hypertrophic Cardiomyopathy',
          description: 'Common heart condition in large cat breeds.',
          prevention: 'Regular cardiac screenings.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Hip Dysplasia',
          description: 'Can occur in this large breed.',
          prevention: 'Maintain healthy weight and provide joint supplements.',
          color: 'orange'
        }
      ]
    },
    {
      id: 7,
      name: 'Siamese',
      tagline: 'The Vocal Companion',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=400&fit=crop',
      size: 'Medium',
      lifespan: '15-20 yrs',
      energy: 'High',
      temperament: [
        { icon: Users, title: 'Sociable & Vocal', description: 'Loves to "talk" and be involved in everything.' },
        { icon: Zap, title: 'Energetic & Playful', description: 'Needs regular mental and physical stimulation.' },
        { icon: Star, title: 'Highly Intelligent', description: 'Quick learners who enjoy puzzle toys.' },
        { icon: Heart, title: 'Bond Strongly', description: 'Forms deep attachments to their humans.' }
      ],
      diet: [
        'High-quality protein diet for lean muscle.',
        'Monitor weight; they should remain sleek.',
        'Small frequent meals preferred.'
      ],
      grooming: [
        { icon: Scissors, title: 'Brushing', description: 'Weekly brushing due to short coat.' },
        { icon: Dumbbell, title: 'Mental Stimulation', description: 'Needs interactive play and puzzles daily.' },
        { icon: Droplets, title: 'Minimal Bathing', description: 'Rarely needs baths; self-cleaning efficient.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Respiratory Issues',
          description: 'Prone to asthma and bronchial disease.',
          prevention: 'Clean environment and regular vet checks.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Dental Issues',
          description: 'Genetic predisposition to dental problems.',
          prevention: 'Regular dental care and checkups.',
          color: 'orange'
        }
      ]
    },
    {
      id: 8,
      name: 'Persian',
      tagline: 'The Aristocrat of Cats',
      image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
      size: 'Medium',
      lifespan: '12-17 yrs',
      energy: 'Low',
      temperament: [
        { icon: Users, title: 'Calm & Sweet', description: 'Gentle, quiet, and prefers peaceful environments.' },
        { icon: Zap, title: 'Low Activity', description: 'Content with lounging and gentle play.' },
        { icon: Star, title: 'Affectionate', description: 'Loves attention but not overly demanding.' },
        { icon: Heart, title: 'Indoor Cat', description: 'Best suited for indoor life only.' }
      ],
      diet: [
        'Special diet for urinary tract health.',
        'Wet food to ensure hydration.',
        'Portion control to prevent obesity.'
      ],
      grooming: [
        { icon: Scissors, title: 'Daily Brushing', description: 'Essential to prevent mats in long fur.' },
        { icon: Dumbbell, title: 'Eye Cleaning', description: 'Daily face cleaning to prevent tear staining.' },
        { icon: Droplets, title: 'Regular Baths', description: 'Monthly baths recommended.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Breathing Issues',
          description: 'Brachycephalic face can cause breathing difficulties.',
          prevention: 'Keep cool and avoid stress.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Kidney Disease',
          description: 'Prone to polycystic kidney disease.',
          prevention: 'Regular screening and hydration.',
          color: 'orange'
        }
      ]
    },
    {
      id: 9,
      name: 'Bengal',
      tagline: 'The Wild-Looking Athlete',
      image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop',
      size: 'Medium-Large',
      lifespan: '12-16 yrs',
      energy: 'Very High',
      temperament: [
        { icon: Users, title: 'Active & Athletic', description: 'Loves to climb, jump, and explore.' },
        { icon: Zap, title: 'High Energy', description: 'Needs lots of physical and mental stimulation.' },
        { icon: Star, title: 'Intelligent & Curious', description: 'Gets into everything; needs constant engagement.' },
        { icon: Heart, title: 'Water Loving', description: 'Many enjoy playing with water.' }
      ],
      diet: [
        'High-protein diet for active lifestyle.',
        'Raw or high-quality wet food often preferred.',
        'Monitor for food sensitivities.'
      ],
      grooming: [
        { icon: Scissors, title: 'Minimal Brushing', description: 'Short coat needs weekly brushing.' },
        { icon: Dumbbell, title: 'Active Play', description: 'Multiple play sessions daily required.' },
        { icon: Droplets, title: 'Water Features', description: 'Provide water fountains for entertainment.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Heart Disease',
          description: 'Prone to hypertrophic cardiomyopathy.',
          prevention: 'Regular cardiac ultrasound screening.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'GI Sensitivities',
          description: 'Sensitive digestive systems.',
          prevention: 'Consistent high-quality diet.',
          color: 'orange'
        }
      ]
    },
    {
      id: 10,
      name: 'Ragdoll',
      tagline: 'The Floppy Lap Cat',
      image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop',
      size: 'Large',
      lifespan: '12-17 yrs',
      energy: 'Low-Moderate',
      temperament: [
        { icon: Users, title: 'Docile & Gentle', description: 'Known for going limp when picked up.' },
        { icon: Zap, title: 'Relaxed Demeanor', description: 'Calm and easygoing personality.' },
        { icon: Star, title: 'Affectionate', description: 'Loves to follow owners and be involved.' },
        { icon: Heart, title: 'Great with Families', description: 'Excellent with children and other pets.' }
      ],
      diet: [
        'High-quality diet for long-haired breeds.',
        'Monitor for hairballs with specialized food.',
        'Controlled portions to prevent weight gain.'
      ],
      grooming: [
        { icon: Scissors, title: 'Regular Brushing', description: 'Brush 2-3 times weekly to prevent mats.' },
        { icon: Dumbbell, title: 'Gentle Play', description: 'Moderate play sessions preferred.' },
        { icon: Droplets, title: 'Minimal Bathing', description: 'Only bathe when necessary.' }
      ],
      healthIssues: [
        {
          icon: AlertTriangle,
          title: 'Heart Conditions',
          description: 'Prone to hypertrophic cardiomyopathy.',
          prevention: 'Regular heart screenings.',
          color: 'amber'
        },
        {
          icon: Heart,
          title: 'Bladder Stones',
          description: 'Susceptible to urinary tract issues.',
          prevention: 'Proper hydration and special diet.',
          color: 'orange'
        }
      ]
    }
  ]
};

export default function BreedInformation() {
  const [selectedTab, setSelectedTab] = useState('Dog');
  const [selectedBreed, setSelectedBreed] = useState(null);

  // Initialize with first breed
  useEffect(() => {
    if (breedData[selectedTab] && breedData[selectedTab].length > 0 && !selectedBreed) {
      setSelectedBreed(breedData[selectedTab][0]);
    }
  }, [selectedTab, selectedBreed]);

  // Handle breed selection from dropdown
  const handleBreedSelect = (breedName) => {
    const breed = breedData[selectedTab].find(b => b.name === breedName);
    if (breed) {
      setSelectedBreed(breed);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedBreed(breedData[tab][0]);
  };

  if (!selectedBreed) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading breed information...</p>
          </div>
        </div>
        <CTAAndFooter />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1 mb-8 md:mb-0">
                <p className="text-green-600 text-sm font-medium mb-2">PetCare Knowledge Base</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Breed Information</h1>
                <p className="text-gray-600 max-w-2xl">
                  Explore comprehensive guides tailored to your pet's breed. Get expert advice on health,
                  diet, and temperament to ensure a happy, healthy life for your furry companion.
                </p>
              </div>
              <div className="ml-0 md:ml-8">
                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-amber-50">
                  <img
                    src={selectedTab === 'Dog' 
                      ? "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"
                      : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"
                    }
                    alt={selectedTab}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Tab Selection and Breed Dropdown */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <div className="flex gap-4">
                <button
                  onClick={() => handleTabChange('Dog')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedTab === 'Dog'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dog
                </button>
                <button
                  onClick={() => handleTabChange('Cat')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedTab === 'Cat'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cat
                </button>
              </div>
              <div className="md:ml-auto">
                <select
                  value={selectedBreed?.name || ''}
                  onChange={(e) => handleBreedSelect(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a breed...</option>
                  {breedData[selectedTab].map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breed Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={selectedBreed.image}
                  alt={selectedBreed.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedBreed.name}</h2>
                <p className="text-gray-600 mb-6">"{selectedBreed.tagline}"</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">SIZE</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="font-semibold text-gray-900">{selectedBreed.size}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Lifespan</p>
                    <p className="font-semibold text-gray-900">{selectedBreed.lifespan}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Energy</p>
                    <p className="font-semibold text-gray-900">{selectedBreed.energy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior & Temperament */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Behavior & Temperament</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedBreed.temperament.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diet & Nutrition and Grooming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Diet & Nutrition */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Diet & Nutrition</h3>
              </div>
              
              <div className="space-y-4">
                {selectedBreed.diet.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <div className="flex gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="font-medium text-green-900 text-sm">Recommendation</p>
                </div>
                <p className="text-sm text-green-800 pl-7">
                  {selectedTab === 'Dog' 
                    ? "Provide mental stimulation with puzzle feeders to prevent boredom eating and maintain healthy weight!"
                    : "Consider elevated feeding stations for comfort and to aid digestion in your feline friend!"}
                </p>
              </div>
            </div>

            {/* Grooming & Daily Care */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Grooming & Daily Care</h3>
              </div>
              
              <div className="space-y-4">
                {selectedBreed.grooming.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}:</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common Health Considerations */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Health Considerations</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedBreed.healthIssues.map((issue, index) => (
                <div 
                  key={index} 
                  className={`${issue.color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-orange-50 border-orange-200'} rounded-lg p-6 border`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${issue.color === 'amber' ? 'bg-amber-100' : 'bg-orange-100'} w-10 h-10 rounded-full flex items-center justify-center`}>
                      <issue.icon className={`w-5 h-5 ${issue.color === 'amber' ? 'text-amber-600' : 'text-orange-600'}`} />
                    </div>
                    <h4 className="font-bold text-gray-900">{issue.title}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                  <p className="text-sm text-green-700 font-medium">
                    Prevention: {issue.prevention}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500 italic">
              Disclaimer: This information is for educational purposes only and does not substitute for professional veterinary advice. Always consult with a licensed veterinarian regarding the health and well-being of your pet.
            </div>
          </div>

          {/* Breed Quick Select */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Browse Other {selectedTab} Breeds</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {breedData[selectedTab]
                .filter(breed => breed.id !== selectedBreed.id)
                .map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => setSelectedBreed(breed)}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                      <img
                        src={breed.image}
                        alt={breed.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{breed.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{breed.size.split(' ')[0]} • {breed.energy.split(' ')[0]}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
      <CTAAndFooter />
    </>
  );
}