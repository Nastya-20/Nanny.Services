import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Home from '../../pages/Home/Home';
import Nannies from '../../pages/Nannies/Nannies';
import Favorites from '../../pages/Favorites/Favorites';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import Navigation from '../Navigation/Navigation';
import css from './App.module.css';


export default function App() {
    return (
        <div className={css.wrapper}>
            <Navigation />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route extra path='/' element={<Home />} />
                    <Route extra path='/nannies' element={<Nannies />} />
                    <Route extra path='/favorites' element={<Favorites />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </div>
    );
}
