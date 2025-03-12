import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import Cookies from 'universal-cookie';

const PrivateRoutes = () => {
    const cookies = new Cookies();
    const cookie = cookies.get('token')
    console.log("PrivateRoutes")
    return (
        cookie ? <Outlet/> : <Navigate to={'/login'}/>
    );
};

export default PrivateRoutes;
