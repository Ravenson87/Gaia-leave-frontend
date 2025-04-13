import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import Cookies from 'universal-cookie';

const PrivateRoutes = () => {
    const cookies = new Cookies();
    const cookie = cookies.get('token')
    return (
        cookie ? <Outlet/> : <Navigate to={'/login'}/>
    );
};

export default PrivateRoutes;
