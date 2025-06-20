<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Selamat atas Prestasi Siswa</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f2f7fb;
            padding: 20px;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            background-color: #ffffff;
            margin: auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
            font-size: 22px;
            color: #2e86de;
            margin-bottom: 20px;
        }
        .achievement-details {
            background-color: #eaf4ff;
            padding: 15px;
            border-left: 5px solid #3498db;
            border-radius: 6px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2 class="header">Selamat atas Prestasi Ananda!</h2>

        <p>Yth. {{ $parentName ?? 'Orang Tua/Wali' }},</p>

        <p>
            Dengan bangga kami informasikan bahwa siswa atas nama <strong>{{ $studentName }}</strong> 
            telah meraih prestasi pada tanggal <strong>{{ \Carbon\Carbon::parse($achievementDate)->translatedFormat('d F Y') }}</strong>.
        </p>

        <div class="achievement-details">
            <p><strong>Prestasi:</strong> {{ $achievementTitle }}</p>
            <p><strong>Deskripsi:</strong> {{ $description }}</p>
        </div>

        <p>
            Kami mengucapkan selamat atas pencapaian ini. Semoga menjadi motivasi bagi ananda dan siswa lainnya
            untuk terus berprestasi dan mengharumkan nama sekolah dan keluarga.
        </p>

        <p>Terima kasih atas dukungan Bapak/Ibu selama ini.</p>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
