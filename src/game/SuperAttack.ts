export class SuperAttack {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private color: string;
  private duration: number = 1.5; // seconds
  private timer: number = 0;
  private active: boolean = true;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  public update(deltaTime: number): void {
    this.timer += deltaTime;
    
    // Move upward
    this.y -= 300 * deltaTime;
    
    // Deactivate after duration
    if (this.timer >= this.duration) {
      this.active = false;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;
    
    ctx.save();
    
    // Create a glowing beam effect
    const gradient = ctx.createLinearGradient(
      this.x - this.width / 2,
      this.y,
      this.x + this.width / 2,
      this.y
    );
    gradient.addColorStop(0, 'rgba(0, 163, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(0, 163, 255, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 163, 255, 1)');
    gradient.addColorStop(0.8, 'rgba(0, 163, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 163, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    
    // Draw beam
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
    
    // Draw dollar signs inside the beam
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const dollarCount = 5;
    for (let i = 0; i < dollarCount; i++) {
      const xPos = this.x - this.width / 2 + (this.width / (dollarCount - 1)) * i;
      ctx.fillText('$', xPos, this.y);
    }
    
    ctx.restore();
  }

  public isActive(): boolean {
    return this.active;
  }

  public isCollidingWith(enemy: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.active &&
      Math.abs(enemy.x - this.x) < (this.width + enemy.width) / 2 &&
      Math.abs(enemy.y - this.y) < (this.height + enemy.height) / 2
    );
  }
}
