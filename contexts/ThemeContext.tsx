import React, { createContext, useContext, ReactNode } from 'react'
import { Colors, Spacing, FontSizes } from '../constants/data'

interface Theme {
  colors: typeof Colors
  spacing: typeof Spacing
  fontSize: typeof FontSizes
}

interface ThemeContextType {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme: Theme = {
    colors: Colors,
    spacing: Spacing,
    fontSize: FontSizes,
  }

  const contextValue: ThemeContextType = {
    theme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
