🧸 Nanny.Services App
Цей застосунок допомагає знайти кваліфіковану няню для догляду за дітьми.
 Користувачі можуть переглядати список нянь, сортувати, фільтрувати, додавати у вибране, 
 переглядати детальну інформацію та залишати заявки на зустріч. 
 Доступ до повного функціоналу надається після авторизації.

🔗 Посилання на проект
Деплой на Vercel.app

Макет у Figma: https://www.figma.com/design/u36ajEOsnwio2GDGiabVPD/Nanny-Sevices?node-id=0-1&p=f&t=XkhIhvD2Oa9ZdcpG-0

![Головна сторінка](./assets/image.png)
![Сторінка з нянями](./assets/image-1.png)

Репозиторій на GitHub: https://github.com/Nastya-20/Nanny.Services

📌 Технічне завдання
Застосунок має три сторінки:

Home — головна сторінка з назвою сайту, слоганом, кнопкою-посиланням до сторінки нянь. Можливість зміни теми.

Nannies — сторінка з переліком нянь, сортуванням та фільтрами.

Favorites — приватна сторінка з обраними нянями (доступна лише авторизованим користувачам).

🔐 Авторизація:
Реєстрація / Логін за допомогою Firebase Authentication

Робота з react-hook-form та yup для валідації форм

Поточний користувач зберігається в контексті

Закриття модальних вікон по кліку на Х, backdrop або Esc

💾 Дані:
Няні зберігаються у Firebase Realtime Database

Структура колекції:
![json](./assets/image-2.png)

📄 Функціонал:
Сортування: за іменем, ціною, рейтингом
Фільтрація за ціною

Картки няні з кнопками Read more, Make an appointment та серцем (обране)

Read more — відкриває деталі профілю

Make an appointment — форма заявки (з react-hook-form & yup)

Favorites — приватна сторінка для перегляду обраних нянь

Збереження обраного після оновлення сторінки

Обробка неавторизованого користувача (повідомлення)

🧑‍💻 Технології
React + Vite

React Router

Firebase (Auth, Realtime Database)

React Hook Form + Yup

Context API (для авторизації)

CSS Modules / Styled Components / Tailwind CSS (обрати залежно від реалізації)

Vercel / GitHub Pages — для деплою

🧰 Встановлення та запуск
Клонувати репозиторій:

git clone https://github.com/Nastya-20/Nanny.Services.git
cd Nanny.Services
Встановити залежності:

npm install
Додати Firebase-конфіг у .env файл:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
Запустити локальний сервер:

npm run dev
✅ Критерії якості
📱 Адаптивність: від 320px до 1440px

🧠 Валідація: всі форми обов’язкові до заповнення

🔐 Безпека: приватна сторінка Favorites тільки для авторизованих

🔄 Збереження стану обраних

🚀 Деплой на Vercel.app

✅ Відсутність помилок у консолі

📚 Компонентний підхід без надлишкових коментарів

🧠 Автор
Anastasiia Tolmachova | GitHub: @Nastya-20
https://github.com/Nastya-20/Nanny.Services




