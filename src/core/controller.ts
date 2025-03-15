const rocketState = {
    move: "moveRight",
};

export function defaultControlRocket(state, landingPad) {
    // state = {
    //   position: { x, y },
    //   velocity: { x, y },
    //   angle,
    //   angularVelocity,
    //   fuel
    // }
    // landingPad = { x, y, width }

    const moveRight = () => {
        const rocketAngle = ((Math.PI / 2 - state.angle) * 180) / Math.PI;
        console.log("rocketAngle", rocketAngle);
        if (rocketAngle > 70) {
            return {
                mainThrust: 0.5 / Math.cos(state.angle), // 0 to 1
                angleOfThrust: (Math.PI / 2) * 0.5, // 0 to 360
            };
        }
        return {
            mainThrust: 0.5,
            angleOfThrust: Math.PI / 2,
        };
        rocketState.move = "None";
    };

    switch (rocketState.move) {
        case "moveLeft": {
        }
        case "moveRight": {
            return moveRight();
        }
        default: {
            return {
                mainThrust: 0.5,
                angleOfThrust: Math.PI / 2,
            };
        }
    }
}
