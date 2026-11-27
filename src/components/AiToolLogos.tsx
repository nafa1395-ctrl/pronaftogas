import React from 'react';

export type AiToolId =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'notebooklm'
  | 'perplexity'
  | 'deepseek'
  | 'obsidian'
  | 'mcp'
  | 'sheets'
  | 'markdown'
  | 'github'
  | 'skillmd'
  | 'aistudio'
  | 'cursor';

export interface AiToolMeta {
  id: AiToolId;
  label: string;
  shortCode: string;
  hex: string;
  rgb: [number, number, number];
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const AI_TOOL_META: Record<AiToolId, AiToolMeta> = {
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT',
    shortCode: 'GPT',
    hex: '#10A37F',
    rgb: [16 / 255, 163 / 255, 127 / 255],
    bgClass: 'bg-[#10A37F]/10',
    borderClass: 'border-[#10A37F]/35',
    textClass: 'text-[#0B7359]',
  },
  claude: {
    id: 'claude',
    label: 'Claude',
    shortCode: 'CLD',
    hex: '#D97757',
    rgb: [217 / 255, 119 / 255, 87 / 255],
    bgClass: 'bg-[#D97757]/12',
    borderClass: 'border-[#D97757]/40',
    textClass: 'text-[#9A4528]',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    shortCode: 'GEM',
    hex: '#4285F4',
    rgb: [66 / 255, 133 / 255, 244 / 255],
    bgClass: 'bg-[#4285F4]/10',
    borderClass: 'border-[#4285F4]/35',
    textClass: 'text-[#1D4ED8]',
  },
  notebooklm: {
    id: 'notebooklm',
    label: 'NotebookLM',
    shortCode: 'NLM',
    hex: '#1A73E8',
    rgb: [26 / 255, 115 / 255, 232 / 255],
    bgClass: 'bg-[#1A73E8]/10',
    borderClass: 'border-[#1A73E8]/35',
    textClass: 'text-[#1557B0]',
  },
  perplexity: {
    id: 'perplexity',
    label: 'Perplexity',
    shortCode: 'PPX',
    hex: '#20808D',
    rgb: [32 / 255, 128 / 255, 141 / 255],
    bgClass: 'bg-[#20808D]/10',
    borderClass: 'border-[#20808D]/35',
    textClass: 'text-[#165D67]',
  },
  deepseek: {
    id: 'deepseek',
    label: 'DeepSeek',
    shortCode: 'DSK',
    hex: '#4D6BFE',
    rgb: [77 / 255, 107 / 255, 254 / 255],
    bgClass: 'bg-[#4D6BFE]/10',
    borderClass: 'border-[#4D6BFE]/35',
    textClass: 'text-[#2B47D1]',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Obsidian',
    shortCode: 'OBS',
    hex: '#7C3AED',
    rgb: [124 / 255, 58 / 255, 237 / 255],
    bgClass: 'bg-[#7C3AED]/10',
    borderClass: 'border-[#7C3AED]/35',
    textClass: 'text-[#5B21B6]',
  },
  mcp: {
    id: 'mcp',
    label: 'MCP',
    shortCode: 'MCP',
    hex: '#0B253A',
    rgb: [11 / 255, 37 / 255, 58 / 255],
    bgClass: 'bg-[#0B253A]/10',
    borderClass: 'border-[#0B253A]/35',
    textClass: 'text-[#0B253A]',
  },
  sheets: {
    id: 'sheets',
    label: 'Sheets/CSV',
    shortCode: 'CSV',
    hex: '#0F9D58',
    rgb: [15 / 255, 157 / 255, 88 / 255],
    bgClass: 'bg-[#0F9D58]/10',
    borderClass: 'border-[#0F9D58]/35',
    textClass: 'text-[#0B6F3E]',
  },
  markdown: {
    id: 'markdown',
    label: 'Markdown',
    shortCode: 'MD',
    hex: '#334155',
    rgb: [51 / 255, 65 / 255, 85 / 255],
    bgClass: 'bg-slate-200/70',
    borderClass: 'border-slate-400/50',
    textClass: 'text-slate-800',
  },
  github: {
    id: 'github',
    label: 'GitHub',
    shortCode: 'GIT',
    hex: '#24292F',
    rgb: [36 / 255, 41 / 255, 47 / 255],
    bgClass: 'bg-slate-800/10',
    borderClass: 'border-slate-700/35',
    textClass: 'text-slate-900',
  },
  skillmd: {
    id: 'skillmd',
    label: 'SKILL.md',
    shortCode: 'SKL',
    hex: '#0284C7',
    rgb: [2 / 255, 132 / 255, 199 / 255],
    bgClass: 'bg-[#0284C7]/10',
    borderClass: 'border-[#0284C7]/35',
    textClass: 'text-[#0369A1]',
  },
  aistudio: {
    id: 'aistudio',
    label: 'AI Studio',
    shortCode: 'AIS',
    hex: '#2563EB',
    rgb: [37 / 255, 99 / 255, 235 / 255],
    bgClass: 'bg-[#2563EB]/10',
    borderClass: 'border-[#2563EB]/35',
    textClass: 'text-[#1D4ED8]',
  },
  cursor: {
    id: 'cursor',
    label: 'Cursor',
    shortCode: 'CUR',
    hex: '#111827',
    rgb: [17 / 255, 24 / 255, 39 / 255],
    bgClass: 'bg-slate-900/10',
    borderClass: 'border-slate-800/35',
    textClass: 'text-slate-900',
  },
};

