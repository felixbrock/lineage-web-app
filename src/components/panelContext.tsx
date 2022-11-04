import { createContext, Dispatch, SetStateAction, useState } from 'react';

interface PanelContent {
  name: string;
  current: boolean;
  jsx: JSX.Element;
}

const panelExample: PanelContent[] = [];

interface Panel {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  content: any[]; // Panel[]
  setContent: Dispatch<SetStateAction<any>>;
}

// Split panel context to optimize rerender
export const leftPanel: Panel = {
  open: false,
  setOpen: () => {},
  activeTab: 0,
  setActiveTab: () => {},
  content: [],
  setContent: () => {},
};

export const rightPanel: Panel = {
  open: false,
  setOpen: () => {},
  activeTab: 0,
  setActiveTab: () => {},
  content: [],
  setContent: () => {},
};

export const LeftPanelContext = createContext(leftPanel);

export function LeftPanelContextProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState(panelExample);

  return (
    <LeftPanelContext.Provider
      value={{ ...leftPanel, open, setOpen, activeTab, setActiveTab, content, setContent }}
    >
      {children}
    </LeftPanelContext.Provider>
  );
}

export const RightPanelContext = createContext(rightPanel);

export function RightPanelContextProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState(panelExample);

  return (
    <RightPanelContext.Provider
      value={{ ...rightPanel, open, setOpen, activeTab, setActiveTab, content, setContent }}
    >
      {children}
    </RightPanelContext.Provider>
  );
}
