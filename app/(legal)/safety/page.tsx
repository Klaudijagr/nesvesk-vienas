"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
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
};

type SafetyContent = Record<string, SafetyContentItem>;

const safetyContent: SafetyContent = {
  lt: {
    title: "Saugos gairės",
    subtitle: "Jūsų saugumas yra svarbus. Priimkite tai rimtai. Mes taip pat.",
    intro:
      "Susitikdami su naujais žmonėmis, visada būkite atsargūs. Šios gairės padės jums saugiai naudotis platforma.",
    tips: [
      {
        icon: "eye",
        title: "Atidžiai peržiūrėkite profilius",
        content:
          "Skirkite laiko atidžiai peržiūrėti narių profilius. Perskaitykite, ką nariai sako apie save.",
      },
      {
        icon: "alert",
        title: "Pasitikėkite savo nuojauta",
        content:
          "Jei asmuo, situacija ar profilis atrodo nesaugus dėl bet kokios priežasties, eikite toliau. Nesijaudinkite dėl to, kad atrodote nemandagūs.",
      },
      {
        icon: "mappin",
        title: "Turėkite atsarginį planą",
        content:
          "Žinokite savo galimybes. Jei kažkas neveikia su jūsų šeimininku, įsitikinkite, kad turite alternatyvią vietą apsistoti.",
      },
      {
        icon: "message",
        title: "Bendraukite per platformą",
        content:
          "Niekada nesidalinkite savo telefono numeriu ar el. pašto adresu naujam asmeniui, kol nesusitiksite ir nepasijusite patogiai.",
      },
      {
        icon: "users",
        title: "Susitikite viešoje vietoje",
        content:
          "Pirmą kartą susitikdami, pasirinkite viešą vietą. Praneškite draugui ar šeimos nariui, kur būsite.",
      },
      {
        icon: "shield",
        title: "Žinokite savo ribas",
        content:
          "Būkite aiškūs dėl savo ribų ir nedrovėkite jų pareikšti. Pasirūpinkite savimi.",
      },
    ],
    reportTitle: "Pranešti apie neigiamą patirtį",
    reportContent:
      "Jei susiduriate su nepriimtinu elgesiu, praneškite mums el. paštu: info@nesveskvienas.lt",
  },
  en: {
    title: "Safety Guidelines",
    subtitle: "Your safety is important. Take it seriously. We do.",
    intro:
      "When meeting new people, always exercise caution. These guidelines will help you use the platform safely.",
    tips: [
      {
        icon: "eye",
        title: "Review Profiles Carefully",
        content:
          "Take the time to carefully review member profiles. Read what members say about themselves.",
      },
      {
        icon: "alert",
        title: "Trust Your Instincts",
        content:
          "If a person, situation or profile seems unsafe for any reason, move on. Don't worry about seeming rude.",
      },
      {
        icon: "mappin",
        title: "Have a Backup Plan",
        content:
          "Know your options. If something doesn't work out with your host, make sure you have an alternate place to stay.",
      },
      {
        icon: "message",
        title: "Communicate Through Platform",
        content:
          "Never give out your phone number or email address to a new person until you meet and feel comfortable.",
      },
      {
        icon: "users",
        title: "Meet in Public Places",
        content:
          "For first meetings, choose a public place. Let a friend or family member know where you'll be.",
      },
      {
        icon: "shield",
        title: "Know Your Limits",
        content:
          "Be clear about your boundaries and don't be shy about stating them. Take care of yourself.",
      },
    ],
    reportTitle: "Report Negative Experiences",
    reportContent:
      "If you encounter unacceptable behavior, please report to us at: info@nesveskvienas.lt",
  },
  ru: {
    title: "Правила безопасности",
    subtitle: "Ваша безопасность важна. Отнеситесь к этому серьезно. Мы тоже.",
    intro:
      "При встрече с новыми людьми всегда соблюдайте осторожность. Эти рекомендации помогут вам безопасно пользоваться платформой.",
    tips: [
      {
        icon: "eye",
        title: "Внимательно изучайте профили",
        content:
          "Уделите время тщательному изучению профилей участников. Прочитайте, что участники говорят о себе.",
      },
      {
        icon: "alert",
        title: "Доверяйте своей интуиции",
        content:
          "Если человек, ситуация или профиль кажутся небезопасными по какой-либо причине, идите дальше. Не беспокойтесь о том, что покажетесь грубым.",
      },
      {
        icon: "mappin",
        title: "Имейте запасной план",
        content:
          "Знайте свои варианты. Если что-то не получается с хозяином, убедитесь, что у вас есть альтернативное место для проживания.",
      },
      {
        icon: "message",
        title: "Общайтесь через платформу",
        content:
          "Никогда не давайте свой номер телефона или адрес электронной почты новому человеку, пока не встретитесь и не почувствуете себя комфортно.",
      },
      {
        icon: "users",
        title: "Встречайтесь в общественных местах",
        content:
          "Для первых встреч выбирайте общественное место. Сообщите другу или члену семьи, где вы будете.",
      },
      {
        icon: "shield",
        title: "Знайте свои границы",
        content:
          "Четко обозначьте свои границы и не стесняйтесь их озвучивать. Заботьтесь о себе.",
      },
    ],
    reportTitle: "Сообщить о негативном опыте",
    reportContent:
      "Если вы столкнулись с неприемлемым поведением, сообщите нам по адресу: info@nesveskvienas.lt",
  },
  ua: {
    title: "Правила безпеки",
    subtitle: "Ваша безпека важлива. Ставтеся до цього серйозно. Ми теж.",
    intro:
      "При зустрічі з новими людьми завжди дотримуйтесь обережності. Ці рекомендації допоможуть вам безпечно користуватися платформою.",
    tips: [
      {
        icon: "eye",
        title: "Уважно вивчайте профілі",
        content:
          "Приділіть час ретельному вивченню профілів учасників. Прочитайте, що учасники говорять про себе.",
      },
      {
        icon: "alert",
        title: "Довіряйте своїй інтуїції",
        content:
          "Якщо людина, ситуація або профіль здаються небезпечними з будь-якої причини, йдіть далі. Не турбуйтеся про те, що здаватиметеся грубим.",
      },
      {
        icon: "mappin",
        title: "Майте запасний план",
        content:
          "Знайте свої варіанти. Якщо щось не виходить з господарем, переконайтеся, що у вас є альтернативне місце для проживання.",
      },
      {
        icon: "message",
        title: "Спілкуйтеся через платформу",
        content:
          "Ніколи не давайте свій номер телефону або адресу електронної пошти новій людині, поки не зустрінетеся і не відчуєте себе комфортно.",
      },
      {
        icon: "users",
        title: "Зустрічайтеся в громадських місцях",
        content:
          "Для перших зустрічей обирайте громадське місце. Повідомте другу або члену сім'ї, де ви будете.",
      },
      {
        icon: "shield",
        title: "Знайте свої межі",
        content:
          "Чітко позначте свої межі і не соромтеся їх озвучувати. Піклуйтеся про себе.",
      },
    ],
    reportTitle: "Повідомити про негативний досвід",
    reportContent:
      "Якщо ви зіткнулися з неприйнятною поведінкою, повідомте нам за адресою: info@nesveskvienas.lt",
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  eye: Eye,
  alert: AlertTriangle,
  mappin: MapPin,
  message: MessageCircle,
  users: Users,
  shield: ShieldCheck,
  phone: Phone,
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
            <ShieldCheck className="h-10 w-10 text-green-600" />
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
        </div>
      </div>
    </div>
  );
}
