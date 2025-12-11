"use client";

import { useState } from "react";

// Supported locales
type Locale = "lt" | "en" | "ua" | "ru";

// Email translations (same as convex/emailTemplates.tsx)
const emailTranslations = {
  lt: {
    // Common
    tagline: "Šiemet nešvęsk vienas. Dalinkis švenčių džiaugsmu.",
    notificationSettings: "Pranešimų nustatymai",
    privacyPolicy: "Privatumo politika",
    terms: "Sąlygos",
    copyright: "Visos teisės saugomos.",
    // Test
    testSuccess: "El. pašto testas sėkmingas!",
    testMessage: "Tai yra bandomasis el. laiškas iš Nešvęsk vienas platformos.",
    testWorking:
      "Jei gavote šį laišką, el. pašto integracija veikia teisingai.",
    sentAt: "Išsiųsta:",
    // Invitation Received
    newInvitation: "Gavote naują kvietimą!",
    invitedYou: "pakvietė jus švęsti",
    together: "kartu.",
    invitationIntro:
      "Tai gali būti nuostabios šventinės draugystės pradžia. Peržiūrėkite profilį ir nuspręskite, ar norite priimti kvietimą.",
    viewInvitation: "Peržiūrėti kvietimą",
    invitationTip:
      "Patarimas: Neskubėkite peržiūrėti profilio prieš atsakydami. Ieškokite bendrų interesų ir įsitikinkite, kad jaučiatės patogiai.",
    // Invitation Accepted
    youHaveMatch: "Turite atitikmenį!",
    acceptedYour: "priėmė jūsų kvietimą švęsti",
    matchIntro:
      "Dabar galite matyti visą kontaktinę informaciją ir pradėti planuoti šventinį susitikimą. Drąsiai rašykite ir prisistatykite!",
    startChatting: "Pradėti pokalbį",
    nextSteps: "Kiti žingsniai:",
    step1: "Parašykite draugišką žinutę ir prisistatykite",
    step2: "Aptarkite lūkesčius ir mitybos pageidavimus",
    step3: "Patvirtinkite laiką ir vietą",
    step4: "Pasidalinkite telefonų numeriais koordinavimui",
    // Invitation Declined
    invitationUpdate: "Kvietimo atnaujinimas",
    unableToJoin: "negali prisijungti prie jūsų",
    thisTime: "šį kartą.",
    declinedIntro:
      "Nenusiminkite! Platformoje yra daug nuostabių žmonių, ieškančių šventinės kompanijos. Jūsų tobulas atitikmuo gali būti vos per vieną paspaudimą.",
    browseMore: "Naršyti daugiau profilių",
    encouragement:
      "Atminkite: Kiekviena pažintis yra galimybė padaryti kieno nors šventes ypatingas. Tęskite paiešką — tinkamas žmogus laukia!",
    // New Message
    newMessage: "Gavote naują žinutę!",
    sentYouMessage:
      "atsiuntė jums žinutę. Nedelskite — peržiūrėkite ir tęskite pokalbį!",
    readMessage: "Skaityti žinutę",
    messageTip:
      "Greitas patarimas: Laiku atsakymas padeda kurti pasitikėjimą ir palengvina šventinio susitikimo planavimą.",
  },
  en: {
    // Common
    tagline: "Don't celebrate alone this year. Share the holiday joy.",
    notificationSettings: "Notification Settings",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",
    copyright: "All rights reserved.",
    // Test
    testSuccess: "Email Test Successful!",
    testMessage: "This is a test email from the Nešvęsk vienas platform.",
    testWorking:
      "If you received this, the email integration is working correctly.",
    sentAt: "Sent at:",
    // Invitation Received
    newInvitation: "You have a new invitation!",
    invitedYou: "has invited you to celebrate",
    together: "together.",
    invitationIntro:
      "This could be the start of a wonderful holiday connection. Check out their profile and decide if you'd like to accept.",
    viewInvitation: "View Invitation",
    invitationTip:
      "Tip: Take your time to review their profile before responding. Look for shared interests and make sure you feel comfortable.",
    // Invitation Accepted
    youHaveMatch: "You have a match!",
    acceptedYour: "has accepted your invitation to celebrate",
    matchIntro:
      "You can now see their full contact details and start coordinating your holiday celebration. Don't be shy—reach out and introduce yourself!",
    startChatting: "Start Chatting",
    nextSteps: "Next Steps:",
    step1: "Send a friendly message to introduce yourself",
    step2: "Discuss expectations and any dietary preferences",
    step3: "Confirm the time and location details",
    step4: "Exchange phone numbers for day-of coordination",
    // Invitation Declined
    invitationUpdate: "Invitation Update",
    unableToJoin: "isn't able to join you for",
    thisTime: "this time.",
    declinedIntro:
      "Don't be discouraged! There are many wonderful people on the platform looking for holiday companions. Your perfect match might be just a click away.",
    browseMore: "Browse More Profiles",
    encouragement:
      "Remember: Every connection is a chance to make someone's holiday special. Keep reaching out—the right match is out there!",
    // New Message
    newMessage: "You have a new message!",
    sentYouMessage:
      "sent you a message. Don't keep them waiting—check it out and continue the conversation!",
    readMessage: "Read Message",
    messageTip:
      "Quick tip: Timely responses help build trust and make coordinating your holiday celebration easier.",
  },
  ua: {
    // Common
    tagline: "Цього року не святкуй на самоті. Поділися святковою радістю.",
    notificationSettings: "Налаштування сповіщень",
    privacyPolicy: "Політика конфіденційності",
    terms: "Умови",
    copyright: "Усі права захищені.",
    // Test
    testSuccess: "Тест електронної пошти успішний!",
    testMessage: "Це тестовий лист з платформи Nešvęsk vienas.",
    testWorking:
      "Якщо ви отримали це, інтеграція електронної пошти працює правильно.",
    sentAt: "Надіслано:",
    // Invitation Received
    newInvitation: "У вас нове запрошення!",
    invitedYou: "запросив вас святкувати",
    together: "разом.",
    invitationIntro:
      "Це може бути початок чудового святкового знайомства. Перегляньте профіль і вирішіть, чи хочете прийняти.",
    viewInvitation: "Переглянути запрошення",
    invitationTip:
      "Порада: Не поспішайте переглянути профіль перед відповіддю. Шукайте спільні інтереси та переконайтеся, що вам комфортно.",
    // Invitation Accepted
    youHaveMatch: "У вас є пара!",
    acceptedYour: "прийняв ваше запрошення святкувати",
    matchIntro:
      "Тепер ви можете бачити повну контактну інформацію та почати планувати святкування. Не соромтеся — напишіть і представтеся!",
    startChatting: "Почати розмову",
    nextSteps: "Наступні кроки:",
    step1: "Напишіть дружнє повідомлення та представтеся",
    step2: "Обговоріть очікування та дієтичні уподобання",
    step3: "Підтвердіть час і місце",
    step4: "Обміняйтеся номерами телефонів для координації",
    // Invitation Declined
    invitationUpdate: "Оновлення запрошення",
    unableToJoin: "не може приєднатися до вас",
    thisTime: "цього разу.",
    declinedIntro:
      "Не засмучуйтесь! На платформі багато чудових людей, які шукають святкову компанію. Ваша ідеальна пара може бути за один клік.",
    browseMore: "Переглянути більше профілів",
    encouragement:
      "Пам'ятайте: Кожне знайомство — це шанс зробити чиєсь свято особливим. Продовжуйте шукати — правильна людина чекає!",
    // New Message
    newMessage: "У вас нове повідомлення!",
    sentYouMessage:
      "надіслав вам повідомлення. Не змушуйте чекати — перегляньте та продовжіть розмову!",
    readMessage: "Читати повідомлення",
    messageTip:
      "Швидка порада: Своєчасні відповіді допомагають будувати довіру та полегшують планування святкування.",
  },
  ru: {
    // Common
    tagline: "Не празднуй один в этом году. Поделись праздничной радостью.",
    notificationSettings: "Настройки уведомлений",
    privacyPolicy: "Политика конфиденциальности",
    terms: "Условия",
    copyright: "Все права защищены.",
    // Test
    testSuccess: "Тест электронной почты успешен!",
    testMessage: "Это тестовое письмо с платформы Nešvęsk vienas.",
    testWorking:
      "Если вы получили это, интеграция электронной почты работает правильно.",
    sentAt: "Отправлено:",
    // Invitation Received
    newInvitation: "У вас новое приглашение!",
    invitedYou: "пригласил вас праздновать",
    together: "вместе.",
    invitationIntro:
      "Это может быть началом замечательного праздничного знакомства. Просмотрите профиль и решите, хотите ли принять.",
    viewInvitation: "Посмотреть приглашение",
    invitationTip:
      "Совет: Не спешите просмотреть профиль перед ответом. Ищите общие интересы и убедитесь, что вам комфортно.",
    // Invitation Accepted
    youHaveMatch: "У вас есть пара!",
    acceptedYour: "принял ваше приглашение праздновать",
    matchIntro:
      "Теперь вы можете видеть полную контактную информацию и начать планировать празднование. Не стесняйтесь — напишите и представьтесь!",
    startChatting: "Начать разговор",
    nextSteps: "Следующие шаги:",
    step1: "Напишите дружеское сообщение и представьтесь",
    step2: "Обсудите ожидания и диетические предпочтения",
    step3: "Подтвердите время и место",
    step4: "Обменяйтесь номерами телефонов для координации",
    // Invitation Declined
    invitationUpdate: "Обновление приглашения",
    unableToJoin: "не может присоединиться к вам",
    thisTime: "в этот раз.",
    declinedIntro:
      "Не расстраивайтесь! На платформе много замечательных людей, ищущих праздничную компанию. Ваша идеальная пара может быть в одном клике.",
    browseMore: "Просмотреть больше профилей",
    encouragement:
      "Помните: Каждое знакомство — это шанс сделать чей-то праздник особенным. Продолжайте искать — правильный человек ждёт!",
    // New Message
    newMessage: "У вас новое сообщение!",
    sentYouMessage:
      "отправил вам сообщение. Не заставляйте ждать — просмотрите и продолжите разговор!",
    readMessage: "Читать сообщение",
    messageTip:
      "Быстрый совет: Своевременные ответы помогают строить доверие и облегчают планирование празднования.",
  },
};

