import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Focus,
  Maximize2,
  MousePointerClick,
  RotateCcw,
  ScanSearch,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface SpotlightFocusToolProps {
  isSelectionMode: boolean;
  onSetSelectionMode: (active: boolean) => void;
  disabled?: boolean;
}

interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SpotlightPayload {
  kind: 'dom' | 'text';
  nodes?: HTMLElement[];
  text?: string;
  baseWidth: number;
  isDarkSurface: boolean;
  label: string;
}

interface TextSelectionAnchor {
  text: string;
  left: number;
  top: number;
}

const SELECTABLE_TAGS = new Set([
  'P',
  'LI',
  'UL',
  'OL',
  'TABLE',
  'TR',
  'BLOCKQUOTE',
  'FIGURE',
  'ARTICLE',
  'SECTION',
  'H1',
  'H2',
  'H3',
  'H4',
  'DIV',
  'IMG',
]);

function isDarkRgb(rgbString: string): boolean {
  const match = rgbString.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
  if (!match) return false;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const alpha = match[4] !== undefined ? Number(match[4]) : 1;
  if (alpha < 0.25) return false;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.45;
}

function detectDarkSurface(el: HTMLElement): boolean {
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body) {
    const bg = window.getComputedStyle(curr).backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return isDarkRgb(bg);
    }
    curr = curr.parentElement;
  }
  return false;
}

function resolveBestTargetElement(rawTarget: EventTarget | null): HTMLElement | null {
  if (!(rawTarget instanceof HTMLElement)) return null;
  const root = document.getElementById('document-workspace-root');
  if (!root || !root.contains(rawTarget)) return null;
  if (rawTarget.closest('.no-print-admin-ignore, [data-spotlight-ignore="true"]')) {
    return null;
  }

  let curr: HTMLElement | null = rawTarget;
  let bestCandidate: HTMLElement | null = null;

  while (curr && curr !== root) {
    if (curr.classList.contains('no-print-admin-ignore')) return null;

    const tag = curr.tagName;
    const rect = curr.getBoundingClientRect();
    const area = rect.width * rect.height;

    if (
      SELECTABLE_TAGS.has(tag) &&
      rect.width >= 64 &&
      rect.height >= 22 &&
      rect.width <= window.innerWidth * 0.96 &&
      rect.height <= window.innerHeight * 0.88 &&
      area >= 1600
    ) {
      if (
        tag === 'P' ||
        tag === 'TABLE' ||
        tag === 'UL' ||
        tag === 'OL' ||
        tag === 'BLOCKQUOTE' ||
        tag === 'FIGURE' ||
        tag === 'H1' ||
        tag === 'H2' ||
        tag === 'H3' ||
        tag === 'IMG' ||
        tag === 'ARTICLE'
      ) {
        return curr;
      }

      if (tag === 'DIV' || tag === 'SECTION' || tag === 'LI' || tag === 'TR') {
        const style = window.getComputedStyle(curr);
        const hasCardLook =
          style.borderRadius !== '0px' ||
          style.borderWidth !== '0px' ||
          (style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            style.backgroundColor !== 'transparent');
        const textLen = (curr.innerText || '').trim().length;
        if ((hasCardLook || textLen > 0) && rect.height <= 640) {
          bestCandidate = curr;
          if (hasCardLook && rect.width <= 920 && rect.height <= 460) {
            return curr;
          }
        }
      }
    }

    curr = curr.parentElement;
  }

  return bestCandidate;
}

function sanitizeCloneForSpotlight(el: HTMLElement): HTMLElement {
  const clone = el.cloneNode(true) as HTMLElement;
  const scrub = (node: Element) => {
    node.removeAttribute('id');
    node.removeAttribute('contenteditable');
    for (const attr of Array.from(node.attributes)) {
      if (attr.name.toLowerCase().startsWith('on')) {
        node.removeAttribute(attr.name);
      }
    }
  };
  scrub(clone);
  clone
    .querySelectorAll('script, iframe, .no-print-admin-ignore, [data-spotlight-ignore="true"]')
    .forEach((node) => node.remove());
  clone.querySelectorAll('*').forEach(scrub);
  return clone;
}

function buildPayloadFromElement(el: HTMLElement): SpotlightPayload {
  const rect = el.getBoundingClientRect();
  const isDarkSurface = detectDarkSurface(el);
  const baseWidth = Math.round(Math.min(Math.max(rect.width, 320), 820));
  const rawLabel = (el.innerText || '').trim().replace(/\s+/g, ' ');
  const label =
    rawLabel.length > 52
      ? `${rawLabel.slice(0, 52)}...`
      : rawLabel || 'بخش انتخاب‌شده سند';

  return {
    kind: 'dom',
    nodes: [sanitizeCloneForSpotlight(el)],
    baseWidth,
    isDarkSurface,
    label,
  };
}

