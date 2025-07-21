import {SuggestionItem} from "../utils/types/SuggestionItem";

export const Colors = {
    primary: '#460087', // Blue accent
    secondary: '#7000d8', // Purple accent (alternative)
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    white: '#FFFFFF',
    black: '#000000',
    text: '#000000', // Black text for better contrast
    textSecondary: '#4B5563', // Gray text for secondary content
    background: '#FFFFFF', // White background
    backgroundSecondary: '#F9FAFB', // Light gray background for cards
    border: '#E5E7EB',
    surface: '#FFFFFF', // White surface for cards/modals
    surfaceSecondary: '#F8FAFC', // Very light gray for secondary surfaces
}

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
}

export const FontSizes = {
    small: 12,
    body: 16,
    subtitle: 18,
    title: 20,
    large: 24,
    extraLarge: 28,
}

export const SAMPLE_PROCEDURES: SuggestionItem[] = [
    { id: '1', text: 'Чистка лица', usageCount: 25 },
    { id: '2', text: 'Пилинг химический', usageCount: 18 },
    { id: '3', text: 'Мезотерапия', usageCount: 15 },
    { id: '4', text: 'Биоревитализация', usageCount: 12 },
    { id: '5', text: 'Массаж лица', usageCount: 20 },
    { id: '6', text: 'Лазерная эпиляция', usageCount: 30 },
    { id: '7', text: 'Фотоомоложение', usageCount: 8 },
    { id: '8', text: 'Инъекции ботокса', usageCount: 22 },
]

export const SAMPLE_PRODUCTS: SuggestionItem[] = [
    { id: '1', text: 'Сыворотка витамин С', usageCount: 15 },
    { id: '2', text: 'Крем увлажняющий', usageCount: 25 },
    { id: '3', text: 'Тоник очищающий', usageCount: 18 },
    { id: '4', text: 'Маска глиняная', usageCount: 12 },
    { id: '5', text: 'Солнцезащитный крем SPF 50', usageCount: 20 },
    { id: '6', text: 'Пенка для умывания', usageCount: 22 },
    { id: '7', text: 'Сыворотка с гиалуроновой кислотой', usageCount: 16 },
]