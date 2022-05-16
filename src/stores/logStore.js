import { writable } from 'svelte/store';
export let filteredLogNames = writable([]);
export let filteredLogContent = writable([]);
export let searchDirectory = writable([]);
export let searchAgent = writable([]);