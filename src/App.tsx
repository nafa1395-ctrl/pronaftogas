/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  exportProposalToVectorPdf,
  exportStandaloneProtocolToPdf,
  StandaloneProtocolPdfOptions,
} from './utils/pdfExport';
import { exportProposalToPptx } from './utils/pptxExport';
import { isTauriDesktop, saveImageAsset } from './utils/tauriDesktop';
import {
  CalendarClock,
  Check,
  CheckSquare,
  ClipboardCheck,
  Compass,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Link2,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Presentation,
  Printer,
  QrCode,
  RotateCcw,
  Save,
  ScanSearch,
  Search,
  ShieldAlert,
  Square,
  Unlock,
  Wifi,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  AI_CREDENTIALS_13,
  COMPANY_RESUME_DATA,
  CONFIDENTIALITY_STATEMENT,
  CONNECTION_TEST_PROTOCOL,
  DAILY_SCHEDULE,
  DOCUMENT_META,
  EXECUTIVE_LETTER,
  EXTRACTED_ASSETS,
  OFFICIAL_CERTIFICATES,
  PM_CREDENTIALS,
  PROTOCOL_CLAUSES,
  PROTOCOL_INTRO,
} from './data/protocolData';
import { RedesignedBrochurePages } from './components/RedesignedBrochurePages';
import { KhatamInteractiveProposal } from './components/KhatamInteractiveProposal';
import { KhatamProposalBrochurePages } from './components/KhatamProposalBrochurePages';
import { KhatamCircularHubPortal } from './components/KhatamCircularHubPortal';
import { OrbitalProposalDial } from './components/OrbitalProposalDial';
import { SpotlightFocusTool } from './components/SpotlightFocusTool';
import {
  KHATAM_PROPOSALS,
  KhatamProposalDocument,
} from './data/khatamProposalsData';
import {
  OIL_GAS_EXEC_25H_ID,
  OIL_GAS_EXEC_25H_PROPOSAL,
  OIL_GAS_EXEC_MONDAY_SCHEDULE,
} from './data/oilGasExecProposalData';
import {
  AdminDocumentEditorModal,
  CompanyResumeType,
  DocumentMetaType,
} from './components/AdminDocumentEditorModal';

type ViewMode = 'hub' | 'interactive' | 'brochure' | 'protocol';
type ProtocolProfile = 'oil-gas-exec' | 'active-holding' | 'damavand';
type CredentialFilter = 'all' | 'ai' | 'pm';
type ProtocolCategoryFilter =
  | 'all'
  | 'hardware'
  | 'participants'
  | 'classroom'
  | 'hospitality'
  | 'legal';

interface LightboxState {
  src: string;
  title: string;
}

const CHECKLIST_STORAGE_KEY = 'owj_cpmai_protocol_checklist_v1';
const CONN_STEPS_STORAGE_KEY = 'owj_cpmai_conn_steps_v1';
const DIGITAL_URL_STORAGE_KEY = 'owj_cpmai_digital_url_v3';
const ADMIN_PROPOSALS_STORAGE_KEY = 'owj_cpmai_admin_proposals_v4';
const ADMIN_OILGAS_EXEC_STORAGE_KEY = 'owj_cpmai_admin_oilgas_exec_v7';
const ADMIN_COMPANY_STORAGE_KEY = 'owj_cpmai_admin_company_v2';
const ADMIN_DOCMETA_STORAGE_KEY = 'owj_cpmai_admin_docmeta_v2';
const ADMIN_TEXTMAP_STORAGE_KEY = 'owj_cpmai_admin_textmap_v2';
const DAMAVAND_PUBLIC_URL = 'https://ajaowjbc-debug.github.io/owj-cpmai-protocol/';
const KHATAM_CENTRAL_HUB_URL = 'https://ajaowjbc-debug.github.io/khatam-cpmai-hub/';
const OIL_GAS_EXEC_PROTOCOL_LETTER = `ضمن عرض سلام و تحیت و آرزوی توفیق روزافزون برای مدیران ارجمند مؤسسات و شرکت‌های تابعه هلدینگ تخصصی نفت، گاز و پتروشیمی قرارگاه سازندگی خاتم‌الانبیاء (ص)، این سند به‌عنوان پروتکل رسمی برگزاری دوره جامع و ترکیبی ۲۵ ساعته (۱۰ جلسه ۲.۵ ساعته در روزهای دوشنبه، ساعت ۰۷:۰۰ الی ۰۹:۳۰ صبح) تقدیم می‌گردد. در ساختار ترکیبی هر جلسه، ابتدا ۱.۲۵ ساعت متدولوژی (تجمعی ۱۲.۵ ساعت در سه فصل: «هوش مصنوعی چیست؟»، «کاربردهای هوش مصنوعی» و «بهترین شیوه‌های پیاده‌سازی هوش مصنوعی») و سپس ۱.۲۵ ساعت کارگاه عملی ابزارهای کاربردی AI و مهندسی پرامپت اجرایی (تجمعی ۱۲.۵ ساعت) برگزار می‌شود. با توجه به شروع دقیق جلسات در ساعت ۰۷:۰۰ صبح دوشنبه‌ها، رعایت کامل الزامات فنی سالن، پایداری اینترنت، آماده‌سازی حساب‌های ابزارهای AI (Google / NotebookLM / Gemini / Claude / ChatGPT) و انجام تست اتصال پیش از جلسه اول، ضامن بیشترین بهره‌وری و دستیابی به ۹ خروجی ملموس و قابل دفاع در جلسات هیئت‌مدیره خواهد بود.`;

function deepReplaceString<T>(obj: T, oldStr: string, newStr: string): T {
  if (!oldStr || oldStr === newStr) return obj;
  if (typeof obj === 'string') {
    if (obj.trim() === oldStr.trim()) {
      return newStr as unknown as T;
    }
    if (obj.includes(oldStr)) {
      return obj.split(oldStr).join(newStr) as unknown as T;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      deepReplaceString(item, oldStr, newStr)
    ) as unknown as T;
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = deepReplaceString(v, oldStr, newStr);
    }
    return result as T;
  }
  return obj;
}

function isSingleProposalRepoPathname(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  for (const p of KHATAM_PROPOSALS) {
    if (path.includes(p.repoName.toLowerCase())) {
      return true;
    }
  }
  if (
    path.includes('damavand-cpmai-protocol') ||
    path.includes('owj-cpmai-protocol')
  ) {
    return true;
  }
  return false;
}

const BUILD_LOCKED_DOC_ID =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_PROPOSAL_ID
    ? String(import.meta.env.VITE_PROPOSAL_ID).trim()
    : isSingleProposalRepoPathname()
      ? 'GITHUB_PAGES_AUTO_LOCK'
      : '';

function detectInitialViewMode(): ViewMode {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (
      v === 'brochure' ||
      v === 'interactive' ||
      v === 'hub' ||
      v === 'protocol'
    ) {
      return v;
    }
    if (params.get('proposal')) {
      return 'brochure';
    }
    if (window.location.pathname.toLowerCase().includes('khatam-cpmai-hub')) {
      return 'hub';
    }
    if (isTauriDesktop()) {
      return 'hub';
    }
  }
  if (BUILD_LOCKED_DOC_ID) {
    return 'brochure';
  }
  return 'brochure';
}

function detectInitialDocId(): string {
  if (
    BUILD_LOCKED_DOC_ID &&
    BUILD_LOCKED_DOC_ID !== 'GITHUB_PAGES_AUTO_LOCK'
  ) {
    return BUILD_LOCKED_DOC_ID;
  }
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const qProp = params.get('proposal');
    if (
      qProp &&
      (qProp === 'damavand' ||
        qProp === OIL_GAS_EXEC_25H_ID ||
        KHATAM_PROPOSALS.some((p) => p.id === qProp))
    ) {
      return qProp;
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes(OIL_GAS_EXEC_25H_PROPOSAL.repoName.toLowerCase())) {
      return OIL_GAS_EXEC_25H_ID;
    }
    for (const p of KHATAM_PROPOSALS) {
      if (path.includes(p.repoName.toLowerCase())) {
        return p.id;
      }
    }
    if (
      path.includes('damavand-cpmai-protocol') ||
      path.includes('owj-cpmai-protocol')
    ) {
      return 'damavand';
    }
  }
  return 'khatam-01';
}

function getDefaultUrlForDoc(docId: string): string {
  if (docId === OIL_GAS_EXEC_25H_ID) {
    return OIL_GAS_EXEC_25H_PROPOSAL.githubPagesUrl;
  }
  const found = KHATAM_PROPOSALS.find((p) => p.id === docId);
  if (found) return found.githubPagesUrl;
  return DAMAVAND_PUBLIC_URL;
}

function getAutoDetectedPublicUrl(
  docId: string,
  targetView: 'brochure' | 'protocol' = 'brochure'
): string {
  const fallback =
    targetView === 'protocol'
      ? `${KHATAM_CENTRAL_HUB_URL}?proposal=${docId}&view=protocol`
      : getDefaultUrlForDoc(docId);
  if (typeof window === 'undefined') return fallback;
  const { origin, pathname, hostname, protocol } = window.location;
  if (
    isTauriDesktop() ||
    hostname === 'tauri.localhost' ||
    protocol === 'tauri:'
  ) {
    return fallback;
  }
  if (
    hostname.startsWith('ais-dev-') ||
    hostname.startsWith('ais-pre-') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  ) {
    return `${origin}${pathname}?proposal=${docId}&view=${targetView}`;
  }
  if (pathname.toLowerCase().includes('khatam-cpmai-hub')) {
    return targetView === 'protocol'
      ? `${origin}${pathname}?proposal=${docId}&view=protocol`
      : docId === OIL_GAS_EXEC_25H_ID
        ? `${origin}${pathname}?proposal=${OIL_GAS_EXEC_25H_ID}&view=brochure`
        : fallback;
  }
  return targetView === 'protocol'
    ? `${origin}${pathname}?proposal=${docId}&view=protocol`
    : `${origin}${pathname}`;
}

