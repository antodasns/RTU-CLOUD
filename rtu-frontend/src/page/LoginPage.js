// Login.js

import React, { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import TaskService from '../services/TaskService';
import { parseJwt, handleLogError } from '../misc/Helpers'

const LoginPage = () => {

  const Auth = useAuth()
  const navigate=useNavigate();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {

    try {

    const response = await TaskService.authenticate(username, password)

      const { idToken } = response

      const data = idToken.payload;

      const authenticatedUser = {data , idToken }

      Auth.userLogin(authenticatedUser)

      setUsername('')

      setPassword('')

      navigate('/home');

    } catch (error) {

      handleLogError(error)
    }

    // Basic authentication logic (you can replace this with your actual authentication logic)
    // if ((username === 'developer'||username === 'tester'||username === 'master') && password === 'pass') {
    //   login({ username });
    //   navigate('/home');
    // } else {
    //   alert('Invalid username or password');
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-md shadow-md">
        <div className="text-3xl font-bold text-center">Login</div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
