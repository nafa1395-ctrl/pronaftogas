import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Anchor,
  Building2,
  CalendarClock,
  Check,
  ClipboardCheck,
  Copy,
  Cpu,
  FileText,
  Flame,
  Globe2,
  HardHat,
  Layers,
  Pickaxe,
  RotateCcw,
  RotateCw,
  Zap,
} from 'lucide-react';
import {
  KHATAM_PROPOSALS,
  KhatamProposalDocument,
} from '../data/khatamProposalsData';
import {
  OIL_GAS_EXEC_25H_ID,
  OIL_GAS_EXEC_25H_PROPOSAL,
} from '../data/oilGasExecProposalData';

interface KhatamCircularHubPortalProps {
  proposals?: KhatamProposalDocument[];
  selectedProposalId: string;
  onSelectProposalAndOpen: (
    proposalId: string,
    targetMode: 'interactive' | 'brochure' | 'protocol'
  ) => void;
  onFocusProposal: (proposalId: string) => void;
}

interface OrbitalNodeConfig {
  id: string;
  angleDeg: number;
  shortTitle: string;
  subLabel: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ORBITAL_NODES_8: OrbitalNodeConfig[] = [
  {
    id: 'khatam-02',
    angleDeg: -90, // Top (12 o'clock)
    shortTitle: 'ستاد مرکز و معاونت‌ها',
    subLabel: 'پروپوزال ۲ · معاونت‌های ستادی قرارگاه (۹۶ ساعت)',
    badgeColor: '#0284C7',
    icon: Building2,
  },
  {
    id: 'khatam-03',
    angleDeg: -45, // Top-Right (1:30)
    shortTitle: 'هلدینگ نفت، گاز و پتروشیمی',
    subLabel: 'پروپوزال ۳ · پالایشگاه و پتروشیمی (۹۶ ساعت)',
    badgeColor: '#0369A1',
    icon: Flame,
  },
  {
    id: 'khatam-04',
    angleDeg: 0, // Right (3 o'clock)
    shortTitle: 'هلدینگ راه و شهرسازی',
    subLabel: 'پروپوزال ۴ · کریدورهای ریلی و تونل‌سازی',
    badgeColor: '#0D9488',
    icon: HardHat,
  },
  {
    id: 'khatam-05',
    angleDeg: 45, // Bottom-Right (4:30)
    shortTitle: 'هلدینگ نیرو (آب، برق و کشاورزی)',
    subLabel: 'پروپوزال ۵ · سدسازی، نیروگاه و انتقال آب',
    badgeColor: '#059669',
    icon: Zap,
  },
  {
    id: 'khatam-06',
    angleDeg: 90, // Bottom (6 o'clock)
    shortTitle: 'هلدینگ تخصصی دریایی',
    subLabel: 'پروپوزال ۶ · سازه‌های دریایی و بنادر',
    badgeColor: '#2563EB',
    icon: Anchor,
  },
  {
    id: 'khatam-07',
    angleDeg: 135, // Bottom-Left (7:30)
    shortTitle: 'هلدینگ صنعت و معدن',
    subLabel: 'پروپوزال ۷ · فولاد، مس، طلا و زغال‌سنگ',
    badgeColor: '#D97706',
    icon: Pickaxe,
  },
  {
    id: 'khatam-08',
    angleDeg: 180, // Left (9 o'clock)
    shortTitle: 'هلدینگ فناوری اطلاعات و ارتباطات',
    subLabel: 'پروپوزال ۸ · ارتباطات، فیبر نوری و دیتاسنتر',
    badgeColor: '#4F46E5',
    icon: Cpu,
  },
  {
    id: 'khatam-09',
    angleDeg: -135, // Top-Left (10:30)
    shortTitle: 'هلدینگ تخصصی برون‌مرزی',
    subLabel: 'پروپوزال ۹ · صدور خدمات مهندسی و فیدیک',
    badgeColor: '#7C3AED',
    icon: Globe2,
  },
];

function shortestTargetAngle(targetDeg: number, currentDeg: number): number {
  const diff = ((((targetDeg - currentDeg) % 360) + 540) % 360) - 180;
  return currentDeg + diff;
}

function getTopNodeForAngle(wheelAngleDeg: number): {
  node: OrbitalNodeConfig;
  snappedAngle: number;
} {
  const stepIndex = Math.round(-wheelAngleDeg / 45);
  const normalizedIdx = ((stepIndex % 8) + 8) % 8;
  return {
    node: ORBITAL_NODES_8[normalizedIdx],
    snappedAngle: -stepIndex * 45,
  };
}

export const KhatamCircularHubPortal: React.FC<
  KhatamCircularHubPortalProps
> = ({
  proposals = KHATAM_PROPOSALS,
  selectedProposalId,
  onSelectProposalAndOpen,
  onFocusProposal,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [wheelAngleDeg, setWheelAngleDeg] = useState<number>(() => {
    const idx = ORBITAL_NODES_8.findIndex((n) => n.id === selectedProposalId);
    return idx >= 0 ? -idx * 45 : 0;
  });
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [copiedSpecialLink, setCopiedSpecialLink] = useState<boolean>(false);

  const handleCopySpecialCourseLink = () => {
    const shareUrl =
      typeof window !== 'undefined' &&
      !window.location.protocol.startsWith('tauri') &&
      window.location.hostname !== 'tauri.localhost'
        ? `${window.location.origin}${window.location.pathname}?proposal=${OIL_GAS_EXEC_25H_ID}&view=brochure`
        : OIL_GAS_EXEC_25H_PROPOSAL.githubPagesUrl;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedSpecialLink(true);
    setTimeout(() => setCopiedSpecialLink(false), 2200);
  };

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const wheelAngleRef = useRef<number>(wheelAngleDeg);
  wheelAngleRef.current = wheelAngleDeg;

  const animFrameRef = useRef<number | null>(null);

  const spinRef = useRef<{
    active: boolean;
    moved: boolean;
    centerX: number;
    centerY: number;
    startX: number;
    startY: number;
    lastPointerAngleDeg: number;
    clickedNodeId?: string;
  }>({
    active: false,
    moved: false,
    centerX: 0,
    centerY: 0,
    startX: 0,
    startY: 0,
    lastPointerAngleDeg: 0,
  });

  const activeId = hoveredId || selectedProposalId || 'khatam-01';
  const activeProposal: KhatamProposalDocument =
    proposals.find((p) => p.id === activeId) || proposals[0];

  const commandProposal = proposals[0]; // khatam-01

  // Smooth circular-arc interpolation via requestAnimationFrame so cards orbit cleanly along the ring
  const animateWheelTo = useCallback((targetDeg: number) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startDeg = wheelAngleRef.current;
    const delta = targetDeg - startDeg;
    if (Math.abs(delta) < 0.25) {
      wheelAngleRef.current = targetDeg;
      setWheelAngleDeg(targetDeg);
      return;
    }

    const durationMs = 300;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const nextAngle = startDeg + delta * eased;
      wheelAngleRef.current = nextAngle;
      setWheelAngleDeg(nextAngle);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const rotateBySteps = useCallback(
    (stepDelta: number) => {
      const currentSnap = Math.round(wheelAngleRef.current / 45) * 45;
      const targetDeg = currentSnap + stepDelta * 45;
      const { node } = getTopNodeForAngle(targetDeg);
      animateWheelTo(targetDeg);
      onFocusProposal(node.id);
    },
    [animateWheelTo, onFocusProposal]
  );

  const startHubSpin = (e: React.PointerEvent, clickedNodeId?: string) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    e.preventDefault();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pointerAngleDeg =
      (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;

    spinRef.current = {
      active: true,
      moved: false,
      centerX,
      centerY,
      startX: e.clientX,
      startY: e.clientY,
      lastPointerAngleDeg: pointerAngleDeg,
      clickedNodeId,
    };
    setIsSpinning(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!spinRef.current.active) return;

      const dist = Math.hypot(
        e.clientX - spinRef.current.startX,
        e.clientY - spinRef.current.startY
      );
      if (dist > 8) {
        spinRef.current.moved = true;
      }

      const currentPointerAngleDeg =
        (Math.atan2(
          e.clientY - spinRef.current.centerY,
          e.clientX - spinRef.current.centerX
        ) *
          180) /
        Math.PI;

      let deltaDeg =
        currentPointerAngleDeg - spinRef.current.lastPointerAngleDeg;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;
      spinRef.current.lastPointerAngleDeg = currentPointerAngleDeg;

      if (spinRef.current.moved) {
        const nextAngle = wheelAngleRef.current + deltaDeg;
        wheelAngleRef.current = nextAngle;
        setWheelAngleDeg(nextAngle);
        const { node } = getTopNodeForAngle(nextAngle);
        setHoveredId(node.id);
        onFocusProposal(node.id);
      }
    };

    const handlePointerUp = () => {
      if (!spinRef.current.active) return;
      const wasMoved = spinRef.current.moved;
      const clickedId = spinRef.current.clickedNodeId;

      spinRef.current.active = false;
      spinRef.current.moved = false;
      spinRef.current.clickedNodeId = undefined;
      setIsSpinning(false);
      setHoveredId(null);

      if (wasMoved) {
        const { node, snappedAngle } = getTopNodeForAngle(
          wheelAngleRef.current
        );
        animateWheelTo(snappedAngle);
        onFocusProposal(node.id);
      } else if (clickedId) {
        const idx = ORBITAL_NODES_8.findIndex((n) => n.id === clickedId);
        if (idx >= 0) {
          const targetDeg = shortestTargetAngle(-idx * 45, wheelAngleRef.current);
          const alreadyTop = Math.abs(targetDeg - wheelAngleRef.current) < 4;
          if (alreadyTop && selectedProposalId === clickedId) {
            onSelectProposalAndOpen(clickedId, 'brochure');
          } else {
            animateWheelTo(targetDeg);
            onFocusProposal(clickedId);
          }
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [
    animateWheelTo,
    onFocusProposal,
    onSelectProposalAndOpen,
    selectedProposalId,
  ]);

  // Geometry constants for the 820x820 radial canvas
  const canvasSize = 820;
  const center = canvasSize / 2; // 410
  const orbitRadius = 285;

  return (
    <main className="no-print flex-1 bg-[#F8F7F4]">
      {/* ==================== 1. RADIAL COMMAND HERO & CIRCULAR ECOSYSTEM MAP ==================== */}
      <section className="relative bg-gradient-to-b from-[#071928] via-[#0B253A] to-[#13334C] text-white overflow-hidden border-b border-white/15">
        {/* Subtle Architectural Grid Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, #37A3DC 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 py-10 lg:py-14 space-y-10">
          {/* Top Executive Title Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-sky-300 font-semibold">
                <span>درگاه متمرکز و یکپارچه پروپوزال‌های ۹گانه PMI-CPMAI v8</span>
                <span aria-hidden="true">·</span>
                <span>معماری آبشاری ۳ سطحی</span>
                <span aria-hidden="true">·</span>
                <span>شرکت مشاوران مدیریت کسب و کار اوج</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                منظومه جامع استقرار استاندارد جهانی مدیریت پروژه‌های هوش مصنوعی (PMI-CPMAI v8) در قرارگاه سازندگی خاتم‌الانبیاء (ص)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                در این پرتال متمرکز، کمیته ارشد فرماندهی عالی و شورای عالی (پروپوزال شماره ۱) در هسته مرکزی دایره حکمرانی قرار داشته و ستاد قرب مرکز به همراه ۷ هلدینگ تخصصی (پروپوزال‌های ۲ تا ۹) در مدار پیرامونی آن چیده شده‌اند. می‌توانید حلقه دایره‌ای را بچرخانید یا با کلیک روی هر گره، مستقیم وارد پروپوزال تعاملی و ایبوک ۲۲ صفحه‌ای آن شوید.
              </p>
            </div>

            {/* Summary Metrics Box */}
            <div className="shrink-0 grid grid-cols-3 gap-3 bg-white/5 border border-white/15 rounded-2xl p-4 text-center">
              <div className="px-3 space-y-0.5 border-l border-white/10">
                <span className="text-2xl font-black text-[#37A3DC] block tabular-nums">
                  ۹
                </span>
                <span className="text-[11px] text-slate-300 block">
                  پروپوزال تخصصی یکپارچه
                </span>
              </div>
              <div className="px-3 space-y-0.5 border-l border-white/10">
                <span className="text-2xl font-black text-amber-400 block tabular-nums">
                  ۳
                </span>
                <span className="text-[11px] text-slate-300 block">
                  سطح حکمرانی و اجرا
                </span>
              </div>
              <div className="px-3 space-y-0.5">
                <span className="text-2xl font-black text-emerald-400 block tabular-nums">
                  ۶ فاز
                </span>
                <span className="text-[11px] text-slate-300 block">
                  استاندارد آموزشی CPMAI
                </span>
              </div>
            </div>
          </div>

          {/* Main Interactive Split: Right/Center = Rotatable 360° Radial Hub Diagram | Left = Live Selected Proposal Inspector */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            {/* ==================== ROTATABLE CIRCULAR / RADIAL 9-NODE DIAGRAM (7 COLS ON XL) ==================== */}
            <div className="xl:col-span-7 flex flex-col items-center justify-center">
              {/* Desktop/Tablet Rotatable Radial Canvas */}
              <div className="hidden md:flex flex-col items-center justify-center w-full overflow-visible py-2">
                <div
                  ref={canvasRef}
                  onPointerDown={(e) => startHubSpin(e)}
                  className={`relative select-none shrink-0 touch-none ${
                    isSpinning ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
                >
                  {/* SVG Concentric Orbital Rings & Radial Connecting Spokes */}
                  <svg
                    viewBox={`0 0 ${canvasSize} ${canvasSize}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <defs>
                      <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#37A3DC" stopOpacity="0.28" />
                        <stop offset="65%" stopColor="#0284C7" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#0B253A" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Ambient Center Glow */}
                    <circle
                      cx={center}
                      cy={center}
                      r={360}
                      fill="url(#hubGlow)"
                    />

                    {/* Fixed 12-o'clock Active Locator Pointer */}
                    <polygon
                      points={`${center},58 ${center - 7},44 ${center + 7},44`}
                      fill="#FBBF24"
                      opacity="0.9"
                    />

                    {/* Rotating Rings & Radial Spokes */}
                    <g
                      style={{
                        transform: `rotate(${wheelAngleDeg}deg)`,
                        transformOrigin: `${center}px ${center}px`,
                      }}
                    >
                      {/* Outer Decorative Dashed Ring */}
                      <circle
                        cx={center}
                        cy={center}
                        r={345}
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.2"
                        strokeDasharray="4 8"
                      />

                      {/* Primary Main Dashed Orbit Ring (r = 285) */}
                      <circle
                        cx={center}
                        cy={center}
                        r={orbitRadius}
                        fill="none"
                        stroke="rgba(55,163,220,0.52)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />

                      {/* Inner Command Halo Dashed Ring (r = 148) */}
                      <circle
                        cx={center}
                        cy={center}
                        r={148}
                        fill="none"
                        stroke="rgba(251,191,36,0.45)"
                        strokeWidth="1.5"
                        strokeDasharray="5 5"
                      />

                      {/* 8 Radial Dashed Spokes from Center (410,410) to Each of the 8 Surrounding Nodes */}
                      {ORBITAL_NODES_8.map((node) => {
                        const rad = (node.angleDeg * Math.PI) / 180;
                        const x2 = center + orbitRadius * Math.cos(rad);
                        const y2 = center + orbitRadius * Math.sin(rad);
                        const isNodeActive = activeId === node.id;

                        return (
                          <g key={node.id}>
                            <line
                              x1={center}
                              y1={center}
                              x2={x2}
                              y2={y2}
                              stroke={
                                isNodeActive
                                  ? '#38BDF8'
                                  : 'rgba(125, 211, 252, 0.28)'
                              }
                              strokeWidth={isNodeActive ? '3' : '1.5'}
                              strokeDasharray={isNodeActive ? 'none' : '4 4'}
                            />
                            <circle
                              cx={center + orbitRadius * 0.56 * Math.cos(rad)}
                              cy={center + orbitRadius * 0.56 * Math.sin(rad)}
                              r={isNodeActive ? 4.5 : 3}
                              fill={isNodeActive ? '#FBBF24' : '#37A3DC'}
                            />
                          </g>
                        );
                      })}
                    </g>
                  </svg>

                  {/* ==================== CENTER NUCLEUS: PROPOSAL #1 (NO CROWN ICON) ==================== */}
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() =>
                      onSelectProposalAndOpen('khatam-01', 'brochure')
                    }
                    onMouseEnter={() => {
                      if (!spinRef.current.active) {
                        setHoveredId('khatam-01');
                        onFocusProposal('khatam-01');
                      }
                    }}
                    onMouseLeave={() => {
                      if (!spinRef.current.active) setHoveredId(null);
                    }}
                    style={{
                      left: `${center}px`,
                      top: `${center}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 w-[248px] h-[248px] rounded-full p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                      activeId === 'khatam-01'
                        ? 'bg-gradient-to-b from-[#1E3A5F] via-[#0F2942] to-[#091929] border-2 border-dashed border-amber-400 shadow-[0_0_45px_rgba(251,191,36,0.35)] scale-[1.03]'
                        : 'bg-gradient-to-b from-[#16324F] to-[#0B2136] border-2 border-dashed border-[#37A3DC]/80 hover:border-amber-400 shadow-2xl'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold text-amber-300 tracking-wide">
                      هسته مرکزی · پروپوزال شماره ۱
                    </span>
                    <h3 className="text-[15px] font-black text-white leading-snug mt-2">
                      شورای عالی و فرماندهی قرارگاه سازندگی خاتم‌الانبیاء (ص)
                    </h3>
                    <p className="text-[11px] text-sky-200 mt-1.5 leading-tight">
                      ایبوک ۲۲ صفحه‌ای · ۹۶ ساعت
                    </p>

                    <div className="mt-3.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProposalAndOpen('khatam-01', 'brochure');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10.5px] font-black transition-colors cursor-pointer"
                      >
                        ایبوک ۲۲ صفحه‌ای
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProposalAndOpen('khatam-01', 'interactive');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>نمای وب</span>
                      </button>
                    </div>
                  </div>

                  {/* ==================== 8 SURROUNDING ORBITAL NODES (ROTATING SMOOTHLY ALONG RING) ==================== */}
                  {ORBITAL_NODES_8.map((node) => {
                    const proposalObj = proposals.find(
                      (p) => p.id === node.id
                    );
                    if (!proposalObj) return null;

                    const effectiveDeg = node.angleDeg + wheelAngleDeg;
                    const rad = (effectiveDeg * Math.PI) / 180;
                    const x = center + orbitRadius * Math.cos(rad);
                    const y = center + orbitRadius * Math.sin(rad);
                    const isSelected = activeId === node.id;
                    const IconComp = node.icon;

                    return (
                      <div
                        key={node.id}
                        onPointerDown={(e) => startHubSpin(e, node.id)}
                        onMouseEnter={() => {
                          if (!spinRef.current.active) {
                            setHoveredId(node.id);
                            onFocusProposal(node.id);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!spinRef.current.active) setHoveredId(null);
                        }}
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute z-20 w-[196px] rounded-2xl p-3 text-right transition-colors duration-200 ${
                          isSpinning ? 'cursor-grabbing' : 'cursor-grab'
                        } ${
                          isSelected
                            ? 'bg-white text-[#0B253A] border-2 border-[#37A3DC] shadow-[0_0_30px_rgba(55,163,220,0.45)] z-30'
                            : 'bg-[#0F2942]/95 hover:bg-[#163859] text-white border border-white/20 shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-extrabold ${
                              isSelected ? 'text-[#0284C7]' : 'text-[#7DD3FC]'
                            }`}
                          >
                            پروپوزال شماره {proposalObj.proposalNum} · ۲۲ صفحه
                          </span>
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white"
                            style={{ backgroundColor: node.badgeColor }}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <h4
                          className={`text-xs font-black leading-snug ${
                            isSelected ? 'text-[#0B253A]' : 'text-white'
                          }`}
                        >
                          {node.shortTitle}
                        </h4>

                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isSelected ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {node.subLabel}
                        </p>

                        <div
                          className={`mt-2 pt-1.5 border-t flex items-center justify-between gap-1 ${
                            isSelected ? 'border-slate-200' : 'border-white/10'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProposalAndOpen(node.id, 'brochure');
                            }}
                            className={`text-[10px] font-extrabold cursor-pointer hover:underline ${
                              isSelected ? 'text-[#0284C7]' : 'text-sky-300'
                            }`}
                          >
                            ایبوک ۲۲ صفحه‌ای ↙
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProposalAndOpen(node.id, 'interactive');
                            }}
                            className={`text-[9.5px] font-bold flex items-center gap-0.5 hover:underline cursor-pointer ${
                              isSelected ? 'text-slate-600' : 'text-slate-300'
                            }`}
                          >
                            <span>نمای وب</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tactile Rotary Spin Controls Under Big Wheel */}
                <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => rotateBySteps(1)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#37A3DC] border border-dashed border-sky-300/60 text-sky-100 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>چرخش ساعت‌گرد</span>
                  </button>
                  <span className="text-[11px] text-slate-300 hidden sm:inline">
                    حلقه یا کارت‌ها را با ماوس بگیرید و بچرخانید
                  </span>
                  <button
                    type="button"
                    onClick={() => rotateBySteps(-1)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#37A3DC] border border-dashed border-sky-300/60 text-sky-100 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>چرخش پادساعت‌گرد</span>
                  </button>
                </div>
              </div>

              {/* Mobile / Small Screen Fallback for Radial Wheel */}
              <div className="md:hidden w-full space-y-3">
                <div
                  onClick={() => onFocusProposal('khatam-01')}
                  className="rounded-2xl bg-gradient-to-l from-[#1E3A5F] to-[#0F2942] border-2 border-dashed border-amber-400 p-4 text-center space-y-2"
                >
                  <span className="text-xs font-extrabold text-amber-300 block">
                    هسته مرکزی دایره · پروپوزال شماره ۱
                  </span>
                  <h3 className="text-base font-black text-white">
                    {commandProposal.recipientShortOnCover}
                  </h3>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectProposalAndOpen('khatam-01', 'brochure')
                      }
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold"
                    >
                      ایبوک ۲۲ صفحه‌ای
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onSelectProposalAndOpen('khatam-01', 'interactive')
                      }
                      className="px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-bold"
                    >
                      نمای وب تعاملی
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ORBITAL_NODES_8.map((node) => {
                    const p = proposals.find((x) => x.id === node.id)!;
                    return (
                      <div
                        key={node.id}
                        onClick={() => onFocusProposal(node.id)}
                        className="rounded-xl bg-white/10 border border-white/15 p-3 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] text-sky-300 font-bold block">
                            پروپوزال {p.proposalNum}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {node.shortTitle}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onSelectProposalAndOpen(node.id, 'interactive')
                          }
                          className="px-2.5 py-1 rounded bg-[#37A3DC] text-white text-[10px] font-bold"
                        >
                          باز کردن
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ==================== LEFT COLUMN IN RTL: LIVE SELECTED PROPOSAL INSPECTOR (5 COLS ON XL) ==================== */}
            <div className="xl:col-span-5">
              <div className="rounded-2xl bg-white text-[#0F172A] border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-extrabold text-[#0284C7] block">
                      پیش‌نمایش زنده گره انتخاب‌شده در دایره حکمرانی
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B253A] mt-0.5">
                      پروپوزال شماره {activeProposal.proposalNum}:{' '}
                      {activeProposal.recipientShortOnCover}
                    </h2>
                  </div>
                  <span className="text-xs font-mono-num font-bold text-slate-500 shrink-0">
                    {activeProposal.letterNumber}
                  </span>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-500 block">سطح سازمانی و ظرفیت</span>
                    <strong className="text-[#0B253A] font-extrabold block">
                      {activeProposal.investment.capacity}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-500 block">مدت زمان کارگاه</span>
                    <strong className="text-[#0B253A] font-extrabold block">
                      {activeProposal.totalHours} ({activeProposal.sessionsFormat})
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-500 block">نرخ حق‌الزحمه تدریس (ساعتی)</span>
                    <strong className="text-[#0284C7] font-black block">
                      {activeProposal.investment.totalAmount}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-500 block">صرفه‌جویی سالانه (ROI)</span>
                    <strong className="text-emerald-700 font-extrabold block truncate">
                      {activeProposal.roiAnalysis.annualSavings}
                    </strong>
                  </div>
                </div>

                {/* Subject & Lead */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="font-bold text-[#1D4760]">
                    موضوع: {activeProposal.subject}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify line-clamp-4">
                    {activeProposal.executiveLead}
                  </p>
                </div>

                {/* Key Strategic Domains under this node */}
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-[#1D4760] block">
                    محورهای تخصصی و حوزه‌های راهبردی مورد تمرکز:
                  </span>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {activeProposal.keyEntitiesAndSites.slice(0, 5).join(' · ')}
                  </div>
                </div>

                {/* Direct In-App Navigation CTAs (No Raw External URL Box) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectProposalAndOpen(activeProposal.id, 'brochure')
                    }
                    className="py-3.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>مشاهده ایبوک ۲۲ صفحه‌ای (A4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectProposalAndOpen(activeProposal.id, 'interactive')
                    }
                    className="py-3.5 px-4 rounded-xl bg-[#1D4760] hover:bg-[#0B253A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Layers className="w-4 h-4 text-[#37A3DC]" />
                    <span>ورود به نمای وب تعاملی پروپوزال</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 1.5 STANDALONE SPECIAL COURSE & EXECUTION PROTOCOL BANNER ==================== */}
      <section className="pt-12 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10">
        <div className="rounded-2xl bg-gradient-to-l from-[#091E30] via-[#12334D] to-[#1B4662] text-white border border-sky-400/25 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-amber-300">
                <CalendarClock className="w-4 h-4 shrink-0" />
                <span>دوره مستقل اجرایی (لینک مجزا)</span>
                <span aria-hidden="true" className="text-sky-400">·</span>
                <span className="text-sky-200">
                  ۱۰ جلسه ۲.۵ ساعته (۲۵ ساعت) · دوشنبه‌ها ۰۷:۰۰ الی ۰۹:۳۰ صبح
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                پروپوزال مستقل ترکیبی مدیران مؤسسات و شرکت‌های تابعه هلدینگ نفت، گاز و پتروشیمی (۱۲.۵ ساعت متدولوژی + ۱۲.۵ ساعت ابزار AI)
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
                <strong className="text-amber-300">هدف محوری دوره:</strong>{' '}
                {OIL_GAS_EXEC_25H_PROPOSAL.executiveGoalStatement}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-sky-200 pt-1">
                <span>در هر جلسه ۲.۵ ساعته: اول ۱.۲۵س متدولوژی (هوش مصنوعی چیست؟، کاربردهای AI، بهترین شیوه‌های پیاده‌سازی)</span>
                <span aria-hidden="true">·</span>
                <span>سپس ۱.۲۵س ابزارهای AI (LLM، RCTO، NotebookLM، Gems/Projects، داشبورد بدون کد، SKILL.md و MCP)</span>
                <span aria-hidden="true">·</span>
                <span>همراه با پروتکل مستقل آغاز دوره (قابل چاپ و PDF)</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onSelectProposalAndOpen(OIL_GAS_EXEC_25H_ID, 'brochure')
                  }
                  className="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>مشاهده ایبوک پروپوزال ۲۵ ساعته (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSelectProposalAndOpen(OIL_GAS_EXEC_25H_ID, 'interactive')
                  }
                  className="py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#37A3DC] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>نمای وب تعاملی (جدول ۱۰ جلسه و تمرین‌های کارگاهی)</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onSelectProposalAndOpen(OIL_GAS_EXEC_25H_ID, 'protocol')
                  }
                  className="py-2.5 px-3 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>پروتکل برگزاری (چاپ / PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySpecialCourseLink}
                  className="py-2.5 px-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSpecialLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>لینک کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      <span>کپی لینک مجزا</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. COMPLETE DIRECTORY OF ALL 9 PROPOSALS (CLEAN IN-APP NAVIGATION) ==================== */}
      <section className="py-14 lg:py-18 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[#0284C7]">
              فهرست جامع ۹ پروپوزال اختصاصی (نسخه ۲۲ صفحه‌ای و وب تعاملی)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A]">
              ورود مستقیم به هر ۹ پروپوزال قرارگاه سازندگی خاتم‌الانبیاء (ص)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            هر پروپوزال دارای ایبوک ۲۲ صفحه‌ای استاندارد چاپ A4 (شامل رزومه ۳ صفحه‌ای شرکت و ۴ صفحه‌ای مدرس/کوچ‌ها) و نمای وب تعاملی است
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((prop) => {
            const isTier1 = prop.tierLevel === 1;
            const isTier2 = prop.tierLevel === 2;

            return (
              <div
                key={prop.id}
                className={`rounded-2xl bg-white border p-6 flex flex-col justify-between space-y-5 transition-all hover:shadow-lg ${
                  isTier1
                    ? 'border-amber-400 ring-1 ring-amber-300/50'
                    : isTier2
                      ? 'border-[#0284C7]'
                      : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Metadata Line (Unboxed clean text) */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2.5 border-b border-slate-100">
                    <span className="font-extrabold text-[#1D4760]">
                      پروپوزال شماره {prop.proposalNum} · سطح {prop.tierLevel} (۲۲ صفحه A4)
                    </span>
                    <span className="font-mono-num">{prop.letterNumber}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#0B253A] leading-snug">
                    {prop.recipientShortOnCover}
                  </h3>

                  <p className="text-xs font-bold text-[#0284C7] leading-relaxed">
                    {prop.tierBadge}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed text-justify line-clamp-3">
                    {prop.executiveLead}
                  </p>

                  {/* Metrics inline */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="text-slate-500">
                      مدت دوره: <strong className="text-slate-800">{prop.totalHours}</strong>
                    </span>
                    <span className="font-extrabold text-[#0284C7]">
                      {prop.investment.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Bottom Direct In-App Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectProposalAndOpen(prop.id, 'brochure')
                    }
                    className="py-2.5 px-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ایبوک ۲۲ صفحه</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectProposalAndOpen(prop.id, 'interactive')
                    }
                    className="py-2.5 px-3 rounded-xl bg-[#1D4760] hover:bg-[#0B253A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#37A3DC]" />
                    <span>نمای تعاملی</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
