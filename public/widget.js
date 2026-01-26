(function () {
    // Infer the base URL from the script source
    var scriptSource = document.currentScript ? document.currentScript.src : 'https://now-hiring.vercel.app'; // Fallback
    var baseUrl = new URL(scriptSource).origin;

    // 1. Create the floating trigger button
    var triggerBtn = document.createElement('button');
    triggerBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
    Apply Now
  `;

    // Styles for the button
    Object.assign(triggerBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '999998',
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

    document.body.appendChild(triggerBtn);

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

    // Auto-open on page load if it's the home page (root)
    // You can adjust this logic to fit specific needs
    if (window.location.pathname === '/') {
        // Delay slightly to be polite
        setTimeout(openModal, 1000);
    }

    // Listen for close message from iframe
    window.addEventListener('message', function (event) {
        // Be careful with origin check in dev vs prod, but good practice to check
        // if (event.origin !== baseUrl) return; 

        if (event.data === 'close-widget') {
            modalContainer.style.opacity = '0';
            modalContainer.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
    });

})();
