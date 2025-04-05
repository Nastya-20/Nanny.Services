import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ContactForm from "../../components/ContactForm/ContactForm";
import { differenceInYears, parseISO } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import Loader from "../../components/Loader/Loader";
import css from "./Favorites.module.css";

export default function Favorites() {
    const [expandedNannyId, setExpandedNannyId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedOption, setSelectedOption] = useState('A to Z');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const savedFilters = localStorage.getItem("selectedFilters");
        return savedFilters ? JSON.parse(savedFilters) : {};
    });

    // Відстежую авторизації користувача
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Завантажую улюблених нянь після оновлення `user`
    useEffect(() => {
        if (user) {
            loadFavorites(user.uid);
        }
    }, [user]);

    useEffect(() => {
        const fetchNannies = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "nannies"));
                const nanniesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNannies(nanniesList);
            } catch (error) {
                console.error("Error fetching nannies:", error);
                setError("Failed to load nannies.");
                toast.error("Error fetching nannies.");
            } finally {
                setLoading(false);
            }
        };

        fetchNannies();
    }, []);

    // Завантажую обраних нянь
    const loadFavorites = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFavorites(userSnap.data().favorites || []);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    // Додаю/видаляю з обраних
    const toggleFavorite = async (nannyId) => {
        if (!user) {
            toast.warning("This feature is available for authorized users only.");
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const isFavorite = favorites.includes(nannyId);

        try {
            await updateDoc(userRef, {
                favorites: isFavorite ? arrayRemove(nannyId) : arrayUnion(nannyId),
            });
            setFavorites((prev) =>
                isFavorite ? prev.filter((id) => id !== nannyId) : [...prev, nannyId]
            );
            toast.success(
                isFavorite
                    ? "Removed from favorites!"
                    : "Added to favorites!"
            );
        } catch (error) {
            console.error("Error updating favorites:", error);
            toast.error("Failed to load favorites.");
        }
    };

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const handleReadMore = (nannyId) => {
        setExpandedNannyId((prevId) => (prevId === nannyId ? null : nannyId));
    };

    // Фільтруєю лише нянь, які є в `favorites`
    const favoriteNannies = nannies.filter((nanny) => favorites.includes(nanny.id));


    // // При завантаженні сторінки зчитую дані з localStorage
    useEffect(() => {
       const savedFilters = localStorage.getItem("selectedFilters");
       if (savedFilters) {
            setSelectedFilters(JSON.parse(savedFilters));
        }
    }, []);

    const options = [
        'A to Z',
        'Z to A',
        'Less than 10$',
        'Greater than 10$',
        'Popular',
        'Not popular',
        'Show all'
    ];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const sortAndFilterNannies = () => {
        let sorted = [...favoriteNannies];

        switch (selectedOption) {
            case 'A to Z':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Z to A':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Less than 10$':
                sorted = sorted.filter(nanny => nanny.price_per_hour < 10);
                break;
            case 'Greater than 10$':
                sorted = sorted.filter(nanny => nanny.price_per_hour >= 10);
                break;
            case 'Popular':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'Not popular':
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            default:
                break;
        }

        return sorted;
    };


    return (
        <div className={css.wrapperNannies}>
            <p className={css.filtersNannies}>Filters</p>
            <div className={css.customSelectWrapper}>
                <div className={css.customSelect} onClick={toggleDropdown}>
                    <span>{selectedOption}</span>
                    <span className={css.arrow}></span>
                </div>
                {isOpen && (
                    <ul className={css.customOptions}>
                        {options.map((option) => (
                            <li
                                key={option}
                                className={css.optionItem}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {loading && <Loader />}
            {error && <p className={css.error}>{error}</p>}

            {!loading && !error && favoriteNannies.length === 0 && (
                <p className={css.noFavorites}>No favorite nannies yet.</p>
            )}

            {!loading && !error && sortAndFilterNannies().slice(0, visibleCount).map((nanny) => {
                const age = nanny.birthday ? differenceInYears(new Date(), parseISO(nanny.birthday)) : "N/A";
                return (
                    <div key={nanny.id} className={css.detailsNannies}>
                        <div className={css.imgContainer}>
                            <img className={css.imgNannies} width="96" height="96" src={nanny.avatar_url} alt={nanny.name} />
                        </div>
                        <div>
                            <div className={css.detailsItems}>
                                <h3 className={css.detailsTitle}>Nanny</h3>
                                <ul className={css.detailsLink}>
                                    <li className={css.detailsText}>
                                        <svg className={css.iconMap} aria-hidden="true" width="32" height="32">
                                            <use href="/icons.svg#icon-map" />
                                        </svg>{nanny.location}
                                    </li>
                                    <span className={css.line}>|</span>
                                    <li className={css.detailsText}>
                                        <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                            <use href="/icons.svg#icon-star" />
                                        </svg>
                                        Rating:&nbsp;{nanny.rating}
                                    </li>
                                    <span className={css.line}>|</span>
                                    <li className={css.detailsText}>
                                        Price&nbsp;/&nbsp;1&nbsp;hour:&nbsp;<span className={css.priceNumber}>{nanny.price_per_hour}$</span>
                                    </li>
                                    <svg
                                        onClick={() => {
                                            toggleFavorite(nanny.id);
                                            // console.log(`Favorite status of nanny ${nanny.id}:`, favorites.includes(nanny.id));
                                        }}
                                        className={favorites.includes(nanny.id) ? css.iconHeartActive : css.iconHeart}
                                        aria-hidden="true"
                                        width="26"
                                        height="26"
                                    >
                                        <use href="/icons.svg#icon-heart" />
                                    </svg>
                                </ul>
                            </div>
                            <h2 className={css.nameNanny}>{nanny.name}</h2>
                            <div className={css.infoNanny}>
                                <p className={css.info}>
                                    <span className={css.detail}>Age: </span>
                                    <span className={css.underlined}>{age}</span>
                                </p>
                                <p className={css.info}>
                                    <span className={css.detail}>Experience:</span> {nanny.experience}
                                </p>
                                <p className={css.info}>
                                    <span className={css.detail}>Kids age:</span> {nanny.kids_age}
                                </p>
                                <p className={css.info}>
                                    <span className={css.detail}>Characters: </span> {nanny.characters?.join(',')}
                                </p>
                                <p className={css.info}>
                                    <span className={css.detail}>Education: </span> {nanny.education}
                                </p>
                            </div>
                            <p className={css.aboutText}>{nanny.about || "No information available"}</p>

                            {/* Кнопка Read more */}
                            {expandedNannyId !== nanny.id && (
                                <button className={css.readMore} onClick={() => handleReadMore(nanny.id)}>
                                    Read more
                                </button>
                            )}
                            {expandedNannyId === nanny.id && (
                                <>
                                    <div className={css.reviewsList}>
                                        {nanny.reviews?.map((review, index) => (
                                            <div key={index} className={css.reviewItem}>
                                                <div className={css.reviewFirst}>
                                                    <div className={css.reviewerCircle}>
                                                        {review.reviewer ? review.reviewer[0]?.toUpperCase() : "?"}
                                                    </div>
                                                    <div>
                                                        <h3 className={css.reviewName}>{review.reviewer}</h3>
                                                        <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                                            <use href="/icons.svg#icon-star" />
                                                        </svg>
                                                        {(review.rating && !isNaN(review.rating)) ? review.rating.toFixed(1) : 5.0}
                                                    </div>
                                                </div>
                                                <p className={css.reviewItemText}>{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Кнопка Make an appointment */}

                            {expandedNannyId === nanny.id && (
                                <>
                                    <button className={css.openModalBtn} onClick={() => setIsModalOpen(true)}>
                                        Make an appointment
                                    </button>
                                    {isModalOpen && <ContactForm onSubmit={toggleModal} toggleModal={toggleModal} isOpen={isModalOpen} nanny={nanny} />}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
            {favoriteNannies.length > visibleCount && (
                <LoadMoreButton onLoadMore={() => setVisibleCount(prev => prev + 3)} />
            )}
            <ToastContainer />
        </div>
    );
}