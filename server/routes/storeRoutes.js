import dbPool from '../database/db.js';
import auth from '../middleware/auth.js';
import permission, {
    BID_ACCEPT,
    BID_CREATE,
    BID_VIEW,
    STORE_CREATE,
    STORE_EDIT,
} from '../middleware/permission.js';

const BASE_ROUTE = "/api/stores";

export default function(app) {
    /***********************************************************************
     * STORE
     ***********************************************************************/
    // List all active stores
    // Accessible to everyone
    app.get(BASE_ROUTE, async (req, res) => {
        try {
            const { rows } = await dbPool.query(`
                SELECT * FROM public."Store"
                WHERE active = true
                ORDER BY id ASC
            `);
            return res.json(rows);
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    // Create new store
    // Requires STORE_CREATE permission
    app.post(BASE_ROUTE, auth, permission(STORE_CREATE), async (req, res) => {
        const { name, desc } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "name is required for store creation",
            });
        }

        try {
            const { rows } = await dbPool.query(`
                INSERT INTO public."Store"(name, "desc")
                    VALUES ($1, $2)
                    RETURNING id, name, "desc"
            `, [name, desc]);
    
            return res.status(201).json(rows[0]);
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    // Remove a store
    // Requires STORE_EDIT permission
    app.delete(`${BASE_ROUTE}/:storeId`, auth, permission(STORE_EDIT), async (req, res) => {
        const storeID = req.params.storeId;

        try {
            const { rows: newStores } = await dbPool.query(`
                UPDATE public."Store" SET active = false
                    WHERE id = ${storeID} AND active = true
                    RETURNING id, name, "desc"
            `);
            return res.status(202).json(newStores[0]);
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    /***********************************************************************
     * BOOKINGS
     ***********************************************************************/
    // List all active bookings
    // Accessible to everyone
    app.get(`${BASE_ROUTE}/bookings`, async (req, res) => {
        try {
            const { rows } = await dbPool.query(`
                SELECT public."Bookings".id, store_id, user_id, public."Bookings".desc, start_date, end_date, public."User".name AS user_name, public."User".pfp, public."Store".name AS store_name, public."Bookings".timestamp
                    FROM (public."Bookings" INNER JOIN public."Store" ON public."Bookings".store_id = public."Store".id) INNER JOIN public."User" on public."User".id = public."Bookings".user_id
                    WHERE public."Bookings".active = true AND public."Store".active = true AND public."User".active = true AND end_date > NOW() 
                    ORDER BY public."Bookings".start_date ASC
            `);
            return res.json(rows);
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    /***********************************************************************
     * BIDDINGS
     ***********************************************************************/
    // List all active bookings
    // Requires BID_VIEW permission
    app.get(`${BASE_ROUTE}/bids`, auth, permission(BID_VIEW), async (req, res) => {
        try {
            const { rows } = await dbPool.query(`
                SELECT public."Biddings".id, store_id, user_id, public."Biddings".desc, public."Biddings".message, start_date, end_date, public."User".name AS user_name, public."User".pfp, public."Store".name AS store_name, public."Biddings".timestamp
                    FROM (public."Biddings" INNER JOIN public."Store" ON public."Biddings".store_id = public."Store".id) INNER JOIN public."User" on public."User".id = public."Biddings".user_id
                    WHERE public."Biddings".active = true AND public."Store".active = true AND public."User".active = true AND end_date > NOW() 
                    ORDER BY public."Biddings".start_date ASC
            `);
            return res.json(rows);
        } catch (err) {
            return res.status(500).json(err);
        }
    });
    
    // Create new booking
    // Requires STORE_CREATE permission
    app.post(`${BASE_ROUTE}/bids`, auth, permission(BID_CREATE), async (req, res) => {
        const { startDate, endDate, desc, message, storeID, userID } = req.body;

        try {
            const { rows: userResults } = await dbPool.query(`
                SELECT EXISTS (SELECT id FROM public."User" WHERE id = ${userID} and active = true)
            `);
            if (!userResults.length || !userResults[0].exists) return res.status(400).json({ message: `User id ${userID} does not exist.` });
            
            const { rows: storeResults } = await dbPool.query(`
                SELECT EXISTS (SELECT id FROM public."Store" WHERE id = ${storeID} and active = true)
            `);
            if (!storeResults.length || !storeResults[0].exists) return res.status(400).json({ message: `Store id ${storeID} does not exist.` });

            const { rows: newBids } = await dbPool.query(`
                INSERT INTO public."Biddings"(
                    store_id, user_id, "desc", message, start_date, end_date, active, "timestamp")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, to_timestamp(${Date.now()} / 1000.0))
                    RETURNING id, store_id, user_id, "desc", message, start_date, end_date, "timestamp"
            `, [storeID, userID, desc, message, startDate, endDate, true]);
    
            return res.status(201).json(newBids[0]);
        } catch (err) {
            return res.status(500).json(err);
        }
    });

    // Create new booking from bid
    // Requires BID_ACCEPT permission
    app.put(`${BASE_ROUTE}/bids`, auth, permission(BID_ACCEPT), async (req, res) => {
        const { bidID } = req.body;

        try {
            const { rows: updatedBids } = await dbPool.query(`
                UPDATE public."Biddings" SET active = false
                    WHERE id = ${bidID} AND active = true
                    RETURNING store_id, user_id, "desc", start_date, end_date
            `);
            if (!updatedBids.length) return res.status(400).json({ message: `Bid is not found.` });
            const { user_id, store_id, desc, start_date, end_date } = updatedBids[0];

            const { rows: users } = await dbPool.query(`
                SELECT name, pfp FROM public."User" WHERE id = '${user_id}' AND active = true
            `);
            if (!users.length) return res.status(400).json({ message: `User id ${user_id} does not exist.` });
            
            const { rows: stores } = await dbPool.query(`
                SELECT name FROM public."Store" WHERE id = '${store_id}' AND active = true
            `);
            if (!stores.length) return res.status(400).json({ message: `Store id ${store_id} does not exist.` });

            const { rows: newBookings } = await dbPool.query(`
                INSERT INTO public."Bookings"(
                    store_id, user_id, "desc", start_date, end_date, active, "timestamp")
                    VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000.0))
                    RETURNING id, store_id, user_id, "desc", start_date, end_date, "timestamp"
            `, [store_id, user_id, desc, start_date, end_date, true]);

            const data = {
                ...newBookings[0],
                pfp: users[0].pfp,
                store_name: stores[0].name,
                user_name: users[0].name,
            }
    
            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json(err);
        }
    });
};