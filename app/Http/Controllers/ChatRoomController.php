<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\User;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatRoomController extends Controller
{
    use ApiResponseHandler;
    public function createChatRoom(Request $request)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult; // Return validation error response
            }



            // Create a new chat room
            $chatRoom = ChatRoom::create($data);

            return $this->handleCreated($chatRoom, "room chat");
        } catch (\Exception $e) {
            return $this->handleError($e, 'createRoom');
        }

    }

    private function validation($data)
    {
        $is_conselor = User::where('id', $data['id_guru'])
            ->whereHas('privileges', function ($query) {
                $query->where('is_conselor', true);
            })
            ->exists();

        if(!$is_conselor){
            return $this->handleNotFoundData($data['id_guru'], 'Conselor');
        }
        $validator = Validator::make($data, [
            'id_siswa' => 'nullable|exists:users,id',
            'id_guru' => 'required|exists:users,id',
            'name' => 'nullable|string|max:255',
            'access_code' => 'nullable|string|max:255',
            'is_private' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }


        return true;
    }
}
