import jwt from "jsonwebtoken";

export default async function(req, res, next) {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.MY_SECRET || 'halliday_secret');
        console.log(`User: ${user.name}, Role: ${user.role}`);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(403).json({
            message: "No Authorized.",
        });
    }
}