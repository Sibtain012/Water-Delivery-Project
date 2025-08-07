import Cookies from 'js-cookie';

export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const COOKIE_NAMES = {
    PREFERENCES: 'cookie-preferences',
    CART: 'cart-data',
    USER_PREFERENCES: 'user-preferences',
    THEME: 'theme-preference',
} as const;

export const cookieUtils = {
    // Set cookie preferences
    setCookiePreferences: (preferences: CookiePreferences) => {
        Cookies.set(COOKIE_NAMES.PREFERENCES, JSON.stringify(preferences), { expires: 365 });
    },

    // Get cookie preferences
    getCookiePreferences: (): CookiePreferences | null => {
        const preferences = Cookies.get(COOKIE_NAMES.PREFERENCES);
        return preferences ? JSON.parse(preferences) : null;
    },

    // Check if user has accepted cookies
    hasAcceptedCookies: (): boolean => {
        return !!Cookies.get(COOKIE_NAMES.PREFERENCES);
    },

    // Save cart data to cookies
    saveCartToCookies: (cartData: any) => {
        const preferences = cookieUtils.getCookiePreferences();
        if (preferences?.necessary) {
            Cookies.set(COOKIE_NAMES.CART, JSON.stringify(cartData), { expires: 7 });
        }
    },

    // Get cart data from cookies
    getCartFromCookies: () => {
        const cartData = Cookies.get(COOKIE_NAMES.CART);
        return cartData ? JSON.parse(cartData) : null;
    },

    // Save user preferences
    saveUserPreferences: (preferences: any) => {
        const cookiePrefs = cookieUtils.getCookiePreferences();
        if (cookiePrefs?.necessary) {
            Cookies.set(COOKIE_NAMES.USER_PREFERENCES, JSON.stringify(preferences), { expires: 365 });
        }
    },

    // Get user preferences
    getUserPreferences: () => {
        const preferences = Cookies.get(COOKIE_NAMES.USER_PREFERENCES);
        return preferences ? JSON.parse(preferences) : null;
    },

    // Clear all cookies
    clearAllCookies: () => {
        Object.values(COOKIE_NAMES).forEach(cookieName => {
            Cookies.remove(cookieName);
        });
    }
};