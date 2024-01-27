import jwt from 'jsonwebtoken';

import dbPool from '../database/db.js';
import auth from '../middleware/auth.js';

export default function(app) {
    // Login
    app.post("/api/login", async (req, res) => {
        const { username, password } = req.body;
        
        try {
            const { rows } = await dbPool.query(`SELECT id, name, password, role, pfp FROM public."User" WHERE username = '${username}' AND active = true`);
            const user = rows[0];

            // Check username and password
            // TODO: need to encrypt password
            if (!user || user.password !== password) {
                return res.status(403).json({
                    message: "invalid login",
                });
            }

            // Generate jwt token
            // Improvement: add expiration
            delete user.password;
            const token = jwt.sign(user, process.env.MY_SECRET || "halliday_secret");

            // Set response cookie
            res.cookie("token", token, { httpOnly: true });

            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // Signup
    app.post("/api/signup", async (req, res) => {
        const { name, username, password, pfp } = req.body;
        if (!name || !username || !password) {
            return res.status(400).json({
                message: "Missing information.",
            });
        }
        
        try {
            const { rows: existingUsers } = await dbPool.query(`
                SELECT username FROM public."User"
                    WHERE username = '${username}'
            `);

            if (existingUsers.length) {
                return res.status(400).json({
                    message: `User name "${username}" is not available.`,
                });
            }

            const { rows: newUsers } = await dbPool.query(`
                INSERT INTO public."User"(
                    name, username, password, role, pfp)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, name, role, pfp;
            `, [name, username, password, 2, pfp]);

            const newUser = newUsers[0];

            // Generate jwt token
            // Improvement: add expiration
            const token = jwt.sign(newUser, process.env.MY_SECRET || "halliday_secret");

            // Set response cookie
            res.cookie("token", token, { httpOnly: true });

            return res.status(200).json(newUser);
        } catch (err) {
            res.status(500).json(err);
        }
    });

    // Logout
    app.get("/api/logout", auth, (req, res) => {
        res.clearCookie("token");
        return res.status(200).json({
            message: "User logged out.",
        });
    });
};