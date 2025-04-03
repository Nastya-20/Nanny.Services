import React, { useState } from 'react';
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
    address: yup.string().required('Address is required'),
    phone: yup
        .string()
        .matches(/^\d+$/, 'Only numbers allowed')
        .required('Phone number is required'),
    age: yup
        .number()
        .typeError('Age must be a number')
        .positive('Age must be a positive number')
        .integer('Age must be a whole number')
        .required('Child\'s age is required'),
    time: yup
        .string()
        .required('Time is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    name: yup.string().required('Name is required'),
    comment: yup.string().required('Comment is required'),
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
        clearErrors,
        setValue,
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

    const timeOptions = [
        "Meeting time", "08 : 00", "08 : 30", "09 : 00", "09 : 30", "10 : 00", "10 : 30",
        "11 : 00", "11 : 30", "12 : 00", "12 : 30", "13 : 00", "13 : 30",
        "14 : 00", "14 : 30", "15 : 00", "15 : 30", "16 : 00", "16 : 30"
    ];

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");

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
                            <div className={css.contactItem}>

                                <div>
                                    <p className={css.error}>{errors.address?.message}</p>
                                    <input
                                        className={css.input}
                                        type="text"
                                        placeholder="Address"
                                        {...register('address')}
                                    />

                                </div>
                                <div>
                                    <p className={css.error}>{errors.phone?.message}</p>
                                    <input
                                        className={css.input}
                                        type="text"
                                        placeholder="Phone number"
                                        {...register('phone')}
                                    />
                                </div>
                                <div>
                                    <p className={css.error}>{errors.age?.message}</p>
                                    <input
                                        className={css.input}
                                        type="text"
                                        placeholder="Child's age"
                                        {...register('age')}
                                    />
                                </div>
                                <div className={css.timeInputWrap}>
                                    <p className={css.error}>{errors.time?.message}</p> 
                                    <input
                                        type="hidden"
                                        {...register('time')}
                                        value={selectedTime}
                                    />
                                  
                                    <div className={css.timeDropdown}>
                                        <button
                                            type="button"
                                            className={`${css.input} ${selectedTime ? css.inputSelected : ""}`}
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            {selectedTime || "00:00"}
                                        </button>
                               
                                        {showDropdown && (
                                            <ul className={css.dropdownMenu}>
                                                {timeOptions.map((time) => (
                                                    <li
                                                        key={time}
                                                        className={`${css.dropdownItem} ${time === "Meeting time" ? css.disabledItem : ""}`}
                                                        onClick={() => {
                                                            if (time !== "Meeting time") {
                                                                setSelectedTime(time);
                                                                setValue("time", time);
                                                                clearErrors("time");
                                                                setShowDropdown(false);
                                                            }
                                                        }}
                                                    >
                                                        {time}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <svg
                                        className={css.iconClock}
                                        aria-hidden="true"
                                        width="16"
                                        height="16"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <use href="/icons.svg#icon-clock" />
                                    </svg>
                                </div>
                            </div>

                            <p className={css.error}>{errors.email?.message}</p>
                            <input
                                className={css.infoContact}
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                            />

                            <p className={css.error}>{errors.name?.message}</p>
                            <input
                                className={css.infoContact}
                                type="text"
                                placeholder="Father's or mother's name"
                                {...register('name')}
                            />
                            <p className={css.error}>{errors.comment?.message}</p>
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