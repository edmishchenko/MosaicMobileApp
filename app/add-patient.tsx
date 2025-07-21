import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import FormInput from '../components/FormInput';
import PhoneInput from '../components/PhoneInput';
import DatePicker from '../components/DatePicker';
import PhotoPicker from '../components/PhotoPicker';
import { Patient } from '../utils/types/Patient';
import { FormQuestion } from '../utils/types/FormQuestion';
import { FormAnswer } from '../utils/types/FormAnswer';
import { savePatient } from '../utils/services/patientService';
import { getAllFormQuestions } from '../utils/services/formQuestionService';
import { saveFormAnswer } from '../utils/services/formAnswerService';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default function AddPatientPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Patient form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Form questions and answers
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  
  // Fetch form questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const formQuestions = await getAllFormQuestions();
        setQuestions(formQuestions);
      } catch (error) {
        console.error('Error fetching form questions:', error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    
    fetchQuestions().then(() => {});
  }, []);
  
  const handleDateSelect = (date: Date) => {
    setDateOfBirth(date);
    setShowDatePicker(false);
  };
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const savePatientData = async () => {
    try {
      setLoading(true);
      
      // Create a patient object
      const patientId = uuidv4();
      const now = new Date().toISOString();
      
      const newPatient: Patient = {
        id: patientId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString() : '',
        photo: photos.length > 0 ? photos[0] : '',
        notes: notes,
        sync: false,
        created_at: now,
        updated_at: now
      };
      
      // Save patient
      await savePatient(newPatient);
      
      // Save form answers
      for (const questionId in answers) {
        if (answers[questionId]) {
          const formAnswer: FormAnswer = {
            id: uuidv4(),
            patient_id: patientId,
            form_id: questions.find(q => q.id === questionId)?.form_id || '',
            question_id: questionId,
            answer: answers[questionId],
            sync: false,
            created_at: now,
            updated_at: now
          };
          
          await saveFormAnswer(formAnswer);
        }
      }
      
      // Navigate to the patient details page
      router.replace(`/patient/${patientId}`);
      
    } catch (error) {
      console.error('Error saving patient:', error);
      // Show an error message
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles(theme).container}>
        <View style={styles(theme).header}>
          <Text style={styles(theme).title}>{t('addPatient')}</Text>
          <TouchableOpacity
            style={styles(theme).saveButton}
            onPress={savePatientData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles(theme).saveButtonText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles(theme).scrollView}>
          <View style={styles(theme).formSection}>
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
          </View>
          
          <View style={styles(theme).formSection}>
            <Text style={styles(theme).sectionTitle}>{t('photo')}</Text>
            <PhotoPicker
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={1}
              showLabel={false}
            />
          </View>
          
          {loadingQuestions ? (
            <View style={styles(theme).loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles(theme).loadingText}>{t('loadingQuestions')}</Text>
            </View>
          ) : questions.length > 0 ? (
            <View style={styles(theme).formSection}>
              <Text style={styles(theme).sectionTitle}>{t('questions')}</Text>
              
              {questions.map(question => (
                <View key={question.id} style={styles(theme).questionContainer}>
                  <Text style={styles(theme).questionText}>{question.question}</Text>
                  <FormInput
                    label={t('answer')}
                    value={answers[question.id] || ''}
                    onChangeText={(text) => handleAnswerChange(question.id, text)}
                    placeholder={t('enterAnswer')}
                    multiline
                    numberOfLines={2}
                  />
                </View>
              ))}
            </View>
          ) : null}
          
          <View style={styles(theme).formSection}>
            <Text style={styles(theme).sectionTitle}>{t('additionalNotes')}</Text>
            <FormInput
              label={t('notes')}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('enterNotes')}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  formSection: {
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
  questionContainer: {
    marginBottom: theme.spacing.lg,
  },
  questionText: {
    fontSize: theme.fontSize.body,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
  },
});