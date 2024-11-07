<script>
  import { onMount, onDestroy } from 'svelte';
  
  let canvas;
  let ctx;
  let gameLoop;
  
  const TILE_SIZE = 32;
  const PLAYER_SPEED = 3;
  const MAP_SIZE = 50;
  
  let player = {
    x: (MAP_SIZE * TILE_SIZE) / 2,
    y: (MAP_SIZE * TILE_SIZE) / 2,
    width: 32,
    height: 48,
    direction: 'down',
    frame: 0,
    moving: false,
    hasCat: false
  };
  
  let cat = {
    x: TILE_SIZE * 10,
    y: TILE_SIZE * 10,
    found: false
  };
  
  let owner = {
    x: TILE_SIZE * 40,
    y: TILE_SIZE * 40
  };
  
  let mission = {
    started: false,
    completed: false,
    message: ''
  };
  
  let camera = {
    x: player.x - 400,
    y: player.y - 300
  };
  
  let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  };
  
  const worldMap = Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(0));
  
  let initialMessage = {
    show: true,
    timer: 5000 
  };
  
  function generateRivers() {
    for (let y = 10; y < MAP_SIZE - 10; y += 15) {
      let riverWidth = 3;
      for (let x = 0; x < MAP_SIZE; x++) {
        let offset = Math.floor(Math.sin(x * 0.2) * 3);
        for (let w = 0; w < riverWidth; w++) {
          if (y + offset + w >= 0 && y + offset + w < MAP_SIZE) {
            worldMap[y + offset + w][x] = 2;
          }
        }
        
        if (x % 20 === 0) {
          for (let w = 0; w < riverWidth; w++) {
            if (y + offset + w >= 0 && y + offset + w < MAP_SIZE) {
              worldMap[y + offset + w][x] = 3;
            }
          }
        }
      }
    }
    
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        if (worldMap[y][x] === 0 && Math.random() < 0.1) {
          worldMap[y][x] = 1;
        }
      }
    }
  }
  
  function posicionarGatoAleatoriamente() {
    let posicaoValida = false;
    
    while (!posicaoValida) {
      const x = Math.floor(Math.random() * (MAP_SIZE - 4)) + 2;
      const y = Math.floor(Math.random() * (MAP_SIZE - 4)) + 2;
      
      if (worldMap[y][x] === 0) {
        let areaLivre = true;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (worldMap[y + dy][x + dx] !== 0) {
              areaLivre = false;
            }
          }
        }
        
        if (areaLivre) {
          cat.x = x * TILE_SIZE;
          cat.y = y * TILE_SIZE;
          posicaoValida = true;
        }
      }
    }
  }
  
  generateRivers();
  posicionarGatoAleatoriamente();
  
  function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
    }
  }
  
  function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
    }
  }
  
  function checkCollision(x, y) {
    const points = [
      { x: x + 8, y: y + 8 },     
      { x: x + 24, y: y + 8 },    
      { x: x + 8, y: y + 40 },    
      { x: x + 24, y: y + 40 }    
    ];
    
    for (const point of points) {
      const tileX = Math.floor(point.x / TILE_SIZE);
      const tileY = Math.floor(point.y / TILE_SIZE);
      
      if (tileX >= 0 && tileX < worldMap[0].length && 
          tileY >= 0 && tileY < worldMap.length) {
        if (worldMap[tileY][tileX] === 1 || worldMap[tileY][tileX] === 2) {
          return true;
        }
      }
    }
    return false;
  }
  
  function updatePlayer() {
    let newX = player.x;
    let newY = player.y;
    player.moving = false;
    
    if (keys.ArrowUp) {
      newY -= PLAYER_SPEED;
      player.direction = 'up';
      player.moving = true;
    }
    if (keys.ArrowDown) {
      newY += PLAYER_SPEED;
      player.direction = 'down';
      player.moving = true;
    }
    if (keys.ArrowLeft) {
      newX -= PLAYER_SPEED;
      player.direction = 'left';
      player.moving = true;
    }
    if (keys.ArrowRight) {
      newX += PLAYER_SPEED;
      player.direction = 'right';
      player.moving = true;
    }
    
    const mapWidth = worldMap[0].length * TILE_SIZE;
    const mapHeight = worldMap.length * TILE_SIZE;
    
    newX = Math.max(0, Math.min(newX, mapWidth - player.width));
    newY = Math.max(0, Math.min(newY, mapHeight - player.height));
    
    if (!checkCollision(newX, newY)) {
      player.x = newX;
      player.y = newY;
    }
    
    if (player.moving) {
      player.frame = (player.frame + 0.15) % 2;
    } else {
      player.frame = 0;
    }
    
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
  }
  
  function drawTree(x, y) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 12, y + 16, 8, 16);
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 4);
    ctx.lineTo(x + 28, y + 20);
    ctx.lineTo(x + 4, y + 20);
    ctx.fill();
    
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 8);
    ctx.lineTo(x + 26, y + 22);
    ctx.lineTo(x + 6, y + 22);
    ctx.fill();
    
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 12);
    ctx.lineTo(x + 24, y + 24);
    ctx.lineTo(x + 8, y + 24);
    ctx.fill();
  }
  
  function drawPlayer() {
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(screenX + 12, screenY + 20, 8, 16);
    
    ctx.fillStyle = '#FFE4C4';  
    ctx.fillRect(screenX + 12, screenY + 12, 8, 8);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(screenX + 10, screenY + 8, 12, 6);
    ctx.fillRect(screenX + 10, screenY + 14, 2, 6);
    ctx.fillRect(screenX + 20, screenY + 14, 2, 6);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(screenX + 14, screenY + 16, 2, 2);
    ctx.fillRect(screenX + 18, screenY + 16, 2, 2);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenX + 15, screenY + 19);
    ctx.lineTo(screenX + 17, screenY + 19);
    ctx.stroke();
    
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(screenX + 8, screenY + 22, 4, 8);
    ctx.fillRect(screenX + 20, screenY + 22, 4, 8);
    
    ctx.fillStyle = '#000080';
    ctx.fillRect(screenX + 12, screenY + 36, 8, 8);
    
    const legOffset = player.moving ? Math.sin(player.frame * Math.PI) * 5 : 0;
    
    ctx.fillStyle = '#000080';
    ctx.fillRect(screenX + 12, screenY + 36 + legOffset, 4, 8);
    
    ctx.fillRect(screenX + 16, screenY + 36 - legOffset, 4, 8);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(screenX + 12, screenY + 44 + legOffset, 4, 2);
    ctx.fillRect(screenX + 16, screenY + 44 - legOffset, 4, 2);
  }
  
  function checkMissionInteraction() {
    const distanceToCat = Math.hypot(player.x - cat.x, player.y - cat.y);
    const distanceToOwner = Math.hypot(player.x - owner.x, player.y - owner.y);
    
    if (!player.hasCat && !cat.found && distanceToCat < TILE_SIZE * 1.5) {
      player.hasCat = true;
      cat.found = true;
      mission.started = true;
      mission.message = 'Você encontrou o gato! Leve-o ao seu dono.';
    }
    
    if (player.hasCat && distanceToOwner < TILE_SIZE * 1.5) {
      mission.completed = true;
      mission.message = 'Parabéns! Você completou a missão!';
      player.hasCat = false;
    }
  }
  
  function drawMissionElements() {
    if (!cat.found) {
        const catScreenX = cat.x - camera.x;
        const catScreenY = cat.y - camera.y;
        
        ctx.fillStyle = '#808080';
        ctx.fillRect(catScreenX + 10, catScreenY + 16, 12, 8);
        
        ctx.fillRect(catScreenX + 8, catScreenY + 10, 16, 10);
        
        ctx.beginPath();
        ctx.moveTo(catScreenX + 8, catScreenY + 10);
        ctx.lineTo(catScreenX + 12, catScreenY + 4);
        ctx.lineTo(catScreenX + 16, catScreenY + 10);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(catScreenX + 16, catScreenY + 10);
        ctx.lineTo(catScreenX + 20, catScreenY + 4);
        ctx.lineTo(catScreenX + 24, catScreenY + 10);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.fillRect(catScreenX + 11, catScreenY + 13, 3, 3);
        ctx.fillRect(catScreenX + 18, catScreenY + 13, 3, 3);
        
        ctx.fillStyle = '#FFC0CB';
        ctx.fillRect(catScreenX + 14, catScreenY + 16, 4, 2);
        
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(catScreenX + 22, catScreenY + 20);
        ctx.quadraticCurveTo(catScreenX + 28, catScreenY + 16, catScreenX + 28, catScreenY + 24);
        ctx.stroke();
    }
    
    const ownerScreenX = owner.x - camera.x;
    const ownerScreenY = owner.y - camera.y;
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(ownerScreenX + 12, ownerScreenY + 20, 8, 16);
    
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(ownerScreenX + 12, ownerScreenY + 12, 8, 8);
    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(ownerScreenX + 10, ownerScreenY + 8, 12, 6);
    ctx.fillRect(ownerScreenX + 10, ownerScreenY + 14, 2, 8);
    ctx.fillRect(ownerScreenX + 20, ownerScreenY + 14, 2, 8);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(ownerScreenX + 14, ownerScreenY + 16, 2, 2);
    ctx.fillRect(ownerScreenX + 18, ownerScreenY + 16, 2, 2);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ownerScreenX + 15, ownerScreenY + 19);
    ctx.lineTo(ownerScreenX + 17, ownerScreenY + 19);
    ctx.stroke();
    
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(ownerScreenX + 8, ownerScreenY + 22, 4, 8);
    ctx.fillRect(ownerScreenX + 20, ownerScreenY + 22, 4, 8);
    
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(ownerScreenX + 12, ownerScreenY + 36, 4, 6);
    ctx.fillRect(ownerScreenX + 16, ownerScreenY + 36, 4, 6);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(ownerScreenX + 12, ownerScreenY + 42, 4, 2);
    ctx.fillRect(ownerScreenX + 16, ownerScreenY + 42, 4, 2);
  }
  
  function drawGPS() {
    if (mission.started && !mission.completed && cat.found) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(player.x - camera.x + 16, player.y - camera.y + 16);
      ctx.lineTo(owner.x - camera.x + 16, owner.y - camera.y + 16);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  function drawMissionText() {
    if (initialMessage.show) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(50, canvas.height / 3, canvas.width - 100, 100);
      
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Missão: Encontre o gato perdido!', canvas.width / 2, canvas.height / 3 + 40);
      ctx.font = '16px Arial';
      ctx.fillText('Explore o mapa e procure pelo gatinho cinza.', canvas.width / 2, canvas.height / 3 + 70);
    } else if (mission.message) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, canvas.width - 20, 30);
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(mission.message, canvas.width / 2, 30);
    }
  }
  
  function drawWater(x, y) {
    const time = Date.now() * 0.001;
    const wave = Math.sin(time + y * 0.1) * 2;
    
    ctx.fillStyle = '#4FA4E8';
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    
    ctx.fillStyle = '#5BB1F5';
    ctx.beginPath();
    ctx.moveTo(x, y + wave);
    ctx.lineTo(x + TILE_SIZE, y + wave);
    ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE);
    ctx.lineTo(x, y + TILE_SIZE);
    ctx.fill();
  }
  
  function drawBridge(x, y) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y + 8, TILE_SIZE, TILE_SIZE - 16);
    
    ctx.fillStyle = '#654321';
    ctx.fillRect(x, y + 4, TILE_SIZE, 4);
    ctx.fillRect(x, y + TILE_SIZE - 8, TILE_SIZE, 4);
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < worldMap.length; y++) {
      for (let x = 0; x < worldMap[y].length; x++) {
        const screenX = x * TILE_SIZE - camera.x;
        const screenY = y * TILE_SIZE - camera.y;
        
        if (
          screenX > -TILE_SIZE && 
          screenX < canvas.width + TILE_SIZE &&
          screenY > -TILE_SIZE && 
          screenY < canvas.height + TILE_SIZE
        ) {
          ctx.fillStyle = '#90EE90';
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          
          switch(worldMap[y][x]) {
            case 1:
              drawTree(screenX, screenY);
              break;
            case 2:
              drawWater(screenX, screenY);
              break;
            case 3:
              drawBridge(screenX, screenY);
              break;
          }
        }
      }
    }
    
    drawMissionElements();
    drawGPS();
    drawPlayer();
    drawMissionText();
  }
  
  function gameUpdate() {
    updatePlayer();
    checkMissionInteraction();
    render();
  }
  
  onMount(() => {
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    gameLoop = setInterval(gameUpdate, 1000 / 60);
    
    setTimeout(() => {
      initialMessage.show = false;
    }, initialMessage.timer);
    
    render();
  });
  
  onDestroy(() => {
    clearInterval(gameLoop);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
</script>

<div class="game-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .game-container {
    width: 800px;
    height: 600px;
    background: #000;
  }
  
  canvas {
    width: 100%;
    height: 100%;
  }
</style>