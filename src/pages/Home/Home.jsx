import css from './Home.module.css';

export default function Home() {
    return (
        <div className={css.container}>
            <div className={css.homeTitle}>
                <h1 className={css.homeName}>Make Life Easier for the Family:</h1>
                <p className={css.homeText}>Find Babysitters Online for All Occasions</p>
                <button className={css.homeBtn}>Get started
                    <svg className={css.homeIcon} width="15" height="17">
                        <use className={css.defaultIcon} href="/icons.svg#icon-arrow-top"></use>
                        <use className={css.hoverIcon} href="/icons.svg#icon-arrow-right"></use>
                    </svg>
                </button>
                </div>
            <img className={css.homeImg} src='/hero-bg-1x.jpg' />
          <hr className={css.divider} />
        </div>
    );
}