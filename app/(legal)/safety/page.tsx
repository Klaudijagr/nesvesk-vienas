"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  MapPin,
  MessageCircle,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

type SafetyTip = {
  icon: string;
  title: string;
  content: string;
};

type SafetyContentItem = {
  title: string;
  subtitle: string;
  intro: string;
  tips: SafetyTip[];
  reportTitle: string;
  reportContent: string;
  emergencyTitle: string;
  emergencyContent: string;
};

type SafetyContent = Record<string, SafetyContentItem>;

const safetyContent: SafetyContent = {
  lt: {
    title: "Saugos gairės",
    subtitle:
      "Jūsų saugumas yra prioritetas. Prašome šias gaires vertinti rimtai.",
    intro:
      "Platforma sudaro tik ryšio galimybę tarp narių – už savo sprendimus ir veiksmus esate atsakingi jūs patys.",
    tips: [
      {
        icon: "eye",
        title: "Atidžiai peržiūrėkite profilius",
        content:
          "Skirkite laiko susipažinti su kitų narių informacija. Įvertinkite, ar aprašymas, nuotraukos ir bendravimas kelia pasitikėjimą.",
      },
      {
        icon: "alert",
        title: "Pasitikėkite savo nuojauta",
        content:
          "Jeigu asmuo, situacija ar bet kuris elementas jums kelia abejonių ar atrodo nesaugus, nutraukite bendravimą. Jūsų komfortas ir saugumas yra svarbiausi.",
      },
      {
        icon: "mappin",
        title: "Žinokite savo galimybes",
        content:
          "Jei kažkas negerai su jūsų šeimininku, ieškokite alternatyvos. Visada turėkite planą, kuris užtikrintų jūsų saugumą ir galimybę pasitraukti iš situacijos.",
      },
      {
        icon: "message",
        title: "Bendraukite per platformą",
        content:
          "Savo kontaktais ir adresu dalinkitės tik tada, kai esate tikri dėl kito asmens tapatybės ir jaučiatės saugiai. Kol nesate užtikrinti, naudokite tik platformos vidinį susirašinėjimą.",
      },
      {
        icon: "users",
        title: "Susitikite viešoje vietoje",
        content:
          "Pirmą kartą susitikdami rinkitės viešą, žmonių lankomą vietą arba įtraukite daugiau dalyvių. Praneškite draugui ar šeimos nariui, kur ir su kuo susitinkate.",
      },
      {
        icon: "shield",
        title: "Žinokite savo ribas",
        content:
          'Aiškiai komunikuokite, kas jums priimtina, o kas ne. Nedvejokite pasakyti „ne" ir pasitraukti iš situacijų, kurios kelia nepatogumą ar nesaugumo jausmą.',
      },
    ],
    reportTitle: "Pranešti apie neigiamą patirtį",
    reportContent:
      "Mūsų pasitikėjimo ir saugumo komanda yra čia, kad padėtų kurti saugiausią ir patikimiausią bendruomenę. Pranešimas apie saugumo problemas Nešvęsk Vienas padeda apsaugoti būsimus narius. Konfidencialiai praneškite apie neigiamas patirtis ar saugumo problemas mums el. paštu: info@nesveskvienas.lt",
    emergencyTitle: "Skubios pagalbos kontaktai Lietuvoje",
    emergencyContent:
      "Bendrasis pagalbos numeris: 112 | Policija: 02 arba 112 | Greitoji pagalba: 03 arba 112",
  },
  en: {
    title: "Safety Guidelines",
    subtitle:
      "Your safety is a priority. Please take these guidelines seriously.",
    intro:
      "The platform only facilitates connections between members – you are responsible for your own decisions and actions.",
    tips: [
      {
        icon: "eye",
        title: "Review Profiles Carefully",
        content:
          "Take time to explore members' profiles. Evaluate whether their descriptions, photos, and communication feel trustworthy.",
      },
      {
        icon: "alert",
        title: "Trust Your Instincts",
        content:
          "If a person or situation raises doubts or feels unsafe for any reason, stop communicating. Your comfort and safety come first.",
      },
      {
        icon: "mappin",
        title: "Know Your Options",
        content:
          "If something doesn't go well with your host, look for an alternative. Always have a plan that ensures your safety and ability to leave if needed.",
      },
      {
        icon: "message",
        title: "Communicate Through the Platform",
        content:
          "Share your contact details or address only when you are confident about the other person's identity and feel safe. Until then, use the platform's internal messaging.",
      },
      {
        icon: "users",
        title: "Meet in a Public Place",
        content:
          "For the first meeting, choose a public, well-populated place or involve additional people. Inform a friend or family member about where you are going and with whom.",
      },
      {
        icon: "shield",
        title: "Know Your Boundaries",
        content:
          'Be clear about your limits and communicate them openly. Do not hesitate to say "no" or leave situations that make you feel uncomfortable or unsafe.',
      },
    ],
    reportTitle: "Report Negative Experiences",
    reportContent:
      "Our Trust and Safety team is here to help build the safest and most trusted community possible. Reporting safety concerns to Nešvęsk Vienas helps keep future members safe. Confidentially report negative experiences or safety concerns to us at: info@nesveskvienas.lt",
    emergencyTitle: "Emergency Contacts in Lithuania",
    emergencyContent:
      "General Emergency: 112 | Police: 02 or 112 | Ambulance: 03 or 112",
  },
  ru: {
    title: "Рекомендации по безопасности",
    subtitle:
      "Ваша безопасность — наш приоритет. Пожалуйста, серьёзно относитесь к этим рекомендациям.",
    intro:
      "Платформа лишь предоставляет возможность связи между участниками — вы самостоятельно отвечаете за свои решения и действия.",
    tips: [
      {
        icon: "eye",
        title: "Внимательно изучайте профили",
        content:
          "Уделите время просмотру профилей участников. Оцените, вызывают ли доверие их описание, фотографии и стиль общения.",
      },
      {
        icon: "alert",
        title: "Доверяйте своим ощущениям",
        content:
          "Если человек или ситуация вызывает сомнения или кажется небезопасной, прекращайте общение. Ваш комфорт и безопасность — прежде всего.",
      },
      {
        icon: "mappin",
        title: "Знайте свои возможности",
        content:
          "Если что-то идёт не так с вашим хозяином, найдите альтернативу. Всегда имейте план, который обеспечит вашу безопасность и возможность уйти при необходимости.",
      },
      {
        icon: "message",
        title: "Общайтесь через платформу",
        content:
          "Делитесь своими контактами или адресом только тогда, когда уверены в личности другого человека и чувствуете себя в безопасности. До этого пользуйтесь внутренним чатом платформы.",
      },
      {
        icon: "users",
        title: "Встречайтесь в публичном месте",
        content:
          "Для первой встречи выбирайте публичное, людное место или приглашайте других людей. Сообщите другу или члену семьи, где и с кем вы встречаетесь.",
      },
      {
        icon: "shield",
        title: "Знайте свои границы",
        content:
          "Чётко обозначайте свои личные границы и не бойтесь о них говорить. Не стесняйтесь сказать «нет» и покинуть ситуацию, если вам некомфортно или небезопасно.",
      },
    ],
    reportTitle: "Сообщить о негативном опыте",
    reportContent:
      "Наша команда доверия и безопасности помогает создать максимально безопасное и надежное сообщество. Сообщение о проблемах безопасности помогает защитить будущих участников. Конфиденциально сообщайте о негативном опыте или проблемах безопасности по адресу: info@nesveskvienas.lt",
    emergencyTitle: "Экстренные контакты в Литве",
    emergencyContent:
      "Общий номер экстренной помощи: 112 | Полиция: 02 или 112 | Скорая помощь: 03 или 112",
  },
  ua: {
    title: "Правила безпеки",
    subtitle:
      "Ваша безпека є пріоритетом. Будь ласка, серйозно ставтеся до цих рекомендацій.",
    intro:
      "Платформа лише створює можливість для контакту між учасниками — ви самі несете відповідальність за свої рішення та дії.",
    tips: [
      {
        icon: "eye",
        title: "Уважно переглядайте профілі",
        content:
          "Приділіть час вивченню профілів інших користувачів. Оцініть, чи викликають довіру їхній опис, фото та стиль спілкування.",
      },
      {
        icon: "alert",
        title: "Довіряйте своїй інтуїції",
        content:
          "Якщо людина або ситуація викликає сумніви чи здається небезпечною, припиніть спілкування. Ваш комфорт і безпека — найважливіші.",
      },
      {
        icon: "mappin",
        title: "Знайте свої можливості",
        content:
          "Якщо щось іде не так із вашим господарем, шукайте альтернативу. Завжди майте план, який забезпечить вашу безпеку та можливість залишити ситуацію за потреби.",
      },
      {
        icon: "message",
        title: "Спілкуйтеся через платформу",
        content:
          "Діліться своїми контактами або адресою лише тоді, коли ви впевнені в особистості іншої людини та почуваєтеся в безпеці. До цього користуйтеся внутрішнім чатом платформи.",
      },
      {
        icon: "users",
        title: "Зустрічайтеся в громадських місцях",
        content:
          "Під час першої зустрічі вибирайте публічне, людне місце або запрошуйте інших людей приєднатися. Повідомте друга чи члена сім'ї, де та з ким ви зустрічаєтесь.",
      },
      {
        icon: "shield",
        title: "Знайте свої межі",
        content:
          "Чітко визначайте свої обмеження та відкрито про них говоріть. Не вагайтеся сказати «ні» та покинути ситуацію, якщо вам некомфортно або небезпечно.",
      },
    ],
    reportTitle: "Повідомити про негативний досвід",
    reportContent:
      "Наша команда довіри та безпеки допомагає створити максимально безпечну та надійну спільноту. Повідомлення про проблеми безпеки допомагає захистити майбутніх учасників. Конфіденційно повідомляйте про негативний досвід або проблеми безпеки за адресою: info@nesveskvienas.lt",
    emergencyTitle: "Екстрені контакти в Литві",
    emergencyContent:
      "Загальний номер екстреної допомоги: 112 | Поліція: 02 або 112 | Швидка допомога: 03 або 112",
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  eye: Eye,
  alert: AlertTriangle,
  mappin: MapPin,
  message: MessageCircle,
  users: Users,
  shield: ShieldCheck,
};

export default function SafetyPage() {
  const { t, locale } = useLocale();
  const c = safetyContent[locale] || safetyContent.lt;

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
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-10 w-10 text-green-600" />
            <div>
              <h1 className="font-bold text-3xl text-gray-900">{c.title}</h1>
              <p className="text-gray-600">{c.subtitle}</p>
            </div>
          </div>

          <p className="mb-8 text-gray-600 text-lg">{c.intro}</p>

          <div className="grid gap-6 md:grid-cols-2">
            {c.tips.map((tip) => {
              const IconComponent = iconMap[tip.icon] || ShieldCheck;
              return (
                <div
                  className="rounded-lg border border-gray-100 bg-gray-50 p-6"
                  key={tip.title}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <IconComponent className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{tip.content}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg bg-amber-50 p-6">
            <h2 className="mb-2 font-semibold text-amber-800 text-lg">
              {c.reportTitle}
            </h2>
            <p className="text-amber-700">{c.reportContent}</p>
          </div>

          <div className="mt-6 rounded-lg bg-red-50 p-6">
            <h2 className="mb-2 font-semibold text-lg text-red-800">
              {c.emergencyTitle}
            </h2>
            <p className="font-medium text-red-700">{c.emergencyContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
