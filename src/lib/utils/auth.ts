import { auth, provider } from '$lib/firebase';
import { signInWithPopup, type UserInfo } from 'firebase/auth';
import { toast } from 'svelte-sonner';
import { user, lang as Lang } from '$lib/store';
import langs from '$lib/utils/langs';

let lang: 'en' | 'ja' = 'en';

function setUserInfo(): UserInfo | null {
	let userInfo: UserInfo | null = null;
	user.subscribe((value) => {
		userInfo = value;
	});
	Lang.subscribe((value) => {
		lang = value;
	})
	return userInfo;
}

function login() {
	const userInfo: UserInfo | null = setUserInfo();
	if (userInfo) {
		auth.signOut().then(() => {
			toast.success(langs.toast.auth.logout[lang]);
		});
		return;
	}
	signInWithPopup(auth, provider)
		.then(() => {
			toast.success(langs.toast.auth.success[lang]);
		})
		.catch((error) => {
			toast.error(langs.toast.auth.error[lang]);
			console.error(error);
		});
}

export { setUserInfo, login };