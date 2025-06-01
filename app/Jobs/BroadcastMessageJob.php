<?php

namespace App\Jobs;

use App\Events\SendMessageEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class BroadcastMessageJob implements ShouldQueue
{
    use Queueable;

    protected $message;
    protected $roomId;
    protected $sender;

    /**
     * Create a new job instance.
     */
    public function __construct($message, $roomId, $sender)
    {
        $this->message = $message;
        $this->roomId = $roomId;
        $this->sender = $sender;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        broadcast(new SendMessageEvent($this->message, $this->roomId, $this->sender))->toOthers();
    }
}
