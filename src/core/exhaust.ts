import Matter from "matter-js";

export function animateExhaust(
  ctx: CanvasRenderingContext2D,
  leftPoint: Matter.Vector,
  rightPoint: Matter.Vector,
  exhaustAmount: number,
  angle: number
) {
  const particles: Particle[] = [];

  type Particle = {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    lifetime: number;
    initialLifetime: number;
    size: number;
    opacity: number;
  };

  function createParticle(): Particle {
    // Generate particles along the nozzle line
    const dx = rightPoint.x - leftPoint.x;
    const dy = rightPoint.y - leftPoint.y;
    const t = Math.random();
    const x = leftPoint.x + dx * t;
    const y = leftPoint.y + dy * t;

    const speed = Math.random() * 3 + 1;
    const angleVariation = (Math.random() - 0.5) * 0.5; // Wider spread
    const angleWithVariation = angle + angleVariation;

    // Correct velocity calculation for y-axis reference
    const velocity = {
      x: -Math.sin(angleWithVariation) * speed,
      y: Math.cos(angleWithVariation) * speed
    };

    const lifetime = Math.random() * 60 + 60;
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.5 + 0.5;

    return {
      x,
      y,
      velocity,
      lifetime,
      initialLifetime: lifetime,
      size,
      opacity
    };
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Apply velocity
      p.x += p.velocity.x;
      p.y += p.velocity.y;

      // Physics simulation
      p.velocity.x *= 0.98; // Air resistance
      p.velocity.y *= 0.98;
      p.velocity.y += 0.1; // Gravity

      // Update particle properties
      p.lifetime--;
      p.opacity = Math.max(0, p.opacity * 0.96);
      p.size = Math.max(0, p.size * 0.97);

      if (p.lifetime <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      // Color transition from orange to red
      const lifeFactor = p.lifetime / p.initialLifetime;
      const g = Math.floor(165 * lifeFactor);
      ctx.fillStyle = `rgba(255, ${g}, 0, ${p.opacity})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function emitParticles() {
    const baseCount = 50;
    const particleCount = Math.floor(baseCount + baseCount * exhaustAmount);
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  emitParticles();
  updateParticles();
  drawParticles();
}
