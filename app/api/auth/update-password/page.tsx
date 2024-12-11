'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { updateUserPassword } from '@/lib/auth/auth';

const UpdatePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async () => {
    const { error } = await updateUserPassword(password);

    if (error) {
      setMessage('Error updating password.');
    } else {
      setMessage('Password updated successfully.');
      router.push('/login'); // Redirect to login page
    }
  };

  return (
    <div>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="New Password" 
      />
      <button onClick={handleUpdatePassword}>Update Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdatePassword;