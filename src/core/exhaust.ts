import Matter from "matter-js";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
};

export class RocketExhaust {
    private particles: Particle[] = [];
    private animationFrameId?: number;
    private baseSpeed = 1;
    private speedVariance = 50;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private leftPoint: Matter.Vector,
        private rightPoint: Matter.Vector,
        private exhaustAmount: number,
        private angle: number,
    ) {}

    startAnimation() {
        console.log("startAnimation");
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
        angle: number,
    ) {
        this.leftPoint = leftPoint;
        this.rightPoint = rightPoint;
        this.exhaustAmount = Math.max(0, Math.min(1, exhaustAmount));
        this.angle = angle;
    }

    private animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        // Clear canvas with black background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.emitParticles();
        this.updateParticles();
        this.drawParticles();
    }

    private emitParticles() {
        const count = Math.floor(100 + 150 * this.exhaustAmount);
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    private createParticle(): Particle {
        // Create particles between left and right points
        const t = Math.random() * Math.random();
        const bottomX = this.rightPoint.x - this.leftPoint.x;
        const bottomY = this.rightPoint.y - this.leftPoint.y;
        const x = this.leftPoint.x + t * Math.cos(this.angle) * bottomX;
        const y = this.leftPoint.y + t * Math.sin(this.angle) * bottomY;

        // Velocity based on angle (0 = straight up)
        const speed = Math.random() * this.speedVariance;
        const velX = -Math.sin(this.angle) * speed;
        const velY = Math.cos(this.angle) * speed;

        return {
            x,
            y,
            vx: velX,
            vy: velY,
            life: 0.2,
            size: Math.random(),
        };
    }

    private updateParticles() {
        this.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.01; // Gravity
            // p.vx *= 0.99; // Air resistance
            p.vy *= 0.97;
            p.life -= 0.02;
            p.size *= 0.99;
        });

        // Remove dead particles
        this.particles = this.particles.filter((p) => p.life > 0 && p.size > 0);
    }

    private drawParticles() {
        const nozzleMidX = (this.leftPoint.x + this.rightPoint.x) / 2;
        const nozzleMidY = (this.leftPoint.y + this.rightPoint.y) / 2;

        this.particles.forEach((p) => {
            // Calculate distance from exhaust source
            // 626 max distance
            const distance = Math.hypot(p.x - nozzleMidX, p.y - nozzleMidY);

            // Combined temperature factors
            const lifeFactor = Math.min(p.life, 1);
            const velocityFactor = Math.min(1, Math.hypot(p.vx, p.vy) / 15);

            // Temperature based on distance and life (closer = hotter)
            const temp = 12000 - 200 * distance * velocityFactor * lifeFactor;

            // Get color from temperature
            const [r, g, b] = this.temperatureToColor(temp);

            // Create gradient with distance-based falloff
            const gradient = this.ctx.createRadialGradient(
                p.x,
                p.y,
                0,
                p.x,
                p.y,
                p.size * 2,
            );

            // Core color (hotter)
            gradient.addColorStop(
                0,
                `rgba(${r}, ${g}, ${b}, ${0.9 * lifeFactor})`,
            );

            // // Edge color (cooler based on distance)
            // const edgeColor = this.temperatureToColor(temp * 0.4);
            // gradient.addColorStop(1, `rgba(${edgeColor.join(',')}, ${0.3 * lifeFactor})`);

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }

    private temperatureToColor(kelvin: number): [number, number, number] {
        const temp = Math.max(1000, Math.min(13_000, kelvin)) / 100;

        // Enhanced color calculation
        let r, g, b;

        if (temp > 66) {
            // Hot region(blue - white)
            r = 255;
            g = Math.max(0, 255 - (temp - 66) * 2.5);
            b = Math.max(0, 255 - (temp - 66) * 1.2);
        } else {
            // Cool region (orange-red)
            r = 255;
            g = Math.min(255, 125 + temp * 1.5);
            b = Math.max(0, 50 - temp * 0.5);
        }

        return [Math.min(255, r), Math.min(255, g), Math.min(255, b)];
    }
}
