import { create } from "zustand";
import { IDocument, IIntelligence } from "../types/document";

interface DocumentState {
    activeDocument: IDocument | null;
    intelligence: IIntelligence | null;
    setActiveDocument: (doc: IDocument) => void;
    setIntelligence: (data: IIntelligence) => void;
    clearDocument: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    activeDocument: null,
    intelligence: null,
    setActiveDocument: (doc) => set({ activeDocument: doc }),
    setIntelligence: (data) => set({ intelligence: data }),
    clearDocument: () => set({ activeDocument: null, intelligence: null }),
}));
