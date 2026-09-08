import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { AssessmentScreen } from './pages/AssessmentScreen';
import { CompletionScreen } from './pages/CompletionScreen';
import { AnalysisScreen } from './pages/AnalysisScreen';
import { ResultsDashboard } from './pages/ResultsDashboard';

export function App() {
  return (
    <BrowserRouter>
      {/*
        AssessmentProvider wraps all routes so answers survive navigation.
        Analysis results are stored in sessionStorage so they persist across
        direct navigation to /results without crashing.
      */}
      <AssessmentProvider>
        <Routes>
          <Route path="/"                    element={<WelcomeScreen />} />
          <Route path="/assessment"          element={<AssessmentScreen />} />
          <Route path="/assessment/complete" element={<CompletionScreen />} />
          <Route path="/analysis"            element={<AnalysisScreen />} />
          <Route path="/results"             element={<ResultsDashboard />} />
          {/* Catch-all */}
          <Route path="*"                    element={<WelcomeScreen />} />
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  );
}
