"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

type Section = {
  title: string;
  content: string;
};

type TermsContentItem = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
};

type TermsContent = Record<string, TermsContentItem>;

const termsContent: TermsContent = {
  lt: {
    title: "Paslaugų teikimo sąlygos",
    lastUpdated: "Paskutinį kartą atnaujinta: 2024 m. gruodžio mėn.",
    intro:
      "PRAŠOME ATIDŽIAI PERSKAITYTI ŠIAS NAUDOJIMO SĄLYGAS. REGISTRUODAMIESI PASKYRĄ ARBA NAUDODAMIESI PASLAUGOMIS, JŪS SUTINKATE LAIKYTIS ŠIŲ NAUDOJIMO SĄLYGŲ.",
    sections: [
      {
        title: "1. Tinkamumas ir registracija",
        content: "Norėdami naudotis Paslaugomis, turite būti bent 18 metų.",
      },
      {
        title: "2. Sąveika su kitais nariais",
        content:
          "Jūs esate vienintelis atsakingas už savo sąveiką su kitais nariais. NEŠVĘSK VIENAS NĖRA JOKIŲ KOMUNIKACIJŲ, SANDORIŲ, SĄVEIKŲ, GINČŲ AR BET KOKIŲ SANTYKIŲ TARP JŪSŲ IR BET KURIO KITO NARIO ŠALIS, NETURI JOKIO INTERESO, NETEIKIA JOKIŲ GARANTIJŲ IR NEPRISIIMA JOKIOS ATSAKOMYBĖS UŽ JUOS.",
      },
      {
        title: "3. Tapatybės tikrinimas",
        content:
          "Mes negalime ir nepatvirtiname kiekvieno nario tapatybės. Raginame imtis atsargumo priemonių bendraujant su kitais nariais.",
      },
      {
        title: "4. Atsakomybės atsisakymas",
        content:
          "Kadangi mūsų Paslaugos yra tik platforma, jei turite ginčą su vienu ar daugiau narių, maksimaliu taikytinų įstatymų leidžiamu mastu atleidžiate mus nuo bet kokių reikalavimų, pretenzijų ir žalos.",
      },
      {
        title: "5. Garantijų atsisakymas",
        content:
          "JEI NAUDOJATĖS MŪSŲ PASLAUGOMIS, TAI DAROTE IŠIMTINAI SAVO RIZIKA. MŪSŲ PASLAUGOS TEIKIAMOS TOKIOS, KOKIOS YRA.",
      },
      {
        title: "6. Atsakomybės apribojimai",
        content:
          "JOKIU ATVEJU NEŠVĘSK VIENAS AR MŪSŲ DIREKTORIAI, NARIAI, DARBUOTOJAI AR ATSTOVAI NEBUS ATSAKINGI UŽ JOKIĄ SPECIALIĄ, NETIESIOGINĘ AR PASEKMINĘ ŽALĄ.",
      },
      {
        title: "7. Susisiekite su mumis",
        content:
          "Jei turite klausimų dėl šių Sąlygų, susisiekite su mumis el. paštu: info@nesveskvienas.lt",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: December 2024",
    intro:
      "PLEASE READ THESE TERMS OF USE CAREFULLY. BY REGISTERING FOR AN ACCOUNT OR BY ACCESSING OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS OF USE.",
    sections: [
      {
        title: "1. Eligibility and Registration",
        content:
          "You must be at least 18 years old to access or use the Services.",
      },
      {
        title: "2. Interactions with Other Members",
        content:
          "You have sole responsibility when interacting with other members. NEŠVĘSK VIENAS IS NOT A PARTY TO, HAS NO INVOLVEMENT OR INTEREST IN, MAKES NO REPRESENTATIONS OR WARRANTIES AS TO, AND HAS NO RESPONSIBILITY OR LIABILITY WITH RESPECT TO ANY COMMUNICATIONS, TRANSACTIONS, INTERACTIONS, DISPUTES OR ANY RELATIONS WHATSOEVER BETWEEN YOU AND ANY OTHER MEMBER.",
      },
      {
        title: "3. Identity Verification",
        content:
          "We cannot and do not confirm each member's identity. We encourage you to take precautions when interacting with other members.",
      },
      {
        title: "4. Release",
        content:
          "Because our Services are merely a platform, in the event that you have a dispute with one or more members, you release us from claims, demands and damages arising out of such disputes.",
      },
      {
        title: "5. Disclaimer of Warranties",
        content:
          "IF YOU USE OUR SERVICES, YOU DO SO AT YOUR SOLE RISK. OUR SERVICES ARE PROVIDED ON AN AS IS AND AS AVAILABLE BASIS.",
      },
      {
        title: "6. Limits on Liability",
        content:
          "IN NO EVENT SHALL NEŠVĘSK VIENAS, OR OUR DIRECTORS, MEMBERS, EMPLOYEES OR AGENTS BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES.",
      },
      {
        title: "7. Contact Us",
        content:
          "If you have any questions about these Terms, please contact us at: info@nesveskvienas.lt",
      },
    ],
  },
  ru: {
    title: "Условия использования",
    lastUpdated: "Последнее обновление: декабрь 2024 г.",
    intro:
      "ПОЖАЛУЙСТА, ВНИМАТЕЛЬНО ПРОЧИТАЙТЕ НАСТОЯЩИЕ УСЛОВИЯ ИСПОЛЬЗОВАНИЯ. РЕГИСТРИРУЯ УЧЕТНУЮ ЗАПИСЬ ИЛИ ИСПОЛЬЗУЯ УСЛУГИ, ВЫ СОГЛАШАЕТЕСЬ СОБЛЮДАТЬ НАСТОЯЩИЕ УСЛОВИЯ.",
    sections: [
      {
        title: "1. Право на использование и регистрация",
        content:
          "Для доступа к Услугам или их использования вам должно быть не менее 18 лет.",
      },
      {
        title: "2. Взаимодействие с другими участниками",
        content:
          "Вы несете единоличную ответственность при взаимодействии с другими участниками. НЕ ПРАЗДНУЙ ОДИН НЕ ЯВЛЯЕТСЯ СТОРОНОЙ, НЕ ИМЕЕТ НИКАКОГО УЧАСТИЯ ИЛИ ИНТЕРЕСА, НЕ ДАЕТ НИКАКИХ ЗАВЕРЕНИЙ ИЛИ ГАРАНТИЙ И НЕ НЕСЕТ НИКАКОЙ ОТВЕТСТВЕННОСТИ В ОТНОШЕНИИ ЛЮБЫХ КОММУНИКАЦИЙ, ТРАНЗАКЦИЙ, ВЗАИМОДЕЙСТВИЙ, СПОРОВ ИЛИ ЛЮБЫХ ОТНОШЕНИЙ МЕЖДУ ВАМИ И ЛЮБЫМ ДРУГИМ УЧАСТНИКОМ.",
      },
      {
        title: "3. Проверка личности",
        content:
          "Мы не можем и не подтверждаем личность каждого участника. Мы рекомендуем вам соблюдать осторожность при взаимодействии с другими участниками.",
      },
      {
        title: "4. Освобождение от ответственности",
        content:
          "Поскольку наши Услуги являются лишь платформой, в случае возникновения у вас спора с одним или несколькими участниками, вы освобождаете нас от претензий, требований и убытков.",
      },
      {
        title: "5. Отказ от гарантий",
        content:
          "ЕСЛИ ВЫ ИСПОЛЬЗУЕТЕ НАШИ УСЛУГИ, ВЫ ДЕЛАЕТЕ ЭТО НА СВОЙ СОБСТВЕННЫЙ РИСК. НАШИ УСЛУГИ ПРЕДОСТАВЛЯЮТСЯ НА УСЛОВИЯХ КАК ЕСТЬ.",
      },
      {
        title: "6. Ограничение ответственности",
        content:
          "НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ НЕ ПРАЗДНУЙ ОДИН ИЛИ НАШИ ДИРЕКТОРА, УЧАСТНИКИ, СОТРУДНИКИ ИЛИ АГЕНТЫ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ЛЮБОЙ СПЕЦИАЛЬНЫЙ, КОСВЕННЫЙ ИЛИ ПОСЛЕДУЮЩИЙ УЩЕРБ.",
      },
      {
        title: "7. Свяжитесь с нами",
        content:
          "Если у вас есть вопросы об этих Условиях, свяжитесь с нами по адресу: info@nesveskvienas.lt",
      },
    ],
  },
  ua: {
    title: "Умови використання",
    lastUpdated: "Останнє оновлення: грудень 2024 р.",
    intro:
      "БУДЬ ЛАСКА, УВАЖНО ПРОЧИТАЙТЕ ЦІ УМОВИ ВИКОРИСТАННЯ. РЕЄСТРУЮЧИ ОБЛІКОВИЙ ЗАПИС АБО ВИКОРИСТОВУЮЧИ ПОСЛУГИ, ВИ ПОГОДЖУЄТЕСЯ ДОТРИМУВАТИСЯ ЦИХ УМОВ.",
    sections: [
      {
        title: "1. Право на використання та реєстрація",
        content:
          "Для доступу до Послуг або їх використання вам має бути не менше 18 років.",
      },
      {
        title: "2. Взаємодія з іншими учасниками",
        content:
          "Ви несете одноосібну відповідальність при взаємодії з іншими учасниками. НЕ СВЯТКУЙ НАОДИНЦІ НЕ Є СТОРОНОЮ, НЕ МАЄ ЖОДНОЇ УЧАСТІ АБО ІНТЕРЕСУ, НЕ НАДАЄ ЖОДНИХ ЗАПЕВНЕНЬ АБО ГАРАНТІЙ ТА НЕ НЕСЕ ЖОДНОЇ ВІДПОВІДАЛЬНОСТІ ЩОДО БУДЬ-ЯКИХ КОМУНІКАЦІЙ, ТРАНЗАКЦІЙ, ВЗАЄМОДІЙ, СПОРІВ АБО БУДЬ-ЯКИХ ВІДНОСИН МІЖ ВАМИ ТА БУДЬ-ЯКИМ ІНШИМ УЧАСНИКОМ.",
      },
      {
        title: "3. Перевірка особи",
        content:
          "Ми не можемо і не підтверджуємо особу кожного учасника. Ми рекомендуємо вам дотримуватися обережності при взаємодії з іншими учасниками.",
      },
      {
        title: "4. Звільнення від відповідальності",
        content:
          "Оскільки наші Послуги є лише платформою, у разі виникнення у вас спору з одним або кількома учасниками, ви звільняєте нас від претензій, вимог та збитків.",
      },
      {
        title: "5. Відмова від гарантій",
        content:
          "ЯКЩО ВИ ВИКОРИСТОВУЄТЕ НАШІ ПОСЛУГИ, ВИ РОБИТЕ ЦЕ НА СВІЙ ВЛАСНИЙ РИЗИК. НАШІ ПОСЛУГИ НАДАЮТЬСЯ НА УМОВАХ ЯК Є.",
      },
      {
        title: "6. Обмеження відповідальності",
        content:
          "ЗА ЖОДНИХ ОБСТАВИН НЕ СВЯТКУЙ НАОДИНЦІ АБО НАШІ ДИРЕКТОРИ, УЧАСНИКИ, СПІВРОБІТНИКИ АБО АГЕНТИ НЕ НЕСУТЬ ВІДПОВІДАЛЬНОСТІ ЗА БУДЬ-ЯКИЙ СПЕЦІАЛЬНИЙ, НЕПРЯМИЙ АБО НАСЛІДКОВИЙ ЗБИТОК.",
      },
      {
        title: "7. Зв'яжіться з нами",
        content:
          "Якщо у вас є запитання щодо цих Умов, зв'яжіться з нами за адресою: info@nesveskvienas.lt",
      },
    ],
  },
};

export default function TermsPage() {
  const { t, locale } = useLocale();
  const c = termsContent[locale] || termsContent.lt;

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

          <div className="mb-8 rounded-md bg-amber-50 p-4">
            <p className="font-medium text-amber-800 text-sm">{c.intro}</p>
          </div>

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
