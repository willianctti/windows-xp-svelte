<script>
  import DesktopIcon from './DesktopIcon.svelte';
  import Window from './Window.svelte';
  import DocumentsContent from './DocumentsContent.svelte';
  import BrowserContent from './BrowserContent.svelte';
  import SettingsContent from './SettingsContent.svelte';
  import MsnContent from './MsnContent.svelte';
  import GameContent from './GameContent.svelte';
  import PaintContent from './PaintContent.svelte';
  let windows = [];
  let icons = [
  { id: 1, name: 'Meus Documentos', icon: '📁', type: 'documents' },
  { id: 2, name: 'Navegador', icon: '🌐', type: 'browser' },
  { id: 3, name: 'Configurações', icon: '⚙️', type: 'settings' },
  { id: 4, name: 'MSN', icon: 'public/msgLogo.png', type: 'msn' },
  { id: 5, name: 'Encontre o gato', icon: '🎮', type: 'game' },
  { id: 6, name: 'Paint', icon: '🎨', type: 'paint' }
];

  function getContentComponent(type) {
    switch(type) {
      case 'documents':
        return DocumentsContent;
      case 'browser':
        return BrowserContent;
      case 'settings':
        return SettingsContent;
      case 'msn':
        return MsnContent;
      case 'game':
        return GameContent;
      case 'paint':
        return PaintContent;
      default:
        return null;
    }
  }

  function openWindow(app) {
    windows = [...windows, {
      id: Date.now(),
      title: app.name,
      type: app.type,
      component: getContentComponent(app.type),
      position: { x: 50, y: 50 }
    }];
  }

  function closeWindow(id) {
    windows = windows.filter(w => w.id !== id);
  }
</script>

<main class="desktop">
<div class="icons">
  {#each icons as icon}
    <DesktopIcon 
      {icon} 
      on:click={() => openWindow(icon)}
    />
  {/each}
</div>

{#each windows as window (window.id)}
  <Window 
    {...window}
    on:close={() => closeWindow(window.id)}
  >
    <svelte:component this={window.component} />
  </Window>
{/each}
</main>

<style>
.desktop {
  width: 100%;
  height: calc(100vh - 40px);
  position: relative;
}

.icons {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 20px;
}
</style>