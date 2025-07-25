/**
 * Generates an HTML email template for new chat room notifications.
 * @param {object} params - Parameters for the email.
 * @param {string} params.roomName - The name of the chat room.
 * @param {string} params.roomType - The type of the chat room ('Privat' or 'Publik').
 * @param {string} [params.accessCode] - Access code for private rooms (optional).
 * @param {string} [params.studentName] - Name of the student for public rooms (optional).
 * @returns {string} The full HTML content of the email.
 */
export const generateChatRoomNotificationEmail = ({
  roomName,
  roomType,
  studentName,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notifikasi Chat Room Baru</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f7f6;
                color: #333333;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                width: 100% !important;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }
            .header {
                background-color: #007bff; /* Warna biru cerah */
                padding: 25px 30px;
                color: #ffffff;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            .content {
                padding: 30px;
                line-height: 1.6;
            }
            .content p {
                margin-bottom: 15px;
                font-size: 16px;
            }
            .highlight {
                background-color: #e6f7ff; /* Latar belakang biru muda */
                padding: 15px;
                border-left: 5px solid #007bff;
                margin: 20px 0;
                border-radius: 4px;
            }
            .highlight strong {
                color: #0056b3;
            }
            .button-container {
                text-align: center;
                margin-top: 30px;
            }
            .button {
                display: inline-block;
                background-color: #28a745; /* Warna hijau untuk tombol */
                color: #ffffff !important;
                padding: 12px 25px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                font-size: 16px;
                border: none;
                cursor: pointer;
            }
            .footer {
                background-color: #f0f0f0;
                padding: 20px 30px;
                text-align: center;
                font-size: 13px;
                color: #777777;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            a {
                color: #007bff;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                Notifikasi Chat Room Baru!
            </div>
            <div class="content">
                <p>Halo Konselor,</p>
                <p>Ada chat room baru yang telah dibuat untuk Anda:</p>
                <div class="highlight">
                    <p><strong>Nama Room:</strong> ${roomName}</p>
                    <p><strong>Tipe Room:</strong> ${roomType}</p>
                    ${
                      studentName
                        ? `<p><strong>Nama Siswa:</strong> ${studentName}</p>`
                        : ""
                    }
                </div>
                <p>Mohon segera cek aplikasi Anda untuk memulai sesi chat. Klik tombol di bawah ini untuk langsung menuju ke halaman chat Anda:</p>
                <div class="button-container">
                    <a href="https://smkn8tangerangselatan.site/" class="button">Lihat Chat Room</a>
                </div>
                <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
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