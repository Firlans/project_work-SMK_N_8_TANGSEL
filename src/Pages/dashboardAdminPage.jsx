import React, { useState } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyData = {
  profile: {
    name: "Admin Sekolah",
    role: "Administrator",
  },
  teachers: [
    { id: "T001", name: "Budi Santoso", subject: "Matematika" },
    { id: "T002", name: "Siti Aminah", subject: "Bahasa Inggris" },
    { id: "T003", name: "Ahmad Rizki", subject: "Fisika" },
    { id: "T004", name: "Dewi Sartika", subject: "Kimia" },
  ],
  students: [
    { id: "S001", name: "Abdul Rahman", grade: "XII RPL 1" },
    { id: "S002", name: "Maya Putri", grade: "XII RPL 1" },
    { id: "S003", name: "Rizky Pratama", grade: "XII RPL 2" },
    { id: "S004", name: "Anisa Fitri", grade: "XII RPL 2" },
    { id: "S005", name: "Budi Prakoso", grade: "XI RPL 1" },
    { id: "S006", name: "Diana Putri", grade: "XI RPL 1" },
    { id: "S007", name: "Eko Saputra", grade: "XI RPL 2" },
    { id: "S008", name: "Fina Kusuma", grade: "XI RPL 2" },
    { id: "S009", name: "Gilang Ramadhan", grade: "X RPL 1" },
    { id: "S010", name: "Hana Safira", grade: "X RPL 1" },
    { id: "S011", name: "Irfan Maulana", grade: "X RPL 2" },
    { id: "S012", name: "Jasmine Putri", grade: "X RPL 2" },
  ],
  schedule: [
    { day: "Senin", subject: "Matematika", time: "07:00 - 08:30" },
    { day: "Senin", subject: "Bahasa Inggris", time: "08:30 - 10:00" },
    { day: "Selasa", subject: "Fisika", time: "07:00 - 08:30" },
    { day: "Selasa", subject: "Kimia", time: "08:30 - 10:00" },
  ],
};

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
    { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
    { id: "schedule", label: "Jadwal Pelajaran", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Admin</h2>
      </div>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              activePage === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        SMK Negeri 8 Kota Tangerang Selatan
      </h1>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nama</span>
            <span className="font-medium">{dummyData.profile.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Role</span>
            <span className="font-medium">{dummyData.profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeachersList = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Guru</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">{teacher.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.subject}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentsList = () => {
  const [selectedClass, setSelectedClass] = useState("all");

  // Get unique classes from students data
  const classes = [
    "all",
    ...new Set(dummyData.students.map((student) => student.grade)),
  ];

  // Filter students based on selected class
  const filteredStudents =
    selectedClass === "all"
      ? dummyData.students
      : dummyData.students.filter((student) => student.grade === selectedClass);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="classFilter" className="text-sm text-gray-600">
            Filter Kelas:
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((grade) => (
              <option key={grade} value={grade}>
                {grade === "all" ? "Semua Kelas" : grade}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kelas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Schedule = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Jadwal Pelajaran
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.schedule.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{item.day}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("profile");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "profile" && <Profile />}
          {activePage === "teachers" && <TeachersList />}
          {activePage === "students" && <StudentsList />}
          {activePage === "schedule" && <Schedule />}
        </div>
      </div>
    </div>
  );
}
