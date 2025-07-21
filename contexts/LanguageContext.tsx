import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  supportedLanguages,
  SupportedLanguage,
  Translations,
  englishTranslations,
} from '../constants/translations'

interface LanguageContextType {
  language: SupportedLanguage
  translations: Translations
  setLanguage: (language: SupportedLanguage) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

const LANGUAGE_STORAGE_KEY = 'app_language'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setCurrentLanguage] = useState<SupportedLanguage>('en')
  const [translations, setTranslations] =
    useState<Translations>(englishTranslations)

  // Load saved language preference
  useEffect(() => {
    loadLanguagePreference()
  }, [])

  // Update translations when language changes
  useEffect(() => {
    setTranslations(supportedLanguages[language])
  }, [language])

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (savedLanguage && savedLanguage in supportedLanguages) {
        setCurrentLanguage(savedLanguage as SupportedLanguage)
      }
    } catch (error) {
      console.error('Error loading language preference:', error)
    }
  }

  const setLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
      setCurrentLanguage(newLanguage)
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }

  const t = (key: keyof Translations): string => {
    return translations[key] || englishTranslations[key] || key
  }

  const contextValue: LanguageContextType = {
    language,
    translations,
    setLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
