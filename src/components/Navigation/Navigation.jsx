import { NavLink } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import css from './Navigation.module.css';

export default function Navigation() {
    return (
        <header className={css.headerContainer}>
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
                    <NavLink to="/teachers" className={({ isActive }) => isActive ? css.active : css.link}>
                        Nannies
                    </NavLink>
                    <NavLink to="/favorites" className={({ isActive }) => isActive ? css.active : css.link}>
                        Favorites
                    </NavLink>
                    <div>
                        <UserMenu />
                    </div>
                </div>
            </nav>
        </header>
    );
}