<script>
  import { onMount } from 'svelte';
  import Window from './Window.svelte';
  import NotepadContent from './NotepadContent.svelte';
  
  let folders = [];
  let loading = true;
  let windows = [];

  onMount(async () => {
    try {
      const [foldersResponse, notepadsResponse] = await Promise.all([
        fetch('http://localhost:3000/api/folders', {
          credentials: 'include'
        }),
        fetch('http://localhost:3000/api/notepad', {
          credentials: 'include'
        })
      ]);

      const foldersData = await foldersResponse.json();
      const notepadsData = await notepadsResponse.json();

      folders = [
        ...foldersData.map(f => ({ ...f, type: 'folder', icon: '📁' })),
        ...notepadsData.map(n => ({ ...n, type: 'notepad', icon: '📝' }))
      ];
    } catch (error) {
      console.error('Failed to load documents:', error);
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
        body: JSON.stringify({ 
          name,
          type: 'folder',
          icon: '📁'
        })
      });
      const newFolder = await response.json();
      folders = [...folders, { ...newFolder, type: 'folder', icon: '📁' }];
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }

  async function createNotepad() {
    const name = prompt('Enter notepad name:');
    if (!name) return;

    try {
      const response = await fetch('http://localhost:3000/api/notepad', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name,
          type: 'notepad',
          icon: '📝'
        })
      });
      const newNotepad = await response.json();
      folders = [...folders, { ...newNotepad, type: 'notepad', icon: '📝' }];
      
      openNotepadWindow(newNotepad);
    } catch (error) {
      console.error('Failed to create notepad:', error);
    }
  }

  function openNotepadWindow(notepad) {
    windows = [...windows, {
      id: Date.now(),
      title: notepad.name,
      type: 'notepad',
      notepadId: notepad.id
    }];
  }

  function closeWindow(id) {
    windows = windows.filter(w => w.id !== id);
  }
</script>

<div class="documents">
  {#if loading}
    <div>Loading...</div>
  {:else}
    {#each folders as folder}
      <div class="folder" on:click={() => folder.type === 'notepad' ? openNotepadWindow(folder) : null}>
        <span class="icon">{folder.type === 'notepad' ? '📝' : '📁'}</span>
        <span class="name">{folder.name}</span>
      </div>
    {/each}
    <div class="folder new-folder" on:click={createFolder}>
      <span class="icon">➕</span>
      <span class="name">New Folder</span>
    </div>
    <div class="folder new-folder" on:click={createNotepad}>
      <span class="icon">📝</span>
      <span class="name">New Notepad</span>
    </div>
  {/if}
</div>

{#each windows as window (window.id)}
  <Window 
    id={window.id}
    title={window.title}
    on:close={() => closeWindow(window.id)}
  >
    <NotepadContent fileId={window.notepadId} />
  </Window>
{/each}

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