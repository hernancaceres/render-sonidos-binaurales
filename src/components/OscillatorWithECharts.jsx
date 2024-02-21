import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const OscillatorWithECharts = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const waveformChartRef = useRef(null);
  const energyChartRef = useRef(null);
  const animationRef = useRef(null);
  const waveformAnalyserRef = useRef(null);
  const energyAnalyserRef = useRef(null);

  useEffect(() => {
    if (!waveformChartRef.current || !energyChartRef.current) return;

    const waveformChart = echarts.init(waveformChartRef.current);
    const energyChart = echarts.init(energyChartRef.current);

    const waveformOption = {
      title: {
        text: 'Sound Waveform & Energy',
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 1000, // Sample points to be displayed
      },
      yAxis: [
        {
          type: 'value',
          min: -1,
          max: 1,
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          min: 0,
          max: 10000, // Adjust maximum value as needed
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          data: [],
        },
        {
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: [],
        },
      ],
    };

    waveformChart.setOption(waveformOption);
    energyChart.setOption(waveformOption);

    return () => {
      waveformChart.dispose();
      energyChart.dispose();
    };
  }, []);

  const startTone = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const waveformAnalyser = context.createAnalyser();
    const energyAnalyser = context.createAnalyser();
    waveformAnalyser.fftSize = 2048;
    energyAnalyser.fftSize = 2048;
    osc.type = 'sine'; // Sine wave oscillator
    osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
    osc.connect(waveformAnalyser); // Connect oscillator to waveform analyser
    osc.connect(energyAnalyser); // Connect oscillator to energy analyser
    waveformAnalyser.connect(context.destination); // Connect waveform analyser to audio output
    osc.start(); // Start oscillator
    setAudioContext(context);
    setOscillator(osc);
    waveformAnalyserRef.current = waveformAnalyser;
    energyAnalyserRef.current = energyAnalyser;
    setIsPlaying(true);

    // Initialize chart data
    const waveformChartData = [];
    const energyChartData = [];
    const waveformChart = echarts.getInstanceByDom(waveformChartRef.current);
    const energyChart = echarts.getInstanceByDom(energyChartRef.current);
    waveformChart.setOption({
      series: [
        {
          data: waveformChartData,
        },
        {
          data: energyChartData,
        },
      ],
    });

    // Update charts with audio data in real-time
    const updateCharts = () => {
      const waveformDataArray = new Float32Array(waveformAnalyser.frequencyBinCount); // Buffer size for waveform data
      const energyDataArray = new Float32Array(energyAnalyser.frequencyBinCount); // Buffer size for energy data
      waveformAnalyser.getFloatTimeDomainData(waveformDataArray); // Get waveform data
      energyAnalyser.getFloatTimeDomainData(energyDataArray); // Get energy data
      const waveformData = Array.from(waveformDataArray).map((val, index) => [index, val]); // Time vs. Amplitude
      const energyData = Array.from(energyDataArray).map((val, index) => [index, val]); // Time vs. Energy
      waveformChart.setOption({
        series: [
          {
            data: waveformData,
          },
          {
            data: energyData,
          },
        ],
      });
      animationRef.current = requestAnimationFrame(updateCharts);
    };

    animationRef.current = requestAnimationFrame(updateCharts);
  };

  const stopTone = () => {
    if (oscillator) {
      oscillator.stop(); // Stop oscillator
      oscillator.disconnect(); // Disconnect oscillator
      audioContext.close(); // Close audio context
      setAudioContext(null);
      setOscillator(null);
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleToggleTone = () => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  };

  return (
    <div>
      <button onClick={handleToggleTone}>
        {isPlaying ? 'Stop Tone' : 'Start Tone'}
      </button>
      <div ref={waveformChartRef} style={{ width: '600px', height: '400px', marginBottom: '20px' }} />
      <div ref={energyChartRef} style={{ width: '600px', height: '400px' }} />
    </div>
  );
};

export default OscillatorWithECharts;



// import { useState, useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const OscillatorWithECharts = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);
//   const waveformChartRef = useRef(null);
//   const energyChartRef = useRef(null);
//   const animationRef = useRef(null);
//   const waveformAnalyserRef = useRef(null);
//   const energyAnalyserRef = useRef(null);

//   useEffect(() => {
//     if (!waveformChartRef.current || !energyChartRef.current) return;

//     const waveformChart = echarts.init(waveformChartRef.current);
//     const energyChart = echarts.init(energyChartRef.current);

