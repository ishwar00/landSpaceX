"use client";

import { RocketSimulator } from "../components/RocketSimulator";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default function Home() {
    const [code, setCode] = useState(`function controlRocket(state, env) {
  // state = {
  //   position: { x, y },
  //   velocity: { x, y },
  //   angle,
  //   angularVelocity,
  //   fuel
  // }
  // landingPad = { x, y, width }
    const {landingPad, gravity: {y}} = env
    const {mass,  maxThrust} = state
  
  // Example: Apply thrust when above landing pad
  if (state.position.x < landingPad.x) {
    return {
      mainThrust: (mass * y)/ maxThrust,    // 0 to 1
      angleOfThrust: Math.PI/2,    // 0 to 360
    };
  }
  
  return {
    mainThrust: 0,
    angleOfThrust: 0,
  };
}`);

    const [savedCode, setSavedCode] = useState(code);
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <div className="flex flex-col gap-0.5 px-1 py-0.5">
                <h1 className="text-sm font-bold">SpaceX Landing Simulator</h1>
                <p className="text-[10px] text-gray-400">
                    Program your rocket to land safely on the landing pad. Write
                    your control function in the editor.
                </p>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="bg-blue-500 hover:bg-blue-600 px-1.5 py-[1px] text-[10px] rounded-[1px]"
                    >
                        {isRunning ? "Reset" : "Start"}
                    </button>
                </div>
            </div>
            <div className="flex flex-1 gap-0.5 px-0.5 pb-0.5">
                <div className="w-[65%] bg-black overflow-hidden border border-gray-800/30">
                    <RocketSimulator
                        controlFunction={savedCode}
                        isRunning={isRunning}
                        onReset={() => setIsRunning(false)}
                    />
                </div>
                <div className="w-[35%] flex flex-col bg-[#111] overflow-hidden border border-gray-800/30">
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
                        className="flex-1"
                    />
                    <div className="p-1 border-t border-gray-800/30">
                        <button
                            onClick={() => setSavedCode(code)}
                            disabled={isRunning}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 text-[10px] rounded-[1px]"
                        >
                            Save Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
