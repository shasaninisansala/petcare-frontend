import React from 'react';
import { MapPin, Calendar, FileText, Heart, Briefcase, DollarSign, ArrowRight } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Pet Tracking',
      description: 'Integrated GPS and digital ID management to keep your pets safe.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Health Reminders',
      description: 'Automated vaccination and check-up alerts tailored to your pet.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Breed Info',
      description: 'Detailed library of characteristics, care needs, and behaviors.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Emergency Vet',
      description: '24/7 priority access to emergency veterinary care providers.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Adoption Hub',
      description: 'Find your perfect companion from verified local shelters.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Donations',
      description: 'Securely support animals in need with direct shelter donations.',
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Comprehensive Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your pet's life in one place, from medical records to community support.
          </p>
          <button className="mt-6 text-primary font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all group">
            View All Features
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-primary opacity-20"></div>

            {[
              {
                number: '1',
                title: 'Register',
                description: 'Create your profile and add your pet\'s details.',
              },
              {
                number: '2',
                title: 'Connect',
                description: 'Link with local vets, shelters, and experts.',
              },
              {
                number: '3',
                title: 'Manage',
                description: 'Track health, schedules, and daily needs.',
              },
              {
                number: '4',
                title: 'Thrive',
                description: 'Ensure a long, happy, and healthy life for your pet.',
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg z-10 relative">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
