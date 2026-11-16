if('scrollRestoration' in history){
    history.scrollRestoration = 'manual';
}

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main .section, main .hero');
const backToTop = document.getElementById('back-to-top');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const id = entry.target.getAttribute('id');
            navLinkItems.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => observer.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .timeline-item, .skill-tile, .project-card, .publication-card, .fact').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

document.querySelectorAll('.project-card[data-href], .publication-card[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
        if(e.target.closest('a')) return;
        window.location.href = card.dataset.href;
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('card-hidden', !show);
        });
    });
});

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if(contactForm){
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const params = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            number: document.getElementById('number').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        emailjs.send('service_mb9qdl8', 'template_dipcxnp', params)
            .then(() => {
                formStatus.textContent = 'Thanks! Your message has been sent. I will get back to you soon.';
                formStatus.classList.add('success');
                contactForm.reset();
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                formStatus.textContent = 'Sorry, the message could not be sent. Please email me directly at pranjal23parmar@gmail.com.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });
}
