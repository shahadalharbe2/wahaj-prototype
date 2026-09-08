/**
 * Wahaj Dashboard Chart Components (pure SVG — no external libraries)
 *
 * Exports:
 *   DonutChart       — for priority distribution
 *   HorizontalBar    — for service utilization
 *   FunnelChart      — for conversion funnel
 *   ImpactBar        — for impact measurement rows
 */

// ─── DonutChart ───────────────────────────────────────────────────────────────
export function DonutChart({ data, size = 220, title }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.36;
  const ir = size * 0.22; // inner radius

  const slices = data.reduce((acc, d) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].end : -Math.PI / 2;
    const angle = (d.count / total) * 2 * Math.PI;
    acc.push({ ...d, start: prev, end: prev + angle, angle });
    return acc;
  }, []);

  function arcPath(s, e, outerR, innerR) {
    const x1 = cx + outerR * Math.cos(s);
    const y1 = cy + outerR * Math.sin(s);
    const x2 = cx + outerR * Math.cos(e);
    const y2 = cy + outerR * Math.sin(e);
    const ix1 = cx + innerR * Math.cos(e);
    const iy1 = cy + innerR * Math.sin(e);
    const ix2 = cx + innerR * Math.cos(s);
    const iy2 = cy + innerR * Math.sin(s);
    const large = e - s > Math.PI ? 1 : 0;
    return [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={title || 'مخطط دائري'}
      >
        {slices.map((s) => (
          <path
            key={s.id}
            d={arcPath(s.start, s.end, r, ir)}
            fill={s.color}
            opacity={0.9}
          />
        ))}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize={size * 0.09}
          fontWeight="700"
          fill="#1C1612"
          fontFamily="IBM Plex Sans Arabic, sans-serif"
        >
          {total.toLocaleString('ar')}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize={size * 0.055}
          fill="#9B856D"
          fontFamily="IBM Plex Sans Arabic, sans-serif"
        >
          إجمالي
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center' }}>
        {data.map((d) => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#5A4A38' }}>
              {d.emoji} {d.label}
            </span>
            <span style={{ fontWeight: 700, color: '#1C1612' }}>{d.count.toLocaleString('ar')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HorizontalBar ────────────────────────────────────────────────────────────
export function HorizontalBar({ data }) {
  const globalMax = Math.max(...data.map((d) => d.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {data.map((d) => {
        const pct = Math.round((d.count / globalMax) * 100);
        return (
          <div key={d.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 14, color: '#5A4A38', fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: d.color }}>
                {d.count.toLocaleString('ar')} مستفيدًا
              </span>
            </div>
            <div
              style={{
                height: 10,
                background: '#EAD9C6',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={d.count}
              aria-valuemax={globalMax}
              aria-label={d.label}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: d.color,
                  borderRadius: 9999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FunnelChart ──────────────────────────────────────────────────────────────
export function FunnelChart({ stages }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', maxWidth: 600, margin: '0 auto' }}>
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const width = 100 - i * (60 / stages.length);
        return (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Stage bar */}
            <div
              style={{
                width: `${width}%`,
                background: isLast ? '#3A7D44' : `hsl(${25 + i * 10}, 70%, ${58 - i * 4}%)`,
                borderRadius: i === 0 ? '10px 10px 0 0' : isLast ? '0 0 10px 10px' : 0,
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'width 0.3s ease',
              }}
            >
              <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{s.label}</span>
              <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{s.pct}٪</span>
                {s.note && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{s.note}</span>
                )}
              </div>
            </div>
            {/* Arrow connector */}
            {!isLast && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: `10px solid hsl(${25 + i * 10}, 70%, ${58 - i * 4}%)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ImpactBar ────────────────────────────────────────────────────────────────
export function ImpactBar({ label, pct, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 14, color: '#5A4A38', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color }}>{pct}٪</span>
      </div>
      <div
        style={{ height: 8, background: '#EAD9C6', borderRadius: 9999, overflow: 'hidden' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 9999,
          }}
        />
      </div>
    </div>
  );
}
