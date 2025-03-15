'use client';

import { RocketSimulator } from '../components/RocketSimulator';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Scratch } from '@/components/Scratch';

export default function Home() {
  const [code, setCode] = useState(`function controlRocket(state, landingPad) {
  // state = {
  //   position: { x, y },
  //   velocity: { x, y },
  //   angle,
  //   angularVelocity,
  //   fuel
  // }
  // landingPad = { x, y, width }
console.log("yooooooooooooo")
  
  const seed = Date.now();
  // Use the seed to generate a deterministic random value between 0 and 1
  const seedRand = Math.abs(Math.sin(seed)) % 1;

  const angles = [Math.PI/4, Math.PI/2, Math.PI*3/4];
  const angleIndex = Math.floor(seedRand * angles.length);
  
  // Example: Apply thrust when above landing pad
  if (state.position.x < landingPad.x) {
    return {
      mainThrust: 0.5,    // 0 to 1
      angleOfThrust: angles[angleIndex],    // 0 to 360
    };
  }
  
  return {
    mainThrust: 0,
    angleOfThrust: 0,
  };
}`);

  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className="flex flex-col gap-0.5 px-1 py-0.5">
        <h1 className="text-sm font-bold">SpaceX Landing Simulator</h1>
        <p className="text-[10px] text-gray-400">Program your rocket to land safely on the landing pad. Write your control function in the editor.</p>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-500 hover:bg-blue-600 px-1.5 py-[1px] text-[10px] rounded-[1px]"
          >
            {isRunning ? 'Reset' : 'Start'}
          </button>
        </div>
      </div>
      <div className="flex flex-1 gap-0.5 px-0.5 pb-0.5">
        <div className="w-[65%] bg-black overflow-hidden border border-gray-800/30">
          <RocketSimulator 
            controlFunction={code}
            isRunning={isRunning}
            onReset={() => setIsRunning(false)}
          />
        </div>
        <div className="w-[35%] bg-[#111] overflow-hidden border border-gray-800/30">
          <CodeMirror
            value={code}
            onChange={setCode}
            theme={dracula}
            extensions={[javascript()]}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              indentOnInput: true,
              bracketMatching: true,
              autocompletion: true,
            }}
            editable={!isRunning}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
