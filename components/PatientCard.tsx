import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { Patient } from '../utils/types/Patient'
import { Visit } from '../utils/types/Visit'
import { getVisitsByPatientId } from '../utils/services/visitService'
import {formatDate} from "./DatePicker";

interface PatientCardProps {
    patient: Patient
    onPress: () => void
}

export default function PatientCard({ patient, onPress }: PatientCardProps) {
    const { t } = useLanguage()
    const { theme } = useTheme()
    const [visits, setVisits] = useState<Visit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const patientVisits = await getVisitsByPatientId(patient.id)
                setVisits(patientVisits)
            } catch (error) {
                console.error('Error fetching visits:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchVisits().then(() => {})
    }, [patient.id])

    const getDisplayName = () => {
        const firstName = patient.first_name || ''
        const lastName = patient.last_name || ''

        if (firstName && lastName) {
            return `${firstName} ${lastName}`
        }

        if (firstName) return firstName
        if (lastName) return lastName
        if (patient.email) return patient.email
        if (patient.phone) return patient.phone

        return t('patient')
    }

    const getLastVisitDate = () => {
        if (visits.length === 0) return `No ${t('visits').toLowerCase()}`

        const sortedVisits = [...visits].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        return `${t('lastVisit')}: ${formatDate(sortedVisits[0].date)}`
    }

    const getContactInfo = () => {
        const contacts = []
        if (patient.phone) contacts.push(patient.phone)
        if (patient.email) contacts.push(patient.email)
        return contacts.join(' • ')
    }

    return (
        <TouchableOpacity style={styles(theme).container} onPress={onPress}>
            <View style={styles(theme).leftSection}>
                {patient.photo ? (
                    <Image source={{ uri: patient.photo }} style={styles(theme).avatar} />
                ) : (
                    <View style={styles(theme).avatarPlaceholder}>
                        <Ionicons name="person" size={24} color={theme.colors.gray} />
                    </View>
                )}
            </View>

            <View style={styles(theme).content}>
                <Text style={styles(theme).name} numberOfLines={1}>
                    {getDisplayName()}
                </Text>

                {getContactInfo() && (
                    <Text style={styles(theme).contact} numberOfLines={1}>
                        {getContactInfo()}
                    </Text>
                )}

                <Text style={styles(theme).lastVisit}>{getLastVisitDate()}</Text>

                <Text style={styles(theme).visitCount}>
                    {loading ? '...' : visits.length} {t('visits')}
                </Text>
            </View>

            <View style={styles(theme).rightSection}>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
            </View>
        </TouchableOpacity>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            marginHorizontal: theme.spacing.md,
            marginVertical: theme.spacing.xs,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        leftSection: {
            marginRight: theme.spacing.md,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
        },
        avatarPlaceholder: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
        },
        name: {
            fontSize: theme.fontSize.subtitle,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
        },
        contact: {
            fontSize: theme.fontSize.small,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xs,
        },
        lastVisit: {
            fontSize: theme.fontSize.small,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xs,
        },
        visitCount: {
            fontSize: theme.fontSize.small,
            color: theme.colors.primary,
            fontWeight: '500',
        },
        rightSection: {
            marginLeft: theme.spacing.sm,
        },
    })
