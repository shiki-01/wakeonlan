<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { resetMode, setMode } from 'mode-watcher';
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
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';

	async function wakeOnLan(mac: string, globalIP: string, port: number, deviceIP: string) {
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
			console.log(await response.json());
			toast.success('Computer woken up');
		} catch (error) {
			console.error('Error:', error);
			toast.error('Error waking up computer');
		}
	}

	async function shutdownComputer(address: string, port: number) {
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
			toast.success('Computer shut down');
		} catch (error) {
			console.error('Error:', error);
			toast.error('Error shutting down computer');
		}
	}

	async function sleepComputer(address: string, port: number) {
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
			console.log(await response.json());
			toast.success('Computer put to sleep');
		} catch (error) {
			console.error('Error:', error);
			toast.error('Error putting computer to sleep');
		}
	}

	let userInfo: UserInfo | null = null;

	user.subscribe(($user) => {
		userInfo = $user;
	});

	interface Status {
		online: boolean;
		message: string;
	}

	async function checkDeviceStatus(ip: string, port: string, deviceIP: string): Promise<boolean> {
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
			toast.error('Error checking device status');
			return false;
		}
	}

	async function getDevices() {
		if (!userInfo) {
			toast.error('Please log in to view your devices');
			return;
		}
		const userQuery = query(collection(db, 'devices'), where('ownerId', '==', userInfo.uid));
		const querySnapshot = await getDocs(userQuery);
		const devicesWithStatus = await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const deviceData = doc.data();
				deviceData.isActive = await checkDeviceStatus(
					deviceData.ip,
					deviceData.port,
					deviceData.deviceIp
				);
				return {
					...deviceData,
					id: doc.id,
					ownerId: doc.data().ownerId,
					name: doc.data().name,
					ip: doc.data().ip,
					deviceIp: doc.data().deviceIp,
					mac: doc.data().mac,
					port: doc.data().port
				};
			})
		);
		devices.set(devicesWithStatus);
	}

	function login() {
		if (userInfo) {
			auth.signOut();
			return;
		}
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				toast.success('Login successful');
			})
			.catch((error) => {
				toast.error('Login failed');
			});
	}

	let addName = '';
	let addIp = '';
	let addDeviceIp = '';
	let addMac = '';
	let addPort = '';

	async function addDevice() {
		if (addName === '' || addDeviceIp === '' || addMac === '' || addPort === '' || !userInfo) {
			toast.error('Please fill all the fields');
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
		toast.success('Device added successfully');
	}

	async function editDevice() {
		if (deviceName === '' || deviceIp === '' || mac === '' || port === '' || !userInfo) {
			toast.error('Please fill all the fields');
			return;
		}
		updateDoc(doc(db, 'devices', editId), {
			name: deviceName,
			ip: ipAddress,
			deviceIp: deviceIp,
			mac: mac,
			port: port
		});
		await getDevices();
		toast.success('Device updated successfully');
	}

	async function deleteDevice() {
		if (!userInfo) {
			return;
		}
		const device = doc(db, 'devices', editId);
		deleteDoc(device);
		await getDevices();
		toast.success('Device deleted successfully');
	}

	interface Device {
		id: string;
		ownerId?: string;
		name: string;
		ip: string;
		deviceIp: string;
		mac: string;
		port: string;
		isActive?: boolean;
	}

	let devices = writable<Device[]>([]);

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			userInfo = user;
			if (user) {
				await getDevices();
			} else {
				devices.set([]);
				toast.error('Please log in to view your devices');
			}
		});
	});

	let open = false;
	let edit = false;
	let connect = false;
	let isDelete = false;
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
							<Card.Title>Add new device</Card.Title>
							<Card.Description>Settings related to ip address</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label id="deviceName">Device Name *</Label>
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
								<Label for="dAddress">Device IP address *</Label>
								<Input id="dAddress" placeholder="enter your key" bind:value={addDeviceIp} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="mac">MAC Address *</Label>
								<Input id="mac" placeholder="enter your key" bind:value={addMac} />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="port">Number your Port *</Label>
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
							<Card.Title>Add new device</Card.Title>
							<Card.Description>Settings related to ip address</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label id="deviceName">Device Name *</Label>
								<Input id="deviceName" placeholder="enter your key" bind:value={addName} />
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
								<Label for="email">Device IP address *</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">MAC Address *</Label>
								<Input type="email" id="email" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Content>
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="email">Number your Port *</Label>
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
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
		<Card.Root>
			<Card.Header>
				<Card.Title>
					<div class="flex justify-between">
						<Skeleton class="h-[20px] w-[150px] lg:w-[200px] rounded-full" />
						<Badge variant="secondary">Loading</Badge>
					</div>
				</Card.Title>
				<Card.Description>
					<Skeleton class="h-[15px] w-[100px] rounded-full" />
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
			</Card.Content>
			<Card.Footer class="flex gap-2">
				<Button>Loading</Button>
				<Button>Loading</Button>
			</Card.Footer>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>
					<div class="flex justify-between">
						<Skeleton class="h-[20px] w-[150px] lg:w-[200px] rounded-full" />
						<Badge variant="secondary">Loading</Badge>
					</div>
				</Card.Title>
				<Card.Description>
					<Skeleton class="h-[15px] w-[100px] rounded-full" />
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
				<Skeleton class="h-[20px] w-[200px] lg:w-[300px] rounded-full" />
			</Card.Content>
			<Card.Footer class="flex gap-2">
				<Button>Loading</Button>
				<Button>Loading</Button>
			</Card.Footer>
		</Card.Root>
	{:else}
		{#each $devices as device}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<div class="flex justify-between">
							{device.name}
							{#if device.isActive}
								<Badge class="bg-green-500">Active</Badge>
							{:else}
								<Badge class="bg-red-500">Inactive</Badge>
							{/if}
						</div>
					</Card.Title>
					<Card.Description>{device.ip}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Device IP : {device.deviceIp}</p>
					<p>MAC: {device.mac}</p>
					<p>Port: {device.port}</p>
				</Card.Content>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							startEdit(device);
							connect = !connect;
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

{#if $isDesktop}
	<Dialog.Root bind:open={connect}>
		<Dialog.Content class="w-[350px]">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>Connect</Card.Title>
					<Card.Description>Select the action you want to perform</Card.Description>
				</Card.Header>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							wakeOnLan(mac, ipAddress, parseInt(port), deviceIp);
							connect = !connect;
						}}>Wake On Lan</Button
					>
					<Button
						on:click={() => {
							shutdownComputer(deviceIp, Number(port));
							connect = !connect;
						}}>Shutdown</Button
					>
					<Button
						on:click={() => {
							sleepComputer(deviceIp, Number(port));
							connect = !connect;
						}}>Sleep</Button
					>
				</Card.Footer>
			</Card.Root>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={connect}>
		<Drawer.Content class="flex justify-center">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>Connect</Card.Title>
					<Card.Description>Select the action you want to perform</Card.Description>
				</Card.Header>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							wakeOnLan(mac, ipAddress, parseInt(port), deviceIp);
							connect = !connect;
						}}>Wake On Lan</Button
					>
					<Button
						on:click={() => {
							shutdownComputer(deviceIp, Number(port));
							connect = !connect;
						}}>Shutdown</Button
					>
					<Button
						on:click={() => {
							sleepComputer(deviceIp, Number(port));
							connect = !connect;
						}}>Sleep</Button
					>
				</Card.Footer>
			</Card.Root>
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#if $isDesktop}
	<Dialog.Root bind:open={edit}>
		<Dialog.Content class="w-[350px]">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>IP Editing</Card.Title>
					<Card.Description>Settings related to ip address</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label id="deviceName">Device Name *</Label>
						<Input id="deviceName" placeholder="enter your key" bind:value={deviceName} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label id="ipAddress">Host Name / IP address / Broadcast ddress</Label>
						<Input id="ipAddress" placeholder="enter your key" bind:value={ipAddress} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="dAddress">Device IP address *</Label>
						<Input id="dAddress" placeholder="enter your key" bind:value={deviceIp} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="mac">MAC Address *</Label>
						<Input id="mac" placeholder="enter your key" bind:value={mac} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="port">Number your Port *</Label>
						<Input id="port" placeholder="enter your key" bind:value={port} />
					</div>
				</Card.Content>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							editDevice();
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
							edit = !edit;
							isDelete = !isDelete;
						}}>Delete</Button
					>
				</Card.Footer>
			</Card.Root>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={edit}>
		<Drawer.Content class="flex justify-center">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>IP Editing</Card.Title>
					<Card.Description>Settings related to ip address</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label id="deviceName">Device Name *</Label>
						<Input id="deviceName" placeholder="enter your key" bind:value={deviceName} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="email">Host Name / IP address / Broadcast ddress</Label>
						<Input type="email" id="email" placeholder="enter your key" bind:value={ipAddress} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="email">Device IP address *</Label>
						<Input type="email" id="email" placeholder="enter your key" bind:value={deviceIp} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="email">MAC Address *</Label>
						<Input type="email" id="email" placeholder="enter your key" bind:value={mac} />
					</div>
				</Card.Content>
				<Card.Content>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="email">Number your Port *</Label>
						<Input type="email" id="email" placeholder="enter your key" bind:value={port} />
					</div>
				</Card.Content>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							editDevice();
						}}>Save</Button
					>
					<Button
						on:click={() => {
							edit = !edit;
						}}>Cancel</Button
					>
					<Button
						on:click={() => {
							edit = !edit;
							isDelete = !isDelete;
						}}>Delete</Button
					>
				</Card.Footer>
			</Card.Root>
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#if $isDesktop}
	<Dialog.Root bind:open={isDelete}>
		<Dialog.Content class="w-[350px]">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>Are you sure you want to delete this device?</Card.Title>
					<Card.Description>You can't undo this action.</Card.Description>
				</Card.Header>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							deleteDevice();
							isDelete = !isDelete;
						}}>Yes</Button
					>
					<Button
						on:click={() => {
							isDelete = !isDelete;
						}}>No</Button
					>
				</Card.Footer>
			</Card.Root>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={isDelete}>
		<Drawer.Content class="flex justify-center">
			<Card.Root class="w-full border-none">
				<Card.Header>
					<Card.Title>Are you sure you want to delete this device?</Card.Title>
					<Card.Description>You can't undo this action.</Card.Description>
				</Card.Header>
				<Card.Footer class="flex gap-2">
					<Button
						on:click={() => {
							deleteDevice();
							isDelete = !isDelete;
						}}>Yes</Button
					>
					<Button
						on:click={() => {
							isDelete = !isDelete;
						}}>No</Button
					>
				</Card.Footer>
			</Card.Root>
		</Drawer.Content>
	</Drawer.Root>
{/if}
