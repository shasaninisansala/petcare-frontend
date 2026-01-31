import React from 'react';
import { Sparkles, Brain, Bell, TrendingUp, Shield, Award, Globe, Heart } from 'lucide-react';

const AIAndEmergency = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* AI Adoption Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Powered Intelligence</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Smart Adoption Recommendations
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Our proprietary AI matching engine analyzes your lifestyle, home environment, 
                  and preferences to recommend pets that will thrive in your care.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Smart Reminders</h4>
                      <p className="text-gray-400 text-sm">
                        AI predicts health needs based on breed data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Behavior Insights</h4>
                      <p className="text-gray-400 text-sm">
                        Deep learning for better training advice
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching Analysis Card */}
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Matching Analysis</h3>
                  <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold">
                    LIVE PROCESSING
                  </span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Lifestyle Compatibility', value: 92 },
                    { label: 'Environment Suitability', value: 87 },
                    { label: 'Care Requirements Match', value: 95 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-1000"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Experience AI Match
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Vet Section */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">🏥</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Emergency Vet Assistance</h2>
                <p className="text-cyan-100 text-lg">
                  Immediate access to certified emergency vets and poison control
                </p>
              </div>
            </div>
            <button className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-bold hover:bg-cyan-50 transition-colors whitespace-nowrap shadow-lg">
              Get Emergency Vet Help Now
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-gray-500 mb-8 font-medium">Trusted by animal welfare leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Shield />, label: 'Safe Shelters' },
              { icon: <Award />, label: 'Vet Certified' },
              { icon: <Globe />, label: 'Global Impact' },
              { icon: <Heart />, label: 'Expert Care' },
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  {badge.icon}
                </div>
                <p className="font-semibold text-gray-700">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default AIAndEmergency;
