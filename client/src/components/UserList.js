import { useCallback, useEffect, useRef, useState } from 'react';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';
import { useUserManager } from '../hooks/useUserManager.js';

import Modal from './Modal.js';

import './styles/user-list.css';

const UserList = () => {
    const selectedUser = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAdmin } = useUserAuth();
    const { bookings } = useStoreManager();
    const { users, banUser, isFetchingUsers } = useUserManager();

    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev);
    }, []);

    const handleDeleteClick = (user) => {
        selectedUser.current = user;
        toggleModal();
    }

    const removeUser = useCallback(async (userID) => {
        if (!isAdmin) return;

        return await banUser(userID);
    }, [banUser, isAdmin]);

    const handleRemoveComplete = useCallback(() => {
        selectedUser.current = null;
        toggleModal();
    }, []);

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
                <button lassnam onClick={() => handleDeleteClick({ id, name })}>Ban</button>
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
            <Modal
                action={removeUser}
                classname="delete-user-modal"
                input={selectedUser.current?.id}
                onCancel={toggleModal}
                onComplete={toggleModal}
                title="Ban User"
                isOpen={isModalOpen}
            >
                <p>{`About to ban user ${selectedUser.current?.name}.`}</p>
                <p>Are you sure?</p>
            </Modal>
        </div>
    );
};

export default UserList;