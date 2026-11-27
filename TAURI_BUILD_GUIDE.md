# راهنمای ساخت فایل نصبی دسکتاپ با Tauri v2 (سامانه جامع پروپوزال‌های CPMAI قرارگاه خاتم‌الانبیا)

این پروژه به‌طور کامل برای تبدیل به **نرم‌افزار دسکتاپ نصبی (Windows / macOS / Linux)** با فریم‌ورک **Tauri v2** پیکربندی شده و **۱۰۰٪ امکانات نسخه وب** را به‌صورت **کاملاً آفلاین و بومی (Native)** حفظ می‌کند:

- هاب دایره‌ای چرخان ۹ پروپوزال هلدینگ‌های قرارگاه سازندگی خاتم‌الانبیا (ص) + پروتکل دماوند
- نمای ایبوک چاپی ۲۲ صفحه A4 + نمای وب تعاملی + ولوم چرخان شناور بدون کادر
- ابزار زوم و تمرکز موضعی (Spotlight Focus) با مات‌کردن پس‌زمینه
- ویرایشگر مدیریتی (Admin Editor) با ذخیره دائمی محلی
- خروجی برداری **PDF (با فونت فارسی B Nazanin و B Titr)** از طریق پنجره استاندارد ذخیره فایل سیستم‌عامل (`Save As`)
- خروجی **PowerPoint (.pptx)** از طریق پنجره استاندارد ذخیره فایل سیستم‌عامل
- دانلود تصویر **QR Code** و پوستر تست اتصال پیش از کلاس به‌صورت بومی
- چاپ مستقیم A4 (`Ctrl+P`) و باز شدن خودکار لینک‌های خارجی در مرورگر سیستم

---

## روش ۱: ساخت خودکار فایل نصبی (Windows `.exe` / `.msi`، macOS `.dmg`، Linux `.deb` / `.AppImage`) با GitHub Actions

فایل گردش‌کار `.github/workflows/tauri-release.yml` آماده است. هر زمان تگ جدیدی (مثلاً `v1.0.0`) پوش شود یا از تب **Actions -> Build Tauri Desktop Installers -> Run workflow** اجرا گردد، گیت‌هاب به‌صورت خودکار فایل‌های نصبی زیر را تولید و در بخش **Releases** و **Artifacts** منتشر می‌کند:

- **ویندوز (Windows x64)**: `Owj-Khatam-CPMAI_1.0.0_x64-setup.exe` (نصب‌کننده NSIS بدون نیاز به دسترسی ادمین) و `Owj-Khatam-CPMAI_1.0.0_x64_en-US.msi`
- **مک (macOS)**: فایل نصبی `.dmg`
- **لینوکس (Linux)**: فایل‌های `.deb` و `.AppImage`

---

## روش ۲: ساخت مستقیم فایل نصبی روی سیستم شخصی

### پیش‌نیازها
1. **Node.js 20+**
2. **Rust Toolchain** (`rustup` از `https://rustup.rs`)
3. روی ویندوز: **Microsoft C++ Build Tools** (و WebView2 که در ویندوز ۱۰/۱۱ به‌صورت پیش‌فرض نصب است)

### دستورات اجرا و بیلد
```bash
# نصب پکیج‌ها
npm install

# اجرای زنده محیط توسعه دسکتاپ Tauri
npm run tauri:dev

# ساخت فایل نصبی نهایی (.exe / .msi / .dmg / .deb)
npm run tauri:build
```

خروجی فایل‌های نصبی در مسیر زیر قرار می‌گیرد:
- ویندوز: `src-tauri/target/release/bundle/nsis/` و `src-tauri/target/release/bundle/msi/`
- مک: `src-tauri/target/release/bundle/dmg/`
- لینوکس: `src-tauri/target/release/bundle/deb/` و `src-tauri/target/release/bundle/appimage/`
