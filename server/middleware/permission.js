
// Permissions
export const STORE_VIEW = "store:view";
export const STORE_CREATE = "store:create";
export const STORE_EDIT = "store:edit";

export const USER_VIEW = "user:view";
export const USER_EDIT = "user:edit";

export const BOOKING_VIEW = "booking:view";

export const BID_ACCEPT = "bid:accept";
export const BID_VIEW = "bid:view";
export const BID_CREATE = "bid:create";

export const ADMIN_ROLE = 1;
export const BUSINESS_OWNER_ROLE = 2;

const businessOwnerPermissionSet = [STORE_VIEW, BOOKING_VIEW, BID_CREATE];
const adminPermissionSet = [...businessOwnerPermissionSet, STORE_CREATE, STORE_EDIT, USER_VIEW, USER_EDIT, BID_VIEW, BID_ACCEPT];

const PERMISSION_SET_BY_ROLE = {
    [ADMIN_ROLE]: adminPermissionSet,
    [BUSINESS_OWNER_ROLE]: businessOwnerPermissionSet,
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