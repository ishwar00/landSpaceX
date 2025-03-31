import {
    Environment,
    RocketState,
    RocketThrust,
} from "@/components/RocketSimulator";
import { Step, StepParams } from "./common";
import { executor } from "./executor";
import { planner } from "./planner";

let steps: Step<keyof StepParams>[] = [];

export function defaultController(
    rocketState: RocketState,
    env: Environment,
): RocketThrust {
    // console.log("defaultController called");
    // console.log("angle: ", (rocketState.angle * 180) / Math.PI);
    if (steps.length === 0) {
        steps = planner(rocketState, env);
    }
    return executor(steps, rocketState, env);
}
