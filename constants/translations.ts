export interface Translations {
  // Common
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  search: string
  loading: string
  error: string
  success: string
  confirm: string
  back: string
  close: string
  done: string
  required: string

  // Patient Management
  patientManagement: string
  addPatient: string
  newPatient: string
  patient: string
  patients: string
  noPatients: string
  noPatientsDescription: string
  searchPatients: string
  patientSince: string
  addVisit: string
  visitHistory: string
  lastVisit: string
  visits: string

  // Patient Form
  customerData: string
  patientData: string
  firstName: string
  lastName: string
  email: string
  phone: string
  phoneNumber: string
  birthDate: string
  dateOfBirth: string
  enterFirstName: string
  enterLastName: string
  enterEmail: string
  enterPhone: string
  photo: string
  patientPhoto: string
  notes: string
  additionalNotes: string

  // Questionnaire
  questionnaire: string
  addQuestion: string
  questionText: string
  answer: string
  yourAnswer: string
  enterQuestionText: string
  enterAnswer: string

  // Search & Filters
  searchByName: string
  searchBySurname: string
  searchByEmail: string
  searchByPhone: string
  filterByVisitDate: string
  filters: string
  clearFilters: string
  applyFilters: string

  // Validation
  invalidEmail: string
  invalidPhone: string
  invalidDate: string
  fillAtLeastOneField: string

  // Actions & Messages
  patientAdded: string
  patientSaved: string
  savePatient: string
  saving: string
  cancelChanges: string
  discardChanges: string
  continueEditing: string
  dataWillBeLost: string
  areYouSure: string

  // Settings
  settings: string
  language: string
  theme: string
  changeLanguage: string
  selectLanguage: string

  // Languages
  english: string
  russian: string

  // Default Questions
  defaultQuestion1: string
  defaultQuestion2: string
  defaultQuestion3: string
  defaultQuestion4: string
  defaultQuestion5: string

  // Dates
  selectDate: string
  today: string
  yesterday: string
  tomorrow: string

  // Time
  morning: string
  afternoon: string
  evening: string
  am: string
  pm: string

  // Days of week
  sunday: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string

  // Months
  january: string
  february: string
  march: string
  april: string
  may: string
  june: string
  july: string
  august: string
  september: string
  october: string
  november: string
  december: string

  // Patient Detail & Edit
  editPatient: string
  editMode: string
  viewMode: string
  saveChanges: string
  cancelEdit: string
  patientDetails: string
  patientNotFound: string
  patientIdNotFound: string
  loadingPatientData: string
  failedToLoadPatient: string
  failedToSaveChanges: string
  changesDiscarded: string
  dataUpdated: string
  patientUpdated: string
  unsavedChanges: string
  unsavedChangesMessage: string
  keepEditing: string
  discardUnsavedChanges: string
  contactInformation: string
  medicalHistory: string
  patientPhotos: string
  patientNotes: string
  noVisitsYet: string
  addFirstVisit: string
  totalVisits: string

  // Visit Management
  visitDate: string
  visitTime: string
  visitNotes: string
  visitDetails: string
  editVisit: string
  deleteVisit: string
  deleteVisitConfirm: string
  visitDeleted: string
  failedToDeleteVisit: string

  // Form Labels
  optional: string
  chooseDate: string
  selectTime: string

  // Additional Messages
  pleaseWait: string
  tryAgain: string
  noDataFound: string
  permissionRequired: string
  cameraPermission: string
  galleryPermission: string
  selectSource: string
  camera: string
  gallery: string
  deletePhoto: string
  deletePhotoConfirm: string
  photoLimit: string
  maxPhotos: string
}

