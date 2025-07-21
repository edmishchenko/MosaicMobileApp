import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

interface PhotoPickerProps {
    photos: string[]
    onPhotosChange: (photos: string[]) => void
    label?: string
    maxPhotos?: number
    showLabel?: boolean
}

export default function PhotoPicker({
                                        photos,
                                        onPhotosChange,
                                        label,
                                        maxPhotos = 5,
                                        showLabel = true,
                                    }: PhotoPickerProps) {
    const { theme } = useTheme()
    const { t } = useLanguage()

    const photoLabel = label || t('photo')

    const pickImage = async () => {
        if (photos.length >= maxPhotos) {
            Alert.alert(
                t('photoLimit'),
                t('maxPhotos').replace('{count}', maxPhotos.toString())
            )
            return
        }

        Alert.alert(t('selectSource'), 'Where do you want to add photo from?', [
            { text: t('cancel'), style: 'cancel' },
            { text: t('camera'), onPress: () => openCamera() },
            { text: t('gallery'), onPress: () => openGallery() },
        ])
    }

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

        if (!permissionResult.granted) {
            Alert.alert(t('permissionRequired'), t('cameraPermission'))
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            onPhotosChange([...photos, result.assets[0].uri])
        }
    }

    const openGallery = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permissionResult.granted) {
            Alert.alert(t('permissionRequired'), t('galleryPermission'))
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            onPhotosChange([...photos, result.assets[0].uri])
        }
    }

    const removePhoto = (index: number) => {
        Alert.alert(t('deletePhoto'), t('deletePhotoConfirm'), [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('delete'),
                style: 'destructive',
                onPress: () => {
                    const newPhotos = photos.filter((_, i) => i !== index)
                    onPhotosChange(newPhotos)
                },
            },
        ])
    }

    return (
        <View style={styles(theme).container}>
            {showLabel && <Text style={styles(theme).label}>{photoLabel}</Text>}

            <View style={styles(theme).photoGrid}>
                {photos.map((photo, index) => (
                    <View key={index} style={styles(theme).photoContainer}>
                        <Image source={{ uri: photo }} style={styles(theme).photo} />
                        <TouchableOpacity
                            style={styles(theme).removeButton}
                            onPress={() => removePhoto(index)}
                        >
                            <Ionicons
                                name="close-circle"
                                size={24}
                                color={theme.colors.danger}
                            />
                        </TouchableOpacity>
                    </View>
                ))}

                {photos.length < maxPhotos && (
                    <TouchableOpacity
                        style={styles(theme).addPhotoButton}
                        onPress={pickImage}
                    >
                        <Ionicons name="camera" size={32} color={theme.colors.gray} />
                        <Text style={styles(theme).addPhotoText}>
                            {t('add')} {t('photo')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            marginBottom: theme.spacing.lg,
        },
        label: {
            fontSize: theme.fontSize.body,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
        },
        photoGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.md,
        },
        photoContainer: {
            position: 'relative',
            width: 80,
            height: 80,
        },
        photo: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
            backgroundColor: theme.colors.backgroundSecondary,
        },
        removeButton: {
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
        },
        addPhotoButton: {
            width: 80,
            height: 80,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
        },
        addPhotoText: {
            fontSize: theme.fontSize.small,
            color: theme.colors.gray,
            marginTop: theme.spacing.xs,
            textAlign: 'center',
        },
    })
