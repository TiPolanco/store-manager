import { Outlet, Navigate } from 'react-router-dom';

import { useUserAuth } from '../hooks/useUserAuth.js';

const PrivateRoutes = () => {
    const { isAdmin } = useUserAuth();

    return (
        isAdmin ? <Outlet /> : <Navigate to="/login" />
    );
}

export default PrivateRoutes;