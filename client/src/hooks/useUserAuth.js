import { useCallback, useState } from 'react';

import { useAuthContext } from './useAuthContext.js';
import useHttpRequest from './useHttpRequest.js';

const NAME_REGEX = /^[a-zA-Z ]+$/;
const USERNAME_REGEX = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const useUserAuth = () => {
    const [error, setError] = useState(null);
    const { user, dispatch } = useAuthContext();

    const handleUserAuth = useCallback((user) => {
        // Save user to localstorage
        localStorage.setItem('user', JSON.stringify(user));

        // Update AuthContext
        dispatch({
            type: 'LOGIN',
            payload: user,
        });
    }, []);

    const handleLogout = useCallback(() => {
        // Remove user from localstorage
        localStorage.removeItem('user');

        // Update AuthContext
        dispatch({ type: 'LOGOUT' });
    }, []);

    const validateLogin = useCallback((data) => {
        console.log('QA: validate login', data)
        if (!data) return 'No data submitted';
        if (!data.username) return 'username is required.';
        if (!USERNAME_REGEX.test(data.username)) return 'username should only contain letters, numbers, . and _, and be 5 to 20 characters long.';
        if (!data.password) return 'password is required.';
        if (!PASSWORD_REGEX.test(data.password)) return 'password must have at least 1 number & 1 special character, and be 6 to 16 characters long.';

        return null;
    }, []);
    
    const validateSignup = useCallback((data) => {
        const result = validateLogin(data);
        if (result) return result;
        if (!NAME_REGEX.test(data.name)) return 'name should only contain letters and spaces';

        return null;
    }, [validateLogin]);

    const { makeRequest: login, isLoading: isLoggingIn } = useHttpRequest({
        dataValidation: validateLogin,
        method: 'POST',
        onError: setError,
        onSuccess: handleUserAuth,
        url: '/api/login',
    });
    
    const { makeRequest: signup, isLoading: isSigningUp } = useHttpRequest({
        dataValidation: validateSignup,
        method: 'POST',
        onError: setError,
        onSuccess: handleUserAuth,
        url: '/api/signup',
    });

    const { makeRequest: logout, error: logoutError } = useHttpRequest({
        onError: setError,
        onSuccess: handleLogout,
        url: '/api/logout',
    }); 

    return {
        error,
        isLoading: isLoggingIn || isSigningUp,
        login,
        logout,
        signup,
        user,
    };
};