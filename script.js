// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // ── Smooth Scrolling ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ── Sticky Navbar ──
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── Scroll Reveal Observer ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // ── Mobile Menu ──
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks  = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }

    // ── Mac Dock: Active Section Tracking via IntersectionObserver ──
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];
    const dockItems  = document.querySelectorAll('.dock-item');

    function setActiveDock(id) {
        dockItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
        });
    }

    // Track which sections are visible and pick the most prominent one
    const visibleSections = new Map();

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleSections.set(entry.target.id, entry.intersectionRatio);
            } else {
                visibleSections.delete(entry.target.id);
            }

            // Find the section with the highest intersection ratio
            if (visibleSections.size > 0) {
                let maxRatio = 0;
                let activeId = '';
                visibleSections.forEach((ratio, id) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio;
                        activeId = id;
                    }
                });
                if (activeId) setActiveDock(activeId);
            }
        });
    }, {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: '0px 0px -40% 0px'
    });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // ── Mac Dock: Bounce on Click ──
    dockItems.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.add('bounce');
            this.addEventListener('animationend', () => this.classList.remove('bounce'), { once: true });
        });
    });

    // ── Mac Dock: Magnetic Hover (smooth physics) ──
    dockItems.forEach(item => {
        item.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.12;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.08;
            this.style.transform = `translateY(-9px) scale(1.12) translate(${dx}px, ${dy}px)`;
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ── Initial Active ──
    setActiveDock('hero');
});
