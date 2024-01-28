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
        
        return (
            <div className="renter-bookings-container">
                {!userBookings.length && (
                    <div className="renter-booking-item">
                        No Bookings
                    </div>
                )}
                {userBookings.map(({ id, store_name, start_date, end_date }) => (
                    <div className="renter-booking-item" key={id}>
                        Booked { store_name } from { renderDate(start_date) } to { renderDate(end_date) }
                    </div>
                ))}
            </div>
        )
    }

    const renderUsers = () => (
        <div className="user-list-container">
            {users.map(({ id, name, username, pfp }) => (
                <div
                    className="user-item-container"
                    key={id}
                >
                    <div className="user-content">
                        <div className="profile-pic one" />
                        <h4>{name}</h4>
                        <p>{username}</p>
                        <button onClick={() => removeUser(id)}>Ban this user</button>
                    </div>
                    {renderBookingsForUserID(id)}
                </div>
            ))}
        </div>
    );

    return (
        <div className="user-view-container">
            {
                isFetchingUsers && 'Loading...'
            }
            {renderUsers()}
        </div>
    );
};

export default UserList;