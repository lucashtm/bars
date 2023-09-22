<script>
  import { onMount } from 'svelte';
  import BarGroup from './components/BarGroup.svelte';

  onMount(() => {
    restoreState();
  })

  let groups = [1];
</script>

{#each groups as group, i}
  <BarGroup id={`group-${i+1}`}/>
{/each}

