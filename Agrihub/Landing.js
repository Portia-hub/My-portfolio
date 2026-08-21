const menuToggle = document.querySelector('#menuToggle');
const siteNav = document.querySelector('#siteNav');

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
}

document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
        if (siteNav && menuToggle) {
            siteNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

document.querySelectorAll('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        document.querySelectorAll('.project-card').forEach((card) => {
            card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
        });
    });
});

const noteDisplay = document.querySelector('#noteDisplay');
if (noteDisplay) {
    document.querySelectorAll('.note-item').forEach((note) => {
        note.addEventListener('click', () => {
            document.querySelectorAll('.note-item').forEach((item) => item.classList.remove('active'));
            note.classList.add('active');
            noteDisplay.textContent = note.dataset.note;
        });
    });
}

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = document.querySelector('#formMessage');
        message.textContent = 'Thanks. We will be in touch soon.';
        event.target.reset();
    });
}
