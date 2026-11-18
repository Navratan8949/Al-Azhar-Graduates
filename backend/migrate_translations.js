const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

async function migrateData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for 4-Language Database Migration...");

  const db = mongoose.connection.db;

  // 1. UPDATE EVENT
  console.log("Updating Event...");
  await db.collection("events").updateOne(
    { _id: new mongoose.Types.ObjectId("6a9544c7776f29e74145db04") },
    {
      $set: {
        translations: {
          en: {
            title: "International Peace Conference – 2017",
            description: "“The Need and Importance of Peace, and Peaceful Coexistence in the Contemporary World”\n\nIn 2017, the India Branch organized an international peace conference at the India Islamic Cultural Centre, New Delhi.\n\nThe conference brought together distinguished scholars, academics, religious leaders and social figures from India and abroad. Professor Dr. Yousuf Amer, then Vice President of Al-Azhar University, participated from Egypt.\n\nThe conference highlighted the values of peace, moderation, tolerance, dialogue and peaceful coexistence and served as an important platform for presenting Al-Azhar's balanced message in India.",
            location: "India Islamic Cultural Centre, New Delhi"
          },
          ar: {
            title: "مؤتمر السلام الدولي – 2017",
            description: "«ضرورة السلام وأهميته، والتعايش السلمي في العالم المعاصر»\n\nفي عام 2017، نظم فرع الهند مؤتمراً دولياً للسلام بالمركز الثقافي الإسلامي الهندي بنيودلهي.\n\nجمع المؤتمر نخبة متميزة من كبار العلماء والأكاديميين والقيادات الدينية والمجتمعية من الهند وخارجها، بمشاركة الأستاذ الدكتور يوسف عامر، نائب رئيس جامعة الأزهر آنذاك، قادماً من مصر.\n\nسلط المؤتمر الضوء على قيم السلام والوسطية والتسامح والحوار والتعايش السلمي، وكان منصة رائدة لنشر رسالة الأزهر الشريف المعتدلة في الهند.",
            location: "المركز الثقافي الإسلامي الهندي، نيودلهي"
          },
          ur: {
            title: "بین الاقوامی امن کانفرنس – 2017",
            description: "”عصرِ حاضر میں امن کی ضرورت، اہمیت اور پرامن بقائے باہمی“\n\nسن 2017 میں انڈیا برانچ نے انڈیا اسلامک کلچرل سینٹر نئی دہلی میں ایک عظیم الشان بین الاقوامی امن کانفرنس کا انعقاد کیا۔\n\nاس کانفرنس میں بھارت اور بیرونِ ملک کے ممتاز علماء، دانشوران، مذہبی و سماجی رہنماؤں نے شرکت کی۔ مصر سے جامعہ ازہر کے اس وقت کے نائب صدر پروفیسر ڈاکٹر یوسف عامر نے خصوصی شرکت فرمائی۔\n\nکانفرنس نے امن، اعتدال، رواداری اور باہمی مکالمے کے اصولوں کو اجاگر کیا اور بھارت میں جامعہ ازہر کے معتدل فکر کی ترویج کا اہم سنگ میل ثابت ہوئی۔",
            location: "انڈیا اسلامک کلچرل سینٹر، نئی دہلی"
          },
          hi: {
            title: "अंतर्राष्ट्रीय शांति सम्मेलन – 2017",
            description: "“समकालीन विश्व में शांति की आवश्यकता व महत्व और शांतिपूर्ण सह-अस्तित्व”\n\nवर्ष 2017 में, इंडिया ब्रांच ने इंडिया इस्लामिक कल्चरल सेंटर, नई दिल्ली में एक अंतर्राष्ट्रीय शांति सम्मेलन का आयोजन किया।\n\nसम्मेलन में भारत और विदेशों के प्रतिष्ठित विद्वानों, शिक्षाविदों, धार्मिक और सामाजिक हस्तियों ने भाग लिया। मिस्र से अल-अज़हर विश्वविद्यालय के तत्कालीन उपाध्यक्ष प्रो. डॉ. यूसुफ आमेर ने सहभागिता की।\n\nइस सम्मेलन ने शांति, संयम, सहिष्णुता, संवाद और शांतिपूर्ण सह-अस्तित्व के मूल्यों पर बल दिया और भारत में अल-अज़हर के संतुलित संदेश को प्रस्तुत किया।",
            location: "इंडिया इस्लामिक कल्चरल सेंटर, नई दिल्ली"
          }
        }
      }
    }
  );

  // 2. UPDATE 7 PROJECTS
  console.log("Updating Projects...");
  const projectTranslations = {
    "6a95410ac48f90920152df2d": {
      en: {
        title: "Arabic Language Programs",
        description: "Specialized Arabic language courses and workshops are conducted through both online and offline formats."
      },
      ar: {
        title: "برامج ودورات اللغة العربية",
        description: "دورات وورش عمل تخصصية في اللغة العربية تُعقد بانتظام عبر الإنترنت وحضورياً لتنمية المهارات اللغوية والتواصلية."
      },
      ur: {
        title: "عربی زبان کے تعلیمی پروگرامز",
        description: "آن لائن اور آف لائن دونوں صورتوں میں عربی زبان کے خصوصی کورسز اور ورکشاپس کا انعقاد کیا جاتا ہے۔"
      },
      hi: {
        title: "अरबी भाषा शिक्षण कार्यक्रम",
        description: "ऑनलाइन और ऑफलाइन दोनों माध्यमों से विशेष अरबी भाषा पाठ्यक्रम और कार्यशालाएं आयोजित की जाती हैं।"
      }
    },
    "6a95410ac48f90920152df2e": {
      en: {
        title: "Hadith & Tafsir Programs",
        description: "Special programs and study sessions are organized in Hadith, Qur'anic Tafsir and other Islamic sciences."
      },
      ar: {
        title: "برامج ومجالس الحديث والتفسير",
        description: "تنظيم مجالس علمية ودورات مكثفة في علوم الحديث الشريف والتفسير القرآني والعلوم الإسلامية المتنوعة."
      },
      ur: {
        title: "حدیث و تفسیر کے تعلیمی سیشنز",
        description: "حدیثِ نبوی، تفہیم القرآن اور دیگر اسلامی علوم میں خصوصی تعلیمی نشستوں اور دروس کا اہتمام کیا جاتا ہے۔"
      },
      hi: {
        title: "हदीस एवं तफ़सीर अध्ययन कार्यक्रम",
        description: "हदीस, क़ुरआन की तफ़सीर और अन्य इस्लामी ज्ञान में विशेष अध्ययन सत्र और कार्यशालाएं आयोजित की जाती हैं।"
      }
    },
    "6a95410ac48f90920152df2f": {
      en: {
        title: "Lectures from Al-Azhar",
        description: "The organization regularly facilitates online academic and intellectual sessions featuring scholars from Al-Azhar in Cairo."
      },
      ar: {
        title: "محاضرات وندوات من رحاب الأزهر الشريف",
        description: "تنظم المنظمة دورياً لقاءات وندوات فكرية وأكاديمية عبر الإنترنت بمشاركة نخبة من كبار علماء وشيوخ الأزهر بالقاهرة."
      },
      ur: {
        title: "جامعہ ازہر قاہرہ کے اساتذہ کے خصوصی خطابات",
        description: "تنظیم جامعہ ازہر قاہرہ کے جید علماء اور اساتذہ کے زیرِ نگرانی باقاعدگی سے آن لائن علمی اور فکری نشستیں منعقد کرتی ہے۔"
      },
      hi: {
        title: "अल-अज़हर काहिरा से विशेष व्याख्यान",
        description: "संस्था नियमित रूप से काहिरा स्थित अल-अज़हर के प्रख्यात विद्वानों द्वारा ऑनलाइन शैक्षणिक और बौद्धिक सत्र आयोजित करती है।"
      }
    },
    "6a95410ac48f90920152df30": {
      en: {
        title: "Intellectual & Outreach Programs",
        description: "Our activities include: Academic seminars, Intellectual forums, Conferences, Training workshops, Youth programs, Online lectures, Interfaith dialogues, Cultural programs, Educational campaigns, and Community initiatives."
      },
      ar: {
        title: "البرامج الفكرية والمجتمعية التوعوية",
        description: "تتضمن أنشطتنا: ندوات أكاديمية، منتديات فكرية، مؤتمرات، ورش تدريبية، ملتقيات شبابية، حوارات بين الأديان، ومبادرات خدمة المجتمع."
      },
      ur: {
        title: "فکری اور سماجی بیداری پروگرامز",
        description: "ہماری سرگرمیوں میں علمی سیمینار، فکری مجالس، کانفرنسز، تربیتی ورکشاپس، نوجوانوں کے پروگرامز، بین المذاہب مکالمے اور سماجی خدمات شامل ہیں۔"
      },
      hi: {
        title: "बौद्धिक एवं सामाजिक उत्थान कार्यक्रम",
        description: "हमारी गतिविधियों में शामिल हैं: शैक्षणिक सेमिनार, विचार मंच, सम्मेलन, प्रशिक्षण कार्यशालाएं, युवा कार्यक्रम, सर्वधर्म संवाद और सामुदायिक पहल।"
      }
    },
    "6a994bb70375beadf190d112": {
      en: {
        title: "Empower Rural Education",
        description: "Help us build a digital classroom in remote villages of Gujarat. Every contribution ensures quality education for underprivileged children."
      },
      ar: {
        title: "دعم وتطوير التعليم الريفي",
        description: "ساهم معنا في إنشاء فصول دراسية رقمية في القرى النائية. كل تبرع يضمن تعليماً متطوراً للأطفال المحرومين."
      },
      ur: {
        title: "دیہی تعلیم کو بااختیار بنانا",
        description: "دیہی علاقوں میں ڈیجیٹل کلاس رومز قائم کرنے میں ہمارا ساتھ دیں۔ آپ کا ہر تعاون پسماندہ بچوں کو معیاری تعلیم کی ضمانت دیتا ہے۔"
      },
      hi: {
        title: "ग्रामीण शिक्षा सशक्तिकरण",
        description: "दूरदराज के गांवों में डिजिटल कक्षाएं स्थापित करने में हमारा सहयोग करें। प्रत्येक योगदान जरूरतमंद बच्चों को गुणवत्तापूर्ण शिक्षा सुनिश्चित करता है।"
      }
    },
    "6a994bb70375beadf190d113": {
      en: {
        title: "Emergency Medical Relief Fund",
        description: "Providing life-saving medicines and free health camps to communities without access to basic healthcare facilities."
      },
      ar: {
        title: "صندوق الإغاثة الطبية الطارئة",
        description: "توفير الأدوية المنقذة للحياة وإقامة مخيمات صحية مجانية للمجتمعات التي تفتقر إلى الرعاية الصحية الأساسية."
      },
      ur: {
        title: "ہنگامی طبی امدادی فنڈ",
        description: "بنیادی طبی سہولیات سے محروم بستیوں کے لیے مفت میڈیکل کیمپس کا قیام اور جان بچانے والی ادویات کی بلا معاوضہ فراہمی۔"
      },
      hi: {
        title: "आपातकालीन चिकित्सा राहत कोष",
        description: "बुनियादी स्वास्थ्य सुविधाओं से वंचित बस्तियों के लिए जीवन रक्षक दवाएं और निःशुल्क स्वास्थ्य जांच शिविर उपलब्ध कराना।"
      }
    },
    "6a994bb70375beadf190d114": {
      en: {
        title: "Community Kitchen Initiative",
        description: "Sponsor meals for daily wage workers and destitute families. Your support can end hunger in our community."
      },
      ar: {
        title: "مبادرة المطبخ المجتمعي وإطعام الطعام",
        description: "كفالة وجبات غذائية للعمال وأصحاب الدخل المحدود والأسر المتعففة لمكافحة الجوع وإعانة المحتاجين."
      },
      ur: {
        title: "کمیونٹی کچن اور راشن کی فراہمی",
        description: "دیہاڑی دار مزدوروں اور بے سہارا خاندانوں کے لیے باوقار خوراک کی فراہمی۔ آپ کی مدد سے بھوک کا خاتمہ ممکن ہے۔"
      },
      hi: {
        title: "सामुदायिक रसोई पहल",
        description: "दिहाड़ी मजदूरों और असहाय परिवारों के लिए भोजन की व्यवस्था। आपका समर्थन समुदाय में भूख मिटाने में मदद कर सकता है।"
      }
    }
  };

  for (const [id, tr] of Object.entries(projectTranslations)) {
    await db.collection("projects").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { translations: tr } }
    );
  }

  // 3. UPDATE 2 NEWS
  console.log("Updating News...");
  await db.collection("news").updateOne(
    { _id: new mongoose.Types.ObjectId("6a954c25acce046533a178c9") },
    {
      $set: {
        translations: {
          en: {
            title: "Al-Azhar Grand Imam Condemns Violence and Urges Global Peace",
            description: "In a recent statement, the Grand Imam of Al-Azhar called upon the international community to work together for global peace and harmony. He emphasized the core Islamic values of tolerance, coexistence, and mutual respect among different cultures and faiths. The statement has been widely welcomed by peace advocates globally."
          },
          ar: {
            title: "فضيلة الإمام الأكبر شيخ الأزهر يدين العنف ويدعو إلى تعزيز السلام العالمي",
            description: "في بيان رسمي، دعا فضيلة الإمام الأكبر شيخ الأزهر المجتمع الدولي إلى التكاتف من أجل إحلال السلام والوئام العالمي. وأكد فضيلته على قيم الإسلام السمحة في التسامح والتعايش السلمي والاحترام المتبادل بين مختلف الثقافات والأديان، وقد لقي البيان ترحيباً دولياً واسعاً من دعاة السلام حول العالم."
          },
          ur: {
            title: "امامِ اکبر شیخ الازہر کی جانب سے شدت پسندی کی مذمت اور عالمی امن کی پرزور اپیل",
            description: "ایک اہم بیان میں امامِ اکبر شیخ الازہر نے عالمی برادری پر زور دیا کہ وہ دنیا میں امن و امان اور باہمی رواداری کے لیے متحد ہو کر کام کرے۔ انہوں نے اسلام کی اساسی تعلیمات جیسے عفو و درگزر، بقائے باہمی اور تمام مذاہب و ثقافتوں کے باہمی احترام پر زور دیا۔ اس بیان کو عالمی سطح پر امن پسند حلقوں میں سراہا گیا ہے۔"
          },
          hi: {
            title: "अल-अज़हर के ग्रैंड इमाम ने हिंसा की निंदा की और वैश्विक शांति का आह्वान किया",
            description: "एक हालिया बयान में, अल-अज़हर के ग्रैंड इमाम ने अंतर्राष्ट्रीय समुदाय से वैश्विक शांति और सद्भाव के लिए एकजुट होकर काम करने का आह्वान किया। उन्होंने विभिन्न संस्कृतियों और आस्थाओं के बीच सहिष्णुता, सह-अस्तित्व और पारस्परिक सम्मान के मूल इस्लामी मूल्यों पर बल दिया।"
          }
        }
      }
    }
  );

  await db.collection("news").updateOne(
    { _id: new mongoose.Types.ObjectId("6a954c25acce046533a178ca") },
    {
      $set: {
        translations: {
          en: {
            title: "World Organization for Al-Azhar Graduates Launches New Arabic Language Online Course",
            description: "To further promote the understanding of the Arabic language and Islamic sciences, the India branch has launched an intensive online Arabic course. The course is designed for beginners and intermediate learners, aiming to bridge the gap in classical Arabic education and connect students directly with Al-Azhar's rich academic curriculum."
          },
          ar: {
            title: "المنظمة العالمية لخريجي الأزهر تطلق دورة جديدة ومكثفة لتعليم اللغة العربية عبر الإنترنت",
            description: "تعزيزاً لفهم لغة القرآن والعلوم الإسلامية، أطلق فرع الهند دورة مكثفة لتعليم اللغة العربية عبر الإنترنت للمبتدئين والمتوسطين، بهدف ربط الدارسين والباحثين مباشرة بمناهج الأزهر الشريف العريقة وتطوير مهاراتهم التعبيرية والفكرية."
          },
          ur: {
            title: "عالمی رابطہ تنظیم برائے فارغینِ ازہر کی جانب سے نئے آن لائن عربی کورس کا آغاز",
            description: "عربی زبان اور اسلامی علوم کی ترویج کے مقصد سے انڈیا برانچ نے ایک جامع آن لائن عربی کورس شروع کیا ہے۔ یہ کورس ابتدائی اور متوسط سطح کے طلبہ کے لیے مرتب کیا گیا ہے تاکہ وہ براہِ راست جامعہ ازہر کے شاندار نصاب سے مستفید ہو سکیں۔"
          },
          hi: {
            title: "अल-अज़हर स्नातक संघ ने नए ऑनलाइन अरबी भाषा पाठ्यक्रम का शुभारंभ किया",
            description: "अरबी भाषा और इस्लामी अध्ययन की समझ को बढ़ावा देने के लिए, इंडिया ब्रांच ने एक गहन ऑनलाइन अरबी पाठ्यक्रम शुरू किया है, जो छात्रों को सीधे अल-अज़हर के समृद्ध शैक्षणिक पाठ्यक्रम से जोड़ता है।"
          }
        }
      }
    }
  );

  // 4. UPDATE 3 CROWDFUNDINGS
  console.log("Updating Crowdfundings...");
  const crowdTranslations = {
    "6a994f1c5228386e02b5007f": {
      en: {
        title: "Build a Digital Library",
        description: "Help us provide digital tablets and e-books to rural students who lack access to physical libraries."
      },
      ar: {
        title: "تأسيس وتجهيز مكتبة إلكترونية للطلاب",
        description: "ساعدنا في تزويد طلاب المدارس في المناطق الريفية بالأجهزة اللوحية والمراجع العلمية الرقمية لدعم مسيرتهم التعليمية."
      },
      ur: {
        title: "ڈیجیٹل لائبریری اور ای بکس کی فراہمی",
        description: "دیہی علاقوں کے طلبہ کو ڈیجیٹل ٹیبلٹس اور ای کتب فراہم کرنے میں ہمارا تعاون کریں تاکہ وہ جدید تعلیم حاصل کر سکیں۔"
      },
      hi: {
        title: "डिजिटल लाइब्रेरी का निर्माण",
        description: "ग्रामीण छात्रों को डिजिटल टैबलेट और ई-पुस्तकें उपलब्ध कराने में हमारी मदद करें, जिनके पास भौतिक पुस्तकालयों तक पहुंच नहीं है।"
      }
    },
    "6a994f1c5228386e02b50080": {
      en: {
        title: "Winter Clothes Donation Drive",
        description: "Join hands to provide warm clothing and blankets to the homeless during the harsh winter months."
      },
      ar: {
        title: "حملة دفء الشتاء وتوزيع البطانيات والكسوة",
        description: "شاركنا في توزيع الملابس الشتوية والبطانيات للأسر المتعففة والمشردين لحمايتهم من برد الشتاء القارس."
      },
      ur: {
        title: "سرمائی لباس اور کمبل تقسیم مہم",
        description: "سخت سردی کے موسم میں بے گھر اور ضرورت مند خاندانوں کو گرم کپڑے اور کمبل فراہم کرنے کے لیے ہمارے شانہ بشانہ کھڑے ہوں۔"
      },
      hi: {
        title: "सर्दियों के वस्त्र और कंबल वितरण अभियान",
        description: "भीषण सर्दी के महीनों में बेघर लोगों को गर्म कपड़े और कंबल उपलब्ध कराने के लिए हमारा साथ दें।"
      }
    },
    "6a994f1c5228386e02b50081": {
      en: {
        title: "Orphanage Renovation Fund",
        description: "Raising funds to repair and upgrade the living facilities for 50 orphan children in our local care center."
      },
      ar: {
        title: "صندوق تجديد وتطوير دار رعاية الأيتام",
        description: "جمع التبرعات لصيانة وتطوير مرافق السكن والمعيشة لـ 50 طفلاً يتيماً في دار الرعاية وتوفير بيئة كريمة لهم."
      },
      ur: {
        title: "یتیم خانے کی تزئین و مرمت کا فنڈ",
        description: "مقامی کیئر سینٹر میں 50 یتیم بچوں کے لیے رہائشی سہولیات کی مرمت اور اپ گریڈیشن کے لیے فنڈز جمع کرنا۔"
      },
      hi: {
        title: "अनाथालय नवीनीकरण कोष",
        description: "हमारे स्थानीय देखभाल केंद्र में 50 अनाथ बच्चों के लिए रहने की सुविधाओं की मरम्मत और उन्नयन के लिए सहायता।"
      }
    }
  };

  for (const [id, tr] of Object.entries(crowdTranslations)) {
    await db.collection("crowdfundings").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { translations: tr } }
    );
  }

  // 5. UPDATE 3 GALLERIES
  console.log("Updating Galleries...");
  const galleryTranslations = {
    "6a996acae40d1428bd85a3b1": {
      en: {
        title: "Al-Azhar Grand Mosque",
        description: "Beautiful view of the historic Al-Azhar Mosque."
      },
      ar: {
        title: "جامع الأزهر الشريف التاريخي",
        description: "إطلالة مهيبة على الجامع الأزهر الشريف العريق، منارة العلم والوسطية في العالم الإسلامي."
      },
      ur: {
        title: "تاریخی جامع ازہر شریف",
        description: "تاریخی جامع ازہر کا پروقار اور خوبصورت منظر، جو دنیا بھر میں اسلامی علوم اور اعتدال کا مرکز ہے۔"
      },
      hi: {
        title: "ऐतिहासिक अल-अज़हर जामा मस्जिद",
        description: "ऐतिहासिक अल-अज़हर मस्जिद का भव्य दृश्य, जो ज्ञान और सहिष्णुता का केंद्र है।"
      }
    },
    "6a996acae40d1428bd85a3b2": {
      en: {
        title: "Islamic Scholars Gathering",
        description: "Scholars studying ancient texts."
      },
      ar: {
        title: "ملتقى علماء الأمة ودراسة المخطوطات والكتب التراثية",
        description: "حلقة علمية تجمع كبار العلماء والباحثين لتحقيق ودراسة التراث الإسلامي المعتدل."
      },
      ur: {
        title: "علمائے کرام کی علمی نشست اور مخطوطات کا مطالعہ",
        description: "علمائے کرام کا مشاورتی اجتماع جس میں قدیم علمی مخطوطات اور متون کا عمیق مطالعہ کیا جا رہا ہے۔"
      },
      hi: {
        title: "विद्वानों की संगोष्ठी एवं पांडुलिपि अध्ययन",
        description: "विद्वानों द्वारा प्राचीन पांडुलिपियों और ग्रंथों का अध्ययन व समीक्षा।"
      }
    },
    "6a996acae40d1428bd85a3b3": {
      en: {
        title: "Community Charity Event",
        description: "Volunteers distributing food to the needy."
      },
      ar: {
        title: "فعالية العمل الخيري وخدمة المجتمع",
        description: "المتطوعون يشاركون في توزيع الوجبات والمساعدات الغذائية على الأسر المتعففة."
      },
      ur: {
        title: "کمیونٹی خیراتی پروگرام اور راشن کی تقسیم",
        description: "تنظیم کے رضاکار ضرورت مند افراد میں باوقار طریقے سے کھانا اور راشن تقسیم کرتے ہوئے۔"
      },
      hi: {
        title: "सामुदायिक सेवा एवं राहत वितरण कार्यक्रम",
        description: "जरूरतमंद परिवारों को भोजन और राशन सामग्री वितरित करते हुए समर्पित स्वयंसेवक।"
      }
    }
  };

  for (const [id, tr] of Object.entries(galleryTranslations)) {
    await db.collection("galleries").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { translations: tr } }
    );
  }

  // 6. UPDATE 3 TESTIMONIALS
  console.log("Updating Testimonials...");
  const testimonialTranslations = {
    "6a99552db01a06e1b085d492": {
      en: {
        name: "Dr. Ayesha Rahman",
        designation: "Healthcare Professional",
        message: "The medical camps organized by the association have been a lifeline for many remote villages. I have witnessed firsthand the impact of their dedication to providing free and accessible healthcare."
      },
      ar: {
        name: "د. عائشة رحمن",
        designation: "استشارية رعاية صحية",
        message: "المخيمات الطبية التي تنظمها الجمعية كانت طوق نجاة للعديد من القرى النائية. لقد لمست بنفسي تفانيهم الكبير في تقديم خدمات الرعاية الصحية المجانية لكل محتاج."
      },
      ur: {
        name: "ڈاکٹر عائشہ رحمن",
        designation: "ماہرِ طب و صحت",
        message: "تنظیم کے زیرِ اہتمام منعقدہ میڈیکل کیمپس دور دراز بستیوں کے غریب عوام کے لیے امید کی کرن ثابت ہوئے ہیں۔ میں نے بلا تفریق مفت علاج کی فراہمی میں ان کے خلوص کو خود دیکھا ہے۔"
      },
      hi: {
        name: "डॉ. आयशा रहमान",
        designation: "स्वास्थ्य सेवा विशेषज्ञ",
        message: "संस्था द्वारा आयोजित चिकित्सा शिविर कई दूरदराज के गांवों के लिए जीवन रेखा साबित हुए हैं। मैंने निःशुल्क और सुलभ स्वास्थ्य सेवा प्रदान करने के उनके समर्पण को प्रत्यक्ष देखा है।"
      }
    },
    "6a99552db01a06e1b085d493": {
      en: {
        name: "Mr. Ramesh Patel",
        designation: "Community Leader",
        message: "Their rural education initiative transformed our village. The children now have access to digital learning tools, and the coaching centres are giving them the bright future they deserve."
      },
      ar: {
        name: "أ. راميش باتيل",
        designation: "قيادي مجتمعي",
        message: "مبادرة التعليم الريفي أحدثت فارقاً حقيقياً في قريتنا؛ إذ أصبح لأطفالنا نافذة على التعلم الرقمي، وتوفر لهم مراكز التدريب مستقبلاً مشرقاً يستحقونه."
      },
      ur: {
        name: "جناب رمیش پٹیل",
        designation: "سماجی رہنما",
        message: "ان کی دیہی تعلیمی تحریک نے ہمارے علاقے کی کایا پلٹ دی۔ بچوں کو جدید ڈیجیٹل تعلیم اور رہنمائی میسر آ رہی ہے جس سے ان کا مستقبل روشن ہو رہا ہے۔"
      },
      hi: {
        name: "श्री रमेश पटेल",
        designation: "सामुदायिक प्रतिनिधि",
        message: "उनकी ग्रामीण शिक्षा पहल ने हमारे गांव का चेहरा बदल दिया है। बच्चों के पास अब डिजिटल शिक्षण संसाधन हैं जो उन्हें एक उज्ज्वल भविष्य दे रहे हैं।"
      }
    },
    "6a99552db01a06e1b085d494": {
      en: {
        name: "Fatima Sheikh",
        designation: "Volunteer",
        message: "Working with the relief and welfare programs has been an eye-opening experience. The speed at which they deliver ration kits during emergencies is truly commendable. Proud to be a part of this."
      },
      ar: {
        name: "فاطمة الشيخ",
        designation: "متطوعة في العمل الخيري",
        message: "العمل مع برامج الإغاثة والرعاية الاجتماعية منحني تجربة ملهمة وعميقة. إن سرعة استجابتهم في توصيل المساعدات في الأزمات أمر يبعث على الفخر والاعتزاز."
      },
      ur: {
        name: "فاطمہ شیخ",
        designation: "رضاکار",
        message: "امدادی اور فلاحی پروگرامز میں بطور رضاکار خدمات انجام دینا میرے لیے باعثِ فخر رہا ہے۔ ہنگامی حالات میں راشن کٹس پہنچانے میں ان کی مستعدی قابلِ ستائش ہے۔"
      },
      hi: {
        name: "फातिमा शेख",
        designation: "स्वयंसेवक",
        message: "राहत और कल्याणकारी कार्यक्रमों के साथ काम करना एक अत्यंत प्रेरणादायक अनुभव रहा है। आपातकाल में राहत सामग्री पहुंचाने की उनकी तत्परता वास्तव में सराहनीय है।"
      }
    }
  };

  for (const [id, tr] of Object.entries(testimonialTranslations)) {
    await db.collection("testimonials").updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { translations: tr } }
    );
  }

  // 7. AWARDS (Ensure active awards with 4 languages)
  const awardCount = await db.collection("awards").countDocuments();
  if (awardCount === 0) {
    console.log("Seeding Awards in 4 languages...");
    await db.collection("awards").insertMany([
      {
        title: "National Inter-Religious Peace & Harmony Award",
        description: "Awarded to the World Association for Al-Azhar Graduates - India Branch in recognition of sustained initiatives to foster communal peace, mutual understanding, and moderate religious discourse.",
        awardedBy: "National Interfaith Harmony Forum",
        year: 2024,
        status: "active",
        image: { public_id: "", url: "http://localhost:8000/public/uploads/islamic_scholars.jpg" },
        translations: {
          en: {
            title: "National Inter-Religious Peace & Harmony Award",
            description: "Awarded to the World Association for Al-Azhar Graduates - India Branch in recognition of sustained initiatives to foster communal peace, mutual understanding, and moderate religious discourse.",
            awardedBy: "National Interfaith Harmony Forum"
          },
          ar: {
            title: "جائزة التسامح الديني والسلام المجتمعي الوطنية",
            description: "مُنحت للرابطة العالمية لخريجي الأزهر – فرع الهند تقديراً لجهودها المستمرة في نشر قيم التسامح والتعايش السلمي والاعتدال الفكري.",
            awardedBy: "المنتدى الوطني للوئام والحوار"
          },
          ur: {
            title: "قومی بین المذاہب ہم آہنگی و امن ایوارڈ",
            description: "عالمی رابطہ تنظیم برائے فارغینِ ازہر (انڈیا برانچ) کو بین المذاہب ہم آہنگی، باہمی احترام اور معتدل فکر کی ترویج پر پیش کیا گیا۔",
            awardedBy: "نیشنل انٹر فیتھ فورم آف انڈیا"
          },
          hi: {
            title: "राष्ट्रीय सर्वधर्म सद्भाव एवं शांति पुरस्कार",
            description: "धार्मिक सद्भाव, पारस्परिक संवाद और संयमित विचारों को बढ़ावा देने के उत्कृष्ट प्रयासों के लिए अल-अज़हर ग्रेजुएट्स इंडिया ब्रांच को सम्मानित किया गया।",
            awardedBy: "राष्ट्रीय सर्वधर्म सद्भाव मंच"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Excellence in Arabic Language Education & Cultural Outreach",
        description: "Conferred for outstanding dedication to classical Arabic education and intercultural intellectual development across India.",
        awardedBy: "Council for Academic & Linguistic Heritage",
        year: 2025,
        status: "active",
        image: { public_id: "", url: "http://localhost:8000/public/uploads/islamic_hero.jpg" },
        translations: {
          en: {
            title: "Excellence in Arabic Language Education & Cultural Outreach",
            description: "Conferred for outstanding dedication to classical Arabic education and intercultural intellectual development across India.",
            awardedBy: "Council for Academic & Linguistic Heritage"
          },
          ar: {
            title: "درع التميز في تعليم اللغة العربية والتواصل الحضاري",
            description: "تكريماً للإسهامات الرائدة في تعليم لغة الضاد وتعزيز التواصل العلمي والثقافي بين مصر والهند.",
            awardedBy: "المجلس الأكاديمي للتراث اللغوي"
          },
          ur: {
            title: "عربی زبان کے فروغ اور ثقافتی خدمات کا اعزاز",
            description: "کلاسیکی عربی زبان کی تعلیم اور بھارت میں ازہر کے علمی و فکری ورثے کی نشر و اشاعت پر تفویض کیا گیا۔",
            awardedBy: "کونسل فار اکیڈمک اینڈ لینگوئسٹک ہیریٹیج"
          },
          hi: {
            title: "अरबी भाषा शिक्षण एवं सांस्कृतिक संवाद उत्कृष्टता सम्मान",
            description: "अरबी भाषा शिक्षण और भारत-मिस्र सांस्कृतिक संवाद को सुदृढ़ करने के उत्कृष्ट योगदान के लिए प्रदान किया गया।",
            awardedBy: "शैक्षणिक एवं भाषाई विरासत परिषद"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  // 8. DOWNLOADS (Ensure active downloads with 4 languages)
  const downloadCount = await db.collection("downloads").countDocuments();
  if (downloadCount === 0) {
    console.log("Seeding Downloads in 4 languages...");
    await db.collection("downloads").insertMany([
      {
        title: "Al-Azhar's Declaration on Human Fraternity and Peaceful Coexistence",
        description: "Official guidance paper detailing the core principles of tolerance, moderation, and harmonious coexistence as championed by Al-Azhar.",
        category: "publication",
        fileType: "pdf",
        status: "active",
        file: { public_id: "", url: "/sample-doc.pdf" },
        translations: {
          en: {
            title: "Al-Azhar's Declaration on Human Fraternity and Peaceful Coexistence",
            description: "Official guidance paper detailing the core principles of tolerance, moderation, and harmonious coexistence as championed by Al-Azhar."
          },
          ar: {
            title: "وثيقة الأزهر الشريف للأخوة الإنسانية والعيش المشترك",
            description: "الوثيقة الإرشادية الرسمية حول قيم التسامح والأخوة الإنسانية والاعتدال التي يدعو إليها الأزهر الشريف."
          },
          ur: {
            title: "جامعہ ازہر شریف کا تاریخی منشور برائے انسانی اخوت اور بقائے باہمی",
            description: "جامعہ ازہر کی طرف سے باہمی احترام، اعتدال اور پرامن بقائے باہمی کے بنیادی اصولوں پر مشتمل رہنما دستاویز۔"
          },
          hi: {
            title: "अल-अज़हर का मानव बंधुत्व एवं शांतिपूर्ण सह-अस्तित्व घोषणापत्र",
            description: "अल-अज़हर द्वारा प्रतिपादित सहिष्णुता, संयम और मानवीय बंधुत्व के मूल सिद्धांतों पर आधिकारिक मार्गदर्शिका।"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Official Bylaws & Constitution of World Association for Al-Azhar Graduates - India Branch",
        description: "The registered constitution, foundational objectives, and operational framework of the Indian branch.",
        category: "document",
        fileType: "pdf",
        status: "active",
        file: { public_id: "", url: "/sample-doc.pdf" },
        translations: {
          en: {
            title: "Official Bylaws & Constitution of World Association for Al-Azhar Graduates - India Branch",
            description: "The registered constitution, foundational objectives, and operational framework of the Indian branch."
          },
          ar: {
            title: "اللائحة التأسيسية والنظام الأساسي للرابطة العالمية لخريجي الأزهر – فرع الهند",
            description: "النظام الأساسي المعتمد والأهداف الاستراتيجية والهيكل التنظيمي لفرع الرابطة في الهند."
          },
          ur: {
            title: "دستور و قواعد و ضوابط: عالمی رابطہ تنظیم برائے فارغینِ ازہر (انڈیا برانچ)",
            description: "تنظیم کا باضابطہ آئین، مقاصد اور تنظیمی ڈھانچے پر مشتمل دستاویز۔"
          },
          hi: {
            title: "वर्ल्ड एसोसिएशन फॉर अल-अज़हर ग्रेजुएट्स - इंडिया ब्रांच का आधिकारिक संविधान एवं नियमावली",
            description: "इंडिया ब्रांच का पंजीकृत संविधान, उद्देश्य और संगठनात्मक कार्यप्रणाली।"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  // 9. SITE CONTENT (founder_message, about_main, etc.)
  console.log("Updating SiteContent in 4 languages...");
  const founderMessage = await db.collection("sitecontents").findOne({ key: "founder_message" });
  if (founderMessage) {
    await db.collection("sitecontents").updateOne(
      { key: "founder_message" },
      {
        $set: {
          translations: {
            en: {
              title: founderMessage.title || "President's Message",
              content: founderMessage.content || ""
            },
            ar: {
              title: "كلمة رئيس فرع الرابطة بالهند",
              content: "نرحب بكم جميعاً في رحاب الرابطة العالمية لخريجي الأزهر الشريف – فرع الهند. إن رسالتنا تنطلق من نشر منهج الوسطية والاعتدال، وتعزيز أواصر الأخوة الإنسانية، والتواصل العلمي والثقافي بما يخدم مجتمعنا وأمتنا."
            },
            ur: {
              title: "صدرِ محترم کا پیغام",
              content: "عالمی رابطہ تنظیم برائے فارغینِ ازہر (انڈیا برانچ) کے پلیٹ فارم پر آپ سب کا خیر مقدم ہے۔ ہمارا مشن جامعہ ازہر کے معتدل فکر کو عام کرنا، انسانی اخوت اور باہمی رواداری کو فروغ دینا اور علمی و سماجی خدمات کے ذریعے قوم و ملت کی تعمیر کرنا ہے۔"
            },
            hi: {
              title: "अध्यक्ष का संदेश",
              content: "वर्ल्ड एसोसिएशन फॉर अल-अज़हर ग्रेजुएट्स - इंडिया ब्रांच में आप सभी का हार्दिक स्वागत है। हमारा उद्देश्य संयमित और संतुलित सोच को बढ़ावा देना, आपसी भाईचारे को सुदृढ़ करना और शिक्षा व समाज सेवा के माध्यम से सकारात्मक बदलाव लाना है।"
            }
          }
        }
      }
    );
  }

  console.log("Migration completed successfully!");
  await mongoose.disconnect();
}

migrateData().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});

