import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface AddEntryModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AddEntryModalContext = createContext<AddEntryModalContextValue | null>(
  null
);

export function AddEntryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <AddEntryModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AddEntryModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Hook gehört zum Context-Pattern
export function useAddEntryModal() {
  const ctx = useContext(AddEntryModalContext);
  if (!ctx) {
    throw new Error(
      "useAddEntryModal must be used within AddEntryModalProvider"
    );
  }
  return ctx;
}
