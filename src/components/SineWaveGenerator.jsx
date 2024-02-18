import  { useState, useEffect } from 'react';
import * as Tone from 'tone';

const SineWaveGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [frequency, setFrequency] = useState(440);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    if (synth) {
      synth.volume.value = Tone.gainToDb(volume);
      synth.frequency.value = frequency;
    }
  }, [volume, frequency, synth]);

  const handleClick = async () => {
    try {
      await Tone.start();
      if (!isPlaying) {
        startSound();
      } else {
        stopSound();
      }
    } catch (error) {
      console.error('Error al iniciar el contexto de audio:', error);
    }
  };

  const startSound = () => {
    const newSynth = new Tone.Oscillator(frequency, 'sine').toDestination();
    newSynth.volume.value = Tone.gainToDb(volume);
    newSynth.start();
    setSynth(newSynth);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (synth) {
      synth.stop();
      setSynth(null);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (synth) {
      synth.volume.value = Tone.gainToDb(newVolume);
    }
  };

  const handleFrequencyChange = (event) => {
    const newFrequency = parseFloat(event.target.value);
    setFrequency(newFrequency);
    if (synth) {
      synth.frequency.value = newFrequency;
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{isPlaying ? 'Parar Frecuencia' : 'Inciar Frecuencia'}</button>
      <input
        type="range"
        min="20"
        max="2000"
        step="1"
        value={frequency}
        onChange={handleFrequencyChange}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default SineWaveGenerator;
