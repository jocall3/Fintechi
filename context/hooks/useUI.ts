// context/hooks/useUI.ts
import { useState, useRef, useCallback } from 'react';
import { IllusionType, ToastNotification } from '../../types';

export const useUI = () => {
    const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => localStorage.getItem('customBackgroundUrl'));
    const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(() => (localStorage.getItem('activeIllusion') as IllusionType) || 'none');
    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);
    const toastIdCounter = useRef(0);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = toastIdCounter.current++;
        setToastNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToastNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const setCustomBackgroundUrl = useCallback((url: string | null) => {
        if (url) {
            localStorage.setItem('customBackgroundUrl', url);
            setCustomBackgroundUrlState(url);
            // Disable illusion when setting a background
            localStorage.setItem('activeIllusion', 'none');
            setActiveIllusionState('none');
        } else {
            localStorage.removeItem('customBackgroundUrl');
            setCustomBackgroundUrlState(null);
        }
    }, []);
  
    const setActiveIllusion = useCallback((illusion: IllusionType) => {
        localStorage.setItem('activeIllusion', illusion);
        setActiveIllusionState(illusion);
        if (illusion !== 'none') {
            // Remove background when setting an illusion
            localStorage.removeItem('customBackgroundUrl');
            setCustomBackgroundUrlState(null);
        }
    }, []);

    return {
        customBackgroundUrl,
        setCustomBackgroundUrl,
        activeIllusion,
        setActiveIllusion,
        toastNotifications,
        setToastNotifications,
        showToast,
    };
};