//     const waveformOption = {
//       title: {
//         text: 'Sound Waveform & Energy',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: [
//         {
//           type: 'value',
//           min: -1,
//           max: 1,
//           axisLabel: {
//             formatter: '{value}',
//           },
//         },
//         {
//           type: 'value',
//           min: 0,
//           max: 10000, // Adjust maximum value as needed
//           axisLabel: {
//             formatter: '{value}',
//           },
//         },
//       ],
//       series: [
//         {
//           type: 'line',
//           yAxisIndex: 0,
//           smooth: true,
//           data: [],
//         },
//         {
//           type: 'line',
//           yAxisIndex: 1,
//           smooth: true,
//           data: [],
//         },
//       ],
//     };

//     waveformChart.setOption(waveformOption);
//     energyChart.setOption(waveformOption);

//     return () => {
//       waveformChart.dispose();
//       energyChart.dispose();
//     };
//   }, []);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     const waveformAnalyser = context.createAnalyser();
//     const energyAnalyser = context.createAnalyser();
//     waveformAnalyser.fftSize = 2048;
//     energyAnalyser.fftSize = 2048;
//     osc.type = 'sine'; // Sine wave oscillator
//     osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
//     osc.connect(waveformAnalyser); // Connect oscillator to waveform analyser
//     osc.connect(energyAnalyser); // Connect oscillator to energy analyser
//     waveformAnalyser.connect(context.destination); // Connect waveform analyser to audio output
//     osc.start(); // Start oscillator
//     setAudioContext(context);
//     setOscillator(osc);
//     waveformAnalyserRef.current = waveformAnalyser;
//     energyAnalyserRef.current = energyAnalyser;
//     setIsPlaying(true);

//     // Initialize chart data
//     const waveformChartData = [];
//     const energyChartData = [];
//     const waveformChart = echarts.getInstanceByDom(waveformChartRef.current);
//     const energyChart = echarts.getInstanceByDom(energyChartRef.current);
//     waveformChart.setOption({
//       series: [
//         {
//           data: waveformChartData,
//         },
//         {
//           data: energyChartData,
//         },
//       ],
//     });

//     // Update charts with audio data in real-time
//     const updateCharts = () => {
//       const waveformDataArray = new Float32Array(waveformAnalyser.frequencyBinCount); // Buffer size for waveform data
//       const energyDataArray = new Float32Array(energyAnalyser.frequencyBinCount); // Buffer size for energy data
//       waveformAnalyser.getFloatTimeDomainData(waveformDataArray); // Get waveform data
//       energyAnalyser.getFloatTimeDomainData(energyDataArray); // Get energy data
//       const waveformData = Array.from(waveformDataArray).map((val, index) => [index, val]); // Time vs. Amplitude
//       const energyData = Array.from(energyDataArray).map((val, index) => [index, val]); // Time vs. Energy
//       waveformChart.setOption({
//         series: [
//           {
//             data: waveformData,
//           },
//           {
//             data: energyData,
//           },
//         ],
//       });
//       animationRef.current = requestAnimationFrame(updateCharts);
//     };

//     animationRef.current = requestAnimationFrame(updateCharts);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Stop oscillator
//       oscillator.disconnect(); // Disconnect oscillator
//       audioContext.close(); // Close audio context
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//       cancelAnimationFrame(animationRef.current);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <div ref={waveformChartRef} style={{ width: '600px', height: '400px', marginBottom: '20px' }} />
//       <div ref={energyChartRef} style={{ width: '600px', height: '400px' }} />
//     </div>
//   );
// };

// export default OscillatorWithECharts;





// import { useState, useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const OscillatorWithECharts = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);
//   const waveformChartRef = useRef(null);
//   const energyChartRef = useRef(null);
//   const animationRef = useRef(null);
//   const waveformAnalyserRef = useRef(null);
//   const energyAnalyserRef = useRef(null);

//   useEffect(() => {
//     if (!waveformChartRef.current || !energyChartRef.current) return;

//     const waveformChart = echarts.init(waveformChartRef.current);
//     const energyChart = echarts.init(energyChartRef.current);

//     const waveformOption = {
//       title: {
//         text: 'Sound Waveform',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: {
//         type: 'value',
//         min: -1,
//         max: 1,
//         axisLabel: {
//           formatter: '{value}',
//         },
//       },
//       series: {
//         type: 'line',
//         smooth: true,
//         data: [],
//       },
//     };

//     const energyOption = {
//       title: {
//         text: 'Sound Energy',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: {
//         type: 'value',
//         min: 0,
//         max: 10000, // Adjust maximum value as needed
//         axisLabel: {
//           formatter: '{value}',
//         },
//       },
//       series: {
//         type: 'line',
//         smooth: true,
//         data: [],
//       },
//     };

