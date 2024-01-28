import dbPool from '../database/db.js';
import auth from '../middleware/auth.js';
import permission, { USER_EDIT, USER_VIEW } from '../middleware/permission.js';

const BASE_ROUTE = "/api/users";

export default function(app) {
    // List all users
    // Requires USER_VIEW permission
    app.get(BASE_ROUTE, auth, permission(USER_VIEW), async (req, res) => {
        try {
            const { rows } = await dbPool.query('SELECT * FROM public."User" WHERE active = true AND role > 1');
            res.json(rows);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // Update a user
    // Requires USER_EDIT permission
    app.put(`${BASE_ROUTE}/:userId`, auth, permission(USER_EDIT), async (req, res) => {
        const userID = req.params.userId;
        const { name, pfp } = req.body;

        try {
            const { rows } = await dbPool.query(`
                UPDATE public."User" SET name = $1, pfp = $2
                    WHERE id = ${userID}
                    RETURNING id, name, role, pfp
            `, [name, pfp]);
            res.status(201).json(rows);
        } catch (err) {
            res.status(500).json(err);
        }
    });
    
    // Delete a user
    // Requires USER_EDIT permission
    app.delete(`${BASE_ROUTE}/:userId`, auth, permission(USER_EDIT), async (req, res) => {
        const userID = req.params.userId;

        try {
            await dbPool.query(`
                UPDATE public."User" SET active = false
                    WHERE id = ${userID} AND active = true
            `);
            res.sendStatus(202);
        } catch (err) {
            res.status(500).json(err);
        }
    });
};