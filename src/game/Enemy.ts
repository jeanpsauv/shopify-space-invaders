export class Enemy {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public type: string;
  private displayName: string;

  constructor(x: number, y: number, width: number, height: number, color: string, type: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    
    // Create shorter display names for rendering
    switch (type) {
      case 'Bounce Rate':
        this.displayName = 'Bounce';
        break;
      case 'Abandoned Cart':
        this.displayName = 'Cart';
        break;
      case 'Low Performance':
        this.displayName = 'Perf';
        break;
      case 'Lost Customer':
        this.displayName = 'Lost';
        break;
      default:
        this.displayName = type;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Draw enemy base shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fill();
    
    // Draw enemy type label - use smaller font and shortened name
    ctx.fillStyle = 'white';
    ctx.font = '7px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.displayName, this.x, this.y + this.height / 3);
    
    // Draw specific icons based on enemy type
    switch (this.type) {
      case 'Bounce Rate':
        this.drawBounceRate(ctx);
        break;
      case 'Abandoned Cart':
        this.drawAbandonedCart(ctx);
        break;
      case 'Low Performance':
        this.drawLowPerformance(ctx);
        break;
      case 'Lost Customer':
        this.drawLostCustomer(ctx);
        break;
    }
    
    ctx.restore();
  }
  
  private drawBounceRate(ctx: CanvasRenderingContext2D): void {
    // Draw bounce arrow
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    // Draw arrow going down and bouncing up
    ctx.beginPath();
    ctx.moveTo(this.x - this.width / 4, this.y - this.height / 4);
    ctx.lineTo(this.x, this.y - this.height / 10);
    ctx.lineTo(this.x + this.width / 4, this.y - this.height / 4);
    ctx.stroke();
  }
  
  private drawAbandonedCart(ctx: CanvasRenderingContext2D): void {
    // Draw cart wheels
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x - this.width / 4, this.y - this.height / 10, this.width / 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x + this.width / 4, this.y - this.height / 10, this.width / 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw X mark to indicate abandoned
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x - this.width / 5, this.y - this.height / 4);
    ctx.lineTo(this.x + this.width / 5, this.y - this.height / 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 5, this.y - this.height / 4);
    ctx.lineTo(this.x - this.width / 5, this.y - this.height / 10);
    ctx.stroke();
  }
  
  private drawLowPerformance(ctx: CanvasRenderingContext2D): void {
    // Draw performance meter (low)
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    
    // Draw meter outline
    ctx.strokeRect(this.x - this.width / 3, this.y - this.height / 3, this.width * 2/3, this.height / 6);
    
    // Draw low level indicator
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x - this.width / 3, this.y - this.height / 3, this.width / 5, this.height / 6);
  }
  
  private drawLostCustomer(ctx: CanvasRenderingContext2D): void {
    // Draw person icon with X
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    
    // Draw head
    ctx.beginPath();
    ctx.arc(this.x, this.y - this.height / 4, this.width / 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw body
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.height / 4 + this.width / 8);
    ctx.lineTo(this.x, this.y - this.height / 10);
    ctx.stroke();
    
    // Draw arms
    ctx.beginPath();
    ctx.moveTo(this.x - this.width / 6, this.y - this.height / 6);
    ctx.lineTo(this.x + this.width / 6, this.y - this.height / 6);
    ctx.stroke();
    
    // Draw X over person
    ctx.beginPath();
    ctx.moveTo(this.x - this.width / 4, this.y - this.height / 3);
    ctx.lineTo(this.x + this.width / 4, this.y - this.height / 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 4, this.y - this.height / 3);
    ctx.lineTo(this.x - this.width / 4, this.y - this.height / 10);
    ctx.stroke();
  }
}
