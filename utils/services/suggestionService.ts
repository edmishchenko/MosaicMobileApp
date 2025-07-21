import AsyncStorage from '@react-native-async-storage/async-storage'
import {SuggestionItem} from '../types/SuggestionItem'
import {getAllServices} from './serviceService'
import {getAllProducts} from './productService'
import {Service} from '../types/Service'
import {Product} from '../types/Product'

export const STORAGE_KEYS = {
  SUGGESTIONS: 'suggestions'
}

export const saveSuggestions = async (
  suggestions: Record<string, SuggestionItem[]>
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SUGGESTIONS,
      JSON.stringify(suggestions)
    )
  } catch (error) {
    console.error('Error saving suggestions:', error)
    throw error
  }
}

export const loadSuggestions = async (): Promise<
  Record<string, SuggestionItem[]>
> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SUGGESTIONS)
    return data
      ? JSON.parse(data)
      : { procedures: [], products: [], soldProducts: [] }
  } catch (error) {
    console.error('Error loading suggestions:', error)
    return { procedures: [], products: [], soldProducts: [] }
  }
}

export const addSuggestion = async (
  type: string,
  text: string
): Promise<void> => {
  try {
    const suggestions = await loadSuggestions()

    if (!suggestions[type]) {
      suggestions[type] = []
    }

    const existingIndex = suggestions[type].findIndex(
      (s) => s.text.toLowerCase() === text.toLowerCase()
    )

    if (existingIndex >= 0) {
      suggestions[type][existingIndex].usageCount++
    } else {
      suggestions[type].push({
        id: Date.now().toString(),
        text,
        usageCount: 1,
      })
    }

    // Sort by usage count
    suggestions[type].sort((a, b) => b.usageCount - a.usageCount)

    await saveSuggestions(suggestions)
  } catch (error) {
    console.error('Error adding suggestion:', error)
    throw error
  }
}

// Convert Service to SuggestionItem
const serviceToSuggestionItem = (service: Service): SuggestionItem => {
  return {
    id: service.id,
    text: service.name,
    usageCount: 1, // Default usage count
  }
}

// Convert Product to SuggestionItem
const productToSuggestionItem = (product: Product): SuggestionItem => {
  return {
    id: product.id,
    text: product.name,
    usageCount: 1, // Default usage count
  }
}

// Get procedures (services) from database
export const getProcedureSuggestions = async (): Promise<SuggestionItem[]> => {
  try {
    const services = await getAllServices()
    return services.map(serviceToSuggestionItem)
  } catch (error) {
    console.error('Error getting procedure suggestions:', error)
    return []
  }
}

// Get products from database
export const getProductSuggestions = async (): Promise<SuggestionItem[]> => {
  try {
    const products = await getAllProducts()
    return products.map(productToSuggestionItem)
  } catch (error) {
    console.error('Error getting product suggestions:', error)
    return []
  }
}

// Get all suggestions from database and merge with stored suggestions
export const getAllSuggestions = async (): Promise<Record<string, SuggestionItem[]>> => {
  try {
    // Get stored suggestions with usage counts
    const storedSuggestions = await loadSuggestions()

    // Get suggestions from database
    const proceduresFromDb = await getProcedureSuggestions()
    const productsFromDb = await getProductSuggestions()

    // Merge database suggestions with stored suggestions
    return {
      procedures: mergeSuggestions(proceduresFromDb, storedSuggestions.procedures || []),
      products: mergeSuggestions(productsFromDb, storedSuggestions.products || []),
      soldProducts: storedSuggestions.soldProducts || [],
    }
  } catch (error) {
    console.error('Error getting all suggestions:', error)
    return { procedures: [], products: [], soldProducts: [] }
  }
}

// Merge suggestions from database with stored suggestions
const mergeSuggestions = (
  dbSuggestions: SuggestionItem[],
  storedSuggestions: SuggestionItem[]
): SuggestionItem[] => {
  const merged: SuggestionItem[] = [...dbSuggestions]

  // Update usage counts from stored suggestions
  storedSuggestions.forEach(stored => {
    const existingIndex = merged.findIndex(
      item => item.text.toLowerCase() === stored.text.toLowerCase()
    )

    if (existingIndex >= 0) {
      merged[existingIndex].usageCount = stored.usageCount
    } else {
      merged.push(stored)
    }
  })

  // Sort by usage count
  merged.sort((a, b) => b.usageCount - a.usageCount)

  return merged
}
