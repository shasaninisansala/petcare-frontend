import React from 'react';
import { PawPrint, Share2, MessageCircle, Mail } from 'lucide-react';

const CTAAndFooter = () => {
  return (
    <>
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-green-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join us in creating a better future for pets
          </h2>
          <p className="text-xl mb-10 text-green-50 max-w-3xl mx-auto">
            Whether you're looking to adopt, volunteer, or manage your pet's life, 
            we're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-primary">PetCare</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The world's first all-in-one platform for pet care, adoption, and veterinary support. Built for pets, by pet lovers.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Platform Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Find a Pet
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Shelter Network
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Health Tracker
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Pet Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                    Emergency Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-600">
                <li>123 Pet Lane</li>
                <li>Animal District, CA 94103</li>
                <li className="pt-2">
                  <a href="mailto:support@petcare.org" className="text-primary hover:text-primary-dark">
                    support@petcare.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 PetCare Platform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAAndFooter;