//     waveformChart.setOption(waveformOption);
//     energyChart.setOption(energyOption);

//     return () => {
//       waveformChart.dispose();
//       energyChart.dispose();
//     };
//   }, []);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     const waveformAnalyser = context.createAnalyser();
//     const energyAnalyser = context.createAnalyser();
//     waveformAnalyser.fftSize = 2048;
//     energyAnalyser.fftSize = 2048;
//     osc.type = 'sine'; // Sine wave oscillator
//     osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
//     osc.connect(waveformAnalyser); // Connect oscillator to waveform analyser
//     osc.connect(energyAnalyser); // Connect oscillator to energy analyser
//     waveformAnalyser.connect(context.destination); // Connect waveform analyser to audio output
//     osc.start(); // Start oscillator
//     setAudioContext(context);
//     setOscillator(osc);
//     waveformAnalyserRef.current = waveformAnalyser;
//     energyAnalyserRef.current = energyAnalyser;
//     setIsPlaying(true);

//     // Initialize chart data
//     const waveformChartData = [];
//     const energyChartData = [];
//     const waveformChart = echarts.getInstanceByDom(waveformChartRef.current);
//     const energyChart = echarts.getInstanceByDom(energyChartRef.current);
//     waveformChart.setOption({
//       series: {
//         data: waveformChartData,
//       },
//     });
//     energyChart.setOption({
//       series: {
//         data: energyChartData,
//       },
//     });

//     // Update charts with audio data in real-time
//     const updateCharts = () => {
//       const waveformDataArray = new Float32Array(waveformAnalyser.frequencyBinCount); // Buffer size for waveform data
//       const energyDataArray = new Float32Array(energyAnalyser.frequencyBinCount); // Buffer size for energy data
//       waveformAnalyser.getFloatTimeDomainData(waveformDataArray); // Get waveform data
//       energyAnalyser.getFloatTimeDomainData(energyDataArray); // Get energy data
//       const waveformData = Array.from(waveformDataArray).map((val, index) => [index, val]); // Time vs. Amplitude
//       const energyData = calculateEnergy(energyDataArray);
//       waveformChart.setOption({
//         series: {
//           data: waveformData,
//         },
//       });
//       energyChart.setOption({
//         series: {
//           data: energyData,
//         },
//       });
//       animationRef.current = requestAnimationFrame(updateCharts);
//     };

//     animationRef.current = requestAnimationFrame(updateCharts);
//   };

//   const calculateEnergy = (dataArray) => {
//     const bufferLength = dataArray.length;
//     const energyArray = new Float32Array(bufferLength);
//     let energy = 0;

//     // Calculate energy for each sample
//     for (let i = 0; i < bufferLength; i++) {
//       energy += Math.pow(dataArray[i], 2);
//       energyArray[i] = Math.sqrt(energy);
//     }

//     return Array.from(energyArray);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Stop oscillator
//       oscillator.disconnect(); // Disconnect oscillator
//       audioContext.close(); // Close audio context
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//       cancelAnimationFrame(animationRef.current);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <div ref={waveformChartRef} style={{ width: '600px', height: '400px', marginBottom: '20px' }} />
//       <div ref={energyChartRef} style={{ width: '600px', height: '400px' }} />
//     </div>
//   );
// };

// export default OscillatorWithECharts;




// import { useState, useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const OscillatorWithECharts = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);
//   const waveformChartRef = useRef(null);
//   const energyChartRef = useRef(null);
//   const animationRef = useRef(null);
//   const waveformAnalyserRef = useRef(null);
//   const energyAnalyserRef = useRef(null);

//   useEffect(() => {
//     if (!waveformChartRef.current || !energyChartRef.current) return;

//     const waveformChart = echarts.init(waveformChartRef.current);
//     const energyChart = echarts.init(energyChartRef.current);

//     const waveformOption = {
//       title: {
//         text: 'Sound Waveform',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: {
//         type: 'value',
//         min: -1,
//         max: 1,
//         axisLabel: {
//           formatter: '{value}',
//         },
//       },
//       series: {
//         type: 'line',
//         smooth: true,
//         data: [],
//       },
//     };

//     const energyOption = {
//       title: {
//         text: 'Sound Energy',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: {
//         type: 'value',
//         min: 0,
//         max: 10000, // Adjust maximum value as needed
//         axisLabel: {
//           formatter: '{value}',
//         },
//       },
//       series: {
//         type: 'line',
//         smooth: true,
//         data: [],
//       },
//     };

//     waveformChart.setOption(waveformOption);
//     energyChart.setOption(energyOption);

