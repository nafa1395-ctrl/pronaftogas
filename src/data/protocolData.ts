export interface CredentialItem {
  id: string;
  index: string;
  titleFa: string;
  code?: string;
  organizationFa: string;
  organizationEn: string;
  category: 'pm' | 'ai';
}

export interface ProtocolSectionItem {
  id: string;
  index: string;
  title: string;
  leadText: string;
  bullets?: string[];
  highlightNote?: string;
  category: 'hardware' | 'participants' | 'classroom' | 'hospitality' | 'legal';
  checklistLabel: string;
}

export interface ScheduleSlot {
  id: string;
  timeRange: string;
  title: string;
  description: string;
}

export const DOCUMENT_META = {
  title: 'پروتکل برگزاری بوت کمپ آموزشی CPMAI',
  organization: 'شرکت مشاوران مدیریت کسب و کار اوج',
  organizationEn: 'OWJ Business Council',
  clientProject: 'طرح پتروشیمی دماوند',
  instructorName: 'ابوالفضل جعفری اصل',
  instructorNameEn: 'Abolfazl Jafari Asl',
  instructorRole: 'مدیرعامل شرکت مشاوران مدیریت کسب و کار اوج',
  instructorDistinction:
    'اولین و تنها ایرانی دارنده تمامی گواهینامه‌های ۱۳گانه هوش مصنوعی از Cognilytica آمریکا و انستیتو مدیریت پروژه آمریکا (PMI) - (CPMAI v7) (PMI-CPMAI)',
  website: 'www.owjbc.com',
  phones: {
    tehran: '+982122757725 - 26',
    tabriz: '+984135572612 - 15',
  },
  addresses: {
    tehran: 'تهران - میدان تجریش - خیابان ولیعصر - کوچه کاشانچی',
    tabriz: 'تبریز - میدان ساعت - کوچه شهید فهیمی',
  },
};

const BASE_URL = import.meta.env.BASE_URL || './';

export const EXTRACTED_ASSETS = {
  coverFull: `${BASE_URL}assets/aistudio/Picture5_665b6fbe.jpg`,
  contactStrip: `${BASE_URL}assets/extracted/obj_19.png`,
  pageTemplateBg: `${BASE_URL}assets/extracted/obj_23.jpg`,
  instructorBanner: `${BASE_URL}assets/aistudio/Picture2_643ee570.png`,
  instructorMask: `${BASE_URL}assets/extracted/mask_25.png`,
  qrCode: `${BASE_URL}assets/extracted/obj_26.png`,
  owjLogoWhite: `${BASE_URL}assets/extracted/owj_logo_tight_white.png`,
  owjLogoNavy: `${BASE_URL}assets/extracted/owj_logo_tight_navy.png`,
  owjLogoOriginal: `${BASE_URL}assets/extracted/owj_logo_tight_white.png`,
  axelosLogo: `${BASE_URL}assets/extracted/obj_34.jpg`,
  ipmaLogo: `${BASE_URL}assets/extracted/obj_35.png`,
  pmiLogo: `${BASE_URL}assets/extracted/obj_37.jpg`,
  iranPmaLogo: `${BASE_URL}assets/extracted/obj_38.png`,
  ajaLogoWhite: `${BASE_URL}assets/extracted/aja_logo_tight_white.png`,
  ajaLogoNavy: `${BASE_URL}assets/extracted/aja_logo_tight_navy.png`,
  certPmiCpmai: `${BASE_URL}assets/aistudio/Picture3_4a00e079.png`,
  certCpmaiV7: `${BASE_URL}assets/aistudio/Picture6_5bbd6835.png`,
  copyrightShield: `${BASE_URL}assets/extracted/obj_74.jpg`,
  copyrightMask: `${BASE_URL}assets/extracted/mask_75.png`,
  backCoverMap: `${BASE_URL}assets/aistudio/Picture7_7c229ba9.jpg`,
  originalPdfUrl: `${BASE_URL}assets/aistudio/OWJbc__1__dfaa098a.pdf`,
  connectionTestPoster: `${BASE_URL}assets/aistudio/protocol-poster_22944921.png`,
  clientsLogosAndWorkshops: `${BASE_URL}assets/aistudio/_B88C5F98-CDA2-493F-AC79-8A2DA7A0B265__51deb40d.png`,
  ipmaWorkshopsGrid: `${BASE_URL}assets/aistudio/_671924F2-6457-44F5-874C-ED106BC58294__a99946f0.png`,
  instructorCutout: `${BASE_URL}assets/extracted/instructor_cutout.png`,
  coachFakouriPortrait: `${BASE_URL}assets/extracted/coach_fakouri.png`,
  coachAslaniPortrait: `${BASE_URL}assets/extracted/coach_aslani.png`,
  tocConstructionStrip: `${BASE_URL}assets/extracted/toc_construction_strip.png`,
  closingWorkshopStrip: `${BASE_URL}assets/extracted/closing_workshop_strip.png`,
  copyrightShieldClean: `${BASE_URL}assets/extracted/copyright_shield_clean.png`,
  ipmaFullLogo: `${BASE_URL}assets/extracted/ipma_full_logo.png`,
  iranPmaClean: `${BASE_URL}assets/extracted/iranpma_clean.png`,
};

