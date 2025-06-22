<?php

namespace App\Http\Controllers;

use App\Mail\AccessParent;
use App\Models\Guru;
use App\Models\Privilege;
use App\Models\Siswa;
use App\Models\User;
use App\Services\FonnteService;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use function GuzzleHttp\json_encode;



class AuthController extends Controller
{
    use ApiResponseHandler;
    protected $fonnte;

    public function __construct(FonnteService $fonnte)
    {
        $this->fonnte = $fonnte;
    }
    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            $token = JWTAuth::attempt($credentials);

            if (!$token) {
                \Log::warning('Gagal login, credentials salah atau user tidak ditemukan.', $credentials);

                return response()->json(
                    [
                        'status' => 'fail',
                        'message' => 'Invalid credentials',
                    ],
                    401
                );
            }
            $user = auth()->user();
            $privilege = Privilege::where('id_user', $user->id)->first();

            $token = JWTAuth::claims(['profile' => $user->profile])->fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'login success',
                'data' => [
                    'user' => $user,
                    'privilege' => $privilege,
                    'token' => $token
                ]
            ], 200);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    public function loginByNISN(Request $request)
    {
        try {
            $request->validate([
                'nisn' => 'required|string',
                'password' => 'required|string'
            ]);

            $siswa = Siswa::where('nisn', '=', $request->nisn)->first();

            if (!$siswa) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            $user = User::find($siswa->user_id);
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }
            $user->load('privileges');

            $token = JWTAuth::claims(['profile' => $user->profile])->fromUser($user);

            if (!$token) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => [
                    'user' => $user->only(['id', 'name', 'email', 'prifile', 'is_active', 'email_verified_at', 'created_at', 'updated_at']),
                    'privilege' => $user->privileges,
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    public function loginByNIP(Request $request)
    {
        try {
            $request->validate([
                'nip' => 'required|string',
                'password' => 'required|string'
            ]);

            $guru = Guru::where('nip', '=', $request->nip)->first();

            if (!$guru) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            $user = User::find($guru->user_id);
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }
            $user->load('privileges');

            $token = JWTAuth::claims(['profile' => $user->profile])->fromUser($user);

            if (!$token) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => [
                    'user' => $user->only(['id', 'name', 'email', 'prifile', 'is_active', 'email_verified_at', 'created_at', 'updated_at']),
                    'privilege' => $user->privileges,
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    public function loginOrangTuaByNoTelp(Request $request)
    {
        try {
            if (!$request->has(['nisn', 'no_telp'])) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }
            $siswa = Siswa::select('siswa.*')
                ->leftJoin('wali_murid', 'wali_murid.id_siswa', '=', 'siswa.id')
                ->where('siswa.nisn', '=', $request->nisn)
                ->where('wali_murid.no_telp', '=', $request->no_telp)
                ->first();

            if (!$siswa) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            $user = User::find($siswa->user_id);

            if (!$user) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }
            $user->load('privileges');

            $token = JWTAuth::claims(['profile' => $user->profile])->fromUser($user);
            if (!$token) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }

            $host = env('FRONTEND_URL', 'https://x61n12fl-5173.asse.devtunnels.ms');
            $link = "{$host}/login/orang-tua?token={$token}";

            // Format nomor WA
            $noTelp = preg_replace('/[^0-9]/', '', $request->no_telp); // hanya angka
            if (strpos($noTelp, '0') === 0) {
                $noTelp = '62' . substr($noTelp, 1); // ubah 08xxx jadi 628xxx
            }

            $pesan = "Halo, berikut adalah link akses login orang tua untuk siswa *{$siswa->nama_lengkap}*: \n\n{$link}\n\nHarap simpan link ini baik-baik.";

            // Kirim via Fonnte
            $this->fonnte->sendMessage($noTelp, $pesan);

            \Log::info('Link akses dikirim ke WhatsApp: ' . $noTelp);
            return response()->json([
                'status' => 'success',
                'message' => 'Akses di kirim via Whatsapp'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }
    public function loginOrangTuaByEmail(Request $request)
    {
        try {
            if (!$request->has(['email', 'nisn'])) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'invalid credential',
                ], 401);
            }
            \Log::info('info ' . json_encode($request->has(['nisn', 'email'])));
            $siswa = Siswa::select('siswa.*', 'wali_murid.nama_lengkap')
                ->leftJoin('wali_murid', 'wali_murid.id_siswa', '=', 'siswa.id')
                // ->where('siswa.nisn', '=', $request->nisn)
                ->where('wali_murid.email', '=', $request->email)
                ->first();

            if (!$siswa) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'siswa tidak ditemukan',
                ], 401);
            }

            $user = User::find($siswa->user_id);

            if (!$user) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'user tidak ditemukan',
                ], 401);
            }
            $user->load('privileges');

            $token = JWTAuth::claims(['profile' => $user->profile])->fromUser($user);

            if (!$token) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'token gagal dibuat',
                ], 401);
            }
            $url = env('FRONTEND_URL', 'https://x61n12fl-5173.asse.devtunnels.ms');
            $link = "{$url}/login/orang-tua?token={$token}";

            $send = Mail::to($request->email)->send(new AccessParent($link, $siswa->nama_lengkap));
            \Log::info('terkirim' . json_encode($link));
            return response()->json([
                'status' => 'success',
                'message' => 'Akses di kirim via Email'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => "Could not create token $e"], 500);
        }

    }

    // Get authenticated user
    public function getUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'User not found'
                ], 404);
            }
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Invalid token'
            ], 400);
        }

        return response()->json(compact('user'));
    }

    // User logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ]);
    }
}