// Site colors (matching the dark theme)
const colors = {
  background: "#0F172A", // slate-900
  cardBg: "#1E293B", // slate-800
  border: "#334155", // slate-700
  text: "#CBD5E1", // slate-300
  textMuted: "#94A3B8", // slate-400
  textLight: "#F8FAFC", // slate-50
  amber: "#F59E0B", // amber-500
  amberLight: "#FCD34D", // amber-300
  green: "#22C55E", // green-500
  greenLight: "#86EFAC", // green-300
};

type EmailType =
  | "test"
  | "invitationReceived"
  | "invitationAccepted"
  | "invitationDeclined"
  | "newMessage";

const emailTypes: { value: EmailType; label: string }[] = [
  { value: "test", label: "Test Email" },
  { value: "invitationReceived", label: "Invitation Received" },
  { value: "invitationAccepted", label: "Invitation Accepted" },
  { value: "invitationDeclined", label: "Invitation Declined" },
  { value: "newMessage", label: "New Message" },
];

const locales: { value: Locale; label: string }[] = [
  { value: "lt", label: "Lietuvių" },
  { value: "en", label: "English" },
  { value: "ua", label: "Українська" },
  { value: "ru", label: "Русский" },
];

function getTranslations(locale: Locale) {
  return emailTranslations[locale] || emailTranslations.en;
}

