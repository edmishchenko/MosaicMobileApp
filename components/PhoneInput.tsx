import React, { forwardRef, useState } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatPhoneNumber, getUnformattedPhone } from '../utils/phoneUtils'

interface PhoneInputProps
    extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    label: string
    value: string
    onChangeText: (text: string) => void
    error?: string
    required?: boolean
}

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
    ({ label, value, onChangeText, error, required, style, ...props }, ref) => {
        const { theme } = useTheme()
        const { t } = useLanguage()
        const [displayValue, setDisplayValue] = useState(
            value ? formatPhoneNumber(value) : ''
        )

        const handleChangeText = (text: string) => {
            const formatted = formatPhoneNumber(text)
            setDisplayValue(formatted)

            // Pass back the unformatted version for storage
            const unformatted = getUnformattedPhone(text)
            onChangeText(
                unformatted.startsWith('7') ? '+' + unformatted : unformatted
            )
        }

        React.useEffect(() => {
            if (value !== getUnformattedPhone(displayValue)) {
                setDisplayValue(value ? formatPhoneNumber(value) : '')
            }
        }, [value])

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
                        error && styles(theme).inputError,
                        style,
                    ]}
                    value={displayValue}
                    onChangeText={handleChangeText}
                    keyboardType="phone-pad"
                    placeholder="+7 (XXX) XXX-XX-XX"
                    placeholderTextColor={theme.colors.gray}
                    maxLength={18} // +7 (XXX) XXX-XX-XX
                    {...props}
                />

                {error && <Text style={styles(theme).errorText}>{error}</Text>}
            </View>
        )
    }
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput

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
        inputError: {
            borderColor: theme.colors.danger,
        },
        errorText: {
            fontSize: theme.fontSize.small,
            color: theme.colors.danger,
            marginTop: theme.spacing.xs,
        },
    })
