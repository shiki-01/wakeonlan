import type { UserInfo } from "firebase/auth";
import { type Writable, writable } from 'svelte/store';
import type { Device } from '$lib/types';

export const user: Writable<UserInfo | null> = writable({} as UserInfo | null);
export const devices: Writable<Device[]> = writable([]);
export const theme: Writable<'light' | 'dark' | 'system'> = writable('system');

export const open: Writable<boolean> = writable(false);
export const edit: Writable<boolean> = writable(false);
export const connect: Writable<boolean> = writable(false);
export const isDelete: Writable<boolean> = writable(false);

export const lang: Writable<'ja' | 'en'> = writable('ja');

export const isCommand: Writable<Device | null> = writable(null);
