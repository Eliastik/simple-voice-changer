"use client";

import './globals.css'
import { Inter } from 'next/font/google';
import Navbar from './components/navbar/navbar';
import React from "react";
import { AudioEditorProvider } from "./context/AudioEditorContext";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AudioEditorProvider>
      <html data-theme="dark" className="h-full">
        <body className={`${inter.className} h-full flex flex-col`}>
          <Navbar></Navbar>{children}
        </body>
      </html>
    </AudioEditorProvider>
  )
}