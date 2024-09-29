<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from "$lib/components/ui/select";
	import { addDeviceEdit, addDevice as adl, setEdit, editDevice as edl } from '$lib/utils/device';
	import Icon from '$lib/components/Icon.svelte';
	import { lang } from '$lib/store';
	import langs from '$lib/utils/langs';

	const {
		Root: CRoot,
		Content: CContent,
		Header: CHeader,
		Title: CTitle,
		Description: CDesc,
		Footer: CFooter
	} = Card;
	const {
		Root: SRoot,
		Trigger: STrigger,
		Value: SValue,
		Content: SContent,
		Group: SGroup,
		Item: SItem
	} = Select;

	export let mode: 'add' | 'edit' = 'edit';
	export let edit = false;
	export let isDelete = false;
	export let device = {
		id: '',
		os: '',
		name: '',
		ip: '',
		deviceIp: '',
		mac: '',
		port: ''
	};

	let { id, name, os, ip, deviceIp, mac, port } = device;
	let selected: { disabled: boolean, value: string, label: string } | undefined = { disabled: false, value: os, label: os };

	$: os = selected?.value || os;

	async function handleDevice() {
		if (mode === 'add') {
			addDeviceEdit(name, os, ip, deviceIp, mac, port);
			await adl();
		} else {
			setEdit(name, os, ip, deviceIp, mac, port);
			await edl(id);
		}
	}
</script>

<CRoot class="w-full border-none flex flex-col items-center justify-center text-left max-w-[500px] mx-auto">
	<CHeader class="py-4 w-full">
		<CTitle class="flex items-center gap-2">
			{#if mode === 'add'}
				<Icon name="PackagePlus" class="w-4 h-4" />
				{langs['New Device'].base[$lang]}
			{:else}
				<Icon name="PackageOpen" class="w-4 h-4" />
				{langs.Edit.title[$lang]}
			{/if}
		</CTitle>
		<CDesc>
			{#if mode === 'add'}
				{langs['New Device'].desc[$lang]}
			{:else}
				{langs.Edit.desc[$lang]}
			{/if}
		</CDesc>
	</CHeader>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="deviceName">
				{langs['New Device'].forms.name[$lang]}
				<span class="text-red-400">*</span>
			</Label>
			<Input
				id="deviceName"
				placeholder={langs['New Device'].forms.name.placeholder[$lang]}
				bind:value={name}
			/>
		</div>
	</CContent>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="os">
				{langs['New Device'].forms.os[$lang]}
				<span class="text-red-400">*</span>
			</Label>
			<SRoot bind:selected>
				<STrigger>
					<SValue placeholder={langs['New Device'].forms.os[$lang]}>{os}</SValue>
				</STrigger>
				<SContent>
					<SGroup>
						{#each ['Windows', 'Mac', 'Linux'] as option}
							<SItem value={option}>
								{option}
							</SItem>
						{/each}
					</SGroup>
				</SContent>
			</SRoot>
		</div>
	</CContent>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="ipAddress">
				{langs['New Device'].forms.ip[$lang]}
			</Label>
			<Input
				id="ipAddress"
				placeholder={langs['New Device'].forms.ip.placeholder[$lang]}
				bind:value={ip}
			/>
		</div>
	</CContent>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="deviceIp">
				{langs['New Device'].forms.deviceIP[$lang]}
				<span class="text-red-400">*</span>
			</Label>
			<Input
				id="deviceIp"
				placeholder={langs['New Device'].forms.deviceIP.placeholder[$lang]}
				bind:value={deviceIp}
			/>
		</div>
	</CContent>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="mac">
				{langs['New Device'].forms.mac[$lang]}
				<span class="text-red-400">*</span>
			</Label>
			<Input
				id="mac"
				placeholder={langs['New Device'].forms.mac.placeholder[$lang]}
				bind:value={mac}
			/>
		</div>
	</CContent>
	<CContent class="py-2 w-full">
		<div class="flex w-full flex-col gap-1.5">
			<Label id="port">
				{langs['New Device'].forms.port[$lang]}
				<span class="text-red-400">*</span>
			</Label>
			<Input
				id="port"
				placeholder={langs['New Device'].forms.port.placeholder[$lang]}
				bind:value={port}
			/>
		</div>
	</CContent>
	<CFooter class="flex gap-2 w-full pt-2 md:pt-4">
		<Button
			class="flex gap-2"
			on:click={() => {
				handleDevice();
				edit = !edit;
			}}
		>
			{langs['New Device'].forms.save[$lang]}
			<Icon name="Save" class="w-4 h-4" />
		</Button>
		<Button
			class="flex gap-2"
			on:click={() => {
				edit = !edit;
			}}
		>
			{langs['New Device'].forms.cancel[$lang]}
			<Icon name="X" class="w-4 h-4" />
		</Button>
		{#if mode === 'edit'}
			<Button
				class="flex gap-2"
				on:click={() => {
				edit = !edit;
				isDelete = !isDelete;
			}}
			>
				{langs.Edit.forms.delete[$lang]}
				<Icon name="Trash" class="w-4 h-4" />
			</Button>
		{/if}
	</CFooter>
</CRoot>
