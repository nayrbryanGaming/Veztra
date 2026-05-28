'use client'

import { create } from 'zustand'

interface AppState {
  isCreatingStream: boolean
  setIsCreatingStream: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isCreatingStream: false,
  setIsCreatingStream: (v) => set({ isCreatingStream: v }),
}))
