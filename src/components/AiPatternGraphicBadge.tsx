import React from 'react';

interface AiPatternGraphicBadgeProps {
  titleEn: string;
  index: number;
  size?: 'md' | 'sm';
}

type PatternKind =
  | 'predictive'
  | 'anomaly'
  | 'conversational'
  | 'goal'
  | 'recognition'
  | 'autonomous'
  | 'hyperpersonalization';

function detectPatternKind(titleEn: string, fallbackIndex: number): PatternKind {
  const s = (titleEn || '').toLowerCase();
  if (/predict|forecast|decision/.test(s)) return 'predictive';
  if (/anomal|pattern/.test(s)) return 'anomaly';
  if (/conversational|nlp|llm|rag|language/.test(s)) return 'conversational';
  if (/goal|optimiz|drive/.test(s)) return 'goal';
  if (/recognit|vision|satellite|image/.test(s)) return 'recognition';
  if (/autonom|robot|self/.test(s)) return 'autonomous';
  if (/personal|hyper/.test(s)) return 'hyperpersonalization';

  const order: PatternKind[] = [
    'predictive',
    'anomaly',
    'conversational',
    'goal',
    'recognition',
    'autonomous',
    'hyperpersonalization',
  ];
  return order[fallbackIndex % order.length];
}

const PATTERN_THEMES: Record<
  PatternKind,
  {
    bgFrom: string;
    bgTo: string;
    ringStroke: string;
    accent: string;
    secondary: string;
  }
> = {
  predictive: {
    bgFrom: '#0B253A',
    bgTo: '#0E3A5C',
    ringStroke: '#38BDF8',
    accent: '#38BDF8',
    secondary: '#FBBF24',
  },
  anomaly: {
    bgFrom: '#0B253A',
    bgTo: '#162E47',
    ringStroke: '#F59E0B',
    accent: '#38BDF8',
    secondary: '#F59E0B',
  },
  conversational: {
    bgFrom: '#0B253A',
    bgTo: '#133256',
    ringStroke: '#60A5FA',
    accent: '#38BDF8',
    secondary: '#A5B4FC',
  },
  goal: {
    bgFrom: '#0B253A',
    bgTo: '#0D3B44',
    ringStroke: '#2DD4BF',
    accent: '#2DD4BF',
    secondary: '#FBBF24',
  },
  recognition: {
    bgFrom: '#0B253A',
    bgTo: '#10315A',
    ringStroke: '#38BDF8',
    accent: '#60A5FA',
    secondary: '#34D399',
  },
  autonomous: {
    bgFrom: '#0B253A',
    bgTo: '#1A2D5A',
    ringStroke: '#818CF8',
    accent: '#38BDF8',
    secondary: '#818CF8',
  },
  hyperpersonalization: {
    bgFrom: '#0B253A',
    bgTo: '#222854',
    ringStroke: '#A78BFA',
    accent: '#38BDF8',
    secondary: '#C4B5FD',
  },
};

