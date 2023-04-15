/**
 * A simple timer class that calls a callback every second.
 */
export class Timer {
    private intervalId: number | null;
    private startTimestamp: number | null;
    private callback: (elapsedTime: number) => void;

    constructor(callback: (elapsedTime: number) => void) {
        this.intervalId = null;
        this.startTimestamp = null;
        this.callback = callback;
    }

    start(): void {
        this.startTimestamp = Date.now();
        this.intervalId = setInterval(() => {
            const elapsedTime = Date.now() - (this.startTimestamp || 0);
            this.callback(elapsedTime);
        }, 100);
    }

    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
