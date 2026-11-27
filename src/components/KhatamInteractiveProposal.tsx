import React, { useMemo, useState } from 'react';
import {
  Award,
  Building2,
  CheckSquare,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  Presentation,
  Printer,
  Search,
  ShieldCheck,
  Square,
  TrendingUp,
  ZoomIn,
} from 'lucide-react';
import {
  AI_CREDENTIALS_13,
  COMPANY_RESUME_DATA,
  DOCUMENT_META,
  EXTRACTED_ASSETS,
  OFFICIAL_CERTIFICATES,
  PM_CREDENTIALS,
  SENIOR_COACHES_DATA,
} from '../data/protocolData';
import {
  KHATAM_PROPOSALS,
  KhatamProposalDocument,
} from '../data/khatamProposalsData';
import { AiPatternGraphicBadge } from './AiPatternGraphicBadge';
import { AiToolBadgeList } from './AiToolLogos';

interface KhatamInteractiveProposalProps {
  proposal: KhatamProposalDocument;
  allProposals?: KhatamProposalDocument[];
  companyResume?: typeof COMPANY_RESUME_DATA;
  documentMeta?: typeof DOCUMENT_META;
  digitalQrDataUrl: string;
  onSwitchToBrochure: () => void;
  onOpenProtocol?: () => void;
  onPrintPdf: () => void;
  onExportPptx?: () => void;
  isExportingPptx?: boolean;
  onSelectImage: (src: string, title: string) => void;
  onSelectProposal?: (proposalId: string) => void;
}

export const KhatamInteractiveProposal: React.FC<
  KhatamInteractiveProposalProps
