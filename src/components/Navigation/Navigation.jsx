import { NavLink, useLocation } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import css from './Navigation.module.css';

export default function Navigation() {
    const location = useLocation();

    // Фіксований хедер тільки на головній сторінці
    const isFixed = location.pathname === "/";

    return (
        <header className={isFixed ? `${css.headerContainer} ${css.fixed}` : css.headerContainer}>
            <nav className={css.nav}>
                <NavLink to="/" className={css.navTitle}>Nanny.Services</NavLink>
                <button type="button" className={css.openMenuBtn}>
                    <svg className={css.openMenuIcons} width="32" height="32">
                        <use href="/icons.svg#icon-menu"></use>
                    </svg>
                </button>
                <div className={css.navigation}>
                    <NavLink to="/" className={({ isActive }) => isActive ? css.active : css.link}>
                        Home
                    </NavLink>
                    <NavLink to="/nannies" className={({ isActive }) => isActive ? css.active : css.link}>
                        Nannies
                    </NavLink>
                    <NavLink to="/favorites" className={({ isActive }) => isActive ? css.active : css.link}>
                        Favorites
                    </NavLink> 
 
                     <UserMenu />
   
                </div>
            </nav>
        </header>
    );
}
