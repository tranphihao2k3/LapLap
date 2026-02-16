'use client';

import { useEffect } from 'react';

export default function FacebookMessenger() {
    useEffect(() => {
        // Load Facebook SDK
        const loadFacebookSDK = () => {
            if (window.FB) {
                window.FB.XFBML.parse();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';

            // Insert script
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode?.insertBefore(script, firstScript);

            // Initialize Facebook SDK
            window.fbAsyncInit = function () {
                window.FB.init({
                    xfbml: true,
                    version: 'v18.0'
                });
            };
        };

        loadFacebookSDK();
    }, []);

    return (
        <>
            {/* Facebook SDK Root */}
            <div id="fb-root"></div>

            {/* Messenger Chat Plugin */}
            <div
                className="fb-customerchat"
                {...{
                    attribution: "setup_tool",
                    page_id: "61582947329036",
                    theme_color: "#0084ff",
                    logged_in_greeting: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
                    logged_out_greeting: "Xin chào! Chúng tôi có thể giúp gì cho bạn?"
                } as any}
            ></div>
        </>
    );
}

// TypeScript declarations
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}
