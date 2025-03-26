export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  private speed: number = 300;
  private image: HTMLImageElement;
  private imageLoaded: boolean = false;
  private superPowerActive: boolean = false;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    
    // Load default snowboard image
    this.image = new Image();
    this.image.src = 'https://cdn.shopify.com/s/files/1/0757/9955/files/snowboard-product.png';
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  public moveLeft(deltaTime: number): void {
    // Move faster during superpower
    const speedMultiplier = this.superPowerActive ? 1.5 : 1;
    this.x -= this.speed * speedMultiplier * deltaTime;
    if (this.x < this.width / 2) {
      this.x = this.width / 2;
    }
  }

  public moveRight(deltaTime: number, canvasWidth: number): void {
    // Move faster during superpower
    const speedMultiplier = this.superPowerActive ? 1.5 : 1;
    this.x += this.speed * speedMultiplier * deltaTime;
    if (this.x > canvasWidth - this.width / 2) {
      this.x = canvasWidth - this.width / 2;
    }
  }

  public setSuperPowerActive(active: boolean): void {
    this.superPowerActive = active;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Add glow effect during superpower
    if (this.superPowerActive) {
      ctx.shadowColor = '#00a3ff';
      ctx.shadowBlur = 20;
    }
    
    if (this.imageLoaded) {
      // Draw product image
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      
      // Add a subtle border
      const borderColor = this.superPowerActive ? '#00a3ff' : '#008060';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = this.superPowerActive ? 3 : 2;
      ctx.strokeRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      
      // Add superpower indicator
      if (this.superPowerActive) {
        ctx.fillStyle = 'rgba(0, 163, 255, 0.3)';
        ctx.fillRect(
          this.x - this.width / 2,
          this.y - this.height / 2,
          this.width,
          this.height
        );
        
        // Add a star or sparkle effect
        const starSize = 10;
        ctx.fillStyle = '#ffffff';
        
        // Draw a simple star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = this.x + Math.cos(angle) * starSize;
          const y = this.y - this.height / 2 - 15 + Math.sin(angle) * starSize;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Fallback if image isn't loaded yet
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      
      // Draw "PRODUCT" text as placeholder
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRODUCT', this.x, this.y);
    }
    
    ctx.restore();
  }

  // Method to update the product image (would be called when fetching from API)
  public updateProductImage(imageUrl: string): void {
    this.imageLoaded = false;
    this.image = new Image();
    this.image.src = imageUrl;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }
}