> = ({
  proposal,
  allProposals = KHATAM_PROPOSALS,
  companyResume = COMPANY_RESUME_DATA,
  documentMeta = DOCUMENT_META,
  digitalQrDataUrl,
  onSwitchToBrochure,
  onOpenProtocol,
  onPrintPdf,
  onExportPptx,
  isExportingPptx = false,
  onSelectImage,
  onSelectProposal,
}) => {
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(0);
  const [credFilter, setCredFilter] = useState<'all' | 'ai' | 'pm'>('all');
  const [credSearch, setCredSearch] = useState('');
  const [signOffChecked, setSignOffChecked] = useState<Record<number, boolean>>(
    { 0: true, 1: true, 2: false, 3: false, 4: false }
  );

  const toggleSignOff = (idx: number) => {
    setSignOffChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredCredentials = useMemo(() => {
    const combined = [
      ...AI_CREDENTIALS_13.map((item) => ({
        ...item,
        groupLabel: 'هوش مصنوعی و CPMAI',
      })),
      ...PM_CREDENTIALS.map((item) => ({
        ...item,
        groupLabel: 'مدیریت پروژه بین‌الملل',
      })),
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

  const activePhase =
    proposal.cpmaiPhases[activePhaseIdx] || proposal.cpmaiPhases[0];

  const excludedCoaches = proposal.excludedCoachIds ?? [];
  const visibleCoaches = SENIOR_COACHES_DATA.filter(
    (coach) => !excludedCoaches.includes(coach.id)
  );
  const removedPagesCount =
    (proposal.separateProtocolDocument ? 1 : 0) +
    (SENIOR_COACHES_DATA.length - visibleCoaches.length);
  const brochurePageCountFa = (22 - removedPagesCount)
    .toString()
    .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  return (
    <main className="no-print flex-1">
      {/* ==================== 1. HERO, COVER & FORMAL PROPOSAL LETTERHEAD ==================== */}
      <section className="relative bg-white border-b border-slate-200/90 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Right Column in RTL: Official Letterhead & Executive Pitch */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
              <div className="space-y-6">
                {/* Top Metadata Bar + Navy OWJ Logo */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                    <span className="px-3 py-1 rounded-lg bg-[#1D4760] text-white font-bold">
                      پروپوزال رسمی شماره {proposal.proposalNum}
                    </span>
                    <span className="text-[#0284C7] font-extrabold">
                      {proposal.tierBadge}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num text-slate-500">
                      شماره: {proposal.letterNumber}
                    </span>
                  </div>

                  <img
                    src={EXTRACTED_ASSETS.owjLogoNavy}
                    alt="لوگوی مشاوران مدیریت کسب و کار اوج"
                    referrerPolicy="no-referrer"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-3.5">
                  <p className="text-sm sm:text-base font-extrabold text-[#0284C7]">
                    {proposal.coverSubtitle}
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black text-[#0B253A] leading-[1.3] tracking-tight">
                    {proposal.coverMainTitle}
                  </h1>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#1D4760]">
                    مخاطب اختصاصی: {proposal.recipientShortOnCover}
                  </p>
                </div>

                {/* Formal Letterhead Card (به / از / موضوع) */}
                <div className="bg-[#F8FAFC] border-2 border-slate-200/90 rounded-2xl p-6 space-y-3 text-sm sm:text-base">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 text-xs sm:text-sm text-slate-500">
                    <span className="font-bold">شناسنامه مکاتبه رسمی پیشنهاد فنی و مالی (Proposal)</span>
                    <span className="font-mono-num font-bold text-[#1D4760]">
                      تاریخ: {proposal.letterDate} · طبقه‌بندی: محرمانه تجاری
                    </span>
                  </div>
                  <div className="space-y-2.5 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <span className="font-black text-[#1D4760] w-16 shrink-0">
                        به:
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {proposal.recipientTitle}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-black text-[#1D4760] w-16 shrink-0">
                        از:
                      </span>
                      <span className="font-bold text-slate-800">
                        {proposal.senderTitle}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-black text-[#0284C7] w-16 shrink-0">
                        موضوع:
                      </span>
                      <span className="font-extrabold text-[#0B253A]">
                        {proposal.subject}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Executive Lead Paragraph */}
                <p className="text-sm sm:text-base text-slate-700 leading-[2.1] text-justify bg-sky-50/50 border border-sky-200/80 rounded-2xl p-5 font-medium">
                  {proposal.executiveLead}
                </p>
              </div>

              {/* Action Buttons & Contact Strip */}
              <div className="space-y-5 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onSwitchToBrochure}
                    className="px-5 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1D4760] hover:bg-[#0284C7] rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>مشاهده کاتالوگ {brochurePageCountFa} صفحه‌ای چاپی (A4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={onPrintPdf}
                    className="px-5 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>دانلود مستقیم PDF پروپوزال ({brochurePageCountFa} صفحه)</span>
                  </button>
                  {onExportPptx && (
                    <button
                      type="button"
                      onClick={onExportPptx}
                      disabled={isExportingPptx}
                      className="px-5 py-3.5 text-xs sm:text-sm font-bold text-[#0F172A] bg-amber-400 hover:bg-amber-300 disabled:opacity-75 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isExportingPptx ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>در حال ساخت پاورپوینت...</span>
                        </>
                      ) : (
                        <>
                          <Presentation className="w-4 h-4" />
                          <span>دانلود پاورپوینت (.pptx)</span>
                        </>
                      )}
                    </button>
                  )}
                  <a
                    href="#company-resume"
                    className="px-4 py-3.5 text-xs sm:text-sm font-bold text-[#1D4760] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    رزومه شرکت اوج و مدرس
                  </a>
                  <a
                    href="#workbook"
                    className="px-4 py-3.5 text-xs sm:text-sm font-bold text-[#059669] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    کاربرگ ۶ فاز CPMAI v8
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <img
                    src={EXTRACTED_ASSETS.contactStrip}
                    alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                    referrerPolicy="no-referrer"
                    className="w-full max-w-2xl h-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Left Column in RTL: Interactive Cover Preview */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div
                onClick={onSwitchToBrochure}
                className="relative w-full max-w-[460px] aspect-[1648/2381] rounded-2xl overflow-hidden border border-slate-200 shadow-xl group cursor-pointer bg-white"
              >
                <img
                  src={proposal.coverImage || EXTRACTED_ASSETS.coverFull}
                  alt={proposal.coverMainTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* Bottom 29.5% Cover Typography & QR Code */}
                <div className="absolute inset-x-0 bottom-0 h-[29.5%] px-5 pb-3.5 pt-2 flex flex-col justify-between text-right">
                  <div className="space-y-1">
                    <p className="text-[12px] sm:text-[13.5px] font-black text-[#0F172A] leading-tight whitespace-nowrap">
                      {proposal.coverMainTitle}
                    </p>
                    <p className="text-sm sm:text-base font-black text-[#0F172A] leading-tight whitespace-nowrap">
                      {documentMeta.organization}
                    </p>
                    <div className="w-full h-[2px] bg-[#37A3DC] my-1.5" />

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      {digitalQrDataUrl && (
                        <div className="shrink-0 bg-white/95 border border-[#37A3DC] rounded-lg p-1 shadow-sm flex items-center gap-1.5">
                          <img
                            src={digitalQrDataUrl}
                            alt="QR نسخه دیجیتال"
                            className="w-10 h-10 object-contain"
                          />
                          <div className="text-right pr-0.5">
                            <span className="text-[7.5px] font-extrabold text-white bg-[#1D4760] px-1 py-0.5 rounded block">
                              پروپوزال {proposal.proposalNum}
                            </span>
                            <span className="text-[8px] font-bold text-[#0284C7] block mt-0.5">
                              نسخه دیجیتال
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="text-left">
                        <p className="text-xs sm:text-[13px] font-extrabold text-[#37A3DC] whitespace-nowrap">
                          {proposal.recipientShortOnCover}
                        </p>
                        <span className="text-[8.5px] font-semibold text-slate-500 block">
                          کد: {proposal.letterNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <img
                    src={EXTRACTED_ASSETS.contactStrip}
                    alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="absolute top-3 left-3 bg-[#1D4760]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-[#37A3DC]" />
                  <span>مشاهده کاتالوگ {brochurePageCountFa} صفحه‌ای A4</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Key Proposal Metrics Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">
                مخاطبان هدف و ظرفیت کارگاه
              </span>
              <strong className="text-base font-black text-[#0B253A] block">
                {proposal.investment.capacity}
              </strong>
              <span className="text-xs font-semibold text-[#0284C7] block">
                {proposal.tierBadge}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">
                مدت زمان و ساختار اجرایی
              </span>
              <strong className="text-base font-black text-[#0B253A] block">
                {proposal.totalHours} ({proposal.sessionsFormat})
              </strong>
              <span className="text-xs text-slate-600 block">
                منطبق با استاندارد جهانی PMI-CPMAI v8
              </span>
            </div>

            {proposal.hideFinancialFee ? (
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
                <span className="text-xs font-bold text-slate-500 block">
                  روز و ساعت برگزاری جلسات
                </span>
                <strong className="text-base font-black text-[#0284C7] block">
                  دوشنبه‌ها ۰۷:۰۰ الی ۰۹:۳۰ صبح
                </strong>
                <span className="text-xs text-slate-600 font-semibold block">
                  کلاس ترکیبی: ۱.۲۵ ساعت متدولوژی + ۱.۲۵ ساعت ابزارهای AI
                </span>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
                <span className="text-xs font-bold text-slate-500 block">
                  نرخ حق‌الزحمه تدریس (به ازای هر ساعت)
                </span>
                <strong className="text-base font-black text-[#0284C7] block">
                  {proposal.investment.hourlyRate}
                </strong>
                <span className="text-xs text-slate-600 font-semibold block">
                  بر مبنای ۹۶ ساعت تدریس (بدون بستن پک مقطوع)
                </span>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">
                رویکرد اجرایی و محیط یادگیری
              </span>
              <strong className="text-sm font-black text-[#059669] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>آموزش، فرهنگ‌سازی و انگیزه‌بخشی CPMAI</span>
              </strong>
              <span className="text-xs text-slate-600 block">
                تمرین با ابزارهای آموزشی ابری (بر روی داده‌های نمونه)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. COMPANY RESUME (OWJ BUSINESS COUNCIL) — IMMEDIATELY AFTER COVER ==================== */}
      <section
        id="company-resume"
        className="py-14 lg:py-20 bg-[#F8F7F4] border-b border-slate-200/90"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-10">
          {/* Company Header Card */}
          <div className="rounded-3xl bg-gradient-to-l from-[#0B253A] via-[#153447] to-[#1D4760] text-white p-8 sm:p-10 lg:p-12 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/15 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#7DD3FC]">
                  <Building2 className="w-4 h-4 text-[#37A3DC]" />
                  <span>بخش اول معرفی مجری · رزومه و پیشینه سازمانی</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  {companyResume.titleFa} ({companyResume.titleEn})
                </h2>
                <p className="text-sm sm:text-base font-bold text-sky-200 leading-relaxed">
                  {companyResume.tagline}
                </p>
              </div>
              <img
                src={EXTRACTED_ASSETS.owjLogoWhite}
                alt="OWJ Business Council"
                referrerPolicy="no-referrer"
                className="h-16 w-auto object-contain shrink-0"
              />
            </div>

            <p className="text-sm sm:text-base lg:text-[17px] text-slate-100 leading-[2.15] text-justify">
              {companyResume.executiveIntro}
            </p>

            {/* 4 Key Institutional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {companyResume.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/10 border border-white/15 p-5 space-y-1.5"
                >
                  <span className="text-xl sm:text-2xl font-black text-[#37A3DC] block">
                    {st.value}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Core Capability Pillars + National Track Record */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left/Right 7 cols: 4 Core Pillars */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                  ارکان چهارگانه خدمات تخصصی شرکت اوج
                </h3>
                <span className="text-xs font-latin font-bold text-[#0284C7]">
                  Core Executive Capabilities
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {companyResume.corePillars.map((pillar) => (
                  <div
                    key={pillar.num}
                    className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-[#1D4760] text-white text-sm font-black flex items-center justify-center">
                        {pillar.num}
                      </span>
                      <span className="text-[11px] font-latin font-bold text-[#0284C7]">
                        {pillar.code}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-[#0B253A] leading-snug">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-[1.95] text-justify">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 cols: National Track Record Across Mega-Projects */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-2xs">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-extrabold text-[#0284C7] block">
                    کارنامه اجرایی در صنایع مادر
                  </span>
                  <h3 className="text-xl font-black text-[#0B253A] mt-0.5">
                    تجربه توانمندسازی در ابرپروژه‌های ملی
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {companyResume.nationalTrackRecord.map((item) => (
                    <div
                      key={item.num}
                      className="rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-4 space-y-1.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white text-xs font-black flex items-center justify-center shrink-0">
                          {item.num}
                        </span>
                        <h4 className="text-sm font-black text-[#0B253A]">
                          {item.sector}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-[1.9] text-justify">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* International Accreditations Strip */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-500 block text-center">
                  نهادهای بین‌المللی و ملی مرجع استانداردهای آموزشی اوج
                </span>
                <div className="grid grid-cols-4 gap-3 items-center justify-items-center bg-[#F8FAFC] py-3 px-4 rounded-2xl border border-slate-200/80">
                  <img
                    src={EXTRACTED_ASSETS.pmiLogo}
                    alt="PMI"
                    referrerPolicy="no-referrer"
                    className="h-10 w-auto object-contain"
                  />
                  <img
                    src={EXTRACTED_ASSETS.axelosLogo}
                    alt="AXELOS"
                    referrerPolicy="no-referrer"
                    className="h-8 w-auto object-contain"
                  />
                  <img
                    src={EXTRACTED_ASSETS.ipmaLogo}
                    alt="IPMA"
                    referrerPolicy="no-referrer"
                    className="h-10 w-auto object-contain"
                  />
                  <img
                    src={EXTRACTED_ASSETS.iranPmaLogo}
                    alt="IranPMA"
                    referrerPolicy="no-referrer"
                    className="h-11 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. INSTRUCTOR RESUME & 23 INTERNATIONAL CREDENTIALS — IMMEDIATELY AFTER COMPANY RESUME ==================== */}
      <section
        id="instructor"
        className="py-14 lg:py-20 bg-white border-b border-slate-200/90"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0284C7]">
                <Award className="w-4 h-4" />
                <span>بخش دوم معرفی مجری · رزومه و گواهینامه‌های بین‌المللی مدرس دوره</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A]">
                معرفی استاد دوره و ۲۳ گواهینامه بین‌المللی هوش مصنوعی و مدیریت پروژه
              </h2>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              اولین و تنها دارنده هر ۱۳ گواهینامه هوش مصنوعی PMI و Cognilytica آمریکا در ایران
            </span>
          </div>

          {/* Design #2 Two-Column Instructor Banner */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-l from-[#0B253A] via-[#1E1B4B] to-[#3B1D5E] text-white shadow-xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
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
                        طراح و مدرس دوره:
                      </span>
                    </div>
                    <img
                      src={EXTRACTED_ASSETS.ajaLogoWhite}
                      alt="AJA Abolfazl Jafari Asl"
                      referrerPolicy="no-referrer"
                      className="h-11 w-auto object-contain"
                    />
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                    {documentMeta.instructorName}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-sky-200">
                    {documentMeta.instructorRole}
                  </p>
                  <p className="text-sm sm:text-base leading-[2] text-indigo-100 max-w-2xl text-justify">
                    {documentMeta.instructorDistinction}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() =>
                        onSelectImage(
                          EXTRACTED_ASSETS.qrCode,
                          'کد QR رسمی ابوالفضل جعفری اصل'
                        )
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
                      <span className="text-xs sm:text-sm font-bold text-sky-300 block">
                        اسکن جهت استعلام مدارک بین‌المللی مدرس
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        دارای ۱۳ گواهینامه تخصصی هوش مصنوعی از PMI و Cognilytica آمریکا + ۱۰ مدرک بین‌المللی مدیریت پروژه
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative bg-[#2B2653] flex items-center justify-center p-6">
                <div
                  onClick={() =>
                    onSelectImage(
                      EXTRACTED_ASSETS.instructorBanner,
                      'ابوالفضل جعفری اصل — مدیرعامل شرکت مشاوران مدیریت کسب و کار اوج'
                    )
                  }
                  className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-white/15 shadow-xl group cursor-pointer"
                >
                  <img
                    src={EXTRACTED_ASSETS.instructorBanner}
                    alt={documentMeta.instructorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-left"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Searchable 23 Credentials Explorer with Larger Typography */}
          <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                  فهرست کامل ۲۳ گواهینامه بین‌المللی مدرس (۱۳ مدرک هوش مصنوعی + ۱۰ مدرک مدیریت پروژه)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  قابل فیلتر بر اساس حوزه تخصصی هوش مصنوعی (PMI / Cognilytica) و مدیریت پروژه (PMP / PMI-ACP / PMOCP / PRINCE2 / IPMA)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={credSearch}
                    onChange={(e) => setCredSearch(e.target.value)}
                    placeholder="جستجو در مدارک..."
                    className="pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs sm:text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setCredFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
                      credFilter === 'all'
                        ? 'bg-[#1D4760] text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    همه (۲۳)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredFilter('ai')}
                    className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
                      credFilter === 'ai'
                        ? 'bg-[#1D4760] text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    هوش مصنوعی (۱۳)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredFilter('pm')}
                    className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${
                      credFilter === 'pm'
                        ? 'bg-[#1D4760] text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    مدیریت پروژه (۱۰)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCredentials.map((cred) => (
                <div
                  key={cred.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-[#1D4760] text-white text-xs sm:text-sm font-mono-num font-black flex items-center justify-center shrink-0">
                      {cred.index}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-sm sm:text-[15px] font-extrabold text-[#0B253A] leading-snug">
                        {cred.titleFa}
                      </p>
                      <span className="text-xs text-slate-500 block">
                        {cred.organizationFa}
                      </span>
                    </div>
                  </div>
                  {cred.code && (
                    <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-xs font-latin font-bold text-[#0284C7] shrink-0">
                      {cred.code}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Official PMI Certificates */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {OFFICIAL_CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => onSelectImage(cert.image, cert.titleFa)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="overflow-hidden rounded-xl bg-[#F8FAFC] border border-slate-100 p-2">
                    <img
                      src={cert.image}
                      alt={cert.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-contain group-hover:scale-[1.01] transition-transform"
                    />
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-extrabold text-[#1D4760]">
                      {cert.titleFa}
                    </span>
                    <span className="font-mono-num font-bold text-[#0284C7]">
                      شماره ثبت جهانی: #{cert.certNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== SENIOR COACHES SECTION (KAZEM FAKOURIZAD & AMIR ASLANI) ==================== */}
          <div className="bg-[#F8FAFC] rounded-3xl border-2 border-slate-200 p-6 sm:p-10 space-y-8">
            {visibleCoaches.length > 0 && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-extrabold text-[#0284C7] block">
                      دپارتمان کوچینگ و راهبری اجرایی شرکت مشاوران مدیریت کسب و کار اوج
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                      {visibleCoaches.length === 1
                        ? 'معرفی کوچ ارشد دوره (Senior Executive Coach)'
                        : 'معرفی تیم و کوچ‌های ارشد دوره (Senior Executive Coaches)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {visibleCoaches.length === 1
                        ? 'همراهی تخصصی کوچ ارشد در کارگاه‌های عملیاتی جهت تسهیل‌گری و تکمیل کاربرگ‌های متدولوژی و ابزارهای کاربردی'
                        : 'همراهی تخصصی کوچ‌های ارشد در کارگاه‌های عملیاتی جهت تسهیل‌گری و تکمیل کاربرگ‌های ۶گانه PMI-CPMAI v8'}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs sm:text-sm font-bold text-[#1D4760] shrink-0">
                    ❖ {companyResume.ipmaPrideStatement}
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    visibleCoaches.length > 1 ? 'lg:grid-cols-2' : ''
                  } gap-6`}
                >
              {visibleCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#0284C7] text-white text-sm font-black flex items-center justify-center shrink-0 mt-0.5">
                          {coach.num}
                        </span>
                        <div>
                          <h4 className="text-lg sm:text-xl font-black text-[#0B253A]">
                            {coach.name}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-[#0284C7] mt-1">
                            {coach.roleTitle}
                          </p>
                        </div>
                      </div>
                      <img
                        src={coach.portrait}
                        alt={coach.name}
                        referrerPolicy="no-referrer"
                        onClick={() => onSelectImage(coach.portrait, `${coach.name} — ${coach.roleTitle}`)}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain object-bottom shrink-0 cursor-pointer hover:scale-[1.03] transition-transform"
                      />
                    </div>

                    {/* Experience Bullets */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-black text-[#1D4760]">
                        {coach.experienceTitle}
                      </h5>
                      <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-700 leading-[1.95]">
                        {coach.experiences.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0284C7] font-black shrink-0">•</span>
                            <span className="text-justify">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Skills */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <h5 className="text-sm font-black text-[#1D4760]">
                        {coach.skillsTitle}
                      </h5>
                      <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-[1.9]">
                        {coach.skills.map((sk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0284C7] font-black shrink-0">•</span>
                            <span>
                              <strong className="text-[#0B253A]">{sk.category}:</strong>{' '}
                              {sk.items}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Certificates if present */}
                    {coach.certificates && (
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <h5 className="text-sm font-black text-[#1D4760]">
                          {coach.certificatesTitle}
                        </h5>
                        <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-[1.9]">
                          {coach.certificates.map((cert, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-black shrink-0">▪</span>
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
                </div>
              </>
            )}

            {/* ==================== CLIENTS LOGOS & IPMA WORKSHOPS VISUAL SHOWCASE (PAGES 8 & 9 OF MUSTAPHA PDF) ==================== */}
            <div
              className={`${
                visibleCoaches.length > 0 ? 'pt-6 border-t border-slate-200' : ''
              } grid grid-cols-1 lg:grid-cols-2 gap-6`}
            >
              {/* Image 1: Client Logos Grid + B&W Workshop Strip */}
              <div
                onClick={() =>
                  onSelectImage(
                    EXTRACTED_ASSETS.clientsLogosAndWorkshops,
                    companyResume.clientsSummary
                  )
                }
                className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs hover:border-[#37A3DC] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#1D4760] text-white text-xs font-bold">
                      کارنامه مشتریان سازمانی اوج
                    </span>
                    <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>بزرگ‌نمایی تصویر</span>
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#0B253A] leading-relaxed">
                    {companyResume.clientsSummary}
                  </h4>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={EXTRACTED_ASSETS.clientsLogosAndWorkshops}
                    alt={companyResume.clientsSummary}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[460px] object-contain group-hover:scale-[1.01] transition-transform"
                  />
                </div>
              </div>

              {/* Image 2: 8 IPMA Workshop Posters + Center QR Code Grid */}
              <div
                onClick={() =>
                  onSelectImage(
                    EXTRACTED_ASSETS.ipmaWorkshopsGrid,
                    companyResume.ipmaPrideStatement
                  )
                }
                className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs hover:border-[#37A3DC] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0284C7] text-white text-xs font-bold">
                      گزارش تصویری کارگاه‌های جامع IPMA
                    </span>
                    <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>بزرگ‌نمایی تصویر</span>
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#0B253A] leading-relaxed">
                    «{companyResume.ipmaPrideStatement}»
                  </h4>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={EXTRACTED_ASSETS.ipmaWorkshopsGrid}
                    alt={companyResume.ipmaPrideStatement}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[460px] object-contain group-hover:scale-[1.01] transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SPECIAL CASCADE SECTION FOR PROPOSAL #1 (SUPREME COMMAND 4-6 LEADERS) ==================== */}
      {proposal.cascadeGovernance && (
        <section className="py-14 lg:py-18 bg-gradient-to-b from-[#0B253A] to-[#153447] text-white border-b border-white/10">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/15 pb-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-md bg-[#37A3DC] text-white text-xs font-extrabold">
                  ویژه کمیته ارشد ۴ تا ۶ نفره فرماندهی عالی و شورای عالی قرارگاه
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {proposal.cascadeGovernance.title}
                </h2>
                <p className="text-sm sm:text-base text-sky-200 max-w-4xl leading-relaxed">
                  {proposal.cascadeGovernance.subtitle}
                </p>
              </div>
              <div className="shrink-0 bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-right">
                <span className="text-xs text-sky-300 block">
                  پوشش کامل کل هرم سازمانی قرارگاه
                </span>
                <strong className="text-lg font-black text-white">
                  ۹ پروپوزال مجزا در ۳ سطح فرماندهی، ستاد و هلدینگ‌ها
                </strong>
              </div>
            </div>

            {/* 4 Executive Persuasion Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {proposal.cascadeGovernance.whyCpmaiPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/15 p-6 space-y-2.5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#37A3DC] text-white text-xs font-black flex items-center justify-center shrink-0">
                      ۰{idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {pt.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-200 leading-[2] text-justify">
                    {pt.description}
                  </p>
                </div>
              ))}
            </div>

            {/* 3-Tier Cascade Governance Matrix */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#7DD3FC]">
                ساختار ۳ سطحی آبشاری (Cascade Governance) جهت استقرار هماهنگ در سراسر قرارگاه:
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {proposal.cascadeGovernance.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#0F172A]/80 border border-[#37A3DC]/40 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <span className="text-sm font-black text-[#37A3DC]">
                          {tier.level}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-white/10 text-xs font-bold text-white">
                          {tier.duration}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 block">
                          مخاطبان هدف:
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                          {tier.audience}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 block">
                          هدف راهبردی:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
                          {tier.objective}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <span className="text-xs font-bold text-emerald-400 block">
                        خروجی ملموس: {tier.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Directory of All 9 Dedicated Proposals */}
            <div className="rounded-2xl bg-white/5 border border-white/15 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  فهرست جامع ۹ پروپوزال اختصاصی قرارگاه سازندگی خاتم‌الانبیاء (ص) (هر پروپوزال دارای مخزن و لینک مستقل):
                </h4>
                <span className="text-xs text-sky-300">
                  برای مشاهده یا دریافت PDF هر پروپوزال روی آن کلیک کنید
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allProposals.map((item) => {
                  const isCurrent = item.id === proposal.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectProposal?.(item.id)}
                      className={`rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isCurrent
                          ? 'bg-[#37A3DC]/25 border-[#37A3DC] text-white'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#7DD3FC]">
                            پروپوزال شماره {item.proposalNum} (سطح {item.tierLevel})
                          </span>
                          <span className="font-mono-num text-[11px] text-slate-300">
                            {item.totalHours}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-snug">
                          {item.recipientShortOnCover}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10.5px]">
                        <span className="text-emerald-300 font-semibold">
                          {item.investment.totalAmount}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProposal?.(item.id);
                            onSwitchToBrochure();
                          }}
                          className="text-sky-300 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <span>ایبوک ۲۲ صفحه‌ای</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 4. STRATEGIC CONTEXT, KEY DOMAINS & 4 CORE CHALLENGES ==================== */}
      <section
        id="context"
        className="py-14 lg:py-20 max-w-[1320px] mx-auto px-6 lg:px-10 space-y-10"
      >
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-12 space-y-9">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#0284C7]">
                فصل اول پروپوزال · شناخت راهبردی هلدینگ و ضرورت تحول
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A]">
                ۱. {proposal.strategicContextTitle}
              </h2>
            </div>
            <span className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm font-bold text-[#1D4760] shrink-0">
              کد اختصاصی سند: {proposal.letterNumber}
            </span>
          </div>

          <p className="text-base sm:text-[17px] leading-[2.2] text-slate-700 text-justify font-medium">
            {proposal.strategicContextLead}
          </p>

          {/* Key Strategic Domains of the Holding */}
          <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200/90 p-6 space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-[#1D4760]">
              محورهای تخصصی و حوزه‌های راهبردی مورد تمرکز در این پروپوزال آموزشی:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {proposal.keyEntitiesAndSites.map((site, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-xl bg-white border border-slate-200/90 text-sm font-bold text-[#0B253A] shadow-2xs flex items-center gap-2.5"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{site}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Strategic Challenges */}
          <div className="space-y-5">
            <h3 className="text-lg sm:text-xl font-black text-[#0B253A]">
              چالش‌های چهارگانه کلیدی که با آموزش متدولوژی PMI-CPMAI v8 هدف‌گذاری می‌شوند:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proposal.challenges.map((ch) => (
                <div
                  key={ch.num}
                  className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-6 sm:p-7 space-y-3 hover:border-[#37A3DC] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-9 h-9 rounded-xl bg-[#1D4760] text-white text-sm font-black flex items-center justify-center shrink-0">
                      {ch.num}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-[#0B253A]">
                      {ch.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-[2.05] text-justify">
                    {ch.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 7 AI PATTERNS & BUSINESS KPIs BENCHMARK ==================== */}
      <section
        id="patterns"
        className="py-14 lg:py-20 bg-white border-y border-slate-200/90"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-14">
          {/* 7 AI Patterns */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-extrabold text-[#0284C7]">
                  فصل دوم پروپوزال · معماری شناختی PMI-CPMAI
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A]">
                  ۲. انطباق الگوهای هفت‌گانه هوش مصنوعی (7 AI Patterns) با مسائل هلدینگ
                </h2>
              </div>
              <span className="text-xs sm:text-sm font-latin font-bold text-slate-500">
                PMI-CPMAI Seven Patterns of AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposal.aiPatterns.map((pat, idx) => {
                const isLastFullWidth =
                  proposal.aiPatterns.length === 7 && idx === 6;
                return (
                  <div
                    key={pat.num}
                    className={`rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-6 flex flex-col justify-between hover:border-[#37A3DC]/70 hover:shadow-md transition-all ${
                      isLastFullWidth
                        ? 'md:col-span-2 lg:col-span-3'
                        : ''
                    }`}
                  >
                    <div
                      className={
                        isLastFullWidth
                          ? 'flex flex-col lg:flex-row lg:items-center gap-5'
                          : 'space-y-4'
                      }
                    >
                      {/* Bespoke Graphic Emblem + Clean Unboxed Pattern Metadata */}
                      <div
                        className={`flex items-center gap-3.5 ${
                          isLastFullWidth
                            ? 'lg:w-[300px] lg:shrink-0 lg:pl-5 lg:border-l lg:border-slate-200/90'
                            : 'pb-3.5 border-b border-slate-200/80'
                        }`}
                      >
                        <AiPatternGraphicBadge
                          titleEn={pat.titleEn}
                          index={idx}
                        />
                        <div className="min-w-0 flex-1 space-y-0.5 text-right">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-[#0B253A]">
                              {pat.num}
                            </span>
                            <span className="text-[11px] font-mono-num font-extrabold text-slate-400 tabular-nums">
                              ۰{idx + 1} / ۰۷
                            </span>
                          </div>
                          <span
                            dir="ltr"
                            className="block text-left text-[11.5px] font-latin font-bold text-[#0284C7] truncate"
                          >
                            {pat.titleEn}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2 flex-1">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#0B253A] leading-snug">
                          {pat.titleFa}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-slate-600 leading-[2] text-justify">
                          {pat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business KPIs Table (Baseline vs. Target) */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                جدول شاخص‌های کلیدی عملکرد کسب‌وکار (Business KPIs — Baseline vs. Target)
              </h3>
              <span className="text-xs sm:text-sm font-bold text-[#059669]">
                شاخص‌های هدف‌گذاری در فاز اول متدولوژی CPMAI
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
              <table className="w-full text-right border-collapse text-sm sm:text-[15px]">
                <thead>
                  <tr className="bg-[#1D4760] text-white">
                    <th className="py-4 px-5 font-bold">
                      شاخص کلیدی عملکرد (Business KPI)
                    </th>
                    <th className="py-4 px-5 font-bold">
                      وضعیت فعلی (Baseline)
                    </th>
                    <th className="py-4 px-5 font-bold">
                      هدف‌گذاری (Target)
                    </th>
                    <th className="py-4 px-5 font-bold">واحد اندازه‌گیری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {proposal.kpis.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}
                    >
                      <td className="py-4 px-5 font-extrabold text-[#0B253A]">
                        {row.kpi}
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        {row.baseline}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-[#059669]">
                        {row.target}
                      </td>
                      <td className="py-4 px-5 text-slate-500 text-xs sm:text-sm">
                        {row.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROI & Go/No-Go Evaluation Matrix */}
          <div className="rounded-3xl bg-gradient-to-l from-[#0B253A] to-[#1D4760] text-white p-7 sm:p-9 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-6 h-6 text-[#37A3DC]" />
                <h3 className="text-lg sm:text-xl font-black">
                  تحلیل بازگشت سرمایه (ROI) و ممیزی ۹گانه امکان‌سنجی هوش مصنوعی (AI Go / No-Go)
                </h3>
              </div>
              {!proposal.hideFinancialFee && (
                <span className="px-3.5 py-1.5 rounded-xl bg-[#37A3DC] text-white text-xs sm:text-sm font-black">
                  نرخ حق‌الزحمه تدریس: {proposal.roiAnalysis.budgetFormatted}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-[15px] leading-[2]">
              <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="font-extrabold text-[#7DD3FC] block">
                  برآورد منافع مستقیم مالی (Tangible Annual Savings):
                </span>
                <p className="text-slate-100 text-justify">
                  {proposal.roiAnalysis.annualSavings}
                </p>
                <span className="font-extrabold text-[#7DD3FC] block pt-2">
                  منافع استراتژیک و غیرملموس (Intangible Benefits):
                </span>
                <p className="text-slate-200 text-justify">
                  {proposal.roiAnalysis.intangibleBenefits}
                </p>
              </div>

              <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="font-extrabold text-[#7DD3FC] block">
                  مقایسه با روش‌های سنتی (AI vs. Heuristic Rules):
                </span>
                <p className="text-slate-100 text-justify">
                  {proposal.roiAnalysis.heuristicComparison}
                </p>
                <span className="font-extrabold text-emerald-300 block pt-2">
                  نتیجه ممیزی ۹ پرسش کلیدی Go / No-Go:
                </span>
                <p className="text-slate-200 text-justify">
                  {proposal.roiAnalysis.goNoGoSummary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. 6-PHASE PMI-CPMAI v8 WORKBOOK & SIGN-OFF CHECKLIST ==================== */}
      <section
        id="workbook"
        className="py-14 lg:py-20 max-w-[1320px] mx-auto px-6 lg:px-10 space-y-10"
      >
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-12 space-y-9">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#0284C7]">
                فصل سوم پروپوزال · استاندارد آموزشی PMI-CPMAI v8
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B253A]">
                ۳. نقشه راه و کاربرگ عملیاتی ۶ فاز متدولوژی PMI-CPMAI v8
              </h2>
            </div>
            <span className="text-xs sm:text-sm text-slate-500">
              روی هر فاز کلیک کنید یا نمای کامل ۶ فاز را در پایین مشاهده نمایید
            </span>
          </div>

          {/* Interactive Phase Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {proposal.cpmaiPhases.map((ph, idx) => {
              const isSelected = idx === activePhaseIdx;
              return (
                <button
                  key={ph.phaseNum}
                  type="button"
                  onClick={() => setActivePhaseIdx(idx)}
                  className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1D4760] text-white border-[#1D4760] shadow-sm'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-[#37A3DC]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={`font-latin ${isSelected ? 'text-[#7DD3FC]' : 'text-[#0284C7]'}`}>
                      {ph.phaseNum}
                    </span>
                    <span className="font-latin text-[10px] opacity-80">
                      CPMAI v8
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold truncate">
                    {ph.titleFa}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Highlighted Active Phase Card */}
          {activePhase && (
            <div className="rounded-2xl border-2 border-[#37A3DC] bg-sky-50/40 p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#0284C7] block">
                    جزئیات آموزشی فاز انتخاب‌شده
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#0B253A]">
                    <span className="font-latin text-[#0284C7]">{activePhase.phaseNum}</span>: {activePhase.titleFa} (
                    <span className="font-latin text-base text-[#0284C7]">
                      {activePhase.titleEn}
                    </span>
                    )
                  </h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-[#1D4760] text-white text-xs sm:text-sm font-bold">
                  خروجی فاز: {activePhase.deliverable}
                </span>
              </div>

              <p className="text-sm sm:text-base font-extrabold text-slate-800">
                {activePhase.summary}
              </p>

              <ul className="space-y-2.5 text-sm sm:text-[15px] text-slate-700 leading-[2]">
                {activePhase.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[#0284C7] font-black mt-0.5">•</span>
                    <span className="text-justify">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Complete 6-Phase Overview Grid (2 columns for larger typography & lower density) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposal.cpmaiPhases.map((phase, idx) => (
              <div
                key={phase.phaseNum}
                onClick={() => setActivePhaseIdx(idx)}
                className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
                  idx === activePhaseIdx
                    ? 'border-[#0284C7] bg-white shadow-md'
                    : 'border-slate-200/90 bg-[#F8FAFC] hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-base font-black text-[#1D4760]">
                      <span className="font-latin text-[#0284C7]">{phase.phaseNum}</span> — {phase.titleFa}
                    </span>
                    <span className="text-xs font-latin font-bold text-[#0284C7]">
                      {phase.titleEn}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 leading-snug">
                    {phase.summary}
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-[1.95]">
                    {phase.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#37A3DC] font-bold">•</span>
                        <span className="text-justify">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[#0284C7]">خروجی تمرینی:</span>
                  <span className="font-extrabold text-[#0B253A]">
                    {phase.deliverable}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Educational Readiness & Workbook Checklist */}
          <div className="rounded-3xl bg-[#0B253A] text-white p-7 sm:p-9 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div>
                <span className="text-xs font-bold text-[#7DD3FC] block">
                  ارزیابی بلوغ آموزشی و تکمیل چرخه یادگیری (CPMAI Educational Readiness)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  چک‌لیست تعاملی ارزیابی دستاوردهای آموزشی و تکمیل کاربرگ‌های دوره
                </h3>
              </div>
              <span className="text-xs text-slate-300">
                معیارهای سنجش تسلط تیم بر متدولوژی PMI-CPMAI v8 در پایان دوره آموزشی
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {proposal.signOffChecklist.map((item, idx) => {
                const isChecked = Boolean(signOffChecked[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSignOff(idx)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className="text-sm sm:text-[15px] font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. CULTURE-BUILDING, CLOUD AI TOOLS, CURRICULUM & INVESTMENT ==================== */}
      <section
        id="investment"
        className="py-14 lg:py-20 bg-white border-t border-slate-200/90"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 space-y-14">
          {/* Training Culture, Cloud Learning Environment & Scope Boundary */}
          <div className="rounded-3xl border-2 border-sky-200 bg-sky-50/40 p-7 sm:p-9 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#0284C7]" />
                <h2 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                  ۴. رویکرد فرهنگ‌سازی سازمانی، ایجاد انگیزه و زیست‌بوم ابزارهای آموزشی (Cloud & Interactive AI Lab)
                </h2>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#1D4760] text-white text-xs sm:text-sm font-bold">
                صرفاً خدمات آموزشی و توانمندسازی (بدون تعهد تحویل سامانه یا پلتفرم)
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-[2.1] text-justify font-medium">
              {proposal.airGappedNote}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {proposal.airGappedTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3.5 rounded-xl bg-white border border-sky-200 text-sm font-bold text-[#0B253A] shadow-2xs flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#0284C7] text-white text-xs font-black flex items-center justify-center shrink-0">
                    ۰{idx + 1}
                  </span>
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum & Modules */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-[#0284C7] block">
                  فصل پنجم پروپوزال · برنامه درسی و کارگاهی
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                  ۵. {proposal.curriculumTitle} ({proposal.totalHours} —{' '}
                  {proposal.sessionsFormat})
                </h2>
              </div>
              <span className="px-4 py-2 rounded-xl bg-[#1D4760] text-white text-xs sm:text-sm font-bold">
                مجموع ساعات: {proposal.totalHours}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {proposal.modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-6 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#1D4760] text-white text-xs font-bold">
                        {mod.code}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-sky-100 text-[#0284C7] text-xs font-extrabold">
                        {mod.hours}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0B253A]">
                      {mod.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-slate-600 leading-[2] text-justify">
                      {mod.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {proposal.executiveGoalStatement && (
              <div className="rounded-2xl bg-[#0B253A] text-white p-6 sm:p-7 space-y-2 border border-[#37A3DC]/40">
                <span className="text-xs font-extrabold text-amber-300 block">
                  هدف کلیدی بلوک ابزارهای هوش مصنوعی و مهندسی پرامپت اجرایی
                </span>
                <p className="text-base sm:text-lg font-black leading-relaxed text-white">
                  «{proposal.executiveGoalStatement}»
                </p>
              </div>
            )}

            {proposal.sessionPlan10 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#0B253A]">
                    خلاصه سرفصل‌ها: جدول تفکیک متدولوژی و ابزارها در ۱۰ جلسه ۲.۵ ساعته (جمعاً ۲۵ ساعت)
                  </h3>
                  <span className="px-3 py-1 rounded-lg bg-[#0B253A] text-amber-300 text-xs font-extrabold">
                    دوشنبه‌ها ۰۷:۰۰ الی ۰۹:۳۰ صبح · تدریس دو استاده (۵۰٪ متدولوژی / ۵۰٪ ابزار)
                  </span>
                </div>

                {/* Synthetic/Mock Data Confidentiality Assurance Strip */}
                {proposal.separateProtocolDocument && (
                  <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/75 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-[13px] font-bold text-emerald-950 leading-relaxed">
                        <strong className="font-black">اصل محرمانگی و داده‌های فرضی آموزشی:</strong>{' '}
                        کلیه تمرینات، کارگاه‌ها و خروجی‌های ۱۰ جلسه منحصراً بر روی «داده‌ها و اسناد فرضی و شبیه‌سازی‌شده آموزشی (Mock Data)» اجرا شده و هیچ‌گونه داده واقعی سازمانی وارد ابزارهای ابری نمی‌شود. پروتکل شروع دوره و فصل ۶ به‌صورت مجزا در فایل «پروتکل» قرار دارد.
                      </p>
                    </div>
                    {onOpenProtocol && (
                      <button
                        type="button"
                        onClick={onOpenProtocol}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>باز کردن فایل مستقل «پروتکل»</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Dual-Instructor 50/50 Allocation Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#0284C7]/35 bg-sky-50/70 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0284C7] text-white font-black text-xs flex items-center justify-center shrink-0">
                      استاد ۱
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-[#0B253A]">
                        بخش اول هر جلسه: متدولوژی (۱ ساعت و ۱۵ دقیقه · ۰۷:۰۰ الی ۰۸:۱۵)
                      </div>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        تدریس ساختارمند سه فصل مرجع (فصل ۱: هوش مصنوعی چیست؟ · فصل ۲: کاربردهای هوش مصنوعی · فصل ۳: بهترین شیوه‌ها و روش‌شناسی CPMAI) — جمعاً ۱۲.۵ ساعت در ۱۰ جلسه
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#1D4760]/35 bg-[#1D4760]/[0.06] p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0B253A] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                      استاد ۲
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-[#0B253A]">
                        بخش دوم هر جلسه: ابزارها و کار عملی (۱ ساعت و ۱۵ دقیقه · ۰۸:۱۵ الی ۰۹:۳۰)
                      </div>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        آموزش و کارگاه زنده روی ابزارهای هوش مصنوعی با لوگوی مشخص تا تحویل خروجی آماده هیئت‌مدیره — جمعاً ۱۲.۵ ساعت در ۱۰ جلسه
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-right border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#0B253A] text-white">
                        <th className="py-3.5 px-3.5 font-bold whitespace-nowrap w-28">
                          جلسه (۲.۵ ساعت)
                        </th>
                        <th className="py-3.5 px-3.5 font-bold bg-[#0369A1] border-x border-white/15">
                          استاد ۱ · بخش متدولوژی
                          <span className="block text-[10.5px] font-semibold text-sky-100 mt-0.5">
                            نیمه اول · ۱ ساعت و ۱۵ دقیقه (۰۷:۰۰–۰۸:۱۵)
                          </span>
                        </th>
                        <th className="py-3.5 px-3.5 font-bold bg-[#1D4760] border-l border-white/15">
                          استاد ۲ · بخش ابزارها و کار با ابزارها
                          <span className="block text-[10.5px] font-semibold text-amber-200 mt-0.5">
                            نیمه دوم · ۱ ساعت و ۱۵ دقیقه (۰۸:۱۵–۰۹:۳۰)
                          </span>
                        </th>
                        <th className="py-3.5 px-3.5 font-bold whitespace-nowrap w-52">
                          ابزارهای جلسه (با لوگو)
                        </th>
                        <th className="py-3.5 px-3.5 font-bold w-52">
                          خروجی هیئت‌مدیره
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.sessionPlan10.map((s, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? 'bg-white border-b border-slate-100'
                              : 'bg-sky-50/35 border-b border-slate-100'
                          }
                        >
                          <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                            <span className="font-black text-[#0B253A] block">
                              {s.sessionNum}
                            </span>
                            <span className="text-[11px] font-bold text-[#0284C7] font-mono-num block mt-0.5">
                              {s.dayAndTime}
                            </span>
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                              ۱.۲۵س + ۱.۲۵س
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 align-top leading-relaxed border-x border-slate-100">
                            <span className="text-[11px] font-black text-[#0284C7] block mb-1">
                              {s.methodologyChapter || s.partLabel}
                            </span>
                            <span className="font-bold text-slate-800 block text-xs sm:text-[13px]">
                              {s.methodologyTopic || s.title}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 align-top leading-relaxed border-l border-slate-100">
                            <span className="text-[11px] font-black text-[#1D4760] block mb-1">
                              {s.toolsBlock || 'کارگاه ابزارهای AI'}
                            </span>
                            <span className="font-bold text-slate-800 block text-xs sm:text-[13px]">
                              {s.toolsTopic || s.title}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 align-top">
                            {s.toolIds && s.toolIds.length > 0 ? (
                              <AiToolBadgeList toolIds={s.toolIds} size="sm" />
                            ) : (
                              <span className="text-xs font-bold text-slate-600">
                                {s.tools}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3.5 align-top font-bold text-[#0B253A] text-xs sm:text-[13px] leading-relaxed">
                            {s.deliverable}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#0B253A] text-white font-extrabold text-xs">
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          جمع کل: ۱۰ جلسه
                        </td>
                        <td className="py-3 px-3.5 bg-[#0369A1]/90 border-x border-white/15">
                          استاد متدولوژی: ۱۲.۵ ساعت (۵۰٪ · فصول ۱ تا ۳)
                        </td>
                        <td className="py-3 px-3.5 bg-[#1D4760]/90 border-l border-white/15">
                          استاد ابزارها: ۱۲.۵ ساعت (۵۰٪ · کارگاه عملی)
                        </td>
                        <td className="py-3 px-3.5 text-sky-200">
                          مجموع کل دوره: ۲۵ ساعت
                        </td>
                        <td className="py-3 px-3.5 text-amber-300">
                          بسته ۹ خروجی هیئت‌مدیره
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {proposal.executiveDeliverables && (
              <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-6 sm:p-7 space-y-4">
                <h3 className="text-base sm:text-lg font-black text-[#0B253A]">
                  بسته ۹ خروجی ملموس که هر مدیر مؤسسه در پایان ۲۵ ساعت با خود به دفتر می‌برد:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {proposal.executiveDeliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200/90 p-4 text-xs sm:text-sm font-bold text-slate-800 leading-relaxed"
                    >
                      {deliv}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Case Study & Workbook Box */}
            <div className="rounded-2xl border-2 border-[#37A3DC] bg-sky-50/50 p-6 sm:p-7 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#1D4760]">
                  تمرین کارگاهی و مطالعه موردی پایانی (Educational Case Study): {proposal.capstone.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {onOpenProtocol && (
                    <button
                      type="button"
                      onClick={onOpenProtocol}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1D4760] hover:bg-[#0B253A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>مشاهده و چاپ پروتکل آغاز دوره</span>
                    </button>
                  )}
                  <span className="px-3.5 py-1 rounded-lg bg-[#0284C7] text-white text-xs font-bold">
                    خروجی آموزشی و هیئت‌مدیره
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-[15px] text-slate-700 leading-[2] text-justify">
                {proposal.capstone.deliverable}
              </p>
            </div>
          </div>

          {/* Executive Program Conditions / Investment Table */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B253A]">
                {proposal.hideFinancialFee
                  ? '۶. جدول مشخصات اجرایی، زمان‌بندی دوشنبه‌ها و شرایط برگزاری دوره (۲۵ ساعت)'
                  : '۶. جدول برآورد سرمایه‌گذاری خدمات آموزشی و شرایط برگزاری دوره'}
              </h2>
              <span className="text-xs sm:text-sm text-slate-500">
                {proposal.hideFinancialFee
                  ? '۱۰ جلسه ترکیبی ۲.۵ ساعته (۱۲.۵ ساعت متدولوژی ۳ فصل + ۱۲.۵ ساعت ابزارهای AI) همراه با صدور گواهینامه معتبر'
                  : 'شامل برگزاری کارگاه‌های آموزشی، فرهنگ‌سازی CPMAI، کاربرگ‌های آموزشی ۶ فاز و صدور گواهینامه معتبر (صرفاً خدمات آموزشی)'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-300 shadow-sm">
              <table className="w-full text-right border-collapse text-sm sm:text-[15px]">
                <thead>
                  <tr className="bg-[#0B253A] text-white">
                    <th className="py-4 px-5 font-bold">مخاطبان هدف</th>
                    <th className="py-4 px-5 font-bold">ظرفیت مجاز</th>
                    <th className="py-4 px-5 font-bold">مدت زمان کل دوره</th>
                    <th className="py-4 px-5 font-bold">
                      {proposal.hideFinancialFee
                        ? 'الگوی برگزاری و گواهینامه پایانی'
                        : 'نرخ حق‌الزحمه تدریس (به ازای هر ساعت)'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white font-semibold">
                    <td className="py-4 px-5 text-slate-800">
                      {proposal.investment.targetAudience}
                    </td>
                    <td className="py-4 px-5 text-slate-700 whitespace-nowrap">
                      {proposal.investment.capacity}
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {proposal.investment.duration}
                    </td>
                    <td className="py-4 px-5 font-black text-[#0284C7] text-base sm:text-lg">
                      {proposal.investment.hourlyRate}
                      <span className="block text-xs text-slate-600 font-normal mt-0.5">
                        ({proposal.investment.totalAmountWords})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
