<script>
  import { onMount } from 'svelte';
  let showStartMenu = false;
  let isLoggedIn = false;
  let username = '';
  let currentTime = new Date().toLocaleTimeString();

  let pinnedApps = [
    { id: 1, name: 'Documents', icon: '📁', type: 'documents' },
    { id: 2, name: 'Browser', icon: '🌐', type: 'browser' },
    { id: 3, name: 'Settings', icon: '⚙️', type: 'settings' }
  ];

  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date().toLocaleTimeString();
    }, 1000);

    const checkAuth = async () => {
      const response = await fetch('http://localhost:3000/api/auth/check');
      const data = await response.json();
      isLoggedIn = data.isLoggedIn;
      username = data.username;
    };

    checkAuth();

    return () => {
      clearInterval(timer);
    };
  });

  async function handleLogout() {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    isLoggedIn = false;
    username = '';
    showStartMenu = false;
  }

  function handleAppClick(app) { 
    const event = new CustomEvent('openWindow', { detail: app });
    window.dispatchEvent(event);
  }
</script>

<div class="taskbar">
  <div class="taskbar-left">
    <div class="start-button" on:click={() => showStartMenu = !showStartMenu}>
      <img src="/logo.png" alt="Windows" class="windows-logo" />
      <span class="start-text">start</span>
    </div>
    <div class="taskbar-separator"></div>
    
    <div class="app-icons">
      {#each pinnedApps as app}
        <div class="taskbar-icon" on:click={() => handleAppClick(app)} title={app.name}>
          <span class="icon">{app.icon}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="taskbar-right">
    <div class="system-tray">
      <div class="tray-icon">🔊</div>
      <div class="tray-icon">📶</div>
      <div class="tray-icon">🔋</div>
    </div>
    <div class="time-date">
      <span>{currentTime}</span>
    </div>
  </div>
</div>

{#if showStartMenu}
  <div class="start-menu">
    {#if isLoggedIn}
      <div class="user-info">
        <span class="user-avatar">👤</span>
        <span class="username">{username}</span>
      </div>
      <div class="menu-item" on:click={handleLogout}>
        <span class="icon">🚪</span>
        <span>Logout</span>
      </div>
    {:else}
      <div class="menu-item" on:click={() => window.location.href = '/login'}>
        <span class="icon">🔑</span>
        <span>Login</span>
      </div>
      <div class="menu-item" on:click={() => window.location.href = '/register'}>
        <span class="icon">📝</span>
        <span>Register</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #154aa7 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    color: white;
    z-index: 1000;
  }

  .taskbar-left {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .start-button {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    background: linear-gradient(to bottom, #3c993c 0%, #5ec945 9%, #3c993c 18%, #3c993c 92%, #2d7d2d 100%);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
    border: 1px solid #2d7d2d;
    border-left: none;
  }

  .start-button:hover {
    background: linear-gradient(to bottom, #44b444 0%, #6edb53 9%, #44b444 18%, #44b444 92%, #358535 100%);
  }

  .windows-logo {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }

  .start-text {
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: white;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }

  .taskbar-separator {
    width: 1px;
    height: 85%;
    background: linear-gradient(to bottom, #154aa7 0%, #67a6f7 50%, #154aa7 100%);
    margin: 0 6px;
  }

  .taskbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .app-icons {
    display: flex;
    gap: 4px;
    margin-left: 8px;
  }

  .taskbar-icon {
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .taskbar-icon:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .system-tray {
    display: flex;
    gap: 12px;
    padding: 0 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tray-icon {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .tray-icon:hover {
    opacity: 1;
  }

  .time-date {
    padding: 0 12px;
    font-size: 12px;
  }

  .start-menu {
    position: fixed;
    bottom: 40px;
    left: 0;
    width: 300px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px 8px 0 0;
    padding: 12px 0;
    color: white;
    backdrop-filter: blur(20px);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;
  }

  .user-avatar {
    font-size: 24px;
  }

  .menu-item {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .icon {
    font-size: 16px;
  }
</style>