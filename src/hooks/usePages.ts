import { useDocumentStore } from '../stores/documentStore';
import type { Page } from '../types/page';
import { DEFAULT_PAGE } from '../types/page';

export function usePages() {
  const currentDocument = useDocumentStore((s) => s.currentDocument);
  const addPage = useDocumentStore((s) => s.addPage);
  const removePage = useDocumentStore((s) => s.removePage);
  const updatePage = useDocumentStore((s) => s.updatePage);
  const reorderPages = useDocumentStore((s) => s.reorderPages);

  function addNewPage(): void {
    const page: Page = { ...DEFAULT_PAGE, id: crypto.randomUUID() };
    addPage(page);
  }

  return {
    pages: currentDocument?.pages ?? [],
    addPage: addNewPage,
    removePage,
    updatePage,
    reorderPages,
  };
}
