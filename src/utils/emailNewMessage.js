/**
 * Generates an HTML email template for new message notifications.
 * @param {object} params - Parameters for the email.
 * @param {string} params.chatRoomName - The name of the chat room.
 * @param {string} params.senderName - The name of the message sender.
 * @param {string} params.messageContent - The content of the new message.
 * @param {string} params.roomType - The type of the chat room ('Privat' or 'Publik').
 * @param {string} params.timestamp - Formatted timestamp of the message.
 * @returns {string} The full HTML content of the email.
 */
export const generateNewMessageNotificationEmail = ({
  chatRoomName,
  senderName,
  messageContent,
  roomType,
  timestamp,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru di Chat Room!</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #333333; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
            .header { background-color: #007bff; padding: 25px 30px; color: #ffffff; text-align: center; font-size: 24px; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            .content { padding: 30px; line-height: 1.6; }
            .content p { margin-bottom: 15px; font-size: 16px; }
            .message-box { background-color: #e6f7ff; padding: 15px 20px; margin: 20px 0; border-left: 5px solid #007bff; border-radius: 4px; }
            .message-box p { margin: 0; font-style: italic; color: #0056b3; }
            .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
            .info-box p { margin: 0; font-size: 14px; }
            .button-container { text-align: center; margin-top: 30px; }
            .button { display: inline-block; background-color: #28a745; color: #ffffff !important; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px; border: none; cursor: pointer; }
            .footer { background-color: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 13px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                Pesan Baru di ${chatRoomName}!
            </div>
            <div class="content">
                <p>Halo,</p>
                <p>Ada pesan baru di chat room <strong>"${chatRoomName}"</strong> (${roomType}).</p>

                <div class="info-box">
                    <p><strong>Pengirim:</strong> ${senderName}</p>
                    <p><strong>Waktu:</strong> ${timestamp}</p>
                </div>

                <p>Isi Pesan:</p>
                <div class="message-box">
                    <p>"${messageContent}"</p>
                </div>

                <p>Mohon segera cek aplikasi Anda untuk membalas pesan tersebut.</p>
                <div class="button-container">
                    <a href="https://smkn8tangerangselatan.site/" class="button">Lihat Chat Room</a>
                </div>
                <p style="margin-top: 30px;">Terima kasih.</p>
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
