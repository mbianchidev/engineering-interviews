const STORAGE_CHANGE_EVENT = 'interview-storage-change';

export function subscribeToStorage(onChange: () => void) {
  const target = window;
  target.addEventListener('storage', onChange);
  target.addEventListener(STORAGE_CHANGE_EVENT, onChange);
  return () => {
    target.removeEventListener('storage', onChange);
    target.removeEventListener(STORAGE_CHANGE_EVENT, onChange);
  };
}

export function notifyStorageChange(): void {
  window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
}
