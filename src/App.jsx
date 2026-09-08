import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { AssessmentScreen } from './pages/AssessmentScreen';
import { CompletionScreen } from './pages/CompletionScreen';
import { AnalysisScreen } from './pages/AnalysisScreen';
import { ResultsDashboard } from './pages/ResultsDashboard';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard.jsx';
import { AdminImpactDashboard } from './pages/AdminImpactDashboard/AdminImpactDashboard.jsx';

/**
 * Wraps WelcomeScreen with a location-based key so React fully remounts it
 * on every navigation to "/". This ensures the useState lazy initializer
 * re-runs and always reads the latest localStorage value — no setState-in-effect needed.
 */
function KeyedWelcomeScreen() {
  const location = useLocation();
  return <WelcomeScreen key={location.key} />;
}

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
          <Route path="/"                    element={<KeyedWelcomeScreen />} />
          <Route path="/assessment"          element={<AssessmentScreen />} />
          <Route path="/assessment/complete" element={<CompletionScreen />} />
          <Route path="/analysis"            element={<AnalysisScreen />} />
          <Route path="/results"             element={<ResultsDashboard />} />
          <Route path="/dashboard"           element={<AdminDashboard />} />
          <Route path="/admin-dashboard"     element={<AdminImpactDashboard />} />
          {/* Catch-all */}
          <Route path="*"                    element={<KeyedWelcomeScreen />} />
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  );
}