export const CONNECTION_TEST_PROTOCOL = {
  kicker: 'پروتکل شروع دوره',
  headline: 'قبل از کلاس، اتصالت را تست کن',
  subheadline:
    'بیشتر ابزارهای هوش مصنوعی این دوره به تحریم‌شکن معتبر نیاز دارند. ۲ دقیقه وقت بگذار تا از دقیقه‌ی اول با ما هم‌قدم باشی.',
  steps: [
    {
      num: '۱',
      title: 'تحریم‌شکن',
      description: 'یک تحریم‌شکن مطمئن روی دستگاهت نصب و روشن کن.',
    },
    {
      num: '۲',
      title: 'سایت تست',
      description: 'آدرس زیر را باز کن یا QR کد را با گوشی اسکن کن.',
    },
    {
      num: '۳',
      title: 'تست کامل',
      description: 'با ایمیل وارد شو و یک پیام در چت بفرست.',
    },
  ],
  ctaTitle: 'اسکن کن و تست بگیر',
  testUrl: 'gemini.google.com',
  testUrlFull: 'https://gemini.google.com',
  checkItems: [
    'با ایمیلت وارد شو',
    'یک پیام در چت بفرست',
    'جواب گرفتی؟ آماده‌ای!',
  ],
  footerNote:
    'این تست را پیش از شروع دوره انجام بده؛ وقت کلاس برای یادگیری است، نه عیب‌یابی اتصال.',
  badgeText: 'تست شد؟ یک ✅ بفرست',
};

export const EXECUTIVE_LETTER = {
  invocation: 'بسمه تعالی',
  body: 'کارفرمای محترم پروتکل پیوست جهت برگزاری اثربخش سلسله کارگاه‌های آموزشی تربیت متخصص حرفه‌ای راهبری هوش مصنوعی (CPMAI) در آن مجموعه معظم توسط شرکت مشاوران مدیریت کسب و کار اوج آماده‌سازی و تهیه گردیده است. خواهشمند است دستور فرمایید بندهای آن بصورت کامل توسط واحد مجری و ناظر کارگاه‌های آموزشی و جلسات مشاوره‌ای اجرایی گردد. امید است خدمات ثمربخشی را برای آن مجموعه ارائه نموده و در راستای تعالی اهداف والای آن مجموعه تمام تلاش خود را به کارگیریم.',
  signOff: 'با تشکر',
  department: 'دپارتمان کوچینگ',
  company: 'شرکت مشاوران مدیریت کسب و کار اوج',
};

