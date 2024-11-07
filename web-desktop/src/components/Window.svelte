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
    <span class="toolbar">
      <ul>
        <li>File</li>
        <li>Edit</li>
        <li>View</li>
        <li>Favorites</li>
        <li>Tools</li>
        <li>Help</li>
      </ul>
    </span>
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
      font-size: 14px;
      font-weight: 700;
      background: linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #154aa7 100%); 
      color: white;
      padding: 4px 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;  
      border-radius: 8px 8px 0 0;
    }

    .toolbar {
      padding: 3px 10px;
      border: 2px solid #0054E1;
      border-bottom: none;
      background: linear-gradient(to top, #EFECDB 0%, #D9D5C0 9%, #EFECDB 18%, #e9e4cc 92%, #a09b84 100%);
    }

    .toolbar ul {
      font-size: 10px;
      display: flex;
      gap: 8px;
      list-style: none;
    }
  
    .content {
      border-top: none;
      border: 2px solid #0054E1;
      border-radius:0 0 2px 2px;
      padding: 16px;
      flex-grow: 1;
      overflow: auto;
      height: calc(100% - 40px);
    }
  
    button {
      box-sizing: border-box;
      font-size: 16px;
      font-weight: 900;
      text-shadow:
        0 0 1px #000,
        0 0 1px #000,
        0 0 1px #000,
        0 0 1px #000;
        background: linear-gradient(to right, #f8f3f3 0%, #ecb7b7 9%, #ee8181 18%, #ff0000 92%, #910000 100%);
      padding: 2px 6px;
      border-radius: 2px;
      border:  1px solid #ffffff;
      color: #ffffff;
      cursor: pointer;
    }
  </style>