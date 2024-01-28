import { useCallback, useEffect, useState } from 'react';

import useHttpRequest from './useHttpRequest.js';
import { useDataContext } from './useDataContext.js';

export const useBidManager = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { bids, setBids, addBooking } = useDataContext();

    const { makeRequest: fetchBids, isLoading: isFetchingBids } = useHttpRequest({
        onError: setError,
        onSuccess: (bids) => {
            setIsLoaded(true);
            setBids(bids);
        },
        url: '/api/stores/bids',
    });

    const refreshBids = useCallback((newBooking) => {
        fetchBids();
        addBooking(newBooking);
    }, [fetchBids]);

    const { makeRequest: createBid, isLoading: isCreatingBid } = useHttpRequest({
        method: 'POST',
        onError: setError,
        url: '/api/stores/bids',
    });

    const { makeRequest: acceptBid, isLoading: isAcceptingBid } = useHttpRequest({
        method: 'PUT',
        onError: setError,
        onSuccess: refreshBids,
        url: '/api/stores/bids',
    });

    return {
        acceptBid,
        bids,
        createBid,
        error,
        fetchBids,
        isAcceptingBid,
        isCreatingBid,
        isFetchingBids,
    };
};