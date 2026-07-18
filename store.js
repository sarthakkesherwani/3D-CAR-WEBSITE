import { create } from 'zustand'

export const useStore = create((set) => ({
  paint: '#11151f', // Midnight Black
  finish: 'glossy', // 'glossy' | 'matte'
  rim: '#0b0d10', // Gloss Black

  loaded: false,
  soundOn: false,

  setPaint: (paint) => set({ paint }),
  setFinish: (finish) => set({ finish }),
  setRim: (rim) => set({ rim }),
  setLoaded: (loaded) => set({ loaded }),
  setSoundOn: (soundOn) => set({ soundOn }),
}))
