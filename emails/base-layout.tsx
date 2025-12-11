import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

// Supported locales
export type Locale = "lt" | "en" | "ua" | "ru";

// Email translations
export const emailTranslations = {
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
    tagline: "Don't celebrate alone this year. Share the holiday joy.",
    notificationSettings: "Notification Settings",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",
    copyright: "All rights reserved.",
    testSuccess: "Email Test Successful!",
    testMessage: "This is a test email from the Nešvęsk vienas platform.",
    testWorking:
      "If you received this, the email integration is working correctly.",
    sentAt: "Sent at:",
    newInvitation: "You have a new invitation!",
    invitedYou: "has invited you to celebrate",
    together: "together.",
    invitationIntro:
      "This could be the start of a wonderful holiday connection. Check out their profile and decide if you'd like to accept.",
    viewInvitation: "View Invitation",
    invitationTip:
      "Tip: Take your time to review their profile before responding. Look for shared interests and make sure you feel comfortable.",
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
    invitationUpdate: "Invitation Update",
    unableToJoin: "isn't able to join you for",
    thisTime: "this time.",
    declinedIntro:
      "Don't be discouraged! There are many wonderful people on the platform looking for holiday companions. Your perfect match might be just a click away.",
    browseMore: "Browse More Profiles",
    encouragement:
      "Remember: Every connection is a chance to make someone's holiday special. Keep reaching out—the right match is out there!",
    newMessage: "You have a new message!",
    sentYouMessage:
      "sent you a message. Don't keep them waiting—check it out and continue the conversation!",
    readMessage: "Read Message",
    messageTip:
      "Quick tip: Timely responses help build trust and make coordinating your holiday celebration easier.",
  },
  ua: {
    tagline: "Цього року не святкуй на самоті. Поділися святковою радістю.",
    notificationSettings: "Налаштування сповіщень",
    privacyPolicy: "Політика конфіденційності",
    terms: "Умови",
    copyright: "Усі права захищені.",
    testSuccess: "Тест електронної пошти успішний!",
    testMessage: "Це тестовий лист з платформи Nešvęsk vienas.",
    testWorking:
      "Якщо ви отримали це, інтеграція електронної пошти працює правильно.",
    sentAt: "Надіслано:",
    newInvitation: "У вас нове запрошення!",
    invitedYou: "запросив вас святкувати",
    together: "разом.",
    invitationIntro:
      "Це може бути початок чудового святкового знайомства. Перегляньте профіль і вирішіть, чи хочете прийняти.",
    viewInvitation: "Переглянути запрошення",
    invitationTip:
      "Порада: Не поспішайте переглянути профіль перед відповіддю. Шукайте спільні інтереси та переконайтеся, що вам комфортно.",
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
    invitationUpdate: "Оновлення запрошення",
    unableToJoin: "не може приєднатися до вас",
    thisTime: "цього разу.",
    declinedIntro:
      "Не засмучуйтесь! На платформі багато чудових людей, які шукають святкову компанію. Ваша ідеальна пара може бути за один клік.",
    browseMore: "Переглянути більше профілів",
    encouragement:
      "Пам'ятайте: Кожне знайомство — це шанс зробити чиєсь свято особливим. Продовжуйте шукати — правильна людина чекає!",
    newMessage: "У вас нове повідомлення!",
    sentYouMessage:
      "надіслав вам повідомлення. Не змушуйте чекати — перегляньте та продовжіть розмову!",
    readMessage: "Читати повідомлення",
    messageTip:
      "Швидка порада: Своєчасні відповіді допомагають будувати довіру та полегшують планування святкування.",
  },
  ru: {
    tagline: "Не празднуй один в этом году. Поделись праздничной радостью.",
    notificationSettings: "Настройки уведомлений",
    privacyPolicy: "Политика конфиденциальности",
    terms: "Условия",
    copyright: "Все права защищены.",
    testSuccess: "Тест электронной почты успешен!",
    testMessage: "Это тестовое письмо с платформы Nešvęsk vienas.",
    testWorking:
      "Если вы получили это, интеграция электронной почты работает правильно.",
    sentAt: "Отправлено:",
    newInvitation: "У вас новое приглашение!",
    invitedYou: "пригласил вас праздновать",
    together: "вместе.",
    invitationIntro:
      "Это может быть началом замечательного праздничного знакомства. Просмотрите профиль и решите, хотите ли принять.",
    viewInvitation: "Посмотреть приглашение",
    invitationTip:
      "Совет: Не спешите просмотреть профиль перед ответом. Ищите общие интересы и убедитесь, что вам комфортно.",
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
    invitationUpdate: "Обновление приглашения",
    unableToJoin: "не может присоединиться к вам",
    thisTime: "в этот раз.",
    declinedIntro:
      "Не расстраивайтесь! На платформе много замечательных людей, ищущих праздничную компанию. Ваша идеальная пара может быть в одном клике.",
    browseMore: "Просмотреть больше профилей",
    encouragement:
      "Помните: Каждое знакомство — это шанс сделать чей-то праздник особенным. Продолжайте искать — правильный человек ждёт!",
    newMessage: "У вас новое сообщение!",
    sentYouMessage:
      "отправил вам сообщение. Не заставляйте ждать — просмотрите и продолжите разговор!",
    readMessage: "Читать сообщение",
    messageTip:
      "Быстрый совет: Своевременные ответы помогают строить доверие и облегчают планирование празднования.",
  },
};

export function getTranslations(locale: Locale) {
  return emailTranslations[locale] || emailTranslations.en;
}

// Site colors (matching the dark theme)
export const colors = {
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

type BaseLayoutProps = {
  preview: string;
  children: React.ReactNode;
  locale?: Locale;
};

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

export const BaseLayout = ({
  preview,
  children,
  locale = "lt",
}: BaseLayoutProps) => {
  const t = getTranslations(locale);

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Nešvęsk vienas</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerTagline}>{t.tagline}</Text>
            <Text style={footerLinks}>
              <Link href={`${baseUrl}/settings`} style={footerLink}>
                {t.notificationSettings}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/privacy`} style={footerLink}>
                {t.privacyPolicy}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/terms`} style={footerLink}>
                {t.terms}
              </Link>
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} Nešvęsk vienas. {t.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Dark theme matching site
const main = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: colors.cardBg,
  margin: "0 auto",
  padding: "0",
  marginTop: "40px",
  marginBottom: "40px",
  maxWidth: "600px",
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  overflow: "hidden" as const,
};

const header = {
  padding: "24px 32px",
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.background,
};

const logo = {
  color: colors.amber,
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0",
  fontFamily: "Georgia, serif",
};

const content = {
  padding: "32px",
};

const footer = {
  padding: "24px 32px",
  borderTop: `1px solid ${colors.border}`,
  textAlign: "center" as const,
  backgroundColor: colors.background,
};

const footerTagline = {
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 16px",
  fontStyle: "italic" as const,
};

const footerLinks = {
  color: colors.textMuted,
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const footerLink = {
  color: colors.amber,
  textDecoration: "none",
};

const copyright = {
  color: colors.textMuted,
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0",
};

export default BaseLayout;
