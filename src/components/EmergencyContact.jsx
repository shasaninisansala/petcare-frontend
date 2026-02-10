import React from "react";

const contacts = [
  { name: "PetCare Emergency Line", phone: "+94 77 000 1111" },
  { name: "24/7 Vet Hotline", phone: "+94 77 000 2222" },
  { name: "Local Shelter Help", phone: "+94 77 000 3333" },
];

const EmergencyContact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6 text-primary">Emergency Contacts</h1>
      <p className="mb-8 text-gray-600">Call these numbers for immediate help for pets in emergency situations.</p>

      <div className="space-y-6">
        {contacts.map((c, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-50 p-6 rounded-lg shadow-md">
            <span className="font-bold text-gray-700">{c.name}</span>
            <a href={`tel:${c.phone}`} className="text-primary font-semibold hover:underline">{c.phone}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContact;
