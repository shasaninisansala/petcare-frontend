import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import RegisterPageStep2 from "./pages/Register2";
import LoginPage from "./pages/Login";
import { Toaster } from "react-hot-toast";
import AboutUsPage from "./pages/AboutUs";
import DonatePage from "./pages/Donation";
import AdoptionPage from "./pages/Adoption";
import BreedInformation from "./pages/Breedinfo";

import ShelterLayout from "./components/ShelterLayout";
import ShelterDashboard from "./pages/ShelterDashboard";
import AdoptionListings from "./pages/AdoptionListing";
import AdoptionRequests from "./pages/AdoptionReq";
import Donations from "./pages/DonateReq";
import AddPetForm from "./pages/AddPet";
import ShelterProfile from "./pages/ShelterProfile";

import PetOwnerLayout from "./components/PetOwnerLayout";
import PetOwnerDashboard from "./pages/PetOwnerDashboard";
import AddNewPet from "./pages/AddNewPet";
import MyPets from "./pages/MyPets";
import PetDetailComplete from "./pages/PetModals";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ShelterVerification from "./pages/ShelterVerification";
import DonationMonitoring from "./pages/DonationMontoring";
import VerificationReview from "./pages/VerificationReview";
import EmergencyVetAssistant from "./pages/EmergencyAI";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/registerlast" element={<RegisterPageStep2 />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/adopt" element={<AdoptionPage />} />
          <Route path="/breedinfo" element={<BreedInformation />} />
          <Route path="/emergency" element={<EmergencyVetAssistant />} />

          {/* Shelter layout route */}
          <Route path="/shelter" element={<ShelterLayout />}>
            <Route path="dashboard" element={<ShelterDashboard />} />
            <Route path="adoption-listings" element={<AdoptionListings />} />
            <Route path="adoption-listings/add" element={<AddPetForm />} />
            <Route path="adoption-requests" element={<AdoptionRequests />} />
            <Route path="donations" element={<Donations />} />
            <Route path="profile" element={<ShelterProfile />} />
          </Route>

          {/* PetOwner layout route */}
          <Route path="/pet-owner" element={<PetOwnerLayout />}>
            <Route path="dashboard" element={<PetOwnerDashboard />} />
            <Route path="mypets" element={<MyPets />} />
            <Route path="addpet" element={<AddNewPet />} />
            
          </Route>
          <Route path="/pet-owner/petdetail" element={<PetDetailComplete />} />

          {/* PetOwner layout route */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="shelter-verification" element={<ShelterVerification />} />
            <Route path="donations" element={<DonationMonitoring />} />
            
          </Route>

          <Route 
            path="/admin/shelter-verification/:id" element={<VerificationReview />} />
          

        </Routes>
      </Router>
    </>
  );
}

export default App;
