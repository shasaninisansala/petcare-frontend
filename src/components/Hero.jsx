import React from 'react';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Care. Adopt.{' '}
              <span className="text-primary block">Protect. Love.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              A comprehensive platform designed to connect pet owners, adopters, and
              shelters for a better future. Manage everything from health records to finding a
              new best friend.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Adopt a Pet
              </button>
              <Link
  to="/register"
  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all inline-block text-center"
>
  Register Your Pet
</Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-slide-in-right">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop"
                alt="Dog and cat together"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Problem Solutions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💉</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Missed Vaccines</h3>
            <p className="text-gray-600 mb-4">
              Manual tracking leads to forgotten appointments and health risks.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Smart Automated Reminders
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Vet Delays</h3>
            <p className="text-gray-600 mb-4">
              Finding emergency help in critical moments can take too long.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant 24/7 Vet Connection
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Hard Adoption</h3>
            <p className="text-gray-600 mb-4">
              Navigating fragmented shelter listings and paperwork is exhausting.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Centralized Smart Matching
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
