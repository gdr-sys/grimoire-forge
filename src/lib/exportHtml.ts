import type { GrimoireDocument } from '../types/document';

export function exportToHtml(doc: GrimoireDocument, containerEl: HTMLElement): void {
  const styles = Array.from(document.styleSheets)
    .map((ss) => {
      try {
        return Array.from(ss.cssRules).map((r) => r.cssText).join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title || 'Grimoire Forge Document'}</title>
  <style>${styles}</style>
</head>
<body>
${containerEl.outerHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || 'grimoire-forge-document'}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
