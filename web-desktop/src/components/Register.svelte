<script>
  let username = '';
  let password = '';
  let confirmPassword = '';
  let error = '';

  async function handleRegister(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
      error = 'Failed to register';
    }
  }
</script>

<div class="register-container">
  <div class="register-box">
    <h2>Register</h2>
    {#if error}
      <div class="error">{error}</div>
    {/if}
    <form on:submit={handleRegister}>
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
      <div class="input-group">
        <label for="confirm-password">Confirmar senha</label>
        <input 
          type="password" 
          id="confirm-password" 
          bind:value={confirmPassword} 
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
    <p class="login-link">
      vc já tem uma conta? <a href="/login">Login</a>
    </p>
  </div>
</div>

<style>
  .register-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #2c3e50, #3498db);
  }

  .register-box {
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
    padding: 0.75rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  button:hover {
    background: #2980b9;
  }

  .error {
    color: #e74c3c;
    margin-bottom: 1rem;
    text-align: center;
  }

  .login-link {
    text-align: center;
    margin-top: 1rem;
  }

  a {
    color: #3498db;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

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