export const englishTranslations: Translations = {
  // Common
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  search: 'Search',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  confirm: 'Confirm',
  back: 'Back',
  close: 'Close',
  done: 'Done',
  required: '(Required)',

  // Patient Management
  patientManagement: 'Patient Management',
  addPatient: 'Add Patient',
  newPatient: 'Add New Patient',
  patient: 'Unnamed Patient',
  patients: 'Patients',
  noPatients: 'No Patients Found',
  noPatientsDescription:
    'Get started by adding your first patient using the + button above',
  searchPatients: 'Search by name, email or phone...',
  patientSince: 'Patient since',
  addVisit: 'Add Visit',
  visitHistory: 'Visit History',
  lastVisit: 'Last visit',
  visits: 'visits',

  // Patient Form
  customerData: 'Customer Information',
  patientData: 'Patient Information',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email Address',
  phone: 'Phone',
  phoneNumber: 'Phone Number',
  birthDate: 'Date of Birth',
  dateOfBirth: 'Date of Birth',
  enterFirstName: 'Enter first name',
  enterLastName: 'Enter last name',
  enterEmail: 'Enter email address',
  enterPhone: '+1 (XXX) XXX-XXXX',
  photo: 'Photo',
  patientPhoto: 'Upload patient photo (optional)',
  notes: 'Additional Notes',
  additionalNotes: 'Add any additional notes about the patient...',

  // Questionnaire
  questionnaire: 'Medical Questionnaire',
  addQuestion: 'Add Question',
  questionText: 'Question',
  answer: 'Answer',
  yourAnswer: 'Enter your response...',
  enterQuestionText: 'Type your question here...',
  enterAnswer: 'Type your answer here...',

  // Search & Filters
  searchByName: 'Search by first name',
  searchBySurname: 'Search by last name',
  searchByEmail: 'Search by email address',
  searchByPhone: 'Search by phone number',
  filterByVisitDate: 'Filter by visit date',
  filters: 'Search Filters',
  clearFilters: 'Clear All',
  applyFilters: 'Apply Filters',

  // Validation
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidDate: 'Please enter a valid date (MM/DD/YYYY)',
  fillAtLeastOneField:
    'Please fill in at least one field to create a patient record',

  // Actions & Messages
  patientAdded: 'Patient successfully added',
  patientSaved: 'Patient information saved',
  savePatient: 'Save Patient',
  saving: 'Saving...',
  cancelChanges: 'Cancel',
  discardChanges: 'Discard Changes',
  continueEditing: 'Continue Editing',
  dataWillBeLost:
    'Are you sure you want to cancel? All entered information will be lost.',
  areYouSure: 'Confirm Action',

  // Settings
  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  changeLanguage: 'Change Language',
  selectLanguage: 'Choose Language',

  // Languages
  english: 'English',
  russian: 'Русский',

  // Default Questions
  defaultQuestion1: 'What are your main concerns or symptoms?',
  defaultQuestion2: 'Do you have any known allergies or sensitivities?',
  defaultQuestion3: 'Are you currently taking any medications or supplements?',
  defaultQuestion4:
    'Have you previously received cosmetic or dermatological treatments?',
  defaultQuestion5: 'How would you describe your skin type?',

  // Dates
  selectDate: 'Choose Date',
  today: 'Today',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',

  // Time
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  am: 'AM',
  pm: 'PM',

  // Days of week
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',

  // Months
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',

  // Patient Detail & Edit
  editPatient: 'Edit Patient',
  editMode: 'Edit Mode',
  viewMode: 'View Mode',
  saveChanges: 'Save Changes',
  cancelEdit: 'Cancel Edit',
  patientDetails: 'Patient Details',
  patientNotFound: 'Patient not found',
  patientIdNotFound: 'Patient ID not found',
  loadingPatientData: 'Loading patient data...',
  failedToLoadPatient: 'Failed to load patient information',
  failedToSaveChanges: 'Failed to save changes',
  changesDiscarded: 'Changes discarded',
  dataUpdated: 'Information updated successfully',
  patientUpdated: 'Patient information updated',
  unsavedChanges: 'Unsaved Changes',
  unsavedChangesMessage: 'You have unsaved changes. What would you like to do?',
  keepEditing: 'Keep Editing',
  discardUnsavedChanges: 'Discard Changes',
  contactInformation: 'Contact Information',
  medicalHistory: 'Medical History',
  patientPhotos: 'Patient Photos',
  patientNotes: 'Patient Notes',
  noVisitsYet: 'No visits recorded yet',
  addFirstVisit: 'Add the first visit for this patient',
  totalVisits: 'Total Visits',

  // Visit Management
  visitDate: 'Visit Date',
  visitTime: 'Visit Time',
  visitNotes: 'Visit Notes',
  visitDetails: 'Visit Details',
  editVisit: 'Edit Visit',
  deleteVisit: 'Delete Visit',
  deleteVisitConfirm: 'Are you sure you want to delete this visit?',
  visitDeleted: 'Visit deleted successfully',
  failedToDeleteVisit: 'Failed to delete visit',

  // Form Labels
  optional: '(Optional)',
  chooseDate: 'Choose Date',
  selectTime: 'Select Time',

  // Additional Messages
  pleaseWait: 'Please wait...',
  tryAgain: 'Try Again',
  noDataFound: 'No data found',
  permissionRequired: 'Permission Required',
  cameraPermission: 'Camera access is required to take photos',
  galleryPermission: 'Gallery access is required to select photos',
  selectSource: 'Select Photo Source',
  camera: 'Camera',
  gallery: 'Gallery',
  deletePhoto: 'Delete Photo',
  deletePhotoConfirm: 'Are you sure you want to delete this photo?',
  photoLimit: 'Photo Limit Reached',
  maxPhotos: 'You can add maximum {count} photos',
}

