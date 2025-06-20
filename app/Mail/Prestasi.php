<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Prestasi extends Mailable
{
    use Queueable, SerializesModels;

    public string $parentName;
    public string $studentName;
    public string $achievementDate;
    public string $achievementTitle;
    public string $description;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $parentName,
        string $studentName,
        string $achievementDate,
        string $achievementTitle,
        string $description
    ) {
        $this->parentName = $parentName;
        $this->studentName = $studentName;
        $this->achievementDate = $achievementDate;
        $this->achievementTitle = $achievementTitle;
        $this->description = $description;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Penghargaan atas Prestasi Ananda',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mails.Prestasi',
            with: [
                'parentName' => $this->parentName,
                'studentName' => $this->studentName,
                'achievementDate' => $this->achievementDate,
                'achievementTitle' => $this->achievementTitle,
                'description' => $this->description,
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
