import {
    LandingPad,
    RocketState,
    RocketThrust,
} from "@/components/RocketSimulator";

type Move = "torque" | "counterTorque" | "None";
const state: { move: Move } = {
    move: "torque",
};

let _rocketState: RocketState;

function torque(alphaDegree: number, thetaDegree: number, thrust?: number) {
    const { angle } = _rocketState;
    switch (state.move) {
        case "torque": {
            const targetAngle =
                Math.PI / 2 +
                ((alphaDegree > 0 ? -thetaDegree : thetaDegree) * Math.PI) /
                    180;
            console.log(angle, targetAngle, angle < targetAngle);
            if (
                (alphaDegree > 0 && angle > targetAngle) ||
                (alphaDegree < 0 && angle < targetAngle)
            ) {
                const angleOfThrust =
                    Math.PI / 2 + (alphaDegree * Math.PI) / 180;
                // console.log(Math.PI / 2, angleOfThrust)
                return {
                    mainThrust:
                        thrust ??
                        0.5 / Math.cos(angleOfThrust + angle - Math.PI / 2), // 0 to 1
                    angleOfThrust,
                };
            }
            state.move = "counterTorque";
        }
        case "counterTorque": {
            console.log("counter torque");
            // const { position: p, nozzle: n, inertia, angularVelocity } = _rocketState
            // const r = Math.hypot(p.x - n.x, p.y - n.y);
            // const torque = inertia * angularVelocity;
            // const force = torque / r;
            const angleOfThrust = Math.PI;
            const angularMoment =
                _rocketState.angularVelocity * _rocketState.inertia;
            console.log("angularMoment: ", angularMoment);
            if (angularMoment > 5) {
                state.move = "counterTorque";
                return {
                    mainThrust: 0.5,
                    angleOfThrust,
                };
            }
            return {
                mainThrust: 0,
                angleOfThrust: Math.PI / 2,
            };
        }

        default: {
            console.error("algo is shit!: reached unreachable!!!");
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function defaultControlRocket(
    rocketState: RocketState,
    landingPad: LandingPad,
): RocketThrust {
    _rocketState = rocketState;
    console.log(state);
    switch (state.move) {
        case "counterTorque":
        case "torque": {
            const result = torque(-1, 1);
            if (result) return result;
        }
        default: {
            const angleOfThrust = Math.PI / 2;
            return {
                mainThrust: 0, // 0 to 1
                angleOfThrust,
            };
        }
    }
}
