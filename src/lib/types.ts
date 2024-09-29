import * as icons from 'lucide-svelte';

interface Device {
	id: string;
	name: string;
	os: 'Windows' | 'Linux' | 'Mac' | '';
	ip: string;
	deviceIp: string;
	mac: string;
	port: string;
	isActive?: boolean;
}

interface Status {
	online: boolean;
	message: string;
}

type IconType = keyof typeof icons;

export type { Device, Status, IconType };