export const COMPANY_RESUME_DATA = {
  titleFa: 'شرکت مشاوران مدیریت کسب و کار اوج',
  titleEn: 'OWJ Business Council',
  tagline:
    'مرجع تخصصی آموزش‌های عالی مدیریتی، کوچینگ اجرایی، دفاتر مدیریت پروژه (PMO) و فرهنگ‌سازی استاندارد جهانی هوش مصنوعی در پروژه (PMI-CPMAI v8)',
  executiveIntro:
    'شرکت مشاوران مدیریت کسب و کار اوج (OWJ Business Council) به عنوان یکی از پیشگامان آموزش‌های عالی مدیریتی، کوچینگ اجرایی و مشاوره تخصصی مدیریت پروژه در کشور، مأموریت خود را بر توانمندسازی مدیران ارشد، ارتقای بلوغ دفاتر مدیریت پروژه (PMO) و انتقال روزآمدترین متدولوژی‌های بین‌المللی به صنایع مادر و سازمان‌های پروژه‌محور قرار داده است. این مجموعه با تکیه بر بالاترین مراتب اعتباربخشی بین‌المللی از انستیتو مدیریت پروژه آمریکا (PMI)، موسسه AXELOS انگلستان، انجمن جهانی مدیریت پروژه (IPMA) و انجمن مدیریت پروژه ایران (IranPMA)، پیشگام بومی‌سازی و آموزش استاندارد جهانی مدیریت پروژه‌های هوش مصنوعی (PMI-CPMAI v8) در ابرپروژه‌های ملی است.',
  stats: [
    {
      value: '۱۳ گواهینامه AI',
      label:
        'تنها مرجع دارنده کل گواهینامه‌های ۱۳گانه هوش مصنوعی PMI و Cognilytica آمریکا در کشور',
    },
    {
      value: '+۱۰ استاندارد جهانی',
      label:
        'پوشش یکپارچه استانداردهای PMP, PMI-ACP, PMOCP, PRINCE2, IPMA و PMI-CPMAI v8',
    },
    {
      value: 'صنایع مادر و EPC',
      label:
        'سابقه درخشان آموزش مدیران ارشد و کوچینگ اجرایی در مگاپروژه‌های نفت، گاز، معدن و زیرساخت',
    },
    {
      value: '۲ دفتر مرکزی',
      label:
        'استقرار دفاتر رسمی و دپارتمان‌های تخصصی آموزش و کوچینگ در تهران و تبریز',
    },
  ],
  corePillars: [
    {
      num: '۰۱',
      title: 'مرجعیت آموزش و فرهنگ‌سازی استاندارد جهانی PMI-CPMAI v8',
      code: 'AI Project Management & Culture',
      description:
        'برگزاری بوت‌کمپ‌های تخصصی تربیت متخصص راهبری پروژه‌های هوش مصنوعی (CPMAI) با هدف ایجاد زبان مشترک، فرهنگ‌سازی سازمانی و انگیزه‌بخشی به تیم‌های مدیریتی و مهندسی بدون نیاز به پیش‌زمینه برنامه‌نویسی.',
    },
    {
      num: '۰۲',
      title: 'معماری، استقرار و ارتقای بلوغ دفاتر مدیریت پروژه (PMO / EPMO)',
      code: 'PMO & Portfolio Governance',
      description:
        'طراحی ساختارهای حاکمیت سبد پروژه‌ها، استانداردسازی فرآیندهای برنامه‌ریزی و کنترل پروژه، مدیریت ریسک (PMI-RMP) و تحلیل کسب‌وکار (PMI-PBA) منطبق بر آخرین ویرایش استانداردهای جهانی.',
    },
    {
      num: '۰۳',
      title: 'آکادمی آموزش‌های عالی مدیران ارشد و گواهینامه‌های بین‌المللی',
      code: 'Executive & International PM Academy',
      description:
        'طراحی و اجرای دوره‌های گواهینامه‌محور بین‌المللی (PMP, PMI-ACP, PMOCP, PRINCE2, IPMA) با رویکرد حل مسئله‌های واقعی کارگاهی و ارتقای شایستگی‌های حرفه‌ای مدیران پروژه.',
    },
    {
      num: '۰۴',
      title: 'کوچینگ اجرایی مدیران (Executive Coaching) و مدیریت تغییر',
      code: 'Executive Leadership & Transformation',
      description:
        'همراهی ساختاریافته با مدیران عامل، اعضای هیئت‌مدیره و مدیران ارشد هلدینگ‌ها جهت هدایت تحولات سازمانی، چابک‌سازی تیم‌ها و عبور موفق از مقاومت‌های سازمانی در پذیرش فناوری‌های نوین.',
    },
  ],
  nationalTrackRecord: [
    {
      num: '۰۱',
      sector: 'صنایع نفت، گاز، پالایش و پتروشیمی (مگاپروژه‌های EPC و انرژی)',
      summary:
        'توانمندسازی مدیران پروژه، تیم‌های مهندسی، تدارکات و کنترل پروژه در طرح‌های عظیم پتروشیمی، پالایشگاهی و خطوط انتقال انرژی با تمرکز بر مدیریت ریسک، ادعا و هوش مصنوعی شناختی.',
    },
    {
      num: '۰۲',
      sector: 'ابرپروژه‌های زیرساخت، راه و شهرسازی، حمل‌ونقل ریلی و سازه‌های دریایی',
      summary:
        'ارائه خدمات آموزشی و مشاوره‌ای مدیریت پروژه، زمان‌بندی پیشرفته (PMI-SP) و حاکمیت PMO در پروژه‌های عمرانی، کریدورهای ترانزیتی، تونل‌سازی و توسعه بنادر.',
    },
    {
      num: '۰۳',
      sector: 'صنایع معدنی، فولاد، مس، نیروگاه‌ها و شبکه‌های آب و برق',
      summary:
        'اجرای کارگاه‌های تخصصی مدیریت چابک، مدیریت پورتفولیو و کاربست الگوهای هفت‌گانه هوش مصنوعی در زنجیره ارزش معدن تا صنایع معدنی و طرح‌های نیروگاهی.',
    },
    {
      num: '۰۴',
      sector: 'هلدینگ‌های چندرشته‌ای، فناوری اطلاعات و سازمان‌های پروژه‌محور',
      summary:
        'تدوین نقشه‌های راه آموزشی، ارزیابی بلوغ سازمانی و تربیت مدیران حرفه‌ای پروژه و هوش مصنوعی در ستاد هلدینگ‌ها و شرکت‌های فناورانه و ارتباطی.',
    },
  ],
  whyOwjForCpmai: [
    {
      title: 'بومی‌سازی متدولوژی ۶ فازی CPMAI برای ادبیات مهندسی و پیمانکاری ایران',
      description:
        'تبدیل مفاهیم انتزاعی هوش مصنوعی به کاربرگ‌های ملموس ۶ فازی متناسب با صورت‌وضعیت‌ها، برنامه‌های زمان‌بندی، زنجیره تأمین و گزارش‌های کنترلی هلدینگ‌ها.',
    },
    {
      title: 'رویکرد ۱۰۰٪ آموزشی، فرهنگی و انگیزشی پیش از هزینه‌کرد در پیاده‌سازی',
      description:
        'ایجاد اشتیاق، باور مدیریتی و تسلط مفهومی در بدنه کارشناسی و مدیریتی هلدینگ با استفاده از ابزارهای تعاملی و ابری در دسترس، پیش از ورود به فازهای سنگین خرید سخت‌افزار یا نرم‌افزار.',
    },
    {
      title: 'تدریس انحصاری توسط تنها دارنده هر ۱۳ گواهینامه هوش مصنوعی PMI در ایران',
      description:
        'انتقال مستقیم دانش و تجربه جهانی استانداردهای PMI-CPMAI و CPMAI v7 بدون واسطه و با بالاترین استاندارد کیفی آموزش مدیران ارشد.',
    },
    {
      title: 'پروتکل اجرایی منظم، کاربرگ‌های استاندارد و پشتیبانی دپارتمان کوچینگ اوج',
      description:
        'بهره‌مندی از ساختار آموزشی دقیق، پک‌های کارگاهی استاندارد و همراهی دپارتمان کوچینگ اوج از مرحله آماده‌سازی پیش از دوره تا ارزیابی نهایی دستاوردهای آموزشی.',
    },
  ],
  clientsSummary:
    'مشاور و مدرس سازمان‌ها و شرکت‌های متعدد عمرانی، نفت و گاز، فولاد و ... نظیر هلدینگ پتروشیمی خلیج فارس، شهرداری تهران، شهرداری مشهد، شرکت ملی مناطق نفت‌خیز جنوب، شرکت ملی صنایع پتروشیمی ایران، شرکت مدیریت منابع آب ایران، قرارگاه سازندگی خاتم‌الانبیاء (ص) (موسسه مهندسی رهاب)، شرکت مهندسی و توسعه صنایع پتروشیمی (PIDMCO)، شرکت سرمایه‌گذاری تأمین اجتماعی (شستا)، سازمان منطقه آزاد ارس، گروه مپنا، گروه صنعتی تراکتورسازی ایران، شرکت آب منطقه‌ای فارس، شرکت مهندسی و ساختمان نفت ایران، بنیاد مستضعفان انقلاب اسلامی و ...',
  ipmaPrideStatement:
    'بر خود می‌بالیم که از بین دارندگان سطوح مختلف گواهینامه‌های حرفه‌ای انجمن جهانی مدیریت پروژه (IPMA) در ایران، از هر ۱۰ نفر بیش از ۳ نفر با ما این سفر سرشار از شور و آموختن را گذرانده‌اند.',
  copyrightStatement:
    'با احترام، به استحضار می‌رساند، تمام حقوق مادی و معنوی این طرح متعلق به «شرکت مشاوران مدیریت کسب و کار اوج» می‌باشد و منحصراً جهت بررسی در آن شرکت/سازمان محترم تهیه شده است و مشمول قوانین حفظ محتوای اختصاصی می‌باشد. خواهشمند است، از اشتراک‌گذاری یا واگذاری آن به دیگران خودداری فرمایید. پیشاپیش از حسن توجه شما در حفظ و عدم افشای محتوای این سند سپاسگزاریم.',
};

