// binaural-beat-worklet.js
class BinauralBeatWorklet extends AudioWorkletProcessor {
    constructor() {
      super();
      this.playing = false;
      this.sampleRate = 44100; // Set your desired sample rate
      this.bufferSize = 128; // Set your desired buffer size
      this.phase = 0;
      this.leftFrequency = 440; // Left ear frequency
      this.rightFrequency = 444; // Right ear frequency
    }
  
    process(inputs, outputs) {
      const output = outputs[0];
      const outputChannel = output[0];
  
      for (let i = 0; i < this.bufferSize; i++) {
        const left = Math.sin(2 * Math.PI * this.leftFrequency * this.phase / this.sampleRate);
        const right = Math.sin(2 * Math.PI * this.rightFrequency * this.phase / this.sampleRate);
        outputChannel[i] = [left, right];
        this.phase++;
      }
  
      return true;
    }
  }
  
  registerProcessor('binaural-beat-worklet', BinauralBeatWorklet);
  