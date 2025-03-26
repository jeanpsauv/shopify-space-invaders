export class Bullet {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public speed: number;
  public isSuper: boolean;

  constructor(x: number, y: number, width: number, height: number, color: string, speed: number, isSuper: boolean = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.isSuper = isSuper;
  }

  public update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    ctx.fillStyle = this.color;
    
    if (this.speed < 0) {
      if (this.isSuper) {
        // Super bullet (wider tag with glow)
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(this.x - this.width, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x - this.width, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Add a dollar sign to represent a sale
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', this.x, this.y);
      } else {
        // Regular player bullet (upward) - draw as a tag/label
        ctx.beginPath();
        ctx.moveTo(this.x - this.width, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x - this.width, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Add a small circle to represent a price tag hole
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height / 4, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Enemy bullet (downward) - draw as a discount symbol
      ctx.beginPath();
      ctx.moveTo(this.x - this.width, this.y - this.height / 2);
      ctx.lineTo(this.x + this.width, this.y - this.height / 2);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Add % symbol
      ctx.fillStyle = 'white';
      ctx.font = `${this.width * 1.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('%', this.x, this.y);
    }
    
    ctx.restore();
  }
}
