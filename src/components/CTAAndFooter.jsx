import React from 'react';
import { PawPrint, Share2, MessageCircle, Mail } from 'lucide-react';
import { Link } from "react-router-dom";

const CTAAndFooter = () => {

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "PetCare Platform",
        text: "Check out this amazing pet care platform!",
        url: window.location.origin,
      });
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  return (
    <>
      {/* CTA */}
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
            <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all">
              Get Started Today
            </Link>
            <Link to="/learn" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-primary">PetCare</span>
              </div>
              <p className="text-gray-600 mb-6">
                All-in-one platform for pet care, adoption, and veterinary support.
              </p>
              <div className="flex gap-3">
                <button onClick={handleShare} className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center">
                  <Share2 />
                </button>
                <a href="https://wa.me/94764846394" target="_blank" rel="noreferrer"
                  className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center">
                  <MessageCircle />
                </a>
                <a href="mailto:support@petcare.org"
                  className="w-10 h-10 bg-gray-200 hover:bg-primary hover:text-white rounded-full flex items-center justify-center">
                  <Mail />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/adopt"className="text-gray-600 hover:text-primary">Find a Pet</Link></li>
                <li><Link to="/donate" className="text-gray-600 hover:text-primary">Donate</Link></li>
                <li><Link to="/emergency" className="text-gray-600 hover:text-primary">Emergency</Link></li>
                <li><Link to="/aboutus" className="text-gray-600 hover:text-primary">About Us</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/helpcenter" className="text-gray-600 hover:text-primary">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/emergencycontact" className="text-gray-600 hover:text-primary">Emergency Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Colombo, Sri Lanka</li>
                <li>+94 76 48 46 394</li>
                <li>
                  <a href="mailto:support@petcare.org" className="text-primary">
                    support@petcare.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 PetCare Platform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-gray-500 hover:text-primary">Terms</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAAndFooter;
