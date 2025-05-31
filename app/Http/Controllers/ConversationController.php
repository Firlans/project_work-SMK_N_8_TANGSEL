<?php

namespace App\Http\Controllers;

use App\Events\SendMessageEvent;
use App\Models\ChatDetail;
use App\Models\ChatRoom;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConversationController extends Controller
{
    use ApiResponseHandler;

    public function createConversation(Request $request)
    {
        try {
            $data = $request->all();

            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $user = auth()->user();
            $message = ChatDetail::create($data);

            broadcast(new SendMessageEvent($message->message, $message->id_chat_room, $user))->toOthers();

            return $this->handleCreated($message, 'message');
        } catch (\Exception $e) {
            return $this->handleError($e, 'createConversation');
        }
    }
    public function updateConversation($id, Request $request)
    {
        try {
            $data = $request->all();

            $validationResult = $this->validation($data);
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
                return $this->invalidParameter("chat room by id conselor = {$id}");
            }

            $message = ChatDetail::find($id);

            if (!$message) {
                return $this->handleNotFoundData($id, 'message');
            }

            $isUpdated = $message->update($data);

            if (!$isUpdated) {
                return $this->handleFail('update', 'message');
            }

            return $this->handleUpdated($message, 'message');
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateConversation');
        }
    }
    public function deleteConversation($id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("chat room by id conselor = {$id}");
            }

            $message = ChatDetail::find($id);

            if (!$message) {
                return $this->handleNotFoundData($id, 'message');
            }

            $isDeleted = $message->delete();

            if (!$isDeleted) {
                return $this->handleFail('delete', 'message');
            }

            return $this->handleDeleted('message', $message->id);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteConversation');
        }
    }
    public function getConversationsByChatRoom($id_chat_room)
    {
        try {
            $isExistRoom = ChatRoom::where('id', '=', $id_chat_room)->exists();
            if (!$isExistRoom) {
                return $this->handleNotFoundData($id_chat_room, 'chat room', 'id');
            }

            $messages = ChatDetail::orderBy('created_at', 'desc')->paginate(20);

            return $this->handleReturnData([
                'data' => $messages->items(),
                'current_page' => $messages->currentPage(),
                'total' => $messages->total(),
                'last_page' => $messages->lastPage(),
            ], 'message');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getConversationsByChatRoom');
        }
    }

    private function validation($data)
    {
        $validator = Validator::make($data, [
            'id_chat_room' => 'required|exists:chat_rooms,id',
            'id_sender' => 'nullable|exists:users,id',
            'message' => 'nullable|string',
            'encrypted_message' => 'nullable|string',
            'is_read' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
