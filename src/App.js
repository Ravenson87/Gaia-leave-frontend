import React, {Suspense} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/style.scss';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import DefaultLayout from "./layout/DefaultLayout";

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
);


const Login = React.lazy(() => import( './pages/login/Login'));
const Home = React.lazy(() => import("./pages/home/Home"));


const App = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={loading}>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/*" element={<DefaultLayout/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;