// src/app/Profile/page.tsx

'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import { db } from "@/FireBase/FireBaseConfig";
import { isValidBSN } from '@/utils/validBSN';  // Import the validation function

export default function Profile() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue) {
      setMessage('Please enter a BSN.');
      return;
    }

    // Convert the input value to a number before passing it to the validation function
    const bsnNumber = Number(inputValue);

    if (isNaN(bsnNumber)) {
      setMessage('Please enter a valid numeric BSN.');
      return;
    }

    if (isValidBSN(bsnNumber)) {
      setMessage('Valid BSN number!');
    } else {
      setMessage('Invalid BSN number. Please enter a valid 9-digit BSN.');
    }
  };

  return (
    <div>
      <h1>Check BSN Validity</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter BSN"
        />
        <button type="submit">Check</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
