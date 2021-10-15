<script>
  import { onMount } from 'svelte';
  import Player from './components/Player.svelte';

  onMount(() => {
    restoreState();
  })

  let players = [1,2,3,4,5,6];
</script>

{#each players as player, i}
  <Player id={`player-${i+1}`}/>
{/each}

