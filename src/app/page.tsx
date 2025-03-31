"use client";
import { RocketSimulator } from "../components/RocketSimulator";
import { useState } from "react";
import SimulatorBackground from "../components/SimulatorBackground";
import Rocket from "@/components/rocket";

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    return (
        <div className="min-h-screen flex flex-col bg-white text-black relative">
            {/* <SimulatorBackground /> */}
            {/* <div className="flex flex-col gap-0.5 px-1 py-0.5 z-10"> */}
            {/*     <h1 className="text-sm font-bold">SpaceX Landing Simulator</h1> */}
            {/*     <p className="text-[10px] text-gray-600"> */}
            {/*         Program your rocket to land safely on the landing pad. Write */}
            {/*         your control function in the editor. */}
            {/*     </p> */}
            {/*     <div className="flex gap-1"> */}
            {/*         <button */}
            {/*             onClick={() => setIsRunning(!isRunning)} */}
            {/*             className="bg-blue-500 hover:bg-blue-600 px-1.5 py-[1px] text-[10px] text-white rounded-[1px]" */}
            {/*         > */}
            {/*             {isRunning ? "Reset" : "Start"} */}
            {/*         </button> */}
            {/*     </div> */}
            {/* </div> */}
            {/* <div> */}
            {/*     {/* Your other background elements */} */}
            {/*     <Rocket /> */}
            {/* </div> */}
            {/* <div className="flex flex-1 gap-0.5 px-0.5 pb-0.5 z-10"> */}
            {/*   <div className="w-[100%] overflow-hidden border border-gray-200"> */}
            {/*     <RocketSimulator */}
            {/*       controlFunction={`function () {}`} // ignore this for now */}
            {/*       isRunning={isRunning} */}
            {/*       onReset={() => setIsRunning(false)} */}
            {/*     /> */}
            {/*   </div> */}
            {/* </div> */}
        </div>
    );
}
