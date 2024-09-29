import { toast } from 'svelte-sonner';
import type { Status } from '$lib/types';
import { lang as Lang } from '$lib/store';
import langs from '$lib/utils/langs';

async function wakeOnLan(mac: string, globalIP: string, port: number, deviceIP: string) {
	let lang: 'en' | 'ja' = 'en';
	Lang.subscribe((value) => {
		lang = value;
	});
	try {
		const body = JSON.stringify({
			mac: mac,
			globalIP: globalIP,
			port: port,
			deviceIP: deviceIP
		});

		const response = await fetch('/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body
		});
		if (response.status === 200) {
			toast.success(langs.toast.api.wol.success[lang]);
		} else {
			toast.error(langs.toast.api.wol.error[lang]);
		}
	} catch (error) {
		console.error('Error:', error);
		toast.error(langs.toast.api.wol.error[lang]);
	}
}

async function shutdownComputer(address: string, port: number) {
	let lang: 'en' | 'ja' = 'en';
	Lang.subscribe((value) => {
		lang = value;
	});
	try {
		const body = JSON.stringify({
			action: 'shutdown',
			address: address,
			port: port
		});

		const response = await fetch('/api/action', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body
		});
		if (response.status === 200) {
			toast.success(langs.toast.api.shutdown.success[lang]);
		} else {
			toast.error(langs.toast.api.shutdown.error[lang]);
		}
	} catch (error) {
		console.error('Error:', error);
		toast.error(langs.toast.api.shutdown.error[lang]);
	}
}

async function sleepComputer(address: string, port: number) {
	let lang: 'en' | 'ja' = 'en';
	Lang.subscribe((value) => {
		lang = value;
	});
	try {
		const body = JSON.stringify({
			action: 'sleep',
			address: address,
			port: port
		});

		const response = await fetch('/api/action', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body
		});
		if (response.status === 200) {
			toast.success(langs.toast.api.sleep.success[lang]);
		} else {
			toast.error(langs.toast.api.sleep.error[lang]);
		}
	} catch (error) {
		console.error('Error:', error);
		toast.error(langs.toast.api.sleep.error[lang]);
	}
}

async function checkDeviceStatus(ip: string, port: string, deviceIP: string): Promise<boolean> {
	let lang: 'en' | 'ja' = 'en';
	Lang.subscribe((value) => {
		lang = value;
	});
	try {
		const response = await fetch('/api/status', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				globalIP: ip,
				port: port,
				deviceIP: deviceIP
			})
		});
		const data: Status = await response.json();
		return data.online;
	} catch (error) {
		console.error('Error:', error);
		toast.error(langs.toast.api.check[lang]);
		return false;
	}
}

export { wakeOnLan, shutdownComputer, sleepComputer, checkDeviceStatus };