export const AiPatternGraphicBadge: React.FC<AiPatternGraphicBadgeProps> = ({
  titleEn,
  index,
  size = 'md',
}) => {
  const kind = detectPatternKind(titleEn, index);
  const theme = PATTERN_THEMES[kind];
  const gradId = `pat-bg-${kind}-${index}`;
  const dim = size === 'sm' ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl';

  return (
    <div
      className={`${dim} relative shrink-0 flex items-center justify-center shadow-[0_6px_16px_rgba(11,37,58,0.18)] overflow-hidden`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.bgFrom} />
            <stop offset="100%" stopColor={theme.bgTo} />
          </linearGradient>
        </defs>

        {/* Precision Architectural Base */}
        <rect x="0" y="0" width="56" height="56" rx="14" fill={`url(#${gradId})`} />

        {/* Subtle Inner Dashed Orbital Halo */}
        <circle
          cx="28"
          cy="28"
          r="22.5"
          fill="none"
          stroke={theme.ringStroke}
          strokeOpacity="0.34"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Pattern-Specific Bespoke Geometric Visual */}
        {kind === 'predictive' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Baseline axes */}
            <path
              d="M14 39 H42 M14 39 V17"
              stroke="#FFFFFF"
              strokeOpacity="0.25"
              strokeWidth="1.2"
            />
            {/* Confidence forecast cone */}
            <polygon
              points="29,29 41,17 41,25"
              fill={theme.accent}
              fillOpacity="0.2"
            />
            {/* Historical curve */}
            <path
              d="M15 36 L22 31 L29 29"
              stroke={theme.accent}
              strokeWidth="2.2"
            />
            {/* Dashed future prediction trajectory */}
            <path
              d="M29 29 L40 19"
              stroke={theme.secondary}
              strokeWidth="2.2"
              strokeDasharray="2.5 2.5"
            />
            <circle cx="22" cy="31" r="2.2" fill={theme.accent} />
            <circle cx="29" cy="29" r="2.3" fill="#FFFFFF" />
            <circle
              cx="40"
              cy="19"
              r="3"
              fill={theme.secondary}
              stroke="#0B253A"
              strokeWidth="1"
            />
          </g>
        )}

        {kind === 'anomaly' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Normal cluster ring */}
            <circle
              cx="23"
              cy="31"
              r="10"
              stroke={theme.accent}
              strokeOpacity="0.32"
              strokeWidth="1.2"
              strokeDasharray="2 2.5"
            />
            <circle cx="19" cy="33" r="2.2" fill={theme.accent} />
            <circle cx="25" cy="35" r="2.2" fill={theme.accent} />
            <circle cx="22" cy="28" r="2.2" fill={theme.accent} />
            <circle cx="27" cy="30" r="2.1" fill={theme.accent} opacity="0.8" />
            {/* Highlighted anomaly outlier with dashed detection reticle */}
            <circle
              cx="37"
              cy="19"
              r="6.5"
              stroke={theme.secondary}
              strokeWidth="1.5"
              strokeDasharray="2.5 2"
            />
            <circle cx="37" cy="19" r="3" fill={theme.secondary} />
            <path
              d="M27 29 L33 23"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        )}

        {kind === 'conversational' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Primary dialogue/document contour */}
            <path
              d="M15 21 C15 17.5 17.8 15 21.5 15 H34.5 C38.2 15 41 17.5 41 21 V30 C41 33.5 38.2 36 34.5 36 H25 L19 41 V36 H21.5 C17.8 36 15 33.5 15 30 Z"
              fill={theme.accent}
              fillOpacity="0.14"
              stroke={theme.accent}
              strokeWidth="1.7"
            />
            {/* Semantic neural audio/token bars inside */}
            <line x1="21.5" y1="23.5" x2="21.5" y2="27.5" stroke="#FFFFFF" strokeWidth="2.1" />
            <line x1="26" y1="20.5" x2="26" y2="30.5" stroke={theme.accent} strokeWidth="2.2" />
            <line x1="30.5" y1="22" x2="30.5" y2="29" stroke={theme.secondary} strokeWidth="2.2" />
            <line x1="35" y1="24" x2="35" y2="27" stroke="#FFFFFF" strokeWidth="2.1" />
          </g>
        )}

        {kind === 'goal' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Concentric precision target rings */}
            <circle cx="28" cy="28" r="14" stroke={theme.accent} strokeOpacity="0.45" strokeWidth="1.4" />
            <circle cx="28" cy="28" r="8.5" stroke={theme.accent} strokeOpacity="0.85" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="28" cy="28" r="3.4" fill={theme.secondary} />
            {/* Optimal vector arrow piercing to bullseye */}
            <path d="M40 16 L30.5 25.5" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M35 16 H40 V21" stroke={theme.secondary} strokeWidth="1.8" />
          </g>
        )}

        {kind === 'recognition' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* 4 Computer Vision Corner Brackets */}
            <path
              d="M15 21 V15 H21 M35 15 H41 V21 M41 35 V41 H35 M21 41 H15 V35"
              stroke={theme.accent}
              strokeWidth="2"
            />
            {/* Optical lens / object contour */}
            <path
              d="M18 28 C21 23 24.5 21.5 28 21.5 C31.5 21.5 35 23 38 28 C35 33 31.5 34.5 28 34.5 C24.5 34.5 21 33 18 28 Z"
              fill={theme.accent}
              fillOpacity="0.16"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <circle cx="28" cy="28" r="3" fill={theme.secondary} />
            {/* Scan beam */}
            <line
              x1="16"
              y1="28"
              x2="40"
              y2="28"
              stroke={theme.secondary}
              strokeOpacity="0.65"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
          </g>
        )}

        {kind === 'autonomous' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Closed autonomous feedback loop arcs */}
            <path
              d="M17 25 A11.5 11.5 0 0 1 37.5 21.5"
              stroke={theme.accent}
              strokeWidth="2.1"
            />
            <path d="M34 18.5 L38 21.8 L34.2 24.6" stroke={theme.accent} strokeWidth="1.8" />
            <path
              d="M39 31 A11.5 11.5 0 0 1 18.5 34.5"
              stroke={theme.secondary}
              strokeWidth="2.1"
            />
            <path d="M22 37.5 L18 34.2 L21.8 31.4" stroke={theme.secondary} strokeWidth="1.8" />
            {/* Central autonomous core */}
            <circle cx="28" cy="28" r="4.5" fill="#FFFFFF" fillOpacity="0.15" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="28" cy="28" r="2" fill={theme.accent} />
          </g>
        )}

        {kind === 'hyperpersonalization' && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Radial adaptive constellation spokes */}
            <line x1="28" y1="28" x2="17" y2="18" stroke={theme.accent} strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="28" y1="28" x2="39" y2="18" stroke={theme.secondary} strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="28" y1="28" x2="39" y2="38" stroke={theme.accent} strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="28" y1="28" x2="17" y2="38" stroke={theme.secondary} strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 2" />
            {/* Satellite preference nodes */}
            <circle cx="17" cy="18" r="2.4" fill={theme.accent} />
            <circle cx="39" cy="18" r="2.4" fill={theme.secondary} />
            <circle cx="39" cy="38" r="2.4" fill={theme.accent} />
            <circle cx="17" cy="38" r="2.4" fill={theme.secondary} />
            {/* Central tailored identity emblem */}
            <circle cx="28" cy="28" r="7.5" fill="#0B253A" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="28" cy="25.8" r="2.2" fill={theme.secondary} />
            <path d="M23.8 32 C24.8 29.8 31.2 29.8 32.2 32" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
