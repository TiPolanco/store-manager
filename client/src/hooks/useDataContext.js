import { useCallback, useContext } from "react";

import { DataContext } from "../context/DataContext.js";

export const useDataContext = () => {
    const context = useContext(DataContext);

    if (!context) {
        throw Error('useDataContext must be used inside an DataProvider');
    }

    const { dataDispatch } = context;
    // Add Actions
    const setStores = useCallback((stores) => dataDispatch({ type: 'STORE.SET', payload: stores }), []);
    const addStore = useCallback((store) => dataDispatch({ type: 'STORE.ADD', payload: store }), []);
    const removeStore = useCallback((id) => dataDispatch({ type: 'STORE.REMOVE', payload: id }), []);

    const setBookings = useCallback((bookings) => dataDispatch({ type: 'BOOKING.SET', payload: bookings }), []);
    const addBooking = useCallback((booking) => dataDispatch({ type: 'BOOKING.ADD', payload: booking }), []);

    const setUsers = useCallback((users) => dataDispatch({ type: 'USER.SET', payload: users }), []);
    const removeUser = useCallback((userID) => dataDispatch({ type: 'USER.REMOVE', payload: userID }), []);

    const setBids = useCallback((bids) => dataDispatch({ type: 'BID.SET', payload: bids }), []);

    const setLoaded = useCallback(() => dataDispatch({ type: 'LOADED.SET' }), []);

    return {
        ...context,
        addBooking,
        addStore,
        removeStore,
        removeUser,
        setBookings,
        setLoaded,
        setStores,
        setUsers,
    };
}