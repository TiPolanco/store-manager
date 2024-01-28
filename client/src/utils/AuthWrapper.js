import { useUserAuth } from '../hooks/useUserAuth.js';

const AuthWrapper = ({ requireLogin, requiredRoles, children }) => {
    const { userRole, isLoggedIn } = useUserAuth();

    if (
        (requireLogin && !isLoggedIn) ||
        (requiredRoles && !requiredRoles.includes(userRole))
    ) return null;

    return (<>{children}</>);
};

export default AuthWrapper;