// Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

const Layout = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/auth' && <Header />}
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;
