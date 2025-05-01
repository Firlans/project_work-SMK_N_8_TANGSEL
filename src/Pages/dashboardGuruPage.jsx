import React, { useState } from "react";
import { FaUser, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import Header from "../Components/Elements/Header/Index";
import ProfileGuru from "../Components/Fragments/ProfileGuru";
import Sidebar from "../Components/Elements/Sidebar/Sidebar";

const dummyData = {
  profile: {
    name: "Budi Santoso",
    nip: "198505152010011005",
    gender: "Laki-laki",
    birthPlace: "Jakarta",
    birthDate: "1985-05-15",
    address: "Jl. Pendidikan No. 123, Ciputat, Tangerang Selatan",
    phone: "081234567890",
    email: "budi.santoso@gmail.com",
    role: "Guru",
    subject: "Matematika",
  },
  attendance: {
    subjects: ["Matematika Dasar", "Matematika Lanjut"],
    classes: ["X RPL 1", "X RPL 2", "XI RPL 1"],
    meetings: [1, 2, 3, 4, 5, 6, 7, 8],
    students: [
      { id: 1, name: "Ahmad Rizki", status: "hadir" },
      { id: 2, name: "Budi Pratama", status: "sakit" },
      { id: 3, name: "Cindy Putri", status: "izin" },
    ],
  },
  schedule: [
    {
      subject: "Matematika Dasar",
      class: "X RPL 1",
      time: "07:00 - 08:30",
      day: "Senin",
    },
    {
      subject: "Matematika Lanjut",
      class: "XI RPL 1",
      time: "08:30 - 10:00",
      day: "Senin",
    },
    {
      subject: "Matematika Dasar",
      class: "X RPL 2",
      time: "07:00 - 08:30",
      day: "Selasa",
    },
  ],
};

const AttendanceList = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [students, setStudents] = useState(dummyData.attendance.students);
  const [notes, setNotes] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleNoteChange = (studentId, note) => {
    setNotes((prev) => ({
      ...prev,
      [studentId]: note,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Pilih Mata Pelajaran</option>
          {dummyData.attendance.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Pilih Kelas</option>
          {dummyData.attendance.classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedMeeting}
          onChange={(e) => setSelectedMeeting(e.target.value)}
        >
          <option value="">Pilih Pertemuan</option>
          {dummyData.attendance.meetings.map((meeting) => (
            <option key={meeting} value={meeting}>
              Pertemuan {meeting}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {["hadir", "sakit", "izin", "alfa"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleAttendanceChange(student.id, status)
                        }
                        className={`px-3 py-1 rounded-lg text-sm ${
                          student.status === status
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 w-full"
                    placeholder="Tambah keterangan"
                    value={notes[student.id] || ""}
                    onChange={(e) =>
                      handleNoteChange(student.id, e.target.value)
                    }
                  />
                </td>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jadwal Mengajar</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kelas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.schedule.map((schedule, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">{schedule.day}</td>
                <td className="px-6 py-4">{schedule.subject}</td>
                <td className="px-6 py-4">{schedule.class}</td>
                <td className="px-6 py-4">{schedule.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardGuruPage = () => {
  const [activePage, setActivePage] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "attendance", label: "Kehadiran Siswa", icon: <FaUserCheck /> },
    { id: "schedule", label: "Jadwal Mengajar", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        title="Dashboard Guru"
        menuItems={menuItems}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-8">
          {activePage === "profile" && <ProfileGuru />}
          {activePage === "attendance" && <AttendanceList />}
          {activePage === "schedule" && <Schedule />}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuruPage;
