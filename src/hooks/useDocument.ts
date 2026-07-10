import { useDocumentStore } from '../stores/documentStore';

export function useDocument() {
  return {
    currentDocument: useDocumentStore((s) => s.currentDocument),
    isDirty: useDocumentStore((s) => s.isDirty),
    documentList: useDocumentStore((s) => s.documentList),
    updateTitle: useDocumentStore((s) => s.updateTitle),
  };
}
