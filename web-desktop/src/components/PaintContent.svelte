<script>
    import { onMount } from 'svelte';
  
    let canvas;
    let ctx;
    let isDrawing = false;
    let color = '#000000';
    let lineWidth = 5;
    let tool = 'pencil'; 
  
    onMount(() => {
      ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    });
  
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  
    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }
  
    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath();
    }
  
    function draw(e) {
      if (!isDrawing) return;
  
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = tool === 'pencil' ? color : '#FFFFFF';
  
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  </script>
  
  <div class="paint-container">
    <div class="toolbar">
      <div class="tools">
        <button class:active={tool === 'pencil'} on:click={() => tool = 'pencil'}>
          ✏️ Lápis
        </button>
        <button class:active={tool === 'eraser'} on:click={() => tool = 'eraser'}>
          🧹 Borracha
        </button>
      </div>
      
      <div class="options">
        <input type="color" bind:value={color} />
        <input 
          type="range" 
          min="1" 
          max="50" 
          bind:value={lineWidth}
        />
        <span>{lineWidth}px</span>
      </div>
      
      <button on:click={clearCanvas}>🗑️ Limpar</button>
    </div>
  
    <canvas
      bind:this={canvas}
      on:mousedown={startDrawing}
      on:mousemove={draw}
      on:mouseup={stopDrawing}
      on:mouseleave={stopDrawing}
    ></canvas>
  </div>
  
  <style>
    .paint-container {
      width: 1200px;
      height: 600px;
      display: flex;
      flex-direction: column;
      background: #fff;
    }
  
    .toolbar {
      padding: 10px;
      display: flex;
      gap: 20px;
      background: #f0f0f0;
      border-bottom: 1px solid #ddd;
    }
  
    .tools, .options {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  
    canvas {
      flex: 1;
      border: 1px solid #ddd;
      cursor: crosshair;
    }
  
    button {
      padding: 5px 10px;
      cursor: pointer;
    }
  
    button.active {
      background: #007bff;
      color: white;
    }
  
    input[type="range"] {
      width: 100px;
    }
  </style>