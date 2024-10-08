import {create} from 'zustand';

const COLOR_SCHEME_KEY = 'colorScheme'

export enum ColorScheme {
  Dark = 'dark',
  Light = 'light',
}

interface State {
  prefersColorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const getInitialColorScheme = (): ColorScheme => {
  if (typeof window !== 'undefined') {
    const savedScheme = window.localStorage.getItem(COLOR_SCHEME_KEY) as ColorScheme;
    if (savedScheme === ColorScheme.Dark || savedScheme === ColorScheme.Light) {
      return savedScheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? ColorScheme.Dark : ColorScheme.Light;
  }
  
  return ColorScheme.Light;
};

const useStore = create<State>((set) => ({
  prefersColorScheme: getInitialColorScheme(),
  setColorScheme: (scheme: ColorScheme) => {
    localStorage.setItem(COLOR_SCHEME_KEY, scheme);
    set({ prefersColorScheme: scheme });
  },
  // toggleColorScheme: () => {
  //   set((state) => ({
  //     prefersColorScheme: state.prefersColorScheme === ColorScheme.Dark ? ColorScheme.Light : ColorScheme.Dark
  //   }))
  // }

  layout: {
    hoveredIdx: -1,
    selectedIdx: 0
  }
  

}));

export default useStore;