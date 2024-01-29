import { useState } from 'react';
import DatePicker from "react-datepicker";

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';
import { renderDate } from '../utils/data-format-helpers.js';

import "react-datepicker/dist/react-datepicker.css";

const addDays = (date, days) => new Date(date.valueOf() + (1000 * 60 * 60 * 24 * days));

const MMDatePicker = ({ storeID, setFormData, startDate = null, endDate = null, storeBookings }) => {
    const excludeDates = storeBookings.reduce((dates, booking) => {
        const { start_date, end_date } = booking;
        
        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays(currentDate, 1);
        }

        return dates;
    }, []);

    const maxDate = Boolean(startDate) && excludeDates.length && startDate < excludeDates[excludeDates.length - 1]
        ? addDays(excludeDates.find(date => date > startDate), -1)
        : null;

    const handleChange = ([start, end]) => {
        setFormData((prevValue) => ({
            ...prevValue,
            startDate: start,
            endDate: end,
        }));
    };

    return (
        <div className="form-input-group">
            <label>Select Date Range</label>
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                excludeDates={excludeDates}
                minDate={addDays(new Date(), 1)}
                maxDate={maxDate}
                selectsDisabledDaysInRange
                withPortal
            />
        </div>
    );
};

export default MMDatePicker;