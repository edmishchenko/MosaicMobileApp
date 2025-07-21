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
import { Patient } from '../../utils/types/Patient';
import { Visit } from '../../utils/types/Visit';
import { FormQuestion } from '../../utils/types/FormQuestion';
import { FormAnswer } from '../../utils/types/FormAnswer';
import { getPatientById, savePatient } from '../../utils/services/patientService';
import { getVisitsByPatientId } from '../../utils/services/visitService';
import { getAllFormQuestions } from '../../utils/services/formQuestionService';
import { formatDate } from '../../components/DatePicker';
import FormInput from '../../components/FormInput';
import PhoneInput from '../../components/PhoneInput';
import DatePicker from '../../components/DatePicker';
import PhotoPicker from '../../components/PhotoPicker';

export default function PatientDetailsPage() {
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Patient data
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, FormAnswer>>({});
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (!id) {
      router.replace('/');
      return;
    }
    
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient
        const patientData = await getPatientById(id as string);
        if (!patientData) {
          Alert.alert(t('error'), t('patientNotFound'));
          router.replace('/');
          return;
        }
        
        setPatient(patientData);
        
        // Set form values for edit mode
        setFirstName(patientData.first_name);
        setLastName(patientData.last_name);
        setEmail(patientData.email);
        setPhone(patientData.phone);
        setDateOfBirth(patientData.date_of_birth ? new Date(patientData.date_of_birth) : null);
        setPhotos(patientData.photo ? [patientData.photo] : []);
        setNotes(patientData.notes);
        
        // Fetch visits
        const patientVisits = await getVisitsByPatientId(id as string);
        setVisits(patientVisits);
        
        // Fetch questions and answers
        // This is a simplified approach - in a real app, you'd fetch answers for this patient
        const formQuestions = await getAllFormQuestions();
        setQuestions(formQuestions);
        
        // TODO: Fetch form answers for this patient
        // const formAnswers = await getFormAnswersByPatientId(id as string);
        // const answersMap: Record<string, FormAnswer> = {};
        // formAnswers.forEach(answer => {
        //   answersMap[answer.question_id] = answer;
        // });
        // setAnswers(answersMap);
        
      } catch (error) {
        console.error('Error fetching patient data:', error);
        Alert.alert(t('error'), t('failedToLoadPatient'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id]);
  
  const handleDateSelect = (date: Date) => {
    setDateOfBirth(date);
    setShowDatePicker(false);
  };
  
  const savePatientChanges = async () => {
    if (!patient) return;
    
    try {
      setSaving(true);
      
      const updatedPatient: Patient = {
        ...patient,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString() : '',
        photo: photos.length > 0 ? photos[0] : '',
        notes: notes,
        sync: false,
        updated_at: new Date().toISOString()
      };
      
      await savePatient(updatedPatient);
      setPatient(updatedPatient);
      setEditMode(false);
      
    } catch (error) {
      console.error('Error saving patient:', error);
      Alert.alert(t('error'), t('failedToSavePatient'));
    } finally {
      setSaving(false);
    }
  };
  
  const navigateToAddVisit = () => {
    if (patient) {
      router.push(`/add-visit/${patient.id}`);
    }
  };
  
  const navigateToVisitDetails = (visitId: string) => {
    router.push(`/visit/${visitId}`);
  };
  
  const renderVisitItem = ({ item }: { item: Visit }) => (
    <TouchableOpacity 
      style={styles(theme).visitCard}
      onPress={() => navigateToVisitDetails(item.id)}
    >
      <View style={styles(theme).visitHeader}>
        <Text style={styles(theme).visitDate}>{formatDate(item.date)}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
      </View>
      
      <View style={styles(theme).visitDetails}>
        {item.services.length > 0 && (
          <Text style={styles(theme).visitInfo}>
            {t('services')}: {item.services.length}
          </Text>
        )}
        
        {item.used_products.length > 0 && (
          <Text style={styles(theme).visitInfo}>
            {t('products')}: {item.used_products.length}
          </Text>
        )}
        
        {item.sold_products.length > 0 && (
          <Text style={styles(theme).visitInfo}>
            {t('soldProducts')}: {item.sold_products.length}
          </Text>
        )}
        
        {item.notes && (
          <Text style={styles(theme).visitNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
  
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
    <View style={styles(theme).container}>
      <View style={styles(theme).header}>
        <Text style={styles(theme).title}>
          {editMode ? t('editPatient') : `${patient.first_name} ${patient.last_name}`}
        </Text>
        
        {editMode ? (
          <View style={styles(theme).headerButtons}>
            <TouchableOpacity
              style={styles(theme).cancelButton}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles(theme).cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles(theme).saveButton}
              onPress={savePatientChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Text style={styles(theme).saveButtonText}>{t('save')}</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles(theme).editButton}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.white} />
            <Text style={styles(theme).editButtonText}>{t('edit')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles(theme).scrollView}>
        {editMode ? (
          // Edit mode - show form fields
          <>
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionTitle}>{t('patientInfo')}</Text>
              
              <FormInput
                label={t('firstName')}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t('enterFirstName')}
              />
              
              <FormInput
                label={t('lastName')}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t('enterLastName')}
              />
              
              <FormInput
                label={t('email')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('enterEmail')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <PhoneInput
                label={t('phone')}
                value={phone}
                onChangeText={setPhone}
              />
              
              <View style={styles(theme).datePickerContainer}>
                <Text style={styles(theme).label}>{t('dateOfBirth')}</Text>
                <TouchableOpacity
                  style={styles(theme).datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles(theme).datePickerText}>
                    {dateOfBirth 
                      ? dateOfBirth.toLocaleDateString() 
                      : t('selectDateOfBirth')}
                  </Text>
                  <Ionicons name="calendar" size={20} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <DatePicker
                  value={dateOfBirth || new Date()}
                  onDateChange={handleDateSelect}
                  label={t('dateOfBirth')}
                />
              )}
              
              <Text style={styles(theme).label}>{t('photo')}</Text>
              <PhotoPicker
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={1}
                showLabel={false}
              />
              
              <FormInput
                label={t('notes')}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('enterNotes')}
                multiline
                numberOfLines={4}
              />
            </View>
          </>
        ) : (
          // View mode - show patient details
          <>
            <View style={styles(theme).section}>
              <View style={styles(theme).profileHeader}>
                {patient.photo ? (
                  <Image 
                    source={{ uri: patient.photo }} 
                    style={styles(theme).profilePhoto} 
                  />
                ) : (
                  <View style={styles(theme).profilePhotoPlaceholder}>
                    <Ionicons name="person" size={40} color={theme.colors.gray} />
                  </View>
                )}
                
                <View style={styles(theme).profileInfo}>
                  <Text style={styles(theme).profileName}>
                    {patient.first_name} {patient.last_name}
                  </Text>
                  
                  {patient.email && (
                    <Text style={styles(theme).profileDetail}>
                      <Ionicons name="mail" size={16} color={theme.colors.textSecondary} />
                      {' '}{patient.email}
                    </Text>
                  )}
                  
                  {patient.phone && (
                    <Text style={styles(theme).profileDetail}>
                      <Ionicons name="call" size={16} color={theme.colors.textSecondary} />
                      {' '}{patient.phone}
                    </Text>
                  )}
                  
                  {patient.date_of_birth && (
                    <Text style={styles(theme).profileDetail}>
                      <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                      {' '}{formatDate(patient.date_of_birth)}
                    </Text>
                  )}
                </View>
              </View>
              
              {patient.notes && (
                <View style={styles(theme).notesContainer}>
                  <Text style={styles(theme).sectionTitle}>{t('notes')}</Text>
                  <Text style={styles(theme).notes}>{patient.notes}</Text>
                </View>
              )}
            </View>
            
            {/* Questions and Answers section would go here */}
            
            <View style={styles(theme).section}>
              <View style={styles(theme).sectionHeader}>
                <Text style={styles(theme).sectionTitle}>{t('visitHistory')}</Text>
                <TouchableOpacity
                  style={styles(theme).addVisitButton}
                  onPress={navigateToAddVisit}
                >
                  <Ionicons name="add" size={20} color={theme.colors.white} />
                  <Text style={styles(theme).addVisitButtonText}>{t('addVisit')}</Text>
                </TouchableOpacity>
              </View>
              
              {visits.length === 0 ? (
                <View style={styles(theme).emptyState}>
                  <Text style={styles(theme).emptyStateText}>{t('noVisits')}</Text>
                </View>
              ) : (
                <FlatList
                  data={visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                  renderItem={renderVisitItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          </>
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
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  editButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
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
  profileHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: theme.spacing.lg,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  profileDetail: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesContainer: {
    marginTop: theme.spacing.md,
  },
  notes: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  addVisitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  addVisitButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  visitCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  visitDate: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  visitDetails: {
    padding: theme.spacing.md,
  },
  visitInfo: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  visitNotes: {
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  datePickerContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.body,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
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
});