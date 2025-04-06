import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSchema } from '../AuthModal/authSchema';
import css from './LoginForm.module.css';

const LoginForm = ({ onSubmit, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    const { reset, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const login = async (data) => {
        try {
            await onSubmit(data);
            onClose();
            reset();

        } catch (error) {
             if (error.code === 'auth/user-not-found') {
                // Виводимо тост при невдалій спробі знайти користувача
                toast.error("This user doesn't exist. Please register first.");
                onSwitchToLogin();
            } else if (error.code === 'auth/wrong-password') {
                // Виводимо тост при неправильному паролі
                toast.error("Incorrect password. Please try again.");
            } else {
                // Загальний тост про помилку
                toast.error("Login failed. Please try again.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(login)} className={css.authForm} autoComplete="on">
            <div className={css.inputWrapper}>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    {...register('email')}
                />
            </div>
            <div className={css.inputWrapper}>
                {errors.password && <p className={css.errors}>{errors.password.message}</p>}
                <div className={css.inputInner}>
                <input
                    className={css.passwordForm}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register('password')}
                />
                <svg
                    className={css.iconEye}
                    aria-hidden="true"
                    width="16"
                    height="16"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    <use href={`/icons.svg#icon-eye${showPassword ? "" : "-off"}`} />
                    </svg>
                </div>
            </div>
            <button className={css.buttonForm} type="submit">Log in</button>
        </form>
    );
};

export default LoginForm;