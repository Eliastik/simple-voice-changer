"use client";

import "./globals.css";
import { AudioEditorProvider } from "./context/AudioEditorContext";
import { ApplicationConfigProvider } from './context/ApplicationConfigContext';
import LayoutChild from "./layoutChild";

const RootLayout = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <AudioEditorProvider>
      <ApplicationConfigProvider>
        <LayoutChild>{children}</LayoutChild>
      </ApplicationConfigProvider>
    </AudioEditorProvider>
  )
};

export default RootLayout;