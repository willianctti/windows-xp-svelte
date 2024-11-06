<script>
  import { navigate } from 'svelte-routing';
  
  let username = '';
  let password = '';
  let error = '';

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/';
      } else {
        error = data.error;
      }
    } catch (err) {
      error = 'Failed to login';
    }
  }
</script>

<div class="login-container">
  <div class="login-box">
    <h2>Login</h2>
    {#if error}
      <div class="error">{error}</div>
    {/if}
    <form on:submit={handleLogin}>
      <div class="input-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          bind:value={username} 
          required
        />
      </div>
      <div class="input-group">
        <label for="password">Senha</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <p class="register-link">
      vc n tem uma conta? <a href="/register">Register</a>
    </p>
  </div>
</div>

<style>
  .login-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #2c3e50, #3498db);
  }

  .login-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
    width: 100%;
    max-width: 400px;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #34495e;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 0.5rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .error {
    color: red;
    margin-bottom: 1rem;
  }

  .register-link {
    text-align: center;
    margin-top: 1rem;
  }
</style> 