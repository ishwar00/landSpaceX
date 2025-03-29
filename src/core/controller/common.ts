export type StepParams = {
    move: {
        targetRocketAngle: number;
    };
};

export type Step<K extends keyof StepParams> = {
    type: K;
    params: StepParams[K];
};
