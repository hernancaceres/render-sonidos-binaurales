


import BinauralBeatGenerator from './components/BinauralBeatGenerator';
import Player from './components/Player';
import SineWaveGenerator from './components/SineWaveGenerator';
import WhiteNoiseGenerator from './components/WhiteNoiseGenerator';

function App() {
  return (
    <div className="App">
      <h1>Reproductor de Audio</h1>
      <Player />
      
      <h1>Reuido Blanco</h1>
      <WhiteNoiseGenerator />

      <h1>Reproductor Frecuencial</h1>
      <SineWaveGenerator />

      <h1>Reproductor Binaural</h1>
      <BinauralBeatGenerator />

    </div>
  );
}

export default App;


