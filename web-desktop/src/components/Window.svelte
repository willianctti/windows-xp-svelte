<script>
    import { onMount, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let id;
    export let title;
    export let content;
    export let position = { x: 0, y: 0 };
  
    let isDragging = false;
    let windowElement;
    let offset = { x: 0, y: 0 };
  
    function startDrag(e) {
      isDragging = true;
      const rect = windowElement.getBoundingClientRect();
      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', stopDrag);
    }
  
    function drag(e) {
      if (!isDragging) return;
      
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;
      
      position = { x, y };
    }
  
    function stopDrag() {
      isDragging = false;
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', stopDrag);
    }
  
    onMount(() => {
      return () => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
      };
    });
  </script>
  
  <div 
    class="window"
    bind:this={windowElement}
    style="left: {position.x}px; top: {position.y}px"
  >
    <div class="titlebar" on:mousedown={startDrag}>
      <span>{title}</span>
      <button on:click={() => dispatch('close')}>✕</button>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
  
  <style>
    .window {
      position: absolute;
      min-width: 300px;
      min-height: 200px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
    }
  
    .titlebar {
      background: #333;
      color: white;
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      border-radius: 8px 8px 0 0;
    }
  
    .content {
      padding: 16px;
      flex-grow: 1;
      overflow: auto;
      height: calc(100% - 40px);
    }
  
    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }
  </style>