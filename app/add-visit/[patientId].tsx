import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Visit, SoldProduct } from '../../utils/types/Visit';
import { Patient } from '../../utils/types/Patient';
import { getPatientById } from '../../utils/services/patientService';
import { saveVisit } from '../../utils/services/visitService';
import DatePicker from '../../components/DatePicker';
import PhotoPicker from '../../components/PhotoPicker';
import FormInput from '../../components/FormInput';
import { v4 as uuidv4 } from 'uuid';

// Sample data for suggestions
const SAMPLE_PROCEDURES = [
  { text: 'Facial Cleansing', usageCount: 10 },
  { text: 'Deep Tissue Massage', usageCount: 8 },
  { text: 'Manicure', usageCount: 7 },
  { text: 'Pedicure', usageCount: 6 },
  { text: 'Hair Styling', usageCount: 5 },
];

const SAMPLE_PRODUCTS = [
  { text: 'Moisturizer', usageCount: 10 },
  { text: 'Cleanser', usageCount: 8 },
  { text: 'Shampoo', usageCount: 7 },
  { text: 'Conditioner', usageCount: 6 },
  { text: 'Face Mask', usageCount: 5 },
];

interface SuggestionItem {
  text: string;
  usageCount: number;
}

// Mock functions for suggestions (in a real app, these would be connected to a database)
const loadSuggestions = async () => {
  return {
    procedures: SAMPLE_PROCEDURES,
    products: SAMPLE_PRODUCTS,
    soldProducts: SAMPLE_PRODUCTS,
  };
};

const addSuggestion = async (type: string, text: string) => {
  // In a real app, this would save to a database
  console.log(`Adding ${text} to ${type}`);
};

type ItemType = 'procedure' | 'product' | 'soldProduct';

interface ItemModalProps {
  type: ItemType;
  items: string[];
  onItemsChange: (items: string[]) => void;
  onClose: () => void;
}

