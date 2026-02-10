import React from 'react';
import { Sparkles, Brain, Bell, TrendingUp, Shield, Award, Globe, Heart } from 'lucide-react';
import { Link } from "react-router-dom";

const AIAndEmergency = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Adoption Highlights Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 text-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Why Choose PetCare?</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Bringing Pets and People Together
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                At PetCare, we make pet adoption, health care, and community support simple and fun.  
                Discover stories of happy pets and their families, and get inspired to start your own journey.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                From adoption guidance to tips on pet wellness, we are here to ensure that every pet finds a loving home.
              </p>
              <Link to ="/adopt" className="w-full p-5 mt-6 bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Adoptable Pets
                </Link>
            </div>

            {/* Images Section */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://i.pinimg.com/1200x/e8/71/37/e87137c454bb13481b91cbeb344a5099.jpg"
                alt="Happy Pet 1"
                className="w-full h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://i.pinimg.com/736x/48/18/a3/4818a36f09729967d3cd3520122caffe.jpg"
                alt="Happy Pet 2"
                className="w-full h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://i.pinimg.com/1200x/6e/db/bd/6edbbd871d7ad8e82ce055f28ed84e1f.jpg"
                alt="Happy Pet 3"
                className="w-full h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://i.pinimg.com/1200x/db/73/03/db7303fcc7ddabc5114bea9e29d29e04.jpg"
                alt="Happy Pet 4"
                className="w-full h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
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
            <Link to="/emergency" className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-bold hover:bg-cyan-50 transition-colors whitespace-nowrap shadow-lg">
              Get Emergency Vet Help Now
            </Link>
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
