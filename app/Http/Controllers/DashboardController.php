<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function teacher()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'ini route guru',
        ], 200);
    }
    public function admin()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'ini route admin',
        ], 200);
    }
    public function konselor()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'ini route konselor',
        ], 200);
    }
    public function siswa()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'route siswa',
        ], 200);
    }
}
