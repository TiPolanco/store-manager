import { useCallback, useEffect, useState } from 'react';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useBidManager } from '../hooks/useBidManager.js';

import './styles/bid-list.css';

const BidList = ({ storeID }) => {
    const { isAdmin } = useUserAuth();
    const { bookings } = useStoreManager();
    const { bids, fetchBids, isFetchingBids, acceptBid, isLoaded } = useBidManager();
    const bidsForStore = bids.filter((bid) => bid.store_id === Number(storeID));

    useEffect(() => {
        if (isAdmin && !isLoaded) {
            fetchBids();
        }
    }, [isAdmin, isLoaded]);

    const handleAccept = async (bidID) => {
        await acceptBid({ bidID });
    };

    const renderStoreBookings = () =>
        bidsForStore.length
            ? bidsForStore.map((bid) => {
                const { id, pfp = 'punk', user_name, user_id, start_date, end_date, timestamp, desc, message } = bid;
                return (
                    <div className="bid-card-container" key={id}>
                        <div className={`profile-pic ${pfp}`} />
                        <div className="bid-content">
                            <h2>{desc}</h2>
                            <p>From {renderDate(start_date)} to {renderDate(end_date)}</p>
                            <p>{message}</p>
                            <p>Applicant: {user_name}</p>
                            <button className="primary" onClick={() => handleAccept(id)}>Accept Booking</button>
                        </div>
                    </div>
                )
            })
            : (
                <div>No pending application for this store.</div>
            )

    return (
        <div className="bid-list-container">
            <div className="store-bookings-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="store-bookings-header">
                    Pending Applications
                </div>
            </div>
            {isFetchingBids && 'Loading...'}
            {renderStoreBookings()}
        </div>
    );
};

export default BidList;