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
            <h3>#{storeID} - {store.name}</h3>
            <p>{store.desc}</p>
            <AuthWrapper requiredRoles={[1]}>
                <button onClick={removeStore}>Delete</button>
            </AuthWrapper>
        </>
    );

    const renderStoreBookings = () =>
        storeBookings.length
            ? storeBookings.map((booking) => {
                const { id, pfp, user_name, user_id, start_date, end_date, timestamp, desc } = booking;
                const isOwnBooking = user_id === user?.id;
                const isCancelable = isOwnBooking && (new Date(start_date) > Date.now());
                return (
                    <div className="booking-card-container" key={id}>
                        <div className="profile-pic one" />
                        <div className="booking-content">
                            <p>Booked by: {user_name}</p>
                            <p>From {renderDate(start_date)} to {renderDate(end_date)}</p>
                            <p>{desc}</p>
                            {isOwnBooking && <p>Confirmed at: {renderDate(timestamp)}</p>}
                            {isCancelable && <p>If you which to cancel, please contact the support team.</p>}
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
                        <div className="booking-form-input-group">
                            <label>Start Date</label>
                            <input
                                name="startDate"
                                onChange={handleChange}
                                type="date"
                            />
                        </div>
                        <div className="booking-form-input-group">
                            <label>End Date</label>
                            <input
                                name="endDate"
                                onChange={handleChange}
                                type="date"
                            />
                        </div>
                        <div className="booking-form-input-group">
                            <label>Description</label>
                            <textarea
                                name="desc"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="booking-form-input-group">
                            <label>Message to the store manager</label>
                            <textarea
                                name="message"
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <button onClick={toggleIsBooking}>{message ? 'Back' : 'Cancel'}</button>
                {!message && <button type="submit">Submit</button>}
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
                    Booking Schedules
                </div>
                <div className="store-bookings-btn">
                    {isLoggedIn && !isBooking && <button onClick={toggleIsBooking}>Apply</button>}
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
                <BidList />
            </AuthWrapper>
        </div>
    )
};

export default StoreDetail;