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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            const newUser = userCredential.user;

            await updateProfile(newUser, {
                displayName: name
            });
            await signInWithEmailAndPassword(auth, email, password);
          
            toast.success(`User registered  in successfully! Welcome, ${name}`);
      
            setTimeout(() => {
                setIsRegisterOpen(false);
                navigate('/nannies');
            }, 300);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("This email is already in use. Please log in.");
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };


    const handleLogin = async ({ email, password }) => {
        try {
             // Логін користувача
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;
            const userName = loggedInUser.displayName || email;  // Якщо ім'я не задано, використовуємо email
            toast.success(`User logged in successfully!, Welcome, ${userName}`);
        
            // Перехід на сторінку нянь
            setTimeout(() => {
                setIsLoginOpen(false);
                setError("");
                navigate('/nannies');
            });
     
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("This user doesn't exist. Please register first.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };


    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
        
            navigate('/nannies');
          } catch (error) {
           toast.error("Logout failed. Please try again.");
        }
    };

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser || null);
        });

        return () => {
            listen();
        };
    }, []);

   
    const handleSwitchToLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

        useEffect(() => {
            if (isLoginOpen || isRegisterOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
            return () => {
                document.body.style.overflow = "auto"; 
            };
        }, [isLoginOpen, isRegisterOpen]);


    return (
        <>
            <nav className={css.userMenu}>
                {user ? (
                    <div className={css.wrapperLogout}>
                        <div className={css.userName}>
                            <span className={css.userIconWrap}>
                                <svg className={css.userIcon} width="24" height="24">
                                    <use href="/icons.svg#icon-user"></use>
                                </svg>
                            </span>
                            <p className={css.displayName}>{user.displayName}</p>
                        </div>
                        <button className={css.logout} type="button" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                ) : (
                    <>
                        <button className={css.loginBtn} type="button" onClick={() => {  setIsLoginOpen(true); }}>
                            Log in
                        </button>

                        <button className={css.registrationBtn} type="button" onClick={() => {  setIsRegisterOpen(true); }}>
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
                    <p className={css.registrationText}>Thank you for your
                        interest in our platform! In order to register,
                        we need some information. Please provide us with
                        the following information.</p>
                    {error && <p className={css.errorText}>{error}</p>}
                    <RegistrationForm
                        onSubmit={handleRegister}
                        onClose={() => setIsRegisterOpen(false)}
                        onSwitchToLogin={handleSwitchToLogin} />
                </AuthModal>
            )}
        </>
    );
}