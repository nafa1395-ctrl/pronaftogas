import PptxGenJS from 'pptxgenjs';
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
import { AI_TOOL_META } from '../components/AiToolLogos';
import { isTauriDesktop, saveBinaryFile } from './tauriDesktop';

interface LoadedImageAsset {
  data: string;
  width: number;
  height: number;
}

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const NAVY = '1D4760';
const CYAN = '37A3DC';
const CYAN_DARK = '0284C7';
const INK = '0F172A';
const SLATE = '334155';
const MUTED = '64748B';
const LIGHT_BG = 'F8FAFC';
const ICE_BG = 'EEF7FC';
const BORDER_HEX = 'CBD5E1';
const FONT_FA = 'B Nazanin';
const FONT_EN = 'Calibri';

function toPersianDigits(num: number): string {
  const digits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (d) => digits[Number(d)]);
}

async function fetchImageAsset(
  url: string,
  cache: Map<string, LoadedImageAsset | null>
): Promise<LoadedImageAsset | null> {
  if (!url) return null;
  if (cache.has(url)) {
    return cache.get(url) ?? null;
  }

  try {
    if (url.startsWith('data:')) {
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth || 100, h: img.naturalHeight || 100 });
        img.onerror = () => resolve({ w: 100, h: 100 });
        img.src = url;
      });
      const asset = { data: url, width: dims.w, height: dims.h };
      cache.set(url, asset);
      return asset;
    }

    const res = await fetch(url);
    if (!res.ok) {
      cache.set(url, null);
      return null;
    }
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({ w: img.naturalWidth || 100, h: img.naturalHeight || 100 });
      img.onerror = () => resolve({ w: 100, h: 100 });
      img.src = dataUrl;
    });

    const asset = { data: dataUrl, width: dims.w, height: dims.h };
    cache.set(url, asset);
    return asset;
  } catch {
    cache.set(url, null);
    return null;
  }
}

function addContainedImage(
  slide: PptxGenJS.Slide,
  asset: LoadedImageAsset | null,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  if (!asset) return;
  slide.addImage({
    data: asset.data,
    x,
    y,
    w,
    h,
    sizing: { type: 'contain', w, h },
  });
}

function addCoverImage(
  slide: PptxGenJS.Slide,
  asset: LoadedImageAsset | null,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  if (!asset) return;
  slide.addImage({
    data: asset.data,
    x,
    y,
    w,
    h,
    sizing: { type: 'cover', w, h },
  });
}

