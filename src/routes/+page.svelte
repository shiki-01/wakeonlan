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
	import { authStore } from '$lib/store';
	import { auth, db } from '$lib/firebase';
	import {
		onAuthStateChanged,
		signInWithPopup,
		GoogleAuthProvider,
		type User
	} from 'firebase/auth';
	import { collection, getDocs, query, where } from 'firebase/firestore';

	let userInfo: User | null = null;

	onAuthStateChanged(auth, (user) => {
		authStore.set({ loggedIn: !!user, user: user });
		userInfo = user;
	});

	function login() {
		if (userInfo) {
			auth.signOut();
			return;
		}
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log('ログイン成功');
				console.log(result.user);
			})
			.catch((error) => {
				console.log('ログイン失敗', error);
			});
	}

	let devices: any[] = [];

	onMount(async () => {
		if (auth.currentUser) {
			const userQuery = query(
				collection(db, 'devices'),
				where('ownerId', '==', auth.currentUser.uid)
			);
			const querySnapshot = await getDocs(userQuery);
			devices = querySnapshot.docs.map((doc) => doc.data());
		}
	});

	let open = false;
	let edit = false;
	let deviceName = '';
	let ipAddress = '';

	function startEdit(device: { name: string; ip: string }) {
		deviceName = device.name;
		ipAddress = device.ip;
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
								<Input id="deviceName" placeholder="enter your key" />
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
								<Label for="port">Number your Port</Label>
								<Input id="port" placeholder="enter your key" />
							</div>
						</Card.Content>
						<Card.Footer class="flex gap-2">
							<Button
								on:click={() => {
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
	{#if devices.length === 0}
		<p>No devices found</p>
	{:else}
		{#each devices as device}
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
					<Button>Connect</Button>
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
					</Card.Footer>
				</Card.Root>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
{/if}
