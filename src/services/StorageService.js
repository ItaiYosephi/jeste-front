'use strict';

// Save data to local storage
export function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

// Load data from local storage
export function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return (val) ? JSON.parse(val) : null;
}

// Delete from local storage
export function removeFromStorage(key) {
    localStorage.removeItem(key);
}

export default {
    loadFromStorage,
    saveToStorage,
    removeFromStorage
}