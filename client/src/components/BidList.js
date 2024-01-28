import { useCallback, useEffect, useState } from 'react';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useBidManager } from '../hooks/useBidManager.js';

import './styles/bid-list.css';

const BidList = () => {
    const { isAdmin } = useUserAuth();
    const { bookings } = useStoreManager();
    const { bids, fetchBids, isFetchingBids, acceptBid, isLoaded } = useBidManager();

    useEffect(() => {
        if (isAdmin && !isLoaded) {
            fetchBids();
        }
    }, [isAdmin, isLoaded]);

    const handleAccept = async (bidID) => {
        await acceptBid({ bidID });
    };

    const renderStoreBookings = () =>
        bids.length
            ? bids.map((bid) => {
                const { id, pfp, user_name, user_id, start_date, end_date, timestamp, desc, message } = bid;
                return (
                    <div className="bid-card-container" key={id}>
                        <div className="profile-pic one" />
                        <div className="bid-content">
                            <p>Applicant: {user_name}</p>
                            <p>From {renderDate(start_date)} to {renderDate(end_date)}</p>
                            <p>{desc}</p>
                            <p>{message}</p>
                            <button onClick={() => handleAccept(id)}>Accept Booking</button>
                        </div>
                    </div>
                )
            })
            : (
                <div>No pending application for this store.</div>
            )

    return (
        <div className="bid-list-container">
            {isFetchingBids && 'Loading...'}
            {renderStoreBookings()}
        </div>
    );
};

export default BidList;