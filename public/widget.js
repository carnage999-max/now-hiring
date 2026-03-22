(function () {
    // Infer the base URL from the script source
    var scriptElement = document.currentScript;
    var scriptSource = scriptElement ? scriptElement.src : 'https://now-hiring-eta.vercel.app'; // Fallback
    var baseUrl = new URL(scriptSource).origin;

    // Configuration from attributes
    var btnName = scriptElement && (scriptElement.getAttribute('name') || scriptElement.getAttribute('data-name'));
    var buttonText = btnName ? btnName : 'Now Hiring';

    var iconName = scriptElement && (scriptElement.getAttribute('icon') || scriptElement.getAttribute('data-icon'));
    var emojiAttr = scriptElement && (scriptElement.getAttribute('emoji') || scriptElement.getAttribute('data-emoji'));
    
    var triggerSelector = scriptElement && (scriptElement.getAttribute('trigger') || scriptElement.getAttribute('data-trigger'));
    var isManual = scriptElement && (scriptElement.getAttribute('manual') === 'true' || scriptElement.getAttribute('data-manual') === 'true');

    var iconAttr = iconName ? iconName : 'Briefcase';
    var kebabIcon = iconAttr.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    // 1. Create the Modal Container (Iframe)
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
    
    var iframeSrc = baseUrl + '/embed?source=' + encodeURIComponent(currentSite);
    if (!emojiAttr || iconName) iframeSrc += '&icon=' + encodeURIComponent(iconAttr);
    if (emojiAttr) iframeSrc += '&data-emoji=' + encodeURIComponent(emojiAttr);
    
    iframe.src = iframeSrc;
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: 'transparent',
    });
    iframe.allowTransparency = "true";

    modalContainer.appendChild(iframe);
    document.body.appendChild(modalContainer);

    // 2. Logic to open/close
    function openModal() {
        modalContainer.style.visibility = 'visible';
        modalContainer.style.opacity = '1';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalContainer.style.opacity = '0';
        modalContainer.style.visibility = 'hidden';
        document.body.style.overflow = '';
    }

    // Expose Global API
    window.HiringWidget = {
        open: openModal,
        close: closeModal
    };

    // 3. Create the floating trigger container (unless in manual mode)
    var triggerBtn = null;
    if (!isManual) {
        var widgetContainer = document.createElement('div');
        widgetContainer.id = 'hiring-widget-trigger';
        Object.assign(widgetContainer.style, {
            zIndex: '999998',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });

        triggerBtn = document.createElement('button');
        var buttonInnerHtml = '';

        if (emojiAttr) {
            buttonInnerHtml += '<span style="font-size: 20px; line-height: 1; margin-right: ' + ((!emojiAttr || iconName) ? '4px' : '8px') + '; display: flex; align-items: center;">' + emojiAttr + '</span>';
        }

        if (!emojiAttr || iconName) {
            buttonInnerHtml += `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;" class="lucide lucide-briefcase">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            `;
        }

        buttonInnerHtml += '<span>' + buttonText + '</span>';
        triggerBtn.innerHTML = buttonInnerHtml;

        // Fetch custom icon if needed
        if ((!emojiAttr || iconName) && kebabIcon !== 'briefcase') {
            fetch('https://unpkg.com/lucide-static@latest/icons/' + kebabIcon + '.svg')
                .then(function(res) {
                    if (!res.ok) throw new Error('Icon not found');
                    return res.text();
                })
                .then(function(svg) {
                    if (svg.indexOf('<svg') !== -1) {
                        var svgStart = svg.indexOf('<svg');
                        var svgEnd = svg.indexOf('</svg>');
                        if (svgStart !== -1 && svgEnd !== -1) {
                            var styledSvg = svg.substring(svgStart, svgEnd + 6).replace('<svg', '<svg style="margin-right: 8px;"');
                            var existingSvg = triggerBtn.querySelector('svg');
                            if (existingSvg) {
                                existingSvg.outerHTML = styledSvg;
                            }
                        }
                    }
                })
                .catch(function(e) { console.error('Error loading widget icon:', e); });
        }

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
        triggerBtn.onclick = openModal;

        widgetContainer.appendChild(triggerBtn);

        // Find footer or fallback to body
        var footer = document.querySelector('footer') || document.querySelector('.site-footer') || document.querySelector('#footer');

        if (footer) {
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
            Object.assign(widgetContainer.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
            });
            document.body.appendChild(widgetContainer);
        }
    }

    // Bind triggers if selector provided
    if (triggerSelector) {
        var setupCustomTriggers = function() {
            var elements = document.querySelectorAll(triggerSelector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', openModal);
                elements[i].style.cursor = 'pointer';
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupCustomTriggers);
        } else {
            setupCustomTriggers();
        }
    }


    // Listen for messages from iframe
    window.addEventListener('message', function (event) {
        if (event.data === 'close-widget') {
            closeModal();

            // Mark as seen in localStorage
            localStorage.setItem('hiring-widget-seen', 'true');

            // Switch to Icon Only mode after first close (only if default button exists)
            if (triggerBtn) {
                triggerBtn.classList.add('widget-btn-icon-only');
            }
        }
    });

})();