export const AiToolLogoSvg: React.FC<{ toolId: AiToolId; className?: string }> = ({
  toolId,
  className = 'w-4 h-4',
}) => {
  switch (toolId) {
    case 'chatgpt':
      // OpenAI hexagonal knot mark
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#10A37F" />
          <g stroke="#FFFFFF" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5.2a3.3 3.3 0 0 1 3.1 2.2l1.8 1a3.3 3.3 0 0 1 .4 5.2 3.3 3.3 0 0 1-2.2 4.9 3.3 3.3 0 0 1-5.1-.1 3.3 3.3 0 0 1-5-1.6 3.3 3.3 0 0 1 1.2-5 3.3 3.3 0 0 1 2.6-4.9A3.3 3.3 0 0 1 12 5.2Z" />
            <polygon points="12,9.3 14.3,10.65 14.3,13.35 12,14.7 9.7,13.35 9.7,10.65" />
            <path d="M12 9.3V5.4M14.3 10.65l3.2-1.85M14.3 13.35l3.2 1.85M12 14.7v3.9M9.7 13.35l-3.2 1.85M9.7 10.65L6.5 8.8" />
          </g>
        </svg>
      );

    case 'claude':
      // Anthropic Claude sunburst rays mark
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#D97757" />
          <g stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="4.4" x2="12" y2="9.2" />
            <line x1="12" y1="14.8" x2="12" y2="19.6" />
            <line x1="4.4" y1="12" x2="9.2" y2="12" />
            <line x1="14.8" y1="12" x2="19.6" y2="12" />
            <line x1="6.6" y1="6.6" x2="9.9" y2="9.9" />
            <line x1="14.1" y1="14.1" x2="17.4" y2="17.4" />
            <line x1="17.4" y1="6.6" x2="14.1" y2="9.9" />
            <line x1="9.9" y1="14.1" x2="6.6" y2="17.4" />
          </g>
          <circle cx="12" cy="12" r="2.1" fill="#FFFFFF" />
        </svg>
      );

    case 'gemini':
      // Google Gemini 4-point concave sparkle
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="gem-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="55%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="url(#gem-grad)" />
          <path
            d="M12 3.8C12.7 8.4 15.6 11.3 20.2 12C15.6 12.7 12.7 15.6 12 20.2C11.3 15.6 8.4 12.7 3.8 12C8.4 11.3 11.3 8.4 12 3.8Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'notebooklm':
      // Google NotebookLM concentric wave arcs
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#1A73E8" />
          <path
            d="M5.2 16.5C5.2 11.1 9.6 6.8 15 6.8C16.7 6.8 18.2 7.2 19.3 7.9"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8.5 16.5C8.5 13 11.4 10.1 15 10.1C16.3 10.1 17.5 10.5 18.5 11.2"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M11.8 16.5C11.8 14.8 13.2 13.4 15 13.4C15.9 13.4 16.7 13.8 17.3 14.4"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="15" cy="16.8" r="1.4" fill="#FFFFFF" />
        </svg>
      );

    case 'perplexity':
      // Perplexity geometric prism diamond mark
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#20808D" />
          <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="4.5" x2="12" y2="19.5" />
            <polygon points="12,5.5 17.5,9.5 17.5,14.5 12,18.5 6.5,14.5 6.5,9.5" />
            <path d="M6.5 9.5L12 12L17.5 9.5" />
            <path d="M8.2 6.5L12 12L15.8 6.5" />
          </g>
        </svg>
      );

    case 'deepseek':
      // DeepSeek sleek geometric wave/whale mark
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#4D6BFE" />
          <path
            d="M5.5 13.5C6.8 9.2 10.4 7.2 14.2 8.2C16.2 8.7 17.6 10.1 18.7 11.7C17.5 11.4 16.4 11.7 15.6 12.5C16.4 14.5 15.2 16.8 12.2 17.2C8.9 17.6 6.2 15.9 5.5 13.5Z"
            fill="#FFFFFF"
          />
          <circle cx="12.6" cy="11.2" r="1.15" fill="#4D6BFE" />
        </svg>
      );

    case 'obsidian':
      // Obsidian purple faceted crystal gem
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#7C3AED" />
          <polygon points="12.4,4.2 18.1,9.3 15.6,19.4 8.3,17.8 6.2,10.9" fill="#DDD6FE" />
          <polygon points="12.4,4.2 18.1,9.3 11.6,12.8 6.2,10.9" fill="#FFFFFF" />
          <polygon points="18.1,9.3 15.6,19.4 11.6,12.8" fill="#A78BFA" />
        </svg>
      );

    case 'mcp':
      // Model Context Protocol bridge/plug connector
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#0B253A" />
          <g stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="8.5" r="2" fill="#38BDF8" stroke="none" />
            <circle cx="7" cy="15.5" r="2" fill="#38BDF8" stroke="none" />
            <circle cx="17.2" cy="12" r="2.2" fill="#FFFFFF" stroke="none" />
            <path d="M9 8.5H12.2L15 12M9 15.5H12.2L15 12" />
          </g>
        </svg>
      );

    case 'sheets':
      // Google Sheets / CSV green grid icon
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#0F9D58" />
          <rect x="6" y="6.5" width="12" height="11" rx="1.5" stroke="#FFFFFF" strokeWidth="1.6" />
          <line x1="6" y1="10.2" x2="18" y2="10.2" stroke="#FFFFFF" strokeWidth="1.4" />
          <line x1="6" y1="13.8" x2="18" y2="13.8" stroke="#FFFFFF" strokeWidth="1.4" />
          <line x1="11" y1="6.5" x2="11" y2="17.5" stroke="#FFFFFF" strokeWidth="1.4" />
        </svg>
      );

    case 'markdown':
      // Markdown M-down standard emblem
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#334155" />
          <path
            d="M5.5 16V8.5L8.6 12.2L11.7 8.5V16"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 8.5V15.5M14.3 13.3L16.5 15.6L18.7 13.3"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'github':
      // GitHub git branch / repository emblem
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#24292F" />
          <circle cx="8.5" cy="7.5" r="2" stroke="#FFFFFF" strokeWidth="1.7" />
          <circle cx="8.5" cy="16.5" r="2" stroke="#FFFFFF" strokeWidth="1.7" />
          <circle cx="16" cy="10" r="2" stroke="#FFFFFF" strokeWidth="1.7" />
          <path d="M8.5 9.5V14.5M16 12C16 14 14 14.5 10.5 14.5" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );

    case 'skillmd':
      // SKILL.md verified blueprint badge
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#0284C7" />
          <path
            d="M7 6.5H14.5L17.5 9.5V17.5H7V6.5Z"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 13L11.3 14.8L15 11"
            stroke="#FDE047"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'aistudio':
      // Google AI Studio spark + code emblem
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#2563EB" />
          <path
            d="M8.5 8.5L5.2 12L8.5 15.5M15.5 8.5L18.8 12L15.5 15.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2C12.3 10.3 13.7 11.7 15.8 12C13.7 12.3 12.3 13.7 12 15.8C11.7 13.7 10.3 12.3 8.2 12C10.3 11.7 11.7 10.3 12 8.2Z"
            fill="#FDE047"
          />
        </svg>
      );

    case 'cursor':
      // Cursor 3D isometric pointer cube
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="5.5" fill="#111827" />
          <polygon points="12,4.5 18.8,8.4 18.8,15.6 12,19.5 5.2,15.6 5.2,8.4" stroke="#FFFFFF" strokeWidth="1.4" />
          <polygon points="12,4.5 18.8,8.4 12,12.2 5.2,8.4" fill="#FFFFFF" fillOpacity="0.9" />
          <polygon points="12,12.2 18.8,8.4 18.8,15.6 12,19.5" fill="#38BDF8" fillOpacity="0.85" />
        </svg>
      );
  }
};

