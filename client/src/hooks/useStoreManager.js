import { useEffect, useCallback, useState } from 'react';

import useHttpRequest from './useHttpRequest.js';
import { useDataContext } from './useDataContext.js';

export const useStoreManager = () => {
    const [error, setError] = useState(null);
    const {
        addBooking,
        addStore,
        bookings,
        isLoaded,
        removeStore,
        setBookings,
        setLoaded,
        setStores,
        stores,
    } = useDataContext();

    useEffect(() => {
        // Initial Data Fetch
        if (!isLoaded) {
            setLoaded();
            fetchStores();
            fetchBookings();
        }
    }, []);

    // Stores
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

    const { makeRequest: createStore, isLoading: isCreatingStore } = useHttpRequest({
        dataValidation: validateStore,
        method: 'POST',
        onError: setError,
        onSuccess: addStore,
        url: '/api/stores',
    });
    
    const { makeRequest: deleteStore, isLoading: isDeletingStore } = useHttpRequest({
        method: 'DELETE',
        onError: setError,
        onSuccess: removeStore,
        url: '/api/stores',
    });

    // Bookings
    const { makeRequest: fetchBookings, isLoading: isFetchingBookings } = useHttpRequest({
        onError: setError,
        onSuccess: setBookings,
        url: '/api/stores/bookings',
    });

    const getBookingsFromStoreID = useCallback((storeID) =>
        bookings.filter(booking => booking.store_id === Number(storeID))
    , [bookings]);

    return {
        bookings,
        createStore,
        deleteStore,
        error,
        fetchBookings,
        fetchStores,
        getBookingsFromStoreID,
        isCreatingStore,
        isDeletingStore,
        isFetchingBookings,
        isFetchingStores,
        stores,
    };
};