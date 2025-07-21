import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// App version - in a real app, this would be imported from a config file or package.json
const APP_VERSION = '1.0.0';

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme,
    // isDarkMode,
    // toggleTheme
  } = useTheme();
  
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  
  const handleLanguageChange = (newLanguage: string) => {
    // setLanguage(newLanguage);
    setShowLanguageOptions(false);
  };
  
  const navigateBack = () => {
    router.back();
  };
  
  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).header}>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={navigateBack}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles(theme).title}>{t('settings')}</Text>
        <View style={{ width: 24 }} /> {/* Empty view for centering title */}
      </View>
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>{t('appearance')}</Text>
          
          <View style={styles(theme).settingItem}>
            <View style={styles(theme).settingInfo}>
              <Ionicons 
                // name={isDarkMode ? "moon" : "sunny"}
                size={24} 
                color={theme.colors.text} 
                style={styles(theme).settingIcon}
              />
              <Text style={styles(theme).settingText}>{t('darkMode')}</Text>
            </View>
            <Switch
              // value={isDarkMode}
              // onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </View>
        
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>{t('language')}</Text>
          
          <TouchableOpacity 
            style={styles(theme).settingItem}
            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
          >
            <View style={styles(theme).settingInfo}>
              <Ionicons 
                name="language" 
                size={24} 
                color={theme.colors.text} 
                style={styles(theme).settingIcon}
              />
              <Text style={styles(theme).settingText}>{t('language')}</Text>
            </View>
            <View style={styles(theme).languageValue}>
              <Text style={styles(theme).languageText}>
                {language === 'en' ? 'English' : 'Русский'}
              </Text>
              <Ionicons 
                name={showLanguageOptions ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.text} 
              />
            </View>
          </TouchableOpacity>
          
          {showLanguageOptions && (
            <View style={styles(theme).languageOptions}>
              <TouchableOpacity 
                style={[
                  styles(theme).languageOption,
                  language === 'en' && styles(theme).selectedLanguage
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text 
                  style={[
                    styles(theme).languageOptionText,
                    language === 'en' && styles(theme).selectedLanguageText
                  ]}
                >
                  English
                </Text>
                {language === 'en' && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles(theme).languageOption,
                  language === 'ru' && styles(theme).selectedLanguage
                ]}
                onPress={() => handleLanguageChange('ru')}
              >
                <Text 
                  style={[
                    styles(theme).languageOptionText,
                    language === 'ru' && styles(theme).selectedLanguageText
                  ]}
                >
                  Русский
                </Text>
                {language === 'ru' && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>{t('about')}</Text>
          
          <View style={styles(theme).settingItem}>
            <View style={styles(theme).settingInfo}>
              <Ionicons 
                name="information-circle" 
                size={24} 
                color={theme.colors.text} 
                style={styles(theme).settingIcon}
              />
              <Text style={styles(theme).settingText}>{t('version')}</Text>
            </View>
            <Text style={styles(theme).versionText}>{APP_VERSION}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.text,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: theme.spacing.md,
  },
  settingText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  versionText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  languageOptions: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedLanguage: {
    backgroundColor: theme.colors.backgroundTertiary,
  },
  languageOptionText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  selectedLanguageText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});