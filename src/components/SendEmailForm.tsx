"use client"
import { useState } from 'react';
import axios from 'axios';

const SendEmailForm = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/sendEmail', {
        to,
        subject,
        text,
      });

      if (response.status === 200) {
        console.log("Email sent successfully!");
        // Optionally, clear the form or show a success message
        setTo("");
        setSubject("");
        setText("");
        setErrorMessage('');
      }
    } catch (error) {
      // Type assertion to handle the error
      const errorResponse = (error as { response?: { data?: { error?: string } } });
      console.error("Failed to send email:", errorResponse.response?.data?.error);
      setErrorMessage(errorResponse.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Recipient Email"
        required
      />
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Email body"
        required
      />
      <button type="submit">Send Email</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default SendEmailForm;
