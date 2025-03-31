"use client";

import Matter from "matter-js";
import { useEffect, useRef } from "react";

const Scratch = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 0 },
        });

        const boxVertices = [
            { x: 0, y: 0 },
            { x: 15, y: 0 },
            { x: 25, y: 2 },
            { x: 15, y: 15 },
            { x: 55, y: 55 },
            { x: 15, y: 10 },
            { x: 0, y: 5 },
        ];

        const box = Matter.Bodies.fromVertices(40, 20, [boxVertices]);
        const ground = Matter.Bodies.rectangle(400, 610, 810, 60, {
            isStatic: true,
        });
        Matter.Body.applyForce(box, { x: 0, y: -100 }, { x: 0, y: 0.01 });

        Matter.Composite.add(engine.world, [box, ground]);
        Matter.Runner.run(engine);

        const animate = () => {
            Matter.Engine.update(engine, 10);
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d")!;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const vertices = box.vertices;
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                const vertex = vertices[i];
                ctx.lineTo(vertex.x, vertex.y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = "red";
            ctx.moveTo(box.position.x, box.position.y);
            ctx.arc(box.position.x, box.position.y, 5, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();

            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

export { Scratch };
