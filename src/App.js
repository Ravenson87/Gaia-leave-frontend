import React, {Suspense} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";

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
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;