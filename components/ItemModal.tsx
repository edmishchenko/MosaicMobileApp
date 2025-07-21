import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  Colors,
  Spacing,
  FontSizes,
} from '../constants/data'
import {ModalType, SuggestionItem} from "../utils/types/SuggestionItem";
import {
  loadSuggestions,
  addSuggestion,
  getAllSuggestions,
  getProcedureSuggestions,
  getProductSuggestions
} from '../utils/services/suggestionService';


interface ItemModalProps {
  visible: boolean
  onClose: () => void
  type: ModalType
  items: string[]
  onItemsChange: (items: string[]) => void
}

export default function ItemModal({
  visible,
  onClose,
  type,
  items,
  onItemsChange,
}: ItemModalProps) {
  const [inputText, setInputText] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [allSuggestions, setAllSuggestions] = useState<SuggestionItem[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const getTitle = () => {
    switch (type) {
      case 'procedure':
        return 'Процедуры'
      case 'product':
        return 'Продукты'
      case 'soldProduct':
        return 'Проданные продукты'
      default:
        return 'Элементы'
    }
  }

  const getPlaceholder = () => {
    switch (type) {
      case 'procedure':
        return 'Введите название процедуры...'
      case 'product':
        return 'Введите название продукта...'
      case 'soldProduct':
        return 'Введите название проданного продукта...'
      default:
        return 'Введите название...'
    }
  }

  useEffect(() => {
    loadStoredSuggestions()
  }, [type])

  useEffect(() => {
    if (inputText.length > 0) {
      const filtered = allSuggestions.filter((item) =>
        item.text.toLowerCase().includes(inputText.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [inputText, allSuggestions])

  const loadStoredSuggestions = async () => {
    try {
      // Get all suggestions from database and stored preferences
      const allSuggestions = await getAllSuggestions()
      const typeKey = type === 'soldProduct' ? 'soldProducts' : `${type}s`

      // Set the suggestions for the current type
      setAllSuggestions(allSuggestions[typeKey] || [])
    } catch (error) {
      console.error('Error loading suggestions:', error)

      // Fallback to fetching just the type we need
      try {
        if (type === 'procedure') {
          const procedures = await getProcedureSuggestions()
          setAllSuggestions(procedures)
        } else if (type === 'product' || type === 'soldProduct') {
          const products = await getProductSuggestions()
          setAllSuggestions(products)
        } else {
          setAllSuggestions([])
        }
      } catch (fallbackError) {
        console.error('Fallback error loading suggestions:', fallbackError)
        setAllSuggestions([])
      }
    }
  }

  const addItem = async () => {
    if (!inputText.trim()) return

    if (editingIndex !== null) {
      // Editing existing item
      const newItems = [...items]
      newItems[editingIndex] = inputText.trim()
      onItemsChange(newItems)
      setEditingIndex(null)
    } else {
      // Adding new item
      onItemsChange([...items, inputText.trim()])
    }

    // Save to suggestions
    await addSuggestion(
      type === 'soldProduct' ? 'soldProducts' : `${type}s`,
      inputText.trim()
    )

    setInputText('')
    loadStoredSuggestions().then(() => {
        setSuggestions([]) // Clear suggestions after adding
    }) // Refresh suggestions
  }

  const selectSuggestion = (suggestion: SuggestionItem) => {
    setInputText(suggestion.text)
    setSuggestions([])
  }

  const editItem = (index: number) => {
    setInputText(items[index])
    setEditingIndex(index)
  }

  const deleteItem = (index: number) => {
    Alert.alert(
      'Удалить элемент?',
      'Вы уверены, что хотите удалить этот элемент?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            const newItems = items.filter((_, i) => i !== index)
            onItemsChange(newItems)
            if (editingIndex === index) {
              setEditingIndex(null)
              setInputText('')
            }
          },
        },
      ]
    )
  }

  const handleClose = () => {
    setInputText('')
    setEditingIndex(null)
    setSuggestions([])
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Закрыть</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={getPlaceholder()}
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={2}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                !inputText.trim() && styles.addButtonDisabled,
              ]}
              onPress={addItem}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name={editingIndex !== null ? 'checkmark' : 'add'}
                size={20}
                color={inputText.trim() ? Colors.white : Colors.gray}
              />
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.text}</Text>
                    <Text style={styles.suggestionCount}>
                      ({item.usageCount})
                    </Text>
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>

        <View style={styles.itemsList}>
          <Text style={styles.itemsListTitle}>Добавленные элементы:</Text>
          <FlatList
            data={items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.itemRow,
                  editingIndex === index && styles.itemRowEditing,
                ]}
              >
                <Text style={styles.itemText} numberOfLines={2}>
                  {item}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editItem(index)}
                  >
                    <Ionicons name="pencil" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(index)}
                  >
                    <Ionicons name="trash" size={16} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Пока нет добавленных элементов
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '600',
    color: Colors.text,
  },
  cancelButton: {
    fontSize: FontSizes.body,
    color: Colors.primary,
  },
  placeholder: {
    width: 60,
  },
  inputContainer: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    maxHeight: 80,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  suggestionsContainer: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  suggestionCount: {
    fontSize: FontSizes.small,
    color: Colors.gray,
  },
  itemsList: {
    flex: 1,
    padding: Spacing.md,
  },
  itemsListTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  itemRowEditing: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  itemText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  itemActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    padding: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FontSizes.body,
    color: Colors.gray,
    marginTop: Spacing.xl,
  },
})
