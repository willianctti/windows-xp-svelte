<script>
    import { onMount } from 'svelte';
    let messages = [];
    let inputMessage = '';
    let loading = false;
    let messageTimestamps = [];
    let errorMessage = '';

    function canSendMessage() {
      const now = Date.now();
      messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < 60000);
      return messageTimestamps.length < 5;
    }

    async function sendMessage() {
      if (!inputMessage) return;

      if (!canSendMessage()) {
        errorMessage = 'You have reached the limit of 5 messages per minute.';
        return;
      }

      errorMessage = '';
      messages = [...messages, { sender: 'user', text: inputMessage }];
      messageTimestamps.push(Date.now());
      loading = true;

      try {
        const response = await fetch(`https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(inputMessage)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        messages = [...messages, { sender: 'bot', text: data.results }];
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        loading = false;
        inputMessage = '';
      }
    }
  </script>
  
  <div class="msn">
    <div class="messages">
      {#each messages as message}
        <div class="{message.sender}">{message.text}</div>
      {/each}
    </div>
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
    <div class="input-area">
      <input type="text" bind:value={inputMessage} placeholder="Type a message..." />
      <button on:click={sendMessage} disabled={loading}>Send</button>
    </div>
  </div>
  
  <style>
    .msn {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 400px;
      min-width: 300px;
      border: 2px solid #c0c0c0;
      border-radius: 5px;
      background: linear-gradient(to bottom, #e0e0e0, #ffffff);
      box-shadow: 2px 2px 5px #888888;
    }
    .messages {
      flex: 1;
      width: 100%;
      overflow-y: auto;
      word-wrap: break-word;
      white-space: pre-wrap;
      max-width: 600px;
      margin: 0 auto;
      max-height: 300px;
      background-color: #ffffff;
      border-bottom: 1px solid #c0c0c0;
      padding: 10px;
    }
    .user {
      text-align: right;
      color: #0000ff;
      font-family: 'Tahoma', sans-serif;
      margin: 5px 0;
    }
    .bot {
      text-align: left;
      color: #008000;
      font-family: 'Tahoma', sans-serif;
      margin: 5px 0;
    }
    .input-area {
      display: flex;
      padding: 10px;
      border-radius: 5px;
      background: #f0f0f0;
      border-top: 1px solid #c0c0c0;
    }
    input {
      flex: 1;
      padding: 5px;
      border: 1px solid #c0c0c0;
      border-radius: 3px;
      font-family: 'Tahoma', sans-serif;
    }
    button {
      padding: 5px 10px;
      border: 1px solid #c0c0c0;
      border-radius: 3px;
      background-color: #e0e0e0;
      font-family: 'Tahoma', sans-serif;
      cursor: pointer;
    }
    button:disabled {
      background-color: #d0d0d0;
      cursor: not-allowed;
    }
    .error {
      color: red;
      text-align: center;
      margin: 5px 0;
      font-family: 'Tahoma', sans-serif;
    }
  </style>