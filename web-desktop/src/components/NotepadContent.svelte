<script>
    export let fileId = null;
    export let folderId = null;
    let content = '';
    let fileName = '';
    let saving = false;
  
    async function saveFile() {
      if (!fileName) {
        fileName = prompt('Enter file name:');
        if (!fileName) return;
      }
  
      saving = true;
      try {
        const response = await fetch('http://localhost:3000/api/notepad', {
          method: fileId ? 'PUT' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: fileName,
            content,
            id: fileId
          })
        });
        
        const data = await response.json();
        if (data.id) {
          fileId = data.id;
        }
      } catch (error) {
        console.error('Failed to save file:', error);
      } finally {
        saving = false;
      }
    }
  
    async function loadFile() {
      if (!fileId) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/notepad/${fileId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to load file');
        }
        const data = await response.json();
        content = data.content || '';
        fileName = data.name || '';
      } catch (error) {
        console.error('Failed to load file:', error);
      }
    }
  
    $: if (fileId) {
      loadFile();
    }
  </script>
  
  <div class="notepad">
    <div class="toolbar">
      <button class="save-button" on:click={saveFile} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      <span class="file-name">{fileName || 'Untitled'}</span>
    </div>
    <textarea
      bind:value={content}
      placeholder="Type your text here..."
    ></textarea>
  </div>
  
  <style>
    .notepad {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }
  
    .toolbar {
      padding: 8px;
      background: #f0f0f0;
      border-bottom: 1px solid #ddd;
      display: flex;
      gap: 8px;
      align-items: center;
    }
  
    .save-button {
      padding: 6px 12px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .save-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  
    .file-name {
      color: #666;
      font-size: 14px;
      flex: 1;
    }
  
    textarea {
      flex: 1;
      padding: 16px;
      border: none;
      resize: none;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.5;
      width: 100%;
      height: calc(100% - 50px);
    }
  
    textarea:focus {
      outline: none;
    }
  </style>