export const AiToolChip: React.FC<{
  toolId: AiToolId;
  size?: 'xs' | 'sm';
}> = ({ toolId, size = 'sm' }) => {
  const meta = AI_TOOL_META[toolId];
  if (!meta) return null;

  if (size === 'xs') {
    return (
      <span
        dir="ltr"
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] border ${meta.bgClass} ${meta.borderClass} ${meta.textClass} text-[8.8px] font-extrabold font-latin leading-none whitespace-nowrap`}
      >
        <AiToolLogoSvg toolId={toolId} className="w-3.5 h-3.5 shrink-0" />
        <span>{meta.label}</span>
      </span>
    );
  }

  return (
    <span
      dir="ltr"
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${meta.bgClass} ${meta.borderClass} ${meta.textClass} text-[11px] font-extrabold font-latin leading-none whitespace-nowrap shadow-[0_1px_0_rgba(15,23,42,0.04)]`}
    >
      <AiToolLogoSvg toolId={toolId} className="w-4 h-4 shrink-0" />
      <span>{meta.label}</span>
    </span>
  );
};

export const AiToolBadgeList: React.FC<{
  toolIds: AiToolId[];
  size?: 'xs' | 'sm';
}> = ({ toolIds, size = 'sm' }) => {
  return (
    <div
      className={`flex flex-wrap items-center ${size === 'xs' ? 'gap-1' : 'gap-1.5'}`}
      dir="ltr"
    >
      {toolIds.map((id) => (
        <AiToolChip key={id} toolId={id} size={size} />
      ))}
    </div>
  );
};
