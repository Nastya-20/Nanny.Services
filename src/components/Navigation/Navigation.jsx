import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import UserMenu from '../UserMenu/UserMenu';
import { AuthModal } from "../AuthModal/AuthModal";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import css from './Navigation.module.css';

export default function Navigation() {
    const location = useLocation();
    const { user, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const { login, register } = useAuth();
    const [error, setError] = useState(null);
    
    const isFixed = location.pathname === "/";

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setIsMenuOpen(false);
                setIsLoginOpen(false);
                setIsRegisterOpen(false);
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    
    const handleCloseAll = () => {
        setIsMenuOpen(false);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
    };

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);
            setIsLoginOpen(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (data) => {
        try {
            await register(data);
            setIsRegisterOpen(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSwitchToLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
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
                <>
                    <div className={css.mobileMenuBackdrop} onClick={handleCloseAll}>
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

                    {isLoginOpen && (
                        <AuthModal className={css.login} onClose={() => setIsLoginOpen(false)}>
                            <h2 className={css.loginTitle}>Log In</h2>
                            <p className={css.loginText}>
                                Welcome back! Please enter your credentials
                                to access your account and continue your babysitter search.
                            </p>
                            {error && <p className={css.errorText}>{error}</p>}
                            <LoginForm
                                onSubmit={handleLogin}
                                onClose={() => setIsLoginOpen(false)}
                                onSwitchToLogin={() => {
                                    setIsLoginOpen(false);
                                    setIsRegisterOpen(true);
                                }}
                            />
                        </AuthModal>
                    )}

                    {isRegisterOpen && (
                        <AuthModal className={css.registration} onClose={() => setIsRegisterOpen(false)}>
                            <h2 className={css.registrationTitle}>Registration</h2>
                            <p className={css.registrationText}>
                                Thank you for your interest in our platform! In order to register,
                                we need some information. Please provide us with the following information.
                            </p>
                            {error && <p className={css.errorText}>{error}</p>}
                            <RegistrationForm
                                onSubmit={handleRegister}
                                onClose={() => setIsRegisterOpen(false)}
                                onSwitchToLogin={handleSwitchToLogin}
                            />
                        </AuthModal>
                        )}
                        </div>
                        </div>
                </>
            )}
        </header>
    );
}
