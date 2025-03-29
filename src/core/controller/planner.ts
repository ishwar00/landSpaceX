import { Environment, RocketState } from "@/components/RocketSimulator";
import { Step, StepParams } from "./common";

export function planner(
    _rocketState: RocketState,
    _env: Environment,
): Step<keyof StepParams>[] {
    return [
        {
            type: "move",
            params: {
                targetRocketAngle: Math.PI / 6,
            },
        },
    ];
}
