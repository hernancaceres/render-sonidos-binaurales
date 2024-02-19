import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';

const WhiteNoiseGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [filterFrequency, setFilterFrequency] = useState(1000);
  const [noise, setNoise] = useState(null);
  const [frequencyData, setFrequencyData] = useState([]);

  useEffect(() => {
    if (isPlaying) {
      startSound();
      startUpdateFrequencyData();
    } else {
      stopSound();
    }
    return () => {
      stopSound(); // Cleanup function
    };
  }, [isPlaying]);

  const startSound = () => {
    const newNoise = new Tone.Noise('white').start().toDestination();
    const newFilter = new Tone.Filter(filterFrequency, 'highpass').toDestination();
    newNoise.connect(newFilter);
    newNoise.volume.value = Tone.gainToDb(volume);
    setNoise(newNoise);
    console.log('Noise started');
  };

  const stopSound = () => {
    if (noise) {
      noise.dispose(); // Stop and dispose of the noise instance
      setNoise(null);
      console.log('Noise stopped');
    }
  };

  const startUpdateFrequencyData = () => {
    if (noise) {
      const analyzer = new Tone.Analyser('waveform', 1024); // Use 'waveform' for better visualization
      noise.connect(analyzer); // Connect noise to the analyzer

      const updateFrequencyData = () => {
        const newData = analyzer.getValue(); // Get waveform data
        setFrequencyData(newData); // Update frequency data state
        requestAnimationFrame(updateFrequencyData);
      };

      updateFrequencyData();
    }
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
      {isPlaying && (
        <VictoryChart>
          <VictoryAxis dependentAxis />
          <VictoryAxis />
          <VictoryLine
            data={frequencyData.map((val, idx) => ({ x: idx, y: val }))} // Map frequencyData to x-y format
          />


        </VictoryChart>
      )}
    </div>
  );
};

export default WhiteNoiseGenerator;



// import { useState, useEffect } from 'react';
// import * as Tone from 'tone';
// import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';

// const WhiteNoiseGenerator = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.5);
//   const [filterFrequency, setFilterFrequency] = useState(1000);
//   const [noise, setNoise] = useState(null);
//   const [frequencyData, setFrequencyData] = useState(new Float32Array(1024));

//   useEffect(() => {
//     if (isPlaying && !noise) {
//       startSound();
//       startUpdateFrequencyData();
//     } else if (!isPlaying && noise) {
//       stopSound();
//     }
//   }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

//   const startSound = () => {
//     const newNoise = new Tone.Noise('white').start().toDestination();
//     const newFilter = new Tone.Filter(filterFrequency, 'highpass').toDestination();
//     newNoise.connect(newFilter);
//     newNoise.volume.value = Tone.gainToDb(volume);
//     setNoise(newNoise);
//     console.log('Noise started');
//   };

//   const stopSound = () => {
//     noise.dispose(); // Stop and dispose of the noise instance
//     setNoise(null);
//     console.log('Noise stopped');
//   };

//   const startUpdateFrequencyData = () => {
//     // Crear el analizador de frecuencia
//     const analyzer = new Tone.Analyser('fft', 1024);
//     if (noise) {
//         noise.connect(analyzer);
//     }

//     // Función para actualizar los datos de frecuencia
//     const updateFrequencyData = () => {
//         const newFrequencyData = analyzer.getValue(); // Obtener los datos de frecuencia
//         setFrequencyData([...newFrequencyData]); // Actualizar el estado con los nuevos datos
//         requestAnimationFrame(updateFrequencyData);
//     };

//     // Iniciar la actualización continua de los datos de frecuencia
//     console.log('Starting updateFrequencyData');
//     updateFrequencyData();
// };



//   const handleClick = async () => {
//     try {
//       await Tone.start();
//       setIsPlaying(!isPlaying);
//     } catch (error) {
//       console.error('Error al iniciar el contexto de audio:', error);
//     }
//   };

//   const handleVolumeChange = (event) => {
//     const newVolume = parseFloat(event.target.value);
//     setVolume(newVolume);
//     if (noise) {
//       noise.volume.value = Tone.gainToDb(newVolume);
//     }
//   };

//   const handleFilterFrequencyChange = (event) => {
//     const newFilterFrequency = parseFloat(event.target.value);
//     setFilterFrequency(newFilterFrequency);
//     if (noise) {
//       noise.disconnect(); // Disconnect the noise from the current filter
//       const newFilter = new Tone.Filter(newFilterFrequency, 'highpass').toDestination();
//       noise.connect(newFilter); // Connect the noise to the new filter
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleClick}>{isPlaying ? 'Pausar Ruido' : 'Iniciar Ruido'}</button>
//       <input
//         type="range"
//         min="20"
//         max="20000"
//         step="1"
//         value={filterFrequency}
//         onChange={handleFilterFrequencyChange}
//       />
//       <input
//         type="range"
//         min="0"
//         max="1"
//         step="0.01"
//         value={volume}
//         onChange={handleVolumeChange}
//       />
//       {isPlaying && (
//         <VictoryChart>
//           <VictoryAxis dependentAxis />
//           <VictoryAxis />
//           <VictoryLine
//             data={frequencyData.map((val, idx) => ({ x: idx, y: Math.pow(10, val / 20) }))}
//           />
//         </VictoryChart>
//       )}
//     </div>
//   );
// };

// export default WhiteNoiseGenerator;









// import { useState, useEffect } from 'react';
// import * as Tone from 'tone';

// const WhiteNoiseGenerator = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.5);
//   const [filterFrequency, setFilterFrequency] = useState(1000);
//   const [noise, setNoise] = useState(null);

//   useEffect(() => {
//     if (isPlaying && !noise) {
//       startSound();
//     } else if (!isPlaying && noise) {
//       stopSound();
//     }
//   }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

//   const startSound = () => {
//     const newNoise = new Tone.Noise('white').start().toDestination();
//     const newFilter = new Tone.Filter(filterFrequency, 'highpass').toDestination();
//     newNoise.connect(newFilter);
//     newNoise.volume.value = Tone.gainToDb(volume);
//     setNoise(newNoise);
//   };

//   const stopSound = () => {
//     noise.dispose(); // Stop and dispose of the noise instance
//     setNoise(null);
//   };

//   const handleClick = async () => {
//     try {
//       await Tone.start();
//       setIsPlaying(!isPlaying);
//     } catch (error) {
//       console.error('Error al iniciar el contexto de audio:', error);
//     }
//   };

//   const handleVolumeChange = (event) => {
//     const newVolume = parseFloat(event.target.value);
//     setVolume(newVolume);
//     if (noise) {
//       noise.volume.value = Tone.gainToDb(newVolume);
//     }
//   };

//   const handleFilterFrequencyChange = (event) => {
//     const newFilterFrequency = parseFloat(event.target.value);
//     setFilterFrequency(newFilterFrequency);
//     if (noise) {
//       noise.disconnect(); // Disconnect the noise from the current filter
//       const newFilter = new Tone.Filter(newFilterFrequency, 'highpass').toDestination();
//       noise.connect(newFilter); // Connect the noise to the new filter
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleClick}>{isPlaying ? 'Pausar Ruido' : 'Iniciar Ruido'}</button>
//       <input
//         type="range"
//         min="20"
//         max="20000"
//         step="1"
//         value={filterFrequency}
//         onChange={handleFilterFrequencyChange}
//       />
//       <input
//         type="range"
//         min="0"
//         max="1"
//         step="0.01"
//         value={volume}
//         onChange={handleVolumeChange}
//       />
//     </div>
//   );
// };

// export default WhiteNoiseGenerator;