//     return () => {
//       waveformChart.dispose();
//       energyChart.dispose();
//     };
//   }, []);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     const waveformAnalyser = context.createAnalyser();
//     const energyAnalyser = context.createAnalyser();
//     waveformAnalyser.fftSize = 2048;
//     energyAnalyser.fftSize = 2048;
//     osc.type = 'sine'; // Sine wave oscillator
//     osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
//     osc.connect(waveformAnalyser); // Connect oscillator to waveform analyser
//     osc.connect(energyAnalyser); // Connect oscillator to energy analyser
//     waveformAnalyser.connect(context.destination); // Connect waveform analyser to audio output
//     osc.start(); // Start oscillator
//     setAudioContext(context);
//     setOscillator(osc);
//     waveformAnalyserRef.current = waveformAnalyser;
//     energyAnalyserRef.current = energyAnalyser;
//     setIsPlaying(true);

//     // Initialize chart data
//     const waveformChartData = [];
//     const energyChartData = [];
//     const waveformChart = echarts.getInstanceByDom(waveformChartRef.current);
//     const energyChart = echarts.getInstanceByDom(energyChartRef.current);
//     waveformChart.setOption({
//       series: {
//         data: waveformChartData,
//       },
//     });
//     energyChart.setOption({
//       series: {
//         data: energyChartData,
//       },
//     });

//     // Update charts with audio data in real-time
//     const updateCharts = () => {
//       const waveformDataArray = new Float32Array(waveformAnalyser.frequencyBinCount); // Buffer size for waveform data
//       const energyDataArray = new Float32Array(energyAnalyser.frequencyBinCount); // Buffer size for energy data
//       waveformAnalyser.getFloatTimeDomainData(waveformDataArray); // Get waveform data
//       energyAnalyser.getFloatTimeDomainData(energyDataArray); // Get energy data
//       const waveformData = Array.from(waveformDataArray);
//       const energyData = calculateEnergy(energyDataArray);
//       waveformChart.setOption({
//         series: {
//           data: waveformData,
//         },
//       });
//       energyChart.setOption({
//         series: {
//           data: energyData,
//         },
//       });
//       animationRef.current = requestAnimationFrame(updateCharts);
//     };

//     animationRef.current = requestAnimationFrame(updateCharts);
//   };

//   const calculateEnergy = (dataArray) => {
//     const bufferLength = dataArray.length;
//     const energyArray = new Float32Array(bufferLength);
//     let energy = 0;

//     // Calculate energy for each sample
//     for (let i = 0; i < bufferLength; i++) {
//       energy += Math.pow(dataArray[i], 2);
//       energyArray[i] = Math.sqrt(energy);
//     }

//     return Array.from(energyArray);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Stop oscillator
//       oscillator.disconnect(); // Disconnect oscillator
//       audioContext.close(); // Close audio context
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//       cancelAnimationFrame(animationRef.current);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <div ref={waveformChartRef} style={{ width: '600px', height: '400px', marginBottom: '20px' }} />
//       <div ref={energyChartRef} style={{ width: '600px', height: '400px' }} />
//     </div>
//   );
// };

// export default OscillatorWithECharts;





// import { useState, useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const OscillatorWithECharts = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);
//   const chartRef = useRef(null);
//   const animationRef = useRef(null);
//   const analyserRef = useRef(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     const chart = echarts.init(chartRef.current);

//     const option = {
//       title: {
//         text: 'Sound Waveform & Energy',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: [
//         {
//           type: 'value',
//           min: -1,
//           max: 1,
//           axisLabel: {
//             formatter: '{value}',
//           },
//         },
//         {
//           type: 'value',
//           min: 0,
//           max: 10000, // Adjust maximum value as needed
//           axisLabel: {
//             formatter: '{value}',
//           },
//         },
//       ],
//       series: [
//         {
//           type: 'line',
//           yAxisIndex: 0,
//           smooth: true,
//           data: [],
//         },
//         {
//           type: 'line',
//           yAxisIndex: 1,
//           smooth: true,
//           data: [],
//         },
//       ],
//     };

//     chart.setOption(option);

//     return () => {
//       chart.dispose();
//     };
//   }, []);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     const analyser = context.createAnalyser();
//     analyser.fftSize = 2048;
//     osc.type = 'sine'; // Sine wave oscillator
//     osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
//     osc.connect(analyser); // Connect oscillator to analyser
//     analyser.connect(context.destination); // Connect analyser to audio output
//     osc.start(); // Start oscillator
//     setAudioContext(context);
//     setOscillator(osc);
//     analyserRef.current = analyser;
//     setIsPlaying(true);

