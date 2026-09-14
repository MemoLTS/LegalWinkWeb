const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('legalwink-theme');
const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';

document.documentElement.dataset.theme = theme;

function updateThemeButton() {
    const darkMode = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', darkMode ? 'Activar modo claro' : 'Activar modo oscuro');
    themeToggle.setAttribute('title', darkMode ? 'Activar modo claro' : 'Activar modo oscuro');
    themeToggle.innerHTML = `<i class="bi bi-${darkMode ? 'sun' : 'moon-stars'}" aria-hidden="true"></i>`;
}

updateThemeButton();

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('legalwink-theme', nextTheme);
    updateThemeButton();
});