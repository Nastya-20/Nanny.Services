import { useState, useEffect } from "react";
import { AuthModal } from "../AuthModal/AuthModal";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import { auth } from "../../firebase";
import css from "./UserMenu.module.css";

export default function UserMenu() {
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);


    const handleRegister = async ({ name, email, password }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully:", userCredential.user);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");

            navigate('/nannies');
            setIsRegisterOpen(false);
        } catch (error) {
            console.error("Registration error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setError("This email is already in use. Please log in.");
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    const handleLogin = async ({ email, password }) => {
        console.log("Logging  in with:", email, password);
        try {
            // Перевірка, чи вже залогінений користувач
            const user = auth.currentUser;
            if (user) {
                navigate('/nannies');
                return;
            }

            // Логін користувача
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully:", userCredential.user);

            // Перехід на сторінку нянь
            navigate('/nannies');

        } catch (error) {
            console.error("Login error:", error);

            if (error.code === 'auth/user-not-found') {
                setError("This user doesn't exist. Please register first.");
            } else if (error.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully");
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    const handleSwitchToLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };


    return (
        <>
            <nav className={css.userMenu}>
                {user ? (
                    <div className={css.wrapper}>
                        <div className={css.userName}>
                        <svg className={css.openMenuIcons} width="24" height="24">
                            <use href="/icons.svg#icon-user"></use>
                        </svg>
                            <p className={css.welcome}>{user.email}!</p>
                        </div>
                        <button className={css.logout} type="button" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                ) : (
                    <>
                        <button className={css.loginBtn} type="button" onClick={() => { setError(""); setIsLoginOpen(true); }}>
                            Log in
                        </button>

                        <button className={css.registrationBtn} type="button" onClick={() => { setError(""); setIsRegisterOpen(true); }}>
                            Registration
                        </button>
                    </>
                )}
            </nav>

            {isLoginOpen && (
                <AuthModal className={css.login} onClose={() => setIsLoginOpen(false)}>
                    <h2 className={css.loginTitle}>Log In</h2>
                    <p className={css.loginText}>
                        Welcome back! Please enter your credentials
                        to access your account and continue your babysitter search.</p>
                    {error && <p className={css.errorText}>{error}</p>}
                    <LoginForm onSubmit={handleLogin} onClose={() => setIsLoginOpen(false)} onSwitchToLogin={setIsRegisterOpen} />
                </AuthModal>
            )}

            {isRegisterOpen && (
                <AuthModal className={css.registration} onClose={() => setIsRegisterOpen(false)}>
                    <h2 className={css.registrationTitle}>Registration</h2>
                    <p className={css.registrationText}>Thank you for your
                        interest in our platform! In order to register,
                        we need some information. Please provide us with
                        the following information.</p>
                    {error && <p className={css.errorText}>{error}</p>}
                    <RegistrationForm onSubmit={handleRegister} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={handleSwitchToLogin} />
                </AuthModal>
            )}
        </>
    );
}