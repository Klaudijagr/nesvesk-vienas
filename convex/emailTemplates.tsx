"use node";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import type * as React from "react";

// Supported locales
type Locale = "lt" | "en" | "ua" | "ru";

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

// Email translations
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

function getTranslations(locale: Locale) {
  return emailTranslations[locale] || emailTranslations.en;
}

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
  amberDark: "#B45309", // amber-700
  green: "#22C55E", // green-500
  greenLight: "#86EFAC", // green-300
};

// Base layout component
function BaseLayout({
  preview,
  children,
  locale = "lt",
}: {
  preview: string;
  children: React.ReactNode;
  locale?: Locale;
}) {
  const t = getTranslations(locale);

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logo}>Nešvęsk vienas</Text>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Section style={styles.footer}>
            <Text style={styles.footerTagline}>{t.tagline}</Text>
            <Text style={styles.footerLinks}>
              <Link href={`${baseUrl}/settings`} style={styles.footerLink}>
                {t.notificationSettings}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/privacy`} style={styles.footerLink}>
                {t.privacyPolicy}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/terms`} style={styles.footerLink}>
                {t.terms}
              </Link>
            </Text>
            <Text style={styles.copyright}>
              © {new Date().getFullYear()} Nešvęsk vienas. {t.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email Templates
function TestEmailTemplate({ locale = "lt" }: { locale?: Locale }) {
  const t = getTranslations(locale);
  return (
    <BaseLayout locale={locale} preview={t.testSuccess}>
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>✅</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.green }}>
        {t.testSuccess}
      </Heading>
      <Text style={styles.paragraphCenter}>{t.testMessage}</Text>
      <Text style={styles.paragraphCenter}>{t.testWorking}</Text>
      <Text style={styles.timestamp}>
        {t.sentAt} {new Date().toISOString()}
      </Text>
    </BaseLayout>
  );
}

function InvitationReceivedTemplate({
  senderName,
  date,
  locale = "lt",
}: {
  senderName: string;
  date: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  return (
    <BaseLayout
      locale={locale}
      preview={`${senderName} ${t.invitedYou} ${date}!`}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>🎄</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.amber }}>
        {t.newInvitation}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.invitedYou}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>
      <Text style={styles.paragraph}>{t.invitationIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={styles.buttonAmber}>
          {t.viewInvitation}
        </Button>
      </Section>
      <Text style={styles.tipBox}>
        <strong>💡 {t.invitationTip.split(":")[0]}:</strong>
        {t.invitationTip.split(":")[1]}
      </Text>
    </BaseLayout>
  );
}

function InvitationAcceptedTemplate({
  accepterName,
  date,
  locale = "lt",
}: {
  accepterName: string;
  date: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  return (
    <BaseLayout
      locale={locale}
      preview={`${accepterName} ${t.acceptedYour} ${date}!`}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>🎉</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.green }}>
        {t.youHaveMatch}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{accepterName}</strong>{" "}
        {t.acceptedYour}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>
      <Text style={styles.paragraph}>{t.matchIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={styles.buttonGreen}>
          {t.startChatting}
        </Button>
      </Section>
      <Section style={styles.nextStepsBox}>
        <Text style={styles.nextStepsTitle}>{t.nextSteps}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step1}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step2}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step3}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step4}</Text>
      </Section>
    </BaseLayout>
  );
}

function InvitationDeclinedTemplate({
  declinerName,
  date,
  locale = "lt",
}: {
  declinerName: string;
  date: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  return (
    <BaseLayout locale={locale} preview={`${t.invitationUpdate}: ${date}`}>
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>💫</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.textMuted }}>
        {t.invitationUpdate}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{declinerName}</strong>{" "}
        {t.unableToJoin}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.thisTime}
      </Text>
      <Text style={styles.paragraph}>{t.declinedIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={styles.buttonAmber}>
          {t.browseMore}
        </Button>
      </Section>
      <Text style={styles.encouragementBox}>{t.encouragement}</Text>
    </BaseLayout>
  );
}

