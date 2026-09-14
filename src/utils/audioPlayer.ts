// Web Audio and HTML5 Audio hybrid manager
class SoundEngine {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private synthInterval: number | null = null;
  public isSynthetic = false;

  constructor() {
    // Initialized lazily on user gesture
  }

  private initSynth() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Play synthetic relaxing melodic loop if MP3 network stream fails
  public startSyntheticLullaby(onTick?: (sec: number) => void) {
    this.stop();
    this.initSynth();
    if (!this.audioContext) return;

    this.isSynthetic = true;
    let sec = 0;
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25]; // C major pentatonic
    let noteIdx = 0;

    const playTone = () => {
      if (!this.audioContext) return;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], this.audioContext.currentTime);
      noteIdx = (noteIdx + 1) % notes.length;

      gain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.audioContext.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + 1.3);

      sec++;
      if (onTick) onTick(sec);
    };

    playTone();
    this.synthInterval = window.setInterval(playTone, 1400);
  }

  public stop() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.audio) {
      this.audio.pause();
    }
    this.isSynthetic = false;
  }
}

export const soundEngine = new SoundEngine();
