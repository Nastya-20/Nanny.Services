import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ContactForm from "../../components/ContactForm/ContactForm";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import Loader from "../../components/Loader/Loader";
import css from "./Favorites.module.css";

export default function Favorites() {
    const [expandedNannyId, setExpandedNannyId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
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
            alert("This feature is available for authorized users only.");
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
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const handleReadMore = (nannyId) => {
        setExpandedNannyId((prevId) => (prevId === nannyId ? null : nannyId));
    };

    // Фільтруєю лише нянь, які є в `favorites`
    const favoriteNannies = nannies.filter((nanny) => favorites.includes(nanny.id));

    // // Функція фільтрації
    const handleFilterClick = (nannyId, filter) => {
     if (!nannyId) return;

     setSelectedFilters(prev => {
    const updatedFilters = { ...prev, [nannyId]: filter };
        localStorage.setItem("selectedFilters", JSON.stringify(updatedFilters)); // Зберігаємо у localStorage
         return updatedFilters;
      });
    };

    // // При завантаженні сторінки зчитую дані з localStorage
    useEffect(() => {
       const savedFilters = localStorage.getItem("selectedFilters");
       if (savedFilters) {
            setSelectedFilters(JSON.parse(savedFilters));
        }
    }, []);


    return (
        <div className={css.wrapperNannies}>
            <ul className={css.selectorNannies}>
                <li>
                    <label className={css.filtersNannies}>
                        Filters
                        <select className={css.selectItemFilter}>
                            <option value="A to Z">A to Z</option>
                            <option value="Z to A">Z to A</option>
                            <option value="Less than 10$">German</option>
                            <option value="Greater than 10$">Greater than 10$</option>
                            <option value="Popular">Popular</option>
                            <option value="Not popular">Not popular</option>
                            <option value="Show all">Show all</option>
                        </select>
                    </label>
                </li>
                 </ul>
            {loading && <Loader />}
            {error && <p className={css.error}>{error}</p>}

            {!loading && !error && favoriteNannies.length === 0 && <Loader><p>No favorite nannies yet.</p></Loader>}

            {!loading && !error && favoriteNannies.slice(0, visibleCount).map((nanny) => (
                <div key={nanny.id} className={css.detailsNannies}>
                    <div className={css.imgContainer}>
                        <img className={css.imgNannies} width="96" height="96" src={nanny.avatar_url} alt={nanny.name} />
                    </div>
                    <div>
                        <div className={css.detailsItems}>
                            <h3 className={css.detailsTitle}>Nanny</h3>
                            <ul className={css.detailsLink}>
                                <li className={css.detailsText}>
                                    <svg className={css.iconBook} aria-hidden="true" width="32" height="32">
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
                            </ul>
                            {/* Heart icon for adding/removing favorite */}
                            <svg
                                onClick={() => {
                                    toggleFavorite(nanny.id);
                                    console.log(`Favorite status of teacher ${nanny.id}:`, favorites.includes(nanny.id));
                                }}
                                className={favorites.includes(nanny.id) ? css.iconHeartActive : css.iconHeart}
                                aria-hidden="true"
                                width="26"
                                height="26"
                            >
                                <use href="/icons.svg#icon-heart" />
                            </svg>
                        </div>
                        <h2 className={css.nameNanny}>{nanny.name}</h2>
                        <p className={css.infoAge}>
                            <span className={css.speaks}>Age: </span>
                            <span className={css.underlined}>{nanny.age}</span>
                        </p>
                        <p className={css.info}><span className={css.lesson}>Kids age:</span> {nanny.kids_age}</p>
                        <p className={css.infoConditions}><span className={css.conditions}>Characters:</span> {nanny.characters.join(',')}</p>
                        <p className={css.infoConditions}><span className={css.conditions}>Education:</span> {nanny.education.join(',')}</p>
                        {/* Кнопка Read more */}

                        {expandedNannyId !== nanny.id && (
                            <button className={css.readMore} onClick={() => handleReadMore(nanny.id)}>
                                Read more
                            </button>
                        )}
                        {expandedNannyId === nanny.id && (
                            <>
                                <p className={css.reviewText}>{nanny.about}</p>
                                <div className={css.reviewsList}>
                                    {nanny.reviews.map((review, index) => (
                                        <div key={index} className={css.reviewItem}>
                                            <div className={css.reviewReiting}>
                                                <div className={css.reviewerCircle}>
                                                    {review.reviewer_name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className={css.reviewName}>{review.reviewer_name}</h3>
                                                    <svg className={css.iconStar} aria-hidden="true" width="16" height="16">
                                                        <use href="/icons.svg#icon-star" />
                                                    </svg>
                                                    {review.reviewer_rating}
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
                                {isModalOpen && <ContactForm onSubmit={toggleModal} toggleModal={toggleModal} isOpen={isModalOpen} />}
                            </>
                        )}
                    </div>
                </div>
            ))}
            {favoriteNannies.length > visibleCount && (
                <LoadMoreButton onLoadMore={() => setVisibleCount(prev => prev + 4)} />
            )}
        </div>
    );
}