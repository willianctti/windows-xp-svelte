<script>
    let url = "https://google.com";
    let iframeTitle = "Browser";
  </script>
  
  <div class="browser">
    <div class="address-bar">
      <input type="text" bind:value={url} />
    </div>
    <div class="browser-content">
      <iframe {url} title={iframeTitle} src={url}></iframe>
    </div>
  </div>
  
  <style>
    .browser {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  
    .address-bar {
      padding: 8px;
      background: #f5f5f5;
    }
  
    .address-bar input {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  
    .browser-content {
      flex: 1;
    }
  
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>