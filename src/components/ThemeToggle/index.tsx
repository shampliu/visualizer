"use client"

import useStore, { ColorScheme } from "@/store"

export const ThemeToggle = () => {
  const { prefersColorScheme, setColorScheme } = useStore((state) => ({
    prefersColorScheme: state.prefersColorScheme,
    setColorScheme: state.setColorScheme,
  }));

  const toggle = () => {
    setColorScheme(prefersColorScheme === ColorScheme.Dark ? ColorScheme.Light : ColorScheme.Dark)
  }

  return (
    <div suppressHydrationWarning className='fixed bottom-0 right-0' onClick={toggle}>{ prefersColorScheme }</div>
  )
}