import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import AuthWrapper from '../utils/AuthWrapper.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { useBidManager } from '../hooks/useBidManager.js';

import BidList from './BidList.js';

import './styles/store-detail.css';

const StoreDetail = () => {
    const [formData, setFormData] = useState({});
    const [isBooking, setIsBooking] = useState(false);
    const [message, setMessage] = useState('');
    const { storeID } = useParams();
    const { stores, getBookingsFromStoreID, deleteStore } = useStoreManager();
    const { createBid } = useBidManager();
    const { isLoggedIn, isAdmin, user } = useUserAuth();

    const store = stores.find(({ id }) => id === Number(storeID));
    const storeBookings = getBookingsFromStoreID(storeID);

    const removeStore = useCallback(() => {
        if (!isAdmin) return;

        deleteStore(storeID);
    }, [deleteStore, isAdmin, storeID]);

    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        const name = e.target.name;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    }, []);

    const toggleIsBooking = useCallback((e) => {
        e.preventDefault();

        setIsBooking(prevValue => !prevValue);
        setMessage('');
    }, []);

    const submitBid = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;

        const isSuccess = await createBid({
            ...formData,
            userID: user?.id,
            storeID: Number(storeID),
        });

        if (isSuccess) {
            setFormData({});
            setMessage('Application submitted successfully!');
        }
    };

    const renderStoreDetail = () => (
        <>
            <div className="mm-image store" />
            <div className="store-display-content">
                <h3>{store.name}</h3>
                <p>{store.desc}</p>
                <AuthWrapper requiredRoles={[1]}>
                    <button className="secondary" onClick={removeStore}>Delete</button>
                </AuthWrapper>
            </div>
        </>
    );

    const renderStoreBookings = () =>
        storeBookings.length
            ? storeBookings.map((booking) => {
                const { id, pfp = 'punk', user_name, user_id, start_date, end_date, timestamp, desc } = booking;
                const isOwnBooking = user_id === user?.id;
                const isCancelable = isOwnBooking && (new Date(start_date) > Date.now());
                return (
                    <div className="booking-card-container" key={id}>
                        <div className={`profile-pic ${pfp}`} />
                        <div className="booking-content">
                            <h2>{desc}</h2>
                            <p style={{ fontStyle: 'italic' }}><strong>From {renderDate(start_date)} to {renderDate(end_date)}</strong></p>
                            <p>Operated by: {isOwnBooking ? 'You' : user_name}</p>
                            {isOwnBooking && <p style={{ fontSize: '13px' }}>Confirmed at: {renderDate(timestamp)}</p>}
                            {isCancelable && <p style={{ fontSize: '13px' }}>If you which to cancel, please contact the support team.</p>}
                        </div>
                    </div>
                )
            })
            : (
                <div>No Bookings for this store.</div>
            )

    const renderNewBid = () => (
        <div className="booking-form-container">
            <form className="booking-form" onSubmit={submitBid}>
                <h4>Apply for {store?.name || store}</h4>

                {message && <p>{message}</p>}
                {!message && (
                    <>
                        <div className="form-input-group">
                            <label>Start Date</label>
                            <input
                                name="startDate"
                                onChange={handleChange}
                                type="date"
                            />
                        </div>
                        <div className="form-input-group">
                            <label>End Date</label>
                            <input
                                name="endDate"
                                onChange={handleChange}
                                type="date"
                            />
                        </div>
                        <div className="form-input-group">
                            <label>Description</label>
                            <textarea
                                name="desc"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-input-group">
                            <label>Message to the store manager</label>
                            <textarea
                                name="message"
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <button className="secondary" onClick={toggleIsBooking}>{message ? 'Back' : 'Cancel'}</button>
                {!message && <button className="primary" type="submit">Submit</button>}
            </form>
        </div>
    );

    return (
        <div className="store-detail-container">
            <div className="store-detail-display">
                {!store
                    ? 'The selected store no longer exist'
                    : renderStoreDetail()
                }
            </div>
            <div className="store-bookings-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="store-bookings-header">
                    Store Schedule
                </div>
                <div className="store-bookings-btn">
                    {isLoggedIn && !isBooking && <button className="primary" onClick={toggleIsBooking}>Apply</button>}
                </div>
            </div>
            {isBooking
                ? (
                    <div className="store-detail-booking">
                        {renderNewBid()}
                    </div>
                )
                : (
                    <div className="store-detail-shcedule">
                        {renderStoreBookings()}
                    </div>
                )
            }
            <AuthWrapper requiredRoles={[1]}>
                <BidList storeID={storeID} />
            </AuthWrapper>
        </div>
    )
};

export default StoreDetail;