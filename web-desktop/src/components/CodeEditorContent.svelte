<script>
    import { onMount } from 'svelte';
    import loader from '@monaco-editor/loader';
  
    let editorContainer;
    let editor;
    let loading = true;
    let previewFrame;
    let showPreview = false;
    let files = [];
    let selectedFile = null;
  
    onMount(async () => {
      console.log('Component mounted');
      await initEditor();
      await loadFiles();
      loading = false;
    });
  
    async function loadFiles() {
      console.log('Loading files...');
      try {
        const response = await fetch('http://localhost:3000/api/code-editor/files', {
          credentials: 'include'
        });
        console.log('Files response:', response);
        const data = await response.json();
        console.log('Files loaded:', data);
        files = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error loading files:', error);
        files = [];
      }
    }
  
    async function createNewFile() {
      const fileName = prompt('Enter file name (with extension):');
      if (!fileName) return;
  
      console.log('Creating new file:', fileName);
      try {
        const response = await fetch('http://localhost:3000/api/code-editor/save', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path: fileName,
            content: ''
          })
        });
        console.log('Save response:', response);
        const data = await response.json();
        console.log('Save result:', data);
  
        await loadFiles();
      } catch (error) {
        console.error('Error creating file:', error);
      }
    }
  
    function selectFile(file) {
      selectedFile = file;
      if (editor) {
        editor.setValue(file.content || '');
        document.title = `Editor - ${file.file_path}`;
        
        const extension = file.file_path.split('.').pop().toLowerCase();
        const languageMap = {
          'js': 'javascript',
          'ts': 'typescript',
          'html': 'html',
          'css': 'css',
          'json': 'json',
          'py': 'python',
          'svelte': 'html'
        };
        
        editor.updateOptions({
          language: languageMap[extension] || 'plaintext'
        });
        
        if (showPreview) {
          updatePreview();
        }
      }
    }
  
    function togglePreview() {
      showPreview = !showPreview;
      if (showPreview && selectedFile) {
        setTimeout(updatePreview, 100);
      }
    }
  
    function updatePreview() {
      if (!selectedFile || !showPreview || !previewFrame) return;
      
      const content = editor.getValue();
      const extension = selectedFile.file_path.split('.').pop().toLowerCase();
      
      try {
        const doc = previewFrame.contentDocument;
        doc.open();
        
        if (extension === 'html') {
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { 
                    margin: 0;
                    padding: 20px;
                    background: white;
                  }
                </style>
              </head>
              <body>${content}</body>
            </html>
          `);
        } else if (extension === 'css') {
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>${content}</style>
              </head>
              <body>
                <div style="padding: 20px">
                  <h1>Heading 1</h1>
                  <p>Paragraph text</p>
                  <button>Button</button>
                </div>
              </body>
            </html>
          `);
        }
        doc.close();
      } catch (error) {
        console.error('Preview error:', error);
      }
    }
  
    async function initEditor() {
      const monaco = await loader.init();
      
      editor = monaco.editor.create(editorContainer, {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true }
      });

      editor.onDidChangeModelContent(() => {
        if (showPreview) {
          updatePreview();
        }
      });
    }
  
    async function saveFile() {
      if (!selectedFile) return;
  
      try {
        const response = await fetch('http://localhost:3000/api/code-editor/save', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path: selectedFile.file_path,
            content: editor.getValue()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save file');
        }

        selectedFile.content = editor.getValue();
        files = files.map(f => 
          f.file_path === selectedFile.file_path ? selectedFile : f
        );

        console.log('File saved successfully');
      } catch (error) {
        console.error('Error saving file:', error);
        alert('Failed to save file');
      }
    }
  </script>
  
  <div class="editor-container">
    <div class="sidebar">
      <div class="file-explorer">
        <div class="explorer-header">
          <span>EXPLORER</span>
          <button class="new-file-btn" on:click={createNewFile}>+</button>
        </div>
        <div class="file-list">
          {#each files as file}
            <div 
              class="file-item" 
              class:selected={selectedFile === file}
              on:click={() => selectFile(file)}
            >
              <span class="file-icon">📄</span>
              <span class="file-name">{file.file_path}</span>
              <button 
                class="delete-btn" 
                on:click|stopPropagation={async (e) => {
                  if (confirm('Delete this file?')) {
                    await fetch(`http://localhost:3000/api/code-editor/files/${encodeURIComponent(file.file_path)}`, {
                      method: 'DELETE',
                      credentials: 'include'
                    });
                    await loadFiles();
                  }
                }}
              >
                ❌
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="toolbar">
        <div class="current-file">
          {#if selectedFile}
            📄 {selectedFile.file_path}
          {:else}
            Nenhum arquivo selecionado
          {/if}
        </div>
        <div class="toolbar-buttons">
          {#if selectedFile}
            <button class="save-btn" on:click={saveFile}>
              💾 Save
            </button>
          {/if}
          <button class="preview-btn" on:click={togglePreview}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>
      
      <div class="content-area">
        <div class="editor" class:with-preview={showPreview} bind:this={editorContainer}></div>
        
        {#if showPreview}
          <div class="preview">
            <iframe bind:this={previewFrame} title="Preview" sandbox="allow-same-origin allow-scripts"></iframe>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <style>
    .editor-container {
      display: flex;
      height: 800px;
      width: 90vw;
      background: #1e1e1e;
      color: #fff;
      overflow: hidden;
    }
  
    .sidebar {
      width: 250px;
      min-width: 250px;
      background: #252526;
      border-right: 1px solid #444;
      overflow-y: auto;
    }
  
    .file-explorer {
      height: 100%;
    }
  
    .explorer-header {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #2d2d2d;
      border-bottom: 1px solid #444;
    }
  
    .file-list {
      padding: 8px;
    }
  
    .file-item {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 3px;
      gap: 8px;
    }
  
    .file-item:hover {
      background: #2d2d2d;
    }
  
    .file-item.selected {
      background: #37373d;
    }
  
    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  
    .delete-btn {
      opacity: 0;
      background: none;
      border: none;
      color: #888;
      cursor: pointer;
      padding: 2px;
    }
  
    .file-item:hover .delete-btn {
      opacity: 1;
    }
  
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
  
    .content-area {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
  
    .editor {
      flex: 1;
      transition: width 0.3s;
      min-width: 0;
    }
  
    .editor.with-preview {
      width: 50%;
    }
  
    .preview {
      width: 50%;
      background: white;
      border-left: 1px solid #444;
      overflow: hidden;
    }
  
    .preview iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    }
  
    .toolbar {
      height: 40px;
      padding: 0 16px;
      border-bottom: 1px solid #444;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #252526;
    }
  
    .toolbar-buttons {
      display: flex;
      gap: 8px;
    }
  
    .save-btn, .preview-btn {
      padding: 4px 12px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      background: #2d2d2d;
      color: white;
      font-size: 12px;
      height: 28px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  
    .save-btn:hover, .preview-btn:hover {
      background: #3d3d3d;
    }
  
    .new-file-btn {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 3px;
    }
  
    .new-file-btn:hover {
      background: #3d3d3d;
    }
  
    .current-file {
      font-size: 12px;
      color: #ccc;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>