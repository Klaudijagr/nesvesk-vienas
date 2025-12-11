"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

type Section = {
  title: string;
  content: string;
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
    lastUpdated: "Paskutinį kartą atnaujinta: 2024 m. gruodžio mėn.",
    intro:
      "Ši privatumo politika aprašo, kaip Nešvęsk vienas renka, naudoja ir saugo jūsų asmeninę informaciją.",
    sections: [
      {
        title: "1. Kokią informaciją renkame",
        content:
          "Mes renkame informaciją, kurią pateikiate registruodamiesi: vardą, el. pašto adresą, miestą, kalbas ir profilio aprašymą. Taip pat galime rinkti informaciją apie tai, kaip naudojatės platforma.",
      },
      {
        title: "2. Kaip naudojame jūsų informaciją",
        content:
          "Naudojame jūsų informaciją, kad galėtume: teikti ir tobulinti mūsų paslaugas, leisti jums susisiekti su kitais nariais, siųsti svarbius pranešimus apie paslaugą.",
      },
      {
        title: "3. Informacijos dalijimasis",
        content:
          "Jūsų profilio informacija yra matoma kitiems platformos nariams. Mes neparduodame jūsų asmeninės informacijos trečiosioms šalims.",
      },
      {
        title: "4. Duomenų saugumas",
        content:
          "Mes imamės pagrįstų priemonių apsaugoti jūsų asmeninę informaciją nuo neteisėtos prieigos, pakeitimo ar sunaikinimo.",
      },
      {
        title: "5. Jūsų teisės",
        content:
          "Turite teisę: prieiti prie savo asmeninių duomenų, prašyti ištaisyti netikslius duomenis, prašyti ištrinti savo duomenis, atsisakyti rinkodaros pranešimų.",
      },
      {
        title: "6. Slapukai",
        content:
          "Naudojame slapukus, kad pagerintume jūsų patirtį platformoje. Galite valdyti slapukų nustatymus savo naršyklėje.",
      },
      {
        title: "7. Susisiekite su mumis",
        content:
          "Jei turite klausimų apie šią privatumo politiką, susisiekite su mumis el. paštu: info@nesveskvienas.lt",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: December 2024",
    intro:
      "This privacy policy describes how Nešvęsk vienas collects, uses, and protects your personal information.",
    sections: [
      {
        title: "1. Information We Collect",
        content:
          "We collect information you provide when registering: name, email address, city, languages, and profile description. We may also collect information about how you use the platform.",
      },
      {
        title: "2. How We Use Your Information",
        content:
          "We use your information to: provide and improve our services, allow you to connect with other members, send important service notifications.",
      },
      {
        title: "3. Information Sharing",
        content:
          "Your profile information is visible to other platform members. We do not sell your personal information to third parties.",
      },
      {
        title: "4. Data Security",
        content:
          "We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction.",
      },
      {
        title: "5. Your Rights",
        content:
          "You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data, opt out of marketing communications.",
      },
      {
        title: "6. Cookies",
        content:
          "We use cookies to improve your experience on the platform. You can manage cookie settings in your browser.",
      },
      {
        title: "7. Contact Us",
        content:
          "If you have questions about this privacy policy, please contact us at: info@nesveskvienas.lt",
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление: декабрь 2024 г.",
    intro:
      "Эта политика конфиденциальности описывает, как Не празднуй один собирает, использует и защищает вашу личную информацию.",
    sections: [
      {
        title: "1. Какую информацию мы собираем",
        content:
          "Мы собираем информацию, которую вы предоставляете при регистрации: имя, адрес электронной почты, город, языки и описание профиля. Мы также можем собирать информацию о том, как вы используете платформу.",
      },
      {
        title: "2. Как мы используем вашу информацию",
        content:
          "Мы используем вашу информацию для: предоставления и улучшения наших услуг, возможности связаться с другими участниками, отправки важных уведомлений о сервисе.",
      },
      {
        title: "3. Обмен информацией",
        content:
          "Информация вашего профиля видна другим участникам платформы. Мы не продаем вашу личную информацию третьим лицам.",
      },
      {
        title: "4. Безопасность данных",
        content:
          "Мы принимаем разумные меры для защиты вашей личной информации от несанкционированного доступа, изменения или уничтожения.",
      },
      {
        title: "5. Ваши права",
        content:
          "Вы имеете право: получить доступ к своим личным данным, запросить исправление неточных данных, запросить удаление ваших данных, отказаться от маркетинговых сообщений.",
      },
      {
        title: "6. Файлы cookie",
        content:
          "Мы используем файлы cookie для улучшения вашего опыта на платформе. Вы можете управлять настройками cookie в своем браузере.",
      },
      {
        title: "7. Свяжитесь с нами",
        content:
          "Если у вас есть вопросы об этой политике конфиденциальности, свяжитесь с нами по адресу: info@nesveskvienas.lt",
      },
    ],
  },
  ua: {
    title: "Політика конфіденційності",
    lastUpdated: "Останнє оновлення: грудень 2024 р.",
    intro:
      "Ця політика конфіденційності описує, як Не святкуй наодинці збирає, використовує та захищає вашу особисту інформацію.",
    sections: [
      {
        title: "1. Яку інформацію ми збираємо",
        content:
          "Ми збираємо інформацію, яку ви надаєте при реєстрації: ім'я, адресу електронної пошти, місто, мови та опис профілю. Ми також можемо збирати інформацію про те, як ви використовуєте платформу.",
      },
      {
        title: "2. Як ми використовуємо вашу інформацію",
        content:
          "Ми використовуємо вашу інформацію для: надання та покращення наших послуг, можливості зв'язатися з іншими учасниками, відправки важливих повідомлень про сервіс.",
      },
      {
        title: "3. Обмін інформацією",
        content:
          "Інформація вашого профілю видима іншим учасникам платформи. Ми не продаємо вашу особисту інформацію третім особам.",
      },
      {
        title: "4. Безпека даних",
        content:
          "Ми вживаємо розумних заходів для захисту вашої особистої інформації від несанкціонованого доступу, зміни або знищення.",
      },
      {
        title: "5. Ваші права",
        content:
          "Ви маєте право: отримати доступ до своїх особистих даних, запросити виправлення неточних даних, запросити видалення ваших даних, відмовитися від маркетингових повідомлень.",
      },
      {
        title: "6. Файли cookie",
        content:
          "Ми використовуємо файли cookie для покращення вашого досвіду на платформі. Ви можете керувати налаштуваннями cookie у своєму браузері.",
      },
      {
        title: "7. Зв'яжіться з нами",
        content:
          "Якщо у вас є запитання щодо цієї політики конфіденційності, зв'яжіться з нами за адресою: info@nesveskvienas.lt",
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
          <h1 className="mb-2 font-bold text-3xl text-gray-900">{c.title}</h1>
          <p className="mb-6 text-gray-500 text-sm">{c.lastUpdated}</p>

          <p className="mb-8 text-gray-600 text-lg">{c.intro}</p>

          <div className="space-y-8">
            {c.sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 font-semibold text-gray-900 text-xl">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
