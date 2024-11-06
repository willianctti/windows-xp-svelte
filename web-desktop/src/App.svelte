<script>
  import { onMount } from 'svelte';
  import Desktop from './components/Desktop.svelte';
  import Taskbar from './components/Taskbar.svelte';
  import Login from './components/Login.svelte';
  import Register from './components/Register.svelte';

  let isLoggedIn = false;
  let loading = true;
  let currentPath = window.location.pathname;

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      isLoggedIn = data.isLoggedIn;
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      loading = false;
    }

    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });
  });
</script>

{#if loading}
  <div class="loading">Loading...</div>
{:else}
  {#if currentPath === '/login'}
    <Login />
  {:else if currentPath === '/register'}
    <Register />
  {:else}
    {#if isLoggedIn}
      <main>
        <Desktop />
        <Taskbar />
      </main>
    {:else}
      <Login />
    {/if}
  {/if}
{/if}

<style>
  main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-position: center;
    background-image: url('/wallpaper.jpg');
  }

  .loading {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: #f5f5f5;
  }
</style>