'use client';

import { useEffect, useRef } from "react";

const Scratch = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;

    const p = new Path2D("M10 10 h 80 v 80 h -80 Z");
    ctx.stroke(p);
  })


  return <canvas ref={canvasRef} />; //className="w-full h-full border border-red-800/30" />;
};

export { Scratch };
