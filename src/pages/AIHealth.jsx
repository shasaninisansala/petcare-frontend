import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Plus, Image as ImageIcon } from 'lucide-react';

const API_URL = 'http://localhost:8086/emergency-app/api/ai/emergency-chat';

export default function AIPetCareModal({ isOpen, onClose }) {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm here to help with your pet's emergency. Please select the issue or describe symptoms."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  if (!isOpen) return null;

  const symptoms = ['Bleeding', 'Vomiting', 'Injury', 'Breathing Issues'];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call AI backend
  const callAI = async (userMessage) => {
    try {
      // Add user message immediately
      setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

      // Prepare conversation for backend
      const conversationMessages = messages.map(msg => ({
        role: msg.type === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));

      conversationMessages.push({ role: 'user', content: userMessage });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationMessages })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { type: 'ai', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { type: 'ai', text: "AI error: Unable to process." }]);
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: "Connection problem. Please contact a vet if emergency."
      }]);
    }
  };

  const handleSymptomClick = async (symptom) => {
    setSelectedSymptom(symptom);
    await callAI(symptom);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await callAI(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🐾</span>
            </div>
            <span className="font-semibold text-gray-900">Petcare</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === 'ai' ? (
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
                  <div className="bg-green-500 text-white rounded-lg rounded-tr-none px-4 py-3 max-w-xs">
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 self-end">You</span>
                </div>
              )}
            </div>
          ))}

          {/* Symptom Buttons */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 ml-11">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomClick(symptom)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    symptom === 'Vomiting'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer - Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 px-2">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Encrypted Connection</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Vet-Verified AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              onClick={handleSend}
              className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
            >
              Send
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
