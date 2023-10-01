"use client";

import './globals.css'
import { Inter } from 'next/font/google';
import Navbar from './components/navbar/navbar';
import React from "react";
import { Provider } from 'react-redux';
import ReduxStore from './store';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={ReduxStore}>
      <html data-theme="light" className="h-full">
        <body className={`${inter.className} h-full flex flex-col`}>
          <Navbar></Navbar>{children}
        </body>
      </html>
    </Provider>
  )
}