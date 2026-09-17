// ── Render centralized data (experience / certs / research / achievements) ──
function renderExperiencePage() {
    if (typeof window.PORTFOLIO_EXPERIENCE === 'undefined') return;
    const D = window.PORTFOLIO_EXPERIENCE;

    // Experience timeline
    const expTimeline = document.getElementById('experience-timeline');
    if (expTimeline && Array.isArray(D.experience)) {
        D.experience.forEach((job, i) => {
            const item = document.createElement('div');
            item.className = 'exp-item scroll-reveal' + (i % 2 === 1 ? ' delay-1' : '');
            const duties = (job.responsibilities || [])
                .map(r => `<li>${r}</li>`).join('');
            item.innerHTML = `
                <div class="exp-node" aria-hidden="true"></div>
                <div class="exp-card">
                    <div class="exp-topline">
                        <span class="exp-role">${job.role}</span>
                        <span class="exp-year">${job.duration}</span>
                    </div>
                    <h3 class="exp-org">${job.org}</h3>
                    <p class="exp-location">${job.location}</p>
                    <ul class="exp-list">${duties}</ul>
                    <a href="${job.certUrl}" target="_blank" rel="noopener noreferrer"
                        class="btn-certificate">VIEW CERTIFICATE</a>
                </div>`;
            expTimeline.appendChild(item);
        });
    }

    // Certifications grid
    const certGrid = document.getElementById('certifications-grid');
    if (certGrid && Array.isArray(D.certifications)) {
        D.certifications.forEach((cert, i) => {
            const card = document.createElement('div');
            card.className = 'certification-card scroll-reveal' + (i % 2 === 1 ? ' delay-1' : '');
            card.innerHTML = `
                <h3 class="cert-title">${cert.title}</h3>
                <a href="${cert.url}" target="_blank" rel="noopener noreferrer"
                    class="btn-certificate">VIEW CERTIFICATE</a>`;
            certGrid.appendChild(card);
        });
    }

    // Research publication
    const researchList = document.getElementById('research-list');
    if (researchList && D.research) {
        const r = D.research;
        const card = document.createElement('div');
        card.className = 'research-card scroll-reveal';
        card.innerHTML = `
            <h3 class="research-title">${r.title}</h3>
            <p class="research-desc">${r.desc}</p>
            <a href="${r.url}" target="_blank" rel="noopener noreferrer"
                class="btn-certificate">VIEW RESEARCH PAPER</a>`;
        researchList.appendChild(card);
    }

    // Achievements
    const achGrid = document.getElementById('achievements-grid');
    if (achGrid && Array.isArray(D.achievements)) {
        D.achievements.forEach((a, i) => {
            const card = document.createElement('div');
            card.className = 'achievement-card scroll-reveal' + (i % 2 === 1 ? ' delay-1' : '');
            let html = `
                <div class="achievement-icon">${a.icon || '🏆'}</div>
                <h3 class="achievement-name">${a.name}</h3>
                ${a.org ? `<p class="achievement-org">${a.org}</p>` : ''}
                <p class="achievement-desc">${a.desc}</p>`;
            if (a.certUrl) {
                html += `<a href="${a.certUrl}" target="_blank" rel="noopener noreferrer" class="btn-certificate">VIEW CERTIFICATE</a>`;
            }
            card.innerHTML = html;
            achGrid.appendChild(card);
        });
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // ── Render experience page data ──
    renderExperiencePage();

    // ── Smooth Scrolling (same-page anchors only) ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Sticky Navbar ──
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ── Scroll Progress Indicator ──
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
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
    const dockItems = document.querySelectorAll('.dock-item');

    function setActiveDock(id) {
        dockItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
        });
    }

    // Track sections that actually exist on the current page (works for both pages)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveDock(entry.target.id);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-30% 0px -45% 0px'
    });

    dockItems.forEach(item => {
        const target = document.getElementById(item.dataset.section);
        if (target) sectionObserver.observe(target);
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
    const initialSection = document.body.querySelector('.dock-item.active');
    if (!initialSection) setActiveDock('hero');
});
