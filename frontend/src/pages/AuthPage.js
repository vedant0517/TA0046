import React, { useState } from 'react';
import './AuthPage.css';

const API_BASE = 'http://localhost:5000/api';

function AuthPage({ onLogin, setCurrentPage }) {
    const [isSignup, setIsSignup] = useState(false);
    const [role, setRole] = useState('donor');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isSignup ? '/auth/signup' : '/auth/login';
            const body = isSignup
                ? { ...formData, role }
                : { email: formData.email, password: formData.password };

            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.message || 'Something went wrong');
                setLoading(false);
                return;
            }

            // Store token
            localStorage.setItem('careconnect_token', data.data.token);
            localStorage.setItem('careconnect_user', JSON.stringify(data.data.user));

            // Notify parent
            onLogin(data.data.user);

        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        }
        setLoading(false);
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-shapes">
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>
                <div className="auth-shape auth-shape-3"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo" onClick={() => setCurrentPage('home')}>
                            <span className="auth-logo-icon">💚</span>
                            <span className="auth-logo-text">CareConnect</span>
                        </div>
                        <h2 className="auth-title">
                            {isSignup ? 'Create Your Account' : 'Welcome Back'}
                        </h2>
                        <p className="auth-subtitle">
                            {isSignup
                                ? 'Join our community and start making a difference'
                                : 'Sign in to continue your journey of giving'}
                        </p>
                    </div>

                    {/* Role Selector (signup only) */}
                    {isSignup && (
                        <div className="auth-role-selector">
                            <button
                                type="button"
                                className={`auth-role-btn ${role === 'donor' ? 'active' : ''}`}
                                onClick={() => setRole('donor')}
                            >
                                <span className="auth-role-icon">💰</span>
                                <span className="auth-role-label">Donor</span>
                                <span className="auth-role-desc">I want to donate</span>
                            </button>
                            <button
                                type="button"
                                className={`auth-role-btn ${role === 'volunteer' ? 'active' : ''}`}
                                onClick={() => setRole('volunteer')}
                            >
                                <span className="auth-role-icon">🤲</span>
                                <span className="auth-role-label">Volunteer</span>
                                <span className="auth-role-desc">I want to help deliver</span>
                            </button>
                            <button
                                type="button"
                                className={`auth-role-btn ${role === 'organization' ? 'active' : ''}`}
                                onClick={() => setRole('organization')}
                            >
                                <span className="auth-role-icon">🏢</span>
                                <span className="auth-role-label">Organization</span>
                                <span className="auth-role-desc">I represent an NGO</span>
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="auth-name">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">👤</span>
                                    <input
                                        id="auth-name"
                                        type="text"
                                        name="name"
                                        className="auth-input"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="auth-email">Email Address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">✉️</span>
                                <input
                                    id="auth-email"
                                    type="email"
                                    name="email"
                                    className="auth-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="auth-password">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    id="auth-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="auth-input"
                                    placeholder={isSignup ? 'Create a password (min 6 chars)' : 'Enter your password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={isSignup ? 6 : undefined}
                                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {isSignup && (
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="auth-phone">Phone Number <span className="auth-optional">(Optional)</span></label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">📱</span>
                                    <input
                                        id="auth-phone"
                                        type="tel"
                                        name="phone"
                                        className="auth-input"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-spinner"></span>
                            ) : (
                                isSignup ? 'Create Account' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="auth-toggle">
                        <span className="auth-toggle-text">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}
                        </span>
                        <button
                            type="button"
                            className="auth-toggle-btn"
                            onClick={toggleMode}
                        >
                            {isSignup ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
