(function () {
    // Infer the base URL from the script source
    var scriptSource = document.currentScript ? document.currentScript.src : 'https://now-hiring-eta.vercel.app'; // Fallback
    var baseUrl = new URL(scriptSource).origin;

    // 1. Create the floating trigger container
    var widgetContainer = document.createElement('div');
    widgetContainer.id = 'hiring-widget-trigger';
    Object.assign(widgetContainer.style, {
        zIndex: '999998',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });

    var triggerBtn = document.createElement('button');
    triggerBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
    <span>Apply Now</span>
  `;

    // Styles for the button
    Object.assign(triggerBtn.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#7c3aed', // Primary purple
        color: '#ffffff',
        border: 'none',
        borderRadius: '50px',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: '600',
        fontSize: '16px',
        transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
    });

    triggerBtn.onmouseenter = function () { triggerBtn.style.transform = 'scale(1.05) translateY(-2px)'; };
    triggerBtn.onmouseleave = function () { triggerBtn.style.transform = 'scale(1) translateY(0)'; };

    widgetContainer.appendChild(triggerBtn);

    // Find footer or fallback to body
    var footer = document.querySelector('footer') || document.querySelector('.site-footer') || document.querySelector('#footer');

    if (footer) {
        // Stationary Footer Mode
        Object.assign(widgetContainer.style, {
            position: 'relative',
            bottom: '0',
            right: '0',
            margin: '20px auto',
            width: 'fit-content',
            justifyContent: 'center'
        });
        footer.appendChild(widgetContainer);
    } else {
        // Floating Mode (Fallback)
        Object.assign(widgetContainer.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
        });
        document.body.appendChild(widgetContainer);
    }

    // 2. Create the Modal Container (Iframe)
    var modalContainer = document.createElement('div');
    Object.assign(modalContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '999999',
        visibility: 'hidden',
        opacity: '0',
        transition: 'opacity 0.3s ease, visibility 0.3s',
        backdropFilter: 'blur(2px)', // Adds a blur to the host site
    });

    var iframe = document.createElement('iframe');
    var currentSite = window.location.href;
    iframe.src = baseUrl + '/embed?source=' + encodeURIComponent(currentSite);
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: 'transparent',
    });
    iframe.allowTransparency = "true";

    modalContainer.appendChild(iframe);
    document.body.appendChild(modalContainer);

    // 3. Logic to open/close
    function openModal() {
        modalContainer.style.visibility = 'visible';
        modalContainer.style.opacity = '1';
        document.body.style.overflow = 'hidden';
    }

    triggerBtn.onclick = openModal;

    // Auto-open on load (ONLY ON ROOT PAGE and ONLY IF NOT SEEN BEFORE)
    var isRoot = window.location.pathname === '/' || window.location.pathname === '/index.html';
    var hasSeenWidget = localStorage.getItem('hiring-widget-seen');

    if (isRoot && !hasSeenWidget) {
        if (document.readyState === 'complete') {
            setTimeout(openModal, 1200);
        } else {
            window.addEventListener('load', function () {
                setTimeout(openModal, 1200);
            });
        }
    }

    // Listen for close message from iframe
    window.addEventListener('message', function (event) {
        if (event.data === 'close-widget') {
            modalContainer.style.opacity = '0';
            modalContainer.style.visibility = 'hidden';
            document.body.style.overflow = '';

            // Mark as seen in localStorage
            localStorage.setItem('hiring-widget-seen', 'true');

            // Switch to Icon Only mode after first close
            triggerBtn.classList.add('widget-btn-icon-only');
        }
    });

})();
