import { createContext, useCallback, useEffect, useReducer } from "react";

export const DataContext = createContext();

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'STORE.SET':
            return {
                ...state,
                stores: action.payload,
            };
        case 'STORE.ADD':
            return {
                ...state,
                stores: [action.payload, ...state.stores],
            };
        case 'STORE.REMOVE':
            return {
                ...state,
                stores: state.stores.filter((store) => store.id !== Number(action.payload)),
            };
        case 'BOOKING.SET':
            return {
                ...state,
                bookings: action.payload,
            };
        case 'BOOKING.ADD':
            return {
                ...state,
                bookings: [action.payload, ...state.bookings],
            };
        case 'USER.SET':
            return {
                ...state,
                users: action.payload,
            };
        case 'USER.REMOVE':
            return {
                ...state,
                users: state.users.filter((user) => user.id !== action.payload.id),
            };
        case 'LOADED.SET':
            return {
                ...state,
                isLoaded: true,
            }
        default:
            return state;
    }
}

export const DataProvider = ({ children }) => {
    const [state, dataDispatch] = useReducer(dataReducer, {
        bookings: [],
        isLoaded: false,
        stores: [],
        users: [],
    });

    return (
        <DataContext.Provider value={{ ...state, dataDispatch }}>
            { children }
        </DataContext.Provider>
    );
};