// Email preview component
function EmailPreview({ type, locale }: { type: EmailType; locale: Locale }) {
  const t = getTranslations(locale);
  const senderName = "Jonas Jonaitis";
  const date = "24 Dec";

  const baseUrl = "https://nesveskvienas.lt";

  return (
    <div style={{ backgroundColor: colors.background, padding: "40px 0" }}>
      <div
        style={{
          backgroundColor: colors.cardBg,
          margin: "0 auto",
          maxWidth: "600px",
          borderRadius: "16px",
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.background,
          }}
        >
          <div
            style={{
              color: colors.amber,
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              fontFamily: "Georgia, serif",
            }}
          >
            Nešvęsk vienas
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {type === "test" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "56px" }}>✅</span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontFamily: "Georgia, serif",
                  color: colors.green,
                }}
              >
                {t.testSuccess}
              </h1>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                  textAlign: "center",
                }}
              >
                {t.testMessage}
              </p>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                  textAlign: "center",
                }}
              >
                {t.testWorking}
              </p>
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: "12px",
                  textAlign: "center",
                  margin: "24px 0 0",
                }}
              >
                {t.sentAt} {new Date().toISOString()}
              </p>
            </>
          )}

          {type === "invitationReceived" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "56px" }}>🎄</span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontFamily: "Georgia, serif",
                  color: colors.amber,
                }}
              >
                {t.newInvitation}
              </h1>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                <strong style={{ color: colors.textLight }}>
                  {senderName}
                </strong>{" "}
                {t.invitedYou}{" "}
                <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
                {t.together}
              </p>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                {t.invitationIntro}
              </p>
              <div style={{ textAlign: "center", margin: "32px 0" }}>
                <a
                  href={`${baseUrl}/browse`}
                  style={{
                    backgroundColor: colors.amber,
                    borderRadius: "8px",
                    color: colors.background,
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "14px 32px",
                  }}
                >
                  {t.viewInvitation}
                </a>
              </div>
              <div
                style={{
                  backgroundColor: colors.background,
                  borderRadius: "8px",
                  color: colors.text,
                  fontSize: "14px",
                  lineHeight: "22px",
                  padding: "16px",
                  margin: "24px 0 0",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <strong>💡 {t.invitationTip.split(":")[0]}:</strong>
                {t.invitationTip.split(":")[1]}
              </div>
            </>
          )}

          {type === "invitationAccepted" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "56px" }}>🎉</span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontFamily: "Georgia, serif",
                  color: colors.green,
                }}
              >
                {t.youHaveMatch}
              </h1>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                <strong style={{ color: colors.textLight }}>
                  {senderName}
                </strong>{" "}
                {t.acceptedYour}{" "}
                <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
                {t.together}
              </p>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                {t.matchIntro}
              </p>
              <div style={{ textAlign: "center", margin: "32px 0" }}>
                <a
                  href={`${baseUrl}/messages`}
                  style={{
                    backgroundColor: colors.green,
                    borderRadius: "8px",
                    color: colors.background,
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "14px 32px",
                  }}
                >
                  {t.startChatting}
                </a>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "8px",
                  padding: "20px",
                  marginTop: "24px",
                  border: `1px solid ${colors.green}`,
                }}
              >
                <p
                  style={{
                    color: colors.greenLight,
                    fontSize: "14px",
                    fontWeight: "bold",
                    margin: "0 0 12px",
                  }}
                >
                  {t.nextSteps}
                </p>
                <p
                  style={{
                    color: colors.text,
                    fontSize: "14px",
                    lineHeight: "26px",
                    margin: 0,
                  }}
                >
                  ✓ {t.step1}
                </p>
                <p
                  style={{
                    color: colors.text,
                    fontSize: "14px",
                    lineHeight: "26px",
                    margin: 0,
                  }}
                >
                  ✓ {t.step2}
                </p>
                <p
                  style={{
                    color: colors.text,
                    fontSize: "14px",
                    lineHeight: "26px",
                    margin: 0,
                  }}
                >
                  ✓ {t.step3}
                </p>
                <p
                  style={{
                    color: colors.text,
                    fontSize: "14px",
                    lineHeight: "26px",
                    margin: 0,
                  }}
                >
                  ✓ {t.step4}
                </p>
              </div>
            </>
          )}

          {type === "invitationDeclined" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "56px" }}>💫</span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontFamily: "Georgia, serif",
                  color: colors.textMuted,
                }}
              >
                {t.invitationUpdate}
              </h1>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                <strong style={{ color: colors.textLight }}>
                  {senderName}
                </strong>{" "}
                {t.unableToJoin}{" "}
                <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
                {t.thisTime}
              </p>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                }}
              >
                {t.declinedIntro}
              </p>
              <div style={{ textAlign: "center", margin: "32px 0" }}>
                <a
                  href={`${baseUrl}/browse`}
                  style={{
                    backgroundColor: colors.amber,
                    borderRadius: "8px",
                    color: colors.background,
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "14px 32px",
                  }}
                >
                  {t.browseMore}
                </a>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "8px",
                  color: colors.amberLight,
                  fontSize: "14px",
                  lineHeight: "22px",
                  padding: "16px",
                  margin: "24px 0 0",
                  textAlign: "center",
                  border: `1px solid ${colors.amber}`,
                }}
              >
                {t.encouragement}
              </div>
            </>
          )}

          {type === "newMessage" && (
            <>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "56px" }}>💬</span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontFamily: "Georgia, serif",
                  color: colors.amber,
                }}
              >
                {t.newMessage}
              </h1>
              <p
                style={{
                  color: colors.text,
                  fontSize: "16px",
                  lineHeight: "28px",
                  margin: "0 0 16px",
                  textAlign: "center",
                }}
              >
                <strong style={{ color: colors.textLight }}>
                  {senderName}
                </strong>{" "}
                {t.sentYouMessage}
              </p>
              <div style={{ textAlign: "center", margin: "32px 0" }}>
                <a
                  href={`${baseUrl}/messages`}
                  style={{
                    backgroundColor: colors.amber,
                    borderRadius: "8px",
                    color: colors.background,
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "inline-block",
                    padding: "14px 32px",
                  }}
                >
                  {t.readMessage}
                </a>
              </div>
              <div
                style={{
                  backgroundColor: colors.background,
                  borderRadius: "8px",
                  color: colors.text,
                  fontSize: "14px",
                  lineHeight: "22px",
                  padding: "16px",
                  margin: "24px 0 0",
                  border: `1px solid ${colors.border}`,
                  textAlign: "center",
                }}
              >
                <strong>💡</strong> {t.messageTip}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "24px 32px",
            borderTop: `1px solid ${colors.border}`,
            textAlign: "center",
            backgroundColor: colors.background,
          }}
        >
          <p
            style={{
              color: colors.textMuted,
              fontSize: "14px",
              lineHeight: "24px",
              margin: "0 0 16px",
              fontStyle: "italic",
            }}
          >
            {t.tagline}
          </p>
          <p
            style={{
              color: colors.textMuted,
              fontSize: "12px",
              lineHeight: "20px",
              margin: "0 0 8px",
            }}
          >
            <a
              href={`${baseUrl}/settings`}
              style={{ color: colors.amber, textDecoration: "none" }}
            >
              {t.notificationSettings}
            </a>
            {" • "}
            <a
              href={`${baseUrl}/privacy`}
              style={{ color: colors.amber, textDecoration: "none" }}
            >
              {t.privacyPolicy}
            </a>
            {" • "}
            <a
              href={`${baseUrl}/terms`}
              style={{ color: colors.amber, textDecoration: "none" }}
            >
              {t.terms}
            </a>
          </p>
          <p
            style={{
              color: colors.textMuted,
              fontSize: "12px",
              lineHeight: "20px",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Nešvęsk vienas. {t.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmailPreviewPage() {
  const [selectedType, setSelectedType] =
    useState<EmailType>("invitationReceived");
  const [selectedLocale, setSelectedLocale] = useState<Locale>("lt");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Control Panel */}
      <div className="sticky top-0 z-10 border-slate-700 border-b bg-slate-900 p-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold font-serif text-amber-500 text-lg">
              Nešvęsk vienas
            </span>
            <span className="text-slate-400 text-sm">Email Preview</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Email Type Selector */}
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm" htmlFor="email-type">
                Template:
              </label>
              <select
                className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                id="email-type"
                onChange={(e) => setSelectedType(e.target.value as EmailType)}
                value={selectedType}
              >
                {emailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm" htmlFor="locale">
                Language:
              </label>
              <select
                className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                id="locale"
                onChange={(e) => setSelectedLocale(e.target.value as Locale)}
                value={selectedLocale}
              >
                {locales.map((locale) => (
                  <option key={locale.value} value={locale.value}>
                    {locale.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="py-8">
        <EmailPreview locale={selectedLocale} type={selectedType} />
      </div>

      {/* Info Box */}
      <div className="mx-auto max-w-2xl px-4 pb-8">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-400 text-sm">
          <p className="mb-2">
            <strong className="text-slate-200">Preview mode:</strong> This page
            shows how emails will look when sent to users.
          </p>
          <p>
            Use the selectors above to preview different email types and
            languages. The actual emails are sent via Maileroo when events occur
            in the app (invitations, matches, messages).
          </p>
        </div>
      </div>
    </div>
  );
}
