import { useCallback, useEffect, useRef, useState } from 'react';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useBidManager } from '../hooks/useBidManager.js';

import Modal from './Modal.js';

import './styles/bid-list.css';

const BidList = ({ storeID }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAdmin } = useUserAuth();
    const { bookings } = useStoreManager();
    const { bids, fetchBids, isFetchingBids, acceptBid, isLoaded } = useBidManager();
    const selectedBid = useRef();

    const bidsForStore = bids.filter((bid) => bid.store_id === Number(storeID));
    const conflictCount = selectedBid.current
        ? bidsForStore.reduce((count, bid) => {
            const { start_date, end_date, id } = bid;
            const isConflict = id !== selectedBid.current.id && (
                new Date(start_date) <= new Date(selectedBid.current.start_date) && new Date(selectedBid.current.start_date) <= new Date(end_date) ||
                new Date(start_date) <= new Date(selectedBid.current.end_date) && new Date(selectedBid.current.end_date) <= new Date(end_date)
            );
            return isConflict ? count + 1 : count;
        }, 0)
        : 0;

    useEffect(() => {
        if (isAdmin && !isLoaded) {
            fetchBids();
        }
    }, [isAdmin, isLoaded]);

    const toggleModal = useCallback(() => {
        setIsModalOpen((prev) => !prev);
    }, []);

    const handleAcceptClick = (bid) => {
        selectedBid.current = bid;
        toggleModal();
    };
    
    const handleAccept = useCallback(async (bidID) => {
        return await acceptBid({ bidID });
    }, [acceptBid]);

    const handleAcceptComplete = useCallback(() => {
        toggleModal();
        fetchBids();
        selectedBid.current = null;
    }, []);

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
                            <button className="primary" onClick={() => handleAcceptClick(bid)}>Accept Booking</button>
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
            <Modal
                action={handleAccept}
                classname="bid-modal"
                input={selectedBid.current?.id}
                onCancel={toggleModal}
                onComplete={handleAcceptComplete}
                title="Accept Bid"
                isOpen={isModalOpen}
            >
                <p>{`About to accept bid from ${selectedBid.current?.user_name} from ${renderDate(selectedBid.current?.start_date)} to ${renderDate(selectedBid.current?.end_date)}`}</p>
                {conflictCount > 0 && <p>{`It is conflicting with ${conflictCount} other applications.`}</p>}
            </Modal>
        </div>
    );
};

export default BidList;