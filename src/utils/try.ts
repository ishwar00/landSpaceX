// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const $try = <T extends (...args: any[]) => any>(fn: T) => {
    const Catch = class {
        constructor(private readonly value: T) {}

        catch(fn: (err: unknown) => ReturnType<T> | never): ReturnType<T> {
            try {
                return this.value();
            } catch (err) {
                return fn(err);
            }
        }
    };

    return new Catch(fn);
};
