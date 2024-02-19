import { useState, useEffect } from 'react';
import * as Tone from 'tone';

const BinauralBeatGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftFrequency, setLeftFrequency] = useState(333);
  const [rightFrequency, setRightFrequency] = useState(337);
  const [volume, setVolume] = useState(0.5);
  const [leftSynth, setLeftSynth] = useState(null);
  const [rightSynth, setRightSynth] = useState(null);

  useEffect(() => {
    if (leftSynth && rightSynth) {
      leftSynth.volume.value = Tone.gainToDb(volume);
      rightSynth.volume.value = Tone.gainToDb(volume);
    }
  }, [volume, leftSynth, rightSynth]);

  useEffect(() => {
    if (leftSynth) {
      leftSynth.frequency.value = leftFrequency;
    }
    if (rightSynth) {
      rightSynth.frequency.value = rightFrequency;
    }
  }, [leftFrequency, rightFrequency, leftSynth, rightSynth]);

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
    const leftSynth = new Tone.Oscillator(leftFrequency, 'sine').toDestination();
    const rightSynth = new Tone.Oscillator(rightFrequency, 'sine').toDestination();

    leftSynth.start();
    rightSynth.start();

    setLeftSynth(leftSynth);
    setRightSynth(rightSynth);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (leftSynth && rightSynth) {
      leftSynth.stop();
      rightSynth.stop();
      setIsPlaying(false);
    }
  };

  const handleLeftFrequencyChange = (event) => {
    const newLeftFrequency = parseFloat(event.target.value);
    setLeftFrequency(newLeftFrequency);
  };

  const handleRightFrequencyChange = (event) => {
    const newRightFrequency = parseFloat(event.target.value);
    setRightFrequency(newRightFrequency);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handlePresetButtonClick = (leftFreq, rightFreq) => {
    setLeftFrequency(leftFreq);
    setRightFrequency(rightFreq);
  };

  return (
    <div>
      <button onClick={handleClick}>{isPlaying ? 'Parar' : 'Iniciar'}</button>
      <div>
        <label>Izquierdo:</label>
        <input
          type="range"
          min="20"
          max="2000"
          step="1"
          value={leftFrequency}
          onChange={handleLeftFrequencyChange}
        />
        <span>{leftFrequency.toFixed(2)} Hz</span>
      </div>
      <div>
        <label>Derecho:</label>
        <input
          type="range"
          min="20"
          max="2000"
          step="1"
          value={rightFrequency}
          onChange={handleRightFrequencyChange}
        />
        <span>{rightFrequency.toFixed(2)} Hz</span>
      </div>
      <div>
        <label>Volumen:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      <div>
        <button onClick={() => handlePresetButtonClick(111, 113)}>Frecuencia 1</button>
        <button onClick={() => handlePresetButtonClick(222, 224)}>Frecuencia 2</button>
        <button onClick={() => handlePresetButtonClick(333, 337)}>Frecuencia 3</button>
        <button onClick={() => handlePresetButtonClick(444, 448)}>Frecuencia 4</button>
      </div>
    </div>
  );
};

export default BinauralBeatGenerator;



// import { useState, useEffect } from 'react';
// import * as Tone from 'tone';

// const BinauralBeatGenerator = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [leftFrequency, setLeftFrequency] = useState(333);
//   const [rightFrequency, setRightFrequency] = useState(337);
//   const [volume, setVolume] = useState(0.5);
//   const [leftSynth, setLeftSynth] = useState(null);
//   const [rightSynth, setRightSynth] = useState(null);

//   useEffect(() => {
//     if (leftSynth && rightSynth) {
//       leftSynth.volume.value = Tone.gainToDb(volume);
//       rightSynth.volume.value = Tone.gainToDb(volume);
//     }
//   }, [volume, leftSynth, rightSynth]);

//   useEffect(() => {
//     if (leftSynth) {
//       leftSynth.frequency.value = leftFrequency;
//     }
//     if (rightSynth) {
//       rightSynth.frequency.value = rightFrequency;
//     }
//   }, [leftFrequency, rightFrequency, leftSynth, rightSynth]);

//   const handleClick = async () => {
//     try {
//       await Tone.start();
//       if (!isPlaying) {
//         startSound();
//       } else {
//         stopSound();
//       }
//     } catch (error) {
//       console.error('Error al iniciar el contexto de audio:', error);
//     }
//   };

//   const startSound = () => {
//     const leftSynth = new Tone.Oscillator(leftFrequency, 'sine').toDestination();
//     const rightSynth = new Tone.Oscillator(rightFrequency, 'sine').toDestination();

//     leftSynth.start();
//     rightSynth.start();

//     setLeftSynth(leftSynth);
//     setRightSynth(rightSynth);
//     setIsPlaying(true);
//   };

//   const stopSound = () => {
//     if (leftSynth && rightSynth) {
//       leftSynth.stop();
//       rightSynth.stop();
//       setIsPlaying(false);
//     }
//   };

//   const handleLeftFrequencyChange = (event) => {
//     const newLeftFrequency = parseFloat(event.target.value);
//     setLeftFrequency(newLeftFrequency);
//   };

//   const handleRightFrequencyChange = (event) => {
//     const newRightFrequency = parseFloat(event.target.value);
//     setRightFrequency(newRightFrequency);
//   };

//   const handleVolumeChange = (event) => {
//     const newVolume = parseFloat(event.target.value);
//     setVolume(newVolume);
//   };

//   return (
//     <div>
//       <button onClick={handleClick}>{isPlaying ? 'Parar' : 'Iniciar'}</button>
//       <div>
//         <label>Izquierdo:</label>
//         <input
//           type="range"
//           min="20"
//           max="2000"
//           step="1"
//           value={leftFrequency}
//           onChange={handleLeftFrequencyChange}
//         />
//         <span>{leftFrequency.toFixed(2)} Hz</span>
//       </div>
//       <div>
//         <label>Derecho:</label>
//         <input
//           type="range"
//           min="20"
//           max="2000"
//           step="1"
//           value={rightFrequency}
//           onChange={handleRightFrequencyChange}
//         />
//         <span>{rightFrequency.toFixed(2)} Hz</span>
//       </div>
//       <div>
//         <label>Volumen:</label>
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={handleVolumeChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default BinauralBeatGenerator;

