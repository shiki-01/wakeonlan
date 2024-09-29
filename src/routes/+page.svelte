<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import DeviceForm from '$lib/components/DeviceForm.svelte';
	import Device from '$lib/components/Device.svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { wakeOnLan, shutdownComputer, sleepComputer } from '$lib/utils/api';
	import {
		getDevices,
		deleteDevice as ddl
	} from '$lib/utils/device';
	import { lang, user, devices, edit, connect, isDelete } from '$lib/store';
	import langs from '$lib/utils/langs';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';

	const {
		Root: CRoot,
		Header: CHeader,
		Title: CTitle,
		Description: CDesc,
		Footer: CFooter
	} = Card;
	const { Root: DIRoot, Content: DIContent } = Dialog;
	const { Root: DRRoot, Content: DRContent } = Drawer;

	async function deleteDevice() {
		await ddl(editId);
	}

	onMount(() => {
		onAuthStateChanged(auth, async (us) => {
			user.set(us);
			if (us) {
				await getDevices();
			} else {
				devices.set([]);
				toast.error('Please login to view your devices');
			}
		});
	});

	let editId = '';
	let deviceName = '';
	let os = '';
	let ipAddress = '';
	let deviceIp = '';
	let mac = '';
	let port = '';

	const isDesktop = mediaQuery('(min-width: 768px)');
</script>

<div class="mt-5 flex flex-col gap-4">
	{#if $devices.length === 0}
		<Device skeleton />
	{:else}
		{#each $devices as device}
			<Device
				bind:device={device}
				bind:edit={$edit}
				bind:connect={$connect}
				bind:editId
				bind:os
				bind:deviceName
				bind:ipAddress
				bind:deviceIp
				bind:mac
				bind:port
			/>
		{/each}
	{/if}
</div>

<svelte:component this={$isDesktop ? DIRoot : DRRoot} bind:open={$connect}>
	<svelte:component
		this={$isDesktop ? DIContent : DRContent}
		class={$isDesktop ? '' : 'pb-10'}
	>
		<CRoot class="w-full border-none">
			<CHeader>
				<CTitle>
					{langs.Connect.title[$lang]}
				</CTitle>
				<CDesc>
					{langs.Connect.desc[$lang]}
				</CDesc>
			</CHeader>
			<CFooter class="flex gap-2">
				<Button
					on:click={() => {
							wakeOnLan(mac, ipAddress, parseInt(port), deviceIp);
							$connect = !$connect;
						}}
				>
					{langs.Connect.forms.wol[$lang]}
				</Button>
				<Button
					on:click={() => {
							shutdownComputer(deviceIp, Number(port));
							$connect = !$connect;
						}}
				>
					{langs.Connect.forms.shutdown[$lang]}
				</Button>
				<Button
					on:click={() => {
							sleepComputer(deviceIp, Number(port));
							$connect = !$connect;
						}}
				>
					{langs.Connect.forms.sleep[$lang]}
				</Button>
			</CFooter>
		</CRoot>
	</svelte:component>
</svelte:component>

<svelte:component this={$isDesktop ? DIRoot : DRRoot} bind:open={$edit}>
	<svelte:component
		this={$isDesktop ? DIContent : DRContent}
		class={$isDesktop ? '' : 'pb-5'}
	>
		<DeviceForm
			device={{
				id: editId,
				name: deviceName,
				os: os,
				ip: ipAddress,
				deviceIp: deviceIp,
				mac: mac,
				port: port
			}}
			bind:edit={$edit}
			bind:isDelete={$isDelete}
		/>
	</svelte:component>
</svelte:component>

<svelte:component this={$isDesktop ? DIRoot : DRRoot} bind:open={$isDelete}>
	<svelte:component
		this={$isDesktop ? DIContent : DRContent}
		class={$isDesktop ? 'w-[350px]' : 'flex justify-center pb-10'}
	>
		<CRoot class="w-full border-none">
			<CHeader>
				<CTitle>
					{langs.Delete.title[$lang]}
				</CTitle>
				<CDesc>
					{langs.Delete.desc[$lang]}
				</CDesc>
			</CHeader>
			<CFooter class="flex gap-2">
				<Button
					on:click={() => {
						deleteDevice();
						$isDelete = !$isDelete;
					}}
				>
					{langs.Delete.forms.yes[$lang]}
				</Button>
				<Button
					on:click={() => {
						$isDelete = !$isDelete;
					}}
				>
					{langs.Delete.forms.no[$lang]}
				</Button>
			</CFooter>
		</CRoot>
	</svelte:component>
</svelte:component>
