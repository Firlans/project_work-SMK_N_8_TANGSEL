/**
 * Generates an HTML email template for student violation notifications.
 * @param {object} params - Parameters for the email.
 * @param {string} params.studentName - Nama siswa.
 * @param {number} params.totalPoints - Total poin pelanggaran.
 * @param {string} params.detailsUrl - Link untuk cek detail pelanggaran.
 * @returns {string} The full HTML content of the email.
 */
export const generateViolationNotificationEmail = ({
  studentName,
  totalPoints,
  detailsUrl,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notifikasi Pelanggaran Siswa</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f7f6;
                color: #333333;
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
                background-color: #dc3545; /* merah untuk alert */
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
                background-color: #f8d7da; /* latar merah muda */
                padding: 15px;
                border-left: 5px solid #dc3545;
                margin: 20px 0;
                border-radius: 4px;
            }
            .highlight strong {
                color: #721c24;
            }
            .button-container {
                text-align: center;
                margin-top: 30px;
            }
            .button {
                display: inline-block;
                background-color: #007bff; /* biru untuk tombol */
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
                Peringatan Pelanggaran Siswa
            </div>
            <div class="content">
                <p>Halo Wali Siswa,</p>
                <p>Anak Anda telah mencapai batas pelanggaran berikut:</p>
                <div class="highlight">
                    <p><strong>Nama Siswa:</strong> ${studentName}</p>
                    <p><strong>Total Poin Pelanggaran:</strong> ${totalPoints}</p>
                </div>
                <p>Mohon segera cek detail pelanggaran anak Anda melalui tombol di bawah ini:</p>
                <div class="button-container">
                    <a href="${detailsUrl}" class="button">Lihat Detail Pelanggaran</a>
                </div>
                <p>Jika ada pertanyaan, silakan hubungi pihak sekolah.</p>
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
