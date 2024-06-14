import type { UserInfo } from "firebase/auth";
import { writable } from "svelte/store";

export const authStore = writable({ loggedIn: false, user: null as UserInfo | null});
export const user = writable({} as UserInfo | null);