


import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import * as echarts from 'echarts';

const WhiteNoiseGeneratorWithECharts = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [filterFrequency, setFilterFrequency] = useState(1000);
  const [noise, setNoise] = useState(null);
  const chartRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Sound Energy',
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 1000, // Sample points to be displayed
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10000, // Adjust maximum value as needed
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: {
        type: 'line',
        smooth: true,
        data: [],
      },
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  const startSound = () => {
    const newNoise = new Tone.Noise('white').start().toDestination();
    const newFilter = new Tone.Filter(filterFrequency, 'highpass').toDestination();
    newNoise.connect(newFilter);
    newNoise.volume.value = Tone.gainToDb(volume);
    setNoise(newNoise);

    // Initialize chart data
    const chartDataEnergy = [];
    const chart = echarts.getInstanceByDom(chartRef.current);
    chart.setOption({
      series: {
        data: chartDataEnergy,
      },
    });

    // Update chart with audio data in real-time
    const updateChart = () => {
      const analyser = new Tone.Analyser('waveform', 2048);
      const dataArray = analyser.getValue(); // Get waveform data
      const energyData = calculateEnergy(dataArray);
      chart.setOption({
        series: {
          data: energyData,
        },
      });
      animationRef.current = requestAnimationFrame(updateChart);
    };

    animationRef.current = requestAnimationFrame(updateChart);
  };

  const calculateEnergy = (dataArray) => {
    const bufferLength = dataArray.length;
    const energyArray = new Float32Array(bufferLength);
    let energy = 0;

    // Calculate energy for each sample
    for (let i = 0; i < bufferLength; i++) {
      energy += Math.pow(dataArray[i], 2);
      energyArray[i] = Math.sqrt(energy);
    }

    return Array.from(energyArray);
  };

  const stopSound = () => {
    if (noise) {
      noise.dispose(); // Stop and dispose of the noise instance
      setNoise(null);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleClick = async () => {
    try {
      await Tone.start();
      if (isPlaying) {
        stopSound();
      } else {
        startSound();
      }
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
      <div ref={chartRef} style={{ width: '600px', height: '400px' }} />
    </div>
  );
};

export default WhiteNoiseGeneratorWithECharts;




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









