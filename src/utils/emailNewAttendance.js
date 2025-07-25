/**
 * Generates an HTML email template for presensi/attendance changes.
 * @param {object} params - Parameters for the email.
 * @param {string} params.studentName - Name of the student.
 * @param {string} params.className - Name of the class.
 * @param {string} params.meetingDate - Date of the meeting/class.
 * @param {string} params.newStatus - The updated attendance status (Hadir, Izin, Sakit, Alpa).
 * @param {string} [params.keterangan] - Optional notes for the attendance.
 * @param {string} params.teacherName - Name of the teacher who updated the status.
 * @param {string} params.timestamp - Formatted timestamp of the update.
 * @returns {string} The full HTML content of the email.
 */
export const generateAttendanceNotificationEmail = ({
  studentName,
  className,
  meetingDate,
  newStatus,
  keterangan,
  teacherName,
  timestamp,
  mapelName,
  meetingName,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notifikasi Perubahan Presensi</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #333333; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
            .header { background-color: #ffc107; padding: 25px 30px; color: #333333; text-align: center; font-size: 24px; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            .content { padding: 30px; line-height: 1.6; }
            .content p { margin-bottom: 15px; font-size: 16px; }
            .info-box { background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
            .info-box p { margin: 0; font-size: 16px; color: #664d03; }
            .button-container { text-align: center; margin-top: 30px; }
            .button { display: inline-block; background-color: #007bff; color: #ffffff !important; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px; border: none; cursor: pointer; }
            .footer { background-color: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 13px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                Perubahan Status Presensi Siswa Anda!
            </div>
            <div class="content">
                <p>Yth. Bapak/Ibu Wali Murid,</p>
                <p>Kami ingin memberitahukan bahwa terdapat pembaruan status presensi untuk:</p>

                <div class="info-box">
                    <p><strong>Nama Siswa:</strong> ${studentName}</p>
                    <p><strong>Kelas:</strong> ${className}</p>
                     <p><strong>Mata Pelajaran:</strong> ${mapelName}</p> <p><strong>Pertemuan Ke:</strong> ${meetingName}</p> <p><strong>Tanggal Pertemuan:</strong> ${meetingDate}</p>
                    <p><strong>Status Baru:</strong> <span style="font-weight: bold; color: ${
                      newStatus === "alpha"
                        ? "#dc3545" // Merah untuk Alpa
                        : newStatus === "sakit"
                        ? "#fd7e14" // Oranye untuk Sakit
                        : newStatus === "izin"
                        ? "#ffc107" // Kuning untuk Izin
                        : "#28a745" // Hijau untuk Hadir
                    };">${newStatus}</span></p>
                    ${
                      keterangan
                        ? `<p><strong>Keterangan:</strong> ${keterangan}</p>`
                        : ""
                    }
                </div>

                <p>Pembaruan ini dilakukan oleh guru: <strong>${teacherName}</strong> pada ${timestamp}.</p>
                
                <p>Mohon periksa akun Anda di aplikasi kami untuk detail lebih lanjut.</p>
                <div class="button-container">
                    <a href="https://smkn8tangerangselatan.site/" class="button">Lihat Riwayat Presensi</a>
                </div>
                <p style="margin-top: 30px;">Terima kasih atas perhatiannya.</p>
            </div>
            <div class="footer">
                Ini adalah email otomatis. Mohon jangan membalas email ini.
                <br>
                &copy; ${new Date().getFullYear()} SMK NEGERI 8 KOTA TANGERANG SELATAN. Semua Hak Dilindungi.
            </div>
        </div>
    </body>
    </html>
  `;
};
