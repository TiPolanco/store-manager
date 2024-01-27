import dbPool from '../database/db.js';
import auth from '../middleware/auth.js';
import permission, { STORE_CREATE, STORE_EDIT } from '../middleware/permission.js';

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
};