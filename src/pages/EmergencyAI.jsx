import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image as ImageIcon, AlertTriangle, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:8086/emergency-app/api/ai/emergency-chat';

export default function EmergencyVetAssistant() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "Hello! I'm here to help with your pet's emergency. Please select the issue or describe symptoms."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUnderstand, setShowUnderstand] = useState(true);
  const [careTips, setCareTips] = useState([
    'Ensure proper hydration: Provide fresh water at all times.',
    'Maintain warmth: Keep your pet in a quiet, draft-free area.',
    'Bland diet: Consider plain boiled chicken and rice for 24 hours.',
    'Restrict activity: Avoid vigorous exercise or long walks today.'
  ]);
  const [warningSymptoms, setWarningSymptoms] = useState([
    'Difficulty breathing',
    'Extreme lethargy',
    'Persistent vomiting',
    'Pale or blue gums'
  ]);
  
  const messagesEndRef = useRef(null);

  const symptoms = [
    { id: 'bleeding', label: 'Bleeding' },
    { id: 'vomiting', label: 'Vomiting' },
    { id: 'injury', label: 'Injury' },
    { id: 'breathing', label: 'Breathing Issues' }
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call Spring Boot backend
const callAI = async (userMessage) => {
  try {
    setIsLoading(true);

    const conversationMessages = messages.map(msg => ({
      role: msg.type === "assistant" ? "assistant" : "user",
      content: msg.text
    }));

    conversationMessages.push({
      role: "user",
      content: userMessage
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationMessages })
    });

    const data = await response.json();

    if (data.success) {
      setMessages(prev => [...prev, { type: "assistant", text: data.text }]);
    } else {
      throw new Error("AI error");
    }

  } catch (err) {
    setMessages(prev => [...prev, {
      type: "assistant",
      text: "Connection problem. Please contact a vet if emergency."
    }]);
  } finally {
    setIsLoading(false);
  }
};


  // Extract care tips from response
  const extractCareTips = (response) => {
    const lines = response.split('\n');
    const tips = lines
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(tip => tip.length > 0)
      .slice(0, 4);
    
    if (tips.length > 0) {
      setCareTips(tips);
    }
  };

  // Extract warning symptoms
  const extractWarnings = (response) => {
    const urgentKeywords = ['immediately', 'urgent', 'emergency', 'veterinarian', 'vet'];
    const hasUrgent = urgentKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );

    if (hasUrgent) {
      const lines = response.split('\n');
      const warnings = lines
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(w => w.toLowerCase().includes('breathing') || 
                     w.toLowerCase().includes('lethargy') ||
                     w.toLowerCase().includes('vomit') ||
                     w.toLowerCase().includes('gum'))
        .slice(0, 4);
      
      if (warnings.length > 0) {
        setWarningSymptoms(warnings);
      }
    }
  };

  const handleSymptomClick = async (symptom) => {
    const userMessage = { type: 'user', text: symptom };
    setMessages(prev => [...prev, userMessage]);
    await callAI(`Animal: unknown. Age: unknown. Symptom: ${symptom}`);

  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    const messageText = inputText;
    setInputText('');
    await callAI(messageText);
  };

  

  return (
    <>
    <Navbar/>
    <div className="min-h-screen pt-16 md:pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Vet Assistance</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">AI Assistant Online</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Response:</p>
              <p className="text-lg font-bold text-red-600">Instant</p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {showUnderstand && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <p className="text-gray-800">
                This tool provides general guidance only and does not replace professional veterinary care.
              </p>
            </div>
            <button
              onClick={() => setShowUnderstand(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium whitespace-nowrap ml-4"
            >
              I Understand
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Column */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '600px' }}>
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>
              <span className="font-semibold text-gray-900">Petcare AI</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.type === 'assistant' ? (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600">🤖</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">AI Assistant</p>
                        <div className="bg-gray-50 rounded-lg rounded-tl-none p-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="flex items-end gap-2">
                        <div className="bg-green-500 text-white rounded-lg rounded-tr-none px-4 py-3 max-w-xs">
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <span className="text-xs text-gray-400">You</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 ml-11">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => handleSymptomClick(symptom.label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        symptom.id === 'vomiting'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom.label}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600">🤖</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">AI Assistant</p>
                    <div className="bg-gray-50 rounded-lg rounded-tl-none p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Lock className="w-3 h-3" />
                <span>Encrypted Connection</span>
                <span>•</span>
                <ShieldCheck className="w-3 h-3" />
                <span>Vet-Verified AI</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Care Instructions Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🩺</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Recommended Care & Home Treatment</h3>
              </div>

              <div className="space-y-3">
                {careTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-red-900">When to Seek Professional Help</h3>
              </div>

              <p className="text-sm text-red-800 mb-4">
                Contact a veterinarian immediately if symptoms persist beyond 24–48 hours, or if you notice:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {warningSymptoms.map((symptom, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <p className="text-sm text-red-900">{symptom}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}