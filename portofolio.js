// Merged connect button behavior for both layouts (handles multiple buttons)
document.querySelectorAll('.connectBtn').forEach(btn => {
    btn.addEventListener('click', function () {
        const name = prompt('Your name / Magacaaga (optional)');
        if (name && name.trim()) {
            alert('Thanks, ' + name + '! I\'ll reach out soon.');
        } else {
            alert('Waad ku mahadsantahay riixitaanka batoonka! Waxaad igala soo xiriiri kartaa ciwaanka hoose ama baraha bulshada.\nThanks! I\'ll reach out soon.');
        }
    });
});

// Layout toggle: switch between original and alternate layouts with animation
const layoutToggle = document.getElementById('layoutToggle');
const originalLayout = document.getElementById('originalLayout');
const alternateLayout = document.getElementById('alternateLayout');

function animateLayoutSwitch(showEl, hideEl) {
    if (!showEl || !hideEl) return;
    if (showEl === hideEl) return;

    // If hideEl is visible, animate it out then hide
    if (hideEl.style.display !== 'none') {
        hideEl.classList.remove('fade-in');
        hideEl.classList.add('fade-out');
        const onHidden = () => {
            hideEl.style.display = 'none';
            hideEl.classList.remove('fade-out');
            hideEl.removeEventListener('animationend', onHidden);
        };
        hideEl.addEventListener('animationend', onHidden);
    } else {
        hideEl.style.display = 'none';
    }

    // Show target and animate in
    showEl.style.display = '';
    showEl.classList.remove('fade-out');
    showEl.classList.add('fade-in');
    const onShown = () => { showEl.classList.remove('fade-in'); showEl.removeEventListener('animationend', onShown); };
    showEl.addEventListener('animationend', onShown);
}

if (layoutToggle && originalLayout && alternateLayout) {
    layoutToggle.addEventListener('click', function () {
        const showingAlternate = alternateLayout.style.display !== 'none';
        if (showingAlternate) {
            animateLayoutSwitch(originalLayout, alternateLayout);
        } else {
            animateLayoutSwitch(alternateLayout, originalLayout);
        }
    });
}

// Placeholder: additional shared JS behaviors can be added here.

// Smooth nav behavior: scroll to the correct section in the active layout
document.querySelectorAll('header nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const raw = (this.getAttribute('href') || '').replace('#', '');

        // Mapping candidates for each logical section
        const candidates = {
            'home': ['home', 'home-alt'],
            'skills': ['skills', 'skills-alt'],
            'projects': ['projects'],
            'contact': []
        };

        const tryIds = candidates[raw] || [raw];

        // Helper to check if an element is visible (not inside display:none)
        const isVisible = el => !!(el && el.offsetParent !== null);

        // Find a matching element; if it's in the hidden layout, toggle layout first
        let targetEl = null;
        for (const id of tryIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            // If element is visible, use it
            if (isVisible(el)) { targetEl = el; break; }
            // If element exists but hidden, animate its layout into view
            const ancestorMain = el.closest('main');
            if (ancestorMain) {
                if (ancestorMain.id === 'alternateLayout') {
                    animateLayoutSwitch(alternateLayout, originalLayout);
                } else if (ancestorMain.id === 'originalLayout') {
                    animateLayoutSwitch(originalLayout, alternateLayout);
                }
                targetEl = el;
                break;
            }
        }

        // If no target found and user clicked Contact, scroll to footer
        if (!targetEl && raw === 'contact') {
            targetEl = document.querySelector('footer');
            // ensure original layout visible so footer position is predictable
            originalLayout.style.display = '';
            alternateLayout.style.display = 'none';
        }

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});