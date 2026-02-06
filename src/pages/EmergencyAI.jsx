import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Image as ImageIcon, AlertTriangle, CheckCircle, Lock, ShieldCheck, Bot, User, Thermometer, Heart, Pill, Syringe, Activity, Stethoscope, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

// Your DeepSeek API Key embedded directly
const DEEPSEEK_API_KEY = "sk-dece95888c0d4609b0d32056f39956a7";
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export default function EmergencyVetAssistant() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "🐾 **Welcome to PetCare AI Assistant!**\n\nI'm specialized in **pet health, diseases, and veterinary care only**. I can help you with:\n• Pet symptoms and first aid\n• Disease information and prevention\n• Emergency pet care guidance\n• General pet health questions\n\n⚠️ **Important:** I can ONLY discuss topics related to pet health and veterinary care. Please ask about your pet's health concerns."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUnderstand, setShowUnderstand] = useState(true);
  const [careTips, setCareTips] = useState([
    'I only discuss pet health topics.',
    'Ask about symptoms, diseases, or pet care.',
    'For other topics, please consult appropriate resources.',
    'Emergency pet issues get priority attention.'
  ]);
  const [warningSymptoms, setWarningSymptoms] = useState([
    'Difficulty breathing or choking',
    'Severe bleeding or trauma',
    'Seizures or collapse',
    'Suspected poisoning'
  ]);
  
  // Track off-topic warnings
  const [offTopicWarnings, setOffTopicWarnings] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Pet symptoms and common issues
  const symptoms = [
    { id: 'vomiting', label: 'Vomiting', icon: '🤢', color: 'bg-orange-100 text-orange-800' },
    { id: 'diarrhea', label: 'Diarrhea', icon: '💩', color: 'bg-amber-100 text-amber-800' },
    { id: 'lethargy', label: 'Lethargy', icon: '😴', color: 'bg-blue-100 text-blue-800' },
    { id: 'injury', label: 'Injury', icon: '🤕', color: 'bg-red-100 text-red-800' },
    { id: 'breathing', label: 'Breathing Issues', icon: '😮‍💨', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'eating', label: 'Not Eating', icon: '🍽️', color: 'bg-purple-100 text-purple-800' },
    { id: 'itching', label: 'Itching/Skin', icon: '🐾', color: 'bg-pink-100 text-pink-800' },
    { id: 'urination', label: 'Urination Issues', icon: '💦', color: 'bg-indigo-100 text-indigo-800' }
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if message is about pet health
  const isPetHealthRelated = (message) => {
    const lowerMsg = message.toLowerCase();
    
    // Keywords that indicate pet health topics
    const petHealthKeywords = [
      'pet', 'dog', 'cat', 'puppy', 'kitten', 'animal', 'veterinary', 'vet',
      'symptom', 'illness', 'disease', 'sick', 'health', 'care', 'treatment',
      'vomit', 'diarrhea', 'injury', 'wound', 'bleeding', 'pain', 'hurt',
      'breathing', 'cough', 'sneeze', 'itch', 'scratch', 'skin', 'coat',
      'eat', 'food', 'drink', 'water', 'urine', 'pee', 'poop', 'stool',
      'vaccine', 'vaccination', 'medicine', 'medication', 'pill', 'drug',
      'emergency', 'urgent', 'fever', 'temperature', 'weight', 'diet',
      'parasite', 'flea', 'tick', 'worm', 'infection', 'bacterial', 'viral',
      'allergy', 'allergic', 'reaction', 'swelling', 'lump', 'tumor',
      'dental', 'teeth', 'gum', 'mouth', 'ear', 'eye', 'nose', 'paw',
      'bone', 'fracture', 'sprain', 'limping', 'walking', 'mobility',
      'behavior', 'anxiety', 'stress', 'fear', 'aggression', 'training',
      'grooming', 'bath', 'nail', 'fur', 'hair', 'shedding',
      'pregnancy', 'birth', 'spay', 'neuter', 'sterilization',
      'age', 'old', 'senior', 'young', 'puppy', 'kitten'
    ];
    
    // Check if message contains pet health keywords
    const hasPetHealthKeyword = petHealthKeywords.some(keyword => 
      lowerMsg.includes(keyword)
    );
    
    // Also check for common pet health question patterns
    const hasQuestionPattern = /(what|how|why|when|should|can|does).*(do|give|treat|help|care)/i.test(message);
    
    return hasPetHealthKeyword || hasQuestionPattern;
  };

  // Get appropriate response based on topic and warning count
  const getTopicEnforcedResponse = (userMessage) => {
    const isOnTopic = isPetHealthRelated(userMessage);
    
    if (isBlocked) {
      return {
        text: "🚫 **Topic Restriction Enforced**\n\nI can no longer respond to off-topic messages. I am strictly limited to discussing:\n\n🐾 **Pet health and diseases**\n🏥 **Veterinary care and first aid**\n🚨 **Pet emergencies**\n💊 **Pet medications and treatments**\n\nPlease ask about your pet's health concerns only.",
        isWarning: false,
        shouldBlock: true
      };
    }
    
    if (!isOnTopic) {
      const newWarningCount = offTopicWarnings + 1;
      setOffTopicWarnings(newWarningCount);
      
      if (newWarningCount === 1) {
        return {
          text: "⚠️ **First Warning: Off-Topic Message**\n\nI am specifically designed to discuss **pet health and veterinary care only**. I cannot discuss other topics.\n\nPlease ask about:\n• Your pet's symptoms or illnesses\n• Pet disease information\n• Emergency pet care\n• General pet health questions\n\nNext off-topic message will result in stronger restriction.",
          isWarning: true,
          shouldBlock: false
        };
      } else if (newWarningCount === 2) {
        return {
          text: "🚨 **Second Warning: Strict Topic Enforcement**\n\nThis is your second off-topic message. I am programmed exclusively for:\n\n**PET HEALTH TOPICS ONLY:**\n- Symptoms and diagnosis\n- Diseases and conditions\n- Medications and treatments\n- Emergency procedures\n- Preventive care\n\n**One more off-topic message will block further responses.**",
          isWarning: true,
          shouldBlock: false
        };
      } else if (newWarningCount >= 3) {
        setIsBlocked(true);
        return {
          text: "🚫 **FINAL WARNING: Topic Access Blocked**\n\nYou have exceeded the allowed off-topic messages. I am now restricted to ONLY respond to:\n\n✅ **Pet health emergencies**\n✅ **Specific disease questions**\n✅ **Veterinary care guidance**\n\nAll other messages will be ignored. Please ask specifically about pet health concerns.",
          isWarning: true,
          shouldBlock: true
        };
      }
    }
    
    // Reset warning count if back on topic
    if (isOnTopic && offTopicWarnings > 0) {
      setOffTopicWarnings(0);
    }
    
    return null; // No warning, proceed with AI response
  };

  // Call DeepSeek AI with topic enforcement
  const callDeepSeekAI = async (userMessage) => {
    try {
      setIsLoading(true);

      // Check if message is on-topic
      const topicResponse = getTopicEnforcedResponse(userMessage);
      if (topicResponse) {
        const aiMessage = { 
          type: 'assistant', 
          text: topicResponse.text,
          isWarning: topicResponse.isWarning
        };
        setMessages(prev => [...prev, aiMessage]);
        
        if (topicResponse.shouldBlock) {
          setIsBlocked(true);
        }
        
        setIsLoading(false);
        return;
      }

      // Build conversation history for pet health topics
      const conversationMessages = [
        {
          role: "system",
          content: `You are STRICTLY a veterinary assistant AI. You can ONLY discuss:

1. PET HEALTH TOPICS:
   - Symptoms, diseases, and conditions in pets
   - Veterinary care and first aid
   - Pet medications and treatments
   - Emergency pet procedures
   - Preventive care and vaccinations
   - Pet nutrition and diet

2. STRICTLY PROHIBITED TOPICS:
   - Human medicine or diseases
   - Non-pet related topics
   - Politics, religion, or personal advice
   - General chit-chat or off-topic discussions

3. RESPONSE RULES:
   - If user asks about non-pet topics, politely redirect to pet health
   - Always emphasize consulting a real veterinarian
   - Never prescribe specific medications
   - Use bullet points and emojis for clarity
   - Keep responses focused and professional

Format: Start with relevant emoji, use clear sections, end with disclaimer.`
        },
        ...messages.map(msg => ({
          role: msg.type === 'assistant' ? 'assistant' : 'user',
          content: msg.text
        })),
        {
          role: "user",
          content: userMessage
        }
      ];

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: conversationMessages,
          max_tokens: 600,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        const aiMessage = { type: 'assistant', text: aiResponse };
        setMessages(prev => [...prev, aiMessage]);

        // Extract care tips from response
        extractTipsFromResponse(aiResponse);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('AI Error:', error);
      
      const fallbackResponse = `I apologize, but I'm having trouble connecting to my veterinary knowledge base. 

In the meantime, here's general pet health guidance:

🐾 **For Pet Health Concerns:**
• Monitor symptoms closely
• Ensure fresh water is available
• Keep your pet comfortable and warm
• Contact your veterinarian for proper diagnosis

🏥 **Emergency Situations:**
• Difficulty breathing → Immediate vet care
• Severe injury or bleeding → Emergency clinic
• Suspected poisoning → Call animal poison control
• Seizures or collapse → Veterinary emergency

⚠️ **Remember:** I can only discuss pet health topics. Please consult a veterinarian for medical advice.`;
      
      const aiMessage = { type: 'assistant', text: fallbackResponse };
      setMessages(prev => [...prev, aiMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Extract care tips from AI response
  const extractTipsFromResponse = (response) => {
    const lines = response.split('\n');
    const tips = lines
      .filter(line => {
        const trimmed = line.trim();
        return (trimmed.startsWith('•') || 
                trimmed.startsWith('-') ||
                /^[🐾🏥💊🚨🔍]/.test(trimmed)) &&
               trimmed.length > 15 &&
               !trimmed.toLowerCase().includes('warning') &&
               !trimmed.toLowerCase().includes('off-topic');
      })
      .slice(0, 4)
      .map(line => line.replace(/^[•\-\s🐾🏥💊🚨🔍]+/, '').trim());

    if (tips.length > 0) {
      setCareTips(tips);
    }
  };

  const handleSymptomClick = async (symptom) => {
    const userMessage = `My pet has ${symptom.toLowerCase()}. What should I do?`;
    const userMsgObj = { type: 'user', text: userMessage };
    setMessages(prev => [...prev, userMsgObj]);
    await callDeepSeekAI(userMessage);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || (isBlocked && !isPetHealthRelated(inputText))) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    const messageText = inputText;
    setInputText('');
    await callDeepSeekAI(messageText);
  };

  const handleEmergencyInfo = () => {
    const userMessage = { 
      type: 'user', 
      text: "PET EMERGENCY: Need immediate veterinary guidance for critical symptoms" 
    };
    setMessages(prev => [...prev, userMessage]);
    
    callDeepSeekAI("Provide emergency veterinary protocol for critical pet health situations");
  };

  const resetTopicRestrictions = () => {
    setOffTopicWarnings(0);
    setIsBlocked(false);
    const resetMessage = {
      type: 'assistant',
      text: "✅ **Topic restrictions have been reset.**\n\nI can now respond to your pet health questions again. Please remember I am strictly for:\n\n🐕 Pet health and diseases\n🏥 Veterinary care guidance\n🚨 Emergency pet situations\n💊 Medications and treatments\n\nAsk about your pet's health concerns!"
    };
    setMessages(prev => [...prev, resetMessage]);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen pt-16 md:pt-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-green-50 rounded-2xl border border-green-200 p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md">
                <Stethoscope className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">PetCare AI Assistant</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Topic-Restricted AI</span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Pet Health Only</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Topic Enforcement:</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-red-500' : offTopicWarnings > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <p className={`text-lg font-bold ${isBlocked ? 'text-red-600' : offTopicWarnings > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isBlocked ? 'Restricted' : offTopicWarnings > 0 ? `Warning ${offTopicWarnings}/3` : 'Active'}
                  </p>
                </div>
                {offTopicWarnings > 0 && !isBlocked && (
                  <button
                    onClick={resetTopicRestrictions}
                    className="mt-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Reset Warnings
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {showUnderstand && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">⚠️ STRICT TOPIC RESTRICTION</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This AI assistant is programmed to discuss <strong>PET HEALTH AND DISEASES ONLY</strong>. 
                    Off-topic messages will receive warnings and may be blocked.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnderstand(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 font-medium whitespace-nowrap shadow-md"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Off-topic Warning Display */}
        {offTopicWarnings > 0 && (
          <div className={`rounded-2xl p-4 mb-6 shadow-sm ${isBlocked ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-6 h-6 ${isBlocked ? 'text-red-600' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-medium ${isBlocked ? 'text-red-800' : 'text-yellow-800'}`}>
                  {isBlocked ? '🚫 TOPIC ACCESS BLOCKED' : `⚠️ WARNING ${offTopicWarnings}/3`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isBlocked 
                    ? 'I can only respond to specific pet health emergencies and disease questions now.'
                    : 'Please ask only about pet health topics. Further off-topic messages will be restricted.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Column */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-lg" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">PetCare AI</span>
                    <p className="text-xs text-gray-500">Pet Health & Diseases Only</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-3 h-3 text-green-400" />
                  <span className="text-gray-500">Topic Protected</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.type === 'assistant' ? (
                    <div className="flex gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900">AI Assistant</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${message.isWarning ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {message.isWarning ? '⚠️ Warning' : '🐾 Pet Health'}
                          </span>
                        </div>
                        <div className={`rounded-2xl rounded-tl-none p-4 shadow-sm ${message.isWarning ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                          <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="flex items-end gap-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none px-5 py-3 max-w-xs md:max-w-md shadow-sm">
                          <p className="text-sm md:text-base">{message.text}</p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Symptom Buttons */}
              {messages.length <= 2 && !isLoading && !isBlocked && (
                <div className="ml-12">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Ask about pet health issues:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => handleSymptomClick(symptom.label)}
                        className={`${symptom.color} rounded-xl p-3 text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-md flex flex-col items-center gap-1`}
                      >
                        <span className="text-lg">{symptom.icon}</span>
                        <span>{symptom.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">AI Assistant</p>
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">Analyzing pet health question...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Blocked Message */}
              {isBlocked && (
                <div className="ml-12">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">🚫 Topic Access Restricted</p>
                    <p className="text-sm text-red-700">
                      I can only respond to <strong>specific pet health emergencies</strong> and <strong>disease-related questions</strong> now.
                    </p>
                    <button
                      onClick={resetTopicRestrictions}
                      className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium"
                    >
                      Reset Restrictions
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <ShieldCheck className="w-3 h-3" />
                <span>Strictly Pet Health Topics</span>
                <span>•</span>
                <Lock className="w-3 h-3" />
                <span>{isBlocked ? 'Restricted Mode' : 'Topic Protected'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder={isBlocked 
                    ? "Ask ONLY about pet emergencies or specific diseases..." 
                    : "Ask about pet symptoms, diseases, or health concerns..."
                  }
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-sm md:text-base"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim() || (isBlocked && !isPetHealthRelated(inputText))}
                  className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                {isBlocked 
                  ? "Only pet health emergencies allowed" 
                  : "Ask about symptoms, diseases, medications, or pet care"
                }
              </p>
            </div>
          </div>

          {/* Care Instructions Column */}
          <div className="space-y-6">
            {/* Topic Rules Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Topic Restrictions</h3>
                  <p className="text-sm text-gray-600">What I can discuss</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">✅ ALLOWED TOPICS:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Pet symptoms and diagnosis</li>
                    <li>• Animal diseases and conditions</li>
                    <li>• Veterinary medications</li>
                    <li>• Emergency pet care</li>
                    <li>• Preventive healthcare</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <p className="text-sm font-medium text-red-800 mb-2">❌ RESTRICTED TOPICS:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Human medicine or health</li>
                    <li>• Non-pet related discussions</li>
                    <li>• Personal or general advice</li>
                    <li>• Off-topic conversations</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>3 warnings for off-topic messages</span>
                </div>
              </div>
            </div>

            {/* Emergency Warning Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">Pet Health Emergencies</h3>
                  <p className="text-sm text-red-700">Always allowed despite restrictions</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-red-800 bg-red-50 p-3 rounded-lg border border-red-200">
                  These topics are <strong>ALWAYS PERMITTED</strong> even if restricted:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {warningSymptoms.map((symptom, index) => (
                  <div key={index} className="bg-white bg-opacity-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">•</span>
                      <p className="text-sm text-red-900 font-medium">{symptom}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-red-200">
                <button
                  onClick={handleEmergencyInfo}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <Syringe className="w-5 h-5" />
                  Get Emergency Protocol
                </button>
              </div>
            </div>

            {/* Warning Status */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3">⚠️ Current Restriction Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Off-topic warnings:</span>
                  <span className={`font-bold ${offTopicWarnings === 0 ? 'text-green-600' : offTopicWarnings < 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {offTopicWarnings}/3
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Response status:</span>
                  <span className={`font-bold ${isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                    {isBlocked ? 'Restricted' : 'Active'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${offTopicWarnings === 0 ? 'bg-green-500' : offTopicWarnings === 1 ? 'bg-yellow-500' : offTopicWarnings === 2 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${(offTopicWarnings / 3) * 100}%` }}
                  ></div>
                </div>
                {offTopicWarnings > 0 && (
                  <button
                    onClick={resetTopicRestrictions}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                  >
                    Reset All Warnings
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 <strong>Topic-Restricted AI Assistant</strong> - Pet Health & Diseases Only
            <span className="block mt-1">⚠️ Off-topic messages: Warning → Warning → Block</span>
            <span className="block mt-1">© {new Date().getFullYear()} PetCare AI Assistant • DeepSeek API</span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}