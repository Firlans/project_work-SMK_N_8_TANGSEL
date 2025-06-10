<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Pelanggaran extends Mailable
{
    use Queueable, SerializesModels;

    public string $parentName;
    public string $studentName;
    public string $violationDate;
    public string $violationType;
    public string $description;

    /**
     * Create a new message instance.
     */
    public function __construct($parentName, $studentName, $violationDate, $violationType, $description)
    {
        $this->parentName = $parentName;
        $this->studentName = $studentName;
        $this->violationDate = $violationDate;
        $this->violationType = $violationType;
        $this->description = $description;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Laporan Pelanggaran Siswa',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.Pelanggaran',
            with: [
                'parentName' => $this->parentName,
                'studentName' => $this->studentName,
                'violationDate' => $this->violationDate,
                'violationType' => $this->violationType,
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
