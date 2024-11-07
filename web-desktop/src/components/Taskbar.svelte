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
      try {
        const response = await fetch('http://localhost:3000/api/auth/check', {
          credentials: 'include'
        });
        const data = await response.json();
        isLoggedIn = data.isLoggedIn;
        username = data.username;
        console.log('Auth status:', isLoggedIn, username);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
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
    window.location.href = '/login';
  }

  function handleAppClick(app) { 
    const event = new CustomEvent('openWindow', { detail: app });
    window.dispatchEvent(event);
  }

  function handleMenuItemClick(type) {
    showStartMenu = false;
    const app = {
      name: type === 'browser' ? 'Internet Explorer' : 'My Documents',
      type: type === 'browser' ? 'browser' : 'documents',
      icon: type === 'browser' ? '🌐' : '📁'
    };
    handleAppClick(app);
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
      <div class="start-menu-header">
        <div class="user-info">
          <img src="/userImage.jpg" alt="User" class="user-avatar" />
          <span class="username">{username}</span>
        </div>
      </div>
      <div class="start-menu-content">
        <div class="left-panel">
          <div class="pinned-programs">
            <div class="menu-item" on:click={() => handleMenuItemClick('browser')}>
              <span class="icon">🌐</span>
              <span>Internet Explorer</span>
            </div>
            <div class="menu-item">
              <span class="icon">✉️</span>
              <span>Outlook Express</span>
            </div>
          </div>
          <div class="separator"></div>
          <div class="menu-item" on:click={() => handleMenuItemClick('documents')}>
            <span class="icon">📁</span>
            <span>My Documents</span>
          </div>
          <div class="menu-item">
            <span class="icon">🖼️</span>
            <span>My Pictures</span>
          </div>
          <div class="menu-item">
            <span class="icon">🎵</span>
            <span>My Music</span>
          </div>
          <div class="menu-item">
            <span class="icon">💻</span>
            <span>My Computer</span>
          </div>
          <div class="separator"></div>
          <div class="menu-item">
            <span class="icon">⚙️</span>
            <span>Control Panel</span>
          </div>
          <div class="menu-item">
            <span class="icon">🎮</span>
            <span>Games</span>
          </div>
        </div>

        <div class="right-panel">
          <div class="menu-item">
            <span class="icon">👤</span>
            <span>{username}</span>
          </div>
          <div class="menu-item">
            <span class="icon">📂</span>
            <span>My Documents</span>
          </div>
          <div class="menu-item">
            <span class="icon">🖥️</span>
            <span>My Recent Documents</span>
          </div>
          <div class="separator"></div>
          <div class="menu-item">
            <span class="icon">⚙️</span>
            <span>Control Panel</span>
          </div>
          <div class="menu-item">
            <span class="icon">🔍</span>
            <span>Search</span>
          </div>
          <div class="menu-item">
            <span class="icon">❓</span>
            <span>Help and Support</span>
          </div>
          <div class="separator"></div>
          <div class="menu-item" on:click={handleLogout}>
            <span class="icon">🚪</span>
            <span>Log Off {username}</span>
          </div>
          <div class="menu-item">
            <span class="icon">⭕</span>
            <span>Turn Off Computer</span>
          </div>
        </div>
      </div>
    {:else}
      <div class="start-menu-content">
        <div class="menu-item" on:click={() => window.location.href = '/login'}>
          <span class="icon">🔑</span>
          <span>Login</span>
        </div>
        <div class="menu-item" on:click={() => window.location.href = '/register'}>
          <span class="icon">📝</span>
          <span>Register</span>
        </div>
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

  .start-menu {
    position: fixed;
    bottom: 50px;
    left: 0;
    width: 400px;
    height: 480px;
    background: white;
    border: 1px solid #0054E3;
    border-radius: 8px 8px 0 0;
    color: black;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }

  .start-menu-header {
    background: linear-gradient(to right, #0054E3, #2787F5);
    padding: 10px;
    height: 54px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border: 2px solid white;
    border-radius: 4px;
  }

  .username {
    font-size: 14px;
    font-weight: bold;
  }

  .start-menu-content {
    height: calc(100% - 54px);
    display: flex;
  }

  .left-panel {
    width: 65%;
    background: white;
    border-right: 1px solid #ccc;
    padding: 8px 0;
  }

  .right-panel {
    width: 50%;
    background: #D3E5FA;
    padding: 8px 0;
  }

  .menu-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .menu-item:hover {
    background: #2787F5;
    color: white;
  }

  .separator {
    height: 1px;
    background: #ccc;
    margin: 8px 0;
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

  .icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .pinned-programs {
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
    margin-bottom: 8px;
  }
</style>