export async function exportProposalToPptx(
  proposal: KhatamProposalDocument | null,
  companyResume: typeof COMPANY_RESUME_DATA = COMPANY_RESUME_DATA,
  documentMeta: typeof DOCUMENT_META = DOCUMENT_META,
  digitalUrl: string,
  digitalQrDataUrl: string,
  onProgress?: (msg: string) => void,
  filename?: string
): Promise<void> {
  onProgress?.('در حال آماده‌سازی ساختار پاورپوینت...');

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.rtlMode = true;
  pptx.author = documentMeta.instructorName;
  pptx.company = documentMeta.organization;
  pptx.subject = proposal ? proposal.subject : documentMeta.title;
  pptx.title = proposal
    ? `${proposal.coverMainTitle} — ${proposal.recipientShortOnCover}`
    : documentMeta.title;

  const imgCache = new Map<string, LoadedImageAsset | null>();
  const activeProposal = proposal;

  onProgress?.('در حال بارگذاری لوگوها و تصاویر با کیفیت...');
  const [
    owjLogo,
    ajaLogo,
    instructorImg,
    qrImg,
    digitalQrImg,
    certV7Img,
    certPmiImg,
    fakouriImg,
    aslaniImg,
    clientsImg,
    workshopsGridImg,
    closingStripImg,
    copyrightImg,
    coverImg,
    iranPmaImg,
    ipmaImg,
    axelosImg,
    pmiImg,
    backMapImg,
  ] = await Promise.all([
    fetchImageAsset(EXTRACTED_ASSETS.owjLogoWhite, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.ajaLogoWhite, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.instructorCutout, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.qrCode, imgCache),
    fetchImageAsset(digitalQrDataUrl, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.certCpmaiV7, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.certPmiCpmai, imgCache),
    fetchImageAsset(SENIOR_COACHES_DATA[0].portrait, imgCache),
    fetchImageAsset(SENIOR_COACHES_DATA[1].portrait, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.clientsLogosAndWorkshops, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.ipmaWorkshopsGrid, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.closingWorkshopStrip, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.copyrightShieldClean, imgCache),
    fetchImageAsset(
      activeProposal?.coverImage || EXTRACTED_ASSETS.coverFull,
      imgCache
    ),
    fetchImageAsset(EXTRACTED_ASSETS.iranPmaClean, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.ipmaFullLogo, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.axelosLogo, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.pmiLogo, imgCache),
    fetchImageAsset(EXTRACTED_ASSETS.backCoverMap, imgCache),
  ]);

  const totalSlides = activeProposal ? 20 : 12;

  const addSlideChrome = (
    slide: PptxGenJS.Slide,
    slideIndex: number,
    sectionTitle: string
  ) => {
    slide.background = { color: 'FFFFFF' };

    // Top Navy Header Band
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: 0.72,
      fill: { color: NAVY },
      line: { color: NAVY, width: 0 },
    });
    // Sky-Cyan Stripe
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.72,
      w: SLIDE_W,
      h: 0.08,
      fill: { color: CYAN },
      line: { color: CYAN, width: 0 },
    });

    // Right Logo (OWJ) & Left Logo (AJA) in RTL Widescreen
    addContainedImage(slide, owjLogo, SLIDE_W - 1.95, 0.1, 1.65, 0.52);
    addContainedImage(slide, ajaLogo, 0.35, 0.12, 1.45, 0.48);

    // Centered Header Section Label
    slide.addText(
      `${sectionTitle}  ·  اسلاید ${toPersianDigits(slideIndex)} از ${toPersianDigits(totalSlides)}`,
      {
        x: 2.1,
        y: 0.14,
        w: SLIDE_W - 4.2,
        h: 0.44,
        align: 'center',
        valign: 'middle',
        fontFace: FONT_FA,
        fontSize: 13,
        bold: true,
        color: 'FFFFFF',
        rtlMode: true,
      }
    );

    // Bottom Navy Footer Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: SLIDE_H - 0.42,
      w: SLIDE_W,
      h: 0.42,
      fill: { color: NAVY },
      line: { color: NAVY, width: 0 },
    });
    // Left Sky-Cyan Page Number Badge
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: SLIDE_H - 0.48,
      w: 1.55,
      h: 0.48,
      fill: { color: CYAN },
      line: { color: CYAN, width: 0 },
    });
    slide.addText(toPersianDigits(slideIndex), {
      x: 0,
      y: SLIDE_H - 0.46,
      w: 1.55,
      h: 0.44,
      align: 'center',
      valign: 'middle',
      fontFace: FONT_FA,
      fontSize: 15,
      bold: true,
      color: 'FFFFFF',
      rtlMode: true,
    });

    const footerShort = activeProposal
      ? `${documentMeta.organization}  ·  ${activeProposal.recipientShortOnCover}  ·  ${documentMeta.website}`
      : `${documentMeta.organization}  ·  ${documentMeta.website}`;
    slide.addText(footerShort, {
      x: 1.75,
      y: SLIDE_H - 0.4,
      w: SLIDE_W - 2.1,
      h: 0.36,
      align: 'right',
      valign: 'middle',
      fontFace: FONT_FA,
      fontSize: 10.5,
      bold: true,
      color: 'E2E8F0',
      rtlMode: true,
    });
  };

  const addLogosBar = (slide: PptxGenJS.Slide, yPos: number = 6.32) => {
    slide.addShape(pptx.ShapeType.line, {
      x: 0.55,
      y: yPos - 0.06,
      w: SLIDE_W - 1.1,
      h: 0,
      line: { color: BORDER_HEX, width: 1 },
    });
    addContainedImage(slide, pmiImg, 0.8, yPos, 1.9, 0.58);
    addContainedImage(slide, axelosImg, 3.8, yPos + 0.05, 1.9, 0.48);
    addContainedImage(slide, ipmaImg, 6.8, yPos, 2.2, 0.58);
    addContainedImage(slide, iranPmaImg, 10.1, yPos, 2.2, 0.58);
  };

  let slideIdx = 1;

  // ==================== SLIDE 1: EXECUTIVE COVER ====================
  onProgress?.('در حال ساخت اسلاید جلد و معرفی...');
  {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Left Visual Artwork Panel (5.1" wide)
    addCoverImage(slide, coverImg, 0, 0, 5.2, SLIDE_H);

    // Top-right Navy Accent Strip & OWJ Logo
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.2,
      y: 0,
      w: SLIDE_W - 5.2,
      h: 0.85,
      fill: { color: NAVY },
      line: { color: NAVY, width: 0 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.2,
      y: 0.85,
      w: SLIDE_W - 5.2,
      h: 0.09,
      fill: { color: CYAN },
      line: { color: CYAN, width: 0 },
    });
    addContainedImage(slide, owjLogo, SLIDE_W - 2.2, 0.14, 1.85, 0.58);
    addContainedImage(slide, ajaLogo, 5.45, 0.16, 1.55, 0.52);

    // Right Editorial Cover Typography
    const coverTitle = activeProposal
      ? activeProposal.coverMainTitle
      : documentMeta.title;
    const recipient = activeProposal
      ? activeProposal.recipientShortOnCover
      : documentMeta.clientProject;
    const tierBadge = activeProposal
      ? activeProposal.tierBadge
      : documentMeta.instructorRole;

    slide.addText(coverTitle, {
      x: 5.6,
      y: 1.45,
      w: 7.25,
      h: 0.85,
      align: 'right',
      fontFace: FONT_FA,
      fontSize: 24,
      bold: true,
      color: INK,
      rtlMode: true,
    });

    slide.addText(documentMeta.organization, {
      x: 5.6,
      y: 2.3,
      w: 7.25,
      h: 0.75,
      align: 'right',
      fontFace: FONT_FA,
      fontSize: 28,
      bold: true,
      color: NAVY,
      rtlMode: true,
    });

    slide.addShape(pptx.ShapeType.line, {
      x: 5.6,
      y: 3.15,
      w: 7.25,
      h: 0,
      line: { color: CYAN, width: 2.5 },
    });

    slide.addText(recipient, {
      x: 5.6,
      y: 3.35,
      w: 7.25,
      h: 0.75,
      align: 'right',
      fontFace: FONT_FA,
      fontSize: 21,
      bold: true,
      color: CYAN_DARK,
      rtlMode: true,
    });

    slide.addText(
      activeProposal
        ? `${tierBadge}  |  کد سند: ${activeProposal.letterNumber}`
        : tierBadge,
      {
        x: 5.6,
        y: 4.1,
        w: 7.25,
        h: 0.5,
        align: 'right',
        fontFace: FONT_FA,
        fontSize: 13,
        bold: true,
        color: SLATE,
        rtlMode: true,
      }
    );

    // Digital QR Card on Cover Slide
    if (digitalQrImg) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 5.6,
        y: 4.95,
        w: 4.8,
        h: 1.25,
        fill: { color: LIGHT_BG },
        line: { color: CYAN, width: 1.2 },
        rectRadius: 0.1,
      });
      addContainedImage(slide, digitalQrImg, 5.78, 5.08, 1.0, 1.0);
      slide.addText(
        `نسخه دیجیتال و آنلاین پروپوزال\n${digitalUrl}`,
        {
          x: 6.9,
          y: 5.08,
          w: 3.35,
          h: 1.0,
          align: 'right',
          valign: 'middle',
          fontFace: FONT_FA,
          fontSize: 11.5,
          bold: true,
          color: NAVY,
          rtlMode: true,
          hyperlink: { url: digitalUrl },
        }
      );
    }

    slide.addText(
      `www.${documentMeta.website}   |   ${documentMeta.instructorName}`,
      {
        x: 5.6,
        y: 6.72,
        w: 7.25,
        h: 0.42,
        align: 'right',
        fontFace: FONT_FA,
        fontSize: 12,
        bold: true,
        color: MUTED,
        rtlMode: true,
        hyperlink: { url: `https://${documentMeta.website}` },
      }
    );
    slideIdx++;
  }

  // ==================== SLIDE 2: FORMAL EXECUTIVE LETTER ====================
  if (activeProposal) {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'نامه رسمی معرفی پروپوزال');

    // Top-left Letter Metadata Block
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.65,
      y: 1.05,
      w: 3.4,
      h: 1.15,
      fill: { color: LIGHT_BG },
      line: { color: BORDER_HEX, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(
      `تاریخ: ${activeProposal.letterDate}\nشماره نامه: ${activeProposal.letterNumber}\nپیوست: دارد`,
      {
        x: 0.8,
        y: 1.12,
        w: 3.1,
        h: 1.0,
        align: 'right',
        valign: 'middle',
        fontFace: FONT_FA,
        fontSize: 13.5,
        bold: true,
        color: INK,
        rtlMode: true,
        lineSpacingMultiple: 1.35,
      }
    );

    slide.addText('بسمه تعالی', {
      x: 4.5,
      y: 1.15,
      w: 4.3,
      h: 0.45,
      align: 'center',
      fontFace: FONT_FA,
      fontSize: 18,
      bold: true,
      color: INK,
      rtlMode: true,
    });

    slide.addText(
      [
        {
          text: `به: ${activeProposal.recipientTitle}\n`,
          options: { bold: true, fontSize: 15, color: NAVY },
        },
        {
          text: `از: ${activeProposal.senderTitle}\n`,
          options: { bold: true, fontSize: 14, color: INK },
        },
        {
          text: `موضوع: ${activeProposal.subject}\n\n`,
          options: { bold: true, fontSize: 14, color: CYAN_DARK },
        },
        {
          text: 'با سلام و احترام،\n',
          options: { bold: true, fontSize: 14.5, color: INK },
        },
        {
          text: activeProposal.executiveLead,
          options: { bold: true, fontSize: 14.5, color: SLATE },
        },
      ],
      {
        x: 0.75,
        y: 2.35,
        w: SLIDE_W - 1.5,
        h: 3.25,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        rtlMode: true,
        lineSpacingMultiple: 1.45,
      }
    );

    slide.addText(
      `با تقدیم احترام\n${documentMeta.instructorName}\n${documentMeta.instructorRole}`,
      {
        x: 1.0,
        y: 5.55,
        w: 4.2,
        h: 1.15,
        align: 'center',
        fontFace: FONT_FA,
        fontSize: 14,
        bold: true,
        color: NAVY,
        rtlMode: true,
        lineSpacingMultiple: 1.25,
      }
    );
  }

  // ==================== SLIDE 3: TITLE & COPYRIGHT ====================
  {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'عنوان سند و صیانت از حقوق مالکیت معنوی');

    slide.addText(
      activeProposal ? activeProposal.coverMainTitle : documentMeta.title,
      {
        x: 0.8,
        y: 1.15,
        w: SLIDE_W - 1.6,
        h: 0.7,
        align: 'center',
        fontFace: FONT_FA,
        fontSize: 24,
        bold: true,
        color: INK,
        rtlMode: true,
      }
    );
    slide.addText('(PMI-CPMAI v8)', {
      x: 0.8,
      y: 1.85,
      w: SLIDE_W - 1.6,
      h: 0.5,
      align: 'center',
      fontFace: FONT_EN,
      fontSize: 20,
      bold: true,
      color: NAVY,
    });
    slide.addText(
      activeProposal
        ? `${activeProposal.tierBadge}\n${activeProposal.recipientShortOnCover}`
        : documentMeta.clientProject,
      {
        x: 0.8,
        y: 2.45,
        w: SLIDE_W - 1.6,
        h: 0.9,
        align: 'center',
        fontFace: FONT_FA,
        fontSize: 17,
        bold: true,
        color: CYAN_DARK,
        rtlMode: true,
        lineSpacingMultiple: 1.35,
      }
    );

    addContainedImage(slide, copyrightImg, SLIDE_W / 2 - 0.65, 3.45, 1.3, 1.3);

    slide.addText(companyResume.copyrightStatement, {
      x: 1.1,
      y: 4.9,
      w: SLIDE_W - 2.2,
      h: 1.65,
      align: 'center',
      valign: 'top',
      fontFace: FONT_FA,
      fontSize: 13.5,
      bold: true,
      color: SLATE,
      rtlMode: true,
      lineSpacingMultiple: 1.5,
    });
  }

  // ==================== SLIDE 4: INSTRUCTOR PART 1 ====================
  onProgress?.('در حال ساخت اسلایدهای معرفی مدرس و کوچ‌های ارشد...');
  {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'معرفی مدرس دوره و گواهینامه‌های مدیریت پروژه');

    // Left Portrait Cutout + QR
    addContainedImage(slide, instructorImg, 0.55, 1.0, 2.75, 3.55);
    addContainedImage(slide, qrImg, 1.3, 4.65, 1.25, 1.25);

    // Right Bio & 10 PM Credentials
    slide.addText(
      [
        {
          text: `مدرس دوره: ${documentMeta.instructorName}\n`,
          options: { fontSize: 22, bold: true, color: INK },
        },
        {
          text: `${documentMeta.instructorRole}\n`,
          options: { fontSize: 14, bold: true, color: NAVY },
        },
        {
          text: `▪ ${documentMeta.instructorDistinction}`,
          options: { fontSize: 12.5, bold: true, color: CYAN_DARK },
        },
      ],
      {
        x: 3.55,
        y: 1.0,
        w: 9.25,
        h: 1.55,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        rtlMode: true,
        lineSpacingMultiple: 1.3,
      }
    );

    const pmLines = PM_CREDENTIALS.map((c) => `▪ ${c.titleFa}`).join('\n');
    slide.addText(pmLines, {
      x: 3.55,
      y: 2.6,
      w: 9.25,
      h: 3.55,
      align: 'right',
      valign: 'top',
      fontFace: FONT_FA,
      fontSize: 11.8,
      bold: true,
      color: SLATE,
      rtlMode: true,
      lineSpacingMultiple: 1.25,
    });

    addLogosBar(slide, 6.28);
  }

  // ==================== SLIDE 5: INSTRUCTOR PART 2 (13 AI CREDENTIALS + CERTS) ====================
  {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'گواهینامه‌های ۱۳گانه هوش مصنوعی و تاییدیه‌های رسمی PMI');

    slide.addText(
      `اولین و تنها ایرانی دارنده تمامی گواهینامه‌های هوش مصنوعی Cognilytica آمریکا و PMI (CPMAI v7 & PMI-CPMAI)`,
      {
        x: 0.6,
        y: 0.95,
        w: SLIDE_W - 1.2,
        h: 0.45,
        align: 'center',
        fontFace: FONT_FA,
        fontSize: 13.5,
        bold: true,
        color: NAVY,
        rtlMode: true,
      }
    );

    // Certificates on Left Column
    addContainedImage(slide, certV7Img, 0.55, 1.55, 4.15, 2.55);
    addContainedImage(slide, certPmiImg, 0.55, 4.25, 4.15, 2.55);

    // 13 Credentials on Right Column
    const aiLines = AI_CREDENTIALS_13.map((c) => `▪ ${c.titleFa}`).join('\n');
    slide.addText(aiLines, {
      x: 4.95,
      y: 1.5,
      w: 7.85,
      h: 5.35,
      align: 'right',
      valign: 'top',
      fontFace: FONT_FA,
      fontSize: 11.8,
      bold: true,
      color: INK,
      rtlMode: true,
      lineSpacingMultiple: 1.28,
    });
  }

  // ==================== SLIDE 6: SENIOR COACH 1 (KAZEM FAKOURIZAD) ====================
  const hideFakouri = Boolean(
    activeProposal?.excludedCoachIds?.includes(SENIOR_COACHES_DATA[0].id)
  );
  const hideAslani = Boolean(
    activeProposal?.excludedCoachIds?.includes(SENIOR_COACHES_DATA[1].id)
  );
  if (!hideFakouri) {
    const coach = SENIOR_COACHES_DATA[0];
    const slide = pptx.addSlide();
    addSlideChrome(
      slide,
      slideIdx++,
      `${hideAslani ? 'کوچ ارشد دوره' : 'کوچ‌های ارشد دوره'}: ${coach.name}`
    );

    addContainedImage(slide, fakouriImg, 0.65, 1.0, 2.95, 3.6);

    slide.addText(
      [
        {
          text: `${coach.name}  —  `,
          options: { fontSize: 22, bold: true, color: INK },
        },
        {
          text: `${coach.roleTitle}\n`,
          options: { fontSize: 13.5, bold: true, color: CYAN_DARK },
        },
        {
          text: coach.experiences.map((e) => `• ${e}`).join('\n'),
          options: { fontSize: 11.8, bold: true, color: SLATE },
        },
      ],
      {
        x: 3.75,
        y: 1.0,
        w: 9.05,
        h: 3.55,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        rtlMode: true,
        lineSpacingMultiple: 1.28,
      }
    );

    slide.addShape(pptx.ShapeType.line, {
      x: 0.6,
      y: 4.65,
      w: SLIDE_W - 1.2,
      h: 0,
      line: { color: INK, width: 1.2 },
    });

    const skillsText = coach.skills
      .map((s) => `${s.category}: ${s.items}`)
      .join('\n');
    const certsText = coach.certificates
      ? coach.certificates.join('\n')
      : '';

    slide.addText(
      `مهارت‌ها و ابزارهای تخصصی:\n${skillsText}`,
      {
        x: 6.9,
        y: 4.78,
        w: 5.9,
        h: 1.45,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 11,
        bold: true,
        color: INK,
        rtlMode: true,
        lineSpacingMultiple: 1.25,
      }
    );

    slide.addText(
      `گواهینامه‌ها و دوره‌های تخصصی:\n${certsText}`,
      {
        x: 0.65,
        y: 4.78,
        w: 6.0,
        h: 1.45,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 11,
        bold: true,
        color: SLATE,
        rtlMode: true,
        lineSpacingMultiple: 1.25,
      }
    );

    addLogosBar(slide, 6.28);
  }

  // ==================== SLIDE 7: SENIOR COACH 2 (AMIR ASLANI) ====================
  if (!hideAslani) {
    const coach = SENIOR_COACHES_DATA[1];
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, `کوچ‌های ارشد دوره: ${coach.name}`);

    addContainedImage(slide, aslaniImg, 0.65, 1.0, 2.95, 3.6);

    slide.addText(
      [
        {
          text: `${coach.name}  —  `,
          options: { fontSize: 22, bold: true, color: INK },
        },
        {
          text: `${coach.roleTitle}\n`,
          options: { fontSize: 13.5, bold: true, color: CYAN_DARK },
        },
        {
          text: coach.experiences.map((e) => `• ${e}`).join('\n'),
          options: { fontSize: 12.2, bold: true, color: SLATE },
        },
      ],
      {
        x: 3.75,
        y: 1.0,
        w: 9.05,
        h: 3.55,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        rtlMode: true,
        lineSpacingMultiple: 1.32,
      }
    );

    slide.addShape(pptx.ShapeType.line, {
      x: 0.6,
      y: 4.65,
      w: SLIDE_W - 1.2,
      h: 0,
      line: { color: INK, width: 1.2 },
    });

    const skillsText = coach.skills
      .map((s) => `${s.category}: ${s.items}`)
      .join('\n');

    slide.addText(
      `${coach.skillsTitle}\n${skillsText}`,
      {
        x: 0.75,
        y: 4.82,
        w: SLIDE_W - 1.5,
        h: 1.4,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 12,
        bold: true,
        color: INK,
        rtlMode: true,
        lineSpacingMultiple: 1.35,
      }
    );

    addLogosBar(slide, 6.28);
  }

  // ==================== SLIDE 8: ABOUT OWJ & CLIENT LOGOS ====================
  {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'درباره شرکت مشاوران مدیریت کسب و کار اوج و کارنامه مشتریان');

    slide.addText(
      `▪ ${companyResume.executiveIntro}\n\n▪ ${companyResume.clientsSummary}`,
      {
        x: 7.45,
        y: 1.0,
        w: 5.35,
        h: 5.85,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 12.5,
        bold: true,
        color: INK,
        rtlMode: true,
        lineSpacingMultiple: 1.38,
      }
    );

    addContainedImage(slide, clientsImg, 0.45, 0.95, 6.8, 5.95);
  }

  // ==================== SLIDE 9: IPMA NATIONAL PRIDE & WORKSHOPS GRID ====================
  {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'کارنامه ملی گواهینامه‌های IPMA و کارگاه‌های جامع');

    slide.addText(`❖ ${companyResume.ipmaPrideStatement}`, {
      x: 0.75,
      y: 0.96,
      w: SLIDE_W - 1.5,
      h: 0.7,
      align: 'center',
      fontFace: FONT_FA,
      fontSize: 14,
      bold: true,
      color: NAVY,
      rtlMode: true,
    });

    addContainedImage(slide, workshopsGridImg, 1.3, 1.72, SLIDE_W - 2.6, 5.15);
  }

  // ==================== PROPOSAL-SPECIFIC SLIDES (10 TO 19) ====================
  if (activeProposal) {
    onProgress?.('در حال تبدیل سرفصل‌ها، الگوها و جدول شاخص‌ها به اسلاید...');

    // SLIDE 10: CHAPTER 1 PART 1
    {
      const slide = pptx.addSlide();
      addSlideChrome(slide, slideIdx++, 'فصل اول: شناخت راهبردی هلدینگ و محورهای تمرکز');

      slide.addText(
        [
          {
            text: `❑ ${activeProposal.strategicContextTitle}\n`,
            options: { fontSize: 15, bold: true, color: NAVY },
          },
          {
            text: activeProposal.strategicContextLead,
            options: { fontSize: 12.5, bold: true, color: INK },
          },
        ],
        {
          x: 0.65,
          y: 0.95,
          w: SLIDE_W - 1.3,
          h: 1.65,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          rtlMode: true,
          lineSpacingMultiple: 1.35,
        }
      );

      // Right Column: 6 Strategic Domains
      const domainLines = activeProposal.keyEntitiesAndSites
        .map((d) => `• ${d}`)
        .join('\n');
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 6.85,
        y: 2.7,
        w: 5.9,
        h: 4.1,
        fill: { color: LIGHT_BG },
        line: { color: BORDER_HEX, width: 1 },
        rectRadius: 0.08,
      });
      slide.addText(
        `محورهای تخصصی و حوزه‌های راهبردی مورد تمرکز:\n\n${domainLines}`,
        {
          x: 7.05,
          y: 2.85,
          w: 5.5,
          h: 3.8,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          fontSize: 12.2,
          bold: true,
          color: INK,
          rtlMode: true,
          lineSpacingMultiple: 1.38,
        }
      );

      // Left Column: Cascade Governance (Proposal 1) OR 4 Key Advantages
      const extraTitle = activeProposal.cascadeGovernance
        ? 'معماری آبشاری ۳ سطحی استقرار PMI-CPMAI v8:'
        : '۴ مزیت اختصاصی استقرار آموزشی استاندارد PMI-CPMAI v8:';
      const extraLines = activeProposal.cascadeGovernance
        ? activeProposal.cascadeGovernance.tiers
            .map((t) => `▪ ${t.level} (${t.duration}): ${t.outcome}`)
            .join('\n\n')
        : companyResume.whyOwjForCpmai
            .map((w) => `▪ ${w.title}: ${w.description}`)
            .join('\n');

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6,
        y: 2.7,
        w: 6.0,
        h: 4.1,
        fill: { color: ICE_BG },
        line: { color: CYAN, width: 1 },
        rectRadius: 0.08,
      });
      slide.addText(`${extraTitle}\n\n${extraLines}`, {
        x: 0.8,
        y: 2.85,
        w: 5.6,
        h: 3.8,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 11.2,
        bold: true,
        color: NAVY,
        rtlMode: true,
        lineSpacingMultiple: 1.3,
      });
    }

    // SLIDE 11: CHAPTER 1 PART 2 — STRATEGIC CHALLENGES
    {
      const slide = pptx.addSlide();
      addSlideChrome(slide, slideIdx++, 'فصل اول (ادامه): چالش‌های کلیدی راهبردی هلدینگ');

      const chCols = activeProposal.challenges.slice(0, 4);
      chCols.forEach((ch, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardW = 5.9;
        const cardH = 2.3;
        const x = col === 0 ? 6.8 : 0.65;
        const y = 1.0 + row * 2.48;

        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w: cardW,
          h: cardH,
          fill: { color: LIGHT_BG },
          line: { color: CYAN, width: 1.2 },
          rectRadius: 0.08,
        });

        slide.addText(
          [
            {
              text: `${ch.num}. ${ch.title}\n`,
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: ch.description,
              options: { fontSize: 12, bold: true, color: SLATE },
            },
          ],
          {
            x: x + 0.2,
            y: y + 0.16,
            w: cardW - 0.4,
            h: cardH - 0.3,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.32,
          }
        );
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.65,
        y: 6.05,
        w: SLIDE_W - 1.3,
        h: 0.78,
        fill: { color: ICE_BG },
        line: { color: NAVY, width: 1 },
        rectRadius: 0.06,
      });
      slide.addText(
        '❖ نتیجه‌گیری راهبردی: عبور از این چالش‌ها در گام نخست نیازمند آموزش، فرهنگ‌سازی و ایجاد زبان مشترک PMI-CPMAI v8 در میان مدیران و کارشناسان کلیدی است.',
        {
          x: 0.85,
          y: 6.12,
          w: SLIDE_W - 1.7,
          h: 0.65,
          align: 'right',
          valign: 'middle',
          fontFace: FONT_FA,
          fontSize: 12.5,
          bold: true,
          color: NAVY,
          rtlMode: true,
        }
      );
    }

    // SLIDE 12: CHAPTER 2 — ALL 7 AI PATTERNS
    {
      const slide = pptx.addSlide();
      addSlideChrome(slide, slideIdx++, 'فصل دوم: نگاشت الگوهای هفت‌گانه هوش مصنوعی (PMI-CPMAI Seven Patterns)');

      activeProposal.aiPatterns.forEach((pat, idx) => {
        const isLastSingle = idx === 6;
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const w = isLastSingle ? SLIDE_W - 1.2 : 5.95;
        const h = isLastSingle ? 1.28 : 1.36;
        const x = isLastSingle ? 0.6 : col === 0 ? 6.78 : 0.6;
        const y = 0.96 + row * 1.48;

        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w,
          h,
          fill: { color: idx % 2 === 0 ? LIGHT_BG : ICE_BG },
          line: { color: BORDER_HEX, width: 0.9 },
          rectRadius: 0.06,
        });

        slide.addText(
          [
            {
              text: `${pat.num}: ${pat.titleFa}  `,
              options: { fontSize: 13, bold: true, color: NAVY },
            },
            {
              text: `(${pat.titleEn})\n`,
              options: { fontSize: 10.5, bold: true, color: CYAN_DARK },
            },
            {
              text: pat.description,
              options: { fontSize: 11, bold: true, color: SLATE },
            },
          ],
          {
            x: x + 0.16,
            y: y + 0.08,
            w: w - 0.32,
            h: h - 0.16,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.22,
          }
        );
      });
    }

    // SLIDE 13: CHAPTER 2 PART 2 — KPI TABLE & ROI / GO-NO-GO
    {
      const slide = pptx.addSlide();
      addSlideChrome(slide, slideIdx++, 'شاخص‌های کلیدی عملکرد (KPI)، بازگشت سرمایه (ROI) و امکان‌سنجی');

      const tableRows: PptxGenJS.TableRow[] = [
        [
          {
            text: 'واحد سنجش',
            options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
          },
          {
            text: 'هدف‌گذاری (Target)',
            options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
          },
          {
            text: 'وضعیت فعلی (Baseline)',
            options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
          },
          {
            text: 'شاخص کلیدی عملکرد (KPI)',
            options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
          },
        ],
        ...activeProposal.kpis.map((k, idx): PptxGenJS.TableRow => [
          {
            text: k.unit,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: MUTED,
            },
          },
          {
            text: k.target,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: CYAN_DARK,
              bold: true,
            },
          },
          {
            text: k.baseline,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: SLATE,
            },
          },
          {
            text: k.kpi,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: INK,
              bold: true,
            },
          },
        ]),
      ];

      slide.addTable(tableRows, {
        x: 0.65,
        y: 0.98,
        w: SLIDE_W - 1.3,
        colW: [2.4, 2.35, 2.35, 4.93],
        rowH: 0.44,
        align: 'center',
        valign: 'middle',
        fontFace: FONT_FA,
        fontSize: 11.5,
        border: { pt: 0.75, color: BORDER_HEX },
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.65,
        y: 3.92,
        w: SLIDE_W - 1.3,
        h: 2.9,
        fill: { color: LIGHT_BG },
        line: { color: CYAN, width: 1 },
        rectRadius: 0.08,
      });

      slide.addText(
        [
          {
            text: `❖ مقایسه رویکرد شناختی (CPMAI) در برابر روش‌های سنتی: `,
            options: { fontSize: 12.5, bold: true, color: NAVY },
          },
          {
            text: `${activeProposal.roiAnalysis.heuristicComparison}\n\n`,
            options: { fontSize: 11.8, bold: true, color: SLATE },
          },
          {
            text: `❖ برآورد منافع سالانه: `,
            options: { fontSize: 12.5, bold: true, color: NAVY },
          },
          {
            text: `${activeProposal.roiAnalysis.annualSavings}\n`,
            options: { fontSize: 11.8, bold: true, color: INK },
          },
          {
            text: `❖ منافع استراتژیک و فرهنگی: `,
            options: { fontSize: 12.5, bold: true, color: NAVY },
          },
          {
            text: `${activeProposal.roiAnalysis.intangibleBenefits}\n`,
            options: { fontSize: 11.8, bold: true, color: SLATE },
          },
          {
            text: `❖ جمع‌بندی ممیزی ۹گانه امکان‌سنجی (AI Go / No-Go): `,
            options: { fontSize: 12.5, bold: true, color: CYAN_DARK },
          },
          {
            text: activeProposal.roiAnalysis.goNoGoSummary,
            options: { fontSize: 11.8, bold: true, color: INK },
          },
        ],
        {
          x: 0.85,
          y: 4.05,
          w: SLIDE_W - 1.7,
          h: 2.65,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          rtlMode: true,
          lineSpacingMultiple: 1.26,
        }
      );
    }

    // Helper for 2-phase side-by-side slide
    const addTwoPhasesSlide = (
      titleSuffix: string,
      pair: typeof activeProposal.cpmaiPhases
    ) => {
      const slide = pptx.addSlide();
      addSlideChrome(slide, slideIdx++, titleSuffix);

      pair.forEach((ph, i) => {
        const x = i === 0 ? 6.8 : 0.65;
        const w = 5.9;
        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y: 1.0,
          w,
          h: 5.82,
          fill: { color: LIGHT_BG },
          line: { color: i === 0 ? NAVY : CYAN, width: 1.3 },
          rectRadius: 0.08,
        });

        slide.addText(
          [
            {
              text: `${ph.phaseNum}: ${ph.titleFa}\n`,
              options: { fontSize: 16, bold: true, color: NAVY },
            },
            {
              text: `${ph.titleEn}\n\n`,
              options: { fontSize: 11.5, bold: true, color: CYAN_DARK },
            },
            {
              text: `هدف فاز: ${ph.summary}\n\n`,
              options: { fontSize: 12.5, bold: true, color: INK },
            },
            {
              text: ph.bullets.map((b) => `• ${b}`).join('\n') + '\n\n',
              options: { fontSize: 12, bold: true, color: SLATE },
            },
            {
              text: `▪ خروجی تمرینی فاز: ${ph.deliverable}`,
              options: { fontSize: 12, bold: true, color: CYAN_DARK },
            },
          ],
          {
            x: x + 0.22,
            y: 1.18,
            w: w - 0.44,
            h: 5.45,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.32,
          }
        );
      });
    };

    // SLIDE 14: PHASES I & II
    addTwoPhasesSlide(
      'فصل سوم: کاربرگ آموزشی متدولوژی PMI-CPMAI v8 (Phases I & II)',
      activeProposal.cpmaiPhases.slice(0, 2)
    );

    // SLIDE 15: PHASES III & IV
    addTwoPhasesSlide(
      'فصل سوم (ادامه): کاربرگ آموزشی متدولوژی (Phases III & IV)',
      activeProposal.cpmaiPhases.slice(2, 4)
    );

    // SLIDE 16: PHASES V & VI + CHECKLIST
    {
      const slide = pptx.addSlide();
      addSlideChrome(
        slide,
        slideIdx++,
        'فصل سوم (بخش پایانی): Phases V & VI و چک‌لیست ارزیابی دستاوردها'
      );

      activeProposal.cpmaiPhases.slice(4, 6).forEach((ph, i) => {
        const x = i === 0 ? 6.8 : 0.65;
        const w = 5.9;
        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y: 0.98,
          w,
          h: 4.1,
          fill: { color: LIGHT_BG },
          line: { color: i === 0 ? NAVY : CYAN, width: 1.2 },
          rectRadius: 0.08,
        });
        slide.addText(
          [
            {
              text: `${ph.phaseNum}: ${ph.titleFa} (${ph.titleEn})\n`,
              options: { fontSize: 14.5, bold: true, color: NAVY },
            },
            {
              text: `هدف: ${ph.summary}\n`,
              options: { fontSize: 11.8, bold: true, color: INK },
            },
            {
              text: ph.bullets.map((b) => `• ${b}`).join('\n') + '\n',
              options: { fontSize: 11.2, bold: true, color: SLATE },
            },
            {
              text: `▪ خروجی: ${ph.deliverable}`,
              options: { fontSize: 11.2, bold: true, color: CYAN_DARK },
            },
          ],
          {
            x: x + 0.2,
            y: 1.1,
            w: w - 0.4,
            h: 3.88,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.25,
          }
        );
      });

      const checklistLines = activeProposal.signOffChecklist
        .map((c) => `✓ ${c}`)
        .join('\n');
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.65,
        y: 5.2,
        w: SLIDE_W - 1.3,
        h: 1.65,
        fill: { color: ICE_BG },
        line: { color: NAVY, width: 1 },
        rectRadius: 0.08,
      });
      slide.addText(
        `❖ چک‌لیست ارزیابی دستاوردهای آموزشی (CPMAI Readiness Checklist):\n${checklistLines}`,
        {
          x: 0.85,
          y: 5.28,
          w: SLIDE_W - 1.7,
          h: 1.5,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          fontSize: 11,
          bold: true,
          color: NAVY,
          rtlMode: true,
          lineSpacingMultiple: 1.2,
        }
      );
    }

    // SLIDE 17: CHAPTER 4 — ORGANIZATIONAL CULTURE, TOOLS & CONNECTION TEST
    {
      const slide = pptx.addSlide();
      addSlideChrome(
        slide,
        slideIdx++,
        'فصل چهارم: فرهنگ‌سازی سازمانی، ابزارهای آموزشی و آمادگی پیش از کارگاه'
      );

      slide.addText(
        `❖ هدف و رویکرد کارگاه:\n${activeProposal.airGappedNote}`,
        {
          x: 0.65,
          y: 0.98,
          w: SLIDE_W - 1.3,
          h: 1.65,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          fontSize: 12.8,
          bold: true,
          color: INK,
          rtlMode: true,
          lineSpacingMultiple: 1.35,
        }
      );

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 6.75,
        y: 2.75,
        w: 5.95,
        h: 4.05,
        fill: { color: LIGHT_BG },
        line: { color: NAVY, width: 1 },
        rectRadius: 0.08,
      });
      slide.addText(
        `زیست‌بوم ابزارهای آموزشی کارگاه (داده‌های نمونه آموزشی):\n\n${activeProposal.airGappedTools
          .map((t) => `• ${t}`)
          .join('\n')}`,
        {
          x: 6.95,
          y: 2.9,
          w: 5.55,
          h: 3.75,
          align: 'right',
          valign: 'top',
          fontFace: FONT_FA,
          fontSize: 12,
          bold: true,
          color: INK,
          rtlMode: true,
          lineSpacingMultiple: 1.38,
        }
      );

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.65,
        y: 2.75,
        w: 5.85,
        h: 4.05,
        fill: { color: activeProposal.separateProtocolDocument ? 'ECFDF5' : ICE_BG },
        line: { color: activeProposal.separateProtocolDocument ? '10B981' : CYAN, width: 1 },
        rectRadius: 0.08,
      });
      if (activeProposal.separateProtocolDocument) {
        slide.addText(
          [
            {
              text: '❖ اصل محرمانگی و استفاده انحصاری از داده‌های فرضی (Synthetic / Mock Data)\n',
              options: { fontSize: 13.5, bold: true, color: '065F46' },
            },
            {
              text: 'با توجه به حساسیت اطلاعات هلدینگ و مؤسسات تابعه، کلیه تمرینات پرامپت‌نویسی، ممیزی‌های قراردادی در NotebookLM، ساخت دستیاران مقیم و داشبوردهای زنده صرفاً بر روی داده‌ها و اسناد فرضی و شبیه‌سازی‌شده آموزشی اجرا می‌گردد و هیچ‌گونه سند یا داده واقعی سازمانی در ابزارهای ابری بارگذاری نخواهد شد.\n\n',
              options: { fontSize: 12, bold: true, color: INK },
            },
            {
              text: '• توجه: پروتکل شروع دوره (تست اتصال)، الزامات فنی سالن و زمان‌بندی تفصیلی جلسات در فایل مستقل «پروتکل» به‌صورت مجزا ارائه شده است.',
              options: { fontSize: 11.4, bold: true, color: NAVY },
            },
          ],
          {
            x: 0.85,
            y: 2.9,
            w: 5.45,
            h: 3.75,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.35,
          }
        );
      } else {
        const connSteps = CONNECTION_TEST_PROTOCOL.steps
          .map((s) => `گام ${s.num} (${s.title}): ${s.description}`)
          .join('\n');
        slide.addText(
          [
            {
              text: `❖ ${CONNECTION_TEST_PROTOCOL.kicker} — ${CONNECTION_TEST_PROTOCOL.headline}\n`,
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: `${CONNECTION_TEST_PROTOCOL.subheadline}\n\n`,
              options: { fontSize: 11.8, bold: true, color: SLATE },
            },
            {
              text: `${connSteps}\n\n`,
              options: { fontSize: 12, bold: true, color: INK },
            },
            {
              text: `آدرس تست: ${CONNECTION_TEST_PROTOCOL.testUrlFull}\n${CONNECTION_TEST_PROTOCOL.footerNote}`,
              options: { fontSize: 11.2, bold: true, color: CYAN_DARK },
            },
          ],
          {
            x: 0.85,
            y: 2.9,
            w: 5.45,
            h: 3.75,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.32,
          }
        );
      }
    }

    // SLIDE 18: CHAPTER 5 — CURRICULUM & CAPSTONE (OR 2-SLIDE 10-SESSION SPLIT TABLE)
    onProgress?.(
      activeProposal.hideFinancialFee
        ? 'در حال ساخت اسلایدهای جدول ۱۰ جلسه (متدولوژی و ابزارها) و بسته خروجی‌ها...'
        : 'در حال ساخت اسلایدهای سرفصل دوره و پیشنهاد مالی...'
    );
    if (activeProposal.sessionPlan10 && activeProposal.sessionPlan10.length > 0) {
      const halves = [
        {
          label: 'جلسات ۱ تا ۵ (نیمه اول دوره)',
          items: activeProposal.sessionPlan10.slice(0, 5),
        },
        {
          label: 'جلسات ۶ تا ۱۰ (نیمه دوم دوره و جمع‌بندی)',
          items: activeProposal.sessionPlan10.slice(5, 10),
        },
      ];

      halves.forEach((half) => {
        const slide = pptx.addSlide();
        addSlideChrome(
          slide,
          slideIdx++,
          `خلاصه سرفصل‌ها: تفکیک استاد متدولوژی (۱.۲۵س) و استاد ابزارها (۱.۲۵س) — ${half.label}`
        );

        // Dual-instructor 50/50 split header bar
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 6.75,
          y: 0.92,
          w: 5.93,
          h: 0.48,
          fill: { color: 'F0F9FF' },
          line: { color: CYAN_DARK, width: 1 },
          rectRadius: 0.06,
        });
        slide.addText(
          'استاد ۱ · بخش متدولوژی: ۱.۲۵ ساعت در هر جلسه (۰۷:۰۰–۰۸:۱۵ · ۱۲.۵ ساعت کل)',
          {
            x: 6.85,
            y: 0.95,
            w: 5.73,
            h: 0.42,
            align: 'right',
            valign: 'middle',
            fontFace: FONT_FA,
            fontSize: 11,
            bold: true,
            color: '0369A1',
            rtlMode: true,
          }
        );

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.65,
          y: 0.92,
          w: 5.93,
          h: 0.48,
          fill: { color: 'F1F5F9' },
          line: { color: NAVY, width: 1 },
          rectRadius: 0.06,
        });
        slide.addText(
          'استاد ۲ · بخش ابزارها و کار عملی: ۱.۲۵ ساعت در هر جلسه (۰۸:۱۵–۰۹:۳۰ · ۱۲.۵ ساعت کل)',
          {
            x: 0.75,
            y: 0.95,
            w: 5.73,
            h: 0.42,
            align: 'right',
            valign: 'middle',
            fontFace: FONT_FA,
            fontSize: 11,
            bold: true,
            color: NAVY,
            rtlMode: true,
          }
        );

        const tableRows: PptxGenJS.TableRow[] = [
          [
            {
              text: 'خروجی هیئت‌مدیره',
              options: { fill: { color: '0B253A' }, color: 'FFFFFF', bold: true },
            },
            {
              text: 'ابزارهای جلسه',
              options: { fill: { color: '0B253A' }, color: 'FDE047', bold: true },
            },
            {
              text: 'استاد ۲ · ابزارها و کار عملی (۱.۲۵س)',
              options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
            },
            {
              text: 'استاد ۱ · متدولوژی (۱.۲۵س)',
              options: { fill: { color: '0369A1' }, color: 'FFFFFF', bold: true },
            },
            {
              text: 'جلسه (۲.۵س)',
              options: { fill: { color: '0B253A' }, color: 'FFFFFF', bold: true },
            },
          ],
          ...half.items.map((s, idx): PptxGenJS.TableRow => {
            const bg = idx % 2 === 0 ? 'FFFFFF' : ICE_BG;
            const toolRuns =
              s.toolIds && s.toolIds.length > 0
                ? s.toolIds.map((tid, ti) => {
                    const meta = AI_TOOL_META[tid];
                    const cleanHex = meta.hex.replace('#', '');
                    return {
                      text: `${ti > 0 ? '\n' : ''}● ${meta.label}`,
                      options: {
                        fontFace: FONT_EN,
                        fontSize: 9.5,
                        bold: true,
                        color: cleanHex,
                      },
                    };
                  })
                : [
                    {
                      text: s.tools,
                      options: {
                        fontFace: FONT_EN,
                        fontSize: 9.5,
                        bold: true,
                        color: NAVY,
                      },
                    },
                  ];

            return [
              {
                text: s.deliverable,
                options: { fill: { color: bg }, color: INK, bold: true },
              },
              {
                text: toolRuns,
                options: {
                  fill: { color: bg },
                  align: 'left',
                  valign: 'middle',
                },
              },
              {
                text: s.toolsTopic || s.title,
                options: { fill: { color: bg }, color: NAVY, bold: true },
              },
              {
                text: `${s.methodologyChapter || s.partLabel}\n${s.methodologyTopic || s.title}`,
                options: { fill: { color: bg }, color: INK, bold: true },
              },
              {
                text: `${s.sessionNum}\n۲.۵ ساعت`,
                options: {
                  fill: { color: bg },
                  color: '0369A1',
                  bold: true,
                  align: 'center',
                },
              },
            ];
          }),
        ];

        slide.addTable(tableRows, {
          x: 0.65,
          y: 1.5,
          w: SLIDE_W - 1.3,
          colW: [2.25, 1.8, 3.45, 3.43, 1.1],
          fontFace: FONT_FA,
          fontSize: 10.2,
          align: 'right',
          valign: 'middle',
          border: { pt: 0.6, color: BORDER_HEX },
          margin: [0.06, 0.08, 0.06, 0.08],
        });
      });
    } else {
      const slide = pptx.addSlide();
      addSlideChrome(
        slide,
        slideIdx++,
        `فصل پنجم: ${activeProposal.curriculumTitle} (${activeProposal.totalHours})`
      );

      activeProposal.modules.forEach((mod, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardW = 5.9;
        const cardH = 2.05;
        const x = col === 0 ? 6.8 : 0.65;
        const y = 1.0 + row * 2.2;

        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w: cardW,
          h: cardH,
          fill: { color: LIGHT_BG },
          line: { color: NAVY, width: 1.1 },
          rectRadius: 0.08,
        });

        slide.addText(
          [
            {
              text: `${mod.code} (${mod.hours}) — `,
              options: { fontSize: 13.5, bold: true, color: CYAN_DARK },
            },
            {
              text: `${mod.title}\n`,
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: mod.description,
              options: { fontSize: 12, bold: true, color: SLATE },
            },
          ],
          {
            x: x + 0.2,
            y: y + 0.14,
            w: cardW - 0.4,
            h: cardH - 0.28,
            align: 'right',
            valign: 'top',
            fontFace: FONT_FA,
            rtlMode: true,
            lineSpacingMultiple: 1.32,
          }
        );
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.65,
        y: 5.45,
        w: SLIDE_W - 1.3,
        h: 1.35,
        fill: { color: ICE_BG },
        line: { color: CYAN, width: 1.2 },
        rectRadius: 0.08,
      });
      slide.addText(
        `❖ مطالعه موردی پایانی (Educational Case Study): ${activeProposal.capstone.title}\n${activeProposal.capstone.deliverable}`,
        {
          x: 0.85,
          y: 5.55,
          w: SLIDE_W - 1.7,
          h: 1.15,
          align: 'right',
          valign: 'middle',
          fontFace: FONT_FA,
          fontSize: 12.2,
          bold: true,
          color: NAVY,
          rtlMode: true,
          lineSpacingMultiple: 1.32,
        }
      );
    }
  }

  // ==================== SLIDE 19 (OR 11): CLASSROOM PROTOCOL & SCHEDULE TABLE (OMITTED WHEN SEPARATED INTO STANDALONE PROTOCOL FILE) ====================
  if (!activeProposal?.separateProtocolDocument) {
    const slide = pptx.addSlide();
    addSlideChrome(slide, slideIdx++, 'پروتکل اجرایی سالن آموزشی و زمان‌بندی استاندارد کارگاه‌ها');

    const clauseLines = PROTOCOL_CLAUSES.slice(0, 6)
      .map((c) => `${c.index}. ${c.title}: ${c.leadText}`)
      .join('\n');

    slide.addText(
      `الزامات کلیدی سالن و تجهیزات:\n${clauseLines}`,
      {
        x: 0.65,
        y: 0.96,
        w: SLIDE_W - 1.3,
        h: 2.55,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        fontSize: 11.8,
        bold: true,
        color: INK,
        rtlMode: true,
        lineSpacingMultiple: 1.3,
      }
    );

    const scheduleRows: PptxGenJS.TableRow[] = [
      [
        {
          text: 'شرح اجرایی',
          options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
        },
        {
          text: 'عنوان برنامه',
          options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
        },
        {
          text: 'ساعت',
          options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true },
        },
      ],
      ...(activeProposal?.customDailySchedule || DAILY_SCHEDULE).map(
        (slot, idx): PptxGenJS.TableRow => [
          {
            text: slot.description,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: SLATE,
            },
          },
          {
            text: slot.title,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: INK,
              bold: true,
            },
          },
          {
            text: slot.timeRange,
            options: {
              fill: { color: idx % 2 === 0 ? ICE_BG : 'FFFFFF' },
              color: CYAN_DARK,
              bold: true,
            },
          },
        ]
      ),
    ];

    slide.addTable(scheduleRows, {
      x: 0.65,
      y: 3.65,
      w: SLIDE_W - 1.3,
      colW: [6.4, 3.3, 2.33],
      rowH: 0.42,
      align: 'center',
      valign: 'middle',
      fontFace: FONT_FA,
      fontSize: 11.5,
      border: { pt: 0.75, color: BORDER_HEX },
    });

    slide.addText(
      `❖ صیانت از حقوق مالکیت معنوی: ${CONFIDENTIALITY_STATEMENT.body}`,
      {
        x: 0.65,
        y: 6.32,
        w: SLIDE_W - 1.3,
        h: 0.55,
        align: 'right',
        valign: 'middle',
        fontFace: FONT_FA,
        fontSize: 11,
        bold: true,
        color: NAVY,
        rtlMode: true,
      }
    );
  }

  // ==================== SLIDE 20 (OR 12): CONDITIONS / FINANCIAL OFFER, SIGN-OFF & CONTACT ====================
  {
    const slide = pptx.addSlide();
    addSlideChrome(
      slide,
      slideIdx++,
      activeProposal?.hideFinancialFee
        ? 'شرایط اجرایی، بسته ۹ خروجی هیئت‌مدیره و اطلاعات تماس'
        : 'شرایط اجرایی، حق‌الزحمه پیشنهادی و اطلاعات تماس'
    );

    if (activeProposal) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 5.5,
        y: 1.0,
        w: 7.25,
        h: 4.15,
        fill: { color: LIGHT_BG },
        line: { color: NAVY, width: 1.2 },
        rectRadius: 0.08,
      });

      const closingRuns = activeProposal.hideFinancialFee
        ? [
            {
              text: '❖ مدت زمان و ساختار برگزاری کل دوره:\n',
              options: { fontSize: 13.5, bold: true, color: NAVY },
            },
            {
              text: `${activeProposal.investment.duration}\n\n`,
              options: { fontSize: 12, bold: true, color: INK },
            },
            {
              text: '❖ بسته ۹ خروجی ملموس هیئت‌مدیره:\n',
              options: { fontSize: 13.5, bold: true, color: CYAN_DARK },
            },
            {
              text: `${(activeProposal.executiveDeliverables || []).slice(0, 5).join(' | ')}\n\n`,
              options: { fontSize: 11, bold: true, color: SLATE },
            },
            {
              text: '❖ تعداد نفرات و مدارک پایانی:\n',
              options: { fontSize: 13.5, bold: true, color: NAVY },
            },
            {
              text: `${activeProposal.investment.capacity} — در پایان دوره برای شرکت‌کنندگان گواهینامه معتبر از طرف شرکت مشاوران مدیریت کسب و کار اوج صادر خواهد گردید.`,
              options: { fontSize: 12, bold: true, color: SLATE },
            },
          ]
        : [
            {
              text: '❖ مدت زمان کل دوره:\n',
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: `${activeProposal.investment.duration}\n\n`,
              options: { fontSize: 13, bold: true, color: INK },
            },
            {
              text: '❖ حق‌الزحمه پیشنهادی:\n',
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: `به ازای هر نفر ساعت خدمات آموزشی و مشاوره‌ای مبلغ خالص ${activeProposal.investment.hourlyRate} (${activeProposal.investment.totalAmountWords}) پیشنهاد می‌گردد.\n\n`,
              options: { fontSize: 13, bold: true, color: CYAN_DARK },
            },
            {
              text: '❖ تعداد نفرات و مدارک پایانی:\n',
              options: { fontSize: 14, bold: true, color: NAVY },
            },
            {
              text: `${activeProposal.investment.capacity} — در پایان دوره برای شرکت‌کنندگان گواهینامه معتبر از طرف شرکت مشاوران مدیریت کسب و کار اوج صادر خواهد گردید.`,
              options: { fontSize: 12.5, bold: true, color: SLATE },
            },
          ];

      slide.addText(closingRuns, {
        x: 5.75,
        y: 1.15,
        w: 6.75,
        h: 3.85,
        align: 'right',
        valign: 'top',
        fontFace: FONT_FA,
        rtlMode: true,
        lineSpacingMultiple: 1.25,
      });

      // Office Map / Contact on Left Column
      addContainedImage(slide, backMapImg, 0.55, 1.0, 4.7, 4.15);
    } else {
      addContainedImage(slide, backMapImg, 2.0, 1.0, 9.3, 4.15);
    }

    // Bottom Workshop Photo Strip cleanly across lower section
    addCoverImage(slide, closingStripImg, 0, 5.3, SLIDE_W, 1.75);
  }

  onProgress?.('در حال ذخیره‌سازی فایل پاورپوینت (.pptx)...');
  const outName =
    filename ||
    (activeProposal
      ? `OWJ-CPMAI-Proposal-0${activeProposal.id.replace('khatam-0', '')}-${activeProposal.repoName}.pptx`
      : 'OWJ-CPMAI-Protocol-Damavand.pptx');

  if (isTauriDesktop()) {
    const rawOutput = await pptx.write({
      outputType: 'uint8array',
      compression: true,
    });
    const bytes =
      rawOutput instanceof Uint8Array
        ? rawOutput
        : new Uint8Array(rawOutput as ArrayBuffer);
    await saveBinaryFile(
      bytes,
      outName,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'PowerPoint Presentation',
      ['pptx']
    );
    return;
  }

  await pptx.writeFile({ fileName: outName, compression: true });
}
