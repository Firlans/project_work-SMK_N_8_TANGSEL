<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendMessageEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $message;
    public $roomId;
    public $sender;


    public function __construct($message, $roomId, $sender)
    {
        $this->message = $message;
        $this->roomId = $roomId;
        $this->sender = $sender;
    }

    public function broadcastWith(){
        return [
            'message'=> $this->message,
            'sender' => $this->sender,
            'roomId' => $this->roomId
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("room.{$this->roomId}"),
        ];

    }
}
