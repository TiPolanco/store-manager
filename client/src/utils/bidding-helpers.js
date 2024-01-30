
export const isConflict = (a, b) => {
    // check if both exist and not the same
    if (!a || !b || a === b) return false;

    // check store id is the same
    const storeIDA = a.store_id || a.storeID;
    const storeIDB = b.store_id || b.storeID;
    if (storeIDA !== storeIDB) return false;

    // check start date and end date overlaps
    const startDateA = new Date (a.start_date || a.startDate);
    const endDateA = new Date (a.end_date || a.endDate);
    const startDateB = new Date(b.start_date || b.startDate);
    const endDateB = new Date(b.end_date || b.endDate);
    
    // If startDateB fulls between startDateA and endDateA
    return (startDateA <= startDateB && startDateB <= endDateA) ||
        // Or endDateB fulls between startDateA and endDateA
        (startDateA <= endDateB && endDateB <= endDateA) ||
        // or b contians a
        (startDateB <= startDateA && endDateA <= endDateB);
}

// Need to memoize this function
export const getConflicts = (existingBids, newBid) => newBid
    ? existingBids.reduce((conflicts, existingBid) => {
        if (isConflict(existingBid, newBid)) {
            conflicts.push(existingBid);
        }
        return conflicts;
    }, [])
    : [];

