export class HorrorSynth {
  private ctx: AudioContext | null = null;
  private droneNodes: {
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    filter: BiquadFilterNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    gain: GainNode;
  } | null = null;
  
  private heartbeatInterval: any = null;
  private heartbeatBpm: number = 60;
  private isHeartbeatRunning: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {}

  /**
   * Initializes the synthesizer with a running AudioContext.
   */
  public init(context: AudioContext) {
    this.ctx = context;
    this.noiseBuffer = this.createNoiseBuffer();
  }

  /**
   * Generates a buffer of white noise for sound effects (whispers, typewriter clicks, static).
   */
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * Generates a distortion curve for the jumpscare screamer.
   */
  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /**
   * Starts a low, creepy atmospheric ambient drone.
   * Modulates filters with an LFO to create a breathing, tense ambient sound.
   */
  public startDrone() {
    if (!this.ctx || this.droneNodes) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      // Drone oscillators: detuned slightly to create binaural beating (binaural tension)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // Beating effect

      // LFO modulator for filter cutoff
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Extremely slow (8 seconds cycle)

      lfoGain.gain.setValueAtTime(45, this.ctx.currentTime); // Modulate cutoff by +/- 45Hz

      // Filter settings: low pass to keep it dark and bassy
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(95, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      // Connect LFO to filter frequency
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Gain settings - slow fade in
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 3.0);

      // Routing: Osc -> Filter -> Gain -> Destination
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Start oscillators
      osc1.start(0);
      osc2.start(0);
      lfo.start(0);

      this.droneNodes = { osc1, osc2, filter, lfo, lfoGain, gain };
    } catch (e) {
      console.error('Failed to start ambient drone:', e);
    }
  }

  /**
   * Smoothly stops the ambient drone.
   */
  public stopDrone() {
    if (!this.ctx || !this.droneNodes) return;

    const { osc1, osc2, lfo, gain } = this.droneNodes;
    try {
      const now = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          lfo.stop();
          osc1.disconnect();
          osc2.disconnect();
          lfo.disconnect();
          gain.disconnect();
        } catch (err) {}
      }, 1600);
    } catch (e) {
      console.error(e);
    }

    this.droneNodes = null;
  }

  /**
   * Starts a realistic heartbeat sound.
   * Plays a double thump sine wave at the specified BPM.
   */
  public startHeartbeat(bpm: number = 60) {
    if (!this.ctx) return;
    this.heartbeatBpm = bpm;
    if (this.isHeartbeatRunning) {
      this.updateHeartbeatInterval();
      return;
    }

    this.isHeartbeatRunning = true;
    this.updateHeartbeatInterval();
  }

  /**
   * Updates the heartbeat tempo dynamically as tension rises.
   */
  public setHeartbeatBpm(bpm: number) {
    this.heartbeatBpm = bpm;
    if (this.isHeartbeatRunning) {
      this.updateHeartbeatInterval();
    }
  }

  private updateHeartbeatInterval() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    const intervalMs = (60 / this.heartbeatBpm) * 1000;
    
    const tick = () => {
      this.playHeartbeatThump();
    };

    tick(); // Play immediately
    this.heartbeatInterval = setInterval(tick, intervalMs);
  }

  /**
   * Stop the heartbeat completely.
   */
  public stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.isHeartbeatRunning = false;
  }

  /**
   * Plays a single double-thump heartbeat.
   */
  private playHeartbeatThump() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // First thump
    this.thump(now);
    // Second thump (delayed slightly)
    this.thump(now + 0.22);
  }

  private thump(time: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    // Very low sub-bass pitch
    osc.frequency.setValueAtTime(55, time); 
    // Pitch drops quickly during the thump for a heavy thump impact
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, time);

    // Dynamic gain envelope: sharp attack, decay to zero in 120ms
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.65, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  /**
   * Plays a high-pass filtered white noise burst to simulate a mechanical typewriter click.
   */
  public playTypewriterClick() {
    if (!this.ctx || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = this.noiseBuffer;

    // Filter to simulate a softer, slightly lower mechanical tick
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100 + Math.random() * 350, now); // slightly lower pitch range
    filter.Q.setValueAtTime(2.5, now);

    // Softer keystroke tick envelope (about half of previous volume)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 + Math.random() * 0.08, now + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + 0.03);
  }

  /**
   * Plays a static hover sound (low rumble).
   */
  public playHoverClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Plays a dramatic, terrifying jumpscare sound.
   * Uses wave shaper distortion, multi-saw oscillator sweeps, and loud noise explosions.
   */
  public playJumpscare() {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Master Jumpscare Gain Node with extreme compression/limiter feel
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.gain.linearRampToValueAtTime(0.7, now + 0.2);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    masterGain.connect(this.ctx.destination);

    // 2. Distortion waveshaper for realistic grit, harshness, and "screaming" metal feel
    const dist = this.ctx.createWaveShaper();
    dist.curve = this.makeDistortionCurve(60) as any;
    dist.oversample = '4x';
    dist.connect(masterGain);

    // 3. Detuned screaming high-frequency oscillators sweeping downwards
    const scream1 = this.ctx.createOscillator();
    const scream2 = this.ctx.createOscillator();
    const scream3 = this.ctx.createOscillator();
    const screamGain = this.ctx.createGain();

    scream1.type = 'sawtooth';
    scream1.frequency.setValueAtTime(2500, now);
    scream1.frequency.exponentialRampToValueAtTime(350, now + 1.2);

    scream2.type = 'sawtooth';
    scream2.frequency.setValueAtTime(2540, now);
    scream2.frequency.exponentialRampToValueAtTime(320, now + 1.2);
    scream2.detune.setValueAtTime(35, now);

    scream3.type = 'sawtooth';
    scream3.frequency.setValueAtTime(2460, now);
    scream3.frequency.exponentialRampToValueAtTime(370, now + 1.2);
    scream3.detune.setValueAtTime(-35, now);

    screamGain.gain.setValueAtTime(0, now);
    screamGain.gain.linearRampToValueAtTime(0.45, now + 0.05);
    screamGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    scream1.connect(screamGain);
    scream2.connect(screamGain);
    scream3.connect(screamGain);
    screamGain.connect(dist);

    scream1.start(now);
    scream2.start(now);
    scream3.start(now);
    scream1.stop(now + 1.5);
    scream2.stop(now + 1.5);
    scream3.stop(now + 1.5);

    // 4. White noise blast (simulating air rushing and sudden impact static)
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      const noiseFilter = this.ctx.createBiquadFilter();
      const noiseGain = this.ctx.createGain();

      noise.buffer = this.noiseBuffer;
      noise.loop = true;

      // High pass noise filter for screamer raspiness
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(900, now);

      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dist);

      noise.start(now);
      noise.stop(now + 1.7);
    }

    // 5. Bass Drop Sub-Impact (deep chest shaking thump)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'square';
    subOsc.frequency.setValueAtTime(65, now);
    subOsc.frequency.linearRampToValueAtTime(30, now + 0.8);

    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.85, now + 0.01);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    subOsc.connect(subGain);
    subGain.connect(masterGain); // bypass distortion to keep sub frequencies clean and powerful

    subOsc.start(now);
    subOsc.stop(now + 1.1);
  }

  /**
   * Plays a creeping spatial whisper.
   * Pans white noise sweep either fully to the left or right to startle the user.
   */
  public playWhisper(leftSide: boolean = true) {
    if (!this.ctx || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gain = this.ctx.createGain();

    source.buffer = this.noiseBuffer;
    source.loop = true;

    // Filter creates creepy vocal format frequencies (wah-wah whisper)
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    // Modulate filter frequency slowly to create a "whispering wind" effect
    filter.frequency.linearRampToValueAtTime(1100, now + 1.0);
    filter.frequency.linearRampToValueAtTime(500, now + 2.2);
    filter.Q.setValueAtTime(4.0, now);

    // Pan whisper left or right
    const panVal = leftSide ? -0.85 : 0.85;
    if (panner) {
      panner.pan.setValueAtTime(0, now);
      panner.pan.linearRampToValueAtTime(panVal, now + 0.4);
    }

    // Whisper volume envelope: slow build up, slow decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

    // Connections
    source.connect(filter);
    if (panner) {
      filter.connect(panner);
      panner.connect(gain);
    } else {
      filter.connect(gain);
    }
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + 2.4);
  }
}

// Export singleton instance
export const soundSynth = new HorrorSynth();
