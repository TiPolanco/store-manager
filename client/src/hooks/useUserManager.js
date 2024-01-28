import { useEffect, useState } from 'react';

import useHttpRequest from './useHttpRequest.js';
import { useDataContext } from './useDataContext.js';

export const useUserManager = () => {
    const [error, setError] = useState(null);
    const { users, setUsers, removeUser } = useDataContext();

    useEffect(() => {
        fetchUsers();
    }, []);

    const { makeRequest: fetchUsers, isLoading: isFetchingUsers } = useHttpRequest({
        onError: setError,
        onSuccess: setUsers,
        url: '/api/users',
    });
    
    const { makeRequest: banUser, isLoading: isBanningUser } = useHttpRequest({
        method: 'DELETE',
        onError: setError,
        onSuccess: removeUser,
        url: '/api/users',
    });

    return {
        banUser,
        error,
        fetchUsers,
        isBanningUser,
        isFetchingUsers,
        users,
    };
};