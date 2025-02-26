import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../CSS Files/ResetPassword.css';
import TitleBanner from '../Component/TitleBanner.jsx';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token from URL (assuming the token is passed as a query parameter)
  const token = searchParams.get('token');

  // Automatically set the code from the token in the URL if available
  useState(() => {
    if (token) setCode(token);
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter.';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number.';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Password must contain a special character.';
    return null;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setMessage('');

    // Password validation
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/reset-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token: code }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // sessionStorage.setItem('username', data.username)
        // sessionStorage.setItem('pfp', data.pfp)
        // sessionStorage.setItem("User", data.id)
        // Redirect to login page after a successful reset
        setTimeout(() => navigate('/'));

      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while trying to reset the password.');
    }
  };

  return (
      <div className="reset-password-container">
        {/* Use the TitleBanner component here */}
        <div onClick={event => navigate('/')} className="Login_Title">
          <h1>Wealth Wise</h1>
        </div>
        <div className="reset-password-box">
          <div className="reset-password-title">
            <h2>Reset Password</h2>
            <p>Enter the token and a new password to reset your account password.</p>
          </div>

          <form onSubmit={handleResetPassword} className="reset-password-form">
            {/* Code input section */}
            <div className="code-section">
              <label htmlFor="code">Code</label>
              <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Enter the code"
              />
            </div>

            <div className="password-section">
              <label htmlFor="password">New Password</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter a new Password"
                  pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
              />
            </div>
            <div className="password-section">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Please Confirm Password"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit" className="reset-button">Reset Password</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
          </form>
        </div>
      </div>
  );
};

export default ResetPassword;