'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { RocketExhaust } from '@/core/exhaust';

interface RocketSimulatorProps {
  controlFunction: string;
  isRunning: boolean;
  onReset: () => void;
}

let exhuast: RocketExhaust | null = null;

const RocketSimulator = ({ controlFunction, isRunning, onReset }: RocketSimulatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rocketRef = useRef<Matter.Body | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup Matter.js engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.5 },
    });
    engineRef.current = engine;

    // Create custom rocket vertices for triangular shape with nose cone
    const rocketWidth = 8;
    const rocketHeight = 60;
    const vertices = [
      { x: 0, y: -rocketHeight / 2 },               // Top point
      { x: rocketWidth / 2, y: -rocketHeight / 3 },   // Right shoulder
      { x: rocketWidth / 2, y: rocketHeight / 2 },    // Right bottom
      { x: -rocketWidth / 2, y: rocketHeight / 2 },   // Left bottom
      { x: -rocketWidth / 2, y: -rocketHeight / 3 },  // Left shoulder
    ];

    // Create rocket body
    const rocket = Matter.Bodies.fromVertices(
      canvas.width * 0.3,  // x position
      canvas.height * 0.15, // y position
      [vertices],
      {
        mass: 1,
        friction: 0,
        frictionAir: 0,
        restitution: 0,
      }
    );
    rocketRef.current = rocket;

    // Create landing pad
    const landingPad = Matter.Bodies.rectangle(
      canvas.width * 0.7,    // x position
      canvas.height - 30,    // y position
      60,                    // width
      5,                     // height
      {
        isStatic: true,
        render: {
          fillStyle: '#4CAF50',
        },
      }
    );

    // Add bodies to world
    Matter.Composite.add(engine.world, [rocket, landingPad]);

    // Setup renderer
    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: '#000',
      },
    });

    // Custom render function
    const renderScene = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !rocket) return;

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw landing pad
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(
        landingPad.position.x - 30,
        landingPad.position.y - 2.5,
        60,
        5
      );

      // Save context for rocket rotation
      ctx.save();
      // ctx.translate(rocket.position.x, rocket.position.y);
      // ctx.rotate(rocket.angle);

      // Draw rocket body
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      const vertices = rocket.vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        const vertex = vertices[i];
        ctx.lineTo(vertex.x, vertex.y);
      }
      ctx.closePath();
      ctx.fill();

      // Draw side thrusters
      ctx.fillStyle = '#ddd';
      const thrusterWidth = 3;
      const thrusterHeight = 3;
      const thrusterY = rocketHeight * 0.4;
      ctx.fillRect(-rocketWidth / 2 - thrusterWidth, thrusterY, thrusterWidth, thrusterHeight);
      ctx.fillRect(rocketWidth / 2, thrusterY, thrusterWidth, thrusterHeight);

      ctx.restore();
    };

    // Override Matter.js render with custom render
    // Matter.Render.run = () => { };
    render.canvas.width = canvas.width;
    render.canvas.height = canvas.height;
    Matter.Runner.run(engine);
    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      // Update landing pad position
      Matter.Body.setPosition(landingPad, {
        x: canvas.width * 0.7,
        y: canvas.height - 30,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();


    // Animation loop
    const animate = () => {
      renderScene();
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Engine.clear(engine);
      if (requestRef.current) {
        // cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Handle simulation state
  useEffect(() => {
    if (!engineRef.current || !rocketRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rocket = rocketRef.current;


    let controlFn;
    try {
      controlFn = new Function('state', 'landingPad', `return (${controlFunction})(state, landingPad);`);
    } catch {
      controlFn = undefined
    }

    const control = controlFn?.(
      {
        position: rocket.position,
        velocity: rocket.velocity,
        angle: rocket.angle,
        angularVelocity: rocket.angularVelocity,
        fuel: 100, // TODO: Implement fuel system
      },
      {
        x: canvas.width * 0.7,
        y: canvas.height - 30,
        width: 60,
      }
    ) ?? { mainThrust: 0, leftThrust: 0, rightThrust: 0 };

    const ctx = canvas!.getContext('2d')!
    const vertices = rocket.vertices;
    if (!exhuast) {
      exhuast = new RocketExhaust(ctx, vertices[4], vertices[3], control.mainThrust, rocket.angle);
    }

    if (isRunning) {
      let lastTime = 0;
      const animate = (time: number) => {
        if (lastTime !== 0) {
          const delta = Math.min(time - lastTime, 15);
          Matter.Engine.update(engineRef.current!, delta);

          // console.log("rocketAngle: ", rocket.angle * 180 / Math.PI);
          try {
            // Apply forces based on control
            if (control.mainThrust) {
              const force = 0.001;
              Matter.Body.applyForce(rocket, rocket.position, {
                x: Math.sin(rocket.angle) * force * control.mainThrust,
                y: -Math.cos(rocket.angle) * force * control.mainThrust,
              });
            }

            if (control.leftThrust) {
              Matter.Body.setAngularVelocity(rocket, rocket.angularVelocity - 0.001 * control.leftThrust);
            }

            if (control.rightThrust) {
              Matter.Body.setAngularVelocity(rocket, rocket.angularVelocity + 0.001 * control.rightThrust);
            }
          } catch (error) {
            console.error('Error in control function:', error);
            onReset();
          }
        }
        if (!exhuast) {
          exhuast = new RocketExhaust(ctx, vertices[4], vertices[3], control.mainThrust, rocket.angle);
        }
        exhuast.updateParameters(vertices[4], vertices[3], control.mainThrust, rocket.angle);
        exhuast.startAnimation();
        exhuast.stopAnimation();

        lastTime = time;
        requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);
    } else {
      Matter.Body.setPosition(rocket, { x: canvas.width * 0.15, y: canvas.height * 0.15 });
      Matter.Body.setVelocity(rocket, { x: 0, y: 0 });
      Matter.Body.setAngle(rocket, 0);
      Matter.Body.setAngularVelocity(rocket, 0);
      exhuast.updateParameters(vertices[4], vertices[3], control.mainThrust, rocket.angle);
      exhuast.startAnimation();
      exhuast.stopAnimation();
    }


    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, controlFunction, onReset]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full background-black"
    />
  );
};

export { RocketSimulator };
