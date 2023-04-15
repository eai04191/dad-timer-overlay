export function playAlertSound(
    volume: number = 0.5,
    duration: number = 1,
    frequency: number = 1500
) {
    const AudioContext = window.AudioContext;
    const audioContext = new AudioContext();

    const envelope = audioContext.createGain();
    envelope.gain.setValueAtTime(0.0, audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.05
    );
    envelope.gain.exponentialRampToValueAtTime(
        0.01 * volume,
        audioContext.currentTime + duration
    );

    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    const audioBuffer = audioContext.createBuffer(1, length, sampleRate);
    const data = audioBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelopeValue = envelope.gain.value;
        data[i] =
            envelopeValue *
            volume *
            Math.sin(2 * Math.PI * frequency * t) *
            Math.exp(-8 * t);
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
}
