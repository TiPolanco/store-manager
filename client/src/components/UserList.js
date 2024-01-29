import { useCallback, useEffect, useState } from 'react';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useUserManager } from '../hooks/useUserManager.js';

import './styles/user-list.css';

const UserList = () => {
    const { isAdmin } = useUserAuth();
    const { bookings } = useStoreManager();
    const { users, banUser, isFetchingUsers } = useUserManager();

    const removeUser = useCallback((userID) => {
        if (!isAdmin) return;

        banUser(userID);
    }, [banUser, isAdmin]);

    const renderBookingsForUserID = (userID) => {
        const userBookings = bookings.filter(booking => booking.user_id === userID);
        const bookingCount = userBookings.length;
        
        return (
            <div className="user-bookings-container">
                <div className={`user-booking-item ${bookingCount === 0 ? 'empty' : ''}`}>
                    {bookingCount === 0 ? 'No Booking' : `${bookingCount} booking${bookingCount > 1 ? 's' : ''}`}
                </div>
            </div>
        )
    }

    const renderUsers = () =>
        users.map(({ id, name, username, pfp = 'punk' }) => (
            <div
                className="user-item-container"
                key={id}
            >
                <div className="user-content">
                    <div className={`profile-pic ${pfp}`} />
                    <h4>{name} <span>{username}</span></h4>
                </div>
                {renderBookingsForUserID(id)}
                <button lassnam onClick={() => removeUser(id)}>Ban</button>
            </div>
        ));

    return (
        <div className="user-view-container">
            {
                isFetchingUsers && 'Loading...'
            }
            <div className="user-list-container">
                {renderUsers()}
            </div>
        </div>
    );
};

export default UserList;