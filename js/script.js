document.addEventListener('DOMContentLoaded', () => {
    // Получаем все ссылки для смены языка
    const langLinks = document.querySelectorAll('.nav-link.lang');
    const content = document.getElementById('content');

    // Инициализируем переменную для хранения состояния загрузки языков
    const loadedLanguages = {};

    // Функция для закрытия мобильного меню после выбора языка
    const closeMobileMenu = () => {
        const navbarCollapse = document.getElementById('navbarNav');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }
    };

    langLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            // Удаляем класс 'active' со всех ссылок
            langLinks.forEach(l => l.classList.remove('active'));

            // Добавляем класс 'active' к выбранной ссылке
            link.classList.add('active');

            // Определяем язык из класса, например 'lang-en' -> 'en'
            const langClass = Array.from(link.classList).find(cls => cls.startsWith('lang-'));
            if (!langClass) {
                console.error('Не удалось определить язык из класса ссылки.');
                return;
            }
            const lang = langClass.split('-')[1];

            // Формируем путь к файлу языка
            const filePath = `langs/${lang}.html`;

            // Проверяем, был ли уже загружен этот язык (кэширование)
            if (loadedLanguages[lang]) {
                content.innerHTML = loadedLanguages[lang];
                closeMobileMenu();
                return;
            }

            try {
                // Отображаем индикатор загрузки
                content.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                `;


                // Загружаем контент
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
                }
                const html = await response.text();

                // Вставляем загруженный контент
                content.innerHTML = html;

                // Кэшируем загруженный язык
                loadedLanguages[lang] = html;

                // Закрываем мобильное меню, если оно было открыто
                closeMobileMenu();
            } catch (error) {
                console.error('Ошибка при загрузке файла языка:', error);
                content.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Не удалось загрузить выбранный язык. Пожалуйста, попробуйте позже.
                    </div>
                `;
            }
        });
    });
});