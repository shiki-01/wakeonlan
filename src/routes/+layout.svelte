<script>
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner";
	import { ModeWatcher } from "mode-watcher";
</script>

<Toaster />
<ModeWatcher />
<div class="m-8 lg:m-10">
	<slot />
</div>

<style></style>