export const russianTranslations: Translations = {
  // Common
  save: 'Сохранить',
  cancel: 'Отменить',
  delete: 'Удалить',
  edit: 'Редактировать',
  add: 'Добавить',
  search: 'Поиск',
  loading: 'Загрузка...',
  error: 'Ошибка',
  success: 'Успешно',
  confirm: 'Подтвердить',
  back: 'Назад',
  close: 'Закрыть',
  done: 'Готово',
  required: '(Обязательно)',

  // Patient Management
  patientManagement: 'Управление пациентами',
  addPatient: 'Добавить пациента',
  newPatient: 'Новый пациент',
  patient: 'Пациент',
  patients: 'Пациенты',
  noPatients: 'Нет пациентов',
  noPatientsDescription: 'Нажмите кнопку + чтобы добавить первого пациента',
  searchPatients: 'Поиск пациентов...',
  patientSince: 'Пациент с',
  addVisit: 'Добавить визит',
  visitHistory: 'История визитов',
  lastVisit: 'Последний визит',
  visits: 'визитов',

  // Patient Form
  customerData: 'Данные клиента',
  patientData: 'Данные пациента',
  firstName: 'Имя',
  lastName: 'Фамилия',
  email: 'Email',
  phone: 'Телефон',
  phoneNumber: 'Номер телефона',
  birthDate: 'Дата рождения',
  dateOfBirth: 'Дата рождения',
  enterFirstName: 'Введите имя',
  enterLastName: 'Введите фамилию',
  enterEmail: 'example@email.com',
  enterPhone: '+7 (XXX) XXX-XX-XX',
  photo: 'Фото',
  patientPhoto: 'Фото пациента (опционально)',
  notes: 'Заметки',
  additionalNotes: 'Дополнительные заметки о пациенте...',

  // Questionnaire
  questionnaire: 'Анкета',
  addQuestion: 'Добавить вопрос',
  questionText: 'Текст вопроса',
  answer: 'Ответ',
  yourAnswer: 'Ваш ответ...',
  enterQuestionText: 'Введите текст вопроса...',
  enterAnswer: 'Введите ответ...',

  // Search & Filters
  searchByName: 'Поиск по имени',
  searchBySurname: 'Поиск по фамилии',
  searchByEmail: 'Поиск по email',
  searchByPhone: 'Поиск по телефону',
  filterByVisitDate: 'Фильтр по дате визита',
  filters: 'Фильтры',
  clearFilters: 'Очистить фильтры',
  applyFilters: 'Применить фильтры',

  // Validation
  invalidEmail: 'Неверный формат email',
  invalidPhone: 'Неверный формат телефона',
  invalidDate: 'Неверный формат даты (ДД.ММ.ГГГГ)',
  fillAtLeastOneField:
    'Заполните хотя бы одно поле для создания карточки пациента',

  // Actions & Messages
  patientAdded: 'Пациент добавлен',
  patientSaved: 'Пациент сохранен',
  savePatient: 'Сохранить пациента',
  saving: 'Сохранение...',
  cancelChanges: 'Отменить',
  discardChanges: 'Отменить',
  continueEditing: 'Продолжить редактирование',
  dataWillBeLost:
    'Вы уверены, что хотите отменить? Все введенные данные будут потеряны.',
  areYouSure: 'Вы уверены?',

  // Settings
  settings: 'Настройки',
  language: 'Язык',
  theme: 'Тема',
  changeLanguage: 'Изменить язык',
  selectLanguage: 'Выберите язык',

  // Languages
  english: 'English',
  russian: 'Русский',

  // Default Questions
  defaultQuestion1: 'Какие у вас основные жалобы?',
  defaultQuestion2: 'Есть ли аллергические реакции?',
  defaultQuestion3: 'Принимаете ли вы какие-либо лекарства?',
  defaultQuestion4: 'Были ли ранее процедуры у косметолога?',
  defaultQuestion5: 'Какой у вас тип кожи?',

  // Dates
  selectDate: 'Выберите дату',
  today: 'Сегодня',
  yesterday: 'Вчера',
  tomorrow: 'Завтра',

  // Time
  morning: 'Утро',
  afternoon: 'День',
  evening: 'Вечер',
  am: 'AM',
  pm: 'PM',

  // Days of week
  sunday: 'Вс',
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',

  // Months
  january: 'Январь',
  february: 'Февраль',
  march: 'Март',
  april: 'Апрель',
  may: 'Май',
  june: 'Июнь',
  july: 'Июль',
  august: 'Август',
  september: 'Сентябрь',
  october: 'Октябрь',
  november: 'Ноябрь',
  december: 'Декабрь',

  // Patient Detail & Edit
  editPatient: 'Редактировать пациента',
  editMode: 'Режим редактирования',
  viewMode: 'Режим просмотра',
  saveChanges: 'Сохранить изменения',
  cancelEdit: 'Отменить редактирование',
  patientDetails: 'Данные пациента',
  patientNotFound: 'Пациент не найден',
  patientIdNotFound: 'ID пациента не найден',
  loadingPatientData: 'Загрузка данных пациента...',
  failedToLoadPatient: 'Не удалось загрузить данные пациента',
  failedToSaveChanges: 'Не удалось сохранить изменения',
  changesDiscarded: 'Изменения отменены',
  dataUpdated: 'Данные успешно обновлены',
  patientUpdated: 'Данные пациента обновлены',
  unsavedChanges: 'Несохраненные изменения',
  unsavedChangesMessage:
    'У вас есть несохраненные изменения. Что вы хотите сделать?',
  keepEditing: 'Продолжить редактирование',
  discardUnsavedChanges: 'Отменить изменения',
  contactInformation: 'Контактная информация',
  medicalHistory: 'Медицинская история',
  patientPhotos: 'Фото пациента',
  patientNotes: 'Заметки о пациенте',
  noVisitsYet: 'Визитов пока нет',
  addFirstVisit: 'Добавьте первый визит для этого пациента',
  totalVisits: 'Всего визитов',

  // Visit Management
  visitDate: 'Дата визита',
  visitTime: 'Время визита',
  visitNotes: 'Заметки о визите',
  visitDetails: 'Детали визита',
  editVisit: 'Редактировать визит',
  deleteVisit: 'Удалить визит',
  deleteVisitConfirm: 'Вы уверены, что хотите удалить этот визит?',
  visitDeleted: 'Визит успешно удален',
  failedToDeleteVisit: 'Не удалось удалить визит',

  // Form Labels
  optional: '(Необязательно)',
  chooseDate: 'Выберите дату',
  selectTime: 'Выберите время',

  // Additional Messages
  pleaseWait: 'Пожалуйста, подождите...',
  tryAgain: 'Попробовать снова',
  noDataFound: 'Данные не найдены',
  permissionRequired: 'Требуется разрешение',
  cameraPermission: 'Для съемки фото необходим доступ к камере',
  galleryPermission: 'Для выбора фото необходим доступ к галерее',
  selectSource: 'Выберите источник фото',
  camera: 'Камера',
  gallery: 'Галерея',
  deletePhoto: 'Удалить фото',
  deletePhotoConfirm: 'Вы уверены, что хотите удалить это фото?',
  photoLimit: 'Достигнут лимит фото',
  maxPhotos: 'Можно добавить максимум {count} фото',
}

export const supportedLanguages = {
  en: englishTranslations,
  ru: russianTranslations,
}

export type SupportedLanguage = keyof typeof supportedLanguages
