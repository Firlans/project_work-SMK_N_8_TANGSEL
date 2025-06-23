<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccessParent extends Mailable
{
    use Queueable, SerializesModels;

    public $accessLink;
    public $name;
    /**
     * Create a new message instance.
     */
    public function __construct($accessLink, $name = null)
    {
        $this->accessLink = $accessLink;
        $this->name = $name;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Link Akses untuk Orang Tua - ' . Carbon::now()->format('Y-m-d H:i:s'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mails.AccessParent',
            with: [
                'accessLink' => $this->accessLink,
                'name' => $this->name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
