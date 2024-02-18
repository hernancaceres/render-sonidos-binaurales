import { useState, useEffect } from 'react';
import * as Tone from 'tone';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Valor de volumen inicial
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (player) {
      player.volume.value = Tone.gainToDb(volume);
    }
  }, [volume, player]);

  const handleClick = async () => {
    try {
      await Tone.start();
      if (!isPlaying) {
        playSound();
      } else {
        stopSound();
      }
    } catch (error) {
      console.error('Error al iniciar el contexto de audio:', error);
    }
  };

  const playSound = () => {
    const newPlayer = new Tone.Player('/sounds/binaural_sound.mp3').toDestination();
    newPlayer.volume.value = Tone.gainToDb(volume); // Configura el volumen inicial
    newPlayer.autostart = true;
    setPlayer(newPlayer);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (player) {
      player.stop();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div>
      <button onClick={handleClick}>{isPlaying ? 'Pausar' : 'Reproducir'}</button>
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

export default Player;


