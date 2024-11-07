import React, { useState } from 'react';
import './auth.scss';
import { auth } from '../../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Only for registration
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, browserSessionPersistence);

      if (isLogin) {
        // Log in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");

        // Set session expiration time (1 hour from now)
        const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour in ms
        localStorage.setItem('sessionExpiration', expirationTime);
        localStorage.setItem('user', JSON.stringify(userCredential.user)); // Optionally store user data

        navigate("/"); // Redirect to home page
      } else {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Registration successful!");

        // Set session expiration time (1 hour from now)
        const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour in ms
        localStorage.setItem('sessionExpiration', expirationTime);
        localStorage.setItem('user', JSON.stringify(userCredential.user)); // Optionally store user data

        navigate("/"); // Redirect to home page
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message); // Display error toast
    }
  };

  return (
    <div className="auth-page-v2">
      <div className="auth-container">
        <div className="auth-illustration">
          <div className="illustration-content">
            <h1>Welcome to Our Platform</h1>
            <p>Discover amazing features and connect with others.</p>
          </div>
        </div>
        <div className="auth-form">
          <div className="form-container">
            <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VscEyeClosed /> : <VscEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-btn">
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <p className="toggle-form">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleForm}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
