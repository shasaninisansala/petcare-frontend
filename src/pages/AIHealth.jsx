import React, { useState, useEffect } from 'react';
import { Brain, Clock, AlertCircle, CheckCircle, Calendar, Syringe, ChevronRight, Shield, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AIHealth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Define symptoms array
  const symptoms = [
    { id: 1, name: 'Lethargy', icon: '😴', color: 'bg-yellow-100 text-yellow-700' },
    { id: 2, name: 'Vomiting', icon: '🤢', color: 'bg-red-100 text-red-700' },
    { id: 3, name: 'Diarrhea', icon: '💩', color: 'bg-orange-100 text-orange-700' },
    { id: 4, name: 'Coughing', icon: '🤧', color: 'bg-blue-100 text-blue-700' },
    { id: 5, name: 'Limping', icon: '🦵', color: 'bg-purple-100 text-purple-700' },
    { id: 6, name: 'Itching', icon: '🦠', color: 'bg-green-100 text-green-700' }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          toast.error('Invalid user data');
          window.location.href = '/login';
        }
      } else {
        toast.error('Please login first');
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Initialize chat history
  useEffect(() => {
    if (!loading) {
      setChatHistory([
        {
          id: 1,
          sender: 'ai',
          message: "Hello! I'm your AI Pet Health Assistant. I can help you understand your pet's symptoms and provide guidance. Please select a symptom or describe what's bothering your pet.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [loading]);

  // Simulate AI response (replace with actual API call)
  const getAIResponse = async (symptom) => {
    setIsAnalyzing(true);
    setSelectedSymptom(symptom);
    
    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: `My pet is experiencing: ${symptom}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMessage]);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sample AI responses based on symptom
    const responses = {
      'Lethargy': "Lethargy in pets can be caused by various factors including infection, pain, or metabolic issues. Monitor your pet's temperature and ensure they're drinking water. If lethargy persists for more than 24 hours or is accompanied by other symptoms, please consult a veterinarian.",
      'Vomiting': "Occasional vomiting can be normal, but frequent vomiting requires attention. Withhold food for 4-6 hours but provide small amounts of water. If vomiting continues, contains blood, or your pet seems lethargic, seek veterinary care immediately.",
      'Diarrhea': "Diarrhea can lead to dehydration. Ensure your pet has access to clean water. You can offer a bland diet (boiled chicken and rice) for 24 hours. If diarrhea persists beyond 48 hours or contains blood, contact your vet.",
      'Coughing': "Coughing in pets can indicate respiratory issues, heart problems, or kennel cough. Monitor breathing rate and check for nasal discharge. If coughing is frequent, accompanied by breathing difficulty, or doesn't improve in 2-3 days, see a veterinarian.",
      'Limping': "Limping suggests pain or injury. Restrict your pet's activity and check for visible injuries or swelling. If limping persists beyond 24 hours, your pet cannot bear weight, or you notice swelling, veterinary examination is recommended.",
      'Itching': "Itching can be due to allergies, parasites, or skin infections. Check for fleas, ticks, or skin lesions. You can try an oatmeal bath for relief. If itching is severe, causes hair loss or skin damage, consult your vet for proper diagnosis."
    };

    const aiMessage = {
      id: chatHistory.length + 2,
      sender: 'ai',
      message: responses[symptom] || "I understand your concern. For personalized advice, please provide more details about your pet's symptoms, duration, and any other observations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, aiMessage]);
    setAiResponse(responses[symptom] || '');
    setIsAnalyzing(false);
  };

  const handleSymptomClick = (symptomName) => {
    getAIResponse(symptomName);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: chatHistory.length + 2,
        sender: 'ai',
        message: `I understand you're concerned about "${userInput}". For the most accurate advice, please provide:\n1. How long this has been going on\n2. Your pet's age and breed\n3. Any other symptoms you've noticed\n4. Whether your pet is eating/drinking normally`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const emergencyProtocols = [
    {
      title: 'Poison Ingestion',
      steps: ['Do NOT induce vomiting', 'Identify the substance', 'Call animal poison control immediately'],
      icon: '☠️'
    },
    {
      title: 'Severe Bleeding',
      steps: ['Apply direct pressure with clean cloth', 'Elevate the area if possible', 'Transport to vet immediately'],
      icon: '🩸'
    },
    {
      title: 'Heat Stroke',
      steps: ['Move to cool area', 'Apply cool (not cold) water', 'Offer small sips of water', 'See vet immediately'],
      icon: '🌡️'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading AI Health Assistant...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                AI Pet Health Assistant
              </h1>
              <p className="text-gray-600 mt-1">
                Get instant guidance for your pet's health concerns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Vet-verified information • 24/7 Assistance • Privacy Protected</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Symptoms & Chat */}
          <div className="space-y-6">
            {/* Common Symptoms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Common Symptoms</h2>
                <span className="text-sm text-gray-500">Tap to analyze</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomClick(symptom.name)}
                    disabled={isAnalyzing}
                    className={`p-4 rounded-lg border transition-all ${selectedSymptom === symptom.name ? 'ring-2 ring-green-500 border-green-300' : 'border-gray-200 hover:border-green-300'} ${symptom.color} hover:opacity-90 disabled:opacity-50`}
                  >
                    <div className="text-2xl mb-2">{symptom.icon}</div>
                    <div className="font-medium text-sm">{symptom.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Health Chat</h2>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">AI Online</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-4 ${msg.sender === 'user' ? 'bg-green-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                        {msg.timestamp} • {msg.sender === 'ai' ? 'AI Assistant' : 'You'}
                      </div>
                    </div>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                        <span className="text-sm">Analyzing symptom...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your pet's symptoms..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isAnalyzing || !userInput.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis & Emergency */}
          <div className="space-y-6">
            {/* AI Analysis Results */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
                  <p className="text-sm text-gray-600">Real-time health assessment</p>
                </div>
              </div>

              {aiResponse ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900 mb-2">Assessment for: {selectedSymptom}</h3>
                        <p className="text-sm text-green-800 whitespace-pre-wrap">{aiResponse}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Generated just now</span>
                    </div>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Save Report →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No analysis yet</p>
                  <p className="text-sm text-gray-400 mt-1">Select a symptom or describe your concern</p>
                </div>
              )}
            </div>

            {/* Emergency Protocols */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Emergency Protocols</h2>
                  <p className="text-sm text-gray-600">Critical situations requiring immediate action</p>
                </div>
              </div>

              <div className="space-y-4">
                {emergencyProtocols.map((protocol, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{protocol.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{protocol.title}</h3>
                        <ul className="space-y-1">
                          {protocol.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Emergency Contact</p>
                    <p className="text-sm">If your pet is in critical condition, call your vet immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Syringe className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Preventive Care Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Keep vaccinations up to date</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Provide fresh water daily</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Regular exercise and mental stimulation</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Annual veterinary check-ups</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            ⚠️ <strong>Important:</strong> This AI assistant provides general guidance only and is not a substitute for professional veterinary care. 
            Always consult with a licensed veterinarian for medical advice and emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}