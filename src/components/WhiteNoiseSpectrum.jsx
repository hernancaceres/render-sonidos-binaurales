import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import * as echarts from 'echarts';

const WhiteNoiseSpectrum = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [energyData, setEnergyData] = useState([]);
  const chartRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'White Noise Spectrum',
      },
      xAxis: {
        type: 'value',
        min: 20,
        max: 20000,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1, // Adjust maximum value as needed
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

  const [noise, setNoise] = useState(null);

  const startNoise = () => {
    const newNoise = new Tone.Noise('white').start().toDestination(); // Conecta directamente a la salida
    setNoise(newNoise); // Guardar el ruido blanco en el estado
    const analyser = new Tone.Analyser('fft', 1024); // 1024 puntos de FFT
    newNoise.connect(analyser);

    const updateChart = () => {
      const dataArray = analyser.getValue(); // Obtener datos de frecuencia
      const energyArray = calculateEnergy(dataArray);
      setEnergyData(energyArray);

      const chart = echarts.getInstanceByDom(chartRef.current);
      chart.setOption({
        series: [{
          data: energyArray,
        }],
      });

      animationRef.current = requestAnimationFrame(updateChart);
    };

    Tone.Transport.start(); // Iniciar el transporte de Tone.js
    updateChart();
    setIsPlaying(true);
  };

  const stopNoise = () => {
    if (noise) {
      noise.stop(); // Detener el ruido blanco
    }
    Tone.Transport.stop();
    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
  };


  const calculateEnergy = (dataArray) => {
    const energyArray = [];
    const bufferLength = dataArray.length;

    // Calcular energía para cada bin de frecuencia
    for (let i = 0; i < bufferLength; i++) {
      energyArray.push([i * (Tone.context.sampleRate / 2) / bufferLength, Math.abs(dataArray[i]) / 255]); // Normaliza la energía
    }

    return energyArray;
  };

  const handleClick = () => {
    if (!isPlaying) {
      startNoise();
    } else {
      stopNoise();
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{isPlaying ? 'Stop Noise' : 'Start Noise'}</button>
      <div ref={chartRef} style={{ width: '600px', height: '400px' }} />
    </div>
  );
};

export default WhiteNoiseSpectrum;