export interface SeniorCoachItem {
  id: string;
  num: string;
  name: string;
  portrait: string;
  roleTitle: string;
  experienceTitle: string;
  experiences: string[];
  skillsTitle: string;
  skills: { category: string; items: string }[];
  certificatesTitle?: string;
  certificates?: string[];
}

export const SENIOR_COACHES_DATA: SeniorCoachItem[] = [
  {
    id: 'coach-1',
    num: '۱',
    name: 'کاظم فکوری‌زاد',
    portrait: EXTRACTED_ASSETS.coachFakouriPortrait,
    roleTitle: 'مهندس عمران | مدیر ارشد فنی، مهندسی و اجرای پروژه‌های زیربنایی',
    experienceTitle: 'معرفی و سوابق تخصصی:',
    experiences: [
      'بیش از ۱۰ سال تجربه تخصصی در مدیریت، راهبری فنی و اجرای ابرپروژه‌های عمرانی، به‌ویژه در حوزه مترو، تونل‌سازی مکانیزه (TBM) و خطوط انتقال',
      'راهبری فنی و مهندسی ساخت ایستگاه‌های مترو (شامل سازه، معماری، تجهیزات و تحویل کامل ایستگاه) و پشتیبانی مهندسی حفاری تونل و اورهال دستگاه‌های TBM',
      'مدیریت ساخت، تجهیز و بهره‌برداری از کارخانجات تولید قطعات بتنی پیش‌ساخته (سگمنتال و تراورس) با سابقه راه‌اندازی سریع و ثبت رکوردهای تولید بالا',
      'مدیریت تأمین پروژه، تحلیل و مدیریت ریسک، مدیریت قراردادها و دعاوی، و به‌کارگیری فناوری‌های نوین (هوش مصنوعی، BIM، Digital Twin و IoT) در بهینه‌سازی و کنترل مگاپروژه‌ها',
    ],
    skillsTitle: 'مهارت‌ها و ابزارهای تخصصی:',
    skills: [
      {
        category: 'مدیریت و کنترل پروژه',
        items: 'تحلیل ریسک و مدیریت ادعا (Claim)',
      },
      {
        category: 'فنی، مهندسی و توسعه',
        items:
          'مدیریت ساخت و کارخانجات قطعات بتنی، سفارشی‌سازی (Customize) اپلیکیشن‌های مهندسی در فضای توسعه و اسکریپت‌نویسی پیشرفته',
      },
      {
        category: 'فناوری‌های نوین',
        items: 'کاربرد هوش مصنوعی در مدیریت پروژه (Generative AI for PM)',
      },
    ],
    certificatesTitle: 'گواهینامه‌ها و دوره‌های تخصصی:',
    certificates: [
      'گواهینامه بین‌المللی مدیریت پروژه بر اساس استاندارد ICB4 – از انجمن بین‌المللی مدیریت پروژه (IPMA)',
      'گواهینامه CPMI – از مجموعه اوج (به همراه گذراندن دوره تخصصی CPMI و دوره آمادگی آزمون PMP در مجموعه اوج)',
      'گواهینامه کاربرد عملی هوش مصنوعی مولد برای مدیران پروژه (Practical Application of Generative AI for Project Managers) – از PMI',
    ],
  },
  {
    id: 'coach-2',
    num: '۲',
    name: 'امیر اصلانی',
    portrait: EXTRACTED_ASSETS.coachAslaniPortrait,
    roleTitle: 'توسعه‌دهنده هوش تجاری (BI Developer) | مهندس و تحلیلگر داده',
    experienceTitle: 'معرفی و سوابق تخصصی:',
    experiences: [
      'متخصص توسعه سیستم‌های هوش تجاری (BI) و تحلیلگر فرآیندمحور داده با دانش عمیق در طراحی و معماری پایگاه‌های داده',
      'توانمند در تبدیل داده‌های خام به بینش‌های کاربردی و ارزش‌آفرین جهت پشتیبانی از تصمیم‌گیری‌های کلان و داده‌محور در سطح پروژه و سازمان',
      'مسلط به فرآیندهای یکپارچه‌سازی، مدل‌سازی و مصورسازی داده‌ها برای پایش شاخص‌های کلیدی عملکرد (KPI)',
    ],
    skillsTitle: 'تخصص‌ها و مهارت‌های فنی:',
    skills: [
      {
        category: 'هوش تجاری و مصورسازی داده (BI & Visualization)',
        items: 'Tableau, Grafana, Reporting, DAX',
      },
      {
        category: 'مهندسی و پایگاه داده (Data Engineering & DB)',
        items:
          'SQL Server، T-SQL، طراحی پایگاه داده (Database Design)، انبار داده (Data Warehousing)، مدل‌سازی داده (Data Modeling) و فرآیندهای DAX و ETL',
      },
      {
        category: 'برنامه‌نویسی و تحلیل داده',
        items: 'Python و تحلیل آماری و فرآیندی داده‌ها',
      },
    ],
  },
];

