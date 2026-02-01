import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      
      <div className="bg-white pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative h-[500px] lg:h-[600px] bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&auto=format&fit=crop')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Our Mission to Protect & Care
            </h1>
            <p className="text-lg sm:text-xl text-white mb-8 max-w-3xl">
              A professional and heartwarming platform dedicated to unified pet care across the globe.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200">
              Learn More
            </button>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    The pet care industry has been fragmented for too long. Fragmented records, disconnected shelters, and manual tracking have led to gaps in pet health and adoption rates.
                  </p>
                  
                  <p>
                    PetCare was born out of a desire to bridge these gaps. We provide a unified AI-powered solution that integrates medical history, shelter data, and owner preferences to ensure every pet gets the care they deserve. From the first vaccination to a lifelong home, we are there.
                  </p>
                </div>
              </div>

              <div className="order-first lg:order-last">
                <img 
                  src="https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800&auto=format&fit=crop" 
                  alt="Animal shelter" 
                  className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold text-green-600 mb-2">15k+</h3>
                <p className="text-gray-600 font-medium">Pets Adopted</p>
              </div>

              <div>
                <h3 className="text-5xl font-bold text-green-600 mb-2">1.2M+</h3>
                <p className="text-gray-600 font-medium">Vaccines Tracked</p>
              </div>

              <div>
                <h3 className="text-5xl font-bold text-green-600 mb-2">500+</h3>
                <p className="text-gray-600 font-medium">Verified Shelters</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 lg:py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Core Values</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Compassion */}
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compassion</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Putting the well-being and happiness of every pet at the heart of everything we do.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Leveraging AI and modern technology to solve the industry's most complex challenges.
                </p>
              </div>

              {/* Community */}
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Building a supportive ecosystem where owners, vets, and shelters collaborate.
                </p>
              </div>

              {/* Integrity */}
              <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ensuring data transparency and maintaining the highest standards for pet safety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">M</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Maleesha</h3>
                <p className="text-sm text-green-600">Founder & CEO</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-teal-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">S</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Shasani</h3>
                <p className="text-sm text-green-600">Head of AI</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">D</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Dishan</h3>
                <p className="text-sm text-green-600">Operations</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-teal-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-teal-700 font-bold">K</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Kulindu</h3>
                <p className="text-sm text-green-600">Shelter Relations</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <svg className="w-20 h-20 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Danuja</h3>
                <p className="text-sm text-green-600">Lead Developer</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}