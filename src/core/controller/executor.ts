import {
    Environment,
    RocketState,
    RocketThrust,
} from "@/components/RocketSimulator";
import { Step, StepParams } from "./common";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharedCtx = {} as any;
let currentStep = 0;

function move(
    targetRocketAngle: number,
    rocketState: RocketState,
    env: Environment,
): RocketThrust {
    const ctx: {
        nextAction: "torque" | "counterTorque" | "None" | "done";
    } = sharedCtx;

    if (ctx.nextAction === undefined) {
        ctx.nextAction = "torque";
    }
    const { mass, maxThrust, angle } = rocketState;
    const { gravity } = env;
    switch (ctx.nextAction) {
        case "torque": {
            ctx.nextAction = "None";
            return {
                mainThrust: (mass * gravity) / maxThrust,
                angleOfThrust: (0.99 * Math.PI) / 2,
            };
        }
        case "counterTorque": {
            ctx.nextAction = "done";
            return {
                mainThrust: (mass * gravity) / maxThrust,
                angleOfThrust: (1.01 * Math.PI) / 2,
            };
        }
        case "None": {
            if (angle >= targetRocketAngle) {
                ctx.nextAction = "counterTorque";
            }
            return {
                mainThrust: (mass * gravity) / Math.cos(angle) / maxThrust,
                angleOfThrust: Math.PI / 2,
            };
        }
        case "done": {
            currentStep++;
            sharedCtx = {};
            return {
                mainThrust: (mass * gravity) / Math.cos(angle) / maxThrust,
                angleOfThrust: Math.PI / 2,
            };
        }
        default: {
            // console.error("algo is shit!: reached unreachable!!!");
            return {
                mainThrust: (mass * gravity) / Math.cos(angle) / maxThrust,
                angleOfThrust: Math.PI / 2,
            };
        }
    }
}

export function executor<S extends Step<K>[], K extends keyof StepParams>(
    steps: S,
    rocketState: RocketState,
    env: Environment,
) {
    const step = steps[currentStep];
    const { mass, maxThrust, angle } = rocketState;
    const { gravity } = env;
    switch (step?.type) {
        case "move": {
            const { targetRocketAngle } = step.params;
            return move(targetRocketAngle, rocketState, env);
        }
        default: {
            return {
                mainThrust: (mass * gravity) / Math.cos(angle) / maxThrust,
                angleOfThrust: Math.PI / 2,
            };
        }
    }
}
