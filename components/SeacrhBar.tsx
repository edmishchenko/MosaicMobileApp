import React, { useState } from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SearchFilters } from '../utils/types/SeacrhFilter'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

interface SearchBarProps {
    onFiltersChange: (filters: SearchFilters) => void
    onAddPress: () => void
    placeholder?: string
    showDateFilter?: boolean
}

export default function SearchBar({
                                      onFiltersChange,
                                      onAddPress,
                                      placeholder,
                                      showDateFilter = true,
                                  }: SearchBarProps) {
    const { t } = useLanguage()
    const { theme } = useTheme()
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<SearchFilters>({})
    const [searchText, setSearchText] = useState('')

    const searchPlaceholder = placeholder || t('searchPatients')

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFiltersChange(newFilters)
    }

    const clearFilters = () => {
        setFilters({})
        setSearchText('')
        onFiltersChange({})
    }

    const hasActiveFilters = Object.values(filters).some(
        (value) => value && value.length > 0
    )

    return (
        <View style={styles(theme).container}>
            <View style={styles(theme).searchRow}>
                <View style={styles(theme).searchInputContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={theme.colors.gray}
                        style={styles(theme).searchIcon}
                    />
                    <TextInput
                        style={styles(theme).searchInput}
                        placeholder={searchPlaceholder}
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text)
                            handleFilterChange('name', text)
                        }}
                        placeholderTextColor={theme.colors.gray}
                    />
                    {hasActiveFilters && (
                        <TouchableOpacity
                            onPress={clearFilters}
                            style={styles(theme).clearButton}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={theme.colors.gray}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles(theme).filterButton,
                        hasActiveFilters && styles(theme).filterButtonActive,
                    ]}
                    onPress={() => setShowFilters(true)}
                >
                    <Ionicons
                        name="filter"
                        size={20}
                        color={hasActiveFilters ? theme.colors.white : theme.colors.primary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles(theme).settingsButton}
                    onPress={() => router.push('/settings')}
                >
                    <Ionicons
                        name="settings-outline"
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles(theme).addButton} onPress={onAddPress}>
                    <Ionicons name="add" size={24} color={theme.colors.white} />
                </TouchableOpacity>
            </View>

            <Modal
                visible={showFilters}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles(theme).modalContainer}>
                    <View style={styles(theme).modalHeader}>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Text style={styles(theme).cancelButton}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        <Text style={styles(theme).modalTitle}>{t('filters')}</Text>
                        <TouchableOpacity onPress={clearFilters}>
                            <Text style={styles(theme).clearAllButton}>
                                {t('clearFilters')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles(theme).modalContent}>
                        <View style={styles(theme).filterGroup}>
                            <Text style={styles(theme).filterLabel}>{t('firstName')}</Text>
                            <TextInput
                                style={styles(theme).filterInput}
                                value={filters.name || ''}
                                onChangeText={(text) => handleFilterChange('name', text)}
                                placeholder={t('searchByName')}
                                placeholderTextColor={theme.colors.gray}
                            />
                        </View>

                        <View style={styles(theme).filterGroup}>
                            <Text style={styles(theme).filterLabel}>{t('lastName')}</Text>
                            <TextInput
                                style={styles(theme).filterInput}
                                value={filters.lastName || ''}
                                onChangeText={(text) => handleFilterChange('lastName', text)}
                                placeholder={t('searchBySurname')}
                                placeholderTextColor={theme.colors.gray}
                            />
                        </View>

                        <View style={styles(theme).filterGroup}>
                            <Text style={styles(theme).filterLabel}>{t('email')}</Text>
                            <TextInput
                                style={styles(theme).filterInput}
                                value={filters.email || ''}
                                onChangeText={(text) => handleFilterChange('email', text)}
                                placeholder={t('searchByEmail')}
                                placeholderTextColor={theme.colors.gray}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles(theme).filterGroup}>
                            <Text style={styles(theme).filterLabel}>{t('phone')}</Text>
                            <TextInput
                                style={styles(theme).filterInput}
                                value={filters.phone || ''}
                                onChangeText={(text) => handleFilterChange('phone', text)}
                                placeholder={t('searchByPhone')}
                                placeholderTextColor={theme.colors.gray}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {showDateFilter && (
                            <View style={styles(theme).filterGroup}>
                                <Text style={styles(theme).filterLabel}>
                                    {t('filterByVisitDate')}
                                </Text>
                                <TextInput
                                    style={styles(theme).filterInput}
                                    value={filters.visitDate || ''}
                                    onChangeText={(text) => handleFilterChange('visitDate', text)}
                                    placeholder="DD.MM.YYYY"
                                    placeholderTextColor={theme.colors.gray}
                                />
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles(theme).modalFooter}>
                        <TouchableOpacity
                            style={styles(theme).applyButton}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles(theme).applyButtonText}>
                                {t('applyFilters')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        searchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        searchInputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 12,
            paddingHorizontal: theme.spacing.md,
            height: 44,
        },
        searchIcon: {
            marginRight: theme.spacing.sm,
        },
        searchInput: {
            flex: 1,
            fontSize: theme.fontSize.body,
            color: theme.colors.text,
        },
        clearButton: {
            padding: theme.spacing.xs,
        },
        filterButton: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterButtonActive: {
            backgroundColor: theme.colors.primary,
        },
        settingsButton: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addButton: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            flex: 1,
            backgroundColor: theme.colors.surface,
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
            fontSize: theme.fontSize.title,
            fontWeight: '600',
            color: theme.colors.text,
        },
        cancelButton: {
            fontSize: theme.fontSize.body,
            color: theme.colors.primary,
        },
        clearAllButton: {
            fontSize: theme.fontSize.body,
            color: theme.colors.danger,
        },
        modalContent: {
            flex: 1,
            padding: theme.spacing.md,
        },
        filterGroup: {
            marginBottom: theme.spacing.lg,
        },
        filterLabel: {
            fontSize: theme.fontSize.body,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
        },
        filterInput: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            fontSize: theme.fontSize.body,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
        },
        modalFooter: {
            padding: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        applyButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: theme.spacing.md,
            alignItems: 'center',
        },
        applyButtonText: {
            color: theme.colors.white,
            fontSize: theme.fontSize.body,
            fontWeight: '600',
        },
    })
