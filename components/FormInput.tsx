import React, { forwardRef } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

interface FormInputProps extends TextInputProps {
  label: string
  error?: string
  required?: boolean
  multiline?: boolean
  numberOfLines?: number
}

const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    { label, error, required, multiline, numberOfLines = 1, style, ...props },
    ref
  ) => {
    const { theme } = useTheme()
    const { t } = useLanguage()
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).label}>
          {label}
          {required && (
            <Text style={styles(theme).required}> {t('required')}</Text>
          )}
        </Text>

        <TextInput
          ref={ref}
          style={[
            styles(theme).input,
            multiline && styles(theme).multilineInput,
            multiline && { height: numberOfLines * 20 + 20 },
            error && styles(theme).inputError,
            style,
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholderTextColor={theme.colors.gray}
          {...props}
        />

        {error && <Text style={styles(theme).errorText}>{error}</Text>}
      </View>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSize.body,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    required: {
      color: theme.colors.danger,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      minHeight: 44,
    },
    multilineInput: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    errorText: {
      fontSize: theme.fontSize.small,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  })
