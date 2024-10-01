<script lang="ts">
	import { user, theme, lang, open, isCommand, connect, edit, isDelete } from '$lib/store';
	import { login } from '$lib/utils/auth';
	import { themes, setMode } from '$lib/utils/theme';
	import langs, { setLang } from '$lib/utils/langs';
	import type { UserInfo } from 'firebase/auth';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Icon from '$lib/components/Icon.svelte';

	const {
		Root: CRoot,
		Trigger: CTrigger,
		Content: CContent,
		Item: CItem,
		Separator: CSepa,
		Sub: CSub,
		SubTrigger: CSubTrigger,
		SubContent: CSubContent,
		Shortcut: CShortcut
	} = ContextMenu;

	let userInfo: UserInfo | null = null;

	user.subscribe(() => {
		userInfo = $user;
	});
</script>

<CRoot
	onOpenChange={(open) => {
		if (!open && $isCommand) {
			isCommand.set(null);
		}
	}}
>
	<CTrigger class="w-full h-full" {...$$restProps}>
		<slot />
	</CTrigger>
	<CContent>
		{#if $isCommand}
			<CItem
				class="gap-5"
				on:click={() => {
					$connect = true;
				}}
			>
				<div class="flex items-center gap-2">
					<Icon name="PackagePlus" class="w-4 h-4" />
					{langs.Connect.title[$lang]}
				</div>
			</CItem>
			<CItem
				class="gap-5"
				on:click={() => {
					$edit = true;
				}}
			>
				<div class="flex items-center gap-2">
					<Icon name="PackagePlus" class="w-4 h-4" />
					{langs.Edit.title[$lang]}
				</div>
			</CItem>
			<CSepa />
			<CItem
				class="gap-5"
				on:click={() => {
				$isDelete = true;
			}}
			>
				<Icon name="PackagePlus" class="w-4 h-4" />
				{langs.Edit.forms.delete[$lang]}
			</CItem>
		{:else}
			<CItem
				class="gap-5"
				on:click={() => {
				open.set(true);
			}}
			>
				<div class="flex items-center gap-2">
					<Icon name="PackagePlus" class="w-4 h-4" />
					{langs['New Device'].base[$lang]}
				</div>
				<CShortcut>Ctrl + N</CShortcut>
			</CItem>
			<CSub>
				<CSubTrigger class="flex gap-2">
					<Icon name="User" class="w-4 h-4" />
					{langs.Account[$lang]}
				</CSubTrigger>
				<CSubContent>
					<CItem
						class="gap-2"
						on:click={() => {
						login();
					}}
					>
						{#if userInfo}
							<Icon name="LogOut" class="w-4 h-4" />
							{langs.Account.logout[$lang]}
						{:else}
							<Icon name="LogIn" class="w-4 h-4" />
							{langs.Account.login[$lang]}
						{/if}
					</CItem>
				</CSubContent>
			</CSub>
			<CSepa />
			<CSub>
				<CSubTrigger class="flex gap-2">
					<Icon name="Palette" class="w-4 h-4" />
					{langs.Theme[$lang]}
				</CSubTrigger>
				<CSubContent>
					{#each themes as t}
						<CItem
							class="flex gap-2"
							on:click={() => {
						setMode(t.name);
					}}
						>
						<span
							class="h-1 w-1 rounded-full bg-slate-900 dark:bg-white transition-opacity duration-300 {$theme === t.name
							? 'opacity-100'
							: 'opacity-0'}"
						/>
							<Icon name={t.icon} class="w-4 h-4" />
							{langs.Theme[t.name][$lang]}
						</CItem>
					{/each}
				</CSubContent>
				<CSub>
					<CSubTrigger class="flex gap-2">
						<Icon name="Globe" class="w-4 h-4" />
						{langs.Lang.title[$lang]}
					</CSubTrigger>
					<CSubContent>
						{#each ['en', 'ja'] as l}
							<CItem
								class="flex gap-2"
								on:click={() => {
								if (l === 'en') {
									lang.set('en');
									setLang('en');
								} else {
									lang.set('ja');
									setLang('ja');
								}
							}}
							>
							<span
								class="h-1 w-1 rounded-full bg-slate-900 dark:bg-white transition-opacity duration-300 {$lang === l
								? 'opacity-100'
								: 'opacity-0'}"
							/>
								<Icon name="Flag" class="w-4 h-4" />
								{#if l === 'en'}
									{langs.Lang.en[$lang]}
								{:else}
									{langs.Lang.ja[$lang]}
								{/if}
							</CItem>
						{/each}
					</CSubContent>
				</CSub>
			</CSub>
		{/if}
	</CContent>
</CRoot>