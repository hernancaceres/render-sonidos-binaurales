

import BinauralBeatGenerator from './components/BinauralBeatGenerator';

import Player from './components/Player';
import SineWaveGenerator from './components/SineWaveGenerator';

import ToneGenerator from './components/ToneGenerator';
import OscillatorWithECharts from './components/OscillatorWithECharts';
import WhiteNoiseGeneratorWithECharts from './components/WhiteNoiseGenerator';
import PlayerPitch from './components/PlayerPitch';
import WhiteNoiseSpectrum from './components/WhiteNoiseSpectrum';

function App() {
  return (
    <div className="App">
      <h1>Reproductor de Audio</h1>
      <Player />

      <h1>Reproductor de Audio</h1>
      <PlayerPitch />

      <h1>Ruido Blanco</h1>
      <WhiteNoiseGeneratorWithECharts />

      <h1>Reproductor Frecuencial</h1>
      <SineWaveGenerator />

      <h1>Reproductor Binaural</h1>
      <BinauralBeatGenerator />

      <h1>grabador de frecuencias </h1>
      <ToneGenerator />

      <h1>graficar frecuencias </h1>
      <OscillatorWithECharts />

      <h1>Ruido Blanco espectum</h1>
      <WhiteNoiseSpectrum />

    </div>
  );
}

export default App;


