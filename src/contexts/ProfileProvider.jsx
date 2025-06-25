import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axiosClient";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get("/profile");
      setProfile(response.data?.data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile(); // ini tetap penting buat case reload
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
