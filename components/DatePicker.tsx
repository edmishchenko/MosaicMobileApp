import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

interface DatePickerProps {
  value: Date
  onDateChange: (date: Date) => void
  label?: string
  minimumDate?: Date
  maximumDate?: Date
}

export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export default function DatePicker({
  value,
  onDateChange,
  label,
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(value)

  const dateLabel = label || t('selectDate')

    const handleDateSelect = () => {
    onDateChange(tempDate)
    setShowPicker(false)
  }

  const generateCalendarDays = () => {
    const year = tempDate.getFullYear()
    const month = tempDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(day)
    }

    return days
  }

  const changeMonth = (increment: number) => {
    const newDate = new Date(tempDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setTempDate(newDate)
  }

  const selectDay = (day: number) => {
    const newDate = new Date(tempDate)
    newDate.setDate(day)
    setTempDate(newDate)
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(tempDate.getFullYear(), tempDate.getMonth(), day)

    if (minimumDate && date < minimumDate) return true
    return !!(maximumDate && date > maximumDate);

  }

  const monthNames = [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ]

  const weekDays = [
    t('sunday'),
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
  ]

  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).label}>{dateLabel}</Text>

      <TouchableOpacity
        style={styles(theme).dateInput}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles(theme).dateText}>{formatDate(value)}</Text>
        <Ionicons name="calendar" size={20} color={theme.colors.gray} />
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade">
        <View style={styles(theme).modalOverlay}>
          <View style={styles(theme).modalContent}>
            <View style={styles(theme).modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles(theme).cancelButton}>{t('cancel')}</Text>
              </TouchableOpacity>
              <Text style={styles(theme).modalTitle}>{t('selectDate')}</Text>
              <TouchableOpacity onPress={handleDateSelect}>
                <Text style={styles(theme).confirmButton}>{t('done')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles(theme).calendarContainer}>
              <View style={styles(theme).monthHeader}>
                <TouchableOpacity
                  style={styles(theme).monthButton}
                  onPress={() => changeMonth(-1)}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>

                <Text style={styles(theme).monthText}>
                  {monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}
                </Text>

                <TouchableOpacity
                  style={styles(theme).monthButton}
                  onPress={() => changeMonth(1)}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles(theme).weekDaysRow}>
                {weekDays.map((day) => (
                  <Text key={day} style={styles(theme).weekDayText}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles(theme).daysGrid}>
                {generateCalendarDays().map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles(theme).dayCell,
                      day === tempDate.getDate() && styles(theme).selectedDay, // @ts-ignore
                      day && isDateDisabled(day) && styles(theme).disabledDay,
                    ]}
                    onPress={() =>
                      day && !isDateDisabled(day) && selectDay(day)
                    }
                    disabled={!day || isDateDisabled(day)}
                  >
                    {day && (
                      <Text
                        style={[
                          styles(theme).dayText,
                          day === tempDate.getDate() &&
                            styles(theme).selectedDayText,
                          isDateDisabled(day) && styles(theme).disabledDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

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
    dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      minHeight: 44,
    },
    dateText: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: theme.spacing.md,
      maxWidth: 350,
      width: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.fontSize.subtitle,
      fontWeight: '600',
      color: theme.colors.text,
    },
    cancelButton: {
      fontSize: theme.fontSize.body,
      color: theme.colors.gray,
    },
    confirmButton: {
      fontSize: theme.fontSize.body,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    calendarContainer: {
      padding: theme.spacing.md,
    },
    monthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    monthButton: {
      padding: theme.spacing.sm,
    },
    monthText: {
      fontSize: theme.fontSize.subtitle,
      fontWeight: '600',
      color: theme.colors.text,
    },
    weekDaysRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.sm,
    },
    weekDayText: {
      fontSize: theme.fontSize.small,
      color: theme.colors.gray,
      fontWeight: '500',
      width: 40,
      textAlign: 'center',
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    selectedDay: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
    },
    disabledDay: {
      opacity: 0.3,
    },
    dayText: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
    },
    selectedDayText: {
      color: theme.colors.white,
      fontWeight: '600',
    },
    disabledDayText: {
      color: theme.colors.gray,
    },
  })
