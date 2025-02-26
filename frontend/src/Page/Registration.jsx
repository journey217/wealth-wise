// File: frontend/src/Page/Registration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS Files/Registration.css';

const Registration = ( { openError } ) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const handleRegristration = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    //Checking if password are the same
    if (password !== confirmpassword) {
      setErrorMessage('Passwords do not match!');
      setIsSuccess(false);
      return;
    }

    // Checking if email is from the allowed domain
    if (!email.endsWith('@buffalo.edu')) {
      setErrorMessage('Only @buffalo.edu emails are allowed!');
      setIsSuccess(false);

      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/routes/registration.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, username, password})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        navigate('/')
      } else {
         setErrorMessage(data.message || 'Registration failed');
         setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while trying to register.');
      setIsSuccess(false);
    }
  };


  return (
      <div className='RegisterContainer'>
        <div className="Register_box">
          <div onClick={event => navigate('/')} className="Login_Title">
            <h1>Wealth Wise</h1>
          </div>
          <form className="Register_section" onSubmit={handleRegristration}>
            {errorMessage !== '' &&
                <div className={"error-message"}>{errorMessage}</div>
            }
            <div className="email_section">
              <label htmlFor="username" className="email_text">Email</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="username_section">
              <label htmlFor="username" className="username_text">Username</label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  maxLength={20}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
            </div>
            <p className="pass_requir_txt">Password must contain at least 8 characters 1
              uppercase letter,1 number, 1 special character.
            </p>
            <div className="password_section">
              <label htmlFor="password" className="password_text">Password</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
              />
            </div>
            <div className="confirm_password_section">
              <label htmlFor="password" className="password_text">Confirm Password</label>
              <input
                  type="password"
                  id="password1"
                  name="password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
              />
            </div>
            <button type="submit" className="Register_in_box">
              <h2>Register</h2>
            </button>
            <div className="Log_in">
              Already have an account? <div className="create_or_login" onClick={() => navigate('/')}>Sign in</div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Registration;