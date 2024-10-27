export const isBrowser = typeof window !== "undefined";

export const getOnlineStatus = () => {
  return isBrowser ? navigator.onLine : true;
};

export const getLocalStorage = () => {
  return isBrowser ? window.localStorage : null;
};
