<script>
  import Bar from "./Bar.svelte";

  export let id;
  let name;

  const handleAddBar = () => {}

</script>

<style>
</style>

<div class="bar-group" id="{id}">
  <input type="text" name="label" placeholder="Group {id}" bind:value={name}>
  <div class="bars">
    <Bar id="{id}" />
  </div>
  <div class="panel">
  </div>
  <button on:click={handleAddBar} class="add-bar">Add Bar</button>
</div>
