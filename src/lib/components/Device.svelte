<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Device } from '$lib/types';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Icon from '$lib/components/Icon.svelte';
	import { lang , isCommand } from '$lib/store';
	import langs from '$lib/utils/langs';

	const {
		Root: CRoot,
		Content: CContent,
		Header: CHeader,
		Title: CTitle,
		Description: CDesc,
		Footer: CFooter
	} = Card;

	export let edit = false;
	export let connect = false;
	export let device: Device = {
		id: '',
		name: '',
		os: '',
		ip: '',
		deviceIp: '',
		mac: '',
		port: '',
		isActive: false
	};
	export let editId = '';
	export let deviceName = '';
	export let os = '';
	export let ipAddress = '';
	export let deviceIp = '';
	export let mac = '';
	export let port = '';

	export let skeleton = false;

	function startEdit(devi: Device) {
		editId = devi.id;
		deviceName = devi.name;
		os = devi.os;
		ipAddress = devi.ip;
		deviceIp = devi.deviceIp;
		mac = devi.mac;
		port = devi.port;
	}
</script>

{#if skeleton}
	{#each [0, 1] as i}
		<CRoot class="{i.toString()} bg-slate-100 dark:bg-slate-900">
			<CHeader>
				<CTitle>
					<div class="flex justify-between">
						<Skeleton class="h-[20px] w-[150px] rounded-full lg:w-[200px]" />
						<Badge variant="secondary" class="flex items-center gap-1">
							<Icon name="Loader" class="w-3 h-3 animate-spin" />
							{langs.Device.loading[$lang]}
						</Badge>
					</div>
				</CTitle>
				<CDesc>
					<Skeleton class="h-[15px] w-[100px] rounded-full" />
				</CDesc>
			</CHeader>
			<CContent class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-[200px] rounded-full lg:w-[300px]" />
				<Skeleton class="h-[20px] w-[200px] rounded-full lg:w-[300px]" />
				<Skeleton class="h-[20px] w-[200px] rounded-full lg:w-[300px]" />
			</CContent>
			<CFooter class="flex gap-2">
				<Button disabled class="flex items-center gap-1">
					<Icon name="Loader" class="w-3 h-3 animate-spin" />
					{langs.Device.loading[$lang]}
				</Button>
				<Button disabled class="flex items-center gap-1">
					<Icon name="Loader" class="w-3 h-3 animate-spin" />
					{langs.Device.loading[$lang]}
				</Button>
			</CFooter>
		</CRoot>
	{/each}
{:else}
	<div
		class="cursor-default"
		role="button"
		tabindex="0"
		on:contextmenu={() => isCommand.set(device)}
	>
		<CRoot class="bg-white dark:bg-slate-900 shadow-lg">
			<CHeader>
				<CTitle>
					<div class="flex justify-between">
						<div class="flex items-center gap-2">
							{#if device.os === 'Windows'}
								<span class="iconify fa-brands--windows w-4 h-4" />
							{:else if device.os === 'Linux'}
								<span class="iconify fa-brands--linux w-4 h-4" />
							{:else if device.os === 'Mac'}
								<span class="iconify fa-brands--apple w-4 h-4" />
							{/if}
							{device.name}
						</div>
						{#if device.isActive}
							<Badge class="bg-green-500 flex items-center gap-1">
								<Icon name="Check" class="w-3 h-3" />
								{langs.Device.isActive.active[$lang]}
							</Badge>
						{:else}
							<Badge class="bg-red-500 flex items-center gap-1">
								<Icon name="X" class="w-3 h-3" />
								{langs.Device.isActive.inactive[$lang]}
							</Badge>
						{/if}
					</div>
				</CTitle>
				<CDesc>{device.ip}</CDesc>
			</CHeader>
			<CContent>
				<p>{langs.Device.info.ip[$lang]} : {device.deviceIp}</p>
				<p>{langs.Device.info.mac[$lang]} : {device.mac}</p>
				<p>{langs.Device.info.port[$lang]} : {device.port}</p>
			</CContent>
			<CFooter class="flex gap-2">
				<Button
					class="flex gap-2"
					on:click={() => {
				startEdit(device);
				connect = !connect;
			}}
				>
					{langs.Device.connect[$lang]}
					<Icon name="Link" class="w-4 h-4" />
				</Button>
				<Button
					class="flex gap-2"
					on:click={() => {
				edit = !edit;
				startEdit(device);
			}}
				>
					{langs.Device.edit[$lang]}
					<Icon name="Edit" class="w-4 h-4" />
				</Button>
			</CFooter>
		</CRoot>
	</div>
{/if}