import Matter from "matter-js";

export class RocketExhaust {
    private particles: Particle[] = [];
    private animationFrameId?: number;
    private lastTime = 0;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private leftPoint: Matter.Vector,
        private rightPoint: Matter.Vector,
        private exhaustAmount: number,
        private angle: number
    ) {
        this.startAnimation();
    }

    startAnimation() {
        this.lastTime = performance.now();
        this.animate();
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    updateParameters(
        leftPoint: Matter.Vector,
        rightPoint: Matter.Vector,
        exhaustAmount: number,
        angle: number
    ) {
        this.leftPoint = leftPoint;
        this.rightPoint = rightPoint;
        this.exhaustAmount = Math.max(0, Math.min(1, exhaustAmount));
        this.angle = angle;
    }

    private animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        const now = performance.now();
        // const deltaTime = now - this.lastTime;
        
        // Clear canvas with black background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.emitParticles();
        this.updateParticles();
        this.drawParticles();
        this.lastTime = now;
    }

    private emitParticles() {
        const count = Math.floor(50 * this.exhaustAmount);
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    private createParticle(): Particle {
        // Create particles between left and right points
        const t = Math.random();
        const x = this.leftPoint.x + t * (this.rightPoint.x - this.leftPoint.x);
        const y = this.leftPoint.y + t * (this.rightPoint.y - this.leftPoint.y);

        // Velocity based on angle (0 = straight up)
        const speed = 5 + Math.random() * 3;
        const velX = -Math.sin(this.angle) * speed;
        const velY = Math.cos(this.angle) * speed;

        return {
            x,
            y,
            vx: velX + (Math.random() - 0.5) * 1.5,
            vy: velY + (Math.random() - 0.5) * 1.5,
            life: Math.random() * 1,
            size: Math.random() * 4,
        };
    }

    private updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.vx *= 0.97; // Air resistance
            p.vy *= 0.97;
            p.life -= 0.02;
            p.size *= 0.97;
        });

        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0 && p.size > 0.5);
    }

    private drawParticles() {
        this.particles.forEach(p => {
            const alpha = Math.min(p.life, 1);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(30, 100%, ${70 * alpha}%, ${alpha})`;
            this.ctx.fill();
        });
    }
}

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
};
