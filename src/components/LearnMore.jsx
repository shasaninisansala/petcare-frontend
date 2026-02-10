import React from "react";

const LearnMore = () => {
  return (
    <>
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-4">Learn More About PetCare</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover how we help pets and their owners, make adoption easy, and build a loving community.
        </p>
      </div>

      {/* Our Mission */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://i.pinimg.com/1200x/d2/98/0a/d2980ac5773acbe2c78bcde22664a1c9.jpg"
          alt="Our Mission"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
          <p className="text-gray-700">
            At PetCare, our mission is to make every pet’s life better — offering compassionate care, adoption guidance, and tools to help you take great care of your furry friends.
          </p>
          <p className="text-gray-700">
            We believe that pets are family, and we’re here to support you at every step of your pet care journey.
          </p>
        </div>
      </section>

      {/* Adoption Journey */}
      <section className="flex flex-col md:flex-row-reverse items-center gap-8">
        <img
          src="https://i.pinimg.com/1200x/ed/67/9e/ed679e184183f5eea84f0bf7021e565c.jpg"
          alt="Adoption Process"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-primary">Adoption Journey</h2>
          <p className="text-gray-700">
            Our adoption process is simple and transparent. Browse available pets, fill out a short form, and connect with shelters that care deeply about pet welfare.
          </p>
          <p className="text-gray-700">
            We help connect loving families with pets in need of a forever home — bringing joy to owners and pets alike.
          </p>
        </div>
      </section>

      {/* Pet Care Tips */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://i.pinimg.com/736x/3b/50/d6/3b50d626298cc6011e2a1b9bfb86efef.jpg"
          alt="Pet Care Tips"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-primary">Pet Care Tips</h2>
          <p className="text-gray-700">
            Caring for a pet goes beyond adoption. Learn how to keep them healthy — from nutrition advice and grooming tips to exercise ideas and emotional wellbeing.
          </p>
          <p className="text-gray-700">
            Healthy pets are happy pets, and we’re here to help you make informed decisions for your fur family.
          </p>
        </div>
      </section>

    </div>
    {/* Get Started Section */}
      <section className="bg-gradient-to-br from-primary to-green-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Get Started Today!</h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          Whether you want to adopt, volunteer, or track your pet’s health, start your journey with PetCare now.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="/register"
            className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
          >
            Register Now
          </a>
          <a
            href="/adopt"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all"
          >
            Find a Pet
          </a>
        </div>
      </section>
    </>
    
  );
};

export default LearnMore;