function findElementsInMarquee(box: RectBox): HTMLElement[] {
  const root = document.getElementById('document-workspace-root');
  if (!root) return [];

  const right = box.left + box.width;
  const bottom = box.top + box.height;

  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, p, ul, ol, table, blockquote, figure, article, img, section > div > div'
    )
  ).filter((el) => {
    if (el.closest('.no-print-admin-ignore, [data-spotlight-ignore="true"]')) {
      return false;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.height < 14) return false;
    const overlapX = Math.max(0, Math.min(r.right, right) - Math.max(r.left, box.left));
    const overlapY = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, box.top));
    const overlapArea = overlapX * overlapY;
    const elArea = r.width * r.height;
    return overlapArea > 0 && (overlapArea / elArea > 0.25 || overlapArea > 2200);
  });

  // Remove elements already contained inside another matched element
  const topLevel = candidates.filter(
    (el) => !candidates.some((other) => other !== el && other.contains(el))
  );

  return topLevel.slice(0, 12);
}

export const SpotlightFocusTool: React.FC<SpotlightFocusToolProps> = ({
  isSelectionMode,
  onSetSelectionMode,
  disabled = false,
}) => {
  const [hoverRect, setHoverRect] = useState<RectBox | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<RectBox | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightPayload | null>(null);
  const [zoom, setZoom] = useState<number>(1.28);
  const [textAnchor, setTextAnchor] = useState<TextSelectionAnchor | null>(null);
  const [contentSize, setContentSize] = useState<{ w: number; h: number }>({
    w: 640,
    h: 220,
  });

  const innerContentRef = useRef<HTMLDivElement | null>(null);
  const stageMountRef = useRef<HTMLDivElement | null>(null);
  const marqueeState = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
  }>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
  });

  const closeSpotlight = useCallback(() => {
    setSpotlight(null);
    setZoom(1.28);
  }, []);

  // Mount sanitized DOM node clones safely and measure natural dimensions
  useLayoutEffect(() => {
    if (!spotlight || !innerContentRef.current) return;

    if (spotlight.kind === 'dom' && stageMountRef.current) {
      const fragment = document.createDocumentFragment();
      const clonedNodes = spotlight.nodes || [];
      clonedNodes.forEach((node, idx) => {
        const wrapper = document.createElement('div');
        if (idx < clonedNodes.length - 1) {
          wrapper.className = 'mb-3';
        }
        wrapper.appendChild(node.cloneNode(true));
        fragment.appendChild(wrapper);
      });
      stageMountRef.current.replaceChildren(fragment);
    }

    const el = innerContentRef.current;
    const updateSize = () => {
      setContentSize({
        w: Math.max(280, Math.ceil(el.scrollWidth)),
        h: Math.max(80, Math.ceil(el.scrollHeight)),
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [spotlight]);

  // Global ESC key and +/- zoom shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (spotlight) {
          closeSpotlight();
        } else if (isSelectionMode) {
          onSetSelectionMode(false);
        } else if (textAnchor) {
          setTextAnchor(null);
        }
      } else if (spotlight) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))));
        } else if (e.key === '-') {
          e.preventDefault();
          setZoom((z) => Math.max(1.0, Number((z - 0.15).toFixed(2))));
        } else if (e.key === '0') {
          e.preventDefault();
          setZoom(1.28);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [spotlight, isSelectionMode, textAnchor, closeSpotlight, onSetSelectionMode]);

  // Always-ready quick text-highlight zoom floating pill
  useEffect(() => {
    if (disabled || isSelectionMode || spotlight) {
      setTextAnchor(null);
      return;
    }

    const handleSelectionCheck = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setTextAnchor(null);
        return;
      }

      const selectedText = sel.toString().trim();
      if (selectedText.length < 4) {
        setTextAnchor(null);
        return;
      }

      const root = document.getElementById('document-workspace-root');
      const anchorNode = sel.anchorNode;
      if (!root || !anchorNode || !root.contains(anchorNode)) {
        setTextAnchor(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setTextAnchor(null);
        return;
      }

      setTextAnchor({
        text: selectedText,
        left: Math.min(
          Math.max(80, rect.left + rect.width / 2),
          window.innerWidth - 80
        ),
        top: Math.max(66, rect.top - 10),
      });
    };

    document.addEventListener('mouseup', handleSelectionCheck);
    document.addEventListener('keyup', handleSelectionCheck);
    return () => {
      document.removeEventListener('mouseup', handleSelectionCheck);
      document.removeEventListener('keyup', handleSelectionCheck);
    };
  }, [disabled, isSelectionMode, spotlight]);

  // Selection Mode: Hover Block Highlight + Click-to-Spotlight + Drag-Marquee Selection
  useEffect(() => {
    if (disabled || !isSelectionMode || spotlight) {
      setHoverRect(null);
      setMarqueeRect(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (marqueeState.current.active) {
        const dx = e.clientX - marqueeState.current.startX;
        const dy = e.clientY - marqueeState.current.startY;
        if (Math.hypot(dx, dy) > 14) {
          marqueeState.current.moved = true;
          setHoverRect(null);
          setMarqueeRect({
            left: Math.min(marqueeState.current.startX, e.clientX),
            top: Math.min(marqueeState.current.startY, e.clientY),
            width: Math.abs(dx),
            height: Math.abs(dy),
          });
        }
        return;
      }

      const targetEl = resolveBestTargetElement(e.target);
      if (targetEl) {
        const r = targetEl.getBoundingClientRect();
        setHoverRect({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        });
      } else {
        setHoverRect(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (
        !target ||
        target.closest('.no-print-admin-ignore, [data-spotlight-ignore="true"]')
      ) {
        return;
      }
      const root = document.getElementById('document-workspace-root');
      if (!root || !root.contains(target)) return;

      e.preventDefault();
      marqueeState.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
      };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!marqueeState.current.active) return;
      const wasMarquee = marqueeState.current.moved;
      const box: RectBox = {
        left: Math.min(marqueeState.current.startX, e.clientX),
        top: Math.min(marqueeState.current.startY, e.clientY),
        width: Math.abs(e.clientX - marqueeState.current.startX),
        height: Math.abs(e.clientY - marqueeState.current.startY),
      };

      marqueeState.current.active = false;
      marqueeState.current.moved = false;
      setMarqueeRect(null);

      if (wasMarquee && box.width > 24 && box.height > 20) {
        const matched = findElementsInMarquee(box);
        if (matched.length === 1) {
          setSpotlight(buildPayloadFromElement(matched[0]));
          setZoom(1.28);
          return;
        }
        if (matched.length > 1) {
          const clonedList = matched.map((el) => sanitizeCloneForSpotlight(el));
          const firstDark = detectDarkSurface(matched[0]);
          setSpotlight({
            kind: 'dom',
            nodes: clonedList,
            baseWidth: Math.round(Math.min(Math.max(box.width, 420), 820)),
            isDarkSurface: firstDark,
            label: `ناحیه انتخاب‌شده (${matched.length} بخش)`,
          });
          setZoom(1.24);
          return;
        }
      }

      // Single click fallback: zoom the clicked content block
      const clickedEl = resolveBestTargetElement(e.target);
      if (clickedEl) {
        setSpotlight(buildPayloadFromElement(clickedEl));
        setZoom(1.28);
      }
    };

    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        !target ||
        target.closest('.no-print-admin-ignore, [data-spotlight-ignore="true"]')
      ) {
        return;
      }
      const root = document.getElementById('document-workspace-root');
      if (root && root.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('click', handleClickCapture, true);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [disabled, isSelectionMode, spotlight]);

  const handleOpenTextSpotlight = () => {
    if (!textAnchor) return;
    const text = textAnchor.text;
    window.getSelection()?.removeAllRanges();
    setTextAnchor(null);
    setSpotlight({
      kind: 'text',
      text,
      baseWidth: 660,
      isDarkSurface: false,
      label: 'متن انتخاب‌شده برای تمرکز و بزرگ‌نمایی',
    });
    setZoom(1.32);
  };

  if (disabled) return null;

  return (
    <>
      {/* 1. Floating Quick-Zoom Button When User Highlights Text Normally */}
      {textAnchor && !spotlight && !isSelectionMode && (
        <div
          data-spotlight-ignore="true"
          style={{
            left: `${textAnchor.left}px`,
            top: `${textAnchor.top}px`,
          }}
          className="no-print no-print-admin-ignore fixed z-50 -translate-x-1/2 -translate-y-full"
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleOpenTextSpotlight();
            }}
            className="px-3 py-1.5 rounded-full bg-[#071928] hover:bg-[#0284C7] text-white border border-dashed border-[#38BDF8] shadow-[0_10px_28px_rgba(7,25,40,0.45)] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ScanSearch className="w-3.5 h-3.5 text-amber-300" />
            <span>زوم و تمرکز روی این متن</span>
          </button>
        </div>
      )}

      {/* 2. Active Selection Mode Guidance Banner */}
      {isSelectionMode && !spotlight && (
        <div
          data-spotlight-ignore="true"
          className="no-print no-print-admin-ignore fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#071928]/94 backdrop-blur-md border border-dashed border-[#38BDF8] text-white shadow-[0_12px_32px_rgba(7,25,40,0.5)] text-xs"
        >
          <MousePointerClick className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-bold whitespace-nowrap">
            حالت زوم و تمرکز فعال است — روی هر بخش کلیک کنید یا کادر بکشید
          </span>
          <button
            type="button"
            onClick={() => onSetSelectionMode(false)}
            className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-red-500 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <X className="w-3 h-3" />
            <span>خروج</span>
          </button>
        </div>
      )}

      {/* 3. Live Hover Highlight Frame Over Workspace Block */}
      {isSelectionMode && !spotlight && hoverRect && (
        <div
          style={{
            left: `${hoverRect.left - 4}px`,
            top: `${hoverRect.top - 4}px`,
            width: `${hoverRect.width + 8}px`,
            height: `${hoverRect.height + 8}px`,
          }}
          className="no-print no-print-admin-ignore fixed z-40 pointer-events-none rounded-xl border-2 border-dashed border-[#0284C7] bg-[#37A3DC]/10 shadow-[0_0_0_4px_rgba(56,189,248,0.16)] transition-all duration-100"
        >
          <span className="absolute -top-6 right-1 px-2 py-0.5 rounded-full bg-[#071928] text-amber-300 text-[10px] font-bold shadow whitespace-nowrap">
            کلیک برای زوم
          </span>
        </div>
      )}

      {/* 4. Drag-to-Select Custom Marquee Rectangle */}
      {isSelectionMode && !spotlight && marqueeRect && (
        <div
          style={{
            left: `${marqueeRect.left}px`,
            top: `${marqueeRect.top}px`,
            width: `${marqueeRect.width}px`,
            height: `${marqueeRect.height}px`,
          }}
          className="no-print no-print-admin-ignore fixed z-40 pointer-events-none rounded-lg border-2 border-dashed border-amber-400 bg-sky-400/15 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
        />
      )}

      {/* 5. Spotlight Zoom Overlay — Blurred & Dimmed Backdrop + Elevated Focused Content */}
      {spotlight && (
        <div
          data-spotlight-ignore="true"
          onClick={closeSpotlight}
          className="no-print no-print-admin-ignore fixed inset-0 z-50 bg-[#061420]/74 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Floating Spotlight Controls Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mb-4 flex flex-wrap items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-[#071928]/95 border border-dashed border-[#38BDF8]/75 text-white shadow-2xl"
          >
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/15 text-xs font-bold text-sky-200 max-w-[220px] sm:max-w-[300px]">
              <Focus className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">{spotlight.label}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.max(1.0, Number((z - 0.15).toFixed(2))))
                }
                title="کوچک‌نمایی (-)"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#37A3DC] flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[44px] text-center text-xs font-black text-amber-300 tabular-nums">
                {Math.round(zoom * 100)}٪
              </span>
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))))
                }
                title="بزرگ‌نمایی (+)"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#37A3DC] flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1.28)}
                title="بازنشانی بزرگ‌نمایی"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sky-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 pr-1 border-r border-white/15">
              <button
                type="button"
                onClick={() => {
                  closeSpotlight();
                  onSetSelectionMode(true);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#37A3DC] text-[11px] font-bold text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Maximize2 className="w-3 h-3" />
                <span>انتخاب بخش دیگر</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  closeSpotlight();
                  onSetSelectionMode(false);
                }}
                className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <X className="w-3.5 h-3.5" />
                <span>بستن</span>
              </button>
            </div>
          </div>

          {/* Focused Zoomed Content Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-[94vw] max-h-[80vh] overflow-auto rounded-3xl border-2 border-[#38BDF8]/80 shadow-[0_28px_80px_rgba(0,0,0,0.65)] p-6 sm:p-8 ${
              spotlight.isDarkSurface
                ? 'bg-gradient-to-b from-[#0B253A] to-[#071928] text-white'
                : 'bg-white text-[#0F172A]'
            }`}
          >
            <div
              dir="ltr"
              className="mx-auto relative"
              style={{
                width: `${Math.ceil(contentSize.w * zoom)}px`,
                height: `${Math.ceil(contentSize.h * zoom)}px`,
              }}
            >
              <div
                ref={innerContentRef}
                dir="rtl"
                style={{
                  width: `${spotlight.baseWidth}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {spotlight.kind === 'text' ? (
                  <div className="space-y-3 text-right">
                    <div className="text-xs font-extrabold text-[#0284C7] pb-2 border-b border-slate-200">
                      بخش انتخاب‌شده جهت نمایش و تمرکز در جلسه
                    </div>
                    <p className="text-base sm:text-lg font-bold text-[#0B253A] leading-[2.1] text-justify whitespace-pre-wrap">
                      {spotlight.text}
                    </p>
                  </div>
                ) : (
                  <div
                    ref={stageMountRef}
                    className="spotlight-cloned-stage"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
