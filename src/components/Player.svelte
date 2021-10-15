<script>

  export let id;
  let name;

  const handleAddBar = () => {}

</script>

<style>
</style>

<div class="player" id="{id}">
  <input type="text" name="label" placeholder="Player 1" bind:value={name}>
  <div class="bars">
  </div>
  <div class="panel">
  </div>
  <button on:click={handleAddBar} class="add-bar">Add Bar</button>
</div>
