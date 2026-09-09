import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WahajLogo, Button } from '../../components';
import { ServicePathPanel } from '../../features/ServicePath/ServicePathPanel.jsx';
import {
  HEALTH_SERVICE_CONFIG,
  PHYSICAL_SERVICE_CONFIG,
  PSYCHOLOGICAL_SERVICE_CONFIG,
  SOCIAL_SERVICE_CONFIG,
  FINANCIAL_SERVICE_CONFIG,
  getExperienceServiceConfig,
} from '../../features/ServicePath/servicePathConfigs.js';

// Rebuild experience config from stored analysis raw answers
function getExperienceConfig() {
  try {
    const stored = sessionStorage.getItem('wahaj_analysis');
    if (!stored) return getExperienceServiceConfig();
    const { rawAnswers } = JSON.parse(stored);
    return getExperienceServiceConfig(rawAnswers?.[16], rawAnswers?.[17] ?? []);
  } catch {
    return getExperienceServiceConfig();
  }
}

const CONFIG_MAP = {
  health:        () => HEALTH_SERVICE_CONFIG,
  physical:      () => PHYSICAL_SERVICE_CONFIG,
  psychological: () => PSYCHOLOGICAL_SERVICE_CONFIG,
  social:        () => SOCIAL_SERVICE_CONFIG,
  financial:     () => FINANCIAL_SERVICE_CONFIG,
  experience:    getExperienceConfig,
};

const AGENT_TITLES = {
  health:        'الصحة والأمراض المزمنة',
  physical:      'النشاط والحركة',
  psychological: 'الرفاه النفسي',
  social:        'الحياة الاجتماعية',
  financial:     'الاستقرار المالي',
  experience:    'الخبرات والهدف',
};

export function ServicePage() {
  const { agentId } = useParams();
  const navigate    = useNavigate();

  // Retrieve human-review flag from stored analysis
  const [humanReview] = useState(() => {
    try {
      const stored = sessionStorage.getItem('wahaj_analysis');
      if (!stored) return false;
      const { agents } = JSON.parse(stored);
      const agent = agents?.find((a) => a.id === agentId);
      return agent?.humanReview ?? false;
    } catch {
      return false;
    }
  });

  const configFn = CONFIG_MAP[agentId];

  if (!configFn) {
    return (
      <main style={{ padding: 40, textAlign: 'center', direction: 'rtl' }}>
        <p style={{ marginBottom: 16 }}>لم يتم العثور على الخدمة المطلوبة.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/results')}>
          العودة للنتائج
        </Button>
      </main>
    );
  }

  const config = configFn();

  return (
    <main
      dir="rtl"
      lang="ar"
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          padding: '12px 24px',
          background: 'rgba(255,253,249,0.96)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <WahajLogo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
            }}
          >
            {AGENT_TITLES[agentId] ?? 'الخدمة المقترحة'}
          </span>
          <Button variant="ghost" size="sm" onClick={() => navigate('/results')}>
            ← النتائج
          </Button>
        </div>
      </header>

      {/* Service panel */}
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '40px 24px 80px',
          width: '100%',
        }}
      >
        <ServicePathPanel
          config={config}
          agentHasHumanReview={humanReview}
        />
      </div>
    </main>
  );
}
