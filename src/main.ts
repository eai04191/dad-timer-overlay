import { register } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import { Timer } from "./Timer";
import { playAlertSound } from "./sound";

let timer: Timer | null = null;
let alertPlayed = false;
const outputElement = document.querySelector("#elapsedTime") as HTMLDivElement;

// Format elapsed time in milliseconds to mm:ss
function formatElapsedTime(elapsedTime: number): string {
    const minutes = Math.floor(elapsedTime / 1000 / 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

// hotfix for https://github.com/tauri-apps/tao/issues/72
window.addEventListener("DOMContentLoaded", async () => {
    await appWindow.setDecorations(true);
});

function update(elapsedTime: number) {
    const elapsedTimeString = formatElapsedTime(elapsedTime);
    const totalTime = 1000 * 60 * 9 + 1000 * 3; // 9:03
    const remainingTimeString = formatElapsedTime(totalTime - elapsedTime);
    // Door is Open at elapsed time 1:23,
    // So 7:26 after the start time.
    const gateOpenTime = 1000 * 60 * 7 + 1000 * 26;
    const isGateOpen = elapsedTime > gateOpenTime;

    outputElement.innerText = [
        `${elapsedTimeString} / ${remainingTimeString}`,
        isGateOpen
            ? "Gate is OPEN !"
            : `Gate is closed. ${formatElapsedTime(
                  gateOpenTime - elapsedTime
              )} left.`,
    ].join("\n");

    // open alert
    if (!alertPlayed && isGateOpen) {
        alertPlayed = true;
        playAlertSound();
    }

    // done alert
    if (elapsedTime > totalTime) {
        timer?.stop();
        outputElement.innerText = "--:--";
        playAlertSound();
    }
}
async function main() {
    await register("CommandOrControl+Shift+W", () => {
        if (timer) {
            timer.stop();
        }
        timer = new Timer(update);
        timer.start();
    });

    await register("CommandOrControl+Shift+S", () => {
        if (timer) {
            timer.stop();
            outputElement.innerText = "--:--";
        }
    });

    // launch alert
    playAlertSound();
}

main();
