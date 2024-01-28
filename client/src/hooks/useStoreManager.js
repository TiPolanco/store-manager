import { useCallback, useState } from 'react';

import useHttpRequest from './useHttpRequest.js';

export const useStoreManager = () => {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);

    const { makeRequest: fetchStores, isLoading: isFetchingStores } = useHttpRequest({
        onError: setError,
        onSuccess: setStores,
        url: '/api/stores',
    });

    const validateStore = useCallback((data) => {
        if (!data) return 'No data is submitted';
        if (!data.name || typeof data.name !== 'string') return 'Invalid store name';
        if (!data.desc || typeof data.desc !== 'string') return 'Invalid store description';

        return null;
    }, []);

    const insertNewStore = useCallback((newStore) => {
        setStores((existingStores) => [newStore, ...existingStores]);
    }, []);

    const { makeRequest: createStore, isLoading: isCreatingStores } = useHttpRequest({
        dataValidation: validateStore,
        method: 'POST',
        onError: setError,
        onSuccess: insertNewStore,
        url: '/api/stores',
    });

    return {
        createStore,
        error,
        fetchStores,
        isCreatingStores,
        isFetchingStores,
        stores,
    };
};