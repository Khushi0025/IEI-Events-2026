/* ============================================================
   IEI CAMPUS HACK 2026 - MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            menuBtn.innerHTML = isOpen ? '✕' : '☰';
            menuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '☰';
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Schedule Filter Tabs (for schedule.html)
    const filterTabs = document.querySelectorAll('.timeline-tab-btn');
    const scheduleRows = document.querySelectorAll('.schedule-row');

    if (filterTabs.length > 0 && scheduleRows.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetDay = tab.getAttribute('data-day');

                scheduleRows.forEach(row => {
                    if (targetDay === 'all' || row.getAttribute('data-day') === targetDay) {
                        row.style.display = 'grid';
                        row.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }

    // 3. FAQ Accordion (for register.html & about.html)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const wasActive = item.classList.contains('active');

                // Close other items
                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // 4. Registration System & Google Forms Modal Integration
    const EVENT_CONFIG = {
        aptitude: {
            id: 'aptitude',
            title: 'Aptitude Quiz Competition',
            shortTitle: 'Aptitude',
            badge: 'Day 1 • 9th',
            icon: '🧠',
            formId: 'RBXZEAYRjyEpHRcq9',
            formUrl: 'https://forms.gle/RBXZEAYRjyEpHRcq9',
            embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeIosO3QWWqS3KS-kuaHdFSG0LiAKUqKf9vFJfj3DfqefDL8g/viewform?embedded=true',
            aliases: ['aptitude', 'quiz', 'technical-quiz']
        },
        debate: {
            id: 'debate',
            title: 'Parliamentary Debate',
            shortTitle: 'Debate',
            badge: 'Day 1 • 9th',
            icon: '🎤',
            formId: 'VyaRr9pA4NL1eJ5u7',
            formUrl: 'https://forms.gle/VyaRr9pA4NL1eJ5u7',
            embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSck5V1DFIY-8aUl8au0KIDSpjMoDK3QYIxsp2i4o7HwaSnasw/viewform?embedded=true',
            aliases: ['debate', 'parliamentary-debate']
        },
        video: {
            id: 'video',
            title: 'Video Editing Challenge',
            shortTitle: 'Video Editing',
            badge: 'Day 2 • 10th',
            icon: '🎬',
            formId: '8LMSW2iawyYT8L226',
            formUrl: 'https://forms.gle/8LMSW2iawyYT8L226',
            embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeR044kGh_TKhlqLxMmZlRcUEVFp800ZfgPBwLf_JzWkPfUdw/viewform?embedded=true',
            aliases: ['video', 'video-editing', 'media']
        },
        hunt: {
            id: 'hunt',
            title: 'Online Campus Treasure Hunt',
            shortTitle: 'Treasure Hunt',
            badge: 'Day 2 • 10th',
            icon: '🕵️',
            formId: 'CEcpoWH1DWtdVBFd9',
            formUrl: 'https://forms.gle/CEcpoWH1DWtdVBFd9',
            embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScqczUrEe6IbEW1eaQgwOHdWUW7MndBLk1mUg4HJ_OZGMSaLw/viewform?embedded=true',
            aliases: ['hunt', 'treasure-hunt', 'treasure_hunt']
        },
        hackathon: {
            id: 'hackathon',
            title: 'Grand Hackathon (SIH Grooming)',
            shortTitle: 'Grand Hackathon',
            badge: 'Flagship Day 3 • 11th',
            icon: '💻',
            formId: 'qaL6X2f3puo45viSA',
            formUrl: 'https://forms.gle/qaL6X2f3puo45viSA',
            embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe5JN5AlT8M5J6ZDgsvPMjw-JtlwRKq5Zrj0mKJUCo_9VUTcA/viewform?embedded=true',
            aliases: ['hackathon', 'grand-hackathon', 'sih']
        }
    };

    function resolveEventKey(key) {
        if (!key) return null;
        const lower = key.toLowerCase().trim();
        for (const [id, cfg] of Object.entries(EVENT_CONFIG)) {
            if (id === lower || cfg.aliases.includes(lower)) {
                return id;
            }
        }
        return null;
    }

    let activeEventKey = null;

    function ensureRegistrationModal() {
        let overlay = document.getElementById('regModalOverlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.className = 'reg-modal-overlay';
        overlay.id = 'regModalOverlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'regModalTitle');

        overlay.innerHTML = `
            <div class="reg-modal-dialog" id="regModalDialog">
                <div class="reg-modal-header">
                    <div class="reg-modal-info">
                        <span class="reg-modal-badge" id="regModalBadge">FLAGSHIP</span>
                        <h3 class="reg-modal-title" id="regModalTitle">
                            <span id="regModalIcon">💻</span>
                            <span id="regModalName">Event Registration</span>
                        </h3>
                        <div class="reg-modal-subtitle">Official Google Registration Form • IEI Campus Hack 2026</div>
                    </div>
                    <div class="reg-modal-actions">
                        <a href="#" target="_blank" rel="noopener noreferrer" class="reg-modal-newtab-btn" id="regModalNewTabBtn" title="Open Google Form in a new tab">
                            <span>↗</span> Open in New Tab
                        </a>
                        <button type="button" class="reg-modal-close-btn" id="regModalCloseBtn" aria-label="Close registration modal">✕</button>
                    </div>
                </div>
                <div class="reg-modal-tabs" id="regModalTabs"></div>
                <div class="reg-modal-body">
                    <div class="reg-modal-loader" id="regModalLoader">
                        <div class="reg-spinner"></div>
                        <div class="reg-loader-text">Loading Official Registration Form...</div>
                    </div>
                    <iframe class="reg-modal-iframe" id="regModalIframe" src="about:blank" title="Event Registration Form" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </div>
                <div class="reg-modal-footer">
                    <span>✓ Free entry for all campus engineering students.</span>
                    <span>Trouble viewing or need Google login? <a href="#" target="_blank" rel="noopener noreferrer" id="regModalFooterLink">Open form directly ↗</a></span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Build tabs
        const tabsContainer = overlay.querySelector('#regModalTabs');
        Object.entries(EVENT_CONFIG).forEach(([key, cfg]) => {
            const tabBtn = document.createElement('button');
            tabBtn.type = 'button';
            tabBtn.className = 'reg-modal-tab';
            tabBtn.setAttribute('data-tab-event', key);
            tabBtn.textContent = `${cfg.icon} ${cfg.shortTitle}`;
            tabBtn.addEventListener('click', () => {
                openRegistrationModal(key);
            });
            tabsContainer.appendChild(tabBtn);
        });

        // Close button
        const closeBtn = overlay.querySelector('#regModalCloseBtn');
        closeBtn.addEventListener('click', closeRegistrationModal);

        // Click outside dialog to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeRegistrationModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeRegistrationModal();
            }
        });

        return overlay;
    }

    function openRegistrationModal(rawKey) {
        const key = resolveEventKey(rawKey) || 'hackathon';
        const cfg = EVENT_CONFIG[key];
        if (!cfg) return;

        activeEventKey = key;
        const overlay = ensureRegistrationModal();
        const badge = overlay.querySelector('#regModalBadge');
        const icon = overlay.querySelector('#regModalIcon');
        const name = overlay.querySelector('#regModalName');
        const newTabBtn = overlay.querySelector('#regModalNewTabBtn');
        const footerLink = overlay.querySelector('#regModalFooterLink');
        const loader = overlay.querySelector('#regModalLoader');
        const iframe = overlay.querySelector('#regModalIframe');
        const tabs = overlay.querySelectorAll('.reg-modal-tab');

        badge.textContent = cfg.badge;
        icon.textContent = cfg.icon;
        name.textContent = cfg.title;
        newTabBtn.href = cfg.formUrl;
        footerLink.href = cfg.formUrl;

        tabs.forEach(tab => {
            if (tab.getAttribute('data-tab-event') === key) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Show loader and set iframe src
        loader.classList.remove('hidden');
        iframe.src = cfg.embedUrl;

        let loaded = false;
        iframe.onload = () => {
            loaded = true;
            loader.classList.add('hidden');
        };

        // Safety fallback: if onload doesn't trigger in 3 seconds, hide loader
        setTimeout(() => {
            if (!loaded) {
                loader.classList.add('hidden');
            }
        }, 3000);

        // Lock scroll & show
        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');
    }

    function closeRegistrationModal() {
        const overlay = document.getElementById('regModalOverlay');
        if (!overlay) return;

        overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset iframe after animation
        setTimeout(() => {
            const iframe = overlay.querySelector('#regModalIframe');
            if (iframe) iframe.src = 'about:blank';
        }, 300);
    }

    // Attach click events to all event registration triggers across the website
    function bindRegistrationButtons() {
        // 1. Elements with data-event attribute
        document.querySelectorAll('[data-event]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openRegistrationModal(el.getAttribute('data-event'));
            });
        });

        // 2. Event card CTAs on events.html (by card id)
        const eventCardMap = {
            'quiz': 'aptitude',
            'debate': 'debate',
            'video': 'video',
            'hunt': 'hunt',
            'hackathon': 'hackathon'
        };

        Object.entries(eventCardMap).forEach(([cardId, eventKey]) => {
            const card = document.getElementById(cardId);
            if (card) {
                const actionBtn = card.querySelector('.card-action a, .btn');
                if (actionBtn && !actionBtn.hasAttribute('data-event')) {
                    actionBtn.setAttribute('data-event', eventKey);
                    actionBtn.href = EVENT_CONFIG[eventKey].formUrl;
                    actionBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openRegistrationModal(eventKey);
                    });
                }
            }
        });

        // 3. Specific track cards on register.html
        const regCardMap = {
            'card-quiz': 'aptitude',
            'card-debate': 'debate',
            'card-video': 'video',
            'card-hunt': 'hunt',
            'card-hackathon': 'hackathon'
        };

        Object.entries(regCardMap).forEach(([cardId, eventKey]) => {
            const card = document.getElementById(cardId);
            if (card) {
                const actionBtn = card.querySelector('a.btn');
                if (actionBtn && !actionBtn.hasAttribute('data-event')) {
                    actionBtn.setAttribute('data-event', eventKey);
                    actionBtn.href = EVENT_CONFIG[eventKey].formUrl;
                    actionBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openRegistrationModal(eventKey);
                    });
                }
            }
        });

        // 4. Central Registration CTA on register.html
        const centralRegBtn = document.querySelector('a[href*="forms.google.com"]');
        if (centralRegBtn && !centralRegBtn.hasAttribute('data-event')) {
            centralRegBtn.href = EVENT_CONFIG['hackathon'].formUrl;
            centralRegBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openRegistrationModal('hackathon');
            });
        }
    }

    bindRegistrationButtons();

    // 5. URL Param Event Selector (for register.html & direct links)
    const params = new URLSearchParams(window.location.search);
    const selectedEvent = params.get('event') || params.get('register');
    if (selectedEvent) {
        const resolved = resolveEventKey(selectedEvent);
        const eventDropdown = document.getElementById('eventSelect');
        if (eventDropdown && resolved) {
            eventDropdown.value = resolved;
        }

        const eventCardTarget = document.getElementById(`card-${selectedEvent}`) ||
                                document.getElementById(`card-${resolved}`) ||
                                document.getElementById(selectedEvent) ||
                                document.getElementById(resolved);

        if (eventCardTarget) {
            eventCardTarget.scrollIntoView({ behavior: 'smooth' });
            eventCardTarget.style.borderColor = 'var(--gold)';
            eventCardTarget.style.boxShadow = '0 0 25px rgba(245, 197, 24, 0.4)';
        }

        // Automatically open registration modal for the selected event if on register.html or events.html
        if (resolved) {
            setTimeout(() => {
                openRegistrationModal(resolved);
            }, 400);
        }
    }

    // Expose registration modal helpers globally
    window.openRegistrationModal = openRegistrationModal;
    window.closeRegistrationModal = closeRegistrationModal;
});