export const PM_CREDENTIALS: CredentialItem[] = [
  {
    id: 'pm-1',
    index: '01',
    titleFa: 'دارای مدرک مدیریت پروژه حرفه‌ای (PMP) از موسسه مدیریت پروژه (PMI) آمریکا',
    code: 'PMP',
    organizationFa: 'موسسه مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-2',
    index: '02',
    titleFa: 'دارای مدرک مدیریت حرفه‌ای پروژه‌های چابک (PMI-ACP) از انستیتو مدیریت پروژه آمریکا',
    code: 'PMI-ACP',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-3',
    index: '03',
    titleFa: 'دارای مدرک حرفه‌ای دفاتر مدیریت پروژه (PMOCP) از موسسه مدیریت پروژه (PMI) آمریکا',
    code: 'PMOCP',
    organizationFa: 'موسسه مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-4',
    index: '04',
    titleFa: 'دارای مدرک مدیریت پروژه PRINCE2 Practitioner 2017 از موسسه AXELOS انگلستان',
    code: 'PRINCE2 Practitioner',
    organizationFa: 'موسسه AXELOS انگلستان',
    organizationEn: 'AXELOS UK',
    category: 'pm',
  },
  {
    id: 'pm-5',
    index: '05',
    titleFa: 'دارای مدرک تحلیل‌گر حرفه‌ای کسب و کار (PMI-PBA) از موسسه مدیریت پروژه (PMI) آمریکا',
    code: 'PMI-PBA',
    organizationFa: 'موسسه مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-6',
    index: '06',
    titleFa: 'دارای مدرک مدیریت ریسک حرفه‌ای (PMI-RMP) از موسسه مدیریت پروژه (PMI) آمریکا',
    code: 'PMI-RMP',
    organizationFa: 'موسسه مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-7',
    index: '07',
    titleFa: 'دارای مدرک مدیریت زمان‌بندی حرفه‌ای (PMI-SP) از موسسه مدیریت پروژه (PMI) آمریکا',
    code: 'PMI-SP',
    organizationFa: 'موسسه مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'pm',
  },
  {
    id: 'pm-8',
    index: '08',
    titleFa: 'دارای گواهینامه حرفه‌ای مدیریت پروژه (IPMA) از انجمن مدیریت پروژه جهانی (IPMA) اروپا',
    code: 'IPMA',
    organizationFa: 'انجمن مدیریت پروژه جهانی اروپا',
    organizationEn: 'IPMA Europe',
    category: 'pm',
  },
  {
    id: 'pm-9',
    index: '09',
    titleFa: 'همکار آموزشی و مدرس تائید صلاحیت شده انجمن مدیریت پروژه ایران (IranPMA)',
    code: 'IranPMA',
    organizationFa: 'انجمن مدیریت پروژه ایران',
    organizationEn: 'IranPMA',
    category: 'pm',
  },
  {
    id: 'pm-10',
    index: '10',
    titleFa: 'دانشجوی دکتری مهندسی صنایع - دانشگاه تهران',
    code: 'Ph.D. Candidate',
    organizationFa: 'دانشگاه تهران',
    organizationEn: 'University of Tehran',
    category: 'pm',
  },
];

