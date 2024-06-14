<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { user } from '$lib/store';
	import { auth, db } from '$lib/firebase';
	import {
		onAuthStateChanged,
		signInWithPopup,
		GoogleAuthProvider,

		type UserInfo

	} from 'firebase/auth';
	import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

	async function wakeOnLan(mac: string, address: string, port: number) {
		try {
			const body = JSON.stringify({
				mac: mac,
				address: address,
				port: port
			});

			const response = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: body
			});
			console.log(await response.json());
		} catch (error) {
			console.error('Error:', error);
		}
	}

	let userInfo: UserInfo | null = null;

	user.subscribe(($user) => {
        userInfo = $user;
    });

	async function getDevices() {
		if (!userInfo) {
			return;
		}
		const userQuery = query(collection(db, 'devices'), where('ownerId', '==', userInfo.uid));
		const querySnapshot = await getDocs(userQuery);
		devices.set(
			querySnapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						ownerId: doc.data().ownerId,
						name: doc.data().name,
						ip: doc.data().ip,
						deviceIp: doc.data().deviceIp,
						mac: doc.data().mac,
						port: doc.data().port
					}) as Device
			)
		);
	}

	function login() {
		if (userInfo) {
			auth.signOut();
			return;
		}
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log('ログイン成功');
			})
			.catch((error) => {
				console.log('ログイン失敗', error);
			});
	}

	let addName = '';
	let addIp = '';
	let addDeviceIp = '';
	let addMac = '';
	let addPort = '';

	async function addDevice() {
		if (
			addName === '' ||
			addIp === '' ||
			addDeviceIp === '' ||
			addMac === '' ||
			addPort === '' ||
			!userInfo
		) {
			return;
		}
		const newDevice = {
			ownerId: userInfo.uid,
			name: addName,
			ip: addIp,
			deviceIp: addDeviceIp,
			mac: addMac,
			port: addPort
		};
		addDoc(collection(db, 'devices'), newDevice);
		addName = '';
		addIp = '';
		addDeviceIp = '';
		addMac = '';
		addPort = '';
		await getDevices();
	}

	async function deleteDevice() {
		if (!userInfo) {
			return;
		}
		const device = doc(db, 'devices', editId);
		deleteDoc(device);
		await getDevices();
	}

	interface Device {
		id: string;
		ownerId?: string;
		name: string;
		ip: string;
		deviceIp: string;
		mac: string;
		port: string;
	}

	let devices = writable<Device[]>([]);

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			userInfo = user;
			if (user) {
				await getDevices();
			} else {
				devices.set([]);
			}
		});
	});

	let open = false;
	let edit = false;
	let editId = '';
	let deviceName = '';
	let ipAddress = '';
	let deviceIp = '';
	let mac = '';
	let port = '';

	function startEdit(device: Device) {
		editId = device.id;
		deviceName = device.name;
		ipAddress = device.ip;
		deviceIp = device.deviceIp;
		mac = device.mac;
		port = device.port;
		edit = true;
	}
	const isDesktop = mediaQuery('(min-width: 768px)');
</script>

