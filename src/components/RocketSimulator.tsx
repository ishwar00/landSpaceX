"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { RocketExhaust } from "@/core/exhaust";
import { defaultControlRocket } from "@/core/controller";
import { $try } from "@/utils/try";

export interface RocketSimulatorProps {
    controlFunction: string;
    isRunning: boolean;
    onReset: () => void;
}

export interface RocketState {
    position: Matter.Vector; // center of mass
    velocity: Matter.Vector;
    inertia: number;
    mass: number;
    angle: number;
    angularVelocity: number;
    nozzle: Matter.Vector
}

export interface Environment {
    gravity: Matter.Vector;
    landingPad: LandingPad;
}

export interface LandingPad {
    x: number;
    y: number;
    width: number;
}

export interface RocketThrust {
    mainThrust: number;
    angleOfThrust: number;
}

type ControllerFn = (
    state: RocketState,
    landingPad: LandingPad,
) => RocketThrust;

let exhaust: RocketExhaust | null = null;

const createRocketVertices = (
    rocketWidth: number,
    rocketHeight: number,
): Matter.Vector[] => {
    return [
        // Nose cone and main body
        { x: 0, y: -rocketHeight / 2 }, // Top point
        { x: rocketWidth / 2, y: -rocketHeight / 3 }, // Right shoulder
        { x: rocketWidth / 2, y: rocketHeight / 2 }, // Right bottom

        // Nozzle flare
        { x: rocketWidth / 9, y: rocketHeight / 2 }, // Right nozzle indent
        { x: -rocketWidth / 9, y: rocketHeight / 2 }, // Left nozzle indent

        // Complete the symmetry
        { x: -rocketWidth / 2, y: rocketHeight / 2 }, // Left bottom
        { x: -rocketWidth / 2, y: -rocketHeight / 3 }, // Left shoulder
    ];
};

const RIGHT_NOZZLE = 4;
const LEFT_NOZZLE = 5;
const ROCKET_HEIGHT = 60;
const ROCKET_WIDTH = 8;
const MASS_OF_ROCKET = 100;
const GRAVITY = 0.001;

const RocketSimulator = ({
    controlFunction,
    isRunning,
    onReset,
}: RocketSimulatorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const rocketRef = useRef<Matter.Body | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Setup Matter.js engine
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 1, scale: GRAVITY },
        });
        engineRef.current = engine;

        // Create custom rocket vertices for triangular shape with nose cone
        const vertices = createRocketVertices(ROCKET_WIDTH, ROCKET_HEIGHT);

        // Create rocket body
        const rocket = Matter.Bodies.fromVertices(
            canvas.width * 0.3, // x position
            canvas.height * 0.15, // y position
            [vertices],
            {
                mass: MASS_OF_ROCKET,
                friction: 0,
                frictionAir: 0,
                restitution: 0,
            },
        );
        rocketRef.current = rocket;

        // Create landing pad
        const landingPad = Matter.Bodies.rectangle(
            canvas.width * 0.7, // x position
            canvas.height - 30, // y position
            60, // width
            5, // height
            {
                isStatic: true,
                render: {
                    fillStyle: "#4CAF50",
                },
            },
        );

        // Add bodies to world
        Matter.Composite.add(engine.world, [rocket, landingPad]);

        // Custom render function
        const renderScene = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx || !rocket) return;

            // Clear canvas
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw landing pad
            ctx.fillStyle = "#4CAF50";
            ctx.fillRect(
                landingPad.position.x - 30,
                landingPad.position.y - 2.5,
                60,
                5,
            );

            // Draw rocket body
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            const vertices = rocket.vertices;
            for (let i = 0; i < vertices.length; i++) {
                const vertex = vertices[i];
                ctx.lineTo(vertex.x, vertex.y);
            }
            ctx.closePath();
            ctx.fill();
        };

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

        window.addEventListener("resize", handleResize);
        handleResize();

        // Animation loop
        const animate = () => {
            renderScene();
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            Matter.Engine.clear(engine);
            if (requestRef.current) {
                // cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    // Handle simulation state
    useEffect(() => {
        if (!engineRef.current || !rocketRef.current || !canvasRef.current)
            return;

        const canvas = canvasRef.current;
        const rocket = rocketRef.current;
        const landingPad = {
            x: canvas.width * 0.7,
            y: canvas.height - 30,
            width: 60,
        };
        const ctx = canvas!.getContext("2d")!;
        const controlRocket: ControllerFn = $try(() =>
            eval(`(${controlFunction})`),
        ).catch(() => defaultControlRocket);

        if (typeof controlRocket !== "function") {
            // TODO: Add a notification to the user toast
            console.log("controlRocket is not defined");
            return;
        }

        const nozzlePosition = Matter.Vector.create(
            (rocket.vertices[4].x + rocket.vertices[5].x) / 2,
            (rocket.vertices[4].y + rocket.vertices[5].y) / 2,
        );

        const { mainThrust, angleOfThrust } = controlRocket({ ...rocket, nozzle: nozzlePosition }, landingPad);

        if (!exhaust) {
            const vertices = rocket.vertices;
            const thrustAngle = rocket.angle + angleOfThrust - Math.PI / 2;
            exhaust = new RocketExhaust(
                ctx,
                vertices[LEFT_NOZZLE],
                vertices[RIGHT_NOZZLE],
                mainThrust,
                thrustAngle,
            );
            exhaust.startAnimation();
        }

        if (isRunning) {
            let lastTime = 0;
            const animate = (time: number) => {
                const vertices = rocket.vertices;
                const nozzlePosition = Matter.Vector.create(
                    (rocket.vertices[4].x + rocket.vertices[5].x) / 2,
                    (rocket.vertices[4].y + rocket.vertices[5].y) / 2,
                );

                const { mainThrust, angleOfThrust } = controlRocket(
                    { ...rocket, nozzle: nozzlePosition },
                    landingPad,
                );

                const thrustAngle = rocket.angle + angleOfThrust - Math.PI / 2;
                if (lastTime !== 0) {
                    Matter.Engine.update(engineRef.current!);

                    try {
                        // Apply forces based on control
                        if (mainThrust) {
                            const maxThrust = 2 * rocket.mass * GRAVITY;
                            Matter.Body.applyForce(rocket, nozzlePosition, {
                                x: Math.sin(thrustAngle) * maxThrust * mainThrust,
                                y: -Math.cos(thrustAngle) * maxThrust * mainThrust,
                            });
                        }
                    } catch (error) {
                        console.error("Error in control function:", error);
                        onReset();
                    }
                }
                exhaust!.updateParameters(
                    vertices[LEFT_NOZZLE],
                    vertices[RIGHT_NOZZLE],
                    mainThrust,
                    thrustAngle,
                );
                lastTime = time;
                requestRef.current = requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        } else {
            const vertices = rocket.vertices;
            Matter.Body.setPosition(rocket, {
                x: canvas.width * 0.15,
                y: canvas.height * 0.15,
            });
            Matter.Body.setVelocity(rocket, { x: 0, y: 0 });
            Matter.Body.setAngle(rocket, 0);
            Matter.Body.setAngularVelocity(rocket, 0);
            const thrustAngle = rocket.angle + angleOfThrust - Math.PI / 2;
            exhaust.updateParameters(
                vertices[LEFT_NOZZLE],
                vertices[RIGHT_NOZZLE],
                mainThrust,
                thrustAngle,
            );
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isRunning, controlFunction, onReset]);

    return (
        <canvas ref={canvasRef} className="w-full h-full background-black" />
    );
};

export { RocketSimulator };
