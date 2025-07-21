export interface SuggestionItem {
    id: string
    text: string
    usageCount: number
}

export type ModalType = 'procedure' | 'product' | 'soldProduct'