function ItemSelectionModal({ type, items, onItemsChange, onClose }: ItemModalProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<SuggestionItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getTitle = () => {
    switch (type) {
      case 'procedure':
        return t('procedures');
      case 'product':
        return t('products');
      case 'soldProduct':
        return t('soldProducts');
      default:
        return t('items');
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'procedure':
        return t('enterProcedureName');
      case 'product':
        return t('enterProductName');
      case 'soldProduct':
        return t('enterSoldProductName');
      default:
        return t('enterName');
    }
  };

  useEffect(() => {
    loadStoredSuggestions();
  }, [type]);

  useEffect(() => {
    if (inputText.length > 0) {
      const filtered = allSuggestions.filter((item) =>
        item.text.toLowerCase().includes(inputText.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputText, allSuggestions]);

  const loadStoredSuggestions = async () => {
    try {
      const stored = await loadSuggestions();
      const typeKey = type === 'soldProduct' ? 'soldProducts' : `${type}s`;

      // Combine stored suggestions with default ones
      const defaultSuggestions =
        type === 'procedure' ? SAMPLE_PROCEDURES : SAMPLE_PRODUCTS;
      // @ts-ignore
      const combined = [...defaultSuggestions, ...(stored[typeKey] || [])];

      // Remove duplicates and sort by usage count
      const unique = combined.reduce((acc, item) => {
        const existing = acc.find(
          (a: { text: string; }) => a.text.toLowerCase() === item.text.toLowerCase()
        );
        if (existing) {
          existing.usageCount += item.usageCount;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as SuggestionItem[]);

      unique.sort((a: { usageCount: number; }, b: { usageCount: number; }) => b.usageCount - a.usageCount);
      setAllSuggestions(unique);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setAllSuggestions(
        type === 'procedure' ? SAMPLE_PROCEDURES : SAMPLE_PRODUCTS
      );
    }
  };

  const addItem = async () => {
    if (!inputText.trim()) return;

    if (editingIndex !== null) {
      // Editing existing item
      const newItems = [...items];
      newItems[editingIndex] = inputText.trim();
      onItemsChange(newItems);
      setEditingIndex(null);
    } else {
      // Adding new item
      onItemsChange([...items, inputText.trim()]);
    }

    // Save to suggestions
    await addSuggestion(
      type === 'soldProduct' ? 'soldProducts' : `${type}s`,
      inputText.trim()
    );

    setInputText('');
    loadStoredSuggestions(); // Refresh suggestions
  };

  const selectSuggestion = (suggestion: SuggestionItem) => {
    setInputText(suggestion.text);
    setSuggestions([]);
  };

  const editItem = (index: number) => {
    setInputText(items[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: number) => {
    Alert.alert(
      t('deleteItem'),
      t('deleteItemConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            const newItems = items.filter((_, i) => i !== index);
            onItemsChange(newItems);
            if (editingIndex === index) {
              setEditingIndex(null);
              setInputText('');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles(theme).modalContainer}>
        <View style={styles(theme).modalHeader}>
          <Text style={styles(theme).modalTitle}>{getTitle()}</Text>
          <TouchableOpacity onPress={onClose} style={styles(theme).closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles(theme).inputContainer}>
          <TextInput
            style={styles(theme).input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={getPlaceholder()}
            placeholderTextColor={theme.colors.gray}
          />
          <TouchableOpacity
            style={styles(theme).addButton}
            onPress={addItem}
            disabled={!inputText.trim()}
          >
            <Text style={styles(theme).addButtonText}>
              {editingIndex !== null ? t('update') : t('add')}
            </Text>
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles(theme).suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles(theme).suggestionItem}
                onPress={() => selectSuggestion(suggestion)}
              >
                <Text style={styles(theme).suggestionText}>{suggestion.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles(theme).itemContainer}>
              <Text style={styles(theme).itemText}>{item}</Text>
              <View style={styles(theme).itemActions}>
                <TouchableOpacity
                  style={styles(theme).itemAction}
                  onPress={() => editItem(index)}
                >
                  <Ionicons name="pencil" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles(theme).itemAction}
                  onPress={() => deleteItem(index)}
                >
                  <Ionicons name="trash" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles(theme).emptyContainer}>
              <Text style={styles(theme).emptyText}>{t('noItemsAdded')}</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

export default function AddVisitPage() {
  const { patientId } = useLocalSearchParams();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Patient data
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Visit data
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [soldProducts, setSoldProducts] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Modal state
  const [modalType, setModalType] = useState<ItemType | null>(null);
  
  useEffect(() => {
    if (!patientId) {
      router.replace('/');
      return;
    }
    
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const patientData = await getPatientById(patientId as string);
        if (!patientData) {
          Alert.alert(t('error'), t('patientNotFound'));
          router.replace('/');
          return;
        }
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching patient:', error);
        Alert.alert(t('error'), t('failedToLoadPatient'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [patientId]);
  
  const handleDateSelect = (date: Date) => {
    setVisitDate(date);
    setShowDatePicker(false);
  };
  
  const openModal = (type: ItemType) => {
    setModalType(type);
  };
  
  const closeModal = () => {
    setModalType(null);
  };
  
  const saveVisitData = async () => {
    if (!patient) return;
    
    try {
      setSaving(true);
      
      // Create visit object
      const visitId = uuidv4();
      const now = new Date().toISOString();
      
      // Convert sold products to the required format
      const formattedSoldProducts: SoldProduct[] = soldProducts.map(product => ({
        product_id: uuidv4(), // In a real app, this would be a real product ID
        quantity: 1 // Default quantity
      }));
      
      const newVisit: Visit = {
        id: visitId,
        patient_id: patient.id,
        date: visitDate.toISOString(),
        notes: notes,
        services: services,
        used_products: products,
        sold_products: formattedSoldProducts,
        photos: photos,
        sync: false,
        created_at: now,
        updated_at: now
      };
      
      await saveVisit(newVisit);
      
      // Navigate to patient details page
      router.replace(`/patient/${patient.id}`);
      
    } catch (error) {
      console.error('Error saving visit:', error);
      Alert.alert(t('error'), t('failedToSaveVisit'));
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (!patient) {
    return (
      <View style={styles(theme).errorContainer}>
        <Text style={styles(theme).errorText}>{t('patientNotFound')}</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles(theme).container}>
        <View style={styles(theme).header}>
          <Text style={styles(theme).title}>{t('addVisit')}</Text>
          <TouchableOpacity
            style={styles(theme).saveButton}
            onPress={saveVisitData}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles(theme).saveButtonText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles(theme).scrollView}>
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('patientInfo')}</Text>
            <Text style={styles(theme).patientName}>
              {patient.first_name} {patient.last_name}
            </Text>
          </View>
          
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('visitDate')}</Text>
            <TouchableOpacity
              style={styles(theme).datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles(theme).datePickerText}>
                {visitDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar" size={20} color={theme.colors.gray} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DatePicker
                value={visitDate}
                onDateChange={handleDateSelect}
                label={t('visitDate')}
              />
            )}
          </View>
          
          <View style={styles(theme).section}>
            <View style={styles(theme).sectionHeader}>
              <Text style={styles(theme).sectionTitle}>{t('services')}</Text>
              <TouchableOpacity
                style={styles(theme).addItemButton}
                onPress={() => openModal('procedure')}
              >
                <Ionicons name="add" size={20} color={theme.colors.white} />
                <Text style={styles(theme).addItemButtonText}>{t('addService')}</Text>
              </TouchableOpacity>
            </View>
            
            {services.length === 0 ? (
              <Text style={styles(theme).emptyText}>{t('noServicesAdded')}</Text>
            ) : (
              <View style={styles(theme).itemsList}>
                {services.map((service, index) => (
                  <View key={index} style={styles(theme).itemChip}>
                    <Text style={styles(theme).itemChipText}>{service}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles(theme).section}>
            <View style={styles(theme).sectionHeader}>
              <Text style={styles(theme).sectionTitle}>{t('products')}</Text>
              <TouchableOpacity
                style={styles(theme).addItemButton}
                onPress={() => openModal('product')}
              >
                <Ionicons name="add" size={20} color={theme.colors.white} />
                <Text style={styles(theme).addItemButtonText}>{t('addProduct')}</Text>
              </TouchableOpacity>
            </View>
            
            {products.length === 0 ? (
              <Text style={styles(theme).emptyText}>{t('noProductsAdded')}</Text>
            ) : (
              <View style={styles(theme).itemsList}>
                {products.map((product, index) => (
                  <View key={index} style={styles(theme).itemChip}>
                    <Text style={styles(theme).itemChipText}>{product}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles(theme).section}>
            <View style={styles(theme).sectionHeader}>
              <Text style={styles(theme).sectionTitle}>{t('soldProducts')}</Text>
              <TouchableOpacity
                style={styles(theme).addItemButton}
                onPress={() => openModal('soldProduct')}
              >
                <Ionicons name="add" size={20} color={theme.colors.white} />
                <Text style={styles(theme).addItemButtonText}>{t('addSoldProduct')}</Text>
              </TouchableOpacity>
            </View>
            
            {soldProducts.length === 0 ? (
              <Text style={styles(theme).emptyText}>{t('noSoldProductsAdded')}</Text>
            ) : (
              <View style={styles(theme).itemsList}>
                {soldProducts.map((product, index) => (
                  <View key={index} style={styles(theme).itemChip}>
                    <Text style={styles(theme).itemChipText}>{product}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('notes')}</Text>
            <FormInput
              label=""
              value={notes}
              onChangeText={setNotes}
              placeholder={t('enterVisitNotes')}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('photos')}</Text>
            <PhotoPicker
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={5}
              showLabel={false}
            />
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
        
        {modalType && (
          <ItemSelectionModal
            type={modalType}
            items={
              modalType === 'procedure'
                ? services
                : modalType === 'product'
                ? products
                : soldProducts
            }
            onItemsChange={
              modalType === 'procedure'
                ? setServices
                : modalType === 'product'
                ? setProducts
                : setSoldProducts
            }
            onClose={closeModal}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.danger,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  patientName: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  datePickerText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  addItemButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  itemChip: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  itemChipText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  suggestionItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
  },
  itemAction: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});