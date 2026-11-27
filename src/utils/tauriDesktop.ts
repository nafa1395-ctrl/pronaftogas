/**
 * Native Tauri v2 Desktop Bridge
 *
 * Detects whether the application is running inside the compiled Tauri desktop
 * installer (`window.__TAURI_INTERNALS__`) or in a standard web browser.
 * Preserves 100% of web features while upgrading file exports (PDF, PPTX, PNG)
 * and external links to native OS dialogs and handlers on desktop.
 */

export function isTauriDesktop(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

/**
 * Triggers a browser fallback download from raw bytes.
 */
function triggerBrowserBlobDownload(
  bytes: Uint8Array,
  filename: string,
  mimeType: string
): void {
  const safeCopy = new Uint8Array(bytes.byteLength);
  safeCopy.set(bytes);
  const blob = new Blob([safeCopy.buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Saves binary output (PDF, PPTX, PNG, JSON, etc.) natively via OS Save Dialog
 * when running inside Tauri Desktop, or falls back to browser download on web.
 *
 * Returns `true` if saved, `false` if the user cancelled the native save dialog.
 */
export async function saveBinaryFile(
  bytes: Uint8Array,
  defaultFilename: string,
  mimeType: string,
  filterName: string,
  extensions: string[]
): Promise<boolean> {
  if (!isTauriDesktop()) {
    triggerBrowserBlobDownload(bytes, defaultFilename, mimeType);
    return true;
  }

  try {
    const [{ save }, { writeFile }] = await Promise.all([
      import('@tauri-apps/plugin-dialog'),
      import('@tauri-apps/plugin-fs'),
    ]);

    const targetPath = await save({
      defaultPath: defaultFilename,
      filters: [{ name: filterName, extensions }],
    });

    if (!targetPath) {
      return false;
    }

    await writeFile(targetPath, bytes);
    return true;
  } catch (err) {
    console.warn('Tauri native save fallback to browser blob:', err);
    triggerBrowserBlobDownload(bytes, defaultFilename, mimeType);
    return true;
  }
}

/**
 * Saves a data URL or local/relative image asset URL cleanly on Desktop & Web.
 */
export async function saveImageAsset(
  sourceUrl: string,
  defaultFilename: string
): Promise<boolean> {
  if (!isTauriDesktop()) {
    const a = document.createElement('a');
    a.href = sourceUrl;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  }

  const res = await fetch(sourceUrl);
  const buffer = await res.arrayBuffer();
  const ext = defaultFilename.split('.').pop()?.toLowerCase() || 'png';
  const mime =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'svg'
        ? 'image/svg+xml'
        : 'image/png';

  return saveBinaryFile(
    new Uint8Array(buffer),
    defaultFilename,
    mime,
    'Image File',
    [ext]
  );
}

/**
 * Opens an external http/https URL in the user's native OS web browser
 * when running inside Tauri Desktop.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (!isTauriDesktop()) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    const { openUrl } = await import('@tauri-apps/plugin-opener');
    await openUrl(url);
  } catch (err) {
    console.warn('Tauri opener fallback:', err);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Installs a single global click handler when running inside Tauri Desktop
 * so external `<a href="https://..." target="_blank">` links open cleanly
 * in the system browser instead of inside the WebView.
 */
export function initTauriDesktopRuntime(): void {
  if (!isTauriDesktop()) return;

  document.documentElement.dataset.desktopRuntime = 'tauri';

  const handleExternalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const rawHref = anchor.getAttribute('href') || '';
    if (!/^https?:\/\//i.test(rawHref)) return;

    // Only intercept external links (not tauri.localhost or localhost)
    try {
      const parsed = new URL(rawHref);
      if (
        parsed.hostname === 'tauri.localhost' ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1'
      ) {
        return;
      }
      event.preventDefault();
      void openExternalUrl(rawHref);
    } catch {
      // Ignore malformed href
    }
  };

  document.addEventListener('click', handleExternalClick, true);
}
