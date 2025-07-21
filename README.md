## ✅ 1. **WHEN TO CALL LOCAL DATABASE SERVICES (SQLite)**

Use these services to **add, update, or delete** data **offline or online** — the app always interacts with SQLite first.

### 📍 Call these when:

* User fills a new form
* User adds/edits a patient
* User creates/updates a visit
* User adds/updates products or services
* User deletes anything locally

### ✅ What to call:

* `addPatient()`, `updatePatient()`, `deletePatient()`
* `addVisit()`, `updateVisit()`, `deleteVisit()`
* `addFormAnswer()`, etc.

These will:

* Save the data locally to SQLite
* Set `sync = false` to mark it for later syncing

---

## ✅ 2. **WHEN TO DOWNLOAD DATA FROM FIRESTORE → SQLITE**

This is your **initial sync** (or re-sync if you reset the app). You fetch data **from Firestore and store it locally**.

### 📍 Call these:

* On **first app launch**
* After **login or logout**
* When user pulls to refresh or hits a "Sync Now" button
* When re-authenticating a new user/device

### ✅ What to call:

* `syncPatients()`
* `syncFormAnswers(patientId)`
* `syncVisits(patientId)`
* `syncForms()` *(static only)*
* `syncFormQuestions(formId)` *(static only)*
* `syncServices()`
* `syncProducts()`

These will:

* Download Firestore data
* Store it in SQLite with `sync = true` so it doesn’t re-upload

---

## ✅ 3. **WHEN TO SYNC SQLITE → FIRESTORE (Upload Local Changes)**

Use these services to **sync local changes back to Firestore** when the device is **online**.

### 📍 Call these:

* Automatically when the device regains internet
* On app launch if online
* After local edits (optional)
* On manual "Sync Now" button

### ✅ What to call:

* `syncPatientsToFirestore()`
* `syncFormAnswersToFirestore(patientId)`
* `syncVisitsToFirestore(patientId)`
* `syncServicesToFirestore()`
* `syncProductsToFirestore()`

These will:

* Find records where `sync = false`
* Upload them to Firestore
* Set `sync = true` after upload succeeds

---

## 🔄 Example Flow in App:

1. **App starts (online)**:

    * Call all `sync*()` services (Firestore → SQLite) to get latest data
    * Then call all `sync*ToFirestore()` services to upload local unsynced data

2. **User adds a new patient (offline or online)**:

    * Call `addPatient()` (saves to SQLite, `sync = false`)
    * If online, trigger `syncPatientsToFirestore()` in background

3. **User fills a form**:

    * Save answers using `addFormAnswer()` (local)
    * On sync, call `syncFormAnswersToFirestore(patientId)`

---

## 🛠 You Might Also Want:

* A **network listener** (`NetInfo`) to trigger sync automatically when online
* A `syncAllToFirestore()` function that batches all sync services
* Conflict resolution if needed (e.g., if edited both locally and on server)