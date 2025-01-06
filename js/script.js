document.addEventListener('DOMContentLoaded', () => {
    // Get all language switch links
    const langLinks = document.querySelectorAll('.nav-link.lang');
    const content = document.getElementById('content');
    const loaderLayout = document.querySelector('.loader-wrapper')

    // Initialize a variable to store the loaded languages state
    const loadedLanguages = {};

    // Function to close the mobile menu after selecting a language
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

            // Remove the 'active' class from all links
            langLinks.forEach(l => l.classList.remove('active'));

            // Add the 'active' class to the selected link
            link.classList.add('active');

            // Determine the language from the class, e.g., 'lang-en' -> 'en'
            const langClass = Array.from(link.classList).find(cls => cls.startsWith('lang-'));
            if (!langClass) {
                console.error('Failed to determine the language from the link class.');
                return;
            }
            const lang = langClass.split('-')[1];

            // Form the path to the language file
            const filePath = `langs/${lang}.html`;

            // Check if this language has already been loaded (caching)
            if (loadedLanguages[lang]) {
                content.innerHTML = loadedLanguages[lang];
                closeMobileMenu();
                return;
            }

            try {
                // Display the loading indicator
                loaderLayout.classList.remove('d-none');

                // Load the content
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Loading error: ${response.status} ${response.statusText}`);
                }
                const html = await response.text();

                // Insert the loaded content
                content.innerHTML = html;
                loaderLayout.classList.add('d-none');

                // Cache the loaded language
                loadedLanguages[lang] = html;
                closeMobileMenu();
            } catch (error) {
                content.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Failed to load the selected language. Please try again later.
                    </div>
                `;
            }
        });
    });
});
