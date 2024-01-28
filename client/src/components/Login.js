import { useCallback, useEffect, useState } from 'react';

import { useUserAuth } from '../hooks/useUserAuth.js';

import './styles/login.css';

const SIGNUP_FIELDS = [
    { name: 'name', label: 'Name' },
    { name: 'username', label: 'Username' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'pfp', label: 'Profile Picture', defaultValue: 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE' },
];

const LOGIN_FIELDS = [
    { name: 'username', label: 'Username' },
    { name: 'password', label: 'Password', type: 'password' },
];

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const { error: authError, login, logout, signup, user } = useUserAuth();

    useEffect(() => {
        // Set errorMessage when authError changes.
        if (authError?.message) {
            setErrorMessage(authError.message);
        }
    }, [authError]);

    useEffect(() => {
        // Reset errorMessage when form is updated.
        setErrorMessage('');
    }, [isSignup, formData]);

    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        const name = e.target.name;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    }, []);

    const toggleSignup = useCallback((e) => {
        e.preventDefault();

        setIsSignup((prevValue) => !prevValue);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isSuccess = await (isSignup ? signup : login)(formData);
        if (isSuccess) setFormData({});
    };

    const handleLogout = async (e) => {
        e.preventDefault();

        logout();
    }

    return (
        <form className='user-auth-form' onSubmit={handleSubmit}>
            <h4>Welcome to the Greatest Metaverse Mall</h4>
            { user && (
                <div>Logged in as: {user.name}</div>
            )}
            {!user && (isSignup ? SIGNUP_FIELDS : LOGIN_FIELDS).map(({ name, label, type, defaultValue = '' }) => (
                <div key={name}>
                    <label>{label}</label>
                    <input
                        name={name}
                        onChange={handleChange}
                        type={type || 'text'}
                        value={formData[name] || defaultValue}
                    />
                </div>
            ))}

            <p>{errorMessage}</p>

            {user
                ? <button onClick={handleLogout}>Log out</button>
                : (
                    <>
                        <button onClick={toggleSignup}>
                            { isSignup ? 'Back to login' : 'Sign up' }
                        </button>
                        <button type="submit">
                            { isSignup ? 'Sign up' : 'Log in' }
                        </button>
                    </>
                )
            }
        </form>
    );
};

export default Login;