'use client';

import { useEffect, useRef } from "react";

const Scratch = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;

    // Save the current state
    ctx.fillStyle = "blue"
    ctx.save();

    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 10, 10);

    ctx.save();

    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, 10, 10);

    ctx.save();

    ctx.restore();
    ctx.fillRect(30, 30, 10, 10);

    ctx.restore();
    ctx.fillRect(40, 40, 10, 10);

    ctx.restore();
    ctx.fillRect(50, 50, 10, 10);
  })


  return <canvas ref={canvasRef} className="w-full h-full border border-red-800/30" />;
};

export { Scratch };
