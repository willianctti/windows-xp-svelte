<script>
  import { onMount } from 'svelte';
  let folders = [];
  let loading = true;

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/folders', {
        credentials: 'include'
      });
      const data = await response.json();
      folders = data;
    } catch (error) {
      console.error('Nao encontrei nenhuma pastaaaa:', error);
    } finally {
      loading = false;
    }
  });

  async function createFolder() {
    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      const response = await fetch('http://localhost:3000/api/folders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      const newFolder = await response.json();
      folders = [...folders, newFolder];
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }
</script>

<div class="documents">
  {#if loading}
    <div>Loading...</div>
  {:else}
    {#each folders as folder}
      <div class="folder">
        <span class="icon">{folder.icon}</span>
        <span class="name">{folder.name}</span>
      </div>
    {/each}
    <div class="folder new-folder" on:click={createFolder}>
      <span class="icon">➕</span>
      <span class="name">New Folder</span>
    </div>
  {/if}
</div>

<style>
  .documents {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  .folder {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 8px;
  }

  .folder:hover {
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
  }

  .icon {
    font-size: 32px;
  }

  .name {
    margin-top: 4px;
    text-align: center;
    font-size: 12px;
  }

  .new-folder {
    opacity: 0.7;
  }
  .new-folder:hover {
    opacity: 1;
  }
</style>