// Web Audio API sound effects for the game

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as
          | typeof AudioContext
          | undefined;
        if (!Ctx) {
          this.enabled = false;
          return null;
        }
        this.audioContext = new Ctx();
      } catch (e) {
        // If audio is blocked/unavailable, never let it break app interactions.
        console.warn("AudioContext unavailable; disabling sounds.", e);
        this.enabled = false;
        return null;
      }
    }

    // Best-effort resume (safe to call; may still be rejected by browser policies)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => {
        // If resume fails, keep the app working silently.
      });
    }

    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Soft click sound for placing X
  playMoveX() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Soft pop sound for placing O
  playMoveO() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  }

  // Victory fanfare
  playWin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = "sine";

      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  // Draw sound - neutral tone
  playDraw() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.3);
    oscillator.type = "triangle";

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  // Button click
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  // Error/invalid move sound
  playError() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
    oscillator.type = "sawtooth";

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Join room / player connected sound
  playJoin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37]; // A4, C#5

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = "sine";

      const startTime = ctx.currentTime + i * 0.08;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }

  // Fun: Cheer
  playCheer() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Confetti/Cheer sound - rapid high clusters
    const notes = [523, 659, 784, 1046, 784, 659];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.1);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.1);
    });
  }

  // Fun: Laugh
  playLaugh() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Ha ha ha
    [0, 0.15, 0.3].forEach(t => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(400, ctx.currentTime + t);
      osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + t + 0.1);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.1, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.1);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.1);
    });
  }

  // Fun: Sad
  playSad() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.6);
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  }

  // Fun: Drum
  playDrum() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  // Message received sound
  playMessage() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Light ping
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}

export const soundManager = new SoundManager();
