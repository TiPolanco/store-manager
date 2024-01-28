import { useCallback, useEffect, useState } from 'react';

import useHttpRequest from './useHttpRequest.js';
import { useDataContext } from './useDataContext.js';

export const useBidManager = () => {
    const [error, setError] = useState(null);
    const { bids, setBids } = useDataContext();

    const { makeRequest: fetchBids, isLoading: isFetchingBids } = useHttpRequest({
        onError: setError,
        onSuccess: setBids,
        url: '/api/stores/bids',
    });

    const refreshBids = useCallback(() => {
        fetchBids();
    }, [fetchBids]);

    const { makeRequest: createBid, isLoading: isCreatingBid } = useHttpRequest({
        method: 'POST',
        onError: setError,
        url: '/api/stores/bids',
    });

    return {
        bids,
        createBid,
        error,
        fetchBids,
        isCreatingBid,
        isFetchingBids,
    };
};