export const AI_CREDENTIALS_13: CredentialItem[] = [
  {
    id: 'ai-1',
    index: '01',
    titleFa: 'متخصص حرفه‌ای راهبری و مدیریت هوش مصنوعی از انستیتو مدیریت پروژه آمریکا (PMI-CPMAI)',
    code: 'PMI-CPMAI',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-2',
    index: '02',
    titleFa: 'متخصص حرفه‌ای مدیریت پروژه شناختی در پروژه‌های هوش مصنوعی از انستیتو مدیریت پروژه آمریکا (CPMAIv7)',
    code: 'CPMAI v7',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا و Cognilytica',
    organizationEn: 'PMI & Cognilytica',
    category: 'ai',
  },
  {
    id: 'ai-3',
    index: '03',
    titleFa: 'دارای گواهی پایان دوره راهبری و مدیریت هوش مصنوعی از سوی انستیتو مدیریت پروژه آمریکا (PMI-CPMAI)',
    code: 'PMI-CPMAI Course',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-4',
    index: '04',
    titleFa: 'دارای گواهی پایان دوره مدیریت پروژه شناختی در پروژه‌های هوش مصنوعی از سوی انستیتو مدیریت پروژه آمریکا (CPMAIv7)',
    code: 'CPMAI v7 Course',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-5',
    index: '05',
    titleFa: 'دارای گواهینامه کاربرد عملی هوش مصنوعی در مدیریت پروژه‌های چابک از انستیتو مدیریت پروژه آمریکا',
    code: 'AI in Agile PM',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-6',
    index: '06',
    titleFa: 'دارای گواهینامه ملزومات هوش مصنوعی برای متخصصین حرفه‌ای پروژه از انستیتو مدیریت پروژه آمریکا',
    code: 'AI Essentials',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-7',
    index: '07',
    titleFa: 'دارای گواهینامه متخصص حرفه‌ای هفت الگوی پروژه‌های هوش مصنوعی از انستیتو مدیریت پروژه آمریکا',
    code: 'Seven Patterns of AI',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-8',
    index: '08',
    titleFa: 'دارای گواهینامه هوش مصنوعی در پروژه‌های زیرساختی و صنعت ساخت از انستیتو مدیریت پروژه آمریکا',
    code: 'AI in Infrastructure & Construction',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-9',
    index: '09',
    titleFa: 'دارای گواهینامه چشم‌انداز داده‌ای هوش مصنوعی مولد برای مدیران پروژه از انستیتو مدیریت پروژه آمریکا',
    code: 'Data Landscape of GenAI',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-10',
    index: '10',
    titleFa: 'دارای گواهینامه مروری جامع بر هوش مصنوعی مولد برای مدیران پروژه از انستیتو مدیریت پروژه آمریکا',
    code: 'Generative AI Overview',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-11',
    index: '11',
    titleFa: 'دارای گواهی پایان دوره مقدمه‌ای بر مدیریت پروژه شناختی در پروژه‌های هوش مصنوعی از انستیتو مدیریت پروژه آمریکا',
    code: 'Intro to CPMAI',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-12',
    index: '12',
    titleFa: 'دارای گواهینامه کاربردهای عملی هوش مصنوعی مولد برای مدیران پروژه از انستیتو مدیریت پروژه آمریکا',
    code: 'Practical GenAI',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
  {
    id: 'ai-13',
    index: '13',
    titleFa: 'دارای گواهینامه مهندسی پرامپت برای مدیران پروژه از انستیتو مدیریت پروژه آمریکا',
    code: 'Prompt Engineering for PMs',
    organizationFa: 'انستیتو مدیریت پروژه آمریکا',
    organizationEn: 'PMI USA',
    category: 'ai',
  },
];

export const OFFICIAL_CERTIFICATES = [
  {
    id: 'cert-cpmai-v7',
    titleEn: 'Cognitive Project Management in AI (CPMAI v7)',
    titleFa: 'گواهینامه رسمی مدیریت پروژه شناختی در هوش مصنوعی (CPMAI v7)',
    recipient: 'Abolfazl Jafari Asl',
    issuer: 'Project Management Institute (PMI)',
    certNumber: '4212856',
    grantDate: '08 October 2025',
    expirationDate: 'Lifetime / Active',
    image: EXTRACTED_ASSETS.certCpmaiV7,
  },
  {
    id: 'cert-pmi-cpmai',
    titleEn: 'PMI Certified Professional in Managing AI (PMI-CPMAI)™',
    titleFa: 'گواهینامه متخصص حرفه‌ای راهبری و مدیریت هوش مصنوعی (PMI-CPMAI)™',
    recipient: 'Abolfazl Jafari Asl',
    issuer: 'Project Management Institute (PMI)',
    certNumber: '4212889',
    grantDate: '08 October 2025',
    expirationDate: '08 October 2028',
    image: EXTRACTED_ASSETS.certPmiCpmai,
  },
];

export const PROTOCOL_INTRO =
  'این پروتکل به منظور آماده‌سازی سالن برگزاری دوره آموزشی پیش‌رو و نیز آمادگی حداکثری شرکت‌کنندگان تدوین شده است. خواهشمند است نسبت به رعایت دقیق موارد ذیل دستور و اقدام لازم را مبذول فرمایید.';

export const PROTOCOL_CLAUSES: ProtocolSectionItem[] = [
  {
    id: 'clause-laptop',
    index: '01',
    title: 'لپ‌تاپ مدرس و تجهیزات تصویری سالن',
    leadText:
      'لپ‌تاپ مدرس از نوع MacBook Pro می‌باشد؛ لذا ضروری است واحد فناوری اطلاعات تنظیمات پروژکتورها را متناسب با این دستگاه انجام دهند. همچنین ضروری است اتصال سیستم‌های تصویری سالن از طریق درگاه استاندارد HDMI 2.0 / HDMI 2.1 فراهم گردد.',
    category: 'hardware',
    checklistLabel: 'تنظیم پروژکتور برای MacBook Pro و تست درگاه HDMI 2.0 / HDMI 2.1',
  },
  {
    id: 'clause-system-specs',
    index: '02',
    title: 'مشخصات سیستم شخصی مورد نیاز برای شرکت‌کنندگان در بوت کمپ',
    leadText:
      'پیشنهاد می‌شود شرکت‌کنندگان در بوت کمپ جامع CPMAI اوج؛ در تمام جلسات سیستم (ترجیحاً لپ‌تاپ) با حداقل مشخصات ذیل جهت انجام تمرینات همراه داشته باشند:',
    bullets: [
      'رم (RAM): حداقل 8GB (پیشنهاد: 16GB)',
      'حافظه: حداقل 20GB فضای خالی',
      'اینترنت پایدار',
      'سیستم‌عامل (OS): Windows 10 / 11, macOS, Linux',
      'کارت گرافیک جدا لازم نیست (گرافیک داخلی کافی است)',
    ],
    highlightNote:
      '* توجه: پیشنهاد می‌شود افراد در تمام جلسات به صورت فردی سیستم با حداقل مشخصات فوق (ترجیحاً لپ‌تاپ) به همراه داشته باشند، در غیر اینصورت، ضروریست سرگروه‌ها در هر گروه حداقل از وجود یک لپ‌تاپ در گروه اطمینان حاصل نمایند.',
    category: 'participants',
    checklistLabel: 'اطلاع‌رسانی مشخصات لپ‌تاپ شرکت‌کنندگان و تامین اینترنت پایدار سالن',
  },
  {
    id: 'clause-whiteboard',
    index: '03',
    title: 'وایت‌برد و ماژیک‌های چهاررنگ',
    leadText:
      'وایت‌برد با ابعاد ۱×۲ متر، ترجیحاً دوطرفه، برای سالن در نظر گرفته شود. همچنین ماژیک وایت‌برد در چهار رنگ آبی، قرمز، سبز و مشکی تهیه شده و پیش از کلاس از سالم بودن آن‌ها اطمینان حاصل گردد.',
    category: 'classroom',
    checklistLabel: 'استقرار وایت‌برد ۱×۲ متر (ترجیحاً دوطرفه) و تست ماژیک‌های ۴ رنگ',
  },
  {
    id: 'clause-packs',
    index: '04',
    title: 'پک‌های آموزشی شرکت‌کنندگان',
    leadText:
      'در روز برگزاری دوره، پک‌های ارائه‌شده بر روی میز هر یک از شرکت‌کنندگان قرار داده شود.',
    category: 'classroom',
    checklistLabel: 'چیدمان پک‌های آموزشی بر روی میز تک‌تک شرکت‌کنندگان پیش از شروع',
  },
  {
    id: 'clause-water',
    index: '05',
    title: 'تأمین آب معدنی حاضران و مدرس',
    leadText:
      'برای تمامی حاضران و نیز مدرس، آب معدنی تأمین گردد (تاکیداً برای مدرس، حداقل ۴ بطری آب معدنی ولرم در نظر گرفته شود).',
    category: 'hospitality',
    checklistLabel: 'تأمین آب معدنی حاضران و حداقل ۴ بطری آب معدنی ولرم برای مدرس',
  },
  {
    id: 'clause-catering',
    index: '06',
    title: 'پذیرایی و زمان‌بندی استاندارد بوت‌کمپ',
    leadText:
      'در صورت نیاز، پذیرایی شامل آب‌جوش، نسکافه و چای برای حاضران فراهم شود. خواهشمند است از قرار دادن هرگونه خوراکی بسته‌بندی‌شده در سالن خودداری شده و پذیرایی صرفاً در زمان استراحت و به شکلی مناسب انجام پذیرد.',
    bullets: [
      'صبحانه از ساعت ۶:۳۰ الی ۷:۱۵',
      'شروع کلاس راس ساعت ۷:۳۰',
      'نماز و ناهار از ساعت ۱۲:۰۰ الی ۱۳:۰۰',
      'اتمام کلاس ساعت ۱۷:۰۰',
    ],
    category: 'hospitality',
    checklistLabel: 'هماهنگی زمان‌بندی پذیرایی (صرفاً در زمان استراحت و بدون خوراکی بسته‌بندی در سالن)',
  },
  {
    id: 'clause-focus-discipline',
    index: '07',
    title: 'انضباط کلاسی، حفظ تمرکز و منع ترددهای غیرضروری',
    leadText:
      'به واسطه ماهیت تخصصی این دوره و نیاز به تمرکز بالای شرکت‌کنندگان در طول جلسات، خواهشمند است از ترددهای غیرضروری در حین برگزاری کلاس اکیداً خودداری فرمایید. بدیهی است جهت حفظ نظم و تمرکز آموزشی، از تکنیک‌های جریمه نقدی استفاده می‌شود.',
    highlightNote:
      '* نکته مهم: تمامی جرائم به‌صورت نقدی به حساب فرد نیازمند واجد شرایط پرداخت خواهد شد.',
    category: 'classroom',
    checklistLabel:
      'اطلاع‌رسانی منع ترددهای غیرضروری، حفظ تمرکز کلاس و اختصاص جرائم نقدی به فرد نیازمند واجد شرایط',
  },
  {
    id: 'clause-ip',
    index: '08',
    title: 'حفظ حقوق مالکیت معنوی',
    leadText:
      'به منظور حفظ حقوق مالکیت معنوی متعلق به شرکت اوج، ضروری است در فرآیند آماده‌سازی سالن و تجهیزات مورد استفاده، کلیه الزامات و تمهیدات لازم جهت صیانت از محتوای آموزشی و سایر دارایی‌های فکری متعلق به شرکت مشاوران مدیریت کسب و کار اوج و مدرسین متبوع آن رعایت و اجرا گردد.',
    highlightNote:
      '* توجه: خواهشمند است، از هرگونه ضبط صدای مدرسین در طول برگزاری دوره اکیداً خودداری شود.',
    category: 'legal',
    checklistLabel: 'ابلاغ ممنوعیت اکید ضبط صدای مدرسین و صیانت از محتوای آموزشی',
  },
  {
    id: 'clause-media',
    index: '09',
    title: 'مستندسازی بصری جلسه نخست',
    leadText:
      'لطفاً هماهنگی‌های لازم با واحد روابط عمومی به منظور فیلم‌برداری و عکاسی از جلسه نخست صورت پذیرد.',
    category: 'legal',
    checklistLabel: 'هماهنگی با واحد روابط عمومی جهت فیلم‌برداری و عکاسی از جلسه نخست',
  },
  {
    id: 'clause-connection-test',
    index: '10',
    title: 'پروتکل شروع دوره: تست اتصال و ابزارهای هوش مصنوعی پیش از کلاس',
    leadText:
      'بیشتر ابزارهای هوش مصنوعی این دوره به تحریم‌شکن معتبر نیاز دارند. ضروری است شرکت‌کنندگان پیش از شروع دوره در ۳ گام (۱. نصب و روشن کردن تحریم‌شکن مطمئن، ۲. باز کردن آدرس gemini.google.com یا اسکن QR کد، ۳. ورود با ایمیل و ارسال یک پیام تست در چت) از برقراری کامل اتصال خود اطمینان حاصل نمایند.',
    bullets: [
      'گام ۱ (تحریم‌شکن): نصب و روشن کردن تحریم‌شکن مطمئن روی دستگاه',
      'گام ۲ (سایت تست): باز کردن gemini.google.com یا اسکن QR کد پوستر',
      'گام ۳ (تست کامل): ورود با ایمیل، ارسال پیام در چت و دریافت پاسخ',
    ],
    highlightNote:
      '* تاکید: این تست را پیش از شروع دوره انجام دهید؛ وقت کلاس برای یادگیری است، نه عیب‌یابی اتصال. (تست شد؟ یک ✅ بفرست)',
    category: 'participants',
    checklistLabel: 'ارسال پوستر «تست اتصال پیش از کلاس (gemini.google.com)» به شرکت‌کنندگان و دریافت تاییدیه ✅',
  },
];

export const CLASSROOM_FOCUS_NOTICE = {
  title: 'تذکر انضباطی مهم — منع ترددهای غیرضروری و حفظ تمرکز کلاس',
  body: 'به واسطه ماهیت تخصصی این دوره و نیاز به تمرکز بالای شرکت‌کنندگان، خواهشمند است از ترددهای غیرضروری در حین برگزاری جلسات اکیداً خودداری فرمایید. بدیهی است از تکنیک‌های جریمه نقدی استفاده می‌شود و تمامی جرائم به‌صورت نقدی به حساب فرد نیازمند واجد شرایط پرداخت خواهد شد.',
};

export const DAILY_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'slot-1',
    timeRange: '۰۶:۳۰ — ۰۷:۱۵',
    title: 'صرف صبحانه و پذیرش اولیه',
    description: 'پذیرایی صبحانه حاضران پیش از ورود به سالن اصلی آموزشی',
  },
  {
    id: 'slot-2',
    timeRange: '۰۷:۳۰ — ۱۲:۰۰',
    title: 'شروع رسمی کلاس و کارگاه نوبت صبح',
    description: 'آغاز راس ساعت ۷:۳۰؛ تدریس مفاهیم CPMAI و انجام تمرینات گروهی بر روی لپ‌تاپ',
  },
  {
    id: 'slot-3',
    timeRange: '۱۲:۰۰ — ۱۳:۰۰',
    title: 'فریضه نماز، ناهار و استراحت میانی',
    description: 'یک ساعت تنفس ظهرگاهی جهت اقامه نماز و صرف ناهار',
  },
  {
    id: 'slot-4',
    timeRange: '۱۳:۰۰ — ۱۷:۰۰',
    title: 'کارگاه عملی نوبت عصر و اتمام کلاس',
    description: 'ادامه مباحث تخصصی، کارگاه‌های عملی و جمع‌بندی روزانه راس ساعت ۱۷:۰۰',
  },
];

export const CONFIDENTIALITY_STATEMENT = {
  body: 'با احترام، به استحضار می‌رساند، تمام حقوق مادی و معنوی این فایل متعلق به "شرکت مشاوران مدیریت کسب و کار اوج" می‌باشد و منحصراً جهت بررسی در آن شرکت/سازمان محترم تهیه شده است و مشمول قوانین حفظ محتوای اختصاصی می‌باشد. خواهشمند است، از اشتراک‌گذاری یا واگذاری آن به دیگران خودداری فرمایید.',
  closing: 'پیشاپیش از حسن توجه شما در حفظ و عدم افشای محتوای این سند سپاسگزاریم.',
};
