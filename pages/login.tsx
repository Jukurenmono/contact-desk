import React, { useState } from 'react';
import Link from 'next/link';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state

  const Login = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/contacts/users/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (response.ok) {
        const user = result.find(
          (user: { username: string; password: string }) =>
            user.username === username && user.password === password
        );

        if (user) {
          // Show the modal for 2 seconds before logging in
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);  // Hide modal after 2 seconds
            login(user);  // Proceed to login after the modal disappears
          }, 2000);
        } else {
          console.error('No User found');
        }
      }
    } catch (error) {
      console.error('Failed to login user:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center font-sans justify-center h-screen bg-[#F0FBFF]">
      <div className="w-full max-w-md">
        <form className="bg-[#F0FBFF] rounded px-8 pt-6 pb-8 mb-4">
          <div>
            <img src="/contactDesk2.png" alt="Contact Desk" className="mx-auto size-5/12" />
            <p className="text-center text-gray-500 text-sm mt-6 mb-12">
              Enter your credentials to access your account
            </p>
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onMouseDown={togglePasswordVisibility}
              onMouseUp={togglePasswordVisibility}
              onMouseLeave={(e) => setShowPassword(false)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="w-full bg-[#7D8CC4] hover:bg-[#8a97c9] text-white font-semibold text-xs py-4 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={Login}
            >
              Sign In
            </button>
          </div>

          <div className="mt-2 text-center">
            <Link href="/signup">
              <button
                type="button"
                className="w-full text-[#7D8CC4] hover:bg-gray-100 py-4 px-4 font-semibold text-xs rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Modal for Successful Login */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-green-600">Logged In Successfully</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
