<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { getMode, resetMode, setMode, themes } from '$lib/utils/theme';
	import Command from '$lib/components/Command.svelte';
	import { login } from '$lib/utils/auth.js';
	import Icon from '$lib/components/Icon.svelte';
	import DeviceForm from '$lib/components/DeviceForm.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { mediaQuery } from 'svelte-legos';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { theme, lang, open, user } from '$lib/store';
	import langs, { setLang } from '$lib/utils/langs';
	import type { UserInfo } from 'firebase/auth';

	const { Root: ARoot, Image: AImage } = Avatar;
	const { Root: DIRoot, Trigger: DITrigger, Content: DIContent } = Dialog;
	const { Root: DRRoot, Trigger: DRTrigger, Content: DRContent } = Drawer;
	const { Root: DMRoot, Trigger: DMTrigger, Content: DMContent, Item: DMItem } = DropdownMenu;

	setMode(getMode() || 'light');
	const isDesktop = mediaQuery('(min-width: 768px)');

	$: if (typeof window !== 'undefined') {
		lang.set(window.document.documentElement.classList.contains('ja') ? 'ja' : 'en');
	}

	let userInfo: UserInfo | null = null;

	user.subscribe(() => {
		userInfo = $user;
	});
</script>

<svelte:head>
	<title>Wale on Lan</title>
</svelte:head>

<Command class="w-screen bg-slate-50 dark:bg-slate-950 transition-[color,background] duration-300">
	<Toaster />
	<div class="p-8 lg:p-10 min-h-screen flex flex-col">
		<header class="flex w-full items-center justify-between">
			<div class="flex-1 items-center gap-2">
				<svelte:component this={$isDesktop ? DIRoot : DRRoot} bind:open={$open}>
					<svelte:component
						this={$isDesktop ? DITrigger : DRTrigger}
						class="flex items-center p-2 border-b-2 border-slate-800 dark:border-slate-200"
					>
						<p class="text-sm lg:text-lg">
							{langs['New Device'].base[$lang]}
						</p>
						<Icon name="PackagePlus" class="h-5 w-5 ml-2" />
					</svelte:component>
					<svelte:component
						this={$isDesktop ? DIContent : DRContent}
						class={$isDesktop
					? 'max-w-[500px]'
					: 'flex justify-center pb-2'}
					>
						<DeviceForm
							mode="add"
							bind:edit={$open}
						/>
					</svelte:component>
				</svelte:component>
			</div>
			<div class="flex items-center gap-2">
				<DMRoot>
					<DMTrigger asChild let:builder>
						<Button builders={[builder]} variant="outline" size="icon">
							<Icon
								name="Sun"
								class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<Icon
								name="Moon"
								class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</DMTrigger>
					<DMContent align="end">
						{#each themes as { name, icon } (name)}
							<DMItem
								class="flex items-center gap-2"
								on:click={() => {
							if (name === 'system') {
								resetMode();
							} else {
								setMode(name);
							}
						}}
							>
						<span
							class="h-1 w-1 rounded-full bg-slate-900 dark:bg-white transition-opacity duration-300 {$theme === name
							? 'opacity-100'
							: 'opacity-0'}"
						/>
								<Icon name={icon} class="h-4 w-4" />
								{langs.Theme[name][$lang]}
							</DMItem>
						{/each}
					</DMContent>
				</DMRoot>
				<DMRoot>
					<DMTrigger asChild let:builder>
						<Button builders={[builder]} variant="outline" size="icon">
							<Icon name="Globe" class="h-4 w-4" />
						</Button>
					</DMTrigger>
					<DMContent align="end">
						{#each ['en', 'ja'] as i}
							<DMItem
								class="p-1.5 flex gap-2"
								on:click={() => {
									if (i === 'en') {
										lang.set('en');
										setLang('en');
									} else {
										lang.set('ja');
										setLang('ja');
									}
								}}
							>
								<span
									class="h-1 w-1 rounded-full bg-slate-900 dark:bg-white transition-opacity duration-300 {$lang === i
									? 'opacity-100'
									: 'opacity-0'}"
								/>
								<Icon name="Flag" class="h-4 w-4" />
								{#if i === 'en'}
									{langs.Lang.en[$lang]}
								{:else}
									{langs.Lang.ja[$lang]}
								{/if}
							</DMItem>
						{/each}
					</DMContent>
				</DMRoot>
				{#if userInfo}
					<DMRoot>
						<DMTrigger asChild let:builder>
							<Button builders={[builder]} variant="none" size="icon">
								<ARoot>
									<AImage src={userInfo.photoURL} alt={userInfo.displayName} />
								</ARoot>
								<span class="sr-only">User menu</span>
							</Button>
						</DMTrigger>
						<DMContent align="end">
							<DMItem
								class="p-1.5 flex gap-2"
								on:click={login}
							>
								<Icon name="LogOut" class="h-4 w-4" />
								{langs.Account.logout[$lang]}
							</DMItem>
						</DMContent>
					</DMRoot>
				{:else}
					<Button
						class="p-1.5 flex gap-2"
						on:click={login}
					>
						<Icon name="LogIn" class="h-4 w-4" />
						{langs.Account.login[$lang]}
					</Button>
				{/if}
			</div>
		</header>
		<div class="flex-grow">
			<slot />
		</div>
		<footer class="h-10 flex justify-center items-center">
			<p class="text-center text-xs text-slate-500 dark:text-slate-400">
				&copy; {new Date().getFullYear()} <a href="https://github.com/shiki-01">shiki</a> . All rights reserved.
			</p>
		</footer>
	</div>
</Command>

<style lang="postcss">
    :global(*) {
        @apply transition-[color,background,border] duration-300;
    }
</style>