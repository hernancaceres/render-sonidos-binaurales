import { useState, useEffect } from 'react';
import * as Tone from 'tone';

const WhiteNoiseGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [filterFrequency, setFilterFrequency] = useState(1000);
  const [noise, setNoise] = useState(null);

  useEffect(() => {
    if (isPlaying && !noise) {
      startSound();
    } else if (!isPlaying && noise) {
      stopSound();
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSound = () => {
    const newNoise = new Tone.Noise('white').start().toDestination();
    const newFilter = new Tone.Filter(filterFrequency, 'highpass').toDestination();
    newNoise.connect(newFilter);
    newNoise.volume.value = Tone.gainToDb(volume);
    setNoise(newNoise);
  };

  const stopSound = () => {
    noise.dispose(); // Stop and dispose of the noise instance
    setNoise(null);
  };

  const handleClick = async () => {
    try {
      await Tone.start();
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error al iniciar el contexto de audio:', error);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (noise) {
      noise.volume.value = Tone.gainToDb(newVolume);
    }
  };

  const handleFilterFrequencyChange = (event) => {
    const newFilterFrequency = parseFloat(event.target.value);
    setFilterFrequency(newFilterFrequency);
    if (noise) {
      noise.disconnect(); // Disconnect the noise from the current filter
      const newFilter = new Tone.Filter(newFilterFrequency, 'highpass').toDestination();
      noise.connect(newFilter); // Connect the noise to the new filter
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{isPlaying ? 'Pausar Ruido' : 'Iniciar Ruido'}</button>
      <input
        type="range"
        min="20"
        max="20000"
        step="1"
        value={filterFrequency}
        onChange={handleFilterFrequencyChange}
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

export default WhiteNoiseGenerator;
