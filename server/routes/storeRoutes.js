import dbPool from '../database/db.js';
import auth from '../middleware/auth.js';
import permission, { BOOKING_CREATE, STORE_CREATE, STORE_EDIT } from '../middleware/permission.js';

const BASE_ROUTE = "/api/stores";

export default function(app) {
    // List all active stores
    // Accessible to everyone
    app.get(BASE_ROUTE, async (req, res) => {
        try {
            const { rows } = await dbPool.query(`
                SELECT * FROM public."Store"
                WHERE active = true
                ORDER BY id ASC
            `);
            res.json(rows);
        } catch (err) {
            res.status(500).json(err);
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
    
            res.status(201).json(rows[0]);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // Remove a store
    // Requires STORE_EDIT permission
    app.delete(`${BASE_ROUTE}/:storeId`, auth, permission(STORE_EDIT), (req, res) => {
        const storeID = req.params.storeId;

        try {
            dbPool.query(`
                UPDATE public."Store" SET active = false
                    WHERE id = ${storeID} AND active = true
                    RETURNING id, name, "desc"
            `);
            res.sendStatus(202);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // Bookings
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
            res.json(rows);
        } catch (err) {
            res.status(500).json(err);
        }
    });
    
    // Create new booking
    // Requires STORE_CREATE permission
    app.post(`${BASE_ROUTE}/bookings`, auth, permission(BOOKING_CREATE), async (req, res) => {
        const { startDate, endDate, desc, storeID, userID } = req.body;

        console.log({
            startDate: typeof startDate,
        })

        try {
            const { rows: users } = await dbPool.query(`
                SELECT name, pfp FROM public."User" WHERE id = '${userID}' AND active = true
            `);
            if (!users.length) res.status(400).json({ message: `User id ${userID} does not exist.` });
            
            const { rows: stores } = await dbPool.query(`
                SELECT name FROM public."Store" WHERE id = '${storeID}' AND active = true
            `);
            if (!stores.length) res.status(400).json({ message: `Store id ${storeID} does not exist.` });
            console.log('QA: newBookings', users, stores);

            const { rows: newBookings } = await dbPool.query(`
                INSERT INTO public."Bookings"(
                    store_id, user_id, "desc", start_date, end_date, active, "timestamp")
                    VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000.0))
                    RETURNING id, store_id, user_id, "desc", start_date, end_date, "timestamp"
            `, [storeID, userID, desc, startDate, endDate, true]);
            console.log('QA: newBookings', newBookings);

            const data = {
                ...newBookings[0],
                pfp: users[0].pfp,
                store_name: stores[0].name,
                user_name: users[0].name,
            }
    
            res.status(201).json(data);
        } catch (err) {
            console.log('QA: error', err);
            res.status(500).json(err);
        }
    });

};