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

    public function updateChatRoom(Request $request, $id)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("chat room id = {$id}");
            }

            $chatRoom = ChatRoom::find($id);

            if (!$chatRoom) {
                return $this->handleNotFoundData($id, 'chat room');
            }

            $update = $chatRoom->update($data);
            if (!$update) {
                return $this->handleFail('update', 'chat room');
            }

            return $this->handleUpdated($chatRoom, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateChatRoom');
        }

    }


    public function deleteChatRoom($id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("chat room id = {$id}");
            }

            $chatRoom = ChatRoom::find($id);
            if (!$chatRoom) {
                return $this->handleNotFoundData($id, 'chat room');
            }

            $isDeleted = $chatRoom->delete();
            if (!$isDeleted) {
                return $this->handleFail($id, 'chat room');
            }
            return $this->handleDeleted('chat room', $id);

        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteChatRooms');
        }
    }

    public function getAllChatRooms()
    {
        try {
            $chatRooms = ChatRoom::all();
            return $this->handleReturnData($chatRooms, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllChatRooms');
        }
    }


    public function getChatRoomById($id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("chat room id = {$id}");
            }

            $chatRooms = ChatRoom::find($id);
            return $this->handleReturnData($chatRooms, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllChatRooms');
        }
    }

    public function getChatRoomsBySiswa($id_siswa)
    {
        try {
            if (
                empty($id_siswa) ||
                $id_siswa === null ||
                $id_siswa === "null" ||
                $id_siswa === "undefined" ||
                !is_numeric($id_siswa)
            ) {
                return $this->invalidParameter("chat room by id siswa = {$id_siswa}");
            }

            $chatRooms = ChatRoom::where('id_siswa', '=', $id_siswa)->get();

            return $this->handleReturnData($chatRooms, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllChatRooms');
        }
    }

    public function getChatRoomsByConselor($id_conselor)
    {
        try {
            if (
                empty($id_conselor) ||
                $id_conselor === null ||
                $id_conselor === "null" ||
                $id_conselor === "undefined" ||
                !is_numeric($id_conselor)
            ) {
                return $this->invalidParameter("chat room by id conselor = {$id_conselor}");
            }

            $chatRooms = ChatRoom::where('id_guru', '=', $id_conselor)->get();

            return $this->handleReturnData($chatRooms, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllChatRooms');
        }
    }

    public function getChatRoomsByAccessCode($accessCode)
    {
        try {
            if (
                empty($accessCode) ||
                $accessCode === null ||
                $accessCode === "null" ||
                $accessCode === "undefined"
            ) {
                return $this->invalidParameter("chat room by id access code = {$accessCode}");
            }

            $chatRooms = ChatRoom::where('access_code', '=', $accessCode)->first();

            return $this->handleReturnData($chatRooms, 'chat room');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllChatRooms');
        }
    }


    private function validation($data, $id = null)
    {
        $validator = Validator::make($data, [
            'id_siswa' => 'nullable|exists:users,id',
            'id_guru' => 'required|exists:users,id',
            'name' => 'nullable|string|max:255',
            'access_code' => 'nullable|string|max:255|unique:chat_rooms,access_code' . ($id ? ',' . $id : ''),
            'is_private' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $is_conselor = User::where('id', $data['id_guru'])
            ->whereHas('privileges', function ($query) {
                $query->where('is_conselor', true);
            })
            ->exists();

        if (!$is_conselor) {
            return $this->handleNotFoundData($data['id_guru'], 'Conselor');
        }



        return true;
    }
}