export default function App() {
  const [proposalsState, setProposalsState] = useState<
    KhatamProposalDocument[]
  >(() => {
    try {
      const saved = localStorage.getItem(ADMIN_PROPOSALS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === KHATAM_PROPOSALS.length) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return KHATAM_PROPOSALS;
  });

  const [companyResumeState, setCompanyResumeState] =
    useState<CompanyResumeType>(() => {
      try {
        const saved = localStorage.getItem(ADMIN_COMPANY_STORAGE_KEY);
        return saved ? JSON.parse(saved) : COMPANY_RESUME_DATA;
      } catch {
        return COMPANY_RESUME_DATA;
      }
    });

  const [docMetaState, setDocMetaState] = useState<DocumentMetaType>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_DOCMETA_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DOCUMENT_META;
    } catch {
      return DOCUMENT_META;
    }
  });

  const [customTextMap, setCustomTextMap] = useState<Record<string, string>>(
    () => {
      try {
        const saved = localStorage.getItem(ADMIN_TEXTMAP_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
  );

  const [oilGasExecProposalState, setOilGasExecProposalState] =
    useState<KhatamProposalDocument>(() => {
      try {
        const saved = localStorage.getItem(ADMIN_OILGAS_EXEC_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id === OIL_GAS_EXEC_25H_ID) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
      return OIL_GAS_EXEC_25H_PROPOSAL;
    });

  const [activeDocId, setActiveDocId] = useState<string>(() =>
    detectInitialDocId()
  );
  const [protocolProfile, setProtocolProfile] = useState<ProtocolProfile>(
    () => {
      const initId = detectInitialDocId();
      if (initId === 'damavand') return 'damavand';
      return 'oil-gas-exec';
    }
  );
  const [copiedDirectLink, setCopiedDirectLink] = useState<boolean>(false);

  const activeProposal = useMemo(() => {
    if (activeDocId === OIL_GAS_EXEC_25H_ID) {
      return oilGasExecProposalState;
    }
    return proposalsState.find((p) => p.id === activeDocId) || null;
  }, [proposalsState, oilGasExecProposalState, activeDocId]);

  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    detectInitialViewMode()
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (viewMode === 'protocol') {
        document.title =
          protocolProfile === 'oil-gas-exec'
            ? 'پروتکل برگزاری دوره ۲۵ ساعته مدیران مؤسسات هلدینگ نفت، گاز و پتروشیمی (دوشنبه‌ها ۰۷:۰۰–۰۹:۳۰)'
            : `${docMetaState.title} — ${docMetaState.clientProject}`;
      } else if (activeProposal) {
        document.title = `${activeProposal.coverMainTitle} — ${activeProposal.recipientShortOnCover}`;
      } else {
        document.title = `${docMetaState.title} — ${docMetaState.clientProject}`;
      }
    }
  }, [activeProposal, docMetaState, viewMode, protocolProfile]);

  useEffect(() => {
    if (typeof window === 'undefined' || isTauriDesktop()) return;
    if (
      window.location.protocol === 'tauri:' ||
      window.location.hostname === 'tauri.localhost'
    ) {
      return;
    }
    try {
      const url = new URL(window.location.href);
      if (viewMode === 'hub') {
        url.searchParams.set('view', 'hub');
        url.searchParams.delete('proposal');
      } else {
        url.searchParams.set('proposal', activeDocId);
        url.searchParams.set('view', viewMode);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore history errors in sandboxed iframes
    }
  }, [activeDocId, viewMode]);

  const activeProtocolOptions = useMemo<StandaloneProtocolPdfOptions>(() => {
    if (protocolProfile === 'oil-gas-exec') {
      return {
        protocolTitle: 'پروتکل برگزاری دوره ۲۵ ساعته هوش مصنوعی و CPMAI',
        clientProjectTitle:
          'مدیران مؤسسات و شرکت‌های تابعه هلدینگ نفت، گاز و پتروشیمی',
        scheduleSummary:
          oilGasExecProposalState.protocolScheduleSummary ||
          'روزهای دوشنبه، ساعت ۰۷:۰۰ الی ۰۹:۳۰ صبح (۱۰ جلسه ۲.۵ ساعته، مجموعاً ۲۵ ساعت)',
        customSchedule: OIL_GAS_EXEC_MONDAY_SCHEDULE,
        extraPrepNote: oilGasExecProposalState.protocolExtraPrepNote,
        executiveLetterOverride: OIL_GAS_EXEC_PROTOCOL_LETTER,
      };
    }
    if (
      protocolProfile === 'active-holding' &&
      activeProposal &&
      activeProposal.id !== OIL_GAS_EXEC_25H_ID
    ) {
      return {
        protocolTitle: 'پروتکل برگزاری کارگاه آموزشی PMI-CPMAI v8',
        clientProjectTitle: activeProposal.recipientShortOnCover,
        scheduleSummary: 'ساعت ۰۸:۰۰ الی ۱۷:۰۰ (کارگاه عملی ۸ ساعته)',
        customSchedule: DAILY_SCHEDULE,
      };
    }
    return {
      protocolTitle: docMetaState.title,
      clientProjectTitle: docMetaState.clientProject,
      scheduleSummary: 'ساعت ۰۸:۰۰ الی ۱۷:۰۰ (طول مدت کلاس ۸ ساعت)',
      customSchedule: DAILY_SCHEDULE,
    };
  }, [protocolProfile, oilGasExecProposalState, activeProposal, docMetaState]);
  const [credFilter, setCredFilter] = useState<CredentialFilter>('all');
  const [credSearch, setCredSearch] = useState('');
  const [protocolCategory, setProtocolCategory] =
    useState<ProtocolCategoryFilter>('all');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [showUrlConfig, setShowUrlConfig] = useState<boolean>(false);
  const [showAdminLoginBar, setShowAdminLoginBar] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isDirectEditMode, setIsDirectEditMode] = useState<boolean>(true);
  const [showAdminEditorModal, setShowAdminEditorModal] =
    useState<boolean>(false);
  const [adminSavedBanner, setAdminSavedBanner] = useState<boolean>(false);
  const [showOrbitalDial, setShowOrbitalDial] = useState<boolean>(true);
  const [isSpotlightSelectionMode, setIsSpotlightSelectionMode] =
    useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasswordError, setAdminPasswordError] = useState<string>('');
  const [digitalUrl, setDigitalUrl] = useState<string>(() =>
    getAutoDetectedPublicUrl(detectInitialDocId())
  );
  const [digitalQrDataUrl, setDigitalQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeNavSection, setActiveNavSection] = useState<string>('company-resume');

  useEffect(() => {
    const sectionIds = activeProposal
      ? [
          'company-resume',
          'instructor',
          'context',
          'patterns',
          'workbook',
          'investment',
        ]
      : ['instructor', 'protocol', 'connection-test', 'schedule'];

    const handleScroll = () => {
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));

      if (viewMode === 'interactive') {
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 170) {
              current = id;
            }
          }
        }
        setActiveNavSection(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProposal, viewMode]);

  const handleHeaderSectionNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setActiveNavSection(sectionId);
    if (viewMode !== 'interactive') {
      setViewMode('interactive');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 90);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectDocument = (docId: string) => {
    setActiveDocId(docId);
    setDigitalUrl(getAutoDetectedPublicUrl(docId));
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminPasswordInput.trim();
    const normalizedDigits = trimmed.replace(/[۰-۹]/g, (d) =>
      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    );
    if (
      normalizedDigits === '123' ||
      trimmed === '123' ||
      trimmed === '۱۲۳' ||
      trimmed === '.Kbka@222' ||
      trimmed === 'Kbka@222' ||
      trimmed === 'Kbka@222.'
    ) {
      setIsAdminUnlocked(true);
      setIsDirectEditMode(true);
      setShowAdminLoginBar(false);
      setAdminPasswordError('');
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError('رمز عبور واردشده صحیح نیست. (رمز ادمین: ۱۲۳)');
    }
  };

  const persistAllAdminData = (
    nextProposals: KhatamProposalDocument[],
    nextCompany: CompanyResumeType,
    nextMeta: DocumentMetaType,
    nextTextMap: Record<string, string>
  ) => {
    try {
      localStorage.setItem(
        ADMIN_PROPOSALS_STORAGE_KEY,
        JSON.stringify(nextProposals)
      );
      localStorage.setItem(
        ADMIN_COMPANY_STORAGE_KEY,
        JSON.stringify(nextCompany)
      );
      localStorage.setItem(ADMIN_DOCMETA_STORAGE_KEY, JSON.stringify(nextMeta));
      localStorage.setItem(
        ADMIN_TEXTMAP_STORAGE_KEY,
        JSON.stringify(nextTextMap)
      );
    } catch {
      // ignore storage errors
    }
  };

  const applyInlineTextEdit = (origText: string, newText: string) => {
    const cleanOrig = origText.trim();
    const cleanNew = newText.trim();
    if (!cleanOrig || !cleanNew || cleanOrig === cleanNew) return;

    const nextProposals = proposalsState.map((p) =>
      p.id === activeDocId ? deepReplaceString(p, cleanOrig, cleanNew) : p
    );
    if (activeDocId === OIL_GAS_EXEC_25H_ID) {
      const nextExec = deepReplaceString(
        oilGasExecProposalState,
        cleanOrig,
        cleanNew
      );
      setOilGasExecProposalState(nextExec);
      try {
        localStorage.setItem(
          ADMIN_OILGAS_EXEC_STORAGE_KEY,
          JSON.stringify(nextExec)
        );
      } catch {
        // ignore
      }
    }
    const nextCompany = deepReplaceString(
      companyResumeState,
      cleanOrig,
      cleanNew
    );
    const nextMeta = deepReplaceString(docMetaState, cleanOrig, cleanNew);
    const nextTextMap = { ...customTextMap, [cleanOrig]: cleanNew };

    setProposalsState(nextProposals);
    setCompanyResumeState(nextCompany);
    setDocMetaState(nextMeta);
    setCustomTextMap(nextTextMap);
    persistAllAdminData(nextProposals, nextCompany, nextMeta, nextTextMap);
  };

  const handleSaveAllFromToolbar = () => {
    // Flush any currently focused contentEditable element inside the workspace
    if (typeof document !== 'undefined') {
      const root = document.getElementById('document-workspace-root');
      if (root) {
        const editables = root.querySelectorAll<HTMLElement>(
          '[contenteditable="true"]'
        );
        editables.forEach((el) => {
          const orig = el.dataset.origText;
          const curr = el.innerText.trim();
          if (orig && curr && orig !== curr) {
            el.dataset.origText = curr;
            applyInlineTextEdit(orig, curr);
          }
        });
      }
    }
    persistAllAdminData(
      proposalsState,
      companyResumeState,
      docMetaState,
      customTextMap
    );
    try {
      localStorage.setItem(
        ADMIN_OILGAS_EXEC_STORAGE_KEY,
        JSON.stringify(oilGasExecProposalState)
      );
    } catch {
      // ignore
    }
    setAdminSavedBanner(true);
    setTimeout(() => setAdminSavedBanner(false), 3000);
  };

  const handleResetCurrentProposalToDefault = () => {
    if (activeDocId === OIL_GAS_EXEC_25H_ID) {
      setOilGasExecProposalState(OIL_GAS_EXEC_25H_PROPOSAL);
      try {
        localStorage.removeItem(ADMIN_OILGAS_EXEC_STORAGE_KEY);
      } catch {
        // ignore
      }
    } else {
      const defaultProp =
        KHATAM_PROPOSALS.find((p) => p.id === activeDocId) ||
        KHATAM_PROPOSALS[0];
      const nextProposals = proposalsState.map((p) =>
        p.id === activeDocId ? defaultProp : p
      );
      setProposalsState(nextProposals);
      persistAllAdminData(
        nextProposals,
        COMPANY_RESUME_DATA,
        DOCUMENT_META,
        {}
      );
    }
    setCompanyResumeState(COMPANY_RESUME_DATA);
    setDocMetaState(DOCUMENT_META);
    setCustomTextMap({});
    setAdminSavedBanner(true);
    setTimeout(() => setAdminSavedBanner(false), 2500);
  };

  // Apply saved static text replacements across the workspace whenever view or customTextMap updates
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const entries = Object.entries(customTextMap);
    if (entries.length === 0) return;
    const root = document.getElementById('document-workspace-root');
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null = walker.nextNode();
    while (node) {
      const val = node.nodeValue;
      if (val && val.trim()) {
        const trimmed = val.trim();
        for (const [orig, replacement] of entries) {
          if (trimmed === orig) {
            node.nodeValue = val.replace(orig, replacement);
          }
        }
      }
      node = walker.nextNode();
    }
  }, [customTextMap, viewMode, activeDocId]);

  // Turn off contentEditable attributes when exiting direct edit mode
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isAdminUnlocked || !isDirectEditMode) {
      const root = document.getElementById('document-workspace-root');
      if (!root) return;
      root
        .querySelectorAll<HTMLElement>('[contenteditable="true"]')
        .forEach((el) => {
          el.removeAttribute('contenteditable');
          el.classList.remove(
            'outline-2',
            'outline-dashed',
            'outline-[#0284C7]',
            'bg-sky-50/40',
            'rounded'
          );
        });
    }
  }, [isAdminUnlocked, isDirectEditMode]);

  const handleWorkspaceClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdminUnlocked || !isDirectEditMode) return;
    const target = e.target as HTMLElement;
    if (!target) return;
    if (target.closest('.no-print-admin-ignore, button, input, textarea, select')) {
      return;
    }

    const editableTarget = target.closest(
      'h1, h2, h3, h4, p, td, th, li, strong, span'
    ) as HTMLElement | null;

    if (!editableTarget) return;

    // Prevent link navigation or image lightbox while editing text
    if (target.closest('a')) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (editableTarget.getAttribute('contenteditable') !== 'true') {
      if (!editableTarget.dataset.origText) {
        editableTarget.dataset.origText = editableTarget.innerText.trim();
      }
      editableTarget.setAttribute('contenteditable', 'true');
      editableTarget.setAttribute('spellcheck', 'false');
      editableTarget.classList.add(
        'outline-2',
        'outline-dashed',
        'outline-[#0284C7]',
        'rounded'
      );
      editableTarget.focus();
    }
  };

  const handleWorkspaceBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isAdminUnlocked) return;
    const target = e.target as HTMLElement;
    if (!target || target.getAttribute('contenteditable') !== 'true') return;

    const orig = target.dataset.origText;
    const curr = target.innerText.trim();
    if (orig && curr && orig !== curr) {
      target.dataset.origText = curr;
      applyInlineTextEdit(orig, curr);
    }
  };

  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [connChecks, setConnChecks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CONN_STEPS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { 0: false, 1: false, 2: false };
    } catch {
      return { 0: false, 1: false, 2: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage errors
    }
  }, [checkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CONN_STEPS_STORAGE_KEY, JSON.stringify(connChecks));
    } catch {
      // Ignore storage errors
    }
  }, [connChecks]);

  useEffect(() => {
    const cleanUrl = digitalUrl.trim() || getDefaultUrlForDoc(activeDocId);
    try {
      localStorage.setItem(`${DIGITAL_URL_STORAGE_KEY}_${activeDocId}`, cleanUrl);
    } catch {
      // Ignore storage errors
    }
    QRCode.toDataURL(cleanUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setDigitalQrDataUrl(url))
      .catch(() => {});
  }, [digitalUrl, activeDocId]);

  const handleCopyDigitalUrl = () => {
    navigator.clipboard?.writeText(digitalUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const toggleChecklist = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleConnCheck = (idx: number) => {
    setConnChecks((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checkAllClauses = () => {
    const all: Record<string, boolean> = {};
    PROTOCOL_CLAUSES.forEach((c) => {
      all[c.id] = true;
    });
    setCheckedIds(all);
  };

  const resetChecklist = () => {
    setCheckedIds({});
  };

  const completedCount = useMemo(
    () => PROTOCOL_CLAUSES.filter((c) => checkedIds[c.id]).length,
    [checkedIds]
  );

  const allConnVerified = Boolean(connChecks[0] && connChecks[1] && connChecks[2]);

  const filteredCredentials = useMemo(() => {
    const combined = [
      ...AI_CREDENTIALS_13.map((item) => ({ ...item, groupLabel: 'هوش مصنوعی و CPMAI' })),
      ...PM_CREDENTIALS.map((item) => ({ ...item, groupLabel: 'مدیریت پروژه بین‌الملل' })),
    ];
    return combined.filter((item) => {
      const matchesTab =
        credFilter === 'all' ||
        (credFilter === 'ai' && item.category === 'ai') ||
        (credFilter === 'pm' && item.category === 'pm');
      const q = credSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.titleFa.toLowerCase().includes(q) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        item.organizationFa.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [credFilter, credSearch]);

  const filteredClauses = useMemo(() => {
    if (protocolCategory === 'all') return PROTOCOL_CLAUSES;
    return PROTOCOL_CLAUSES.filter((c) => c.category === protocolCategory);
  }, [protocolCategory]);

  const handleCopyShareUrl = (targetView: 'brochure' | 'protocol') => {
    const targetDoc =
      targetView === 'protocol' && protocolProfile === 'oil-gas-exec'
        ? OIL_GAS_EXEC_25H_ID
        : targetView === 'protocol' && protocolProfile === 'damavand'
          ? 'damavand'
          : activeDocId;
    const urlToCopy = getAutoDetectedPublicUrl(targetDoc, targetView);
    navigator.clipboard?.writeText(urlToCopy);
    setCopiedDirectLink(true);
    setTimeout(() => setCopiedDirectLink(false), 2200);
  };

  const handleDirectBrowserPrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportProtocolPdf = async () => {
    if (isExportingPdf || isExportingPptx) return;
    setIsExportingPdf(true);
    setExportProgress('در حال آماده‌سازی فایل PDF پروتکل برگزاری دوره (A4)...');

    try {
      const targetDoc =
        protocolProfile === 'oil-gas-exec'
          ? OIL_GAS_EXEC_25H_ID
          : protocolProfile === 'damavand'
            ? 'damavand'
            : activeDocId;
      const effectiveUrl = getAutoDetectedPublicUrl(targetDoc, 'protocol');
      const pdfFilename =
        protocolProfile === 'oil-gas-exec'
          ? 'پروتکل-دوره-۲۵-ساعته-نفت-و-گاز.pdf'
          : protocolProfile === 'damavand'
            ? 'پروتکل-پتروشیمی-دماوند.pdf'
            : `پروتکل-${targetDoc}.pdf`;

      await exportStandaloneProtocolToPdf(
        activeProtocolOptions,
        docMetaState,
        effectiveUrl,
        digitalQrDataUrl,
        (msg) => setExportProgress(msg),
        pdfFilename
      );
    } catch (err) {
      console.error('Protocol PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
      setExportProgress('');
    }
  };

  const handlePrint = async () => {
    if (viewMode === 'protocol') {
      await handleExportProtocolPdf();
      return;
    }
    if (isExportingPdf || isExportingPptx) return;
    if (isAdminUnlocked) {
      handleSaveAllFromToolbar();
      const root = document.getElementById('document-workspace-root');
      root
        ?.querySelectorAll<HTMLElement>('[contenteditable="true"]')
        .forEach((el) => {
          el.removeAttribute('contenteditable');
          el.classList.remove(
            'outline-2',
            'outline-dashed',
            'outline-[#0284C7]',
            'rounded'
          );
        });
    }
    setIsExportingPdf(true);
    setExportProgress('در حال آماده‌سازی فایل PDF برداری قابل ویرایش...');

    try {
      const targetProposal =
        activeProposal ||
        (viewMode === 'hub' ? proposalsState[0] : null);
      const effectiveUrl =
        digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId);

      const pdfFilename = targetProposal
        ? targetProposal.id === OIL_GAS_EXEC_25H_ID
          ? 'OWJ-CPMAI-OilGas-Exec-25H-Monday-Proposal.pdf'
          : `OWJ-CPMAI-Proposal-0${targetProposal.id.replace('khatam-0', '')}-${targetProposal.repoName}.pdf`
        : 'OWJ-CPMAI-Protocol-Damavand-A4.pdf';

      await exportProposalToVectorPdf(
        targetProposal,
        companyResumeState,
        docMetaState,
        effectiveUrl,
        digitalQrDataUrl,
        (msg) => setExportProgress(msg),
        pdfFilename
      );
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
      setExportProgress('');
    }
  };

  const handleExportPptx = async () => {
    if (isExportingPptx || isExportingPdf) return;
    if (isAdminUnlocked) {
      handleSaveAllFromToolbar();
    }
    setIsExportingPptx(true);
    setExportProgress('در حال آماده‌سازی فایل پاورپوینت...');

    try {
      const targetProposal =
        activeProposal ||
        (viewMode === 'hub' ? proposalsState[0] : null);
      const effectiveUrl =
        digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId);

      await exportProposalToPptx(
        targetProposal,
        companyResumeState,
        docMetaState,
        effectiveUrl,
        digitalQrDataUrl,
        (msg) => setExportProgress(msg)
      );
    } catch (err) {
      console.error('PPTX export error:', err);
    } finally {
      setIsExportingPptx(false);
      setExportProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#0F172A] flex flex-col">
      {/* ==================== ARCHITECTURAL ENGINEERING CORPORATE HEADER ==================== */}
      <header className="no-print sticky top-0 z-40 shadow-[0_10px_30px_rgba(7,25,40,0.28)]">
        <div className="relative overflow-hidden bg-gradient-to-l from-[#091E30] via-[#13354F] to-[#1B4662] text-white px-5 lg:px-10 py-3 flex items-center justify-between gap-4">
          {/* Subtle Architectural Blueprint Grid & Structural Diagonal Lines */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.13]"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="headerEngineeringGrid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#headerEngineeringGrid)" />
            <line
              x1="14%"
              y1="0"
              x2="18%"
              y2="100%"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            <line
              x1="14.7%"
              y1="0"
              x2="18.7%"
              y2="100%"
              stroke="#FBBF24"
              strokeWidth="0.8"
              strokeOpacity="0.35"
            />
            <line
              x1="82%"
              y1="0"
              x2="86%"
              y2="100%"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
          </svg>

          {/* Right Zone (in RTL): OWJ Business Council Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('interactive');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative z-10 flex items-center gap-3 shrink-0 group"
          >
            <img
              src={EXTRACTED_ASSETS.owjLogoWhite}
              alt="OWJ Business Council - مشاوران مدیریت کسب و کار اوج"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="hidden xl:block h-8 w-[2px] bg-gradient-to-b from-transparent via-[#37A3DC]/70 to-transparent -skew-x-12 mr-1"
            />
          </a>

          {/* Center Zone: Precision-Indexed Engineering Navigation Track */}
          {activeProposal ? (
            <nav
              aria-label="ناوبری بخش‌های پروپوزال"
              className="relative z-10 hidden xl:flex items-center gap-0.5 text-[12.5px] font-bold text-slate-200"
            >
              {[
                { id: 'company-resume', num: '۰۱', label: 'رزومه شرکت اوج' },
                { id: 'instructor', num: '۰۲', label: 'رزومه مدرس (۲۳ مدرک)' },
                { id: 'context', num: '۰۳', label: 'ضرورت و چالش‌ها' },
                { id: 'patterns', num: '۰۴', label: '۷ الگوی AI و KPIها' },
                { id: 'workbook', num: '۰۵', label: 'کاربرگ ۶ فاز CPMAI' },
                {
                  id: 'investment',
                  num: '۰۶',
                  label: activeProposal.hideFinancialFee
                    ? 'سرفصل‌ها و زمان‌بندی'
                    : 'سرمایه‌گذاری و سرفصل‌ها',
                },
              ].map((item, idx) => {
                const isActive =
                  viewMode === 'interactive' && activeNavSection === item.id;
                return (
                  <React.Fragment key={item.id}>
                    {idx > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-px bg-white/15 shrink-0 mx-0.5"
                      />
                    )}
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleHeaderSectionNav(e, item.id)}
                      className={`group relative px-2.5 py-2 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-200/90 hover:text-white'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono-num font-black tabular-nums transition-colors ${
                          isActive
                            ? 'text-amber-300'
                            : 'text-[#38BDF8]/75 group-hover:text-amber-300'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-transform duration-200 origin-center ${
                          isActive
                            ? 'bg-gradient-to-l from-amber-400 via-[#38BDF8] to-amber-400 scale-x-100'
                            : 'bg-[#38BDF8] scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  </React.Fragment>
                );
              })}

              <span
                aria-hidden="true"
                className="h-3.5 w-px bg-white/20 shrink-0 mx-1"
              />

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    viewMode === 'brochure' ? 'interactive' : 'brochure'
                  )
                }
                className={`group relative px-2.5 py-2 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'brochure'
                    ? 'text-amber-300 font-extrabold'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono-num font-black tabular-nums text-amber-300">
                  ۰۷
                </span>
                <span>کاتالوگ چاپی (۲۲ صفحه A4)</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-transform duration-200 origin-center ${
                    viewMode === 'brochure'
                      ? 'bg-amber-400 scale-x-100'
                      : 'bg-amber-300 scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            </nav>
          ) : (
            <nav
              aria-label="ناوبری بخش‌های پروتکل"
              className="relative z-10 hidden xl:flex items-center gap-1 text-[13px] font-bold text-slate-200"
            >
              {[
                { id: 'instructor', num: '۰۱', label: 'مدرس و گواهینامه‌ها' },
                { id: 'protocol', num: '۰۲', label: 'پروتکل تجهیزات' },
                {
                  id: 'connection-test',
                  num: '۰۳',
                  label: 'تست اتصال پیش از کلاس',
                },
                { id: 'schedule', num: '۰۴', label: 'زمان‌بندی و مقررات' },
              ].map((item, idx) => {
                const isActive =
                  viewMode === 'interactive' && activeNavSection === item.id;
                return (
                  <React.Fragment key={item.id}>
                    {idx > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-px bg-white/15 shrink-0 mx-0.5"
                      />
                    )}
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleHeaderSectionNav(e, item.id)}
                      className={`group relative px-3 py-2 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-200/90 hover:text-white'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono-num font-black tabular-nums transition-colors ${
                          isActive
                            ? 'text-amber-300'
                            : 'text-[#38BDF8]/75 group-hover:text-amber-300'
                        }`}
                      >
                        {item.num}
                      </span>
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-transform duration-200 origin-center ${
                          isActive
                            ? 'bg-gradient-to-l from-amber-400 via-[#38BDF8] to-amber-400 scale-x-100'
                            : 'bg-[#38BDF8] scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  </React.Fragment>
                );
              })}

              <span
                aria-hidden="true"
                className="h-3.5 w-px bg-white/20 shrink-0 mx-1"
              />

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    viewMode === 'brochure' ? 'interactive' : 'brochure'
                  )
                }
                className={`group relative px-3 py-2 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'brochure'
                    ? 'text-amber-300 font-extrabold'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono-num font-black tabular-nums text-amber-300">
                  ۰۵
                </span>
                <span>کاتالوگ چاپی (۸ صفحه)</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-transform duration-200 origin-center ${
                    viewMode === 'brochure'
                      ? 'bg-amber-400 scale-x-100'
                      : 'bg-amber-300 scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            </nav>
          )}

          {/* Left Zone (in RTL): Structural Chamfer + Export CTAs + AJA Logo */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0">
            <span
              aria-hidden="true"
              className="hidden xl:block h-8 w-[2px] bg-gradient-to-b from-transparent via-[#37A3DC]/70 to-transparent -skew-x-12 ml-1"
            />
            <button
              type="button"
              onClick={handleExportPptx}
              disabled={isExportingPptx || isExportingPdf}
              className="hidden md:flex px-3.5 py-2 text-xs font-bold text-[#0F172A] bg-amber-400 hover:bg-amber-300 disabled:opacity-75 rounded-lg transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 cursor-pointer shadow-sm"
              title="دانلود فایل پاورپوینت قابل ویرایش (.pptx)"
            >
              {isExportingPptx ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{exportProgress || 'در حال ساخت پاورپوینت...'}</span>
                </>
              ) : (
                <>
                  <Presentation className="w-3.5 h-3.5" />
                  <span>خروجی پاورپوینت</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isExportingPdf || isExportingPptx}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#37A3DC] disabled:opacity-75 rounded-lg border border-sky-300/35 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{exportProgress || 'در حال ساخت PDF...'}</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>
                    {viewMode === 'protocol'
                      ? 'دانلود PDF پروتکل A4'
                      : 'دانلود PDF کاتالوگ A4'}
                  </span>
                </>
              )}
            </button>

            <div className="hidden sm:block h-8 w-px bg-white/20" />

            <a
              href="#instructor"
              onClick={(e) => handleHeaderSectionNav(e, 'instructor')}
              className="shrink-0 flex items-center group"
              title="ابوالفضل جعفری اصل — مدرس دوره"
            >
              <img
                src={EXTRACTED_ASSETS.ajaLogoWhite}
                alt="Abolfazl Jafari Asl - ابوالفضل جعفری اصل"
                referrerPolicy="no-referrer"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </a>
          </div>
        </div>

        {/* Precision Engineering Scale Rail + Live Reading Progress Beam */}
        <div className="relative h-2 w-full bg-[#0E2B40] border-t border-sky-400/30 overflow-hidden">
          {/* Fine Architectural Scale Graduations */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to left, rgba(125,211,252,0.55) 0px, rgba(125,211,252,0.55) 1px, transparent 1px, transparent 14px)',
            }}
          />
          {/* Base Cyan Track Accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px] bg-[#37A3DC]/55"
          />
          {/* Live Scroll-Reading Progress Beam (RTL Right-to-Left) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-l from-[#38BDF8] via-[#37A3DC] to-amber-400 origin-right transition-transform duration-150 ease-out"
            style={{
              transform: `scaleX(${Math.max(0.02, scrollProgress)})`,
            }}
          />
        </div>
      </header>

      {/* ==================== WORKSPACE MODE BAR (BELOW TOP BAR) ==================== */}
      <div id="top" className="no-print bg-[#153447] text-white border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <span className="font-bold text-white">
              {viewMode === 'hub'
                ? 'منظومه جامع ۹ پروپوزال PMI-CPMAI v8'
                : viewMode === 'protocol'
                  ? activeProtocolOptions.protocolTitle || DOCUMENT_META.title
                  : activeProposal
                    ? activeProposal.coverMainTitle
                    : DOCUMENT_META.title}
            </span>
            <span aria-hidden="true" className="text-[#37A3DC]">·</span>
            <span>{DOCUMENT_META.organization}</span>
            <span aria-hidden="true" className="text-[#37A3DC]">·</span>
            <span className="text-[#7DD3FC] font-bold">
              {viewMode === 'hub'
                ? 'قرارگاه سازندگی خاتم‌الانبیاء (ص)'
                : viewMode === 'protocol'
                  ? activeProtocolOptions.clientProjectTitle ||
                    DOCUMENT_META.clientProject
                  : activeProposal
                    ? activeProposal.recipientShortOnCover
                    : DOCUMENT_META.clientProject}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-white/10 rounded-lg">
              {(!BUILD_LOCKED_DOC_ID || isAdminUnlocked) && (
                <button
                  type="button"
                  onClick={() => setViewMode('hub')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'hub'
                      ? 'bg-[#37A3DC] text-white shadow-sm font-bold'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span>نمای دایره‌ای ۹ مجموعه قرارگاه</span>
                </button>
              )}
              {(!BUILD_LOCKED_DOC_ID || isAdminUnlocked) && (
                <button
                  type="button"
                  onClick={() => {
                    handleSelectDocument(OIL_GAS_EXEC_25H_ID);
                    setProtocolProfile('oil-gas-exec');
                    if (viewMode === 'hub' || viewMode === 'protocol') {
                      setViewMode('brochure');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeDocId === OIL_GAS_EXEC_25H_ID &&
                    viewMode !== 'hub' &&
                    viewMode !== 'protocol'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-amber-300 hover:bg-white/10 hover:text-amber-200'
                  }`}
                  title="پروپوزال مستقل دوره ۲۵ ساعته مدیران مؤسسات هلدینگ نفت و گاز (دوشنبه‌ها ۰۷:۰۰ الی ۰۹:۳۰)"
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>دوره ۲۵ ساعته نفت و گاز</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-white text-[#1D4760] shadow-sm font-bold'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {activeProposal
                    ? 'نمای وب تعاملی'
                    : 'نمای وب تعاملی و چک‌لیست'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('brochure')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'brochure'
                    ? 'bg-white text-[#1D4760] shadow-sm font-bold'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {activeProposal
                    ? 'کاتالوگ ۲۲ صفحه‌ای (A4)'
                    : 'کاتالوگ ۸ صفحه‌ای (A4)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeDocId === OIL_GAS_EXEC_25H_ID) {
                    setProtocolProfile('oil-gas-exec');
                  } else if (activeDocId === 'damavand') {
                    setProtocolProfile('damavand');
                  }
                  setViewMode('protocol');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'protocol'
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'text-emerald-200 hover:bg-white/10 hover:text-white'
                }`}
                title="سند مستقل پروتکل برگزاری و آغاز دوره (قابل چاپ مستقیم و PDF)"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>پروتکل برگزاری دوره (چاپ / PDF)</span>
              </button>
            </div>

            {viewMode !== 'hub' && (
              <button
                type="button"
                onClick={() => setIsSpotlightSelectionMode((prev) => !prev)}
                title="ابزار انتخاب و زوم روی بخش دلخواه متن (مات کردن پس‌زمینه)"
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSpotlightSelectionMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-amber-200 border-white/15'
                }`}
              >
                <ScanSearch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">زوم و تمرکز</span>
              </button>
            )}

            {viewMode !== 'hub' &&
              viewMode !== 'protocol' &&
              activeProposal &&
              activeProposal.id !== OIL_GAS_EXEC_25H_ID &&
              (!BUILD_LOCKED_DOC_ID || isAdminUnlocked) && (
                <button
                  type="button"
                  onClick={() => setShowOrbitalDial((prev) => !prev)}
                  title="نمایش یا مخفی‌سازی ولوم چرخان ۹ پروپوزال"
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    showOrbitalDial
                      ? 'bg-[#37A3DC] text-white border-[#37A3DC] shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-sky-200 border-white/15'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ولوم ۹ پروپوزال</span>
                </button>
              )}

            {/* Admin Login / Edit Mode Trigger Button */}
            {!isAdminUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  setShowAdminLoginBar((prev) => !prev);
                  setAdminPasswordError('');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  showAdminLoginBar
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/15'
                }`}
                title="ورود ادمین جهت ویرایش متنی سند (رمز: ۱۲۳)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش متنی ادمین</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminEditorModal(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>پنل ویرایش متنی فعال ✓</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Password Prompt Bar (Password: 123 / ۱۲۳) */}
        {showAdminLoginBar && !isAdminUnlocked && (
          <div className="bg-[#0B253A] border-t border-white/15 px-6 lg:px-10 py-3">
            <form
              onSubmit={handleAdminPasswordSubmit}
              className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  جهت فعال‌سازی قابلیت ویرایش متنی سند و ذخیره تغییرات، رمز عبور ادمین را وارد نمایید:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  dir="ltr"
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (adminPasswordError) setAdminPasswordError('');
                  }}
                  placeholder="رمز ادمین (123)..."
                  className="w-44 px-3 py-1.5 text-xs font-mono-num bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#37A3DC]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  ورود به حالت ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginBar(false);
                    setAdminPasswordError('');
                    setAdminPasswordInput('');
                  }}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                  title="بستن"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {adminPasswordError && (
                <p className="w-full text-xs font-bold text-red-400">
                  {adminPasswordError}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Active Admin Editing Toolbar */}
        {isAdminUnlocked && (
          <div className="bg-gradient-to-l from-[#064E3B] via-[#065F46] to-[#047857] text-white border-t border-white/15 px-6 lg:px-10 py-2.5 shadow-inner">
            <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white/15 font-black text-emerald-200 flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>حالت مدیریت و ویرایش متنی سند فعال است</span>
                </span>
                <span className="text-emerald-100 hidden md:inline">
                  {isDirectEditMode
                    ? 'روی هر متنی در صفحه (وب یا کاتالوگ چاپی) کلیک کنید، متن را ویرایش نمایید و دکمه «ذخیره تغییرات» را بزنید.'
                    : 'حالت ویرایش مستقیم غیرفعال است؛ می‌توانید از پنل ویرایش فرمی استفاده کنید.'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {adminSavedBanner && (
                  <span className="px-3 py-1 rounded-lg bg-white text-emerald-800 text-xs font-black flex items-center gap-1 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>تغییرات ذخیره شد!</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsDirectEditMode((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isDirectEditMode
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>
                    {isDirectEditMode
                      ? 'ویرایش مستقیم روی صفحه: فعال ✓'
                      : 'فعال‌سازی ویرایش مستقیم روی صفحه'}
                  </span>
                </button>

                {activeProposal && (
                  <button
                    type="button"
                    onClick={() => setShowAdminEditorModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>پنل ویرایش بخش‌به‌بخش</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveAllFromToolbar}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-[#064E3B] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ذخیره تغییرات (Save)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCurrentProposalToDefault}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="بازگردانی متون به حالت اولیه"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">بازنشانی</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSaveAllFromToolbar();
                    setIsAdminUnlocked(false);
                    setShowUrlConfig(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-black/25 hover:bg-black/40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="خروج از حالت ویرایش ادمین"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>قفل</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== CONDITIONAL VIEW: CIRCULAR HUB / 23-PAGE BROCHURE / INTERACTIVE ==================== */}
      <div
        id="document-workspace-root"
        onClickCapture={handleWorkspaceClickCapture}
        onBlurCapture={handleWorkspaceBlurCapture}
        className="flex-1 flex flex-col"
      >
      {viewMode === 'hub' ? (
        <>
          <KhatamCircularHubPortal
            proposals={proposalsState}
            selectedProposalId={
              activeProposal && activeProposal.id !== OIL_GAS_EXEC_25H_ID
                ? activeProposal.id
                : 'khatam-01'
            }
            onFocusProposal={(id) => handleSelectDocument(id)}
            onSelectProposalAndOpen={(id, targetMode) => {
              handleSelectDocument(id);
              if (id === OIL_GAS_EXEC_25H_ID && targetMode === 'protocol') {
                setProtocolProfile('oil-gas-exec');
              }
              setViewMode(targetMode);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <div className="hidden print:block">
            <KhatamProposalBrochurePages
              proposal={activeProposal || proposalsState[0]}
              companyResume={companyResumeState}
              documentMeta={docMetaState}
              digitalUrl={
                digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId)
              }
              digitalQrDataUrl={digitalQrDataUrl}
            />
          </div>
        </>
      ) : viewMode === 'protocol' ? (
        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-10">
          <div className="no-print no-print-admin-ignore max-w-[850px] mx-auto mb-8 bg-white border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                    فایل مستقل «پروتکل» — پروتکل شروع دوره + فصل ۶ (الزامات سالن و زمان‌بندی)
                  </span>
                  <span className="text-xs font-bold text-[#0284C7]">
                    · مجزا از فایل پروپوزال · آماده چاپ مستقیم و دانلود PDF
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#0B253A]">
                  {activeProtocolOptions.protocolTitle} —{' '}
                  {activeProtocolOptions.clientProjectTitle}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  زمان‌بندی رسمی این پروتکل:{' '}
                  <strong className="text-[#1D4760]">
                    {activeProtocolOptions.scheduleSummary}
                  </strong>
                </p>
              </div>
            </div>

            {/* Audience / Protocol Profile Selector */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 ml-1">
                انتخاب نسخه پروتکل:
              </span>
              <button
                type="button"
                onClick={() => setProtocolProfile('oil-gas-exec')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  protocolProfile === 'oil-gas-exec'
                    ? 'bg-[#0B253A] text-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                مدیران مؤسسات هلدینگ نفت و گاز (دوشنبه‌ها ۰۷:۰۰–۰۹:۳۰)
              </button>
              {activeProposal && activeProposal.id !== OIL_GAS_EXEC_25H_ID && (
                <button
                  type="button"
                  onClick={() => setProtocolProfile('active-holding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    protocolProfile === 'active-holding'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  پروتکل {activeProposal.recipientShortOnCover}
                </button>
              )}
              <button
                type="button"
                onClick={() => setProtocolProfile('damavand')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  protocolProfile === 'damavand'
                    ? 'bg-[#1D4760] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                طرح پتروشیمی دماوند (۸ ساعته)
              </button>
            </div>

            {/* Dedicated Standalone Protocol Actions: PDF + Print + Share Link + Jump to Proposal */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleExportProtocolPdf}
                disabled={isExportingPdf || isExportingPptx}
                className="px-4 py-2.5 text-xs font-black text-white bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-75 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{exportProgress || 'در حال ساخت PDF پروتکل...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>دانلود مستقیم فایل «پروتکل» (PDF)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectBrowserPrint}
                className="px-4 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ مستقیم پروتکل (Print A4)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyShareUrl('protocol')}
                className="px-3.5 py-2.5 text-xs font-bold text-[#1D4760] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDirectLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>لینک پروتکل کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی لینک مستقیم پروتکل</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (protocolProfile === 'oil-gas-exec') {
                    handleSelectDocument(OIL_GAS_EXEC_25H_ID);
                  }
                  setViewMode('brochure');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {protocolProfile === 'oil-gas-exec'
                    ? 'مشاهده پروپوزال ۲۵ ساعته'
                    : 'بازگشت به کاتالوگ پروپوزال'}
                </span>
              </button>
            </div>
          </div>

          <RedesignedBrochurePages
            onSelectImage={(src, title) => setLightbox({ src, title })}
            digitalUrl={getAutoDetectedPublicUrl(
              protocolProfile === 'oil-gas-exec'
                ? OIL_GAS_EXEC_25H_ID
                : protocolProfile === 'damavand'
                  ? 'damavand'
                  : activeDocId,
              'protocol'
            )}
            digitalQrDataUrl={digitalQrDataUrl}
            protocolTitle={activeProtocolOptions.protocolTitle}
            clientProjectTitle={activeProtocolOptions.clientProjectTitle}
            scheduleSummary={activeProtocolOptions.scheduleSummary}
            customSchedule={activeProtocolOptions.customSchedule}
            extraPrepNote={activeProtocolOptions.extraPrepNote}
            executiveLetterOverride={
              activeProtocolOptions.executiveLetterOverride
            }
          />
        </main>
      ) : viewMode === 'brochure' ? (
        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-10">
          <div className="no-print no-print-admin-ignore max-w-[850px] mx-auto mb-8 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-[#0284C7] text-xs font-black">
                    {(() => {
                      const pgFa = (
                        22 -
                        (activeProposal?.separateProtocolDocument ? 1 : 0) -
                        (activeProposal?.excludedCoachIds?.length ?? 0)
                      )
                        .toString()
                        .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
                      return activeProposal?.separateProtocolDocument
                        ? `نسخه نهایی ${pgFa} صفحه‌ای (صفحه ۱ تا ${pgFa} · پروتکل در فایل مجزا)`
                        : `نسخه نهایی ${pgFa} صفحه‌ای (صفحه ۱ تا ${pgFa})`;
                    })()}
                  </span>
                  {activeDocId === OIL_GAS_EXEC_25H_ID ? (
                    <span className="text-xs font-bold text-amber-700">
                      · دوره ویژه ۲۵ ساعته (۱۰ جلسه ۲.۵ ساعته · داده‌های فرضی آموزشی · بدون بخش پروتکل)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700">
                      · جلد، نامه رسمی، فهرست، مدرس و کوچ‌های ارشد، کارنامه اوج، فصول پروپوزال و پیشنهاد مالی
                    </span>
                  )}
                </div>
                <h2 className="text-base font-extrabold text-[#1D4760]">
                  {(() => {
                    const pgFa = (
                      22 -
                      (activeProposal?.separateProtocolDocument ? 1 : 0) -
                      (activeProposal?.excludedCoachIds?.length ?? 0)
                    )
                      .toString()
                      .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
                    return activeProposal?.separateProtocolDocument
                      ? `پیش‌نمایش کاتالوگ رسمی پروپوزال ${pgFa} صفحه‌ای (پروتکل شروع دوره و فصل ۶ در فایل مجزای «پروتکل»)`
                      : `پیش‌نمایش ایبوک و کاتالوگ رسمی ${pgFa} صفحه‌ای منطبق بر فرمت استاندارد (چاپ A4)`;
                  })()}
                </h2>
                <p className="text-xs text-slate-600">
                  در فایل‌های خروجی (PDF و پاورپوینت)، کد QR روی جلد و تمامی لینک‌های ارتباطی به‌صورت مستقیم فعال هستند.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isExportingPdf || isExportingPptx}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-75 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{exportProgress || 'در حال ساخت PDF...'}</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5" />
                      <span>
                        {(() => {
                          const pgFa = (
                            22 -
                            (activeProposal?.separateProtocolDocument ? 1 : 0) -
                            (activeProposal?.excludedCoachIds?.length ?? 0)
                          )
                            .toString()
                            .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
                          return activeProposal?.separateProtocolDocument
                            ? `دانلود مستقیم PDF پروپوزال (${pgFa} صفحه)`
                            : `دانلود مستقیم PDF (${pgFa} صفحه A4)`;
                        })()}
                      </span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleExportPptx}
                  disabled={isExportingPptx || isExportingPdf}
                  className="px-4 py-2.5 text-xs font-bold text-[#0F172A] bg-amber-400 hover:bg-amber-300 disabled:opacity-75 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isExportingPptx ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{exportProgress || 'در حال ساخت پاورپوینت...'}</span>
                    </>
                  ) : (
                    <>
                      <Presentation className="w-3.5 h-3.5" />
                      <span>دانلود پاورپوینت (.pptx)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeDocId === OIL_GAS_EXEC_25H_ID) {
                      setProtocolProfile('oil-gas-exec');
                    }
                    setViewMode('protocol');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>پروتکل برگزاری دوره</span>
                </button>
                {activeDocId === OIL_GAS_EXEC_25H_ID && (
                  <button
                    type="button"
                    onClick={() => handleCopyShareUrl('brochure')}
                    className="px-3 py-2.5 text-xs font-bold text-[#1D4760] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedDirectLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>لینک کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی لینک مجزا</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode('interactive')}
                  className="px-3 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  نمای وب تعاملی
                </button>
                {(!BUILD_LOCKED_DOC_ID || isAdminUnlocked) &&
                  activeProposal &&
                  activeProposal.id !== OIL_GAS_EXEC_25H_ID && (
                    <button
                      type="button"
                      onClick={() => setShowOrbitalDial((prev) => !prev)}
                      title="نمایش یا مخفی‌سازی کنترلر دایره‌ای شناور (حالت ولوم)"
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        showOrbitalDial
                          ? 'bg-[#0B253A] text-amber-300 border-[#37A3DC]'
                          : 'bg-slate-50 text-slate-500 hover:text-[#1D4760] border-slate-200'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                    </button>
                  )}
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlConfig((prev) => !prev);
                    setAdminPasswordError('');
                  }}
                  title="تنظیمات آدرس QR کد (محافظت‌شده با رمز عبور)"
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    showUrlConfig
                      ? 'bg-[#1D4760] text-white border-[#1D4760]'
                      : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Password-Protected Digital URL & QR Code Configurator */}
            {showUrlConfig && !isAdminUnlocked && (
              <form
                onSubmit={handleAdminPasswordSubmit}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#1D4760]">
                  <Lock className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>جهت دسترسی به تنظیمات لینک و QR کد، رمز عبور مدیریت را وارد نمایید:</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    dir="ltr"
                    autoFocus
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (adminPasswordError) setAdminPasswordError('');
                    }}
                    placeholder="Password..."
                    className="w-44 px-3 py-1.5 text-xs font-latin bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1D4760] hover:bg-[#0B253A] rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    تأیید
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlConfig(false);
                      setAdminPasswordError('');
                      setAdminPasswordInput('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                    title="بستن"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {adminPasswordError && (
                  <p className="w-full text-[11px] font-semibold text-red-600">
                    {adminPasswordError}
                  </p>
                )}
              </form>
            )}

            {showUrlConfig && isAdminUnlocked && (
              <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-extrabold text-[#1D4760] flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#0284C7]" />
                      <span>آدرس اینترنتی (URL) نسخه دیجیتال جهت درج در QR کد روی جلد و هایپرلینک‌های PDF:</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem(
                            `${DIGITAL_URL_STORAGE_KEY}_${activeDocId}`
                          );
                          setDigitalUrl(getAutoDetectedPublicUrl(activeDocId));
                        }}
                        className="text-[11px] font-semibold text-[#0284C7] hover:underline cursor-pointer"
                      >
                        تشخیص خودکار آدرس دامنه
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminUnlocked(false);
                          setShowUrlConfig(false);
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3 h-3" />
                        <span>قفل کردن پنل</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        dir="ltr"
                        value={digitalUrl}
                        onChange={(e) => setDigitalUrl(e.target.value)}
                        placeholder="https://ajaowjbc-debug.github.io/khatam-cpmai-01-command/"
                        className="w-full pl-9 pr-3 py-2 text-xs font-latin bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] text-slate-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyDigitalUrl}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedUrl ? 'کپی شد!' : 'کپی لینک'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    این پنل با رمز عبور محافظت شده و برای مخاطبان قابل مشاهده نیست. همچنین سامانه به صورت خودکار آدرس هر دامنه‌ای که روی آن منتشر شود را تشخیص می‌دهد.
                  </p>
                </div>

                {digitalQrDataUrl && (
                  <div className="shrink-0 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 self-center">
                    <img
                      src={digitalQrDataUrl}
                      alt="QR Code"
                      className="w-16 h-16 object-contain"
                    />
                    <div className="space-y-1 text-right">
                      <span className="text-[11px] font-bold text-[#1D4760] block">
                        پیش‌نمایش QR جلد
                      </span>
                      <a
                        href={digitalQrDataUrl}
                        download="OWJ-CPMAI-Digital-QR.png"
                        onClick={(e) => {
                          if (isTauriDesktop()) {
                            e.preventDefault();
                            void saveImageAsset(
                              digitalQrDataUrl,
                              'OWJ-CPMAI-Digital-QR.png'
                            );
                          }
                        }}
                        className="text-[11px] font-semibold text-[#0284C7] hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>دانلود تصویر QR</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeProposal ? (
            <KhatamProposalBrochurePages
              proposal={activeProposal}
              companyResume={companyResumeState}
              documentMeta={docMetaState}
              onSelectImage={(src, title) => setLightbox({ src, title })}
              digitalUrl={
                digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId)
              }
              digitalQrDataUrl={digitalQrDataUrl}
            />
          ) : (
            <RedesignedBrochurePages
              onSelectImage={(src, title) => setLightbox({ src, title })}
              digitalUrl={
                digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId)
              }
              digitalQrDataUrl={digitalQrDataUrl}
            />
          )}
        </main>
      ) : activeProposal ? (
        <>
          <KhatamInteractiveProposal
            proposal={activeProposal}
            allProposals={proposalsState}
            companyResume={companyResumeState}
            documentMeta={docMetaState}
            digitalQrDataUrl={digitalQrDataUrl}
            onSwitchToBrochure={() => setViewMode('brochure')}
            onOpenProtocol={() => {
              if (activeProposal.id === OIL_GAS_EXEC_25H_ID) {
                setProtocolProfile('oil-gas-exec');
              } else {
                setProtocolProfile('active-holding');
              }
              setViewMode('protocol');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrintPdf={handlePrint}
            onExportPptx={handleExportPptx}
            isExportingPptx={isExportingPptx}
            onSelectImage={(src, title) => setLightbox({ src, title })}
            onSelectProposal={(id) => handleSelectDocument(id)}
          />
          <div className="hidden print:block">
            <KhatamProposalBrochurePages
              proposal={activeProposal}
              companyResume={companyResumeState}
              documentMeta={docMetaState}
              digitalUrl={
                digitalUrl.trim() || getAutoDetectedPublicUrl(activeDocId)
              }
              digitalQrDataUrl={digitalQrDataUrl}
            />
          </div>
        </>
      ) : (
        /* ==================== INTERACTIVE WEB REDESIGN VIEW (DAMAVAND PROTOCOL) ==================== */
        <>
          <main className="no-print flex-1">
            {/* 1. HERO SECTION (PAGE 1 REDESIGNED) */}
            <section className="relative bg-white border-b border-slate-200/90 overflow-hidden">
              <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                  {/* Right Column in RTL: Editorial Typography & Core Identity */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                      {/* Unboxed Metadata Line + Crisp Navy OWJ Logo */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="text-[#0284C7] font-bold">پروتکل رسمی آموزش سازمانی</span>
                          <span aria-hidden="true">·</span>
                          <span>دپارتمان کوچینگ اوج</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-latin">PMI-CPMAI / CPMAI v7</span>
                        </div>

                        <img
                          src={EXTRACTED_ASSETS.owjLogoNavy}
                          alt="لوگوی مشاوران مدیریت کسب و کار اوج"
                          referrerPolicy="no-referrer"
                          className="h-11 w-auto object-contain"
                        />
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-bold text-[#0284C7]">
                          سلسله کارگاه‌های آموزشی تربیت متخصص حرفه‌ای راهبری هوش مصنوعی
                        </p>
                        <h1
                          className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#0B253A] leading-[1.25] tracking-tight"
                          style={{ textWrap: 'balance' }}
                        >
                          {DOCUMENT_META.title}
                        </h1>
                        <p className="text-xl sm:text-2xl font-bold text-slate-700">
                          {DOCUMENT_META.organization}
                        </p>
                      </div>

                      {/* Target Client Highlight Card */}
                      <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            تهیه و تدوین اختصاصی جهت اجرا در مجموعه معظم:
                          </span>
                          <span className="text-xs font-mono-num text-slate-500">
                            ۹ بند اجرایی · ۲۳ گواهینامه بین‌المللی مدرس
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-[#0284C7]">
                          {DOCUMENT_META.clientProject}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          این سند شامل معرفی سوابق و گواهینامه‌های ۱۳گانه هوش مصنوعی مدرس دوره، ابلاغیه دپارتمان کوچینگ، استانداردهای فنی سالن، مشخصات سیستم شرکت‌کنندگان، پوستر تست اتصال پیش از کلاس، جدول زمان‌بندی و ضوابط حفظ حقوق مالکیت معنوی است.
                        </p>
                      </div>
                    </div>

                    {/* Action Row & Preserved Contact Strip */}
                    <div className="space-y-6 pt-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href="#protocol"
                          className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#1D4760] hover:bg-[#0284C7] rounded-xl transition-colors whitespace-nowrap shrink-0"
                        >
                          بررسی الزامات و چک‌لیست آماده‌سازی سالن
                        </a>
                        <a
                          href="#connection-test"
                          className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                        >
                          <Wifi className="w-4 h-4" />
                          <span>پروتکل تست اتصال پیش از کلاس</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setViewMode('brochure')}
                          className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#1D4760] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          مشاهده کاتالوگ چاپی
                        </button>
                      </div>

                      {/* Preserved Original Contact Strip Image from Page 1 */}
                      <div className="pt-4 border-t border-slate-200">
                        <img
                          src={EXTRACTED_ASSETS.contactStrip}
                          alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                          referrerPolicy="no-referrer"
                          className="w-full max-w-2xl h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Left Column in RTL: Full Uncropped Picture5.jpg Cover Artwork */}
                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div
                      onClick={() =>
                        setLightbox({
                          src: EXTRACTED_ASSETS.coverFull,
                          title: 'تصویر کامل روی جلد — پروتکل برگزاری بوت کمپ آموزشی CPMAI',
                        })
                      }
                      className="relative w-full max-w-[460px] aspect-[1648/2381] rounded-2xl overflow-hidden border border-slate-200 shadow-xl group cursor-pointer bg-white"
                    >
                      <img
                        src={EXTRACTED_ASSETS.coverFull}
                        alt="پروتکل برگزاری بوت کمپ آموزشی CPMAI - طرح پتروشیمی دماوند"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />

                      {/* Bottom 29.5% Cover Typography, QR Code & Contact Strip placed directly on Picture5's lower canvas */}
                      <div className="absolute inset-x-0 bottom-0 h-[29.5%] px-5 pb-3.5 pt-1 flex flex-col justify-between text-right">
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <p className="text-xs sm:text-sm font-black text-[#0F172A] leading-snug">
                              {DOCUMENT_META.title}
                            </p>
                            <p className="text-sm sm:text-base font-black text-[#0F172A] leading-snug">
                              {DOCUMENT_META.organization}
                            </p>
                            <div className="w-full h-[2px] bg-[#37A3DC] my-1" />
                            <p className="text-sm sm:text-base font-extrabold text-[#37A3DC]">
                              {DOCUMENT_META.clientProject}
                            </p>
                          </div>

                          {digitalQrDataUrl && (
                            <div className="shrink-0 bg-white/95 border border-[#37A3DC] rounded-xl p-1.5 shadow-sm flex flex-col items-center text-center">
                              <img
                                src={digitalQrDataUrl}
                                alt="QR نسخه دیجیتال"
                                className="w-14 h-14 object-contain"
                              />
                              <span className="text-[8.5px] font-extrabold text-[#1D4760] mt-0.5">
                                نسخه دیجیتال
                              </span>
                            </div>
                          )}
                        </div>

                        <img
                          src={EXTRACTED_ASSETS.contactStrip}
                          alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-contain"
                        />
                      </div>

                      <div className="absolute top-3 left-3 bg-[#1D4760]/85 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5 text-[#37A3DC]" />
                        <span>بزرگ‌نمایی طرح کامل جلد</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full-Width 4-Column Key Summary Strip Below Hero Split */}
                <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
                    <span className="text-xs text-slate-500 block">مدرس دوره</span>
                    <strong className="text-base font-extrabold text-[#0B253A] block">
                      {DOCUMENT_META.instructorName}
                    </strong>
                    <span className="text-xs text-[#0284C7] block">
                      مدیرعامل مشاوران مدیریت کسب و کار اوج
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
                    <span className="text-xs text-slate-500 block">مرجع استاندارد آموزشی</span>
                    <strong className="text-base font-extrabold text-[#0B253A] font-latin block">
                      PMI-CPMAI & CPMAI v7
                    </strong>
                    <span className="text-xs text-slate-600 block">
                      دارنده هر ۱۳ گواهینامه هوش مصنوعی PMI و Cognilytica
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
                    <span className="text-xs text-slate-500 block">ساعات برگزاری روزانه</span>
                    <strong className="text-base font-extrabold text-[#0B253A] font-mono-num block">
                      ۰۷:۳۰ الی ۱۷:۰۰
                    </strong>
                    <span className="text-xs text-slate-600 block">
                      صبحانه ۰۶:۳۰ تا ۰۷:۱۵ · ناهار و نماز ۱۲:۰۰ تا ۱۳:۰۰
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
                    <span className="text-xs text-slate-500 block">پیشرفت آماده‌سازی سالن</span>
                    <strong className="text-base font-extrabold text-[#0284C7] font-mono-num block">
                      {completedCount} از {PROTOCOL_CLAUSES.length} بند اجرایی
                    </strong>
                    <span className="text-xs text-slate-600 block">
                      قابل تیک‌زدن در بخش چک‌لیست اجرایی پایین صفحه
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. OFFICIAL EXECUTIVE FOREWORD (PAGE 4 CONTENT) */}
            <section id="letter" className="py-14 lg:py-20 px-6 lg:px-10 max-w-[1320px] mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 lg:p-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 space-y-3 border-b lg:border-b-0 lg:border-l border-slate-200 pb-6 lg:pb-0 lg:pl-8">
                    <div className="text-xs font-semibold text-[#0284C7]">
                      صفحه ۴ سند · مکاتبه رسمی با کارفرما
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A] leading-tight">
                      ابلاغیه اجرای کامل پروتکل کارگاه‌های آموزشی CPMAI
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      صادرشده توسط {EXECUTIVE_LETTER.department} {EXECUTIVE_LETTER.company} خطاب به واحد مجری و ناظر کارگاه‌های آموزشی در {DOCUMENT_META.clientProject}
                    </p>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    <div className="text-base font-bold text-[#0B253A]">
                      {EXECUTIVE_LETTER.invocation}
                    </div>
                    <p className="text-base sm:text-lg leading-[2.2] text-slate-800 text-justify">
                      {EXECUTIVE_LETTER.body}
                    </p>
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-slate-500">
                        سند اختصاصی جهت بهره‌برداری در واحد آموزش و فناوری اطلاعات کارفرما
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-slate-500 block">
                          {EXECUTIVE_LETTER.signOff}
                        </span>
                        <span className="text-sm font-extrabold text-[#0284C7] block">
                          {EXECUTIVE_LETTER.department}
                        </span>
                        <span className="text-xs font-bold text-[#0B253A] block">
                          {EXECUTIVE_LETTER.company}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. INSTRUCTOR PROFILE, 23 CREDENTIALS & OFFICIAL PMI CERTIFICATES (PAGES 2 & 3) */}
            <section
              id="instructor"
              className="py-14 lg:py-20 bg-white border-y border-slate-200/90"
            >
              <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-12">
                {/* Instructor Hero Banner (Preserving Portrait obj_24, QR obj_26, AJA Logo obj_40, OWJ Logo obj_27) */}
                <div className="rounded-2xl overflow-hidden bg-gradient-to-l from-[#0B253A] via-[#1E1B4B] to-[#3B1D5E] text-white shadow-lg border border-slate-800">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Right Column: Instructor Bio & QR Code */}
                    <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
                          <div className="flex items-center gap-4">
                            <img
                              src={EXTRACTED_ASSETS.owjLogoWhite}
                              alt="OWJ Business Council"
                              referrerPolicy="no-referrer"
                              className="h-12 w-auto object-contain"
                            />
                            <div className="h-8 w-px bg-white/20" />
                            <span className="text-xs sm:text-sm font-semibold text-sky-300">
                              مدرس دوره:
                            </span>
                          </div>
                          <img
                            src={EXTRACTED_ASSETS.ajaLogoWhite}
                            alt="AJA Abolfazl Jafari Asl"
                            referrerPolicy="no-referrer"
                            className="h-11 w-auto object-contain"
                          />
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                          {DOCUMENT_META.instructorName}
                        </h2>
                        <p className="text-lg sm:text-xl font-bold text-sky-200">
                          {DOCUMENT_META.instructorRole}
                        </p>
                        <p className="text-sm sm:text-base leading-relaxed text-indigo-100 max-w-2xl">
                          {DOCUMENT_META.instructorDistinction}
                        </p>
                      </div>

                      {/* Preserved QR Code Card */}
                      <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div
                            onClick={() =>
                              setLightbox({
                                src: EXTRACTED_ASSETS.qrCode,
                                title: 'کد QR رسمی ابوالفضل جعفری اصل',
                              })
                            }
                            className="bg-white p-2.5 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                          >
                            <img
                              src={EXTRACTED_ASSETS.qrCode}
                              alt="QR Code Abolfazl Jafari Asl"
                              referrerPolicy="no-referrer"
                              className="w-20 h-20 object-contain"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white">
                              کد QR ارتباطی و استعلام مدارک مدرس
                            </p>
                            <p className="text-xs text-slate-300">
                              برای مشاهده تصویر کامل کد QR روی آن کلیک نمایید
                            </p>
                            <p className="text-xs font-latin text-sky-300">
                              (PMI-CPMAI) · (CPMAI v7) · (PMI)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left Column: Preserved Instructor Portrait Banner (obj_24 + mask_25) */}
                    <div className="lg:col-span-5 relative flex items-center justify-center p-6 lg:p-8 bg-black/20">
                      <div
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.instructorBanner,
                            title:
                              'ابوالفضل جعفری اصل — مدیرعامل شرکت مشاوران مدیریت کسب و کار اوج',
                          })
                        }
                        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-xl cursor-pointer group bg-[#2B2653]"
                      >
                        <img
                          src={EXTRACTED_ASSETS.instructorBanner}
                          alt={DOCUMENT_META.instructorName}
                          referrerPolicy="no-referrer"
                          className="w-full h-[360px] object-cover masked-instructor-banner transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{ objectPosition: '18% center' }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-sky-300" />
                          <span>مشاهده پرتره اصلی</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preserved 4 Accrediting Institution Logos Strip (PMI, AXELOS, IPMA, IranPMA) */}
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-[#0B253A]">
                        نهادهای بین‌المللی و ملی صادرکننده گواهینامه‌های مدرس
                      </h3>
                      <p className="text-xs text-slate-500">
                        موسسه مدیریت پروژه آمریکا (PMI) · موسسه AXELOS انگلستان · انجمن جهانی مدیریت پروژه (IPMA) · انجمن مدیریت پروژه ایران (IranPMA)
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center bg-white px-6 py-4 rounded-xl border border-slate-200/80 shrink-0">
                      <img
                        src={EXTRACTED_ASSETS.pmiLogo}
                        alt="PMI Project Management Institute"
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.pmiLogo,
                            title: 'Project Management Institute (PMI)',
                          })
                        }
                        className="h-11 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img
                        src={EXTRACTED_ASSETS.axelosLogo}
                        alt="AXELOS Global Best Practice"
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.axelosLogo,
                            title: 'AXELOS Global Best Practice',
                          })
                        }
                        className="h-9 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img
                        src={EXTRACTED_ASSETS.ipmaLogo}
                        alt="IPMA International Project Management Association"
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.ipmaLogo,
                            title: 'International Project Management Association (IPMA)',
                          })
                        }
                        className="h-11 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img
                        src={EXTRACTED_ASSETS.iranPmaLogo}
                        alt="IranPMA انجمن مدیریت پروژه ایران"
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.iranPmaLogo,
                            title: 'انجمن مدیریت پروژه ایران (IranPMA)',
                          })
                        }
                        className="h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>
                </div>

                {/* Official PMI Certificates Showcase (Preserved Images obj_48.jpg & obj_46.jpg from Page 3) */}
                <div className="space-y-5">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-[#0284C7] block">
                        اسناد رسمی پیوست‌شده در صفحه ۳ کاتالوگ
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#0B253A] mt-1">
                        تصاویر گواهینامه‌های رسمی PMI آمریکا (CPMAI v7 و PMI-CPMAI)
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      برای بررسی جزئیات، امضاها و شماره گواهینامه روی هر تصویر کلیک کنید
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {OFFICIAL_CERTIFICATES.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => setLightbox({ src: cert.image, title: cert.titleFa })}
                        className="group cursor-pointer rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 hover:border-[#0284C7] transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200/80 p-2">
                          <img
                            src={cert.image}
                            alt={cert.titleEn}
                            referrerPolicy="no-referrer"
                            className="w-full h-64 sm:h-72 object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute top-3 left-3 bg-[#0B253A]/85 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-3.5 h-3.5 text-[#38BDF8]" />
                            <span>بزرگ‌نمایی گواهینامه</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 px-1">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-latin font-semibold text-[#0284C7]">
                              {cert.titleEn}
                            </span>
                            <span className="font-mono-num">
                              Certification No: {cert.certNumber}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-[#0B253A]">{cert.titleFa}</h4>
                          <p className="text-xs text-slate-500 font-latin">
                            Issued by {cert.issuer} · Grant Date: {cert.grantDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Filterable 23 Credentials Directory (13 AI Certs + 10 PM Certs) */}
                <div className="space-y-6 pt-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                        فهرست کامل گواهینامه‌های ۱۳گانه هوش مصنوعی و ۱۰ مدرک مدیریت پروژه
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        تمامی عناوین مندرج در صفحات ۲ و ۳ سند اصلی به صورت کامل و بدون هیچ‌گونه حذفیات
                      </p>
                    </div>

                    {/* Interactive Segmented Filter Control + Search */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setCredFilter('all')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            credFilter === 'all'
                              ? 'bg-white text-[#0B253A] shadow-sm font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          همه موارد (۲۳)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCredFilter('ai')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            credFilter === 'ai'
                              ? 'bg-white text-[#0B253A] shadow-sm font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          گواهینامه‌های ۱۳گانه هوش مصنوعی (۱۳)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCredFilter('pm')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            credFilter === 'pm'
                              ? 'bg-white text-[#0B253A] shadow-sm font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          مدارک مدیریت پروژه (۱۰)
                        </button>
                      </div>

                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={credSearch}
                          onChange={(e) => setCredSearch(e.target.value)}
                          placeholder="جستجو در گواهینامه‌ها..."
                          className="pr-9 pl-3 py-1.5 text-xs bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7] w-52"
                        />
                      </div>
                    </div>
                  </div>

                  {filteredCredentials.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8FAFC] rounded-xl border border-slate-200 space-y-2">
                      <p className="text-sm font-semibold text-slate-700">
                        موردی مطابق با عبارت جستجوشده یافت نشد.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCredFilter('all');
                          setCredSearch('');
                        }}
                        className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                      >
                        نمایش مجدد تمامی ۲۳ گواهینامه
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredCredentials.map((cred) => (
                        <div
                          key={cred.id}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between gap-2 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-mono-num font-bold text-[#0284C7] mt-0.5 shrink-0">
                              {cred.index}.
                            </span>
                            <p className="text-sm font-semibold text-[#0B253A] leading-relaxed">
                              {cred.titleFa}
                            </p>
                          </div>
                          <div className="pr-6 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                            <span>
                              {cred.groupLabel} · {cred.organizationFa}
                            </span>
                            <span className="font-latin font-medium text-slate-600">
                              {cred.code}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. HALL PREPARATION, SYSTEM SPECS & INTERACTIVE CHECKLIST (PAGE 5 & 6 CLAUSES) */}
            <section
              id="protocol"
              className="py-14 lg:py-20 max-w-[1320px] mx-auto px-6 lg:px-10 space-y-10"
            >
              {/* Section Heading + Intro Text */}
              <div className="bg-[#0B253A] text-white rounded-2xl p-8 sm:p-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#38BDF8]">
                    صفحات ۵ و ۶ سند · دستورالعمل اجرایی و چک‌لیست تحویل سالن
                  </span>
                  <span className="text-xs font-mono-num text-slate-300">
                    وضعیت تکمیل چک‌لیست: {completedCount} از {PROTOCOL_CLAUSES.length} مورد
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  الزامات آماده‌سازی سالن، تجهیزات فنی و سیستم‌های شرکت‌کنندگان
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
                  {PROTOCOL_INTRO}
                </p>

                {/* Filter & Checklist Action Controls */}
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-white/10 rounded-lg">
                    {(
                      [
                        { id: 'all', label: `همه بندهای پروتکل (${PROTOCOL_CLAUSES.length})` },
                        { id: 'hardware', label: 'لپ‌تاپ مدرس و تصویر' },
                        { id: 'participants', label: 'سیستم و اتصال شرکت‌کنندگان' },
                        { id: 'classroom', label: 'وایت‌برد و پک آموزشی' },
                        { id: 'hospitality', label: 'آب معدنی و پذیرایی' },
                        { id: 'legal', label: 'مالکیت معنوی و مستندسازی' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProtocolCategory(tab.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          protocolCategory === tab.id
                            ? 'bg-white text-[#0B253A] font-bold'
                            : 'text-slate-200 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={checkAllClauses}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>تایید همه موارد</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetChecklist}
                      className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>بازنشانی چک‌لیست</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Protocol Clauses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClauses.map((clause) => {
                  const isChecked = !!checkedIds[clause.id];
                  return (
                    <div
                      key={clause.id}
                      className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-colors bg-white ${
                        isChecked
                          ? 'border-emerald-500/60 bg-emerald-50/10'
                          : 'border-slate-200/90'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5">
                          <div>
                            <span className="text-xs font-mono-num font-bold text-[#0284C7] block">
                              بند اجرایی {clause.index}
                            </span>
                            <h3 className="text-lg font-extrabold text-[#0B253A] mt-0.5">
                              {clause.title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleChecklist(clause.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isChecked ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>آماده و بررسی شد</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-3.5 h-3.5" />
                                <span>ثبت در چک‌لیست</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-sm text-slate-700 leading-[1.95] text-justify">
                          {clause.leadText}
                        </p>

                        {clause.bullets && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {clause.bullets.map((bullet, idx) => (
                              <div
                                key={idx}
                                className="px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold text-[#0B253A] flex items-center gap-2"
                              >
                                <span className="text-[#0284C7] font-bold">•</span>
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {clause.highlightNote && (
                          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
                            {clause.highlightNote}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>شاخص کنترل اجرایی: {clause.checklistLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. PRE-CLASS CONNECTION TEST POSTER & INTERACTIVE PROTOCOL SECTION */}
            <section id="connection-test" className="py-14 lg:py-20 max-w-[1320px] mx-auto px-6 lg:px-10">
              <div className="rounded-2xl overflow-hidden bg-[#0A1120] text-white border border-slate-800 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Right Column in RTL: Interactive 3-Step Connection Readiness Guide */}
                  <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-[#1AE59A]">
                          <Wifi className="w-4 h-4" />
                          <span>{CONNECTION_TEST_PROTOCOL.kicker}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">ویژه تمامی شرکت‌کنندگان بوت‌کمپ</span>
                        </div>

                        <a
                          href={EXTRACTED_ASSETS.connectionTestPoster}
                          download="CPMAI-PreClass-Connection-Test-Poster.png"
                          onClick={(e) => {
                            if (isTauriDesktop()) {
                              e.preventDefault();
                              void saveImageAsset(
                                EXTRACTED_ASSETS.connectionTestPoster,
                                'CPMAI-PreClass-Connection-Test-Poster.png'
                              );
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 text-[#1AE59A]" />
                          <span>دانلود پوستر اطلاع‌رسانی</span>
                        </a>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight text-white">
                          قبل از کلاس، <span className="text-[#1AE59A]">اتصالت</span> را تست کن
                        </h2>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                          {CONNECTION_TEST_PROTOCOL.subheadline}
                        </p>
                      </div>

                      {/* 3 Steps Grid matching the Poster */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {CONNECTION_TEST_PROTOCOL.steps.map((step) => (
                          <div
                            key={step.num}
                            className="rounded-2xl bg-[#152036] border border-white/10 p-5 space-y-3 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-extrabold text-white">{step.title}</h3>
                              <span className="text-2xl font-black text-amber-400">
                                {step.num}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* White Action Box matching the Poster ("اسکن کن و تست بگیر" + gemini.google.com) */}
                      <div className="rounded-2xl bg-[#F4F5F7] text-[#0A1120] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-black text-[#0A1120]">
                              {CONNECTION_TEST_PROTOCOL.ctaTitle}
                            </h3>
                            <a
                              href={CONNECTION_TEST_PROTOCOL.testUrlFull}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-1.5 rounded-lg bg-[#0A1120] hover:bg-slate-800 text-[#1AE59A] font-latin text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <span>{CONNECTION_TEST_PROTOCOL.testUrl}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <div className="space-y-2">
                            {CONNECTION_TEST_PROTOCOL.checkItems.map((item, idx) => {
                              const checked = !!connChecks[idx];
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => toggleConnCheck(idx)}
                                  className="w-full text-right flex items-center gap-2.5 text-sm font-bold text-slate-800 hover:text-[#059669] transition-colors cursor-pointer"
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors shrink-0 ${
                                      checked
                                        ? 'bg-[#1AE59A] text-[#0A1120]'
                                        : 'bg-emerald-500/20 text-emerald-700'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                  <span>{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-center gap-2 self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setConnChecks({ 0: true, 1: true, 2: true });
                              setCheckedIds((prev) => ({
                                ...prev,
                                'clause-connection-test': true,
                              }));
                            }}
                            className={`px-5 py-3 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                              allConnVerified
                                ? 'bg-[#1AE59A] text-[#0A1120] shadow-lg'
                                : 'bg-[#1AE59A] hover:bg-[#10B981] text-[#0A1120]'
                            }`}
                          >
                            {allConnVerified
                              ? 'اتصال تایید شد ✅ آماده حضور در کلاس!'
                              : CONNECTION_TEST_PROTOCOL.badgeText}
                          </button>
                          <span className="text-[11px] text-slate-500">
                            برای ثبت وضعیت آمادگی کلیک کنید
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Warning Note */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
                      <p className="font-semibold">
                        این تست را <span className="text-[#1AE59A] font-bold">پیش از شروع دوره</span> انجام بده؛ وقت کلاس برای یادگیری است، نه عیب‌یابی اتصال.
                      </p>
                    </div>
                  </div>

                  {/* Left Column in RTL: Full Embedded Poster Image (/assets/aistudio/protocol-poster_22944921.png) */}
                  <div className="lg:col-span-5 bg-[#060B14] p-6 sm:p-8 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-r border-white/10">
                    <div
                      onClick={() =>
                        setLightbox({
                          src: EXTRACTED_ASSETS.connectionTestPoster,
                          title: 'پوستر رسمی پروتکل شروع دوره — قبل از کلاس، اتصالت را تست کن',
                        })
                      }
                      className="relative w-full max-w-[390px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl cursor-pointer group"
                    >
                      <img
                        src={EXTRACTED_ASSETS.connectionTestPoster}
                        alt="پروتکل شروع دوره - قبل از کلاس اتصالت را تست کن"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5 text-[#1AE59A]" />
                        <span>بزرگ‌نمایی پوستر</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. DAILY TIMELINE & INTELLECTUAL PROPERTY / CONFIDENTIALITY (PAGE 6) */}
            <section
              id="schedule"
              className="py-14 lg:py-20 bg-white border-y border-slate-200/90"
            >
              <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-12">
                {/* Daily Bootcamp Timeline */}
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-[#0284C7] block">
                        جدول زمان‌بندی رسمی روز برگزاری بوت‌کمپ
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A] mt-1">
                        برنامه زمانی کلاس، پذیرایی و استراحت
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500">
                      پذیرایی صرفاً در زمان استراحت و خارج از فضای قرارگیری خوراکی بسته‌بندی‌شده در سالن انجام پذیرد
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {DAILY_SCHEDULE.map((slot, i) => (
                      <div
                        key={slot.id}
                        className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>نوبت ۰{i + 1}</span>
                            <span className="font-mono-num text-[#0284C7] font-bold">
                              ساعت رسمی
                            </span>
                          </div>
                          <div className="text-2xl font-black text-[#0B253A] font-mono-num">
                            {slot.timeRange}
                          </div>
                          <h3 className="text-base font-extrabold text-slate-800">
                            {slot.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-200/70">
                          {slot.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intellectual Property & Confidentiality Banner with Preserved Shield Image (obj_74 + mask_75) */}
                <div className="rounded-2xl bg-[#0B253A] text-white p-8 sm:p-10 lg:p-12 border border-slate-800 shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Preserved Copyright Shield Image */}
                    <div className="lg:col-span-3 flex flex-col items-center text-center space-y-3">
                      <div
                        onClick={() =>
                          setLightbox({
                            src: EXTRACTED_ASSETS.copyrightShield,
                            title:
                              'نشان صیانت از حقوق مالکیت مادی و معنوی شرکت مشاوران مدیریت کسب و کار اوج',
                          })
                        }
                        className="cursor-pointer hover:scale-105 transition-transform"
                      >
                        <img
                          src={EXTRACTED_ASSETS.copyrightShield}
                          alt="حفظ حقوق مالکیت معنوی شرکت اوج"
                          referrerPolicy="no-referrer"
                          className="w-36 h-36 object-contain masked-ip-shield mx-auto"
                        />
                      </div>
                      <span className="text-xs text-[#38BDF8] font-medium">
                        حفاظت از دارایی‌های فکری اوج
                      </span>
                    </div>

                    {/* Verbatim IP & Confidentiality Text */}
                    <div className="lg:col-span-9 space-y-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#38BDF8] font-semibold">
                        <ShieldAlert className="w-4 h-4" />
                        <span>حفظ حقوق مالکیت معنوی و عدم افشای محتوای اختصاصی</span>
                      </div>

                      <p className="text-sm sm:text-base leading-[2.05] text-slate-100 text-justify">
                        به منظور حفظ حقوق مالکیت معنوی متعلق به شرکت اوج، ضروری است در فرآیند آماده‌سازی سالن و تجهیزات مورد استفاده، کلیه الزامات و تمهیدات لازم جهت صیانت از محتوای آموزشی و سایر دارایی‌های فکری متعلق به شرکت مشاوران مدیریت کسب و کار اوج و مدرسین متبوع آن رعایت و اجرا گردد.
                      </p>

                      <div className="bg-rose-500/15 border border-rose-400/30 rounded-xl px-5 py-3.5 text-xs sm:text-sm font-bold text-rose-200">
                        * توجه: خواهشمند است، از هرگونه ضبط صدای مدرسین در طول برگزاری دوره اکیداً خودداری شود.
                      </div>

                      <div className="pt-4 border-t border-white/15 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                        <p>{CONFIDENTIALITY_STATEMENT.body}</p>
                        <p className="font-bold text-white pt-1">
                          {CONFIDENTIALITY_STATEMENT.closing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. LOCATION MAP, BACK COVER & CONTACT DIRECTORY (PAGE 7) */}
            <section className="py-14 lg:py-20 max-w-[1320px] mx-auto px-6 lg:px-10 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Right Column: Contact Details & Offices */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-200 pb-5">
                      <span className="text-xs font-semibold text-[#0284C7] block">
                        صفحه آخر سند · اطلاعات تماس و دفاتر مرکزی
                      </span>
                      <h2 className="text-2xl font-black text-[#0B253A]">
                        {DOCUMENT_META.organization}
                      </h2>
                      <p className="text-xs font-latin text-slate-500">
                        {DOCUMENT_META.organizationEn} · {DOCUMENT_META.website}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                          <MapPin className="w-4 h-4" />
                          <span>دفتر مرکزی تهران</span>
                        </div>
                        <p className="text-sm font-semibold text-[#0B253A]">
                          {DOCUMENT_META.addresses.tehran}
                        </p>
                        <p className="text-xs font-mono-num text-slate-600" dir="ltr">
                          {DOCUMENT_META.phones.tehran}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7]">
                          <MapPin className="w-4 h-4" />
                          <span>دفتر مرکزی تبریز</span>
                        </div>
                        <p className="text-sm font-semibold text-[#0B253A]">
                          {DOCUMENT_META.addresses.tabriz}
                        </p>
                        <p className="text-xs font-mono-num text-slate-600" dir="ltr">
                          {DOCUMENT_META.phones.tabriz}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0B253A]">
                          <Phone className="w-4 h-4 text-[#0284C7]" />
                          <span>درگاه رسمی اینترنتی</span>
                        </div>
                        <a
                          href={`https://${DOCUMENT_META.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-latin font-bold text-[#0284C7] hover:underline"
                        >
                          {DOCUMENT_META.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Preserved Contact Strip Image */}
                  <div className="pt-4 border-t border-slate-200">
                    <img
                      src={EXTRACTED_ASSETS.contactStrip}
                      alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Left Column: Preserved Back Cover & Tajrish Map (obj_78.jpg) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div
                    onClick={() =>
                      setLightbox({
                        src: EXTRACTED_ASSETS.backCoverMap,
                        title:
                          'نقشه موقعیت دفتر میدان تجریش و طرح پشت جلد — مشاوران مدیریت کسب و کار اوج',
                      })
                    }
                    className="relative flex-1 min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer group bg-white flex flex-col justify-between"
                  >
                    <img
                      src={EXTRACTED_ASSETS.backCoverMap}
                      alt="نقشه میدان تجریش - مشاوران مدیریت کسب و کار اوج"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{ objectPosition: 'center 88%' }}
                    />
                    <div className="absolute top-4 left-4 bg-[#0B253A]/85 backdrop-blur-sm text-white text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>مشاهده کامل پوستر پشت جلد و نقشه</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Hidden in screen, visible when printing directly from Interactive Mode */}
          <div className="hidden print:block">
            <RedesignedBrochurePages
              digitalUrl={digitalUrl.trim() || DAMAVAND_PUBLIC_URL}
              digitalQrDataUrl={digitalQrDataUrl}
            />
          </div>
        </>
      )}
      </div>

      {/* ==================== ADMIN STRUCTURED DOCUMENT EDITOR MODAL ==================== */}
      {activeProposal && (
        <AdminDocumentEditorModal
          isOpen={showAdminEditorModal}
          onClose={() => setShowAdminEditorModal(false)}
          proposal={activeProposal}
          companyResume={companyResumeState}
          documentMeta={docMetaState}
          onSaveAll={(updatedProp, updatedCompany, updatedMeta) => {
            if (updatedProp.id === OIL_GAS_EXEC_25H_ID) {
              setOilGasExecProposalState(updatedProp);
              try {
                localStorage.setItem(
                  ADMIN_OILGAS_EXEC_STORAGE_KEY,
                  JSON.stringify(updatedProp)
                );
              } catch {
                // ignore
              }
              setCompanyResumeState(updatedCompany);
              setDocMetaState(updatedMeta);
              persistAllAdminData(
                proposalsState,
                updatedCompany,
                updatedMeta,
                customTextMap
              );
            } else {
              const nextProposals = proposalsState.map((p) =>
                p.id === updatedProp.id ? updatedProp : p
              );
              setProposalsState(nextProposals);
              setCompanyResumeState(updatedCompany);
              setDocMetaState(updatedMeta);
              persistAllAdminData(
                nextProposals,
                updatedCompany,
                updatedMeta,
                customTextMap
              );
            }
            setAdminSavedBanner(true);
            setTimeout(() => setAdminSavedBanner(false), 3000);
          }}
          onResetCurrentProposal={handleResetCurrentProposalToDefault}
        />
      )}

      {/* ==================== FLOATING MOVABLE ORBITAL ROTARY DIAL ==================== */}
      {showOrbitalDial &&
        activeProposal &&
        activeProposal.id !== OIL_GAS_EXEC_25H_ID &&
        (viewMode === 'brochure' || viewMode === 'interactive') &&
        (!BUILD_LOCKED_DOC_ID || isAdminUnlocked) && (
          <OrbitalProposalDial
            proposals={proposalsState}
            activeProposalId={activeProposal.id}
            viewMode={viewMode}
            onSelectProposal={(id) => {
              handleSelectDocument(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenHub={() => {
              setIsSpotlightSelectionMode(false);
              setViewMode('hub');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleViewMode={(mode) => {
              setViewMode(mode);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSpotlightActive={isSpotlightSelectionMode}
            onToggleSpotlight={() =>
              setIsSpotlightSelectionMode((prev) => !prev)
            }
            onClose={() => setShowOrbitalDial(false)}
          />
        )}

      {/* ==================== SPOTLIGHT FOCUS ZOOM OVERLAY TOOL ==================== */}
      <SpotlightFocusTool
        isSelectionMode={isSpotlightSelectionMode}
        onSetSelectionMode={setIsSpotlightSelectionMode}
        disabled={viewMode === 'hub' || (isAdminUnlocked && isDirectEditMode)}
      />

      {/* ==================== PICTURE 8 STYLE ANGLED GEOMETRIC FOOTER ==================== */}
      <footer className="no-print bg-white pt-6 select-none">
        <div className="relative h-24 w-full flex items-end overflow-hidden">
          {/* Right side in RTL: Deep Teal-Navy Bar (#1D4760) */}
          <div className="w-full h-14 bg-[#1D4760] flex items-center justify-between px-6 lg:px-12 text-xs text-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={EXTRACTED_ASSETS.owjLogoWhite}
                alt="OWJ Business Council"
                referrerPolicy="no-referrer"
                className="h-9 w-auto object-contain"
              />
              <span className="text-[#37A3DC]">·</span>
              <span className="font-semibold text-white">
                تمامی حقوق مادی و معنوی متعلق به {DOCUMENT_META.organization} می‌باشد.
              </span>
              <span className="text-[#37A3DC] hidden md:inline">·</span>
              <span className="text-[#7DD3FC] font-bold hidden md:inline">
                {activeProposal
                  ? activeProposal.recipientShortOnCover
                  : DOCUMENT_META.clientProject}
              </span>
            </div>
          </div>

          {/* Left side in RTL: Geometric Angled Cyan Trapezoid + Parallel Diagonal Stripe from Picture8 */}
          <div className="absolute left-0 bottom-0 h-24 w-80 sm:w-96 pointer-events-none">
            <svg
              viewBox="0 0 380 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* White separator gap */}
              <polygon points="0,0 290,0 358,96 0,96" fill="#FFFFFF" />
              {/* Parallel secondary diagonal stripe */}
              <polygon points="292,40 326,40 366,96 332,96" fill="#2E8BC0" />
              {/* Main cyan trapezoid (#37A3DC) */}
              <polygon points="0,0 280,0 344,96 0,96" fill="#37A3DC" />
            </svg>
            <div className="absolute inset-y-0 left-8 sm:left-14 flex items-center gap-4">
              <img
                src={EXTRACTED_ASSETS.ajaLogoWhite}
                alt="Abolfazl Jafari Asl"
                referrerPolicy="no-referrer"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== IMAGE LIGHTBOX MODAL ==================== */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="px-6 py-4 bg-[#0B253A] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold truncate">{lightbox.title}</h3>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 bg-slate-900/95 flex-1 overflow-auto flex items-center justify-center">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[72vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
