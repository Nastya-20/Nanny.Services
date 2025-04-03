import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Navigation from '../Navigation/Navigation';
import { ToastContainer } from 'react-toastify';

const Home = React.lazy(() => import('../../pages/Home/Home'));
const Nannies = React.lazy(() => import('../../pages/Nannies/Nannies'));
const Favorites = React.lazy(() => import('../../pages/Favorites/Favorites'));
const NotFoundPage = React.lazy(() => import('../../pages/NotFoundPage/NotFoundPage'));


export default function App() {
    const location = useLocation();

    return (
        <>
            <ToastContainer />
            {location.pathname !== '/notfound' && <Navigation />}
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route extra path='/' element={<Home />} />
                    <Route extra path='/nannies' element={<Nannies />} />
                    <Route extra path='/favorites' element={<Favorites />} />
                    
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </>
    );
}
