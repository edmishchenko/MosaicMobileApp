import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Alert,
  FlatList
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Visit } from '../../utils/types/Visit';
import { Patient } from '../../utils/types/Patient';
import { getPatientById } from '../../utils/services/patientService';
import { getVisitsByPatientId } from '../../utils/services/visitService';
import { formatDate } from '../../components/DatePicker';

export default function VisitDetailsPage() {
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Visit and patient data
  const [visit, setVisit] = useState<Visit | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      router.replace('/');
      return;
    }
    
    const fetchVisitData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would have a getVisitById function
        // For now, we'll get all visits for all patients and find the one we need
        const allPatients = await getPatientById('');
        if (!allPatients) {
          Alert.alert(t('error'), t('visitNotFound'));
          router.replace('/');
          return;
        }
        
        let foundVisit: Visit | null = null;
        let foundPatient: Patient | null = null;
        
        // This is a simplified approach - in a real app, you'd have a direct way to get a visit by ID
        for (const patient of Array.isArray(allPatients) ? allPatients : [allPatients]) {
          const patientVisits = await getVisitsByPatientId(patient.id);
          const visit = patientVisits.find(v => v.id === id);
          if (visit) {
            foundVisit = visit;
            foundPatient = patient;
            break;
          }
        }
        
        if (!foundVisit || !foundPatient) {
          Alert.alert(t('error'), t('visitNotFound'));
          router.replace('/');
          return;
        }
        
        setVisit(foundVisit);
        setPatient(foundPatient);
        
      } catch (error) {
        console.error('Error fetching visit data:', error);
        Alert.alert(t('error'), t('failedToLoadVisit'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchVisitData();
  }, [id]);
  
  const navigateToPatient = () => {
    if (patient) {
      router.push(`/patient/${patient.id}`);
    }
  };
  
  if (loading) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (!visit || !patient) {
    return (
      <View style={styles(theme).errorContainer}>
        <Text style={styles(theme).errorText}>{t('visitNotFound')}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).header}>
        <Text style={styles(theme).title}>{t('visitDetails')}</Text>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={navigateToPatient}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.white} />
          <Text style={styles(theme).backButtonText}>{t('backToPatient')}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>{t('patientInfo')}</Text>
          <TouchableOpacity 
            style={styles(theme).patientCard}
            onPress={navigateToPatient}
          >
            <View style={styles(theme).patientInfo}>
              <Text style={styles(theme).patientName}>
                {patient.first_name} {patient.last_name}
              </Text>
              {patient.phone && (
                <Text style={styles(theme).patientDetail}>
                  <Ionicons name="call" size={16} color={theme.colors.textSecondary} />
                  {' '}{patient.phone}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>{t('visitDate')}</Text>
          <Text style={styles(theme).visitDate}>
            {formatDate(visit.date)}
          </Text>
        </View>
        
        {visit.services.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('services')}</Text>
            <View style={styles(theme).itemsList}>
              {visit.services.map((service, index) => (
                <View key={index} style={styles(theme).itemChip}>
                  <Text style={styles(theme).itemChipText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {visit.used_products.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('products')}</Text>
            <View style={styles(theme).itemsList}>
              {visit.used_products.map((product, index) => (
                <View key={index} style={styles(theme).itemChip}>
                  <Text style={styles(theme).itemChipText}>{product}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {visit.sold_products.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('soldProducts')}</Text>
            <View style={styles(theme).itemsList}>
              {visit.sold_products.map((product, index) => (
                <View key={index} style={styles(theme).itemChip}>
                  <Text style={styles(theme).itemChipText}>
                    {product.product_id} (x{product.quantity})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {visit.notes && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('notes')}</Text>
            <Text style={styles(theme).notes}>{visit.notes}</Text>
          </View>
        )}
        
        {visit.photos && visit.photos.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>{t('photos')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles(theme).photosContainer}
            >
              {visit.photos.map((photo, index) => (
                <Image 
                  key={index}
                  source={{ uri: photo }} 
                  style={styles(theme).photo} 
                />
              ))}
            </ScrollView>
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  patientDetail: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  visitDate: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  notes: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  photosContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: theme.spacing.md,
  },
});