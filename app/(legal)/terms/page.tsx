"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

type Section = {
  title: string;
  content: string | string[];
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
      "Prašome atidžiai perskaityti šias naudojimo sąlygas. Registruodamiesi paskyrą arba naudodamiesi paslaugomis, jūs sutinkate laikytis šių naudojimo sąlygų ir visų įtrauktų sąlygų. Jei nesutinkate su visomis šiomis sąlygomis, nenaudokite paslaugų.",
    sections: [
      {
        title: "1. Tinkamumas ir registracija",
        content: [
          "Norėdami naudotis Paslaugomis, turite būti bent 18 metų amžiaus.",
          "Registruodamiesi sutinkate: (a) pateikti tikslią, teisingą ir išsamią informaciją; (b) palaikyti ir nedelsiant atnaujinti savo paskyros informaciją; (c) saugoti savo paskyrą ir slaptažodį; (d) nedelsiant pranešti mums apie bet kokius saugumo pažeidimus; (e) prisiimti atsakomybę už visą veiklą, vykdomą per jūsų paskyrą.",
        ],
      },
      {
        title: "2. Sąveika su kitais nariais",
        content: [
          "Jūs esate vienintelis atsakingas už savo sąveiką su kitais nariais. NEŠVĘSK VIENAS NĖRA JOKIŲ KOMUNIKACIJŲ, SANDORIŲ, SĄVEIKŲ, GINČŲ AR BET KOKIŲ SANTYKIŲ TARP JŪSŲ IR BET KURIO KITO NARIO ŠALIS.",
          "Atminkite, kad Nešvęsk Vienas paslaugos yra tik platforma, leidžianti bendrauti ir sąveikauti su kitais žmonėmis. Negalime būti atsakingi už jūsų sąveiką su kitais nariais, todėl naudodamiesi mūsų Paslaugomis naudokite sveiką protą ir galvokite apie saugumą.",
        ],
      },
      {
        title: "3. Tapatybės tikrinimas",
        content: [
          "Mes negalime ir nepatvirtiname kiekvieno nario tapatybės. Nors teikiame įrankius, skirtus padėti tikrinti tapatybę, jūs esate vienintelis atsakingas už kitų narių, su kuriais galite sąveikauti, tapatybės ir tinkamumo nustatymą.",
          "Mes netikriname ir nepatvirtiname jokio nario reputacijos, elgesio, moralės, kriminalinės praeities ar bet kokios informacijos, kurią nariai gali pateikti Paslaugoms. Raginame imtis atsargumo priemonių bendraujant su kitais nariais.",
        ],
      },
      {
        title: "4. Nario elgesys ir turinys",
        content: [
          "Jūs esate vienintelis atsakingas už bet kokį turinį, kurį pateikiate mūsų Paslaugoms. Sutinkate neskelbti turinio, kuris: (a) yra neteisėtas, šmeižikiškas, grasinantis; (b) pažeidžia privatumą; (c) yra seksualiai atviras ar obsceniškas; (d) skatina smurtą; (e) yra apgaulingas ar klaidinantis.",
          "Naudodamiesi Paslaugomis sutinkate elgtis atsakingai ir nepažeisti jokių taikytinų įstatymų.",
        ],
      },
      {
        title: "5. Atsakomybės atsisakymas",
        content:
          "Kadangi mūsų Paslaugos yra tik platforma, jei turite ginčą su vienu ar daugiau narių, maksimaliu taikytinų įstatymų leidžiamu mastu atleidžiate mus (ir mūsų pareigūnus, direktorius, darbuotojus ir atstovus) nuo bet kokių reikalavimų, pretenzijų ir žalos (faktinės ir pasekminės), žinomos ir nežinomos, kylančios iš tokių ginčų ar su jais susijusios.",
      },
      {
        title: "6. Garantijų atsisakymas",
        content: [
          "JEI NAUDOJATĖS MŪSŲ PASLAUGOMIS, TAI DAROTE IŠIMTINAI SAVO RIZIKA. MŪSŲ PASLAUGOS TEIKIAMOS TOKIOS, KOKIOS YRA IR KOKIOS PRIEINAMOS.",
          "MES NEGARANTUOJAME, KAD: (A) MŪSŲ PASLAUGOS ATITIKS JŪSŲ REIKALAVIMUS; (B) PASLAUGOS BUS NEPERTRAUKIAMOS, SAVALAIKĖS, SAUGIOS AR BE KLAIDŲ; (C) BET KOKIA INFORMACIJA, GAUTA PER MŪSŲ PASLAUGAS, BUS TIKSLI AR PATIKIMA.",
        ],
      },
      {
        title: "7. Atsakomybės apribojimai",
        content:
          "JOKIU ATVEJU NEŠVĘSK VIENAS AR MŪSŲ DIREKTORIAI, NARIAI, DARBUOTOJAI AR ATSTOVAI NEBUS ATSAKINGI UŽ JOKIĄ SPECIALIĄ, NETIESIOGINĘ AR PASEKMINĘ ŽALĄ, ĮSKAITANT, BET NEAPSIRIBOJANT, NAUDOJIMO PRARADIMĄ, PELNO PRARADIMĄ AR DUOMENŲ PRARADIMĄ.",
      },
      {
        title: "8. Paskyros nutraukimas",
        content:
          "Jei pažeidžiate šias Sąlygas ar bet kokias kitas mūsų nustatytas politikas ar bendruomenės standartus, galime savo nuožiūra bet kuriuo metu: (a) nutraukti jūsų prieigą prie mūsų Paslaugų; (b) deaktyvuoti ar ištrinti jūsų paskyrą ir visą susijusią informaciją; (c) užblokuoti jūsų prieigą prie bet kurių Paslaugų.",
      },
      {
        title: "9. Pranešimas apie netinkamą elgesį",
        content:
          "Jei sąveikaujate su bet kuriuo mūsų Paslaugų naudotoju, kuris, jūsų manymu, elgiasi ar elgėsi netinkamai, įskaitant įžeidžiantį, smurtinį ar seksualiai netinkamą elgesį, primygtinai raginame nedelsiant pranešti tokiam asmeniui atitinkamoms institucijoms ir mums susisiekiant el. paštu: info@nesveskvienas.lt",
      },
      {
        title: "10. Susisiekite su mumis",
        content:
          "Jei turite klausimų dėl šių Sąlygų, susisiekite su mumis el. paštu: info@nesveskvienas.lt",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: December 2024",
    intro:
      "Please read these terms of use carefully. By registering for an account or by accessing or using the services, you agree to be bound by these terms of use and all terms incorporated by reference. If you do not agree to all of these terms, do not access or use the services.",
    sections: [
      {
        title: "1. Eligibility and Registration",
        content: [
          "You must be at least 18 years old to access or use the Services.",
          "By registering for an account, you agree to: (a) provide accurate, truthful, current and complete information; (b) maintain and promptly update your account information; (c) maintain the security of your account by protecting your password; (d) promptly notify us if you discover any security breaches; (e) take responsibility for all activities that occur under your account.",
        ],
      },
      {
        title: "2. Interactions with Other Members",
        content: [
          "You have sole responsibility when interacting with other members. NEŠVĘSK VIENAS IS NOT A PARTY TO, HAS NO INVOLVEMENT OR INTEREST IN, MAKES NO REPRESENTATIONS OR WARRANTIES AS TO, AND HAS NO RESPONSIBILITY OR LIABILITY WITH RESPECT TO ANY COMMUNICATIONS, TRANSACTIONS, INTERACTIONS, DISPUTES OR ANY RELATIONS WHATSOEVER BETWEEN YOU AND ANY OTHER MEMBER.",
          "Remember, the Nešvęsk Vienas Services are just a platform that enables you to communicate and interact with other people. We cannot be responsible for the interactions that you have with other members, so please use good judgment and keep safety in mind when you use our Services.",
        ],
      },
      {
        title: "3. Identity Verification",
        content: [
          "We cannot and do not confirm each member's identity. Although we provide tools intended to assist with identity verification, you are solely responsible for determining the identity and suitability of others with whom you may interact through our Services.",
          "We do not investigate or verify any member's reputation, conduct, morality, criminal background, or any information members may submit to the Services. We encourage you to take precautions when interacting with other members, particularly when meeting a stranger in person for the first time.",
        ],
      },
      {
        title: "4. Member Conduct and Content",
        content: [
          "You are solely responsible for any content that you submit, post or transmit via our Services. You agree not to post content that: (a) is unlawful, libelous, defamatory, harassing, or threatening; (b) is invasive of privacy; (c) contains nudity or sexually explicit content; (d) incites violence; (e) is deceptive or misleading.",
          "By accessing or using the Services, you agree to act responsibly and comply with our Community Guidelines.",
        ],
      },
      {
        title: "5. Release",
        content:
          "Because our Services are merely a platform, in the event that you have a dispute with one or more members, to the fullest extent permitted by applicable law you release us (and our officers, directors, members, employees, agents and affiliates) from claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way connected with such disputes.",
      },
      {
        title: "6. Disclaimer of Warranties",
        content: [
          "IF YOU USE OUR SERVICES, YOU DO SO AT YOUR SOLE RISK. OUR SERVICES ARE PROVIDED ON AN AS IS AND AS AVAILABLE BASIS. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.",
          "WE DO NOT REPRESENT OR WARRANT THAT: (A) OUR SERVICES WILL MEET YOUR REQUIREMENTS; (B) OUR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (C) ANY INFORMATION THAT YOU MAY OBTAIN THROUGH OUR SERVICES WILL BE ACCURATE OR RELIABLE.",
        ],
      },
      {
        title: "7. Limits on Liability",
        content:
          "IN NO EVENT SHALL NEŠVĘSK VIENAS, OR OUR DIRECTORS, MEMBERS, EMPLOYEES OR AGENTS BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES, INCLUDING, BUT NOT LIMITED TO LOSS OF USE, LOSS OF PROFITS OR LOSS OF DATA, WHETHER IN AN ACTION IN CONTRACT, TORT (INCLUDING BUT NOT LIMITED TO NEGLIGENCE) OR OTHERWISE.",
      },
      {
        title: "8. Account Termination",
        content:
          "If you are in breach of these Terms, or any other policies or community standards we have in place, we may at our discretion at any time: (a) terminate your access to our Services; (b) deactivate or delete your account and all related information; (c) bar your access to any of our Services.",
      },
      {
        title: "9. Reporting Misconduct",
        content:
          "If you interact with anyone through our Services who you feel is acting or has acted inappropriately, including but not limited to offensive, violent or sexually inappropriate behavior, we strongly encourage you to immediately report such person to the appropriate authorities and to us by contacting: info@nesveskvienas.lt",
      },
      {
        title: "10. Contact Us",
        content:
          "If you have any questions about these Terms, please contact us at: info@nesveskvienas.lt",
      },
    ],
  },
  ru: {
    title: "Условия использования",
    lastUpdated: "Последнее обновление: декабрь 2024 г.",
    intro:
      "Пожалуйста, внимательно прочитайте настоящие условия использования. Регистрируя учетную запись или используя услуги, вы соглашаетесь соблюдать настоящие условия и все включенные условия. Если вы не согласны со всеми этими условиями, не используйте услуги.",
    sections: [
      {
        title: "1. Право на использование и регистрация",
        content: [
          "Для доступа к Услугам или их использования вам должно быть не менее 18 лет.",
          "Регистрируясь, вы соглашаетесь: (a) предоставлять точную, правдивую и полную информацию; (b) поддерживать и своевременно обновлять информацию своей учетной записи; (c) обеспечивать безопасность своей учетной записи; (d) незамедлительно уведомлять нас о любых нарушениях безопасности; (e) нести ответственность за всю деятельность под вашей учетной записью.",
        ],
      },
      {
        title: "2. Взаимодействие с другими участниками",
        content: [
          "Вы несете единоличную ответственность при взаимодействии с другими участниками. НЕ ПРАЗДНУЙ ОДИН НЕ ЯВЛЯЕТСЯ СТОРОНОЙ, НЕ ИМЕЕТ НИКАКОГО УЧАСТИЯ ИЛИ ИНТЕРЕСА И НЕ НЕСЕТ НИКАКОЙ ОТВЕТСТВЕННОСТИ В ОТНОШЕНИИ ЛЮБЫХ КОММУНИКАЦИЙ, ТРАНЗАКЦИЙ, ВЗАИМОДЕЙСТВИЙ ИЛИ СПОРОВ МЕЖДУ ВАМИ И ЛЮБЫМ ДРУГИМ УЧАСТНИКОМ.",
          "Помните, что услуги Не празднуй один — это лишь платформа для общения с другими людьми. Мы не можем нести ответственность за ваше взаимодействие с другими участниками, поэтому используйте здравый смысл и помните о безопасности.",
        ],
      },
      {
        title: "3. Проверка личности",
        content: [
          "Мы не можем и не подтверждаем личность каждого участника. Хотя мы предоставляем инструменты для проверки личности, вы несете единоличную ответственность за определение личности и пригодности тех, с кем вы можете взаимодействовать.",
          "Мы не проверяем репутацию, поведение, мораль, криминальное прошлое или любую информацию участников. Мы рекомендуем соблюдать осторожность при взаимодействии с другими участниками.",
        ],
      },
      {
        title: "4. Поведение и контент участников",
        content: [
          "Вы несете единоличную ответственность за любой контент, который публикуете через наши Услуги. Вы соглашаетесь не публиковать контент, который: (a) является незаконным, клеветническим, угрожающим; (b) нарушает конфиденциальность; (c) содержит откровенный сексуальный контент; (d) провоцирует насилие; (e) является обманчивым.",
          "Используя Услуги, вы соглашаетесь действовать ответственно и соблюдать наши Правила сообщества.",
        ],
      },
      {
        title: "5. Освобождение от ответственности",
        content:
          "Поскольку наши Услуги являются лишь платформой, в случае возникновения у вас спора с одним или несколькими участниками, в максимальной степени, разрешенной законом, вы освобождаете нас от претензий, требований и убытков любого рода, возникающих из таких споров.",
      },
      {
        title: "6. Отказ от гарантий",
        content: [
          "ЕСЛИ ВЫ ИСПОЛЬЗУЕТЕ НАШИ УСЛУГИ, ВЫ ДЕЛАЕТЕ ЭТО НА СВОЙ СОБСТВЕННЫЙ РИСК. НАШИ УСЛУГИ ПРЕДОСТАВЛЯЮТСЯ НА УСЛОВИЯХ «КАК ЕСТЬ» И «ПО МЕРЕ ДОСТУПНОСТИ».",
          "МЫ НЕ ГАРАНТИРУЕМ, ЧТО: (A) НАШИ УСЛУГИ БУДУТ СООТВЕТСТВОВАТЬ ВАШИМ ТРЕБОВАНИЯМ; (B) УСЛУГИ БУДУТ НЕПРЕРЫВНЫМИ, СВОЕВРЕМЕННЫМИ, БЕЗОПАСНЫМИ ИЛИ БЕЗ ОШИБОК; (C) ЛЮБАЯ ИНФОРМАЦИЯ БУДЕТ ТОЧНОЙ ИЛИ НАДЕЖНОЙ.",
        ],
      },
      {
        title: "7. Ограничение ответственности",
        content:
          "НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ НЕ ПРАЗДНУЙ ОДИН ИЛИ НАШИ ДИРЕКТОРА, УЧАСТНИКИ, СОТРУДНИКИ ИЛИ АГЕНТЫ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ЛЮБОЙ СПЕЦИАЛЬНЫЙ, КОСВЕННЫЙ ИЛИ ПОСЛЕДУЮЩИЙ УЩЕРБ, ВКЛЮЧАЯ ПОТЕРЮ ИСПОЛЬЗОВАНИЯ, ПОТЕРЮ ПРИБЫЛИ ИЛИ ПОТЕРЮ ДАННЫХ.",
      },
      {
        title: "8. Прекращение действия учетной записи",
        content:
          "Если вы нарушите эти Условия или любые другие политики или стандарты сообщества, мы можем по своему усмотрению в любое время: (a) прекратить ваш доступ к нашим Услугам; (b) деактивировать или удалить вашу учетную запись; (c) заблокировать ваш доступ к любым Услугам.",
      },
      {
        title: "9. Сообщение о нарушениях",
        content:
          "Если вы взаимодействуете с кем-либо через наши Услуги, кто, по вашему мнению, ведет себя ненадлежащим образом, включая оскорбительное, агрессивное или сексуально неприемлемое поведение, мы настоятельно рекомендуем немедленно сообщить о таком человеке соответствующим органам и нам по адресу: info@nesveskvienas.lt",
      },
      {
        title: "10. Свяжитесь с нами",
        content:
          "Если у вас есть вопросы об этих Условиях, свяжитесь с нами по адресу: info@nesveskvienas.lt",
      },
    ],
  },
  ua: {
    title: "Умови використання",
    lastUpdated: "Останнє оновлення: грудень 2024 р.",
    intro:
      "Будь ласка, уважно прочитайте ці умови використання. Реєструючи обліковий запис або використовуючи послуги, ви погоджуєтеся дотримуватися цих умов та всіх включених умов. Якщо ви не погоджуєтеся з усіма цими умовами, не використовуйте послуги.",
    sections: [
      {
        title: "1. Право на використання та реєстрація",
        content: [
          "Для доступу до Послуг або їх використання вам має бути не менше 18 років.",
          "Реєструючись, ви погоджуєтеся: (a) надавати точну, правдиву та повну інформацію; (b) підтримувати та своєчасно оновлювати інформацію облікового запису; (c) забезпечувати безпеку облікового запису; (d) негайно повідомляти нас про будь-які порушення безпеки; (e) нести відповідальність за всю діяльність під вашим обліковим записом.",
        ],
      },
      {
        title: "2. Взаємодія з іншими учасниками",
        content: [
          "Ви несете одноосібну відповідальність при взаємодії з іншими учасниками. НЕ СВЯТКУЙ НАОДИНЦІ НЕ Є СТОРОНОЮ, НЕ МАЄ ЖОДНОЇ УЧАСТІ АБО ІНТЕРЕСУ ТА НЕ НЕСЕ ЖОДНОЇ ВІДПОВІДАЛЬНОСТІ ЩОДО БУДЬ-ЯКИХ КОМУНІКАЦІЙ, ТРАНЗАКЦІЙ, ВЗАЄМОДІЙ АБО СПОРІВ МІЖ ВАМИ ТА БУДЬ-ЯКИМ ІНШИМ УЧАСНИКОМ.",
          "Пам'ятайте, що послуги Не святкуй наодинці — це лише платформа для спілкування з іншими людьми. Ми не можемо нести відповідальність за вашу взаємодію з іншими учасниками, тому використовуйте здоровий глузд та пам'ятайте про безпеку.",
        ],
      },
      {
        title: "3. Перевірка особи",
        content: [
          "Ми не можемо і не підтверджуємо особу кожного учасника. Хоча ми надаємо інструменти для перевірки особи, ви несете одноосібну відповідальність за визначення особи та придатності тих, з ким ви можете взаємодіяти.",
          "Ми не перевіряємо репутацію, поведінку, мораль, кримінальне минуле або будь-яку інформацію учасників. Ми рекомендуємо дотримуватися обережності при взаємодії з іншими учасниками.",
        ],
      },
      {
        title: "4. Поведінка та контент учасників",
        content: [
          "Ви несете одноосібну відповідальність за будь-який контент, який публікуєте через наші Послуги. Ви погоджуєтеся не публікувати контент, який: (a) є незаконним, наклепницьким, загрозливим; (b) порушує конфіденційність; (c) містить відвертий сексуальний контент; (d) провокує насильство; (e) є оманливим.",
          "Використовуючи Послуги, ви погоджуєтеся діяти відповідально та дотримуватися наших Правил спільноти.",
        ],
      },
      {
        title: "5. Звільнення від відповідальності",
        content:
          "Оскільки наші Послуги є лише платформою, у разі виникнення у вас спору з одним або кількома учасниками, в максимальній мірі, дозволеній законом, ви звільняєте нас від претензій, вимог та збитків будь-якого роду, що виникають з таких спорів.",
      },
      {
        title: "6. Відмова від гарантій",
        content: [
          "ЯКЩО ВИ ВИКОРИСТОВУЄТЕ НАШІ ПОСЛУГИ, ВИ РОБИТЕ ЦЕ НА СВІЙ ВЛАСНИЙ РИЗИК. НАШІ ПОСЛУГИ НАДАЮТЬСЯ НА УМОВАХ «ЯК Є» ТА «ПО МІРІ ДОСТУПНОСТІ».",
          "МИ НЕ ГАРАНТУЄМО, ЩО: (A) НАШІ ПОСЛУГИ ВІДПОВІДАТИМУТЬ ВАШИМ ВИМОГАМ; (B) ПОСЛУГИ БУДУТЬ БЕЗПЕРЕРВНИМИ, СВОЄЧАСНИМИ, БЕЗПЕЧНИМИ АБО БЕЗ ПОМИЛОК; (C) БУДЬ-ЯКА ІНФОРМАЦІЯ БУДЕ ТОЧНОЮ АБО НАДІЙНОЮ.",
        ],
      },
      {
        title: "7. Обмеження відповідальності",
        content:
          "ЗА ЖОДНИХ ОБСТАВИН НЕ СВЯТКУЙ НАОДИНЦІ АБО НАШІ ДИРЕКТОРИ, УЧАСНИКИ, СПІВРОБІТНИКИ АБО АГЕНТИ НЕ НЕСУТЬ ВІДПОВІДАЛЬНОСТІ ЗА БУДЬ-ЯКИЙ СПЕЦІАЛЬНИЙ, НЕПРЯМИЙ АБО НАСЛІДКОВИЙ ЗБИТОК, ВКЛЮЧАЮЧИ ВТРАТУ ВИКОРИСТАННЯ, ВТРАТУ ПРИБУТКУ АБО ВТРАТУ ДАНИХ.",
      },
      {
        title: "8. Припинення дії облікового запису",
        content:
          "Якщо ви порушите ці Умови або будь-які інші політики або стандарти спільноти, ми можемо на власний розсуд у будь-який час: (a) припинити ваш доступ до наших Послуг; (b) деактивувати або видалити ваш обліковий запис; (c) заблокувати ваш доступ до будь-яких Послуг.",
      },
      {
        title: "9. Повідомлення про порушення",
        content:
          "Якщо ви взаємодієте з ким-небудь через наші Послуги, хто, на вашу думку, поводиться неналежним чином, включаючи образливу, агресивну або сексуально неприйнятну поведінку, ми наполегливо рекомендуємо негайно повідомити про таку особу відповідним органам та нам за адресою: info@nesveskvienas.lt",
      },
      {
        title: "10. Зв'яжіться з нами",
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
                {Array.isArray(section.content) ? (
                  <div className="space-y-3">
                    {section.content.map((paragraph, index) => (
                      <p
                        className="text-gray-600 leading-relaxed"
                        key={`${section.title}-${index}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
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
