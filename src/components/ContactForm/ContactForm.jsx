import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import { db, auth } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import css from './ContactForm.module.css';

const schema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^\d+$/, 'Only numbers allowed').required('Phone number is required'),
    reason: yup.string().required('Please select a reason'),
});

export default function ContactForm({ toggleModal, isOpen }) {
    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log('Form Submitted:', data);
        if (!user) {
            toast.error('You must be logged in to submit the form.');
            return;
        }
        try {
            await addDoc(collection(db, 'bookings'), { ...data, userId: user.uid });
            reset();
            toggleModal();
            toast.success('Form successfully submitted!');
        } catch (error) {
            console.error("Form submission error!", error);
            toast.error("Form submission error. Please try again.");
        }
    };

    return (
        <>
            {isOpen && (
                <div className={css.overlayContact} onClick={toggleModal}>
                    <div className={css.modalContact} onClick={(e) => e.stopPropagation()}>
                        <button className={css.closeBtn} onClick={toggleModal}>
                            &times;
                        </button>
                        <div className={css.contactkWrap}>
                            <h1 className={css.contactTitle}>Make an appointment with a babysitter</h1>
                            <p className={css.contactText}>
                                Arranging a meeting with a caregiver for
                                your child is the first step to creating
                                a safe and comfortable environment.
                                Fill out the form below so we can match
                                you with the perfect care partner.</p>
                            <div className={css.infoNanny}>
                                <img className={css.imgNanny} width="96" height="96" src="/nanny.jpg" alt="Nanny" />
                                <div className={css.myNanny}>
                                    <p className={css.nannyText}>Your nanny</p>
                                    <h3 className={css.nannyName}>Anna Shevchenko</h3>
                                </div>
                            </div>
                        </div>
                        <form className={css.contactForm} onSubmit={handleSubmit(onSubmit)}>

                            <p className={css.error}>{errors.reason?.message}</p>

                            <p className={css.error}>{errors.address?.message}</p>
                            <input
                                className={css.input}
                                type="text"
                                placeholder="Address"
                                {...register('Address')}
                            />

                            <p className={css.error}>{errors.phone?.message}</p>
                            <input
                                className={css.input}
                                type="text"
                                placeholder="Phone number"
                                {...register('phone')}
                            />

                            <p className={css.error}>{errors.age?.message}</p>
                            <input
                                className={css.input}
                                type="text"
                                placeholder="Child's age"
                                {...register('age')}
                            />

                            <p className={css.error}>{errors.time?.message}</p>
                            <input
                                className={css.input}
                                type="text"
                                placeholder="00:00"
                                {...register('time')}
                            />

                            <p className={css.error}>{errors.email?.message}</p>
                            <input
                                className={css.input}
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                            />

                            <p className={css.error}>{errors.name?.message}</p>
                            <input
                                className={css.input}
                                type="text"
                                placeholder="Father's or mother's name"
                                {...register('name')}
                            />

                            <textarea
                                className={css.comment}
                                type="text"
                                rows="8"
                                placeholder="Comment"
                                {...register('comment')}
                            />
                            
                            <button className={css.buttonContact} type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}