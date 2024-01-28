
// Permissions
export const STORE_VIEW = "store:view";
export const STORE_CREATE = "store:create";
export const STORE_EDIT = "store:edit";

export const USER_VIEW = "user:view";
export const USER_EDIT = "user:edit";

export const BOOKING_VIEW = "booking:view";
export const BOOKING_CREATE = "booking:create";
export const BOOKING_ACCEPT = "booking:accept";

const PERMISSION_SET_BY_ROLE = {
    // Admin Role
    1: [STORE_VIEW, STORE_CREATE, STORE_EDIT, USER_VIEW, USER_EDIT, BOOKING_VIEW, BOOKING_ACCEPT, BOOKING_CREATE],
    // Bsuiness Owner Role
    2: [STORE_VIEW, USER_VIEW, BOOKING_VIEW, BOOKING_CREATE],
};

const hasPermission = (permission, role) => {
    const permissionSet = PERMISSION_SET_BY_ROLE[role];
    if (!permissionSet) return false;

    return permissionSet.includes(permission);
};

export default function (permission) {
    return (req, res, next) => {
        const userID = req.params.userId
        const { id, role } = req.user;
        
        // Allow edit user's own profile
        if (Number(userID) === id) {
            return next();
        }

        // Check if role has permission
        if (!hasPermission(permission, role)) {
            return res.status(403).json({
                message: `Not Authorized - User missing ${permission} permission.`,
            });
        }
        next();
    };
}