<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Link Akses Anda</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            background-color: #ffffff;
            max-width: 600px;
            margin: 30px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            font-size: 13px;
            color: #999;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <h2>Halo, {{ $name ?? 'Pengguna' }}!</h2>
        <p>Kami telah membuatkan link akses khusus untuk Anda. Silakan klik tombol di bawah ini untuk melanjutkan:</p>

        <a href="{{ $accessLink }}" class="button" target="_blank">Akses Sekarang</a>

        <p>Link ini mungkin memiliki batas waktu atau hanya berlaku satu kali tergantung pengaturan sistem.</p>

        <p>Jika Anda tidak merasa meminta akses ini, abaikan saja email ini.</p>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