//     // Initialize chart data
//     const chartDataWaveform = [];
//     const chartDataEnergy = [];
//     const chart = echarts.getInstanceByDom(chartRef.current);
//     chart.setOption({
//       series: [
//         {
//           data: chartDataWaveform,
//         },
//         {
//           data: chartDataEnergy,
//         },
//       ],
//     });

//     // Update chart with audio data in real-time
//     const updateChart = () => {
//       const dataArray = new Float32Array(analyser.frequencyBinCount); // Buffer size for audio data
//       analyser.getFloatTimeDomainData(dataArray); // Get waveform data
//       const waveformData = Array.from(dataArray);
//       chart.setOption({
//         series: [
//           {
//             data: waveformData,
//           },
//           {
//             data: calculateEnergy(dataArray),
//           },
//         ],
//       });
//       animationRef.current = requestAnimationFrame(updateChart);
//     };

//     animationRef.current = requestAnimationFrame(updateChart);
//   };

//   const calculateEnergy = (dataArray) => {
//     const bufferLength = dataArray.length;
//     const energyArray = new Float32Array(bufferLength);
//     let energy = 0;

//     // Calculate energy for each sample
//     for (let i = 0; i < bufferLength; i++) {
//       energy += Math.pow(dataArray[i], 2);
//       energyArray[i] = Math.sqrt(energy);
//     }

//     return Array.from(energyArray);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Stop oscillator
//       oscillator.disconnect(); // Disconnect oscillator
//       audioContext.close(); // Close audio context
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//       cancelAnimationFrame(animationRef.current);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <div ref={chartRef} style={{ width: '600px', height: '400px' }} />
//     </div>
//   );
// };

// export default OscillatorWithECharts;



// import { useState, useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const OscillatorWithECharts = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioContext, setAudioContext] = useState(null);
//   const [oscillator, setOscillator] = useState(null);
//   const chartRef = useRef(null);
//   const animationRef = useRef(null);
//   const analyserRef = useRef(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     const chart = echarts.init(chartRef.current);

//     const option = {
//       title: {
//         text: 'Sound Waveform',
//       },
//       xAxis: {
//         type: 'value',
//         min: 0,
//         max: 1000, // Sample points to be displayed
//       },
//       yAxis: {
//         type: 'value',
//         min: -1,
//         max: 1,
//       },
//       series: [{
//         type: 'line',
//         smooth: true,
//         data: [],
//       }],
//     };

//     chart.setOption(option);

//     return () => {
//       chart.dispose();
//     };
//   }, []);

//   const startTone = () => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = context.createOscillator();
//     const analyser = context.createAnalyser();
//     analyser.fftSize = 2048;
//     osc.type = 'sine'; // Sine wave oscillator
//     osc.frequency.setValueAtTime(440, context.currentTime); // Set frequency to 440Hz
//     osc.connect(analyser); // Connect oscillator to analyser
//     analyser.connect(context.destination); // Connect analyser to audio output
//     osc.start(); // Start oscillator
//     setAudioContext(context);
//     setOscillator(osc);
//     analyserRef.current = analyser;
//     setIsPlaying(true);

//     // Initialize chart data
//     const chartData = [];
//     const chart = echarts.getInstanceByDom(chartRef.current);
//     chart.setOption({
//       series: [{
//         data: chartData,
//       }],
//     });

//     // Update chart with audio data in real-time
//     const updateChart = () => {
//       const dataArray = new Float32Array(analyser.frequencyBinCount); // Buffer size for audio data
//       analyser.getFloatTimeDomainData(dataArray); // Get waveform data
//       const newData = Array.from(dataArray);
//       chart.setOption({
//         series: [{
//           data: newData,
//         }],
//       });
//       animationRef.current = requestAnimationFrame(updateChart);
//     };

//     animationRef.current = requestAnimationFrame(updateChart);
//   };

//   const stopTone = () => {
//     if (oscillator) {
//       oscillator.stop(); // Stop oscillator
//       oscillator.disconnect(); // Disconnect oscillator
//       audioContext.close(); // Close audio context
//       setAudioContext(null);
//       setOscillator(null);
//       setIsPlaying(false);
//       cancelAnimationFrame(animationRef.current);
//     }
//   };

//   const handleToggleTone = () => {
//     if (isPlaying) {
//       stopTone();
//     } else {
//       startTone();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleToggleTone}>
//         {isPlaying ? 'Stop Tone' : 'Start Tone'}
//       </button>
//       <div ref={chartRef} style={{ width: '600px', height: '400px' }} />
//     </div>
//   );
// };

// export default OscillatorWithECharts;

