import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../../components/SeacrhBar';
import PatientCard from '../../components/PatientCard';
import DatePicker from '../../components/DatePicker';
import { Patient } from '../../utils/types/Patient';
import { SearchFilters } from '../../utils/types/SeacrhFilter';
import { getAllPatients } from '../../utils/services/patientService';
import { getVisitsByPatientId } from '../../utils/services/visitService';

export default function HomePage() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const allPatients = await getAllPatients();
                setPatients(allPatients);
                setFilteredPatients(allPatients);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients().then(() => {});
    }, []);

    useEffect(() => {
        filterPatients().then(() => {});
    }, [filters, patients]);

    const filterPatients = async () => {
        let filtered = [...patients];

        // Filter by name
        if (filters.name) {
            filtered = filtered.filter(
                (patient) =>
                    patient.first_name.toLowerCase().includes(filters.name?.toLowerCase() || '') ||
                    patient.last_name.toLowerCase().includes(filters.name?.toLowerCase() || '')
            );
        }

        // Filter by lastName
        if (filters.lastName) {
            filtered = filtered.filter((patient) =>
                patient.last_name.toLowerCase().includes(filters.lastName?.toLowerCase() || '')
            );
        }

        // Filter by email
        if (filters.email) {
            filtered = filtered.filter((patient) =>
                patient.email.toLowerCase().includes(filters.email?.toLowerCase() || '')
            );
        }

        // Filter by phone
        if (filters.phone) {
            filtered = filtered.filter((patient) =>
                patient.phone.includes(filters.phone || '')
            );
        }

        // Filter by visit date
        if (filters.visitDate) {
            const filteredByVisitDate = [];

            for (const patient of filtered) {
                const visits = await getVisitsByPatientId(patient.id);
                const hasVisitOnDate = visits.some(visit => {
                    const visitDate = new Date(visit.date);
                    const filterDate = new Date(filters.visitDate || '');
                    return (
                        visitDate.getDate() === filterDate.getDate() &&
                        visitDate.getMonth() === filterDate.getMonth() &&
                        visitDate.getFullYear() === filterDate.getFullYear()
                    );
                });

                if (hasVisitOnDate) {
                    filteredByVisitDate.push(patient);
                }
            }

            filtered = filteredByVisitDate;
        }

        setFilteredPatients(filtered);
    };

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0];
        setFilters({ ...filters, visitDate: formattedDate });
        setShowDatePicker(false);
    };

    const navigateToPatientDetails = (patientId: string) => {
        router.push(`/patient/${patientId}`);
    };

    const navigateToAddPatient = () => {
        router.push('/add-patient');
    };

    const renderPatientCard = ({ item }: { item: Patient }) => (
        <PatientCard
            patient={item}
            onPress={() => navigateToPatientDetails(item.id)}
        />
    );

    if (loading) {
        return (
            <View style={styles(theme).loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles(theme).container}>
            <SearchBar
                onFiltersChange={handleFiltersChange}
                onAddPress={navigateToAddPatient}
                placeholder={t('searchPatients')}
                showDateFilter={true}
            />

            {showDatePicker && (
                <DatePicker
                    value={selectedDate}
                    onDateChange={handleDateChange}
                    label={t('filterByVisitDate')}
                />
            )}

            {filteredPatients.length === 0 ? (
                <View style={styles(theme).emptyContainer}>
                    <Text style={styles(theme).emptyText}>{t('noPatients')}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPatients}
                    renderItem={renderPatientCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles(theme).listContainer}
                />
            )}
        </View>
    );
}

const styles = (theme: any) =>
    StyleSheet.create({
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
        listContainer: {
            paddingVertical: theme.spacing.md,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyText: {
            fontSize: theme.fontSize.subtitle,
            color: theme.colors.textSecondary,
        },
    });