import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Loader from '../components/loader';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const SignUp = async () => {
      try {

          const response = await fetch('http://127.0.0.1:8000/api/contacts/users/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                "action": "register",
                username, 
                email, 
                password }),
          });
  
          if (response.ok) {
              setError('');
              alert('Account created successfully! You can now log in.');
              router.push('/')
          } else {
              if (response.status === 409) {
                  setError('Email is already in use');
              } else {
                  setError(`Error: ${response.status}`);
              }
          }
      } catch (error) {
          console.error('Failed to add user:', error);
      }
  };
  
  

    useEffect(() => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    }, [password, confirmPassword]);

    return (
      <>
      {loading ? (
        <Loader/>
      ) : (
        <div className="flex items-center font-sans justify-center h-screen bg-[#F0FBFF]">
            <div className="w-full max-w-md">
                <form
                    className="bg-[#F0FBFF] rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!error) SignUp();
                    }}
                >
                    <div>
                        <img src="/contactDesk2.png" alt="Contact Desk" className="mx-auto size-5/12" />
                        <p className='text-center text-gray-500 text-sm mt-6 mb-12'>Create New Account</p>
                    </div>
                    <div className="mb-4">
                        <input
                            required
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            required
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button
                            type="button"
                            onMouseDown={togglePasswordVisibility}
                            onMouseUp={togglePasswordVisibility}
                            onMouseLeave={() => setShowPassword(false)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="bg-white text-sm appearance-none border border-[#E2E2E2] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button
                            type="button"
                            onMouseDown={toggleConfirmPasswordVisibility}
                            onMouseUp={toggleConfirmPasswordVisibility}
                            onMouseLeave={() => setShowConfirmPassword(false)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {error && <text className="text-red-500 text-xs italic mb-4">{error}</text>}
                    <div className="mt-2 text-center">
                        <button
                            type="submit"
                            className="w-full bg-[#7D8CC4] hover:bg-[#8a97c9] text-white font-semibold text-xs py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mt-2 text-center">
                        <Link href='/login'>
                        <button
                            type="button"
                            className="w-full text-[#7D8CC4] hover:bg-gray-100 py-4 px-4 font-semibold text-xs rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign In
                        </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
      )}
      </>
    );
};

export default Login;
