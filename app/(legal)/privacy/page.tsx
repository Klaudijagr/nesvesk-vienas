"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

type Section = {
  title: string;
  content: string | string[];
};

type PrivacyContentItem = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
};

type PrivacyContent = Record<string, PrivacyContentItem>;

const privacyContent: PrivacyContent = {
  lt: {
    title: "Privatumo politika",
    lastUpdated: "Paskutinį kartą atnaujinta: 2025 m. gruodžio mėn.",
    intro:
      "Ši privatumo politika aprašo, kaip Nešvęsk Vienas renka, naudoja ir saugo jūsų asmeninę informaciją. Naudodamiesi mūsų paslaugomis, jūs sutinkate su šia politika.",
    sections: [
      {
        title: "1. Duomenų valdytojas",
        content: [
          "Duomenų valdytojas (angl. data controller) yra subjektas, kuris nustato, kodėl ir kaip tvarkomi asmens duomenys.",
          "Šios platformos duomenų valdytojas: Nešvęsk Vienas (verslo pavadinimas) ©.",
          "Jurisdikcija: Lietuva.",
        ],
      },
      {
        title: "2. Kokią informaciją renkame",
        content: [
          "Paskyros informacija: Kai registruojatės, renkame jūsų vardą, el. pašto adresą, miestą ir profilio nuotrauką. Galite taip pat pateikti papildomą informaciją, tokią kaip amžius, kalbos ir biografija.",
          "Profilio informacija: Informacija, kurią pateikiate savo viešame profilyje, įskaitant aprašymą, nuotraukas, pasiekiamas datas ir nustatymus.",
          "Komunikacijos: Pranešimai, kuriuos siunčiate ir gaunate per mūsų platformą.",
          "Naudojimo duomenys: Informacija apie tai, kaip naudojatės mūsų paslaugomis, įskaitant IP adresą, naršyklės tipą, puslapius, kuriuos lankote, ir laiką, praleistą platformoje.",
          "Tapatybės tikrinimas: Jei naudojatės mūsų tapatybės tikrinimo funkcija, apdorojame nuotraukas vietoje jūsų įrenginyje. Mes nesaugome jūsų ID nuotraukų ar selfių serveriuose – saugomas tik tikrinimo rezultatas (patvirtinta/nepatvirtinta).",
        ],
      },
      {
        title: "3. Kaip naudojame jūsų informaciją",
        content: [
          "Paslaugų teikimas: Teikiame ir palaikome mūsų platformą, leidžiame jums kurti profilį ir bendrauti su kitais nariais.",
          "Komunikacija: Siunčiame jums svarbius pranešimus apie paslaugą, įskaitant paskyros patvirtinimus, saugumo įspėjimus ir atnaujinimus.",
          "Tobulinimas: Analizuojame naudojimo modelius, kad pagerintume mūsų paslaugas ir naudotojų patirtį.",
          "Saugumas: Naudojame informaciją sukčiavimui aptikti ir užkirsti kelią, taip pat saugoti mūsų bendruomenę.",
        ],
      },
      {
        title: "4. Informacijos dalijimasis",
        content: [
          "Vieša profilio informacija: Jūsų profilio informacija (vardas, miestas, biografija, nuotraukos, pasiekiamos datos) yra matoma kitiems platformos nariams.",
          "Privati informacija: Tam tikra informacija (pavardė, telefono numeris, adresas) atskleidžiama tik nariams, su kuriais esate susijungę (priėmę kvietimą).",
          "Jokio pardavimo: Mes neparduodame jūsų asmeninės informacijos trečiosioms šalims.",
          "Teisiniai reikalavimai: Galime atskleisti informaciją, jei to reikalauja įstatymai arba reaguojant į galiojančius teisinius procesus.",
        ],
      },
      {
        title: "5. Paslaugų teikėjai (duomenų tvarkytojai)",
        content: [
          "Mes naudojame patikimus paslaugų teikėjus (angl. processors), kad galėtume teikti paslaugas. Jie tvarko duomenis tik pagal mūsų nurodymus.",
          "Vercel (talpinimas): aptarnauja svetainės turinį, gali matyti techninius žurnalus (pvz., IP adresas, užklausos metaduomenys) saugumo ir patikimumo tikslais.",
          "Convex (duomenų bazė ir serverio funkcijos): saugo profilius, pranešimus, kvietimus ir kitus programos duomenis.",
          "Clerk (autentifikacija): tvarko prisijungimą ir paskyrų identifikatorius (pvz., el. pašto adresas, autentifikavimo metaduomenys).",
          "Maileroo (el. paštas): siunčia transakcinius el. laiškus (pvz., sisteminius pranešimus).",
          "Sentry (klaidų stebėsena): gauna techninę diagnostiką apie klaidas (pvz., įrenginio/naršyklės tipas, klaidos informacija). Mes nesiunčiame pilno PII pagal nutylėjimą.",
          "Vercel Analytics ir Speed Insights (analitika): įjungiama tik gavus jūsų sutikimą dėl analitinių slapukų.",
        ],
      },
      {
        title: "6. Teisinis pagrindas (GDPR)",
        content: [
          "Sutarties vykdymas: tvarkome paskyros ir profilio duomenis, kad galėtume teikti paslaugas (registracija, profilio rodymas, žinučių siuntimas).",
          "Teisėtas interesas: tvarkome tam tikrus techninius duomenis ir saugumo žurnalus, kad apsaugotume platformą nuo piktnaudžiavimo ir sukčiavimo.",
          "Sutikimas: analitiniai slapukai/analitika ir neprivalomi rinkodaros el. laiškai (jei pasirenkate). Sutikimą galite atšaukti bet kada.",
          "Teisinė prievolė: kai kuriuos duomenis galime saugoti/atskleisti, jei to reikalauja įstatymai.",
        ],
      },
      {
        title: "7. Duomenų saugojimas (retention)",
        content: [
          "Paskyros ir profilio duomenys: saugomi tol, kol paskyra aktyvi. Po paskyros ištrynimo paprastai ištrinami arba anonimizuojami per 30 dienų, nebent reikia ilgiau dėl teisinių/saugumo priežasčių.",
          "Žinutės ir kvietimai: saugomi tol, kol paskyra aktyvi. Po paskyros ištrynimo gali būti pašalinami per 30–90 dienų.",
          "Sutikimų įrašai (Terms/Privacy/marketing/analytics): saugomi kaip audito įrašas, kad galėtume įrodyti sutikimą ir laikytis atitikties.",
          "Serverio žurnalai ir saugumo diagnostika: paprastai saugomi 30–90 dienų (pagal paslaugų teikėjų nustatymus), nebent reikia ilgiau incidento tyrimui.",
        ],
      },
      {
        title: "8. Duomenų saugumas",
        content: [
          "Mes imamės pagrįstų techninių ir organizacinių priemonių apsaugoti jūsų asmeninę informaciją nuo neteisėtos prieigos, pakeitimo, atskleidimo ar sunaikinimo.",
          "Naudojame pramonės standartų šifravimą duomenų perdavimui ir saugojimui.",
          "Reguliariai peržiūrime ir atnaujiname savo saugumo praktikas.",
        ],
      },
      {
        title: "9. Jūsų teisės",
        content: [
          "Prieiga: Turite teisę prieiti prie savo asmeninių duomenų ir gauti jų kopiją.",
          "Taisymas: Galite prašyti ištaisyti netikslius ar neišsamius duomenis.",
          "Ištrynimas: Galite prašyti ištrinti savo paskyrą ir susijusius duomenis.",
          "Atsisakymas: Galite atsisakyti rinkodaros pranešimų bet kuriuo metu.",
          "Duomenų perkeliamumas: Galite prašyti savo duomenų struktūrizuotu, kompiuterio skaitomu formatu.",
        ],
      },
      {
        title: "10. Slapukai ir sekimo technologijos",
        content: [
          "Naudojame slapukus ir panašias technologijas, kad: palaikytume jūsų sesiją ir nustatymus, suprastume, kaip naudojate mūsų paslaugas, pagerintume jūsų patirtį.",
          "Galite valdyti slapukų nustatymus savo naršyklėje. Tačiau kai kurių slapukų išjungimas gali paveikti mūsų paslaugų funkcionalumą.",
        ],
      },
      {
        title: "11. Vaikų privatumas",
        content:
          "Mūsų paslaugos nėra skirtos asmenims jaunesniems nei 18 metų. Mes sąmoningai nerenkame asmeninės informacijos iš vaikų. Jei sužinome, kad surinkome informaciją iš vaiko, nedelsdami imsimės veiksmų ją ištrinti.",
      },
      {
        title: "12. Tarptautinis duomenų perdavimas",
        content:
          "Jūsų informacija gali būti perduodama ir apdorojama šalyse, kurios nėra jūsų gyvenamoji šalis (pvz., kai naudojame tarptautinius paslaugų teikėjus). Šios šalys gali turėti skirtingus duomenų apsaugos įstatymus. Mes imamės priemonių užtikrinti, kad jūsų informacija būtų tinkamai apsaugota.",
      },
      {
        title: "13. Šios politikos pakeitimai",
        content:
          "Galime retkarčiais atnaujinti šią privatumo politiką. Informuosime jus apie bet kokius reikšmingus pakeitimus paskelbdami naują politiką mūsų platformoje ir atnaujindami datą viršuje.",
      },
      {
        title: "14. Susisiekite su mumis",
        content:
          "Jei turite klausimų apie šią privatumo politiką ar norite pasinaudoti savo teisėmis, susisiekite su mumis el. paštu: info@nesveskvienas.lt",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: December 2025",
    intro:
      "This privacy policy describes how Nešvęsk Vienas collects, uses, and protects your personal information. By using our services, you agree to this policy.",
    sections: [
      {
        title: "1. Data Controller",
        content: [
          "The data controller is the person or entity that decides why and how personal data is processed.",
          "Data controller for this platform: Nešvęsk Vienas (business name) ©.",
          "Jurisdiction: Lithuania.",
        ],
      },
      {
        title: "2. Information We Collect",
        content: [
          "Account Information: When you register, we collect your name, email address, city, and profile photo. You may also provide additional information such as age, languages, and bio.",
          "Profile Information: Information you provide in your public profile, including description, photos, available dates, and preferences.",
          "Communications: Messages you send and receive through our platform.",
          "Usage Data: Information about how you use our services, including IP address, browser type, pages visited, and time spent on the platform.",
          "Identity Verification: If you use our identity verification feature, we process photos locally on your device. We do not store your ID photos or selfies on servers – only the verification result (verified/not verified) is stored.",
        ],
      },
      {
        title: "3. How We Use Your Information",
        content: [
          "Service Delivery: Provide and maintain our platform, allow you to create a profile and interact with other members.",
          "Communication: Send you important service notifications, including account confirmations, security alerts, and updates.",
          "Improvement: Analyze usage patterns to improve our services and user experience.",
          "Safety: Use information to detect and prevent fraud and protect our community.",
        ],
      },
      {
        title: "4. Information Sharing",
        content: [
          "Public Profile Information: Your profile information (name, city, bio, photos, available dates) is visible to other platform members.",
          "Private Information: Certain information (last name, phone number, address) is only revealed to members you are connected with (accepted invitation).",
          "No Selling: We do not sell your personal information to third parties.",
          "Legal Requirements: We may disclose information if required by law or in response to valid legal processes.",
        ],
      },
      {
        title: "5. Service Providers (Processors)",
        content: [
          "We use trusted service providers (processors) to operate the platform. They process data only on our instructions.",
          "Vercel (hosting): serves the website and may process technical logs (e.g., IP address and request metadata) for security and reliability.",
          "Convex (database and server functions): stores profiles, messages, invitations, and other app data.",
          "Clerk (authentication): handles sign-in and account identity (e.g., email address, authentication metadata).",
          "Maileroo (email delivery): sends transactional emails (service notifications).",
          "Sentry (error monitoring): receives technical diagnostics about crashes/errors (e.g., device/browser type, error details). We do not send full PII by default.",
          "Vercel Analytics and Speed Insights (analytics): enabled only after you opt in to analytics cookies.",
        ],
      },
      {
        title: "6. Legal Bases (GDPR)",
        content: [
          "Contract: to provide the services you request (account creation, profile display, messaging, invitations).",
          "Legitimate interests: to secure the platform, prevent abuse/fraud, and maintain reliability (limited technical logs and security monitoring).",
          "Consent: for analytics cookies/analytics and optional marketing emails (if you opt in). You can withdraw consent at any time.",
          "Legal obligation: when we must retain or disclose information to comply with law.",
        ],
      },
      {
        title: "7. Data Retention",
        content: [
          "Account and profile data: retained while your account is active. After account deletion, data is typically deleted or anonymized within 30 days unless we need to keep it longer for legal or security reasons.",
          "Messages and invitations: retained while your account is active and typically removed within 30–90 days after deletion.",
          "Consent records (Terms/Privacy/marketing/analytics): retained as an audit record to demonstrate compliance.",
          "Server logs and security diagnostics: typically retained for 30–90 days (depending on provider settings) unless needed longer for incident investigation.",
        ],
      },
      {
        title: "8. Data Security",
        content: [
          "We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
          "We use industry-standard encryption for data transmission and storage.",
          "We regularly review and update our security practices.",
        ],
      },
      {
        title: "9. Your Rights",
        content: [
          "Access: You have the right to access your personal data and obtain a copy.",
          "Correction: You can request correction of inaccurate or incomplete data.",
          "Deletion: You can request deletion of your account and associated data.",
          "Opt-out: You can opt out of marketing communications at any time.",
          "Data Portability: You can request your data in a structured, machine-readable format.",
        ],
      },
      {
        title: "10. Cookies and Tracking Technologies",
        content: [
          "We use cookies and similar technologies to: maintain your session and preferences, understand how you use our services, improve your experience.",
          "You can manage cookie settings in your browser. However, disabling certain cookies may affect the functionality of our services.",
        ],
      },
      {
        title: "11. Children's Privacy",
        content:
          "Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected information from a child, we will take immediate steps to delete it.",
      },
      {
        title: "12. International Data Transfer",
        content:
          "Your information may be transferred to and processed in countries other than your country of residence (for example, when we use international service providers). These countries may have different data protection laws. We take measures to ensure your information is adequately protected.",
      },
      {
        title: "13. Changes to This Policy",
        content:
          "We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our platform and updating the date at the top.",
      },
      {
        title: "14. Contact Us",
        content:
          "If you have questions about this privacy policy or want to exercise your rights, please contact us at: info@nesveskvienas.lt",
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление: декабрь 2025 г.",
    intro:
      "Эта политика конфиденциальности описывает, как Не празднуй один собирает, использует и защищает вашу личную информацию. Используя наши услуги, вы соглашаетесь с этой политикой.",
    sections: [
      {
        title: "1. Оператор данных",
        content: [
          "Оператор данных (data controller) — это лицо или организация, которые определяют цели и способы обработки персональных данных.",
          "Оператор данных для этой платформы: Nešvęsk Vienas (название бизнеса) ©.",
          "Юрисдикция: Литва.",
        ],
      },
      {
        title: "2. Какую информацию мы собираем",
        content: [
          "Информация об учетной записи: При регистрации мы собираем ваше имя, адрес электронной почты, город и фото профиля. Вы также можете предоставить дополнительную информацию, такую как возраст, языки и биографию.",
          "Информация профиля: Информация, которую вы предоставляете в своем публичном профиле, включая описание, фотографии, доступные даты и предпочтения.",
          "Коммуникации: Сообщения, которые вы отправляете и получаете через нашу платформу.",
          "Данные об использовании: Информация о том, как вы используете наши услуги, включая IP-адрес, тип браузера, посещенные страницы и время, проведенное на платформе.",
          "Проверка личности: Если вы используете функцию проверки личности, мы обрабатываем фотографии локально на вашем устройстве. Мы не храним ваши фото удостоверения личности или селфи на серверах – сохраняется только результат проверки.",
        ],
      },
      {
        title: "3. Как мы используем вашу информацию",
        content: [
          "Предоставление услуг: Предоставляем и поддерживаем нашу платформу, позволяем вам создать профиль и взаимодействовать с другими участниками.",
          "Коммуникация: Отправляем вам важные уведомления о сервисе, включая подтверждения учетной записи, предупреждения о безопасности и обновления.",
          "Улучшение: Анализируем модели использования для улучшения наших услуг и пользовательского опыта.",
          "Безопасность: Используем информацию для обнаружения и предотвращения мошенничества и защиты нашего сообщества.",
        ],
      },
      {
        title: "4. Обмен информацией",
        content: [
          "Публичная информация профиля: Информация вашего профиля (имя, город, биография, фотографии, доступные даты) видна другим участникам платформы.",
          "Личная информация: Определенная информация (фамилия, номер телефона, адрес) раскрывается только участникам, с которыми вы связаны (принятое приглашение).",
          "Без продажи: Мы не продаем вашу личную информацию третьим лицам.",
          "Юридические требования: Мы можем раскрыть информацию, если это требуется по закону или в ответ на законные правовые процессы.",
        ],
      },
      {
        title: "5. Поставщики услуг (обработчики)",
        content: [
          "Мы используем надежных поставщиков услуг (processors), чтобы предоставлять и защищать сервис. Они обрабатывают данные только по нашим инструкциям.",
          "Vercel (хостинг): предоставляет сайт и может обрабатывать технические логи (например, IP-адрес и метаданные запросов) для безопасности и надежности.",
          "Convex (база данных и серверные функции): хранит профили, сообщения, приглашения и другие данные приложения.",
          "Clerk (аутентификация): обеспечивает вход и управление учетными данными (например, email и метаданные аутентификации).",
          "Maileroo (email): отправляет транзакционные письма (уведомления сервиса).",
          "Sentry (мониторинг ошибок): получает техническую диагностику ошибок/сбоев. Мы не отправляем полные персональные данные по умолчанию.",
          "Vercel Analytics и Speed Insights (аналитика): включается только после согласия на аналитические cookie.",
        ],
      },
      {
        title: "6. Правовые основания (GDPR)",
        content: [
          "Договор: чтобы предоставлять запрошенные вами услуги (учетная запись, профиль, сообщения, приглашения).",
          "Законные интересы: безопасность платформы, предотвращение злоупотреблений/мошенничества, надежность (ограниченные технические логи).",
          "Согласие: аналитические cookie/аналитика и необязательные маркетинговые письма (если вы выбрали). Вы можете отозвать согласие в любое время.",
          "Юридическая обязанность: когда мы должны хранить или раскрывать данные по закону.",
        ],
      },
      {
        title: "7. Хранение данных",
        content: [
          "Данные учетной записи и профиля: хранятся, пока учетная запись активна. После удаления учетной записи данные обычно удаляются или обезличиваются в течение 30 дней, если не требуется более длительное хранение по юридическим или безопасностным причинам.",
          "Сообщения и приглашения: хранятся, пока учетная запись активна, и обычно удаляются в течение 30–90 дней после удаления.",
          "Записи о согласии (Terms/Privacy/marketing/analytics): хранятся как аудит-след для подтверждения соблюдения требований.",
          "Серверные логи и диагностика безопасности: обычно хранятся 30–90 дней (в зависимости от настроек провайдеров), если не требуется дольше для расследования инцидентов.",
        ],
      },
      {
        title: "8. Безопасность данных",
        content: [
          "Мы принимаем разумные технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.",
          "Мы используем шифрование отраслевого стандарта для передачи и хранения данных.",
          "Мы регулярно пересматриваем и обновляем наши практики безопасности.",
        ],
      },
      {
        title: "9. Ваши права",
        content: [
          "Доступ: Вы имеете право получить доступ к своим личным данным и получить их копию.",
          "Исправление: Вы можете запросить исправление неточных или неполных данных.",
          "Удаление: Вы можете запросить удаление своей учетной записи и связанных данных.",
          "Отказ: Вы можете отказаться от маркетинговых сообщений в любое время.",
          "Переносимость данных: Вы можете запросить свои данные в структурированном, машиночитаемом формате.",
        ],
      },
      {
        title: "10. Файлы cookie и технологии отслеживания",
        content: [
          "Мы используем файлы cookie и аналогичные технологии для: поддержания вашей сессии и настроек, понимания того, как вы используете наши услуги, улучшения вашего опыта.",
          "Вы можете управлять настройками файлов cookie в своем браузере. Однако отключение определенных файлов cookie может повлиять на функциональность наших услуг.",
        ],
      },
      {
        title: "11. Конфиденциальность детей",
        content:
          "Наши услуги не предназначены для лиц младше 18 лет. Мы сознательно не собираем личную информацию от детей. Если мы узнаем, что собрали информацию от ребенка, мы немедленно примем меры для ее удаления.",
      },
      {
        title: "12. Международная передача данных",
        content:
          "Ваша информация может быть передана и обработана в странах, отличных от страны вашего проживания (например, при использовании международных поставщиков услуг). В этих странах могут действовать другие законы о защите данных. Мы принимаем меры для обеспечения надлежащей защиты вашей информации.",
      },
      {
        title: "13. Изменения в этой политике",
        content:
          "Мы можем время от времени обновлять эту политику конфиденциальности. Мы уведомим вас о любых существенных изменениях, опубликовав новую политику на нашей платформе и обновив дату вверху.",
      },
      {
        title: "14. Свяжитесь с нами",
        content:
          "Если у вас есть вопросы об этой политике конфиденциальности или вы хотите воспользоваться своими правами, свяжитесь с нами по адресу: info@nesveskvienas.lt",
      },
    ],
  },
  ua: {
    title: "Політика конфіденційності",
    lastUpdated: "Останнє оновлення: грудень 2025 р.",
    intro:
      "Ця політика конфіденційності описує, як Не святкуй наодинці збирає, використовує та захищає вашу особисту інформацію. Використовуючи наші послуги, ви погоджуєтеся з цією політикою.",
    sections: [
      {
        title: "1. Контролер даних",
        content: [
          "Контролер даних (data controller) — це особа або організація, які визначають цілі та способи обробки персональних даних.",
          "Контролер даних для цієї платформи: Nešvęsk Vienas (назва бізнесу) ©.",
          "Юрисдикція: Литва.",
        ],
      },
      {
        title: "2. Яку інформацію ми збираємо",
        content: [
          "Інформація про обліковий запис: При реєстрації ми збираємо ваше ім'я, адресу електронної пошти, місто та фото профілю. Ви також можете надати додаткову інформацію, таку як вік, мови та біографію.",
          "Інформація профілю: Інформація, яку ви надаєте у своєму публічному профілі, включаючи опис, фотографії, доступні дати та вподобання.",
          "Комунікації: Повідомлення, які ви надсилаєте та отримуєте через нашу платформу.",
          "Дані про використання: Інформація про те, як ви використовуєте наші послуги, включаючи IP-адресу, тип браузера, відвідані сторінки та час, проведений на платформі.",
          "Перевірка особи: Якщо ви використовуєте функцію перевірки особи, ми обробляємо фотографії локально на вашому пристрої. Ми не зберігаємо ваші фото посвідчення особи або селфі на серверах – зберігається лише результат перевірки.",
        ],
      },
      {
        title: "3. Як ми використовуємо вашу інформацію",
        content: [
          "Надання послуг: Надаємо та підтримуємо нашу платформу, дозволяємо вам створити профіль та взаємодіяти з іншими учасниками.",
          "Комунікація: Надсилаємо вам важливі повідомлення про сервіс, включаючи підтвердження облікового запису, попередження про безпеку та оновлення.",
          "Покращення: Аналізуємо моделі використання для покращення наших послуг та досвіду користувачів.",
          "Безпека: Використовуємо інформацію для виявлення та запобігання шахрайству та захисту нашої спільноти.",
        ],
      },
      {
        title: "4. Обмін інформацією",
        content: [
          "Публічна інформація профілю: Інформація вашого профілю (ім'я, місто, біографія, фотографії, доступні дати) видима іншим учасникам платформи.",
          "Особиста інформація: Певна інформація (прізвище, номер телефону, адреса) розкривається лише учасникам, з якими ви з'єднані (прийняте запрошення).",
          "Без продажу: Ми не продаємо вашу особисту інформацію третім особам.",
          "Юридичні вимоги: Ми можемо розкрити інформацію, якщо це вимагається законом або у відповідь на законні правові процеси.",
        ],
      },
      {
        title: "5. Постачальники послуг (обробники)",
        content: [
          "Ми використовуємо надійних постачальників послуг (processors), щоб надавати сервіс. Вони обробляють дані лише за нашими інструкціями.",
          "Vercel (хостинг): обслуговує сайт і може обробляти технічні логи (наприклад, IP-адресу та метадані запитів) для безпеки та надійності.",
          "Convex (база даних і серверні функції): зберігає профілі, повідомлення, запрошення та інші дані.",
          "Clerk (автентифікація): забезпечує вхід і керування обліковими даними (наприклад, email і метадані автентифікації).",
          "Maileroo (email): надсилає транзакційні листи (сервісні повідомлення).",
          "Sentry (моніторинг помилок): отримує технічну діагностику помилок/збоїв. Ми не надсилаємо повні персональні дані за замовчуванням.",
          "Vercel Analytics та Speed Insights (аналітика): вмикається лише після вашої згоди на аналітичні cookie.",
        ],
      },
      {
        title: "6. Правові підстави (GDPR)",
        content: [
          "Договір: щоб надавати запитані вами послуги (обліковий запис, профіль, повідомлення, запрошення).",
          "Законні інтереси: безпека платформи, запобігання зловживанням/шахрайству та підтримка надійності (обмежені технічні логи).",
          "Згода: аналітичні cookie/аналітика та необов’язкові маркетингові листи (якщо ви обрали). Ви можете відкликати згоду в будь-який час.",
          "Юридичний обов’язок: коли ми повинні зберігати або розкривати дані відповідно до закону.",
        ],
      },
      {
        title: "7. Зберігання даних",
        content: [
          "Дані облікового запису та профілю: зберігаються, поки обліковий запис активний. Після видалення облікового запису дані зазвичай видаляються або знеособлюються протягом 30 днів, якщо не потрібне довше зберігання з юридичних або безпекових причин.",
          "Повідомлення та запрошення: зберігаються, поки обліковий запис активний, і зазвичай видаляються протягом 30–90 днів після видалення.",
          "Записи згоди (Terms/Privacy/marketing/analytics): зберігаються як аудит-запис для підтвердження дотримання вимог.",
          "Серверні логи та діагностика безпеки: зазвичай зберігаються 30–90 днів (залежно від налаштувань провайдерів), якщо не потрібно довше для розслідування інцидентів.",
        ],
      },
      {
        title: "8. Безпека даних",
        content: [
          "Ми вживаємо розумних технічних та організаційних заходів для захисту вашої особистої інформації від несанкціонованого доступу, зміни, розкриття або знищення.",
          "Ми використовуємо шифрування галузевого стандарту для передачі та зберігання даних.",
          "Ми регулярно переглядаємо та оновлюємо наші практики безпеки.",
        ],
      },
      {
        title: "9. Ваші права",
        content: [
          "Доступ: Ви маєте право отримати доступ до своїх особистих даних та отримати їх копію.",
          "Виправлення: Ви можете запросити виправлення неточних або неповних даних.",
          "Видалення: Ви можете запросити видалення свого облікового запису та пов'язаних даних.",
          "Відмова: Ви можете відмовитися від маркетингових повідомлень у будь-який час.",
          "Переносимість даних: Ви можете запросити свої дані у структурованому, машиночитабельному форматі.",
        ],
      },
      {
        title: "10. Файли cookie та технології відстеження",
        content: [
          "Ми використовуємо файли cookie та подібні технології для: підтримки вашої сесії та налаштувань, розуміння того, як ви використовуєте наші послуги, покращення вашого досвіду.",
          "Ви можете керувати налаштуваннями файлів cookie у своєму браузері. Однак вимкнення певних файлів cookie може вплинути на функціональність наших послуг.",
        ],
      },
      {
        title: "11. Конфіденційність дітей",
        content:
          "Наші послуги не призначені для осіб молодше 18 років. Ми свідомо не збираємо особисту інформацію від дітей. Якщо ми дізнаємося, що зібрали інформацію від дитини, ми негайно вживемо заходів для її видалення.",
      },
      {
        title: "12. Міжнародна передача даних",
        content:
          "Ваша інформація може бути передана та оброблена в країнах, відмінних від країни вашого проживання (наприклад, при використанні міжнародних постачальників послуг). У цих країнах можуть діяти інші закони про захист даних. Ми вживаємо заходів для забезпечення належного захисту вашої інформації.",
      },
      {
        title: "13. Зміни до цієї політики",
        content:
          "Ми можемо час від часу оновлювати цю політику конфіденційності. Ми повідомимо вас про будь-які істотні зміни, опублікувавши нову політику на нашій платформі та оновивши дату вгорі.",
      },
      {
        title: "14. Зв'яжіться з нами",
        content:
          "Якщо у вас є запитання щодо цієї політики конфіденційності або ви хочете скористатися своїми правами, зв'яжіться з нами за адресою: info@nesveskvienas.lt",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { t, locale } = useLocale();
  const c = privacyContent[locale] || privacyContent.lt;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          className="mb-8 inline-flex items-center text-green-700 transition-colors hover:text-green-800 active:scale-95"
          href="/browse"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.home}
        </Link>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Lock className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="font-bold text-3xl text-gray-900">{c.title}</h1>
              <p className="text-gray-500 text-sm">{c.lastUpdated}</p>
            </div>
          </div>

          <p className="mb-8 text-gray-600 text-lg">{c.intro}</p>

          <div className="space-y-8">
            {c.sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 font-semibold text-gray-900 text-xl">
                  {section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="list-inside list-disc space-y-2">
                    {section.content.map((item, index) => (
                      <li
                        className="text-gray-600 leading-relaxed"
                        key={`${section.title}-${index}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
