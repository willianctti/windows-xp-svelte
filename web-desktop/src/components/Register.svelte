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
    <div class="window-content">
      {#if error}
        <div class="error">{error}</div>
      {/if}
      <form on:submit={handleRegister}>
        <div class="form-container">
          <img src="/userImage.jpg" alt="User" class="user-image" />
          <div class="inputs-container">
            <div class="input-group">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                bind:value={username}
                required
              />
            </div>
            <div class="input-group">
              <label for="password">Password:</label>
              <input
                type="password"
                id="password"
                bind:value={password}
                required
              />
            </div>
            <div class="input-group password-group">
              <label for="confirm-password">Confirm Password:</label>
              <div class="password-container">
                <input
                  type="password"
                  id="confirm-password"
                  bind:value={confirmPassword}
                  required
                />
                <button type="submit">➜</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <p class="login-link">
    Already have an account? <a href="/login">Sign in</a>
  </p>
</div>

<style>
  .register-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/auth.jpg') center/cover no-repeat;
  }

  .register-box {
    background: linear-gradient(to right, #4167ce, #3191ff00);
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
  }

  .window-content {
    padding: 20px;
  }

  .input-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: white;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 2px solid #7F9DB9;
    background: white;
    border-radius: 3px;
  }

  input:focus {
    border-color: #0054E3;
    outline: none;
  }

  button[type="submit"] {
    width: auto;
    padding: 2px 7px;
    background: linear-gradient(to right, #79ee79, #196719);
    color: white;
    border: 1px solid #228B22;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
  }

  button[type="submit"]:hover {
    background: linear-gradient(to bottom, #32CD32, #228B22);
  }

  .error {
    color: #CC0000;
    background: #FFE6E6;
    padding: 8px;
    border: 1px solid #CC0000;
    margin-bottom: 15px;
    border-radius: 3px;
  }

  .login-link {
    position: absolute;
    bottom: 5%;
    font-size: 20px;
    text-align: center;
    color: #FFE6E6;
    text-shadow: 0 0 1px #000;
  }

  .login-link a {
    color: #FFE6E6;
    text-shadow: 0 0 1px #000;
    text-decoration: none;
  }

  .login-link a:hover {
    text-decoration: underline;
  }

  .form-container {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 15px;
  }

  .user-image {
    width: 100px;
    height: 100px;
    border: 2px solid #FFD700;
    border-radius: 3px;
  }

  .inputs-container {
    flex: 1;
    color: #FFE6E6;
  }

  .password-group {
    margin-bottom: 0;
  }

  .password-container {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .input-group input {
    width: 100%;
    padding: 8px;
    border: 2px solid #7F9DB9;
    background: white;
    border-radius: 3px;
  }
</style>