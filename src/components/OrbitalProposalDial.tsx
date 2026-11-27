import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Anchor,
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  FileText,
  Flame,
  Globe2,
  HardHat,
  Layers,
  Minimize2,
  Move,
  Pickaxe,
  ScanSearch,
  X,
  Zap,
} from 'lucide-react';
import { KhatamProposalDocument } from '../data/khatamProposalsData';

interface OrbitalProposalDialProps {
  proposals: KhatamProposalDocument[];
  activeProposalId: string;
  viewMode: 'interactive' | 'brochure';
  onSelectProposal: (proposalId: string) => void;
  onOpenHub: () => void;
  onToggleViewMode: (mode: 'interactive' | 'brochure') => void;
  isSpotlightActive?: boolean;
  onToggleSpotlight?: () => void;
  onClose?: () => void;
}

interface NodeMeta {
  id: string;
  angleDeg: number;
  shortTitle: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DIAL_ORBITAL_NODES: NodeMeta[] = [
  {
    id: 'khatam-02',
    angleDeg: -90,
    shortTitle: 'ستاد مرکز و معاونت‌ها',
    color: '#0EA5E9',
    icon: Building2,
  },
  {
    id: 'khatam-03',
    angleDeg: -45,
    shortTitle: 'نفت، گاز و پتروشیمی',
    color: '#38BDF8',
    icon: Flame,
  },
  {
    id: 'khatam-04',
    angleDeg: 0,
    shortTitle: 'راه و شهرسازی',
    color: '#14B8A6',
    icon: HardHat,
  },
  {
    id: 'khatam-05',
    angleDeg: 45,
    shortTitle: 'نیرو (آب، برق و کشاورزی)',
    color: '#10B981',
    icon: Zap,
  },
  {
    id: 'khatam-06',
    angleDeg: 90,
    shortTitle: 'هلدینگ تخصصی دریایی',
    color: '#3B82F6',
    icon: Anchor,
  },
  {
    id: 'khatam-07',
    angleDeg: 135,
    shortTitle: 'صنعت و معدن',
    color: '#F59E0B',
    icon: Pickaxe,
  },
  {
    id: 'khatam-08',
    angleDeg: 180,
    shortTitle: 'فناوری اطلاعات (سماوات)',
    color: '#818CF8',
    icon: Cpu,
  },
  {
    id: 'khatam-09',
    angleDeg: -135,
    shortTitle: 'هلدینگ برون‌مرزی',
    color: '#A78BFA',
    icon: Globe2,
  },
];

function shortestAngleTarget(targetDeg: number, currentDeg: number): number {
  const diff = ((((targetDeg - currentDeg) % 360) + 540) % 360) - 180;
  return currentDeg + diff;
}

function getOrbitalNodeAtAngle(wheelAngleDeg: number): {
  node: NodeMeta;
  snappedAngle: number;
} {
  const stepIndex = Math.round(-wheelAngleDeg / 45);
  const normalizedIdx = ((stepIndex % 8) + 8) % 8;
  return {
    node: DIAL_ORBITAL_NODES[normalizedIdx],
    snappedAngle: -stepIndex * 45,
  };
}

export const OrbitalProposalDial: React.FC<OrbitalProposalDialProps> = ({
  proposals,
  activeProposalId,
  viewMode,
  onSelectProposal,
  onOpenHub,
  onToggleViewMode,
  isSpotlightActive = false,
  onToggleSpotlight,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1080 : false
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 22, y: 22 });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelAngleDeg, setWheelAngleDeg] = useState<number>(() => {
    const idx = DIAL_ORBITAL_NODES.findIndex((n) => n.id === activeProposalId);
    return idx >= 0 ? -idx * 45 : 0;
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const dialAreaRef = useRef<HTMLDivElement | null>(null);
  const wheelAngleRef = useRef<number>(wheelAngleDeg);
  wheelAngleRef.current = wheelAngleDeg;

  const lastWheelAtRef = useRef<number>(0);

  const moveState = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    onClickIfStationary?: () => void;
  }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: 22,
    origY: 22,
  });

  const spinState = useRef<{
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

  const activeIndex = useMemo(() => {
    const idx = proposals.findIndex((p) => p.id === activeProposalId);
    return idx >= 0 ? idx : 0;
  }, [proposals, activeProposalId]);

  // Smoothly align wheel whenever activeProposalId changes externally
  useEffect(() => {
    if (spinState.current.active) return;
    const orbitalIdx = DIAL_ORBITAL_NODES.findIndex(
      (n) => n.id === activeProposalId
    );
    if (orbitalIdx >= 0) {
      const targetDeg = -orbitalIdx * 45;
      setWheelAngleDeg((prev) => shortestAngleTarget(targetDeg, prev));
    }
  }, [activeProposalId]);

  const selectOrbitalNode = useCallback(
    (nodeId: string) => {
      const idx = DIAL_ORBITAL_NODES.findIndex((n) => n.id === nodeId);
      if (idx >= 0) {
        setWheelAngleDeg((prev) => shortestAngleTarget(-idx * 45, prev));
      }
      onSelectProposal(nodeId);
    },
    [onSelectProposal]
  );

  const stepProposalRef = useRef<(delta: number) => void>(() => {});
  stepProposalRef.current = (delta: number) => {
    if (proposals.length === 0) return;
    const nextIdx = (activeIndex + delta + proposals.length) % proposals.length;
    const nextProp = proposals[nextIdx];
    const orbitalIdx = DIAL_ORBITAL_NODES.findIndex(
      (n) => n.id === nextProp.id
    );
    if (orbitalIdx >= 0) {
      setWheelAngleDeg((prev) => shortestAngleTarget(-orbitalIdx * 45, prev));
    }
    onSelectProposal(nextProp.id);
  };

  useEffect(() => {
    const clampPosition = (candidateX: number, candidateY: number) => {
      const panelW = panelRef.current?.offsetWidth || 224;
      const panelH = panelRef.current?.offsetHeight || 290;
      const maxX = Math.max(8, window.innerWidth - panelW - 8);
      const maxY = Math.max(8, window.innerHeight - panelH - 8);
      return {
        x: Math.min(Math.max(8, candidateX), maxX),
        y: Math.min(Math.max(8, candidateY), maxY),
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (moveState.current.active) {
        const dx = e.clientX - moveState.current.startX;
        const dy = moveState.current.startY - e.clientY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          moveState.current.moved = true;
        }
        if (moveState.current.moved) {
          setPos(
            clampPosition(
              moveState.current.origX + dx,
              moveState.current.origY + dy
            )
          );
        }
        return;
      }

      if (spinState.current.active) {
        const dist = Math.hypot(
          e.clientX - spinState.current.startX,
          e.clientY - spinState.current.startY
        );
        if (dist > 6) {
          spinState.current.moved = true;
        }

        const currentPointerAngleDeg =
          (Math.atan2(
            e.clientY - spinState.current.centerY,
            e.clientX - spinState.current.centerX
          ) *
            180) /
          Math.PI;

        let deltaDeg =
          currentPointerAngleDeg - spinState.current.lastPointerAngleDeg;
        if (deltaDeg > 180) deltaDeg -= 360;
        if (deltaDeg < -180) deltaDeg += 360;

        spinState.current.lastPointerAngleDeg = currentPointerAngleDeg;

        if (spinState.current.moved) {
          const nextAngle = wheelAngleRef.current + deltaDeg;
          wheelAngleRef.current = nextAngle;
          setWheelAngleDeg(nextAngle);
          const { node } = getOrbitalNodeAtAngle(nextAngle);
          setHoveredId(node.id);
        }
      }
    };

    const handlePointerUp = () => {
      if (moveState.current.active) {
        const wasMoved = moveState.current.moved;
        const cb = moveState.current.onClickIfStationary;
        moveState.current.active = false;
        moveState.current.moved = false;
        moveState.current.onClickIfStationary = undefined;
        setIsMoving(false);
        if (!wasMoved && cb) {
          cb();
        }
      }

      if (spinState.current.active) {
        const wasMoved = spinState.current.moved;
        const clickedId = spinState.current.clickedNodeId;
        spinState.current.active = false;
        spinState.current.moved = false;
        spinState.current.clickedNodeId = undefined;
        setIsSpinning(false);
        setHoveredId(null);

        if (wasMoved) {
          const { node, snappedAngle } = getOrbitalNodeAtAngle(
            wheelAngleRef.current
          );
          setWheelAngleDeg(snappedAngle);
          onSelectProposal(node.id);
        } else if (clickedId) {
          selectOrbitalNode(clickedId);
        }
      }
    };

    const handleResize = () => {
      setPos((prev) => clampPosition(prev.x, prev.y));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [onSelectProposal, selectOrbitalNode]);

  // Native non-passive wheel listener for smooth rotary stepping without page scroll
  useEffect(() => {
    const el = dialAreaRef.current;
    if (!el || isMinimized) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastWheelAtRef.current < 110) return;
      lastWheelAtRef.current = now;

      if (e.deltaY > 0 || e.deltaX > 0) {
        stepProposalRef.current(1);
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        stepProposalRef.current(-1);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [isMinimized]);

  const startMove = (e: React.PointerEvent, onClickIfStationary?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    moveState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      onClickIfStationary,
    };
    setIsMoving(true);
  };

  const startSpin = (e: React.PointerEvent, clickedNodeId?: string) => {
    const rect = dialAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pointerAngleDeg =
      (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;

    spinState.current = {
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

  const displayId = hoveredId || activeProposalId || 'khatam-01';
  const activeProposal = useMemo(
    () => proposals.find((p) => p.id === displayId) || proposals[0],
    [proposals, displayId]
  );
  const activeOrbitalMeta = useMemo(
    () => DIAL_ORBITAL_NODES.find((n) => n.id === displayId) || null,
    [displayId]
  );

  const dialSize = 224;
  const center = dialSize / 2;
  const orbitRadius = 78;

  const spinTransition = isSpinning
    ? 'none'
    : 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';

  // ==================== MINIMIZED FLOATING CIRCULAR ORB ====================
  if (isMinimized) {
    const CurrentIcon =
      DIAL_ORBITAL_NODES.find((n) => n.id === activeProposalId)?.icon || Compass;
    const currentNum =
      proposals.find((p) => p.id === activeProposalId)?.proposalNum || '۱';

    return (
      <div
        ref={panelRef}
        style={{
          left: `${pos.x}px`,
          bottom: `${pos.y}px`,
        }}
        className="no-print no-print-admin-ignore fixed z-40 select-none touch-none"
      >
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onPointerDown={(e) => startMove(e, () => setIsMinimized(false))}
            title={`پروپوزال ${currentNum} — برای باز کردن ولوم کلیک کنید یا برای جابجایی بکشید`}
            className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-[#0B253A]/95 via-[#113654]/95 to-[#071928]/95 border-2 border-dashed border-[#37A3DC] text-white shadow-[0_10px_28px_rgba(7,25,40,0.45)] flex flex-col items-center justify-center transition-transform duration-150 ${
              isMoving
                ? 'cursor-grabbing scale-105'
                : 'cursor-pointer hover:scale-105'
            }`}
          >
            <CurrentIcon className="w-4 h-4 text-amber-300" />
            <span className="text-[9.5px] font-black leading-none mt-0.5 tabular-nums text-white">
              {currentNum} / ۹
            </span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="مخفی‌سازی ولوم"
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#071928]/90 hover:bg-red-600 border border-dashed border-sky-300/60 flex items-center justify-center text-slate-200 hover:text-white shadow-md transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ==================== FRAMELESS HOLLOW ROTATABLE ORBITAL DIAL ====================
  return (
    <div
      ref={panelRef}
      style={{
        left: `${pos.x}px`,
        bottom: `${pos.y}px`,
      }}
      className={`no-print no-print-admin-ignore fixed z-40 w-[232px] select-none pointer-events-none flex flex-col items-center transition-transform duration-150 ${
        isMoving ? 'scale-[1.02]' : ''
      }`}
    >
      {/* Frameless Hollow Circular Rotary Assembly */}
      <div
        ref={dialAreaRef}
        className="relative flex items-center justify-center touch-none"
        style={{ width: `${dialSize}px`, height: `${dialSize}px` }}
        title="حلقه را با ماوس بگیرید و بچرخانید یا اسکرول کنید؛ هسته مرکزی را برای جابجایی بکشید"
      >
        {/* Top-Right Tiny Circular Move & Spotlight Zoom Handles (No Rectangular Frame) */}
        <div className="pointer-events-auto absolute top-0 right-1 z-30 flex items-center gap-1">
          <button
            type="button"
            onPointerDown={(e) => startMove(e)}
            title="برای جابجایی ولوم روی صفحه بکشید"
            className={`w-7 h-7 rounded-full bg-[#071928]/88 hover:bg-[#0B253A] border border-dashed border-[#37A3DC]/80 text-sky-300 hover:text-white shadow-md flex items-center justify-center transition-colors ${
              isMoving ? 'cursor-grabbing text-amber-300 border-amber-300' : 'cursor-grab'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
          </button>
          {onToggleSpotlight && (
            <button
              type="button"
              onClick={onToggleSpotlight}
              title="ابزار انتخاب و زوم روی بخش دلخواه متن (مات کردن پس‌زمینه)"
              className={`w-7 h-7 rounded-full border border-dashed shadow-md flex items-center justify-center transition-colors cursor-pointer ${
                isSpotlightActive
                  ? 'bg-amber-400 text-slate-950 border-[#071928] shadow-[0_0_12px_rgba(251,191,36,0.65)]'
                  : 'bg-[#071928]/88 hover:bg-[#0B253A] border-amber-400/80 text-amber-300 hover:text-white'
              }`}
            >
              <ScanSearch className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Top-Left Tiny Circular Minimize & Hide Satellites */}
        <div className="pointer-events-auto absolute top-0 left-1 z-30 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            title="کوچک‌سازی به دایره شناور"
            className="w-6 h-6 rounded-full bg-[#071928]/88 hover:bg-[#0B253A] border border-dashed border-sky-300/70 text-sky-200 hover:text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="مخفی‌سازی ولوم"
              className="w-6 h-6 rounded-full bg-[#071928]/88 hover:bg-red-600/90 border border-dashed border-sky-300/70 text-slate-300 hover:text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* SVG Layer: Pure Dashed Circular Track, Dashed Radial Branches & Interactive Spin Hit-Ring */}
        <svg
          viewBox={`0 0 ${dialSize} ${dialSize}`}
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <filter id="hollowDialShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="1.6"
                floodColor="#071928"
                floodOpacity="0.55"
              />
            </filter>
          </defs>

          {/* Invisible Wide Circular Ring Hit-Target to Grab & Spin the Wheel Directly */}
          <circle
            cx={center}
            cy={center}
            r={orbitRadius}
            fill="none"
            stroke="transparent"
            strokeWidth="36"
            style={{ pointerEvents: 'stroke' }}
            onPointerDown={(e) => startSpin(e)}
            className={isSpinning ? 'cursor-grabbing' : 'cursor-grab'}
          />

          {/* Top 12-o'clock Fixed Active Notch Pointer */}
          <g filter="url(#hollowDialShadow)">
            <polygon
              points={`${center},16 ${center - 5},8 ${center + 5},8`}
              fill="#F59E0B"
              stroke="#071928"
              strokeWidth="1"
            />
          </g>

          {/* Rotating Dashed Geometry Group (Outer Halo + Orbit Circle + 8 Dashed Radial Spokes) */}
          <g
            filter="url(#hollowDialShadow)"
            style={{
              transform: `rotate(${wheelAngleDeg}deg)`,
              transformOrigin: `${center}px ${center}px`,
              transition: spinTransition,
            }}
          >
            {/* Outer Fine Dashed Halo */}
            <circle
              cx={center}
              cy={center}
              r={97}
              fill="none"
              stroke="#0284C7"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="2 6"
            />

            {/* Main Dashed Orbital Circle */}
            <circle
              cx={center}
              cy={center}
              r={orbitRadius}
              fill="none"
              stroke="#0B253A"
              strokeOpacity="0.45"
              strokeWidth="3.2"
              strokeDasharray="5 5"
            />
            <circle
              cx={center}
              cy={center}
              r={orbitRadius}
              fill="none"
              stroke="#38BDF8"
              strokeOpacity="0.95"
              strokeWidth="1.6"
              strokeDasharray="5 5"
            />

            {/* 8 Dashed Radial Spokes / Branches Connecting Core to Each Orbital Node */}
            {DIAL_ORBITAL_NODES.map((node) => {
              const rad = (node.angleDeg * Math.PI) / 180;
              const x1 = center + 39 * Math.cos(rad);
              const y1 = center + 39 * Math.sin(rad);
              const x2 = center + (orbitRadius - 18) * Math.cos(rad);
              const y2 = center + (orbitRadius - 18) * Math.sin(rad);
              const isNodeActive = displayId === node.id;

              return (
                <g key={node.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#071928"
                    strokeOpacity="0.45"
                    strokeWidth={isNodeActive ? '3.4' : '2.4'}
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isNodeActive ? '#FBBF24' : '#38BDF8'}
                    strokeOpacity={isNodeActive ? '1' : '0.88'}
                    strokeWidth={isNodeActive ? '2.1' : '1.35'}
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}
          </g>

          {/* Dashed Circular Halo Around Central Core */}
          <circle
            cx={center}
            cy={center}
            r={38}
            fill="none"
            stroke={displayId === 'khatam-01' ? '#F59E0B' : '#0284C7'}
            strokeOpacity="0.92"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            filter="url(#hollowDialShadow)"
          />
        </svg>

        {/* Rotating 8 Orbital Nodes Layer (Icons & Numerals Counter-Rotate to Stay Upright) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `rotate(${wheelAngleDeg}deg)`,
            transition: spinTransition,
          }}
        >
          {DIAL_ORBITAL_NODES.map((node) => {
            const rad = (node.angleDeg * Math.PI) / 180;
            const nx = center + orbitRadius * Math.cos(rad);
            const ny = center + orbitRadius * Math.sin(rad);
            const prop = proposals.find((p) => p.id === node.id);
            const isSelected = activeProposalId === node.id;
            const isHovered = hoveredId === node.id;
            const IconComp = node.icon;

            return (
              <button
                key={node.id}
                type="button"
                onPointerDown={(e) => startSpin(e, node.id)}
                onMouseEnter={() => {
                  if (!spinState.current.active) setHoveredId(node.id);
                }}
                onMouseLeave={() => {
                  if (!spinState.current.active) setHoveredId(null);
                }}
                style={{
                  left: `${nx}px`,
                  top: `${ny}px`,
                }}
                title={`پروپوزال ${prop?.proposalNum || ''} — ${node.shortTitle} (کلیک برای انتخاب یا بکشید برای چرخش)`}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 w-[35px] h-[35px] rounded-full flex items-center justify-center transition-colors duration-150 ${
                  isSpinning ? 'cursor-grabbing' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'bg-[#071928] text-amber-300 border-2 border-dashed border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.65)] z-20 scale-110'
                    : isHovered
                      ? 'bg-[#0E314D] text-white border-2 border-dashed border-sky-300 shadow-[0_4px_14px_rgba(7,25,40,0.45)] z-20 scale-105'
                      : 'bg-[#071928]/92 text-slate-100 border-[1.5px] border-dashed border-[#38BDF8]/80 shadow-[0_4px_12px_rgba(7,25,40,0.4)] hover:border-amber-300'
                }`}
              >
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    transform: `rotate(${-wheelAngleDeg}deg)`,
                    transition: spinTransition,
                  }}
                >
                  <IconComp
                    className={`w-3 h-3 ${
                      isSelected ? 'text-amber-300' : 'text-sky-300'
                    }`}
                  />
                  <span
                    className={`text-[8.5px] font-black leading-none mt-0.5 tabular-nums ${
                      isSelected ? 'text-white' : 'text-sky-50'
                    }`}
                  >
                    {prop?.proposalNum}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Core Knob: Proposal 01 (Click to Select 01, Drag to Move Entire Dial) */}
        <button
          type="button"
          onPointerDown={(e) =>
            startMove(e, () => onSelectProposal('khatam-01'))
          }
          onMouseEnter={() => {
            if (!spinState.current.active) setHoveredId('khatam-01');
          }}
          onMouseLeave={() => {
            if (!spinState.current.active) setHoveredId(null);
          }}
          title="پروپوزال ۱: فرماندهی عالی و شورای عالی (کلیک برای انتخاب؛ برای جابجایی پنل بکشید)"
          className={`pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] rounded-full flex flex-col items-center justify-center text-center transition-all duration-150 ${
            isMoving ? 'cursor-grabbing' : 'cursor-pointer'
          } ${
            activeProposalId === 'khatam-01'
              ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-2 border-dashed border-[#071928]/70 shadow-[0_6px_24px_rgba(245,158,11,0.55)] scale-105'
              : 'bg-gradient-to-b from-[#0E3250]/95 to-[#071928]/95 text-white border-2 border-dashed border-amber-400/85 hover:border-amber-300 hover:scale-105 shadow-[0_8px_22px_rgba(7,25,40,0.5)]'
          }`}
        >
          <span
            className={`text-sm font-black leading-none tabular-nums ${
              activeProposalId === 'khatam-01'
                ? 'text-slate-950'
                : 'text-amber-300'
            }`}
          >
            ۰۱
          </span>
          <span className="text-[8.5px] font-black leading-none mt-1">
            هسته مرکزی
          </span>
          <span
            className={`text-[7.5px] font-bold mt-0.5 leading-none ${
              activeProposalId === 'khatam-01'
                ? 'text-slate-900'
                : 'text-sky-200'
            }`}
          >
            کمیته عالی
          </span>
        </button>
      </div>

      {/* Floating Frameless Active Proposal Readout & Stepper (Slim Curved Capsule — No Box Container) */}
      <div className="pointer-events-auto mt-1 flex items-center gap-1 rounded-full bg-[#071928]/90 backdrop-blur-md border border-dashed border-[#37A3DC]/75 px-1.5 py-1 shadow-[0_8px_22px_rgba(7,25,40,0.4)] text-white max-w-[228px]">
        <button
          type="button"
          onClick={() => stepProposalRef.current(-1)}
          title="چرخاندن به پروپوزال قبلی"
          className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#37A3DC] flex items-center justify-center text-sky-200 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-3 h-3" />
        </button>

        <div className="min-w-0 px-1.5 text-center leading-tight">
          <span className="text-[9px] font-extrabold text-amber-300 tabular-nums">
            {activeProposal?.proposalNum}/۹
          </span>
          <span className="mx-1 text-sky-400/70" aria-hidden="true">
            ·
          </span>
          <span className="text-[10px] font-extrabold text-white truncate inline-block align-bottom max-w-[132px]">
            {activeOrbitalMeta
              ? activeOrbitalMeta.shortTitle
              : 'فرماندهی عالی و شورای عالی'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => stepProposalRef.current(1)}
          title="چرخاندن به پروپوزال بعدی"
          className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#37A3DC] flex items-center justify-center text-sky-200 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Standalone Floating View-Mode Satellites (ایبوک / تعاملی / دایره‌ای) — Zero Rectangular Frame */}
      <div className="pointer-events-auto mt-1.5 flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onToggleViewMode('brochure')}
          title="نمای ایبوک ۲۲ صفحه‌ای A4"
          className={`px-2.5 py-1 rounded-full text-[9.5px] font-extrabold flex items-center gap-1 shadow-md border border-dashed transition-all cursor-pointer whitespace-nowrap ${
            viewMode === 'brochure'
              ? 'bg-[#0284C7] text-white border-sky-200 shadow-[0_4px_14px_rgba(2,132,199,0.45)]'
              : 'bg-[#071928]/88 text-slate-200 border-[#37A3DC]/65 hover:bg-[#0E314D] hover:text-white'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>ایبوک</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleViewMode('interactive')}
          title="نمای وب تعاملی پروپوزال"
          className={`px-2.5 py-1 rounded-full text-[9.5px] font-extrabold flex items-center gap-1 shadow-md border border-dashed transition-all cursor-pointer whitespace-nowrap ${
            viewMode === 'interactive'
              ? 'bg-[#0284C7] text-white border-sky-200 shadow-[0_4px_14px_rgba(2,132,199,0.45)]'
              : 'bg-[#071928]/88 text-slate-200 border-[#37A3DC]/65 hover:bg-[#0E314D] hover:text-white'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>تعاملی</span>
        </button>

        <button
          type="button"
          onClick={onOpenHub}
          title="بازگشت به نمای دایره‌ای تمام‌صفحه ۹ مجموعه"
          className="px-2.5 py-1 rounded-full text-[9.5px] font-extrabold flex items-center gap-1 shadow-md border border-dashed bg-[#071928]/88 text-amber-300 border-amber-400/75 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
        >
          <Compass className="w-3 h-3" />
          <span>دایره‌ای</span>
        </button>
      </div>
    </div>
  );
};
