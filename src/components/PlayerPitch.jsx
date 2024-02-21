import { useState, useEffect } from 'react';
import * as Tone from 'tone';

const PlayerPitch = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Valor de volumen inicial
  const [pitch, setPitch] = useState(0); // Valor de pitch inicial
  const [loop, setLoop] = useState(false); // Estado de repetición del audio
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (player) {
      player.volume.value = Tone.gainToDb(volume);
      player.playbackRate = Math.pow(2, pitch); // Ajusta el pitch
      player.loop = loop;
    }
  }, [volume, pitch, loop, player]);

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
    newPlayer.loop = loop; // Configura la repetición del audio
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

  const handlePitchChange = (event) => {
    const newPitch = parseFloat(event.target.value);
    setPitch(newPitch);
  };

  const handleLoopToggle = () => {
    setLoop(!loop);
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
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        value={pitch}
        onChange={handlePitchChange}
      />
      <button onClick={handleLoopToggle}>{loop ? 'Repetición Activada' : 'Repetición Desactivada'}</button>
    </div>
  );
};

export default PlayerPitch;
