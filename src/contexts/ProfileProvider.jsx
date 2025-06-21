import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axiosClient";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile");
        setProfile(response.data?.data);
      } catch {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
