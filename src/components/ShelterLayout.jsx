import React, { useEffect, useState } from 'react';
import ShelterSidebar from './ShelterSidebar';
import ShelterHeader from './ShelterHeader';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

export default function ShelterLayout() {

  const [shelterName, setShelterName] = useState("Loading...");
  const [regId, setRegId] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const email = localStorage.getItem("email"); // logged user email

  useEffect(() => {
    axios.get(`http://localhost:8085/api/shelter/profile/email/${email}`)
      .then(res => {
        setShelterName(res.data.shelterName);
        setRegId(res.data.regId);
        setProfileImage(res.data.profileImage);  // BASE64 FROM BACKEND
      })
      .catch(err => console.log(err));
  }, [email]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShelterSidebar />

      <div className="flex-1 flex flex-col">
        <ShelterHeader
          shelterName={shelterName}
          regId={regId}
          profileImage={profileImage}
          verified={true}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
