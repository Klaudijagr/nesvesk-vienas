export type Locale = "lt" | "en" | "ua" | "ru";

export const translations = {
  lt: {
    // App
    appName: "Nešvęsk vienas",
    appTagline:
      "Iniciatyva, jungianti žmones švenčių laikotarpiu. Nesvarbu, ar turite laisvą kėdę prie stalo, ar ieškote jaukios kompanijos — čia esate laukiamas.",

    // Navigation
    home: "Pagrindinis",
    browseHosts: "Naršyti šeimininkus",
    browseGuests: "Naršyti svečius",
    dashboard: "Mano profilis",
    signUp: "Registruotis",
    signIn: "Prisijungti",
    signOut: "Atsijungti",
    messages: "Žinutės",
    settings: "Nustatymai",
    about: "Apie mus",
    goToApp: "Į platformą",

    // Hero
    heroTitle: "Šiemet",
    heroHighlight: "Nešvęsk vienas.",
    heroDescription:
      "Ši platforma skirta tiems, kurie nori dalintis didžiųjų metų švenčių džiaugsmu. Jei prie Tavo stalo yra vietos tiems, kurie šventes sutinka vieni – pakviesk juos į svečius. Jei ieškai kompanijos – pasisiūlyk į svečius. Šiemet nešvęsk vienas.",
    inviteGuests: "Kviesti į svečius",
    becomeGuest: "Būti svečiu",

    // How it works
    howItWorks: "Kaip tai veikia?",
    howItWorksSubtitle: "Saugūs, paprasti ir prasmingi ryšiai švenčių sezonui.",
    step1Title: "Susikurkite profilį",
    step1Description:
      "Užsiregistruokite kaip šeimininkas arba svečias. Prisistatykite: kokiomis kalbomis kalbate, kokios Jūsų mitybos preferencijos, pasirinkite dominančią datą.",
    step2Title: "Raskite bendraminčių",
    step2Description:
      "Ieškokite pagal miestą, kalbą ar datą. Išsiųskite užklausą šeimininkui arba svečiui, su kuriuo norėtumėte sutikti šventes.",
    step3Title: "Švęskite kartu",
    step3Description:
      "Kai abi pusės sutinka — susisiekite ir susitarkite dėl detalių. Pasidalinkite Kalėdų, Naujųjų ar kitų švenčių džiaugsmu.",

    // Safety
    safetyTitle: "Jūsų saugumas — pirmoje vietoje",
    identityVerificationDesc:
      "Galimas nuotraukos patvirtinimas, kad šeimininkai ir svečiai jaustųsi saugiau.",
    mutualConsent: "Abipusis sutikimas",
    mutualConsentDesc:
      "Kontaktais ir lokacija pasidalinsite tada, kai patys nuspręsite.",

    // Origin story
    originStoryTitle: "Kaip atsirado ši iniciatyva?",
    originStoryQuote:
      "Kalbėdama su bičiule ukrainiete supratau, kiek žmonių šventes pasitinka vieni — nuo karo pabėgėlių iki vyresnių kaimynų ar jaunų žmonių, gyvenančių toli nuo namų. Kadangi patys turime vietos prie stalo, norėjosi sukurti platformą, kurioje svetimi gali tapti draugais bent vienam šiltam vakarui.",
    originStoryAuthor: "Klaudija Grabauskaitė, idėjos iniciatorė",
    originStoryDescription:
      "Nešvęsk vienas suburia žmones, turinčius laisvą vietą prie stalo, su tais, kurie nori pasidalinti Šv. Kalėdų ir Naujųjų metų džiaugsmu su kitais. Džiaugsmas auga dalijantis.",

    // Stats
    statsLanguages: "Kalbos",
    statsLanguagesValue: "4",
    statsCities: "Lietuvos miestų",
    statsCitiesValue: "60+",
    statsHolidayPeriod: "Švenčių laikotarpis",
    statsHolidayPeriodValue: "Gruodžio 23 – Sausio 2",
    statsCommunityMembers: "Bendruomenės nariai",
    statsCommunityMembersValue: "18+",

    // Final CTA
    finalCtaTitle: "Pasirengę dalintis šventine dvasia?",
    finalCtaDescription:
      "Prisijunkite prie šimtų žmonių Lietuvoje, kurie šį sezoną atveria savo namus ir širdis.",
    getStarted: "Pradėti",

    // Footer
    platform: "Platforma",
    legalAndSafety: "Teisinė informacija ir saugumas",
    safetyGuidelines: "Saugos gairės",
    termsOfService: "Paslaugų teikimo sąlygos",
    privacyPolicy: "Privatumo politika",
    allRightsReserved: "Visos teisės saugomos.",

    // Legacy keys (keeping for backwards compatibility)
    startAsHost: "Kviesti į svečius",
    startAsGuest: "Būti svečiu",
    findGathering: "Rasti susibūrimą",
    safetyAndTrust: "Saugumas ir pasitikėjimas",
    mutualMatching: "Abipusis sutikimas",
    mutualMatchingDesc:
      "Abi pusės turi sutikti prieš dalijantis kontaktine informacija.",
    communityFirst: "Bendruomenė pirma",
    communityFirstDesc:
      "Tikros apžvalgos ir įvertinimai padės rasti tinkamą atitikmenį jūsų šventei.",
    terms: "Sąlygos",
    privacy: "Privatumas",
    contact: "Kontaktai",

    // Dashboard - Navigation
    navHome: "Pagrindinis",
    navProfile: "Profilis",
    navMessages: "Žinutės",
    navSettings: "Nustatymai",
    navFindHosts: "Rasti šeimininkus",
    navMyProfile: "Mano profilis",
    navLocationPicker: "Vietos pasirinkimas",
    dontCelebrateAlone: "Nešvęsk vienas",

    // Dashboard - Browse Page
    findAHost: "Rasti šeimininką",
    findGuests: "Rasti svečius",
    anywhereInLithuania: "Bet kur Lietuvoje",
    anyDates: "Bet kokios datos",
    anyLanguage: "Bet kuri kalba",
    clearFilters: "Išvalyti filtrus",
    loading: "Kraunama...",
    hostsFound: "šeimininkų rasta",
    guestsFound: "svečių rasta",
    sortBy: "Rūšiuoti pagal:",
    recommended: "Rekomenduojami",
    newest: "Naujausi",
    verified: "Patvirtintas",
    unverified: "Nepatvirtintas",
    availability: "Prieinamumas",
    viewProfile: "Peržiūrėti profilį",
    message: "Parašyti",
    pending: "Laukiama",
    accept: "Priimti",
    requestToJoin: "Prašyti prisijungti",
    sendRequest: "Siųsti užklausą",
    noMatchesFound: "Nieko nerasta",
    tryAdjustingFilters: "Pabandykite pakeisti filtrus arba datas.",
    clearAllFilters: "Išvalyti visus filtrus",
    requestSent: "Užklausa išsiųsta!",
    alreadySentRequest: "Jau išsiuntėte užklausą šiam asmeniui!",
    failedToSendRequest: "Nepavyko išsiųsti užklausos",
    youreMatched: "Jūs susiderinote! Dabar galite rašyti vienas kitam.",
    invitationNotFound: "Kvietimas nerastas",
    failedToAccept: "Nepavyko priimti",

    // Dashboard - Settings Page
    settingsTitle: "Nustatymai",
    manageProfileAndAccount: "Tvarkykite savo profilį ir paskyrą",
    profile: "Profilis",
    account: "Paskyra",
    security: "Saugumas",
    notifications: "Pranešimai",
    profileInformation: "Profilio informacija",
    updateYourPublicProfile: "Atnaujinkite savo viešą profilį",
    iWantToBe: "Noriu būti",
    guest: "svečias",
    host: "šeimininkas",
    both: "abu",
    firstName: "Vardas",
    lastName: "Pavardė",
    age: "Amžius",
    city: "Miestas",
    bio: "Aprašymas",
    tellOthersAboutYourself: "Papasakokite apie save...",
    languages: "Kalbos",
    availableDates: "Prieinamos datos",
    saveChanges: "Išsaugoti pakeitimus",
    identityVerification: "Tapatybės patvirtinimas",
    verifyYourIdentity: "Patvirtinkite savo tapatybę",
    yourIdentityVerified: "Jūsų tapatybė patvirtinta",
    verifyWithPhoto: "Patvirtinkite tapatybę nuotrauka",
    verifyNow: "Patvirtinti dabar",
    accountSettings: "Paskyros nustatymai",
    manageAccountPreferences: "Tvarkykite paskyros nustatymus",
    email: "El. paštas",
    accountStatus: "Paskyros būsena",
    accountCurrentlyActive: "Jūsų paskyra šiuo metu aktyvi",
    active: "Aktyvi",
    profileVisibility: "Profilio matomumas",
    makeProfileVisible: "Padaryti profilį matomą kitiems naudotojams",
    dangerZone: "Pavojinga zona",
    irreversibleActions: "Negrįžtami veiksmai",
    signOutLabel: "Atsijungti",
    signOutFromAccount: "Atsijungti nuo paskyros",
    deleteAccount: "Ištrinti paskyrą",
    permanentlyDeleteAccount: "Visam laikui ištrinti paskyrą ir visus duomenis",
    securitySettings: "Saugos nustatymai",
    manageAccountSecurity: "Tvarkykite paskyros saugumą",
    password: "Slaptažodis",
    managedBy: "Valdoma",
    google: "Google",
    yourAuthProvider: "jūsų autentifikavimo teikėjo",
    changePassword: "Keisti slaptažodį",
    twoFactorAuth: "Dviejų veiksnių autentifikacija",
    addExtraSecurity: "Pridėti papildomą saugumo sluoksnį",
    comingSoon: "Jau greitai",
    loginNotifications: "Prisijungimo pranešimai",
    getNotifiedOnLogin: "Gauti pranešimą, kai kas nors prisijungia",
    notificationPreferences: "Pranešimų nustatymai",
    chooseNotifications: "Pasirinkite, kokius pranešimus norite gauti",
    emailNotifications: "El. pašto pranešimai",
    receiveEmailNotifications: "Gauti pranešimus el. paštu",
    newInvitationAlerts: "Naujų kvietimų pranešimai",
    getNotifiedOnInvitation: "Gauti pranešimą, kai gaunate kvietimą",
    messageNotifications: "Žinučių pranešimai",
    getNotifiedOnMessage: "Gauti pranešimą, kai gaunate naują žinutę",
    matchNotifications: "Atitikimo pranešimai",
    getNotifiedOnMatch: "Gauti pranešimą, kai kas nors priima jūsų kvietimą",
    marketingEmails: "Rinkodaros el. laiškai",
    receiveMarketingEmails: "Gauti el. laiškus apie naujas funkcijas",
  },
  en: {
    // App
    appName: "Don't Celebrate Alone",
    appTagline:
      "An initiative connecting people during the holiday season. Whether you have an extra seat or are looking for warm company — you're welcome here.",

    // Navigation
    home: "Home",
    browseHosts: "Browse Hosts",
    browseGuests: "Browse Guests",
    dashboard: "My Dashboard",
    signUp: "Sign Up",
    signIn: "Sign In",
    signOut: "Sign Out",
    messages: "Messages",
    settings: "Settings",
    about: "About",
    goToApp: "Go to App",

    // Hero
    heroTitle: "This year,",
    heroHighlight: "Don't Celebrate Alone.",
    heroDescription:
      "This platform is for anyone who wants to share the joy of the holiday season. If you have a spare seat at your table — invite someone who would otherwise celebrate alone. If you're looking for company — offer to be a guest. This year, don't celebrate alone.",
    inviteGuests: "Invite Guests",
    becomeGuest: "Become a Guest",

    // How it works
    howItWorks: "How it Works",
    howItWorksSubtitle:
      "Safe, simple, and meaningful connections for the holiday season.",
    step1Title: "Create a Profile",
    step1Description:
      "Register as a host or a guest. Introduce yourself: languages you speak, dietary preferences, and the date you prefer.",
    step2Title: "Find Like-Minded People",
    step2Description:
      "Search by city, language, or date. Send a request to the host or guest you'd like to meet and celebrate with.",
    step3Title: "Celebrate Together",
    step3Description:
      "Once both sides agree, connect and arrange the details. Share the joy of Christmas, New Year's, or any holiday together.",

    // Safety
    safetyTitle: "Your Safety Comes First",
    identityVerificationDesc:
      "Optional photo verification to help hosts and guests feel safer.",
    mutualConsent: "Mutual Consent",
    mutualConsentDesc:
      "You share your contact information and location only when you decide.",

    // Origin story
    originStoryTitle: "How This Initiative Started",
    originStoryQuote:
      "While talking with a Ukrainian friend, I realized how many people spend the holidays alone — from war refugees to elderly neighbors and young people far from home. Since we have space at our own table, we wanted to create a platform where strangers can become friends for at least one warm evening.",
    originStoryAuthor: "Klaudija Grabauskaitė, founder of the idea",
    originStoryDescription:
      "Don't Celebrate Alone brings together people who have an empty seat at their table with those who want to share the joy of Christmas and New Year. Joy grows when it's shared.",

    // Stats
    statsLanguages: "Languages",
    statsLanguagesValue: "4",
    statsCities: "Cities in Lithuania",
    statsCitiesValue: "60+",
    statsHolidayPeriod: "Holiday period",
    statsHolidayPeriodValue: "Dec 23 – Jan 2",
    statsCommunityMembers: "Community members",
    statsCommunityMembersValue: "18+",

    // Final CTA
    finalCtaTitle: "Ready to share the holiday spirit?",
    finalCtaDescription:
      "Join the hundreds of people across Lithuania who are opening their homes and hearts this season.",
    getStarted: "Get Started",

    // Footer
    platform: "Platform",
    legalAndSafety: "Legal & Safety",
    safetyGuidelines: "Safety Guidelines",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    allRightsReserved: "All rights reserved.",

    // Legacy keys (keeping for backwards compatibility)
    startAsHost: "Invite Guests",
    startAsGuest: "Become a Guest",
    findGathering: "Find a Gathering",
    safetyAndTrust: "Safety & Trust",
    mutualMatching: "Mutual Matching",
    mutualMatchingDesc:
      "Both parties must agree before contact details are shared.",
    communityFirst: "Community First",
    communityFirstDesc:
      "Real reviews and ratings help you find the right match for your celebration.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",

    // Dashboard - Navigation
    navHome: "Home",
    navProfile: "Profile",
    navMessages: "Messages",
    navSettings: "Settings",
    navFindHosts: "Find Hosts",
    navMyProfile: "My Profile",
    navLocationPicker: "Location Picker",
    dontCelebrateAlone: "Don't Celebrate Alone",

    // Dashboard - Browse Page
    findAHost: "Find a Host",
    findGuests: "Find Guests",
    anywhereInLithuania: "Anywhere in Lithuania",
    anyDates: "Any Dates",
    anyLanguage: "Any Language",
    clearFilters: "Clear Filters",
    loading: "Loading...",
    hostsFound: "Hosts found",
    guestsFound: "Guests found",
    sortBy: "Sort by:",
    recommended: "Recommended",
    newest: "Newest",
    verified: "Verified",
    unverified: "Unverified",
    availability: "Availability",
    viewProfile: "View Profile",
    message: "Message",
    pending: "Pending",
    accept: "Accept",
    requestToJoin: "Request to Join",
    sendRequest: "Send Request",
    noMatchesFound: "No matches found",
    tryAdjustingFilters: "Try adjusting your filters or dates.",
    clearAllFilters: "Clear all filters",
    requestSent: "Request sent!",
    alreadySentRequest: "You've already sent a request to this person!",
    failedToSendRequest: "Failed to send request",
    youreMatched: "You're matched! You can now message each other.",
    invitationNotFound: "Invitation not found",
    failedToAccept: "Failed to accept",

    // Dashboard - Settings Page
    settingsTitle: "Settings",
    manageProfileAndAccount: "Manage your profile and account",
    profile: "Profile",
    account: "Account",
    security: "Security",
    notifications: "Notifications",
    profileInformation: "Profile Information",
    updateYourPublicProfile: "Update your public profile",
    iWantToBe: "I want to be a",
    guest: "guest",
    host: "host",
    both: "both",
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    city: "City",
    bio: "Bio",
    tellOthersAboutYourself: "Tell others about yourself...",
    languages: "Languages",
    availableDates: "Available Dates",
    saveChanges: "Save Changes",
    identityVerification: "Identity Verification",
    verifyYourIdentity: "Verify your identity to build trust",
    yourIdentityVerified: "Your identity has been verified",
    verifyWithPhoto: "Verify your identity with a photo",
    verifyNow: "Verify Now",
    accountSettings: "Account Settings",
    manageAccountPreferences: "Manage your account preferences",
    email: "Email",
    accountStatus: "Account Status",
    accountCurrentlyActive: "Your account is currently active",
    active: "Active",
    profileVisibility: "Profile Visibility",
    makeProfileVisible: "Make your profile visible to other users",
    dangerZone: "Danger Zone",
    irreversibleActions: "Irreversible actions",
    signOutLabel: "Sign Out",
    signOutFromAccount: "Sign out from your account",
    deleteAccount: "Delete Account",
    permanentlyDeleteAccount: "Permanently delete your account and all data",
    securitySettings: "Security Settings",
    manageAccountSecurity: "Manage your account security",
    password: "Password",
    managedBy: "Managed by",
    google: "Google",
    yourAuthProvider: "your auth provider",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    addExtraSecurity: "Add an extra layer of security",
    comingSoon: "Coming Soon",
    loginNotifications: "Login Notifications",
    getNotifiedOnLogin: "Get notified when someone logs in",
    notificationPreferences: "Notification Preferences",
    chooseNotifications: "Choose what notifications you want to receive",
    emailNotifications: "Email Notifications",
    receiveEmailNotifications: "Receive notifications via email",
    newInvitationAlerts: "New Invitation Alerts",
    getNotifiedOnInvitation: "Get notified when you receive an invitation",
    messageNotifications: "Message Notifications",
    getNotifiedOnMessage: "Get notified when you receive new messages",
    matchNotifications: "Match Notifications",
    getNotifiedOnMatch: "Get notified when someone accepts your invitation",
    marketingEmails: "Marketing Emails",
    receiveMarketingEmails: "Receive emails about new features",
  },
  ua: {
    // App
    appName: "Не святкуй наодинці",
    appTagline:
      "Ініціатива, що об'єднує людей у святковий час. Маєш зайве місце або шукаєш теплу компанію — тобі тут раді.",

    // Navigation
    home: "Головна",
    browseHosts: "Переглянути Господарів",
    browseGuests: "Переглянути Гостей",
    dashboard: "Моя Панель",
    signUp: "Реєстрація",
    signIn: "Увійти",
    signOut: "Вийти",
    messages: "Повідомлення",
    settings: "Налаштування",
    about: "Про нас",
    goToApp: "До застосунку",

    // Hero
    heroTitle: "Цього року",
    heroHighlight: "Не святкуй наодинці.",
    heroDescription:
      "Ця платформа створена для тих, хто хоче поділитися радістю зимових свят. Якщо за твоїм столом є вільне місце — запроси тих, хто святкує сам. Якщо ти шукаєш компанію — подай запит стати гостем. Цього року не святкуй наодинці.",
    inviteGuests: "Запросити в гості",
    becomeGuest: "Стати гостем",

    // How it works
    howItWorks: "Як це працює?",
    howItWorksSubtitle:
      "Безпечні, прості й теплі знайомства на святковий період.",
    step1Title: "Створи профіль",
    step1Description:
      "Зареєструйся як господар або гість. Розкажи про себе: якими мовами говориш, які твої харчові вподобання, обери зручну дату.",
    step2Title: "Знайди однодумців",
    step2Description:
      "Шукай за містом, мовою або датою. Надішли запит господарю чи гостю, з яким хотів(-ла) би провести свята.",
    step3Title: "Святкуйте разом",
    step3Description:
      "Коли обидві сторони погодяться — зв'яжіться та домовтеся про деталі. Поділіться теплом Різдва, Нового року чи інших свят.",

    // Safety
    safetyTitle: "Твоя безпека — передусім",
    identityVerificationDesc:
      "За бажанням можна підтвердити фото, щоб господарі та гості почувалися безпечніше.",
    mutualConsent: "Взаємна згода",
    mutualConsentDesc:
      "Контактами та місцем зустрічі ви ділитеся тільки тоді, коли самі вирішите.",

    // Origin story
    originStoryTitle: "Як з'явилася ця ініціатива",
    originStoryQuote:
      "Під час розмови з подругою-українкою я зрозуміла, скільки людей зустрічають свята наодинці — від біженців війни до літніх сусідів і молоді, яка живе далеко від дому. Оскільки за нашим столом є місце, нам захотілося створити платформу, де незнайомці можуть стати друзями хоча б на один теплий вечір.",
    originStoryAuthor: "Клаудія Грабаускайте, ініціаторка ідеї",
    originStoryDescription:
      "Не святкуй наодинці об'єднує тих, у кого є вільне місце за столом, із тими, хто хоче поділитися радістю Різдва та Нового року. Радість зростає, коли нею ділишся.",

    // Stats
    statsLanguages: "Мови",
    statsLanguagesValue: "4",
    statsCities: "Міста Литви",
    statsCitiesValue: "60+",
    statsHolidayPeriod: "Святковий період",
    statsHolidayPeriodValue: "23 грудня – 2 січня",
    statsCommunityMembers: "Учасники спільноти",
    statsCommunityMembersValue: "18+",

    // Final CTA
    finalCtaTitle: "Готові поділитися святковим настроєм?",
    finalCtaDescription:
      "Приєднуйтеся до сотень людей у Литві, які цього сезону відкривають свої домівки та серця.",
    getStarted: "Почати",

    // Footer
    platform: "Платформа",
    legalAndSafety: "Юридична інформація та безпека",
    safetyGuidelines: "Правила безпеки",
    termsOfService: "Умови користування",
    privacyPolicy: "Політика конфіденційності",
    allRightsReserved: "Усі права захищені.",

    // Legacy keys (keeping for backwards compatibility)
    startAsHost: "Запросити в гості",
    startAsGuest: "Стати гостем",
    findGathering: "Знайти зібрання",
    safetyAndTrust: "Безпека та Довіра",
    mutualMatching: "Взаємна відповідність",
    mutualMatchingDesc:
      "Обидві сторони повинні погодитися перед обміном контактними даними.",
    communityFirst: "Спільнота насамперед",
    communityFirstDesc:
      "Справжні відгуки та оцінки допоможуть вам знайти правильну відповідність для вашого святкування.",
    terms: "Умови",
    privacy: "Конфіденційність",
    contact: "Контакт",

    // Dashboard - Navigation
    navHome: "Головна",
    navProfile: "Профіль",
    navMessages: "Повідомлення",
    navSettings: "Налаштування",
    navFindHosts: "Знайти господарів",
    navMyProfile: "Мій профіль",
    navLocationPicker: "Вибір місця",
    dontCelebrateAlone: "Не святкуй наодинці",

    // Dashboard - Browse Page
    findAHost: "Знайти господаря",
    findGuests: "Знайти гостей",
    anywhereInLithuania: "Будь-де в Литві",
    anyDates: "Будь-які дати",
    anyLanguage: "Будь-яка мова",
    clearFilters: "Очистити фільтри",
    loading: "Завантаження...",
    hostsFound: "господарів знайдено",
    guestsFound: "гостей знайдено",
    sortBy: "Сортувати за:",
    recommended: "Рекомендовані",
    newest: "Найновіші",
    verified: "Підтверджено",
    unverified: "Не підтверджено",
    availability: "Доступність",
    viewProfile: "Переглянути профіль",
    message: "Написати",
    pending: "Очікується",
    accept: "Прийняти",
    requestToJoin: "Запросити приєднатися",
    sendRequest: "Надіслати запит",
    noMatchesFound: "Нічого не знайдено",
    tryAdjustingFilters: "Спробуйте змінити фільтри або дати.",
    clearAllFilters: "Очистити всі фільтри",
    requestSent: "Запит надіслано!",
    alreadySentRequest: "Ви вже надіслали запит цій людині!",
    failedToSendRequest: "Не вдалося надіслати запит",
    youreMatched: "Ви знайшли пару! Тепер можете писати один одному.",
    invitationNotFound: "Запрошення не знайдено",
    failedToAccept: "Не вдалося прийняти",

    // Dashboard - Settings Page
    settingsTitle: "Налаштування",
    manageProfileAndAccount: "Керуйте своїм профілем та обліковим записом",
    profile: "Профіль",
    account: "Обліковий запис",
    security: "Безпека",
    notifications: "Сповіщення",
    profileInformation: "Інформація про профіль",
    updateYourPublicProfile: "Оновіть свій публічний профіль",
    iWantToBe: "Я хочу бути",
    guest: "гість",
    host: "господар",
    both: "обидва",
    firstName: "Ім'я",
    lastName: "Прізвище",
    age: "Вік",
    city: "Місто",
    bio: "Про себе",
    tellOthersAboutYourself: "Розкажіть про себе...",
    languages: "Мови",
    availableDates: "Доступні дати",
    saveChanges: "Зберегти зміни",
    identityVerification: "Підтвердження особи",
    verifyYourIdentity: "Підтвердіть свою особу для довіри",
    yourIdentityVerified: "Вашу особу підтверджено",
    verifyWithPhoto: "Підтвердіть особу за допомогою фото",
    verifyNow: "Підтвердити зараз",
    accountSettings: "Налаштування облікового запису",
    manageAccountPreferences: "Керуйте налаштуваннями облікового запису",
    email: "Електронна пошта",
    accountStatus: "Статус облікового запису",
    accountCurrentlyActive: "Ваш обліковий запис наразі активний",
    active: "Активний",
    profileVisibility: "Видимість профілю",
    makeProfileVisible: "Зробити профіль видимим для інших користувачів",
    dangerZone: "Небезпечна зона",
    irreversibleActions: "Незворотні дії",
    signOutLabel: "Вийти",
    signOutFromAccount: "Вийти з облікового запису",
    deleteAccount: "Видалити обліковий запис",
    permanentlyDeleteAccount: "Назавжди видалити обліковий запис та всі дані",
    securitySettings: "Налаштування безпеки",
    manageAccountSecurity: "Керуйте безпекою облікового запису",
    password: "Пароль",
    managedBy: "Керується",
    google: "Google",
    yourAuthProvider: "вашим провайдером автентифікації",
    changePassword: "Змінити пароль",
    twoFactorAuth: "Двофакторна автентифікація",
    addExtraSecurity: "Додати додатковий рівень безпеки",
    comingSoon: "Скоро буде",
    loginNotifications: "Сповіщення про вхід",
    getNotifiedOnLogin: "Отримувати сповіщення, коли хтось входить",
    notificationPreferences: "Налаштування сповіщень",
    chooseNotifications: "Виберіть, які сповіщення ви хочете отримувати",
    emailNotifications: "Сповіщення електронною поштою",
    receiveEmailNotifications: "Отримувати сповіщення електронною поштою",
    newInvitationAlerts: "Сповіщення про нові запрошення",
    getNotifiedOnInvitation:
      "Отримувати сповіщення, коли ви отримуєте запрошення",
    messageNotifications: "Сповіщення про повідомлення",
    getNotifiedOnMessage:
      "Отримувати сповіщення, коли ви отримуєте нові повідомлення",
    matchNotifications: "Сповіщення про збіги",
    getNotifiedOnMatch:
      "Отримувати сповіщення, коли хтось приймає ваше запрошення",
    marketingEmails: "Маркетингові листи",
    receiveMarketingEmails: "Отримувати листи про нові функції",
  },
  ru: {
    // App
    appName: "Не празднуй один",
    appTagline:
      "Инициатива, объединяющая людей в праздничный период. Есть свободный стул или ищешь тёплую компанию — тебе здесь рады.",

    // Navigation
    home: "Главная",
    browseHosts: "Просмотр Хозяев",
    browseGuests: "Просмотр Гостей",
    dashboard: "Моя Панель",
    signUp: "Регистрация",
    signIn: "Войти",
    signOut: "Выйти",
    messages: "Сообщения",
    settings: "Настройки",
    about: "О нас",
    goToApp: "В приложение",

    // Hero
    heroTitle: "В этом году",
    heroHighlight: "Не празднуй один.",
    heroDescription:
      "Эта платформа создана для тех, кто хочет делиться праздничным настроением. Если у тебя есть свободное место за столом — пригласи того, кто встречает праздники один. Если ищешь компанию — предложи себя как гостя. В этом году не празднуй один.",
    inviteGuests: "Пригласить в гости",
    becomeGuest: "Стать гостем",

    // How it works
    howItWorks: "Как это работает?",
    howItWorksSubtitle:
      "Безопасные, простые и тёплые знакомства на праздничный сезон.",
    step1Title: "Создай профиль",
    step1Description:
      "Зарегистрируйся как хозяин или гость. Расскажи о себе: языки, предпочтения в питании, выбери подходящую дату.",
    step2Title: "Найди единомышленников",
    step2Description:
      "Ищи по городу, языку или дате. Отправь запрос хозяину или гостю, с которым хотел(-а) бы встретить праздник.",
    step3Title: "Празднуйте вместе",
    step3Description:
      "Когда обе стороны согласны — свяжитесь и договоритесь о деталях. Разделите радость Рождества, Нового года или других праздников.",

    // Safety
    safetyTitle: "Твоя безопасность — на первом месте",
    identityVerificationDesc:
      "По желанию можно пройти фотоподтверждение — так хозяева и гости чувствуют себя увереннее.",
    mutualConsent: "Взаимное согласие",
    mutualConsentDesc:
      "Контактами и местоположением вы делитесь только тогда, когда сами решаете.",

    // Origin story
    originStoryTitle: "Как появилась эта инициатива",
    originStoryQuote:
      "Разговаривая с подругой украинкой, я поняла, как много людей встречают праздники одни — от беженцев войны до пожилых соседей и молодых людей, живущих далеко от дома. У нас есть место за столом, поэтому хотелось создать платформу, где незнакомцы могут стать друзями хотя бы на один тёплый вечер.",
    originStoryAuthor: "Клаудия Грабаускайте, инициатор идеи",
    originStoryDescription:
      "Не празднуй один объединяет людей, у которых есть свободное место за столом, с теми, кто хочет разделить радость Рождества и Нового года. Радость растёт, когда ею делишься.",

    // Stats
    statsLanguages: "Языка",
    statsLanguagesValue: "4",
    statsCities: "Города Литвы",
    statsCitiesValue: "60+",
    statsHolidayPeriod: "Праздничный период",
    statsHolidayPeriodValue: "23 декабря – 2 января",
    statsCommunityMembers: "Участники сообщества",
    statsCommunityMembersValue: "18+",

    // Final CTA
    finalCtaTitle: "Готов поделиться праздничным настроением?",
    finalCtaDescription:
      "Присоединяйся к сотням людей по всей Литве, которые открывают свои дома и сердца в этом сезоне.",
    getStarted: "Начать",

    // Footer
    platform: "Платформа",
    legalAndSafety: "Юридическая информация и безопасность",
    safetyGuidelines: "Правила безопасности",
    termsOfService: "Условия использования",
    privacyPolicy: "Политика конфиденциальности",
    allRightsReserved: "Все права защищены.",

    // Legacy keys (keeping for backwards compatibility)
    startAsHost: "Пригласить в гости",
    startAsGuest: "Стать гостем",
    findGathering: "Найти встречу",
    safetyAndTrust: "Безопасность и Доверие",
    mutualMatching: "Взаимное соответствие",
    mutualMatchingDesc:
      "Обе стороны должны согласиться перед обменом контактными данными.",
    communityFirst: "Сообщество прежде всего",
    communityFirstDesc:
      "Настоящие отзывы и оценки помогут вам найти правильное соответствие для вашего праздника.",
    terms: "Условия",
    privacy: "Конфиденциальность",
    contact: "Контакт",

    // Dashboard - Navigation
    navHome: "Главная",
    navProfile: "Профиль",
    navMessages: "Сообщения",
    navSettings: "Настройки",
    navFindHosts: "Найти хозяев",
    navMyProfile: "Мой профиль",
    navLocationPicker: "Выбор места",
    dontCelebrateAlone: "Не празднуй один",

    // Dashboard - Browse Page
    findAHost: "Найти хозяина",
    findGuests: "Найти гостей",
    anywhereInLithuania: "В любом месте Литвы",
    anyDates: "Любые даты",
    anyLanguage: "Любой язык",
    clearFilters: "Очистить фильтры",
    loading: "Загрузка...",
    hostsFound: "хозяев найдено",
    guestsFound: "гостей найдено",
    sortBy: "Сортировать по:",
    recommended: "Рекомендуемые",
    newest: "Новейшие",
    verified: "Подтверждён",
    unverified: "Не подтверждён",
    availability: "Доступность",
    viewProfile: "Посмотреть профиль",
    message: "Написать",
    pending: "Ожидается",
    accept: "Принять",
    requestToJoin: "Запросить присоединение",
    sendRequest: "Отправить запрос",
    noMatchesFound: "Ничего не найдено",
    tryAdjustingFilters: "Попробуйте изменить фильтры или даты.",
    clearAllFilters: "Очистить все фильтры",
    requestSent: "Запрос отправлен!",
    alreadySentRequest: "Вы уже отправили запрос этому человеку!",
    failedToSendRequest: "Не удалось отправить запрос",
    youreMatched: "Вы нашли пару! Теперь можете писать друг другу.",
    invitationNotFound: "Приглашение не найдено",
    failedToAccept: "Не удалось принять",

    // Dashboard - Settings Page
    settingsTitle: "Настройки",
    manageProfileAndAccount: "Управляйте своим профилем и аккаунтом",
    profile: "Профиль",
    account: "Аккаунт",
    security: "Безопасность",
    notifications: "Уведомления",
    profileInformation: "Информация о профиле",
    updateYourPublicProfile: "Обновите свой публичный профиль",
    iWantToBe: "Я хочу быть",
    guest: "гость",
    host: "хозяин",
    both: "оба",
    firstName: "Имя",
    lastName: "Фамилия",
    age: "Возраст",
    city: "Город",
    bio: "О себе",
    tellOthersAboutYourself: "Расскажите о себе...",
    languages: "Языки",
    availableDates: "Доступные даты",
    saveChanges: "Сохранить изменения",
    identityVerification: "Подтверждение личности",
    verifyYourIdentity: "Подтвердите свою личность для доверия",
    yourIdentityVerified: "Ваша личность подтверждена",
    verifyWithPhoto: "Подтвердите личность с помощью фото",
    verifyNow: "Подтвердить сейчас",
    accountSettings: "Настройки аккаунта",
    manageAccountPreferences: "Управляйте настройками аккаунта",
    email: "Электронная почта",
    accountStatus: "Статус аккаунта",
    accountCurrentlyActive: "Ваш аккаунт в настоящее время активен",
    active: "Активен",
    profileVisibility: "Видимость профиля",
    makeProfileVisible: "Сделать профиль видимым для других пользователей",
    dangerZone: "Опасная зона",
    irreversibleActions: "Необратимые действия",
    signOutLabel: "Выйти",
    signOutFromAccount: "Выйти из аккаунта",
    deleteAccount: "Удалить аккаунт",
    permanentlyDeleteAccount: "Навсегда удалить аккаунт и все данные",
    securitySettings: "Настройки безопасности",
    manageAccountSecurity: "Управляйте безопасностью аккаунта",
    password: "Пароль",
    managedBy: "Управляется",
    google: "Google",
    yourAuthProvider: "вашим провайдером аутентификации",
    changePassword: "Изменить пароль",
    twoFactorAuth: "Двухфакторная аутентификация",
    addExtraSecurity: "Добавить дополнительный уровень безопасности",
    comingSoon: "Скоро будет",
    loginNotifications: "Уведомления о входе",
    getNotifiedOnLogin: "Получать уведомления, когда кто-то входит",
    notificationPreferences: "Настройки уведомлений",
    chooseNotifications: "Выберите, какие уведомления вы хотите получать",
    emailNotifications: "Уведомления по электронной почте",
    receiveEmailNotifications: "Получать уведомления по электронной почте",
    newInvitationAlerts: "Уведомления о новых приглашениях",
    getNotifiedOnInvitation:
      "Получать уведомления, когда вы получаете приглашение",
    messageNotifications: "Уведомления о сообщениях",
    getNotifiedOnMessage:
      "Получать уведомления, когда вы получаете новые сообщения",
    matchNotifications: "Уведомления о совпадениях",
    getNotifiedOnMatch:
      "Получать уведомления, когда кто-то принимает ваше приглашение",
    marketingEmails: "Маркетинговые письма",
    receiveMarketingEmails: "Получать письма о новых функциях",
  },
};
