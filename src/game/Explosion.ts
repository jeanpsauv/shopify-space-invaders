export class Explosion {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private color: string;
  private particles: Particle[] = [];
  private duration: number = 0.5; // seconds
  private timer: number = 0;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    
    // Create particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      const size = 2 + Math.random() * 5;
      
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: this.color,
        alpha: 1
      });
    }
  }

  public update(deltaTime: number): void {
    this.timer += deltaTime;
    
    // Update particles
    this.particles.forEach(particle => {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.alpha = Math.max(0, 1 - this.timer / this.duration);
    });
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Draw particles
    this.particles.forEach(particle => {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  public isActive(): boolean {
    return this.timer < this.duration;
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}