<div class="flex w-full items-center justify-between">
	<div class="flex-1 items-center gap-2">
		{#if $isDesktop}
			<Dialog.Root bind:open>
				<Dialog.Trigger>New Device</Dialog.Trigger>
				<Dialog.Content class="w-[350px]">
					<Card.Root class="w-full border-none">
						<Card.Header>
							<Card.Title>IP Setting</Card.Title>
							<Card.Description>Settings related to ip address</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label id="deviceName">Device Name</Label>
								<Input id="deviceName" placeholder="enter your key" bind:value={addName} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label id="ipAddress">Host Name / IP address / Broadcast ddress</Label>
								<Input id="ipAddress" placeholder="enter your key" bind:value={addIp} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="dAddress">Device IP address</Label>
								<Input id="dAddress" placeholder="enter your key" bind:value={addDeviceIp} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="mac">MAC Address</Label>
								<Input id="mac" placeholder="enter your key" bind:value={addMac} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="port">Number your Port</Label>
								<Input id="port" placeholder="enter your key" bind:value={addPort} />
							</div>
						</Card.Content>
						<Card.Footer class="flex gap-2">
							<Button
								on:click={() => {
									addDevice();
									open = !open;
								}}>Save</Button
							>
							<Button
								on:click={() => {
									open = !open;
								}}>Cancel</Button
							>
						</Card.Footer>
					</Card.Root>
				</Dialog.Content>
			</Dialog.Root>
		{:else}
			<Drawer.Root bind:open>
				<Drawer.Trigger>New Device</Drawer.Trigger>
				<Drawer.Content class="flex justify-center">
					<Card.Root class="w-full border-none">
						<Card.Header>
							<Card.Title>IP Setting</Card.Title>
							<Card.Description>Settings related to ip address</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">Host Name / IP address / Broadcast ddress</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">Device IP address</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">MAC Address</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">Number your Port</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Footer class="flex gap-2">
							<Button>Save</Button>
							<Button
								on:click={() => {
									open = !open;
								}}>Cancel</Button
							>
						</Card.Footer>
					</Card.Root>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	</div>
	<div class="flex items-center gap-2">
		<Button on:click={login}>{userInfo ? 'log out' : 'log in'}</Button>
		{#if userInfo}
			<Avatar.Root>
				<Avatar.Image src={userInfo.photoURL} alt={userInfo.displayName} />
			</Avatar.Root>
		{/if}
	</div>
</div>

<div class="mt-4 flex flex-col gap-4">
	{#if $devices.length === 0}
		<p>No devices found</p>
	{:else}
		{#each $devices as device}
			<Card.Root>
				<Card.Header>
					<Card.Title>{device.name}</Card.Title>
					<Card.Description>{device.ip}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Device IP : {device.deviceIp}</p>
					<p>Port: {device.port}</p>
				</Card.Content>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							wakeOnLan(device.mac, device.ip, parseInt(device.port));
						}}>Connect</Button
					>
					<Button
						on:click={() => {
							edit = !edit;
							startEdit(device);
						}}>Edit</Button
					>
				</Card.Footer>
			</Card.Root>
		{/each}
	{/if}
</div>

{#if edit}
	{#if $isDesktop}
		<Dialog.Root bind:open={edit}>
			<Dialog.Trigger>Edit Device</Dialog.Trigger>
			<Dialog.Content class="w-[350px]">
				<Card.Root class="w-full border-none">
					<Card.Header>
						<Card.Title>IP Editing</Card.Title>
						<Card.Description>Settings related to ip address</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label id="deviceName">Device Name</Label>
							<Input id="deviceName" placeholder="enter your key" bind:value={deviceName} />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label id="ipAddress">Host Name / IP address / Broadcast ddress</Label>
							<Input id="ipAddress" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="dAddress">Device IP address</Label>
							<Input id="dAddress" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="mac">MAC Address</Label>
							<Input id="mac" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="port">Number your Port</Label>
							<Input id="port" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Footer class="flex gap-2">
						<Button
							on:click={() => {
								edit = !edit;
							}}>Save</Button
						>
						<Button
							on:click={() => {
								edit = !edit;
							}}>Cancel</Button
						>
						<Button
							on:click={() => {
								deleteDevice();
								edit = !edit;
							}}>Delete</Button
						>
					</Card.Footer>
				</Card.Root>
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<Drawer.Root bind:open={edit}>
			<Drawer.Trigger>Edit Device</Drawer.Trigger>
			<Drawer.Content class="flex justify-center">
				<Card.Root class="w-full border-none">
					<Card.Header>
						<Card.Title>IP Editing</Card.Title>
						<Card.Description>Settings related to ip address</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label id="deviceName">Device Name</Label>
							<Input id="deviceName" placeholder="enter your key" bind:value={deviceName} />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Host Name / IP address / Broadcast ddress</Label>
							<Input type="email" id="email" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Device IP address</Label>
							<Input type="email" id="email" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">MAC Address</Label>
							<Input type="email" id="email" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Content>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Number your Port</Label>
							<Input type="email" id="email" placeholder="enter your key" />
						</div>
					</Card.Content>
					<Card.Footer class="flex gap-2">
						<Button>Save</Button>
						<Button
							on:click={() => {
								edit = !edit;
							}}>Cancel</Button
						>
						<Button
							on:click={() => {
								edit = !edit;
							}}>Delete</Button
						>
					</Card.Footer>
				</Card.Root>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
{/if}
