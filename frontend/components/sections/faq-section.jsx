"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "@/redux/features/siteContentSlice";
import { useLanguage } from "@/context/LanguageContext";

const FAQS_BY_LANG = {
  ar: [
    {
      q: "كيف يمكنني الانضمام إلى عضوية المنظمة العالمية لخريجي الأزهر؟",
      a: "نرحب بجميع خريجي الأزهر الشريف والباحثين والمهتمين بالالتحاق بالمنظمة عبر ملء استمارة العضوية المتاحة على صفحة العضوية بموقعنا.",
    },
    {
      q: "ما هي الرسالة الأساسية لفرع الهند؟",
      a: "جمع خريجي الأزهر الشريف في الهند، وتعزيز التعاون العلمي والفكري بينهم، ونشر منهج الوسطية والاعتدال في المجتمع الهندى بين جميع الأطياف، ودعم المبادرات التعليمية والبحثية.",
    },
    {
      q: "أين يقع المكتب الرئيسي لفرع الهند؟",
      a: "يقع المكتب الرئيسي للمنظمة العالمية لخريجي الأزهر – فرع الهند في العاصمة نيودلهي، الهند.",
    },
    {
      q: "هل تنظم المنظمة دورات وورش عمل في اللغة العربية؟",
      a: "نعم، تقيم المنظمة دورات متخصصة وورش عمل في اللغة العربية والعلوم الإسلامية ومحاضرات مباشرة عبر الإنترنت يشارك فيها نخبة من علماء الأزهر بالقاهرة.",
    },
  ],
  ur: [
    {
      q: "میں تنظیم کی رکنیت کیسے حاصل کر سکتا ہوں؟",
      a: "آپ ہماری ویب سائٹ کے 'رکنیت' صفحے پر جا کر آن لائن ممبرشپ فارم پُر کر کے باآسانی رکنیت کی درخواست جمع کر سکتے ہیں۔",
    },
    {
      q: "تنظیم کا بنیادی مقصد اور مشن کیا ہے؟",
      a: "ہندوستان بھر میں فضلاء ازہر کو ایک پلیٹ فارم پر جمع کرنا، علمی و فکری تعاون کو فروغ دینا، فکرِ اعتدال کو عام کرنا اور خدمتِ معاشرہ کے لیے مل کر کام کرنا۔",
    },
    {
      q: "انڈین برانچ کا مرکزی دفتر کہاں واقع ہے؟",
      a: "عالمی رابطہ برائے فضلاء ازہر – انڈیا کا مرکزی دفتر نئی دہلی، ہندوستان میں واقع ہے۔",
    },
    {
      q: "کیا تنظیم عربی زبان اور اسلامی علوم کے پروگرامز منعقد کرتی ہے؟",
      a: "جی ہاں، تنظیم کے تحت عربی زبان، حدیث و تفسیر اور فکری موضوعات پر ورکشاپس اور جامعہ ازہر کے اساتذہ کے آن لائن خطابات کا انعقاد کیا جاتا ہے۔",
    },
  ],
  hi: [
    {
      q: "वर्ल्ड एसोसिएशन फॉर अल-अज़हर ग्रेजुएट्स की सदस्यता कैसे लें?",
      a: "आप हमारी वेबसाइट के सदस्यता पृष्ठ पर जाकर सदस्यता आवेदन फॉर्म भरकर संस्था से जुड़ सकते हैं।",
    },
    {
      q: "संस्था का मुख्य मिशन और दृष्टि क्या है?",
      a: "अल-अज़हर शरीफ़ की शैक्षिक, बौद्धिक और मानवीय विरासत को आगे बढ़ाना, भारतीय अज़हरी विद्वानों को गुणवत्तापूर्ण अवसर प्रदान करना तथा समाज में ज्ञान, सहिष्णुता और मानवीय मूल्यों को प्रोत्साहित करना।",
    },
    {
      q: "भारत शाखा का मुख्य कार्यालय कहाँ स्थित है?",
      a: "वर्ल्ड एसोसिएशन फॉर अल-अज़हर ग्रेजुएट्स – भारत का मुख्य कार्यालय नई दिल्ली, भारत में स्थित है।",
    },
    {
      q: "क्या संस्था अरबी भाषा एवं शैक्षिक कार्यशालाओं का आयोजन करती है?",
      a: "हाँ, संस्था अरबी भाषा कार्यशालाओं, विद्वानों के व्याख्यानों, सम्मेलनों और मानवीय गतिविधियों का नियमित आयोजन करती है।",
    },
  ],
  en: [
    {
      q: "How can I become a member of Al-Azhar Graduates?",
      a: "You can join us by completing the membership registration form on our Membership page.",
    },
    {
      q: "What is the primary mission of the organization?",
      a: "Our mission is to connect Al-Azhar graduates across India, foster academic cooperation, spread moderate Islamic values, and serve society through constructive initiatives.",
    },
    {
      q: "Where is the India branch headquartered?",
      a: "World Association for Al-Azhar Graduates – India is headquartered in New Delhi, India.",
    },
    {
      q: "Does the organization offer Arabic courses and webinars?",
      a: "Yes, we organize specialized Arabic courses, Hadith and Tafsir workshops, and online webinars delivered by prominent scholars from Al-Azhar University, Cairo.",
    },
  ],
};

export function FaqSection() {
  const { t, isRTL, language } = useLanguage();
  const dispatch = useDispatch();
  const { data: siteContent } = useSelector((state) => state.siteContent);

  useEffect(() => {
    dispatch(fetchSiteContent());
  }, [dispatch]);

  const defaultFaqs = FAQS_BY_LANG[language] || FAQS_BY_LANG.en;
  let faqs = defaultFaqs;
  if (siteContent?.faqs?.content && language === "en") {
    try {
      const parsed = JSON.parse(siteContent.faqs.content);
      if (Array.isArray(parsed) && parsed.length > 0) faqs = parsed;
    } catch (e) {}
  }

  return (
    <section className="relative bg-background py-16 md:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Decorative background elements */}
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(147,224,24,0.05),transparent_50%)]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(25,76,143,0.05),transparent_50%)]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            {/* Left Column - Sticky Heading */}
            <div className="lg:sticky lg:top-16 lg:h-max">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy shadow-sm">
                <HelpCircle className="size-4 text-accent" />
                {t("common.have_questions", "Have Questions?")}
              </div>
              <h2
                className="font-serif text-3xl font-bold text-navy sm:text-4xl lg:text-5xl lg:leading-tight"
                style={{ fontFamily: isRTL ? "inherit" : "var(--font-cinzel), serif" }}
              >
                {t("common.faqs", "Frequently Asked Questions")}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t("common.faq_desc", "Find answers to common questions about our organization, membership, and educational programs.")}
              </p>
            </div>

            {/* Right Column - Accordion */}
            <div className="rounded-3xl border border-border/50 bg-white p-6 shadow-xl shadow-navy/5 sm:p-8">
              <Accordion type="single" className="w-full" defaultValue="item-0">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b-border/40 py-2 last:border-0"
                  >
                    <AccordionTrigger className="text-start text-[15px] font-bold text-navy hover:text-accent transition-colors py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-4 text-start">
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
