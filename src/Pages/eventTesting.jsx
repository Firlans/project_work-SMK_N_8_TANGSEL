import React, { useEffect, useState } from 'react';
import echo from '../echo';

const TestingEvent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const channel = echo.channel('testing-channel'); // Ganti sesuai nama channel di Laravel

    channel.listen('TestingEvent', (e) => {
      console.log('Event diterima:', e);
    //   setMessages(prev => [...prev, e.message]);
    });

    return () => {
      echo.leave('chat');
    };
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Halaman Testing Event</h1>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestingEvent;
