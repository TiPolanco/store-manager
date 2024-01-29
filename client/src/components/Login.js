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

const PFPS = ['punk', 'ape-1', 'ape-2', 'ape-3', 'azuki-1', 'azuki-2', 'beanz-1', 'doodles-1', 'doodles-2', 'coolcat-1'];

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ pfp: PFPS[Math.floor(Math.random() * 10)] });
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

    const selectPFP = (pfp) => {
        setFormData((prevData) => ({
            ...prevData,
            pfp,
        }));
    }

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
                <div className="profile-display">
                    <div className={`profile-pic ${user.pfp}`} />
                    <div>Logged in as: {user.name}</div>
                    <div>{user.role === 1 ? 'Admin' : 'Business'} User</div>
                </div>
            )}
            {!user && (isSignup ? SIGNUP_FIELDS : LOGIN_FIELDS).map(({ name, label, type, defaultValue = '' }) => (
                <div className="form-input-group" key={name}>
                    <label>{label}</label>
                    {name !== 'pfp'
                        ? (
                            <input
                                name={name}
                                onChange={handleChange}
                                type={type || 'text'}
                                value={formData[name] || defaultValue}
                            />
                        )
                        : (
                            <div className="pdp-selector-container">
                                {PFPS.map((pfp) => (
                                    <div
                                        key={pfp}
                                        onClick={() => selectPFP(pfp)}
                                        className={`profile-pic ${pfp} ${formData.pfp === pfp ? 'selected' : ''}`}
                                    />
                                ))}
                            </div>
                        )
                    }
                    
                </div>
            ))}

            <p>{errorMessage}</p>

            <div className="form-btn-group">
                {user
                    ? <button onClick={handleLogout}>Log out</button>
                    : (
                        <>
                            <button className='secondary' onClick={toggleSignup}>
                                { isSignup ? 'Back' : 'Sign up' }
                            </button>
                            <button className="primary" type="submit">
                                { isSignup ? 'Sign up' : 'Log in' }
                            </button>
                        </>
                    )
                }
            </div>
        </form>
    );
};

export default Login;