import  { useState } from 'react';

const ToneGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [duration, setDuration] = useState(2); // Duración predeterminada de la grabación en segundos
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false); // Estado de señalización para indicar descarga en proceso

  const startTone = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = 'sine'; // Tipo de onda sinusoidal
    osc.frequency.setValueAtTime(frequency, context.currentTime); // Frecuencia especificada por el usuario
    osc.connect(context.destination); // Conectar al destino de salida de audio
    osc.start(); // Iniciar oscilador
    setAudioContext(context);
    setOscillator(osc);
    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscillator) {
      oscillator.stop(); // Detener oscilador
      oscillator.disconnect(); // Desconectar oscilador
      setAudioContext(null);
      setOscillator(null);
      setIsPlaying(false);
    }
  };

  const handleToggleTone = () => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  };

  const handleDownload = () => {
    if (audioContext) {
      const destination = audioContext.createMediaStreamDestination();
      oscillator.connect(destination);
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tone.wav';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloading(false); // Cambiar el estado de la señalización después de que se complete la descarga
      };

      setIsDownloading(true); // Cambiar el estado de la señalización cuando comience la descarga
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, duration * 1000); // Grabar durante la duración especificada en segundos
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="frequencyInput">Frequency (Hz):</label>
        <input
          id="frequencyInput"
          type="number"
          value={frequency}
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          min="20"
          max="20000"
        />
      </div>
      <div>
        <label htmlFor="durationInput">Duration (seconds):</label>
        <input
          id="durationInput"
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          min="1"
        />
      </div>
      <button onClick={handleToggleTone}>
        {isPlaying ? 'Stop Tone' : 'Start Tone'}
      </button>
      <button onClick={handleDownload} disabled={!isPlaying || isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download Tone'}
      </button>
    </div>
  );
};

export default ToneGenerator;


// import { useState } from 'react';

// const ToneGenerator = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [frequency, setFrequency] = useState(440);
//   const [duration, setDuration] = useState(2); // Duración predeterminada de la grabación en segundos
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     osc.type = 'sine'; // Tipo de onda sinusoidal
//     osc.frequency.setValueAtTime(frequency, context.currentTime); // Frecuencia especificada por el usuario
//     osc.connect(context.destination); // Conectar al destino de salida de audio
//     osc.start(); // Iniciar oscilador
//     setAudioContext(context);
//     setOscillator(osc);
//     setIsPlaying(true);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Detener oscilador
//       oscillator.disconnect(); // Desconectar oscilador
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   const handleDownload = () => {
//     if (audioContext) {
//       const destination = audioContext.createMediaStreamDestination();
//       oscillator.connect(destination);
//       const mediaRecorder = new MediaRecorder(destination.stream);
//       const chunks = [];

//       mediaRecorder.ondataavailable = (e) => {
//         chunks.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'audio/wav' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'tone.wav';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       };

//       mediaRecorder.start();
//       setTimeout(() => {
//         mediaRecorder.stop();
//       }, duration * 1000); // Grabar durante la duración especificada en segundos
//     }
//   };

//   return (
//     <div>
//       <div>
//         <label htmlFor="frequencyInput">Frequency (Hz):</label>
//         <input
//           id="frequencyInput"
//           type="number"
//           value={frequency}
//           onChange={(e) => setFrequency(parseInt(e.target.value))}
//           min="20"
//           max="20000"
//         />
//       </div>
//       <div>
//         <label htmlFor="durationInput">Duration (seconds):</label>
//         <input
//           id="durationInput"
//           type="number"
//           value={duration}
//           onChange={(e) => setDuration(parseInt(e.target.value))}
//           min="1"
//         />
//       </div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <button onClick={handleDownload} disabled={!isPlaying}>
//         Download Tone
//       </button>
//     </div>
//   );
// };

// export default ToneGenerator;
