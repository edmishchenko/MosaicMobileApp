export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle Russian phone numbers
  if (digits.length === 0) return ''

  // If starts with 8, replace with 7
  let formattedDigits = digits
  if (formattedDigits.startsWith('8')) {
    formattedDigits = '7' + formattedDigits.slice(1)
  }

  // Add +7 prefix if not present
  if (!formattedDigits.startsWith('7')) {
    formattedDigits = '7' + formattedDigits
  }

  // Format as +7 (XXX) XXX-XX-XX
  if (formattedDigits.length >= 1) {
    let formatted = '+7'

    if (formattedDigits.length > 1) {
      formatted += ' ('
      formatted += formattedDigits.slice(1, 4)

      if (formattedDigits.length > 4) {
        formatted += ') '
        formatted += formattedDigits.slice(4, 7)

        if (formattedDigits.length > 7) {
          formatted += '-'
          formatted += formattedDigits.slice(7, 9)

          if (formattedDigits.length > 9) {
            formatted += '-'
            formatted += formattedDigits.slice(9, 11)
          }
        }
      }
    }

    return formatted
  }

  return phone
}

export const getUnformattedPhone = (phone: string): string => {
  return phone.replace(/\D/g, '')
}

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true // Optional field
  const digits = getUnformattedPhone(phone)

  // Should be 11 digits for Russian numbers (7XXXXXXXXXX)
  return digits.length === 11 && digits.startsWith('7')
}
