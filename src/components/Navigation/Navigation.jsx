import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../AuthContext'; 
import UserMenu from '../UserMenu/UserMenu';
import css from './Navigation.module.css';

export default function Navigation() {
    const location = useLocation();
    const { user, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isFixed = location.pathname === "/";

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={isFixed ? `${css.headerContainer} ${css.fixed}` : css.headerContainer}>
            <nav className={css.nav}>
                <NavLink to="/" className={css.navTitle}>Nanny.Services</NavLink>
                <button type="button" className={css.openMenuBtn} onClick={toggleMenu}>
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
                    {/* Посилання на Favorites показується тільки, якщо користувач увійшов */}
                    {!loading && user && (
                        <NavLink to="/favorites" className={({ isActive }) => isActive ? css.active : css.link}>
                            Favorites
                        </NavLink>
                    )}
                </div>
                <div className={css.navUserMenu}>
                    <UserMenu />
                </div>
            </nav>

            {/* Мобільне меню */}
            {isMenuOpen && (
                <div className={css.mobileMenuBackdrop} onClick={closeMenu}>
                    <div className={css.mobileMenu} onClick={(e) => e.stopPropagation()}>
                        <button className={css.closeBtn} onClick={closeMenu}>×</button>
                        <div className={css.mobileLink}>
                            <NavLink to="/" className={css.mobileLinkItem} onClick={closeMenu}>Home</NavLink>
                            <NavLink to="/nannies" className={css.mobileLinkItem} onClick={closeMenu}>Nannies</NavLink>
                        {!loading && user && (
                                <NavLink to="/favorites" className={css.mobileLinkItem} onClick={closeMenu}>Favorites</NavLink>
                            )}
                        </div>
                        <div className={css.mobileUserMenu}>
                            <UserMenu />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
