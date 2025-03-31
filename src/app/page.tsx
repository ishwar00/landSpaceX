"use client";

import { RocketSimulator } from "../components/RocketSimulator";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default function Home() {
    const [code, setCode] = useState(`function controlRocket(state, env) {
    return {
      mainThrust: 0.5,
      angleOfThrust: Math.PI/2,    // 0 to 360
    };
}`);

    const [savedCode, setSavedCode] = useState(code);
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            <div className="flex flex-col gap-0.5 px-1 py-0.5">
                <h1 className="text-sm font-bold">SpaceX Landing Simulator</h1>
                <p className="text-[10px] text-gray-400">
                    Program your rocket to land safely on the landing pad. Write
                    your control function in the editor.
                </p>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="bg-white-500 hover:bg-white-600 px-1.5 py-[1px] text-[10px] rounded-[1px]"
                    >
                        {isRunning ? "Reset" : "Start"}
                    </button>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-0.5 px-0.5 pb-0.5">
                {/* Rocket Simulator taking full initial height */}
                <div className="h-screen bg-white overflow-hidden border border-gray-800/30">
                    <RocketSimulator
                        controlFunction={savedCode}
                        isRunning={isRunning}
                        onReset={() => setIsRunning(false)}
                    />
                </div>
                {/* Code Editor stacked below */}
                <div className="flex flex-col bg-[#111] overflow-hidden border border-gray-800/30">
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
