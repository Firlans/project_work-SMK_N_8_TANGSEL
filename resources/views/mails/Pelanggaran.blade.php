<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Pelanggaran Siswa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f4f8;
            color: #333;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .violation-details {
            background-color: #f9fafc;
            padding: 15px;
            border-left: 5px solid #e74c3c;
            margin-top: 20px;
            border-radius: 6px;
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
        <h2>Laporan Pelanggaran Siswa</h2>

        <p>Yth. {{ $parentName ?? 'Orang Tua/Wali' }},</p>

        <p>
            Kami ingin memberitahukan bahwa siswa atas nama <strong>{{ $studentName }}</strong>
            telah melakukan pelanggaran pada tanggal <strong>{{ \Carbon\Carbon::parse($violationDate)->translatedFormat('d F Y') }}</strong>.
        </p>

        <div class="violation-details">
            <p><strong>Jenis Pelanggaran:</strong> {{ $violationType }}</p>
            <p><strong>Deskripsi:</strong> {{ $description }}</p>
        </div>

        <p>
            Kami berharap pihak orang tua/wali dapat memberikan perhatian dan pembinaan lanjutan di rumah.
            Jika diperlukan, Bapak/Ibu dapat menghubungi pihak sekolah untuk diskusi lebih lanjut.
        </p>

        <p>Terima kasih atas perhatian dan kerja samanya.</p>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
