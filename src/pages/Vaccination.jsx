import React, { useState } from "react";
import { AddVaccinationModal } from "./PetModals";

export default function VaccinationTracker() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Vaccination Tracker</h1>

      <button
        onClick={() => setOpen(true)}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
      >
        Add Vaccination
      </button>

      <AddVaccinationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        pet={{ name: "Buddy", type: "Dog", breed: "Golden Retriever" }}
      />
    </div>
  );
}