function NewMessageTemplate({
  senderName,
  locale = "lt",
}: {
  senderName: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  return (
    <BaseLayout locale={locale} preview={`${t.newMessage} - ${senderName}`}>
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>💬</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.amber }}>
        {t.newMessage}
      </Heading>
      <Text style={styles.paragraphCenter}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.sentYouMessage}
      </Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={styles.buttonAmber}>
          {t.readMessage}
        </Button>
      </Section>
      <Text style={{ ...styles.tipBox, textAlign: "center" as const }}>
        <strong>💡</strong> {t.messageTip}
      </Text>
    </BaseLayout>
  );
}

// Styles - Dark theme matching site
const styles = {
  main: {
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },
  container: {
    backgroundColor: colors.cardBg,
    margin: "0 auto",
    padding: "0",
    marginTop: "40px",
    marginBottom: "40px",
    maxWidth: "600px",
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
  },
  header: {
    padding: "24px 32px",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
  },
  logo: {
    color: colors.amber,
    fontSize: "24px",
    fontWeight: "bold" as const,
    margin: "0",
    fontFamily: "Georgia, serif",
  },
  content: {
    padding: "32px",
  },
  footer: {
    padding: "24px 32px",
    borderTop: `1px solid ${colors.border}`,
    textAlign: "center" as const,
    backgroundColor: colors.background,
  },
  footerTagline: {
    color: colors.textMuted,
    fontSize: "14px",
    lineHeight: "24px",
    margin: "0 0 16px",
    fontStyle: "italic" as const,
  },
  footerLinks: {
    color: colors.textMuted,
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0 0 8px",
  },
  footerLink: {
    color: colors.amber,
    textDecoration: "none",
  },
  copyright: {
    color: colors.textMuted,
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0",
  },
  iconContainer: {
    textAlign: "center" as const,
    marginBottom: "16px",
  },
  iconText: {
    fontSize: "56px",
    margin: "0",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    margin: "0 0 24px",
    fontFamily: "Georgia, serif",
  },
  paragraph: {
    color: colors.text,
    fontSize: "16px",
    lineHeight: "28px",
    margin: "0 0 16px",
  },
  paragraphCenter: {
    color: colors.text,
    fontSize: "16px",
    lineHeight: "28px",
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  buttonAmber: {
    backgroundColor: colors.amber,
    borderRadius: "8px",
    color: colors.background,
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
  },
  buttonGreen: {
    backgroundColor: colors.green,
    borderRadius: "8px",
    color: colors.background,
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
  },
  tipBox: {
    backgroundColor: colors.background,
    borderRadius: "8px",
    color: colors.text,
    fontSize: "14px",
    lineHeight: "22px",
    padding: "16px",
    margin: "24px 0 0",
    border: `1px solid ${colors.border}`,
  },
  nextStepsBox: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "24px",
    border: `1px solid ${colors.green}`,
  },
  nextStepsTitle: {
    color: colors.greenLight,
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "0 0 12px",
  },
  nextStepsItem: {
    color: colors.text,
    fontSize: "14px",
    lineHeight: "26px",
    margin: "0",
  },
  encouragementBox: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: "8px",
    color: colors.amberLight,
    fontSize: "14px",
    lineHeight: "22px",
    padding: "16px",
    margin: "24px 0 0",
    textAlign: "center" as const,
    border: `1px solid ${colors.amber}`,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: "12px",
    textAlign: "center" as const,
    margin: "24px 0 0",
  },
};

// Render functions that return HTML strings
export async function renderTestEmail(locale: Locale = "lt"): Promise<string> {
  return await render(<TestEmailTemplate locale={locale} />);
}

export async function renderInvitationReceived(
  senderName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> {
  return await render(
    <InvitationReceivedTemplate
      date={date}
      locale={locale}
      senderName={senderName}
    />
  );
}

export async function renderInvitationAccepted(
  accepterName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> {
  return await render(
    <InvitationAcceptedTemplate
      accepterName={accepterName}
      date={date}
      locale={locale}
    />
  );
}

export async function renderInvitationDeclined(
  declinerName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> {
  return await render(
    <InvitationDeclinedTemplate
      date={date}
      declinerName={declinerName}
      locale={locale}
    />
  );
}

export async function renderNewMessage(
  senderName: string,
  locale: Locale = "lt"
): Promise<string> {
  return await render(
    <NewMessageTemplate locale={locale} senderName={senderName} />
  );
}
