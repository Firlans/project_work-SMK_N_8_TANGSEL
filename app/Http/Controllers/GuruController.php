<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GuruController extends Controller
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
    public function conselor()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'ini route conselor',
        ], 200);
    }
}
