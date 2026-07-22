import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import { WarningScreen } from './components/WarningScreen';
import { LandingPage } from './pages/LandingPage';
import { ReadingHub } from './pages/ReadingHub';
import { ReadStory } from './pages/ReadStory';
import { InteractiveHub } from './pages/InteractiveHub';
import { PlayStory } from './pages/PlayStory';

function App() {
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  return (
    <SoundProvider>
      {!acceptedWarning ? (
        <WarningScreen onAccept={() => setAcceptedWarning(true)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/read" element={<ReadingHub />} />
            <Route path="/read/:id" element={<ReadStory />} />
            <Route path="/play" element={<InteractiveHub />} />
            <Route path="/play/:id" element={<PlayStory />} />
          </Routes>
        </Router>
      )}
    </SoundProvider>
  );
}

export default App;
