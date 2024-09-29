import { theme } from '$lib/store';
import type { IconType } from '$lib/types';

const themes: {name: 'light' | 'dark' | 'system', icon: IconType}[] = [
	{ name: 'light', icon: 'Sun' },
	{ name: 'dark', icon: 'Moon' },
	{ name: 'system', icon: 'SunMoon' }
]

function setMode(mode: 'light' | 'dark' | 'system') {
	if (typeof window === 'undefined') return;
	window.document.documentElement.classList.remove('dark', 'light');
	if (mode === 'system') {
		resetMode();
	} else {
		window.document.documentElement.classList.add(mode);
		window.localStorage.setItem('mode', mode);
		theme.set(mode);
	}
}

function resetMode() {
	if (typeof window === 'undefined') return;
	window.document.documentElement.classList.remove('dark', 'light');
	const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	window.document.documentElement.classList.add(systemMode);
	window.localStorage.setItem('mode', 'system');
	theme.set('system');
}

function getMode() {
	if (typeof window === 'undefined') return;
	const mode: 'light' | 'dark' | 'system' =
		(window.localStorage.getItem('mode') as 'light' | 'dark' | 'system') || 'system';
	if (mode === 'system') {
		theme.set('system')
		return 'system';
	} else {
		theme.set(mode);
		return mode as 'light' | 'dark';
	}
}

export { themes, setMode, resetMode, getMode };
