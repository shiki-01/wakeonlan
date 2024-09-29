<script lang="ts">
	import * as icons from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import type { IconType } from '$lib/types';

	export let name: IconType;

	const IconComponent: typeof SvelteComponent | null = (icons as unknown as Record<string, typeof SvelteComponent>)[name] || null;
</script>

{#if IconComponent}
	<svelte:component this="{IconComponent}" {...$$props} />
{/if}