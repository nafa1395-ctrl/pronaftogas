import React from 'react';
import {
  AI_CREDENTIALS_13,
  COMPANY_RESUME_DATA,
  CONFIDENTIALITY_STATEMENT,
  CONNECTION_TEST_PROTOCOL,
  DAILY_SCHEDULE,
  DOCUMENT_META,
  EXTRACTED_ASSETS,
  PM_CREDENTIALS,
  PROTOCOL_CLAUSES,
  SENIOR_COACHES_DATA,
} from '../data/protocolData';
import { KhatamProposalDocument } from '../data/khatamProposalsData';
import { AiToolBadgeList } from './AiToolLogos';

interface KhatamProposalBrochurePagesProps {
  proposal: KhatamProposalDocument;
  companyResume?: typeof COMPANY_RESUME_DATA;
  documentMeta?: typeof DOCUMENT_META;
  onSelectImage?: (src: string, title: string) => void;
  digitalUrl: string;
  digitalQrDataUrl: string;
}

const TOTAL_BROCHURE_PAGES = '۲۲';
const BrochureTotalPagesContext = React.createContext<string>(TOTAL_BROCHURE_PAGES);

const PageHeaderStrip: React.FC<{
  pageNum: string;
  sectionLabel: string;
  proposalTitle: string;
  digitalUrl: string;
  showAjaLogo?: boolean;
}> = ({
  pageNum,
  sectionLabel,
  proposalTitle,
  digitalUrl,
  showAjaLogo = true,
}) => {
  const totalBrochurePages = React.useContext(BrochureTotalPagesContext);
  return (
  <div className="w-full shrink-0">
    {/* Deep Teal-Navy Main Header Band (#1D4760) */}
    <div className="bg-[#1D4760] text-white px-9 py-3.5 flex items-center justify-between gap-4">
      <div
        data-pdf-link="https://www.owjbc.com"
        className="shrink-0 flex items-center"
      >
        <img
          src={EXTRACTED_ASSETS.owjLogoWhite}
          alt="OWJ Business Council - مشاوران مدیریت کسب و کار اوج"
          referrerPolicy="no-referrer"
          className="h-11 w-auto object-contain"
        />
      </div>

      {showAjaLogo ? (
        <div
          data-pdf-link={digitalUrl}
          className="flex flex-col items-center text-center px-2 min-w-0"
        >
          <span className="text-[11px] text-[#7DD3FC] font-bold whitespace-nowrap">
            پروپوزال رسمی{' '}
            <bdi dir="ltr" className="font-latin">
              PMI-CPMAI v8
            </bdi>{' '}
            · {proposalTitle}
          </span>
          <span className="text-[11.5px] font-extrabold text-white mt-0.5 whitespace-nowrap">
            {sectionLabel} — صفحه {pageNum} از {totalBrochurePages}
          </span>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {showAjaLogo ? (
        <div
          data-pdf-link={digitalUrl}
          className="shrink-0 flex items-center"
        >
          <img
            src={EXTRACTED_ASSETS.ajaLogoWhite}
            alt="Abolfazl Jafari Asl - ابوالفضل جعفری اصل"
            referrerPolicy="no-referrer"
            className="h-10 w-auto object-contain"
          />
        </div>
      ) : (
        <div className="w-28 shrink-0" />
      )}
    </div>

    {/* Sky-Cyan Accent Band (#37A3DC) */}
    <div className="h-3 w-full bg-[#37A3DC]" />
  </div>
  );
};

const PageFooterStrip: React.FC<{
  pageNum: string;
  proposalShort: string;
  organizationName: string;
  website: string;
  digitalUrl: string;
}> = ({ pageNum, proposalShort, organizationName, website, digitalUrl }) => (
  <div className="w-full pt-1 select-none shrink-0">
    <div className="relative h-14 w-full flex items-end overflow-hidden">
      <div className="w-full h-9 bg-[#1D4760] flex items-center justify-start px-7 text-[11px] text-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white whitespace-nowrap">
            {organizationName}
          </span>
          <span className="text-[#37A3DC]">·</span>
          <span className="truncate max-w-[230px]">{proposalShort}</span>
          <span className="text-[#37A3DC]">·</span>
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noreferrer"
            data-pdf-link={`https://${website}`}
            className="font-latin text-slate-200 underline decoration-[#37A3DC] whitespace-nowrap"
            dir="ltr"
          >
            {website}
          </a>
          <span className="text-[#37A3DC]">·</span>
          <a
            href={digitalUrl}
            target="_blank"
            rel="noreferrer"
            data-pdf-link={digitalUrl}
            className="text-[#7DD3FC] font-bold underline whitespace-nowrap"
          >
            مشاهده نسخه دیجیتال
          </a>
        </div>
      </div>

      <div className="absolute left-0 bottom-0 h-14 w-72 pointer-events-none">
        <svg
          viewBox="0 0 320 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 245,0 302,68 0,68" fill="#FFFFFF" />
          <polygon points="246,32 276,32 304,68 274,68" fill="#2E8BC0" />
          <polygon points="0,0 236,0 290,68 0,68" fill="#37A3DC" />
        </svg>
        <div className="absolute inset-y-0 left-12 flex items-center justify-center">
          <span className="text-white font-black text-xl tracking-wide">
            {pageNum}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const BrochurePageFrame: React.FC<{
  pageNum: string;
  sectionLabel: string;
  proposalTitle: string;
  organizationName: string;
  website: string;
  digitalUrl: string;
  showAjaLogo?: boolean;
  noInnerPadding?: boolean;
  children: React.ReactNode;
}> = ({
  pageNum,
  sectionLabel,
  proposalTitle,
  organizationName,
  website,
  digitalUrl,
  showAjaLogo = true,
  noInnerPadding = false,
  children,
}) => (
  <article className="print-page w-[850px] h-[1202px] m-0 bg-white shadow-xl border border-slate-200 flex flex-col overflow-hidden shrink-0 relative">
    <PageHeaderStrip
      pageNum={pageNum}
      sectionLabel={sectionLabel}
      proposalTitle={proposalTitle}
      digitalUrl={digitalUrl}
      showAjaLogo={showAjaLogo}
    />
    <div
      className={
        noInnerPadding
          ? 'flex-1 min-h-0 flex flex-col justify-start overflow-hidden'
          : 'px-11 py-5 flex-1 min-h-0 flex flex-col justify-start overflow-hidden'
      }
    >
      {children}
    </div>
    <PageFooterStrip
      pageNum={pageNum}
      proposalShort={proposalTitle}
      organizationName={organizationName}
      website={website}
      digitalUrl={digitalUrl}
    />
  </article>
);

const AccreditationLogosBar: React.FC = () => (
  <div className="w-full pt-2 shrink-0">
    <div className="flex items-center justify-between gap-6 px-3 py-1">
      <img
        src={EXTRACTED_ASSETS.iranPmaClean}
        alt="انجمن مدیریت پروژه ایران IranPMA"
        referrerPolicy="no-referrer"
        className="h-12 w-auto object-contain"
      />
      <img
        src={EXTRACTED_ASSETS.ipmaFullLogo}
        alt="IPMA International Project Management Association"
        referrerPolicy="no-referrer"
        className="h-12 w-auto object-contain"
      />
      <img
        src={EXTRACTED_ASSETS.axelosLogo}
        alt="AXELOS Global Best Practice"
        referrerPolicy="no-referrer"
        className="h-10 w-auto object-contain"
      />
      <img
        src={EXTRACTED_ASSETS.pmiLogo}
        alt="Project Management Institute (PMI)"
        referrerPolicy="no-referrer"
        className="h-11 w-auto object-contain"
      />
    </div>
  </div>
);

export const KhatamProposalBrochurePages: React.FC<
  KhatamProposalBrochurePagesProps
> = ({
  proposal,
  companyResume = COMPANY_RESUME_DATA,
  documentMeta = DOCUMENT_META,
  onSelectImage,
  digitalUrl,
  digitalQrDataUrl,
}) => {
  const phases1And2 = proposal.cpmaiPhases.slice(0, 2);
  const phases3And4 = proposal.cpmaiPhases.slice(2, 4);
  const phases5And6 = proposal.cpmaiPhases.slice(4, 6);

  const faPage = (n: number) =>
    n.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
  const hideFakouri = Boolean(
    proposal.excludedCoachIds?.includes(SENIOR_COACHES_DATA[0].id)
  );
  const hideAslani = Boolean(
    proposal.excludedCoachIds?.includes(SENIOR_COACHES_DATA[1].id)
  );
  const coachOffset = (hideFakouri ? 1 : 0) + (hideAslani ? 1 : 0);
  const isProtocolSeparated = Boolean(proposal.separateProtocolDocument);
  const totalPagesStr =
    coachOffset > 0 || isProtocolSeparated
      ? faPage(22 - coachOffset - (isProtocolSeparated ? 1 : 0))
      : TOTAL_BROCHURE_PAGES;
  const closingTermsPageNum = faPage(
    21 - coachOffset - (isProtocolSeparated ? 1 : 0)
  );

  const tocEntries = [
    { label: 'فهرست', page: '۴' },
    { label: 'درباره تیم اوج، مجریان و راهبران', page: '۵' },
    ...(!hideFakouri || !hideAslani
      ? [
          {
            label:
              !hideFakouri && !hideAslani
                ? 'معرفی کوچ‌های ارشد دوره (کاظم فکوری‌زاد و امیر اصلانی)'
                : !hideFakouri
                ? 'معرفی کوچ ارشد دوره (کاظم فکوری‌زاد)'
                : 'معرفی کوچ ارشد دوره (امیر اصلانی)',
            page: '۷',
          },
        ]
      : []),
    {
      label: 'درباره شرکت اوج و کارنامه مشتریان',
      page: faPage(9 - coachOffset),
    },
    {
      label: 'خلاصه سرفصل‌های دوره (فصول ۱ تا ۵)',
      page: faPage(11 - coachOffset),
    },
    ...(!isProtocolSeparated
      ? [
          {
            label: 'پروتکل اجرایی سالن و زمان‌بندی جلسات کارگاه',
            page: faPage(20 - coachOffset),
          },
        ]
      : []),
    { label: 'مدت زمان کل دوره و ساختار برگزاری', page: closingTermsPageNum },
    ...(proposal.hideFinancialFee
      ? [{ label: 'بسته ۹ خروجی ملموس هیئت‌مدیره', page: closingTermsPageNum }]
      : [{ label: 'حق‌الزحمه پیشنهادی', page: closingTermsPageNum }]),
    { label: 'تعداد نفرات حاضر در دوره', page: closingTermsPageNum },
    { label: 'مدارک شرکت در دوره', page: closingTermsPageNum },
  ];

  return (
    <BrochureTotalPagesContext.Provider value={totalPagesStr}>
    <div className="w-full overflow-x-auto pb-8">
      <div className="flex flex-col items-center space-y-10 print:space-y-0 min-w-[850px]">
        {/* ==================== PAGE 1: COVER ==================== */}
        <article className="print-page w-[850px] h-[1202px] m-0 bg-white shadow-xl border border-slate-200 relative overflow-hidden select-none shrink-0">
          <img
            src={proposal.coverImage || EXTRACTED_ASSETS.coverFull}
            alt={`${proposal.coverMainTitle} - ${proposal.recipientShortOnCover}`}
            referrerPolicy="no-referrer"
            onClick={() =>
              onSelectImage?.(
                proposal.coverImage || EXTRACTED_ASSETS.coverFull,
                `طرح روی جلد — ${proposal.recipientShortOnCover}`
              )
            }
            className="absolute inset-0 w-full h-full object-fill block cursor-pointer"
          />

          <div className="absolute inset-x-0 bottom-0 h-[29%] z-10 px-12 pb-6 pt-7 flex flex-col justify-between">
            <div className="w-full">
              <div className="pr-4 space-y-2 text-right">
                <h1 className="text-[25px] font-black text-[#0F172A] leading-tight tracking-tight whitespace-nowrap">
                  {proposal.coverMainTitle}
                </h1>
                <h2 className="text-[32px] font-black text-[#0F172A] leading-tight whitespace-nowrap">
                  {documentMeta.organization}
                </h2>
              </div>

              <div className="w-full h-[2.5px] bg-[#37A3DC] mt-3 mb-2.5" />

              <div className="flex items-center justify-between gap-4">
                <div className="text-right">
                  <span className="text-[22px] font-extrabold text-[#37A3DC] whitespace-nowrap tracking-tight block">
                    {proposal.recipientShortOnCover}
                  </span>
                  <span className="text-[11.5px] font-bold text-slate-600 block mt-0.5">
                    {proposal.tierBadge} · کد سند:{' '}
                    <bdi dir="ltr" className="font-latin">
                      {proposal.letterNumber}
                    </bdi>
                  </span>
                </div>

                <a
                  href={digitalUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-pdf-link={digitalUrl}
                  className="shrink-0 bg-white/95 border border-[#37A3DC]/80 rounded-xl px-2.5 py-1.5 shadow-sm flex items-center gap-2.5 hover:bg-sky-50/70 transition-colors"
                  title="مشاهده نسخه دیجیتال و تعاملی پروپوزال"
                >
                  <div className="text-right space-y-0.5 pl-1">
                    <span className="inline-block text-[9.5px] font-extrabold text-white bg-[#1D4760] px-2 py-0.5 rounded">
                      نسخه دیجیتال پروپوزال {proposal.proposalNum}
                    </span>
                    <p className="text-[10.5px] font-extrabold text-[#0F172A] leading-snug">
                      مشاهده آنلاین و نقشه راه
                    </p>
                  </div>
                  {digitalQrDataUrl && (
                    <img
                      src={digitalQrDataUrl}
                      alt="QR Code نسخه دیجیتال پروپوزال"
                      className="w-12 h-12 object-contain rounded-md border border-slate-200/80 p-0.5 bg-white shrink-0"
                    />
                  )}
                </a>
              </div>
            </div>

            <a
              href={`https://${documentMeta.website}`}
              target="_blank"
              rel="noreferrer"
              data-pdf-link={`https://${documentMeta.website}`}
              className="w-full pt-1 block"
            >
              <img
                src={EXTRACTED_ASSETS.contactStrip}
                alt="اطلاعات تماس مشاوران مدیریت کسب و کار اوج"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain"
              />
            </a>
          </div>
        </article>

        {/* ==================== PAGE 2: FORMAL COVER LETTER ==================== */}
        <BrochurePageFrame
          pageNum="۲"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="نامه رسمی معرفی پروپوزال"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
          showAjaLogo={false}
        >
          <div className="flex-1 flex flex-col justify-start pt-10 px-6 space-y-7 text-[#0F172A]">
            <div className="flex justify-end">
              <div className="space-y-2 text-[15.5px] font-black text-[#0F172A] min-w-[210px] text-right">
                <div className="flex items-center justify-between gap-4">
                  <span>تاریخ:</span>
                  <span className="font-mono-num">{proposal.letterDate}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>شماره نامه:</span>
                  <span className="font-latin" dir="ltr">
                    {proposal.letterNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>پیوست:</span>
                  <span>دارد</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[18px] font-black text-[#0F172A]">
                بسمه تعالی
              </span>
            </div>

            <div className="space-y-4 text-[18px] leading-[2.25]">
              <p className="font-black text-[#0F172A]">
                به: {proposal.recipientTitle}
              </p>
              <p className="font-bold text-[#0F172A]">
                از: {proposal.senderTitle}
              </p>
              <p className="font-bold text-[#0F172A]">
                موضوع: {proposal.subject}
              </p>
              <p className="font-bold text-[#0F172A] pt-2">با سلام</p>
              <p className="text-[17.5px] leading-[2.3] text-justify font-bold text-[#0F172A]">
                احتراماً، {proposal.executiveLead}
              </p>
            </div>

            <div className="pt-12 flex justify-end pl-16">
              <div className="text-center space-y-2">
                <p className="text-[16px] font-bold text-[#0F172A]">
                  با تقدیم احترام
                </p>
                <p className="text-[20px] font-black text-[#0F172A]">
                  {documentMeta.instructorName}
                </p>
                <p className="text-[16px] font-bold text-[#0F172A]">
                  {documentMeta.instructorRole}
                </p>
              </div>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 3: TITLE & COPYRIGHT NOTICE ==================== */}
        <BrochurePageFrame
          pageNum="۳"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="عنوان سند و صیانت از حقوق مالکیت معنوی"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 flex flex-col justify-evenly py-8 px-4 text-center">
            <div className="space-y-7">
              <div className="space-y-4">
                <h1 className="text-[30px] font-black text-[#0F172A] leading-snug">
                  {proposal.coverMainTitle}
                </h1>
                <p className="text-[26px] font-black text-[#0F172A]" dir="ltr">
                  (<span className="font-latin">PMI-CPMAI v8</span>)
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-[24px] font-extrabold text-[#37A3DC] leading-snug">
                  {proposal.tierBadge}
                </h2>
                <p className="text-[26px] font-black text-[#37A3DC] leading-snug">
                  {proposal.recipientShortOnCover}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={EXTRACTED_ASSETS.copyrightShieldClean}
                  alt="حقوق مالکیت معنوی شرکت مشاوران مدیریت کسب و کار اوج"
                  referrerPolicy="no-referrer"
                  className="w-36 h-36 object-contain"
                />
              </div>

              <p className="text-[15px] font-bold text-[#0F172A] leading-[2.15] text-center max-w-[700px] mx-auto">
                {companyResume.copyrightStatement}
              </p>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 4: TABLE OF CONTENTS + CONSTRUCTION STRIP ==================== */}
        <BrochurePageFrame
          pageNum="۴"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فهرست مطالب"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
          noInnerPadding
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start pt-12">
            <div className="px-16 space-y-8">
              <h2 className="text-[30px] font-black text-[#0F172A] text-center">
                فهرست
              </h2>

              <div className="space-y-4 text-[17px] font-black text-[#0F172A]">
                {tocEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-baseline gap-2 w-full leading-relaxed"
                  >
                    <span className="shrink-0">{entry.label}</span>
                    <span className="flex-1 border-b-2 border-dotted border-slate-500/80 mb-1" />
                    <span className="shrink-0 font-bold text-[#0F172A] min-w-[26px] text-left">
                      {entry.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full mt-auto pt-4 shrink-0">
              <img
                src={EXTRACTED_ASSETS.tocConstructionStrip}
                alt="نمای کارگاهی و مهندسی پروژه‌های زیربنایی"
                referrerPolicy="no-referrer"
                className="w-full h-[270px] object-cover object-center block"
              />
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 5: INSTRUCTOR PART 1 ==================== */}
        <BrochurePageFrame
          pageNum="۵"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="درباره تیم اوج، مجریان و راهبران: مدرس دوره"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3">
            <div className="grid grid-cols-12 gap-4 items-center shrink-0">
              <div className="col-span-7 space-y-4 text-right">
                <div className="space-y-1.5">
                  <span className="text-[17px] font-black text-[#0F172A] block">
                    مدرس دوره:
                  </span>
                  <h2 className="text-[36px] font-black text-[#0F172A] leading-tight">
                    {documentMeta.instructorName}
                  </h2>
                  <p className="text-[17px] font-bold text-[#0F172A]">
                    {documentMeta.instructorRole}
                  </p>
                </div>

                <div className="pt-2 pr-10">
                  <img
                    src={EXTRACTED_ASSETS.qrCode}
                    alt="کد QR ارتباطی استاد ابوالفضل جعفری اصل"
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      onSelectImage?.(
                        EXTRACTED_ASSETS.qrCode,
                        'کد QR ارتباطی استاد ابوالفضل جعفری اصل'
                      )
                    }
                    className="w-28 h-28 object-contain cursor-pointer"
                  />
                </div>
              </div>

              <div className="col-span-5 flex justify-center items-end">
                <img
                  src={EXTRACTED_ASSETS.instructorCutout}
                  alt={documentMeta.instructorName}
                  referrerPolicy="no-referrer"
                  onClick={() =>
                    onSelectImage?.(
                      EXTRACTED_ASSETS.instructorCutout,
                      'استاد ابوالفضل جعفری اصل'
                    )
                  }
                  className="w-full max-w-[270px] h-[300px] object-contain object-bottom cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[15px] font-black text-[#0284C7] leading-[1.85] pt-1">
              <span className="shrink-0 mt-0.5">▪</span>
              <p>{documentMeta.instructorDistinction}</p>
            </div>

            <ul className="space-y-2 text-[14px] font-bold text-[#0F172A] leading-[1.85]">
              {PM_CREDENTIALS.map((cred) => (
                <li key={cred.id} className="flex items-start gap-2.5">
                  <span className="text-[#0F172A] shrink-0">▪</span>
                  <span>{cred.titleFa}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <AccreditationLogosBar />
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 6: INSTRUCTOR PART 2 ==================== */}
        <BrochurePageFrame
          pageNum="۶"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="گواهینامه‌های ۱۳گانه هوش مصنوعی و تاییدیه‌های PMI"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3">
            <div className="text-center space-y-2">
              <h2 className="text-[28px] font-black text-[#0F172A]">
                {documentMeta.instructorName}
              </h2>
              <p className="text-[14.5px] font-black text-[#0F172A] leading-[1.85] max-w-[680px] mx-auto">
                اولین و تنها ایرانی دارنده تمامی گواهینامه‌های هوش مصنوعی{' '}
                <bdi dir="ltr" className="font-latin">
                  Cognilytica
                </bdi>{' '}
                آمریکا و انیستیتو مدیریت پروژه آمریکا (
                <bdi dir="ltr" className="font-latin">
                  PMI
                </bdi>
                ) (
                <bdi dir="ltr" className="font-latin">
                  CPMAI v7
                </bdi>
                ) (
                <bdi dir="ltr" className="font-latin">
                  PMI-CPMAI
                </bdi>
                )
              </p>
            </div>

            <ul className="space-y-2 text-[13.5px] font-bold text-[#0F172A] leading-[1.78]">
              {AI_CREDENTIALS_13.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <span className="text-[#0F172A] shrink-0">▪</span>
                  <span>{item.titleFa}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto grid grid-cols-2 gap-5 pt-2">
              <div
                onClick={() =>
                  onSelectImage?.(
                    EXTRACTED_ASSETS.certCpmaiV7,
                    'گواهینامه رسمی CPMAI v7 از PMI'
                  )
                }
                className="cursor-pointer bg-white flex items-center justify-center"
              >
                <img
                  src={EXTRACTED_ASSETS.certCpmaiV7}
                  alt="Cognitive Project Management in AI (CPMAI v7)"
                  referrerPolicy="no-referrer"
                  className="w-full h-[225px] object-contain"
                />
              </div>
              <div
                onClick={() =>
                  onSelectImage?.(
                    EXTRACTED_ASSETS.certPmiCpmai,
                    'گواهینامه رسمی PMI-CPMAI از انستیتو PMI'
                  )
                }
                className="cursor-pointer bg-white flex items-center justify-center"
              >
                <img
                  src={EXTRACTED_ASSETS.certPmiCpmai}
                  alt="PMI Certified Professional in Managing AI (PMI-CPMAI)"
                  referrerPolicy="no-referrer"
                  className="w-full h-[225px] object-contain"
                />
              </div>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 7: SENIOR COACH 1 — KAZEM FAKOURIZAD ==================== */}
        {!hideFakouri && (
        <BrochurePageFrame
          pageNum="۷"
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel={
            hideAslani
              ? 'کوچ ارشد دوره: کاظم فکوری‌زاد'
              : 'کوچ‌های ارشد دوره: کاظم فکوری‌زاد'
          }
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          {(() => {
            const coach = SENIOR_COACHES_DATA[0];
            return (
              <div className="flex-1 min-h-0 flex flex-col justify-start gap-4">
                <div>
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-7 space-y-2.5 text-right pb-3">
                      <span className="text-[17px] font-black text-[#0F172A] block">
                        {hideAslani ? 'کوچ ارشد دوره:' : 'کوچ‌های ارشد دوره:'}
                      </span>
                      <h2 className="text-[32px] font-black text-[#0F172A] leading-tight">
                        {coach.name}
                      </h2>
                      <p className="text-[13.5px] font-bold text-[#0F172A]">
                        {coach.roleTitle}
                      </p>

                      <ul className="space-y-1.5 pt-2 text-[13px] font-bold text-[#0F172A] leading-[1.82]">
                        {coach.experiences.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0F172A] shrink-0">•</span>
                            <span className="text-justify">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-span-5 flex justify-center items-end">
                      <img
                        src={coach.portrait}
                        alt={coach.name}
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          onSelectImage?.(
                            coach.portrait,
                            `${coach.name} — ${coach.roleTitle}`
                          )
                        }
                        className="w-full max-w-[275px] h-[330px] object-contain object-bottom cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="w-full border-t-[1.5px] border-slate-800" />
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-[16px] font-black text-[#0F172A]">
                    {coach.skillsTitle}
                  </h3>
                  <div className="space-y-2 text-[14px] leading-[1.9] text-[#0F172A]">
                    {coach.skills.map((sk, idx) => (
                      <p key={idx} className="font-bold">
                        <strong className="font-black text-[#0F172A]">
                          {sk.category}:
                        </strong>{' '}
                        {sk.items}
                      </p>
                    ))}
                  </div>
                </div>

                {coach.certificates && (
                  <div className="space-y-2.5">
                    <h3 className="text-[16px] font-black text-[#0F172A]">
                      {coach.certificatesTitle}
                    </h3>
                    <div className="space-y-2 text-[14px] font-bold leading-[1.9] text-[#0F172A]">
                      {coach.certificates.map((cert, idx) => (
                        <p key={idx}>{cert}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2">
                  <div className="w-full border-t border-slate-700 mb-1" />
                  <AccreditationLogosBar />
                </div>
              </div>
            );
          })()}
        </BrochurePageFrame>
        )}

        {/* ==================== PAGE 8: SENIOR COACH 2 — AMIR ASLANI ==================== */}
        {!hideAslani && (
        <BrochurePageFrame
          pageNum={faPage(8 - (hideFakouri ? 1 : 0))}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="کوچ‌های ارشد دوره: امیر اصلانی"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          {(() => {
            const coach = SENIOR_COACHES_DATA[1];
            return (
              <div className="flex-1 min-h-0 flex flex-col justify-start gap-6">
                <div>
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-7 space-y-3 text-right pb-4">
                      <span className="text-[17px] font-black text-[#0F172A] block">
                        کوچ‌های ارشد دوره:
                      </span>
                      <h2 className="text-[32px] font-black text-[#0F172A] leading-tight">
                        {coach.name}
                      </h2>
                      <p className="text-[14px] font-bold text-[#0F172A]">
                        {coach.roleTitle}
                      </p>

                      <ul className="space-y-2.5 pt-3 text-[14px] font-bold text-[#0F172A] leading-[1.95]">
                        {coach.experiences.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-[#0F172A] shrink-0">•</span>
                            <span className="text-justify">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-span-5 flex justify-center items-end">
                      <img
                        src={coach.portrait}
                        alt={coach.name}
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          onSelectImage?.(
                            coach.portrait,
                            `${coach.name} — ${coach.roleTitle}`
                          )
                        }
                        className="w-full max-w-[275px] h-[345px] object-contain object-bottom cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="w-full border-t-[1.5px] border-slate-800" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-[17px] font-black text-[#0F172A]">
                    {coach.skillsTitle}
                  </h3>
                  <div className="space-y-4 text-[15px] font-bold leading-[2.05] text-[#0F172A]">
                    <p>
                      <strong className="font-black">
                        هوش تجاری و مصورسازی داده (
                        <bdi dir="ltr" className="font-latin">
                          BI &amp; Visualization
                        </bdi>
                        ):
                      </strong>{' '}
                      <bdi dir="ltr" className="font-latin">
                        Tableau, Grafana, Reporting, DAX
                      </bdi>
                    </p>
                    <p>
                      <strong className="font-black">
                        مهندسی و پایگاه داده (
                        <bdi dir="ltr" className="font-latin">
                          Data Engineering &amp; DB
                        </bdi>
                        ):
                      </strong>{' '}
                      <bdi dir="ltr" className="font-latin">
                        SQL Server, T-SQL
                      </bdi>
                      ، طراحی پایگاه داده (
                      <bdi dir="ltr" className="font-latin">
                        Database Design
                      </bdi>
                      )، انبار داده (
                      <bdi dir="ltr" className="font-latin">
                        Data Warehousing
                      </bdi>
                      )، مدل‌سازی داده (
                      <bdi dir="ltr" className="font-latin">
                        Data Modeling
                      </bdi>
                      ) و فرآیندهای{' '}
                      <bdi dir="ltr" className="font-latin">
                        DAX
                      </bdi>{' '}
                      و{' '}
                      <bdi dir="ltr" className="font-latin">
                        ETL
                      </bdi>
                    </p>
                    <p>
                      <strong className="font-black">
                        برنامه‌نویسی و تحلیل داده:
                      </strong>{' '}
                      <bdi dir="ltr" className="font-latin">
                        Python
                      </bdi>{' '}
                      و تحلیل آماری و فرآیندی داده‌ها
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="w-full border-t border-slate-700 mb-1" />
                  <AccreditationLogosBar />
                </div>
              </div>
            );
          })()}
        </BrochurePageFrame>
        )}

        {/* ==================== PAGE 9: ABOUT OWJ, CLIENT LOGOS & SPEAKERS ==================== */}
        <BrochurePageFrame
          pageNum={faPage(9 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="درباره شرکت اوج و کارنامه مشتریان"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3">
            <div className="space-y-2.5 text-[13.5px] font-bold text-[#0F172A] leading-[1.88] text-justify shrink-0">
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-[#0F172A]">▪</span>
                <p>{companyResume.executiveIntro}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-[#0F172A]">▪</span>
                <p>{companyResume.clientsSummary}</p>
              </div>
            </div>

            <div
              onClick={() =>
                onSelectImage?.(
                  EXTRACTED_ASSETS.clientsLogosAndWorkshops,
                  'کارنامه مشتریان سازمانی شرکت مشاوران مدیریت کسب و کار اوج'
                )
              }
              className="flex-1 min-h-0 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              <img
                src={EXTRACTED_ASSETS.clientsLogosAndWorkshops}
                alt={companyResume.clientsSummary}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 10: IPMA PRIDE & WORKSHOPS GRID ==================== */}
        <BrochurePageFrame
          pageNum={faPage(10 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="کارنامه ملی گواهینامه‌های IPMA و کارگاه‌های جامع"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4">
            <div className="flex items-start gap-2.5 text-[16px] font-black text-[#0F172A] leading-[1.95] text-justify shrink-0">
              <span className="shrink-0">❖</span>
              <p>{companyResume.ipmaPrideStatement}</p>
            </div>

            <div
              onClick={() =>
                onSelectImage?.(
                  EXTRACTED_ASSETS.ipmaWorkshopsGrid,
                  companyResume.ipmaPrideStatement
                )
              }
              className="flex-1 min-h-0 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              <img
                src={EXTRACTED_ASSETS.ipmaWorkshopsGrid}
                alt={companyResume.ipmaPrideStatement}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 11: CHAPTER 1 PART 1 — STRATEGIC CONTEXT, DOMAINS & GOVERNANCE/PILLARS ==================== */}
        <BrochurePageFrame
          pageNum={faPage(11 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="خلاصه سرفصل‌های دوره · فصل اول (شناخت راهبردی هلدینگ)"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3 text-[#0F172A]">
            {proposal.sessionPlan10 ? (
              <>
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#1D4760] pb-1.5">
                  <h2 className="text-[18.5px] font-black text-[#0F172A]">
                    خلاصه سرفصل‌های دوره (۱۰ جلسه ۲.۵ ساعته · جمعاً ۲۵ ساعت)
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-[#0B253A] text-amber-300 text-[10px] font-black whitespace-nowrap">
                    دوشنبه‌ها ۰۷:۰۰ تا ۰۹:۳۰
                  </span>
                </div>

                {/* Dual-Instructor 50/50 Split Strip */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-[#0284C7]/40 bg-sky-50/80 px-2.5 py-1.5">
                    <div className="text-[11px] font-black text-[#0369A1]">
                      استاد اول · بخش متدولوژی (۱.۲۵ ساعت · ۰۷:۰۰ الی ۰۸:۱۵)
                    </div>
                    <div className="text-[9.5px] font-bold text-slate-700">
                      نیمه اول هر جلسه · سه فصل مرجع (تجمعی ۱۲.۵ ساعت · ۵۰٪ دوره)
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#1D4760]/40 bg-[#1D4760]/[0.06] px-2.5 py-1.5">
                    <div className="text-[11px] font-black text-[#1D4760]">
                      استاد دوم · بخش ابزارها و کار عملی (۱.۲۵ ساعت · ۰۸:۱۵ الی ۰۹:۳۰)
                    </div>
                    <div className="text-[9.5px] font-bold text-slate-700">
                      نیمه دوم هر جلسه · کار با ابزارهای AI (تجمعی ۱۲.۵ ساعت · ۵۰٪ دوره)
                    </div>
                  </div>
                </div>

                {/* 10-Session Split Table with Tool Logos */}
                <table className="w-full text-right border-collapse text-[9.5px] border border-slate-200">
                  <thead>
                    <tr className="bg-[#0B253A] text-white">
                      <th className="py-1.5 px-1.5 font-black w-14 text-center">
                        جلسه
                      </th>
                      <th className="py-1.5 px-2 font-black bg-[#0369A1] w-[31%]">
                        استاد ۱ · متدولوژی (۱.۲۵س)
                      </th>
                      <th className="py-1.5 px-2 font-black bg-[#1D4760] w-[33%]">
                        استاد ۲ · ابزارها و کار عملی (۱.۲۵س)
                      </th>
                      <th className="py-1.5 px-2 font-black w-[27%]">
                        ابزارهای جلسه (با لوگو)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.sessionPlan10.map((s, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-white border-b border-slate-200/90'
                            : 'bg-[#F3F9FD] border-b border-slate-200/90'
                        }
                      >
                        <td className="py-1.5 px-1.5 text-center align-top whitespace-nowrap font-black text-[#0B253A]">
                          {s.sessionNum}
                          <span className="block text-[8.5px] font-bold text-[#0284C7] font-mono-num">
                            ۲.۵ ساعت
                          </span>
                        </td>
                        <td className="py-1.5 px-2 align-top leading-[1.45] border-x border-slate-200/70">
                          <span className="font-black text-[#0369A1] block text-[9px]">
                            {s.methodologyChapter || s.partLabel}
                          </span>
                          <span className="font-bold text-[#0F172A] block">
                            {s.methodologyTopic || s.title}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 align-top leading-[1.45] border-l border-slate-200/70">
                          <span className="font-bold text-[#0F172A] block">
                            {s.toolsTopic || s.title}
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 align-top">
                          {s.toolIds && s.toolIds.length > 0 ? (
                            <AiToolBadgeList toolIds={s.toolIds} size="xs" />
                          ) : (
                            <span className="text-[9px] font-bold text-slate-600">
                              {s.tools}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#0B253A] text-white font-black text-[9.5px]">
                      <td className="py-1.5 px-1.5 text-center">۱۰ جلسه</td>
                      <td className="py-1.5 px-2 bg-[#0369A1]">
                        جمع متدولوژی: ۱۲.۵ ساعت (۵۰٪)
                      </td>
                      <td className="py-1.5 px-2 bg-[#1D4760]">
                        جمع کارگاه ابزار: ۱۲.۵ ساعت (۵۰٪)
                      </td>
                      <td className="py-1.5 px-2 text-amber-300">
                        جمع کل دوره: ۲۵ ساعت
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </>
            ) : (
              <>
                <h2 className="text-[22px] font-black text-[#0F172A]">
                  خلاصه سرفصل‌های دوره:
                </h2>

                <div className="space-y-2">
                  <h3 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                    <span className="font-normal text-[17px]">❑</span>
                    <span>فصل اول (شناخت راهبردی هلدینگ)</span>
                  </h3>

                  <div className="flex items-start gap-2 text-[15px] font-black text-[#0F172A]">
                    <span className="shrink-0">❖</span>
                    <span>{proposal.strategicContextTitle}:</span>
                  </div>

                  <p className="text-[14px] font-bold leading-[1.9] text-justify pr-5 text-[#0F172A]">
                    {proposal.strategicContextLead}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[15px] font-black text-[#0F172A]">
                    محورهای تخصصی و حوزه‌های راهبردی مورد تمرکز در مثال‌ها و تمرینات این دوره:
                  </h4>
                  <ul className="space-y-1.5 text-[14px] font-bold leading-[1.82] pr-3">
                    {proposal.keyEntitiesAndSites.map((domain, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="shrink-0">•</span>
                        <span>{domain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {proposal.cascadeGovernance ? (
                  <div className="space-y-2 pt-3 border-t border-slate-300">
                    <h4 className="text-[15px] font-black text-[#0284C7]">
                      ❖{' '}
                      {proposal.isStandaloneSpecialCourse
                        ? 'ساختار ترکیبی دوره ۲۵ ساعته (۱۰ جلسه ۲.۵ ساعته):'
                        : (
                          <>
                            معماری آبشاری ۳ سطحی استقرار استاندارد{' '}
                            <bdi dir="ltr" className="font-latin">
                              PMI-CPMAI v8
                            </bdi>{' '}
                            در قرارگاه (هر سطح ۹۶ ساعت):
                          </>
                        )}
                    </h4>
                    <ul className="space-y-2 text-[13.5px] font-bold leading-[1.8] pr-3">
                      {proposal.cascadeGovernance.tiers.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="shrink-0 text-[#0284C7]">▪</span>
                          <span>
                            <strong className="font-black text-[#1D4760]">
                              {t.level} ({t.duration}):
                            </strong>{' '}
                            {t.outcome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-3 border-t border-slate-300">
                    <h4 className="text-[15px] font-black text-[#0284C7]">
                      ❖ ۴ مزیت اختصاصی پیاده‌سازی آموزشی استاندارد{' '}
                      <bdi dir="ltr" className="font-latin">
                        PMI-CPMAI v8
                      </bdi>{' '}
                      برای مدیران و کارشناسان این هلدینگ:
                    </h4>
                    <ul className="space-y-2 text-[13.5px] font-bold leading-[1.8] pr-3">
                      {companyResume.whyOwjForCpmai.map((pillar, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="shrink-0 text-[#0284C7]">▪</span>
                          <span>
                            <strong className="font-black text-[#1D4760]">
                              {pillar.title}:
                            </strong>{' '}
                            {pillar.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 12: CHAPTER 1 PART 2 — STRATEGIC CHALLENGES ==================== */}
        <BrochurePageFrame
          pageNum={faPage(12 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل اول (ادامه): چالش‌های راهبردی هلدینگ"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-5 text-[#0F172A]">
            <div className="space-y-2.5">
              <h3 className="text-[19px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[17px]">❑</span>
                <span>
                  چالش‌های راهبردی هلدینگ و ضرورت آموزش{' '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI v8
                  </bdi>
                </span>
              </h3>
              <p className="text-[15px] font-bold leading-[1.9] text-[#0F172A]">
                گلوگاه‌های کلیدی که آموزش و فرهنگ‌سازی استاندارد جهانی مدیریت پروژه‌های هوش مصنوعی (
                <bdi dir="ltr" className="font-latin">
                  CPMAI
                </bdi>
                ) مستقیماً به حل آن‌ها کمک می‌کند:
              </p>
            </div>

            <div className="space-y-5">
              {proposal.challenges.map((ch) => (
                <div
                  key={ch.num}
                  className="space-y-1.5 border-r-3 border-[#37A3DC] pr-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[16px] font-black text-[#0F172A]">
                      {ch.num}. {ch.title}
                    </h4>
                    <span className="text-[12px] font-extrabold text-[#0284C7] shrink-0">
                      پاسخ: چرخه ۶ فازی{' '}
                      <bdi dir="ltr" className="font-latin">
                        PMI-CPMAI v8
                      </bdi>
                    </span>
                  </div>
                  <p className="text-[14.5px] font-bold leading-[1.95] text-justify text-slate-800">
                    {ch.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-300 space-y-2.5">
              <p className="text-[14.5px] font-black leading-[1.95] text-justify text-[#1D4760]">
                ❖ نتیجه‌گیری راهبردی: عبور از این چالش‌ها نیازمند خرید عجولانه نرم‌افزار نیست؛ بلکه در گام نخست نیازمند آموزش، فرهنگ‌سازی و ایجاد زبان مشترک{' '}
                <bdi dir="ltr" className="font-latin">
                  PMI-CPMAI v8
                </bdi>{' '}
                در میان مدیران و کارشناسان کلیدی هلدینگ است.
              </p>

              {proposal.challenges.length < 4 && (
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                  <h4 className="text-[14.5px] font-black text-[#0F172A]">
                    ❖ نقشه ارتباطی چالش‌های هلدینگ با رشته‌های تخصصی شرکت اوج:
                  </h4>
                  <p className="text-[13.5px] font-bold leading-[1.85] text-justify text-slate-700">
                    {companyResume.tagline}
                  </p>
                </div>
              )}
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 13: CHAPTER 2 — ALL 7 AI PATTERNS UNIFIED ==================== */}
        <BrochurePageFrame
          pageNum={faPage(13 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل دوم: نگاشت یکپارچه الگوهای هفت‌گانه هوش مصنوعی (۱ تا ۷)"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3 text-[#0F172A]">
            <div className="space-y-1.5">
              <h3 className="text-[18.5px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[17px]">❑</span>
                <span>
                  فصل دوم (نگاشت الگوهای هفت‌گانه هوش مصنوعی{' '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI Seven Patterns
                  </bdi>
                  )
                </span>
              </h3>
              <div className="flex items-start gap-2 text-[14px] font-bold leading-[1.8]">
                <span className="shrink-0">❖</span>
                <p>
                  طبق استاندارد جهانی{' '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI
                  </bdi>
                  ، تمامی پروژه‌های هوش مصنوعی جهان در ۷ الگوی بنیادین دسته‌بندی می‌شوند. در این کارگاه نحوه کاربست هر ۷ الگو در مسائل واقعی هلدینگ تمرین می‌شود:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {proposal.aiPatterns.map((pat) => (
                <div
                  key={pat.num}
                  className="space-y-1 pr-3 border-r-2 border-[#37A3DC]/70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[15px] font-black text-[#0F172A]">
                      • {pat.num}: {pat.titleFa}
                    </h4>
                    <span
                      className="font-latin text-[11.5px] font-bold text-[#0284C7] shrink-0"
                      dir="ltr"
                    >
                      {pat.titleEn}
                    </span>
                  </div>
                  <p className="text-[13.5px] font-bold leading-[1.8] text-justify pr-3 text-slate-800">
                    {pat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 14: CHAPTER 2 PART 2 — HEURISTIC VS AI + KPIs + ROI & GO/NO-GO ==================== */}
        <BrochurePageFrame
          pageNum={faPage(14 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="شاخص‌های کلیدی عملکرد (KPI)، تحلیل بازگشت سرمایه و امکان‌سنجی"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4 text-[#0F172A]">
            <div className="space-y-1.5">
              <h3 className="text-[16.5px] font-black text-[#1D4760]">
                ❖ تفاوت رویکرد شناختی (<bdi dir="ltr" className="font-latin">CPMAI</bdi>) در برابر روش‌های سنتی و فرمول‌های ایستا:
              </h3>
              <p className="text-[13.5px] font-bold leading-[1.88] text-justify pr-3 text-[#0F172A]">
                {proposal.roiAnalysis.heuristicComparison}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-300">
              <h3 className="text-[16.5px] font-black text-[#0F172A]">
                جدول شاخص‌های کلیدی عملکردی کسب‌وکار (
                <bdi dir="ltr" className="font-latin">
                  Baseline vs. Target
                </bdi>
                ):
              </h3>

              <div className="w-full overflow-hidden">
                <table className="w-full text-center border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#1D4760] text-white">
                      <th className="py-2.5 px-3 font-black text-right">
                        شاخص کلیدی عملکرد (<bdi dir="ltr" className="font-latin">KPI</bdi>)
                      </th>
                      <th className="py-2.5 px-3 font-black">
                        وضعیت فعلی (<bdi dir="ltr" className="font-latin">Baseline</bdi>)
                      </th>
                      <th className="py-2.5 px-3 font-black">
                        هدف‌گذاری (<bdi dir="ltr" className="font-latin">Target</bdi>)
                      </th>
                      <th className="py-2.5 px-3 font-black">واحد سنجش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.kpis.map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-[#EEF7FC] border-b border-white'
                            : 'bg-white border-b border-slate-100'
                        }
                      >
                        <td className="py-2.5 px-3 font-black text-[#0F172A] text-right">
                          {row.kpi}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">
                          {row.baseline}
                        </td>
                        <td className="py-2.5 px-3 font-black text-[#0284C7]">
                          {row.target}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-600 text-[12px]">
                          {row.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2.5 pt-2.5 border-t border-slate-300">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[16px] font-black text-[#1D4760]">
                  تحلیل بازگشت سرمایه (<bdi dir="ltr" className="font-latin">ROI</bdi>) و ممیزی ۹گانه امکان‌سنجی (<bdi dir="ltr" className="font-latin">AI Go / No-Go</bdi>):
                </h3>
                {!proposal.hideFinancialFee && (
                  <span className="text-[12.5px] font-black text-[#0284C7] shrink-0">
                    حق‌الزحمه تدریس: {proposal.roiAnalysis.budgetFormatted}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-[13.5px] font-bold leading-[1.85]">
                <p className="text-justify">
                  <strong className="font-black text-[#0F172A]">
                    ❖ برآورد منافع و صرفه‌جویی مستقیم سالانه:
                  </strong>{' '}
                  {proposal.roiAnalysis.annualSavings}
                </p>
                <p className="text-justify">
                  <strong className="font-black text-[#0F172A]">
                    ❖ منافع استراتژیک و فرهنگی برای هلدینگ:
                  </strong>{' '}
                  {proposal.roiAnalysis.intangibleBenefits}
                </p>
                <p className="text-justify">
                  <strong className="font-black text-[#0284C7]">
                    ❖ جمع‌بندی ممیزی ۹ پرسش امکان‌سنجی (AI Go / No-Go):
                  </strong>{' '}
                  {proposal.roiAnalysis.goNoGoSummary}
                </p>
              </div>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 15: CHAPTER 3 PART 1 — CPMAI v8 (PHASES I & II) ==================== */}
        <BrochurePageFrame
          pageNum={faPage(15 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل سوم: کاربرگ آموزشی متدولوژی PMI-CPMAI v8 (Phases I & II)"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4 text-[#0F172A]">
            <div className="space-y-2">
              <h3 className="text-[18.5px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[17px]">❑</span>
                <span>
                  فصل سوم (کاربرگ آموزشی متدولوژی{' '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI v8 — Phases I &amp; II
                  </bdi>
                  )
                </span>
              </h3>
              <div className="flex items-start gap-2 text-[14.5px] font-bold leading-[1.85]">
                <span className="shrink-0">❖</span>
                <p>
                  {proposal.isStandaloneSpecialCourse
                    ? 'در طول دوره ۲۵ ساعته (۱۰ جلسه ترکیبی ۲.۵ ساعته · دوشنبه‌ها ۰۷:۰۰ الی ۰۹:۳۰ صبح)، مدیران مؤسسات و شرکت‌های تابعه همزمان با متدولوژی سه‌فصلی، چارچوب‌های کلیدی و کاربرگ‌های کاربردی استاندارد '
                    : 'در طول دوره ۹۶ ساعته، شرکت‌کنندگان گام‌به‌گام کاربرگ‌های ۶ فاز استاندارد '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI v8
                  </bdi>{' '}
                  را بر روی مسائل و داده‌های نمونه آموزشی هلدینگ تکمیل می‌نمایند:
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {phases1And2.map((phase) => (
                <div
                  key={phase.phaseNum}
                  className="space-y-2 pr-3.5 border-r-3 border-[#1D4760]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[16.5px] font-black text-[#1D4760]">
                      <span className="font-latin" dir="ltr">
                        {phase.phaseNum}
                      </span>
                      : {phase.titleFa}
                    </h4>
                    <span
                      className="font-latin text-[12px] font-bold text-[#0284C7] shrink-0"
                      dir="ltr"
                    >
                      {phase.titleEn}
                    </span>
                  </div>
                  <p className="text-[14px] font-black text-[#0F172A]">
                    هدف فاز: {phase.summary}
                  </p>
                  <ul className="space-y-1.5 text-[13.5px] font-bold leading-[1.82] pr-2 text-slate-800">
                    {phase.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 text-[#0284C7]">•</span>
                        <span className="text-justify">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[13px] font-black text-[#0284C7] pt-0.5">
                    ▪ خروجی تمرینی فاز در کارگاه: {phase.deliverable}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-300 text-[13px] font-bold text-[#1D4760] flex items-center justify-between">
              <span>
                خروجی فازهای اول و دوم مبنای تصمیم‌گیری مدیریتی (Go / No-Go) پیش از ورود به فاز داده است.
              </span>
              <span className="font-latin shrink-0" dir="ltr">
                Phases I &amp; II
              </span>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 16: CHAPTER 3 PART 2 — CPMAI v8 (PHASES III & IV) ==================== */}
        <BrochurePageFrame
          pageNum={faPage(16 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل سوم (ادامه): کاربرگ آموزشی (Phases III & IV)"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4 text-[#0F172A]">
            <div className="space-y-2">
              <h3 className="text-[18.5px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[17px]">❑</span>
                <span>
                  ادامه کاربرگ آموزشی متدولوژی{' '}
                  <bdi dir="ltr" className="font-latin">
                    PMI-CPMAI v8 — Phases III &amp; IV
                  </bdi>
                </span>
              </h3>
              <p className="text-[14.5px] font-bold leading-[1.85]">
                تمرین عملی آماده‌سازی داده‌ها و ساخت مدل‌های شناختی با استفاده از ابزارهای آموزشی تعاملی و ابری (بدون نیاز به کدنویسی):
              </p>
            </div>

            <div className="space-y-5">
              {phases3And4.map((phase) => (
                <div
                  key={phase.phaseNum}
                  className="space-y-2 pr-3.5 border-r-3 border-[#37A3DC]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[16.5px] font-black text-[#1D4760]">
                      <span className="font-latin" dir="ltr">
                        {phase.phaseNum}
                      </span>
                      : {phase.titleFa}
                    </h4>
                    <span
                      className="font-latin text-[12px] font-bold text-[#0284C7] shrink-0"
                      dir="ltr"
                    >
                      {phase.titleEn}
                    </span>
                  </div>
                  <p className="text-[14px] font-black text-[#0F172A]">
                    هدف فاز: {phase.summary}
                  </p>
                  <ul className="space-y-1.5 text-[13.5px] font-bold leading-[1.82] pr-2 text-slate-800">
                    {phase.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 text-[#0284C7]">•</span>
                        <span className="text-justify">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[13px] font-black text-[#0284C7] pt-0.5">
                    ▪ خروجی تمرینی فاز در کارگاه: {phase.deliverable}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-300 text-[13px] font-bold text-[#1D4760] flex items-center justify-between">
              <span>
                فازهای پنجم و ششم به همراه چک‌لیست ارزیابی دستاوردهای دوره در صفحه بعد ارائه شده‌اند.
              </span>
              <span className="font-latin shrink-0" dir="ltr">
                Phases III &amp; IV
              </span>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 17: CHAPTER 3 PART 3 — PHASES V & VI + READINESS CHECKLIST ==================== */}
        <BrochurePageFrame
          pageNum={faPage(17 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل سوم (بخش پایانی): Phases V & VI و چک‌لیست ارزیابی"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4 text-[#0F172A]">
            <div className="space-y-4">
              {phases5And6.map((phase) => (
                <div
                  key={phase.phaseNum}
                  className="space-y-1.5 pr-3.5 border-r-3 border-[#1D4760]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[16px] font-black text-[#1D4760]">
                      <span className="font-latin" dir="ltr">
                        {phase.phaseNum}
                      </span>
                      : {phase.titleFa}
                    </h4>
                    <span
                      className="font-latin text-[12px] font-bold text-[#0284C7] shrink-0"
                      dir="ltr"
                    >
                      {phase.titleEn}
                    </span>
                  </div>
                  <p className="text-[13.5px] font-black text-[#0F172A]">
                    هدف فاز: {phase.summary}
                  </p>
                  <ul className="space-y-1 text-[13px] font-bold leading-[1.78] pr-2 text-slate-800">
                    {phase.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 text-[#0284C7]">•</span>
                        <span className="text-justify">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[12.5px] font-black text-[#0284C7]">
                    ▪ خروجی تمرینی فاز: {phase.deliverable}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-300">
              <h4 className="text-[15px] font-black text-[#1D4760]">
                ❖ چک‌لیست ارزیابی دستاوردهای آموزشی و تکمیل کاربرگ‌های دوره (
                <bdi dir="ltr" className="font-latin">
                  CPMAI Readiness Checklist
                </bdi>
                ):
              </h4>
              <ul className="space-y-1.5 text-[13.5px] font-bold leading-[1.82] pr-3">
                {proposal.signOffChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-black shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 18: CHAPTER 4 — ORGANIZATIONAL CULTURE, TOOLS & READINESS PROTOCOL ==================== */}
        <BrochurePageFrame
          pageNum={faPage(18 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل چهارم: فرهنگ‌سازی سازمانی، ابزارهای آموزشی و آمادگی پیش از کارگاه"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-4 text-[#0F172A]">
            <h3 className="text-[18.5px] font-black text-[#0F172A] flex items-center gap-2">
              <span className="font-normal text-[17px]">❑</span>
              <span>
                فصل چهارم (فرهنگ‌سازی سازمانی، ایجاد انگیزه تیمی و محیط ابزارهای آموزشی)
              </span>
            </h3>

            {proposal.executiveGoalStatement && (
              <div className="rounded-xl bg-[#EEF7FC] border border-[#37A3DC]/60 px-4 py-3 text-[13.5px] font-extrabold text-[#0B253A] leading-[1.85] text-justify">
                <span className="text-[#0284C7] font-black">هدف کلیدی دوره: </span>
                {proposal.executiveGoalStatement}
              </div>
            )}

            <p className="text-[14px] font-bold leading-[1.95] text-justify text-[#0F172A]">
              {proposal.airGappedNote}
            </p>

            <div className="space-y-2">
              <h4 className="text-[15.5px] font-black text-[#0F172A]">
                زیست‌بوم ابزارهای آموزشی مورد استفاده در کارگاه (بر روی داده‌های نمونه آموزشی):
              </h4>
              <ul className="space-y-1.5 text-[14px] font-bold leading-[1.85] pr-4">
                {proposal.airGappedTools.map((tool, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="shrink-0">•</span>
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-300">
              <h4 className="text-[15px] font-black text-[#1D4760]">
                ❖ تمایز رقابتی و شفاف‌سازی مرز تعهدات فاز آموزش:
              </h4>
              <p className="text-[13.5px] font-bold leading-[1.9] text-justify pr-4 text-slate-800">
                هدف محوری این پروپوزال، آموزش استاندارد جهانی{' '}
                <bdi dir="ltr" className="font-latin">
                  PMI-CPMAI v8
                </bdi>
                ، فرهنگ‌سازی سازمانی و ایجاد انگیزه و اشتیاق در تیم‌های مدیریتی و کارشناسی هلدینگ با استفاده از ابزارهای آموزشی ابری و در دسترس است. لذا این دوره شامل تعهد به اجرای آموزش بر روی بسترهای آفلاین/لوکال یا تعهد تحویل سامانه، پلتفرم نرم‌افزاری یا پیاده‌سازی عملیاتی نبوده و تصمیم‌گیری در خصوص ابزارهای لوکال صرفاً پس از بلوغ آموزشی تیم در فازهای بعدی مطرح خواهد شد.
              </p>
            </div>

            {isProtocolSeparated ? (
              <div className="space-y-2.5 pt-3 border-t border-slate-300">
                <h4 className="text-[15px] font-black text-[#0284C7]">
                  ❖ اصل محرمانگی و استفاده انحصاری از داده‌های فرضی و شبیه‌سازی‌شده آموزشی (
                  <bdi dir="ltr" className="font-latin">
                    Synthetic / Mock Data
                  </bdi>
                  ):
                </h4>
                <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-4 space-y-1.5 text-[13px] font-bold leading-[1.85] text-slate-800 text-justify">
                  <p>
                    با توجه به حساسیت و محرمانگی اطلاعات هلدینگ و مؤسسات تابعه، تمامی کارگاه‌ها، تمرینات پرامپت‌نویسی، ممیزی‌های قراردادی در{' '}
                    <bdi dir="ltr" className="font-latin">
                      NotebookLM
                    </bdi>
                    ، ساخت دستیاران مقیم و داشبوردهای تعاملی در طول دوره منحصراً بر روی{' '}
                    <strong className="font-black text-emerald-950">
                      «داده‌ها و اسناد فرضی و شبیه‌سازی‌شده آموزشی»
                    </strong>{' '}
                    اجرا می‌گردد و هیچ‌گونه سند، آمار یا داده واقعی سازمانی در ابزارهای ابری بارگذاری نخواهد شد.
                  </p>
                  <p className="text-[12px] font-extrabold text-[#1D4760]">
                    • توجه اجرایی: پروتکل شروع دوره (تست اتصال)، الزامات فنی سالن و زمان‌بندی تفصیلی جلسات در فایل مستقل{' '}
                    <strong className="text-[#0284C7]">«پروتکل»</strong> تدوین و به‌صورت مجزا ارائه شده است.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-3 border-t border-slate-300">
                <h4 className="text-[15px] font-black text-[#0284C7]">
                  ❖ {CONNECTION_TEST_PROTOCOL.kicker} — {CONNECTION_TEST_PROTOCOL.headline}:
                </h4>
                <p className="text-[13.5px] font-bold leading-[1.8] text-slate-800 pr-4">
                  {CONNECTION_TEST_PROTOCOL.subheadline}
                </p>
                <div className="grid grid-cols-3 gap-3 pr-4 pt-1">
                  {CONNECTION_TEST_PROTOCOL.steps.map((st) => (
                    <div
                      key={st.num}
                      className="border border-slate-200 bg-[#F8FAFC] rounded-lg p-3 space-y-1"
                    >
                      <span className="text-[13.5px] font-black text-[#1D4760] block">
                        گام {st.num}: {st.title}
                      </span>
                      <p className="text-[12.5px] font-bold text-slate-700 leading-[1.7]">
                        {st.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[12.5px] font-bold text-slate-600 pr-4">
                  آدرس تست اتصال:{' '}
                  <bdi dir="ltr" className="font-latin underline text-[#0284C7]">
                    {CONNECTION_TEST_PROTOCOL.testUrlFull}
                  </bdi>{' '}
                  — {CONNECTION_TEST_PROTOCOL.footerNote}
                </p>
              </div>
            )}
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 19: CHAPTER 5 — CURRICULUM & CAPSTONE ==================== */}
        <BrochurePageFrame
          pageNum={faPage(19 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel={`فصل پنجم: ${proposal.curriculumTitle}`}
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-3.5 text-[#0F172A]">
            <div className="space-y-1">
              <h3 className="text-[17.5px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[16px]">❑</span>
                <span>
                  فصل پنجم ({proposal.curriculumTitle})
                </span>
              </h3>
              <p className="text-[12.5px] font-bold text-[#0284C7] pr-6">
                ساختار اجرایی دوره: {proposal.sessionsFormat}
              </p>
            </div>

            {proposal.sessionPlan10 ? (
              <div className="space-y-2">
                <table className="w-full text-right border-collapse text-[9.3px] border border-slate-200">
                  <thead>
                    <tr className="bg-[#0B253A] text-white">
                      <th className="py-1.5 px-1.5 font-black w-12 text-center">
                        جلسه
                      </th>
                      <th className="py-1.5 px-1.5 font-black bg-[#0369A1] w-[27%]">
                        استاد ۱ · متدولوژی (۱.۲۵س)
                      </th>
                      <th className="py-1.5 px-1.5 font-black bg-[#1D4760] w-[39%]">
                        استاد ۲ · ابزارها و کار عملی (۱.۲۵س)
                      </th>
                      <th className="py-1.5 px-1.5 font-black w-[24%]">
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
                            ? 'bg-[#F3F9FD] border-b border-slate-200/80'
                            : 'bg-white border-b border-slate-200/80'
                        }
                      >
                        <td className="py-1 px-1.5 font-black text-[#0B253A] text-center whitespace-nowrap align-top">
                          {s.sessionNum}
                          <span className="block text-[8px] font-bold text-[#0284C7] font-mono-num">
                            ۲.۵س
                          </span>
                        </td>
                        <td className="py-1 px-1.5 align-top leading-[1.4] border-x border-slate-200/60">
                          <span className="font-black text-[#0369A1] block text-[8.8px]">
                            {s.methodologyChapter || s.partLabel}
                          </span>
                          <span className="font-bold text-[#0F172A] block">
                            {s.methodologyTopic || s.title}
                          </span>
                        </td>
                        <td className="py-1 px-1.5 align-top leading-[1.4] border-l border-slate-200/60 space-y-1">
                          <span className="font-bold text-[#1D4760] block">
                            {s.toolsTopic || s.title}
                          </span>
                          {s.toolIds && s.toolIds.length > 0 ? (
                            <AiToolBadgeList toolIds={s.toolIds} size="xs" />
                          ) : (
                            <span className="text-[8.5px] font-bold text-slate-600 block">
                              ابزار: {s.tools}
                            </span>
                          )}
                        </td>
                        <td className="py-1 px-1.5 font-bold text-slate-800 align-top leading-[1.4]">
                          {s.deliverable}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {proposal.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="space-y-1 pr-3.5 border-r-3 border-[#1D4760]"
                  >
                    <div className="text-[15px] font-black text-[#1D4760]">
                      {mod.code} ({mod.hours}):
                    </div>
                    <h4 className="text-[16px] font-black text-[#0F172A] pr-3">
                      {mod.title}
                    </h4>
                    <p className="text-[14px] font-bold leading-[1.9] text-justify pr-3 text-slate-800">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5 pt-2.5 border-t border-slate-300">
              <h4 className="text-[14.5px] font-black text-[#0284C7]">
                ❖ خروجی جامع و مطالعه موردی پایانی (
                <bdi dir="ltr" className="font-latin">
                  Executive Capstone
                </bdi>
                ): {proposal.capstone.title}
              </h4>
              <p className="text-[13px] font-bold leading-[1.85] text-justify pr-4 text-[#0F172A]">
                {proposal.capstone.deliverable}
              </p>
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 20: CHAPTER 6 — CLASSROOM PROTOCOL & DAILY SCHEDULE (OMITTED WHEN SEPARATED INTO STANDALONE PROTOCOL FILE) ==================== */}
        {!isProtocolSeparated && (
        <BrochurePageFrame
          pageNum={faPage(20 - coachOffset)}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel="فصل ششم: پروتکل اجرایی سالن آموزشی و زمان‌بندی روزانه"
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-5 text-[#0F172A]">
            <div className="space-y-3">
              <h3 className="text-[18.5px] font-black text-[#0F172A] flex items-center gap-2">
                <span className="font-normal text-[17px]">❑</span>
                <span>فصل ششم (الزامات اجرایی سالن، تجهیزات و زمان‌بندی بوت‌کمپ)</span>
              </h3>

              <ul className="space-y-2.5 text-[14px] font-bold leading-[1.85] pr-2">
                {PROTOCOL_CLAUSES.slice(0, 6).map((clause) => (
                  <li key={clause.id} className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-black shrink-0">
                      {clause.index}.
                    </span>
                    <span className="text-justify">
                      <strong className="font-black text-[#0F172A]">
                        {clause.title}:
                      </strong>{' '}
                      {clause.leadText}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[15.5px] font-black text-[#1D4760]">
                ❖{' '}
                {proposal.protocolScheduleSummary
                  ? `برنامه زمان‌بندی برگزاری جلسات (${proposal.protocolScheduleSummary}):`
                  : 'برنامه زمان‌بندی استاندارد روزانه کارگاه‌های آموزشی:'}
              </h4>
              <table className="w-full text-right border-collapse text-[13.5px]">
                <thead>
                  <tr className="bg-[#1D4760] text-white">
                    <th className="py-2.5 px-4 font-black w-36">ساعت</th>
                    <th className="py-2.5 px-4 font-black">عنوان برنامه</th>
                    <th className="py-2.5 px-4 font-black">شرح اجرایی</th>
                  </tr>
                </thead>
                <tbody>
                  {(proposal.customDailySchedule || DAILY_SCHEDULE).map((slot, idx) => (
                    <tr
                      key={slot.id}
                      className={
                        idx % 2 === 0
                          ? 'bg-[#EEF7FC] border-b border-white'
                          : 'bg-white border-b border-slate-100'
                      }
                    >
                      <td className="py-2.5 px-4 font-black text-[#0284C7] font-mono-num whitespace-nowrap">
                        {slot.timeRange}
                      </td>
                      <td className="py-2.5 px-4 font-black text-[#0F172A]">
                        {slot.title}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-700">
                        {slot.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-300 text-[13.5px] font-bold leading-[1.9] text-justify">
              <strong className="font-black text-[#1D4760]">
                ❖ صیانت از حقوق مالکیت معنوی:
              </strong>{' '}
              {CONFIDENTIALITY_STATEMENT.body} خواهشمند است از هرگونه ضبط صدای مدرسین در طول برگزاری دوره اکیداً خودداری فرمایید.
            </div>
          </div>
        </BrochurePageFrame>
        )}

        {/* ==================== PAGE 21 (OR 20): DURATION, CONDITIONS / DELIVERABLES, CAPACITY, SIGN-OFF & B&W STRIP ==================== */}
        <BrochurePageFrame
          pageNum={closingTermsPageNum}
          proposalTitle={proposal.recipientShortOnCover}
          sectionLabel={
            proposal.hideFinancialFee
              ? 'شرایط اجرایی، بسته ۹ خروجی هیئت‌مدیره و مدارک دوره ۲۵ ساعته'
              : 'شرایط اجرایی، حق‌الزحمه پیشنهادی و مدارک دوره'
          }
          organizationName={documentMeta.organization}
          website={documentMeta.website}
          digitalUrl={digitalUrl}
          noInnerPadding
        >
          <div className="flex-1 min-h-0 flex flex-col justify-start pt-6">
            <div className="px-14 space-y-4 text-[#0F172A]">
              <div className="space-y-1">
                <h3 className="text-[16.5px] font-black text-[#0F172A]">
                  ❖ مدت زمان و الگوی برگزاری کل دوره:
                </h3>
                <p className="text-[14.5px] font-bold pr-7 leading-[1.85]">
                  {proposal.investment.duration}
                </p>
              </div>

              {proposal.hideFinancialFee ? (
                proposal.executiveDeliverables && (
                  <div className="space-y-1.5">
                    <h3 className="text-[16.5px] font-black text-[#0284C7]">
                      ❖ بسته ۹ خروجی ملموس و قابل دفاع در جلسه هیئت‌مدیره:
                    </h3>
                    <div className="grid grid-cols-1 gap-1 pr-6 text-[12.5px] font-bold leading-[1.65] text-slate-800">
                      {proposal.executiveDeliverables.map((d, idx) => (
                        <div key={idx}>{d}</div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-1.5">
                  <h3 className="text-[17.5px] font-black text-[#0F172A]">
                    ❖ حق‌الزحمه پیشنهادی:
                  </h3>
                  <p className="text-[15.5px] font-bold pr-7 leading-[1.95] text-justify">
                    به ازای هر نفر ساعت خدمات آموزشی و مشاوره‌ای ارائه شده مبلغ خالص{' '}
                    <strong className="font-black">
                      {proposal.investment.hourlyRate}
                    </strong>{' '}
                    ({proposal.investment.totalAmountWords}) پیشنهاد می‌گردد.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-[16.5px] font-black text-[#0F172A]">
                  ❖ تعداد نفرات حاضر در دوره:
                </h3>
                <p className="text-[14.5px] font-bold pr-7 leading-[1.85]">
                  {proposal.investment.capacity}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-[16.5px] font-black text-[#0F172A]">
                  ❖ مدارک شرکت در دوره:
                </h3>
                <p className="text-[14.5px] font-bold pr-7 leading-[1.85]">
                  در پایان دوره برای نفرات حاضر در دوره گواهینامه معتبر از طرف شرکت مشاوران مدیریت کسب و کار اوج صادر خواهد گردید.
                </p>
              </div>

              <div className="pt-3 flex justify-end pl-16">
                <div className="text-center space-y-1.5">
                  <p className="text-[15px] font-bold text-[#0F172A]">
                    با تقدیم احترام
                  </p>
                  <p className="text-[19px] font-black text-[#0F172A]">
                    {documentMeta.instructorName}
                  </p>
                  <p className="text-[15px] font-bold text-[#0F172A]">
                    {documentMeta.instructorRole}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mt-auto pt-4 shrink-0">
              <img
                src={EXTRACTED_ASSETS.closingWorkshopStrip}
                alt="گزارش تصویری کارگاه‌های آموزشی شرکت مشاوران مدیریت کسب و کار اوج"
                referrerPolicy="no-referrer"
                className="w-full h-[270px] object-cover object-center block"
              />
            </div>
          </div>
        </BrochurePageFrame>

        {/* ==================== PAGE 22: FULL BACK COVER MAP ==================== */}
        <article className="print-page w-[850px] h-[1202px] m-0 bg-white shadow-xl border border-slate-200 relative overflow-hidden select-none shrink-0">
          <img
            src={EXTRACTED_ASSETS.backCoverMap}
            alt="پشت جلد — اطلاعات تماس و نقشه دفتر مرکزی مشاوران مدیریت کسب و کار اوج"
            referrerPolicy="no-referrer"
            onClick={() =>
              onSelectImage?.(
                EXTRACTED_ASSETS.backCoverMap,
                'پشت جلد — اطلاعات تماس و نقشه موقعیت شرکت مشاوران مدیریت کسب و کار اوج'
              )
            }
            className="w-full h-full object-fill block cursor-pointer"
          />
          <a
            href={`https://${documentMeta.website}`}
            target="_blank"
            rel="noreferrer"
            data-pdf-link={`https://${documentMeta.website}`}
            aria-label="وب‌سایت رسمی مشاوران مدیریت کسب و کار اوج"
            className="absolute inset-x-10 bottom-10 h-64 block"
          />
        </article>
      </div>
    </div>
    </BrochureTotalPagesContext.Provider>
  );
};
