import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { Explosion } from './Explosion';
import { SuperAttack } from './SuperAttack';

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onHighScoreUpdate: (score: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameOver: () => void;
  productImageUrl: string;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private explosions: Explosion[] = [];
  private superAttacks: SuperAttack[] = [];
  private score: number = 0;
  private highScore: number = 0;
  private level: number = 1;
  private lives: number = 3;
  private gameOver: boolean = false;
  private animationFrameId: number = 0;
  private lastTime: number = 0;
  private enemyDirection: number = 1;
  private enemySpeed: number = 30;
  private enemyDropDistance: number = 30;
  private enemyFireRate: number = 0.005;
  private keysPressed: { [key: string]: boolean } = {};
  private callbacks: GameCallbacks;
  private enemyTypes = [
    { type: 'Bounce Rate', color: '#ff9517' },      // Orange
    { type: 'Abandoned Cart', color: '#50b83c' },   // Green
    { type: 'Low Performance', color: '#47c1bf' },  // Teal
    { type: 'Lost Customer', color: '#9c6ade' }     // Purple
  ];
  private superPowerActive: boolean = false;
  private superPowerTimer: number = 0;
  private superPowerDuration: number = 5; // seconds (reduced from 10 to 5)
  private autoFireTimer: number = 0;
  private autoFireInterval: number = 0.3; // seconds (increased from 0.2 to 0.3)

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('spaceInvadersHighScore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10);
      this.callbacks.onHighScoreUpdate(this.highScore);
    }
    
    // Initialize player
    this.player = new Player(
      this.canvas.width / 2 - 25,
      this.canvas.height - 60,
      50,
      40,
      '#3b5998'
    );
    
    // Set product image if provided
    if (callbacks.productImageUrl) {
      this.player.updateProductImage(callbacks.productImageUrl);
    }
    
    // Initialize enemies
    this.initEnemies();
  }

  private initEnemies(): void {
    this.enemies = [];
    const rows = Math.min(this.enemyTypes.length, 4);
    const cols = 8;
    const enemyWidth = 40;
    const enemyHeight = 30;
    const padding = 20;
    const startX = (this.canvas.width - (cols * (enemyWidth + padding))) / 2 + enemyWidth / 2;
    const startY = 60;
    
    for (let row = 0; row < rows; row++) {
      const enemyType = this.enemyTypes[row];
      
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (enemyWidth + padding);
        const y = startY + row * (enemyHeight + padding);
        
        this.enemies.push(new Enemy(
          x, 
          y, 
          enemyWidth, 
          enemyHeight, 
          enemyType.color,
          enemyType.type
        ));
      }
    }
    
    // Add additional rows for higher levels
    if (this.level > 1) {
      const additionalRows = Math.min(this.level - 1, 2);
      for (let row = 0; row < additionalRows; row++) {
        // Cycle through enemy types for additional rows
        const enemyTypeIndex = row % this.enemyTypes.length;
        const enemyType = this.enemyTypes[enemyTypeIndex];
        
        for (let col = 0; col < cols; col++) {
          const x = startX + col * (enemyWidth + padding);
          const y = startY + (rows + row) * (enemyHeight + padding);
          
          this.enemies.push(new Enemy(
            x, 
            y, 
            enemyWidth, 
            enemyHeight, 
            enemyType.color,
            enemyType.type
          ));
        }
      }
    }
  }

  public setSuperPowerActive(active: boolean): void {
    if (active && !this.superPowerActive) {
      // Activate superpower
      this.superPowerActive = true;
      this.superPowerTimer = 0;
      this.player.setSuperPowerActive(true);
      
      // Create a super attack
      this.triggerSuperAttack();
    } else if (!active && this.superPowerActive) {
      // Deactivate superpower
      this.superPowerActive = false;
      this.player.setSuperPowerActive(false);
    }
  }

  private triggerSuperAttack(): void {
    // Create a super attack that covers the width of the screen
    this.superAttacks.push(
      new SuperAttack(
        this.canvas.width / 2,
        this.canvas.height - 100,
        this.canvas.width * 0.8,
        50,
        '#00a3ff'
      )
    );
  }

  public start(): void {
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  private gameLoop(currentTime: number = performance.now()): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    if (!this.gameOver) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  private update(deltaTime: number): void {
    if (this.gameOver) return;
    
    // Update superpower timer
    if (this.superPowerActive) {
      this.superPowerTimer += deltaTime;
      
      // Auto-fire during superpower
      this.autoFireTimer += deltaTime;
      if (this.autoFireTimer >= this.autoFireInterval) {
        this.autoFireTimer = 0;
        this.fireSuperBullet();
      }
      
      // Deactivate superpower after duration
      if (this.superPowerTimer >= this.superPowerDuration) {
        this.superPowerActive = false;
        this.player.setSuperPowerActive(false);
      }
    }
    
    // Update player
    if (this.keysPressed['ArrowLeft']) {
      this.player.moveLeft(deltaTime);
    }
    if (this.keysPressed['ArrowRight']) {
      this.player.moveRight(deltaTime, this.canvas.width);
    }
    
    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update(deltaTime);
      
      // Remove bullets that are off screen
      if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvas.height) {
        this.bullets.splice(i, 1);
      }
    }
    
    // Update super attacks
    for (let i = this.superAttacks.length - 1; i >= 0; i--) {
      this.superAttacks[i].update(deltaTime);
      
      // Remove super attacks that are complete
      if (!this.superAttacks[i].isActive()) {
        this.superAttacks.splice(i, 1);
      }
    }
    
    // Update enemies
    let changeDirection = false;
    let reachedBottom = false;
    
    this.enemies.forEach((enemy) => {
      enemy.x += this.enemyDirection * this.enemySpeed * deltaTime;
      
      // Check if enemies hit the edge of the screen
      if (
        (enemy.x - enemy.width / 2 < 0 && this.enemyDirection < 0) ||
        (enemy.x + enemy.width / 2 > this.canvas.width && this.enemyDirection > 0)
      ) {
        changeDirection = true;
      }
      
      // Check if enemies reached the bottom
      if (enemy.y + enemy.height / 2 > this.canvas.height - 60) {
        reachedBottom = true;
      }
      
      // Random enemy shooting
      if (Math.random() < this.enemyFireRate * deltaTime) {
        this.bullets.push(
          new Bullet(enemy.x, enemy.y + enemy.height / 2, 5, 15, '#ff4f4f', 300)
        );
      }
    });
    
    // Change enemy direction and move down
    if (changeDirection) {
      this.enemyDirection *= -1;
      this.enemies.forEach((enemy) => {
        enemy.y += this.enemyDropDistance;
      });
    }
    
    // Game over if enemies reach the bottom
    if (reachedBottom) {
      this.lives = 0;
      this.callbacks.onLivesUpdate(this.lives);
      this.gameOver = true;
      this.callbacks.onGameOver();
      return;
    }
    
    // Update explosions
    this.explosions = this.explosions.filter((explosion) => {
      explosion.update(deltaTime);
      return explosion.isActive();
    });
    
    // Check collisions
    this.checkCollisions();
    
    // Check if level is complete
    if (this.enemies.length === 0) {
      this.level++;
      this.enemySpeed += 5;
      this.enemyFireRate += 0.001;
      this.initEnemies();
    }
  }

  private fireSuperBullet(): void {
    // Fire a wider, more powerful bullet
    this.bullets.push(
      new Bullet(
        this.player.x, 
        this.player.y - this.player.height / 2, 
        10, // Wider
        20, // Taller
        '#00a3ff', // Different color
        -700, // Faster
        true // Is super bullet
      )
    );
  }

  private checkCollisions(): void {
    // Check player bullets hitting enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      // Only check player bullets (moving upward)
      if (bullet.speed < 0) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          
          // For super bullets, use a wider collision area
          const extraWidth = bullet.isSuper ? bullet.width * 2 : 0;
          
          if (this.isColliding(
            { 
              x: bullet.x, 
              y: bullet.y, 
              width: bullet.width + extraWidth, 
              height: bullet.height 
            }, 
            enemy
          )) {
            // Create explosion
            this.explosions.push(
              new Explosion(enemy.x, enemy.y, 40, 40, enemy.color)
            );
            
            // Remove bullet and enemy
            this.bullets.splice(i, 1);
            this.enemies.splice(j, 1);
            
            // Update score - different points based on enemy type
            let points = 10;
            switch (enemy.type) {
              case 'Bounce Rate':
                points = 10;
                break;
              case 'Abandoned Cart':
                points = 20;
                break;
              case 'Low Performance':
                points = 30;
                break;
              case 'Lost Customer':
                points = 40;
                break;
            }
            
            // Double points for super bullets
            if (bullet.isSuper) {
              points *= 2;
            }
            
            this.score += points;
            this.callbacks.onScoreUpdate(this.score);
            
            // Update high score if needed
            if (this.score > this.highScore) {
              this.highScore = this.score;
              this.callbacks.onHighScoreUpdate(this.highScore);
              localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
            }
            
            // Break out of inner loop since bullet is gone
            break;
          }
        }
      } else {
        // Enemy bullets hitting player
        if (this.isColliding(bullet, this.player)) {
          // Create explosion
          this.explosions.push(
            new Explosion(this.player.x, this.player.y, 50, 50, this.player.color)
          );
          
          // Remove bullet
          this.bullets.splice(i, 1);
          
          // Don't take damage during superpower
          if (!this.superPowerActive) {
            // Decrease lives
            this.lives--;
            this.callbacks.onLivesUpdate(this.lives);
            
            // Check game over
            if (this.lives <= 0) {
              this.gameOver = true;
              this.callbacks.onGameOver();
            }
          }
        }
      }
    }
    
    // Check super attacks hitting enemies
    this.superAttacks.forEach((superAttack) => {
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (superAttack.isCollidingWith(enemy)) {
          // Create explosion
          this.explosions.push(
            new Explosion(enemy.x, enemy.y, 40, 40, enemy.color)
          );
          
          // Remove enemy
          this.enemies.splice(j, 1);
          
          // Update score - triple points for super attack
          let points = 0;
          switch (enemy.type) {
            case 'Bounce Rate':
              points = 30; // 3x normal
              break;
            case 'Abandoned Cart':
              points = 60; // 3x normal
              break;
            case 'Low Performance':
              points = 90; // 3x normal
              break;
            case 'Lost Customer':
              points = 120; // 3x normal
              break;
          }
          
          this.score += points;
          this.callbacks.onScoreUpdate(this.score);
          
          // Update high score if needed
          if (this.score > this.highScore) {
            this.highScore = this.score;
            this.callbacks.onHighScoreUpdate(this.highScore);
            localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
          }
        }
      }
    });
  }

  private isColliding(a: { x: number; y: number; width: number; height: number }, 
                      b: { x: number; y: number; width: number; height: number }): boolean {
    return (
      Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
      Math.abs(a.y - b.y) < (a.height + b.height) / 2
    );
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background grid (Shopify-like)
    this.drawGrid();
    
    // Draw super attacks
    this.superAttacks.forEach((superAttack) => {
      superAttack.draw(this.ctx);
    });
    
    // Draw player
    this.player.draw(this.ctx);
    
    // Draw enemies
    this.enemies.forEach((enemy) => {
      enemy.draw(this.ctx);
    });
    
    // Draw bullets
    this.bullets.forEach((bullet) => {
      bullet.draw(this.ctx);
    });
    
    // Draw explosions
    this.explosions.forEach((explosion) => {
      explosion.draw(this.ctx);
    });
    
    // Draw superpower indicator
    if (this.superPowerActive) {
      this.drawSuperPowerIndicator();
    }
  }

  private drawSuperPowerIndicator(): void {
    const timeLeft = Math.max(0, this.superPowerDuration - this.superPowerTimer);
    const percentage = timeLeft / this.superPowerDuration;
    
    this.ctx.save();
    
    // Draw background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(10, 10, 200, 20);
    
    // Draw progress bar
    this.ctx.fillStyle = 'rgba(0, 163, 255, 0.8)';
    this.ctx.fillRect(10, 10, 200 * percentage, 20);
    
    // Draw text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`SUPERPOWER: ${Math.ceil(timeLeft)}s`, 110, 24);
    
    this.ctx.restore();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#e6e6e6';
    this.ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= this.canvas.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.canvas.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  public handleKeyDown(key: string): void {
    this.keysPressed[key] = true;
    
    // Shoot on spacebar
    if (key === ' ' && !this.gameOver) {
      this.bullets.push(
        new Bullet(this.player.x, this.player.y - this.player.height / 2, 5, 15, '#008060', -500)
      );
    }
  }

  public handleKeyUp(key: string): void {
    this.keysPressed[key] = false;
  }
}
