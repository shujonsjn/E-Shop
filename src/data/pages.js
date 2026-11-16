// Bilingual content for the static / content pages.
// One `ContentPage` template renders any entry below.
//
// Brand and contact details are written as tokens so they always follow the
// admin settings:
//   {{site}}          → site name
//   {{phone}}         → call-for-order number
//   {{email}}         → contact email (line is hidden when empty)
//   {{address}}       → shop address
//   {{chargeInside}}  → delivery charge inside Dhaka
//   {{chargeOutside}} → delivery charge outside Dhaka
//   {{freeAt}}        → free-delivery threshold

export const pages = {
  'about-us': {
    slug: 'about-us',
    title: 'About Us',
    title_bn: 'আমাদের সম্পর্কে',
    subtitle: 'Thoughtful gifts and showpieces, delivered to every home in Bangladesh.',
    subtitle_bn: 'যত্নে বাছাই করা উপহার ও শোপিস — বাংলাদেশের প্রতিটি ঘরে পৌঁছে দেওয়াই আমাদের লক্ষ্য।',
    sections: [
      {
        heading: 'Our story',
        heading_bn: 'আমাদের গল্প',
        body: [
          '{{site}} started with a simple idea: finding a beautiful, well-made gift in Bangladesh should not take a whole day of searching. We wanted one trusted place where a showpiece, a watch or a pair of shoes could be chosen with confidence.',
          'Today we hand-pick every item in our collection. We check the finish, the packaging and the price before a product reaches our shelves, and we pack each order ourselves so it arrives exactly as you saw it online.',
        ],
        body_bn: [
          '{{site}} যাত্রা শুরু করেছিল একটি সহজ ভাবনা থেকে: বাংলাদেশে সুন্দর ও মানসম্মত উপহার খুঁজতে গিয়ে যেন পুরো দিন নষ্ট না হয়। আমরা চেয়েছি একটি বিশ্বস্ত জায়গা, যেখানে শোপিস, ঘড়ি বা জুতা নিশ্চিন্তে বেছে নেওয়া যায়।',
          'আজ আমাদের সংগ্রহে থাকা প্রতিটি পণ্য আমরা নিজেরা বাছাই করি। পণ্য আমাদের কাছে আসার আগে ফিনিশিং, প্যাকেজিং ও দাম যাচাই করা হয়, আর প্রতিটি অর্ডার আমরা নিজ হাতে প্যাক করি — যেন আপনি ঠিক সেটাই পান যা অনলাইনে দেখেছেন।',
        ],
      },
      {
        heading: 'What we stand for',
        heading_bn: 'আমাদের মূল্যবোধ',
        bullets: [
          'Honest product photos and descriptions — what you see is what arrives.',
          'Fair prices, with discounts shown clearly instead of inflated “before” prices.',
          'Careful packaging so fragile showpieces reach you safely.',
          'Quick replies on phone and WhatsApp when something is not right.',
        ],
        bullets_bn: [
          'সৎ ছবি ও বিবরণ — আপনি যা দেখছেন, ঠিক সেটাই পৌঁছাবে।',
          'ন্যায্য দাম; বাড়তি “আগের দাম” দেখিয়ে বিভ্রান্তি নয়।',
          'ভঙ্গুর শোপিসের জন্য যত্নসহ প্যাকেজিং, যেন নিরাপদে পৌঁছায়।',
          'কিছু ভুল হলে ফোন ও হোয়াটসঅ্যাপে দ্রুত উত্তর।',
        ],
      },
      {
        heading: 'Visit or call us',
        heading_bn: 'আমাদের দেখুন বা কল করুন',
        body: [
          'Address: {{address}}',
          'Phone: {{phone}} — every day, 9am to 9pm.',
          'Email: {{email}}',
        ],
        body_bn: [
          'ঠিকানা: {{address}}',
          'ফোন: {{phone}} — প্রতিদিন সকাল ৯টা থেকে রাত ৯টা।',
          'ইমেইল: {{email}}',
        ],
      },
    ],
  },

  'contact-us': {
    slug: 'contact-us',
    title: 'Contact Us',
    title_bn: 'যোগাযোগ',
    subtitle: 'A question about an order, a product or a bulk gift order? We are here to help.',
    subtitle_bn: 'অর্ডার, পণ্য বা বাল্ক গিফট অর্ডার নিয়ে প্রশ্ন আছে? আমরা সাহায্য করতে প্রস্তুত।',
    sections: [
      {
        heading: 'Talk to our team',
        heading_bn: 'আমাদের টিমের সাথে কথা বলুন',
        body: [
          'Phone / WhatsApp: {{phone}}',
          'Email: {{email}}',
          'Address: {{address}}',
          'Support hours: every day, 9am to 9pm.',
        ],
        body_bn: [
          'ফোন / হোয়াটসঅ্যাপ: {{phone}}',
          'ইমেইল: {{email}}',
          'ঠিকানা: {{address}}',
          'সাপোর্ট সময়: প্রতিদিন সকাল ৯টা থেকে রাত ৯টা।',
        ],
      },
      {
        heading: 'Already placed an order?',
        heading_bn: 'অর্ডার করা হয়ে গেছে?',
        body: [
          'Keep your order ID ready and use the Track Order page to see the latest status. If you need to change the address or cancel, call us before the order is handed to the courier.',
        ],
        body_bn: [
          'অর্ডার আইডি হাতে রাখুন এবং Track Order পেজে সর্বশেষ অবস্থা দেখুন। ঠিকানা বদলাতে বা অর্ডার বাতিল করতে চাইলে কুরিয়ারে দেওয়ার আগেই আমাদের কল করুন।',
        ],
      },
      {
        heading: 'Corporate and bulk gifting',
        heading_bn: 'কর্পোরেট ও বাল্ক গিফট',
        body: [
          'Planning gifts for an office, a wedding or an event? Tell us the quantity, budget and delivery date and we will prepare a quote with gift wrapping options.',
        ],
        body_bn: [
          'অফিস, বিয়ে বা কোনো অনুষ্ঠানের জন্য উপহার পরিকল্পনা করছেন? পরিমাণ, বাজেট ও ডেলিভারির তারিখ জানালে গিফট র্যাপিংসহ একটি কোটেশন তৈরি করে দেব।',
        ],
      },
    ],
  },

  'company-information': {
    slug: 'company-information',
    title: 'Company Information',
    title_bn: 'কোম্পানির তথ্য',
    subtitle: 'Who we are, how to reach us, and how this store is run.',
    subtitle_bn: 'আমরা কারা, কীভাবে যোগাযোগ করবেন এবং এই স্টোর কীভাবে পরিচালিত হয়।',
    sections: [
      {
        heading: 'Business details',
        heading_bn: 'ব্যবসার তথ্য',
        bullets: [
          'Brand: {{site}}',
          'Business type: online gift and lifestyle retail',
          'Address: {{address}}',
          'Customer care: {{phone}}',
          'Email: {{email}}',
        ],
        bullets_bn: [
          'ব্র্যান্ড: {{site}}',
          'ব্যবসার ধরন: অনলাইন গিফট ও লাইফস্টাইল খুচরা বিক্রয়',
          'ঠিকানা: {{address}}',
          'কাস্টমার কেয়ার: {{phone}}',
          'ইমেইল: {{email}}',
        ],
      },
      {
        heading: 'How orders are handled',
        heading_bn: 'অর্ডার কীভাবে পরিচালিত হয়',
        body: [
          'Orders placed on this website are confirmed by phone or WhatsApp before dispatch. Delivery is handled by our courier partners across Bangladesh, and payment is collected by cash on delivery or mobile banking.',
        ],
        body_bn: [
          'এই ওয়েবসাইটে দেওয়া অর্ডার ডেলিভারির আগে ফোন বা হোয়াটসঅ্যাপে নিশ্চিত করা হয়। সারাদেশে আমাদের কুরিয়ার পার্টনার ডেলিভারি দেয়, আর পেমেন্ট ক্যাশ অন ডেলিভারি বা মোবাইল ব্যাংকিংয়ে নেওয়া হয়।',
        ],
      },
      {
        heading: 'Questions about this page',
        heading_bn: 'এই পেজ নিয়ে প্রশ্ন',
        body: ['Write to {{email}} or call {{phone}} and we will respond within one working day.'],
        body_bn: ['{{email}} ঠিকানায় লিখুন অথবা {{phone}} নম্বরে কল করুন — এক কর্মদিবসের মধ্যে উত্তর দেব।'],
      },
    ],
  },

  'our-story': {
    slug: 'our-story',
    title: 'Our Story',
    title_bn: 'আমাদের কথা',
    subtitle: 'How a small gift corner grew into an online collection.',
    subtitle_bn: 'কীভাবে একটি ছোট গিফট কর্নার থেকে অনলাইন সংগ্রহ তৈরি হলো।',
    sections: [
      {
        heading: 'The first shelf',
        heading_bn: 'প্রথম তাক',
        body: [
          'Our first collection was tiny — a few showpieces, some watches and a handful of bags chosen one by one from local suppliers. Customers kept asking for the same thing: something that looks special without an impossible price tag.',
          'That feedback shaped everything after it. We stopped chasing quantity and started checking quality: joints, stitching, finish, packaging and whether the product looks the same in daylight as it does on a phone screen.',
        ],
        body_bn: [
          'আমাদের প্রথম সংগ্রহ ছিল খুব ছোট — কয়েকটি শোপিস, কিছু ঘড়ি আর স্থানীয় সরবরাহকারীর কাছ থেকে বেছে নেওয়া কয়েকটি ব্যাগ। ক্রেতারা বারবার একই কথা বলতেন: এমন কিছু চাই যা বিশেষ দেখায়, কিন্তু দাম অসম্ভব নয়।',
          'সেই মতামতই পরের সব সিদ্ধান্ত গড়ে দিয়েছে। আমরা পরিমাণের পেছনে না দৌড়ে মান যাচাই শুরু করি: জোড়া, সেলাই, ফিনিশিং, প্যাকেজিং এবং দিনের আলোয় পণ্যটি মোবাইলের স্ক্রিনে দেখার মতোই লাগে কি না।',
        ],
      },
      {
        heading: 'How we choose products',
        heading_bn: 'পণ্য কীভাবে বাছাই করি',
        bullets: [
          'We order samples and inspect them before listing.',
          'Fragile items are tested with our own packing method.',
          'Prices are compared with the local market so the discount is real.',
          'Products that get repeated complaints are removed from the store.',
        ],
        bullets_bn: [
          'লিস্ট করার আগে নমুনা এনে যাচাই করি।',
          'ভঙ্গুর পণ্য আমাদের নিজস্ব প্যাকিং পদ্ধতিতে পরীক্ষা করি।',
          'স্থানীয় বাজারের সাথে দাম মিলিয়ে দেখি, যেন ছাড়টি সত্যি হয়।',
          'বারবার অভিযোগ আসা পণ্য স্টোর থেকে সরিয়ে দিই।',
        ],
      },
      {
        heading: 'Where we are going',
        heading_bn: 'আমাদের পরবর্তী লক্ষ্য',
        body: [
          'We are building a collection that covers everyday gifting — birthdays, weddings, anniversaries and office gifts — with faster delivery and clearer product information every month.',
        ],
        body_bn: [
          'আমরা এমন একটি সংগ্রহ গড়ছি যা দৈনন্দিন উপহারের সব দিক কভার করে — জন্মদিন, বিয়ে, বিবাহবার্ষিকী ও অফিস গিফট — সাথে প্রতি মাসে দ্রুত ডেলিভারি ও আরও পরিষ্কার পণ্য তথ্য।',
        ],
      },
    ],
  },

  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    title_bn: 'শর্তাবলি',
    subtitle: 'The rules that apply when you browse or order from this store.',
    subtitle_bn: 'এই স্টোর ব্রাউজ বা অর্ডার করার সময় যে নিয়মগুলো প্রযোজ্য।',
    sections: [
      {
        heading: 'Using this website',
        heading_bn: 'এই ওয়েবসাইট ব্যবহার',
        body: [
          'By browsing or ordering from {{site}} you agree to use the site lawfully and to provide accurate contact and delivery information. You are responsible for keeping your account details private on shared devices.',
        ],
        body_bn: [
          '{{site}} ব্রাউজ বা অর্ডার করার মাধ্যমে আপনি সাইটটি আইনসম্মতভাবে ব্যবহার করতে এবং সঠিক যোগাযোগ ও ডেলিভারি তথ্য দিতে সম্মত হচ্ছেন। শেয়ার করা ডিভাইসে আপনার অ্যাকাউন্ট তথ্য গোপন রাখার দায়িত্ব আপনার।',
        ],
      },
      {
        heading: 'Orders and pricing',
        heading_bn: 'অর্ডার ও দাম',
        bullets: [
          'All prices are in Bangladeshi Taka and include applicable taxes.',
          'An order is confirmed only after we verify it by phone or WhatsApp.',
          'If a product is out of stock after ordering, we will offer an alternative or a full refund.',
          'Obvious pricing mistakes may be corrected before dispatch, with your approval.',
        ],
        bullets_bn: [
          'সব দাম বাংলাদেশি টাকায় এবং প্রযোজ্য ট্যাক্সসহ।',
          'ফোন বা হোয়াটসঅ্যাপে যাচাই করার পরেই অর্ডার নিশ্চিত হয়।',
          'অর্ডারের পর পণ্য স্টকে না থাকলে বিকল্প বা সম্পূর্ণ রিফান্ড দেওয়া হবে।',
          'স্পষ্ট দামের ভুল ডেলিভারির আগে আপনার সম্মতিতে সংশোধন করা হতে পারে।',
        ],
      },
      {
        heading: 'Delivery, returns and cancellation',
        heading_bn: 'ডেলিভারি, রিটার্ন ও বাতিল',
        body: [
          'Delivery charges and timelines are described on the Shipping page. Returns, exchanges and cancellations follow our Happy Return, Exchange and Cancellation policies, which form part of these terms.',
        ],
        body_bn: [
          'ডেলিভারি চার্জ ও সময় Shipping পেজে দেওয়া আছে। রিটার্ন, এক্সচেঞ্জ ও বাতিল আমাদের Happy Return, Exchange ও Cancellation নীতি অনুযায়ী হবে, যা এই শর্তাবলির অংশ।',
        ],
      },
      {
        heading: 'Contact',
        heading_bn: 'যোগাযোগ',
        body: ['For any question about these terms, call {{phone}} or email {{email}}.'],
        body_bn: ['এই শর্তাবলি নিয়ে কোনো প্রশ্ন থাকলে {{phone}} নম্বরে কল করুন অথবা {{email}} ঠিকানায় ইমেইল করুন।'],
      },
    ],
  },

  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    title_bn: 'প্রাইভেসি পলিসি',
    subtitle: 'What information we collect, why we need it, and how you stay in control.',
    subtitle_bn: 'আমরা কী তথ্য নিই, কেন প্রয়োজন এবং কীভাবে আপনি নিয়ন্ত্রণে থাকবেন।',
    sections: [
      {
        heading: 'Information we collect',
        heading_bn: 'আমরা যে তথ্য সংগ্রহ করি',
        bullets: [
          'Order details: name, phone number, delivery address and the items you ordered.',
          'Account details: name, phone and email, kept in this browser on your device.',
          'Optional reviews: the name and comment you choose to publish.',
          'Basic technical data needed to keep the site working and secure.',
        ],
        bullets_bn: [
          'অর্ডারের তথ্য: নাম, ফোন নম্বর, ডেলিভারি ঠিকানা ও অর্ডার করা পণ্য।',
          'অ্যাকাউন্টের তথ্য: নাম, ফোন ও ইমেইল — আপনার ডিভাইসের ব্রাউজারে সংরক্ষিত।',
          'ঐচ্ছিক রিভিউ: যে নাম ও মন্তব্য আপনি প্রকাশ করতে চান।',
          'সাইট সচল ও নিরাপদ রাখতে প্রয়োজনীয় সাধারণ টেকনিক্যাল তথ্য।',
        ],
      },
      {
        heading: 'How we use it',
        heading_bn: 'কীভাবে ব্যবহার করি',
        body: [
          'Your phone number and address are used to confirm, pack and deliver your order, and to contact you if there is a problem. We do not sell your personal information to third parties.',
        ],
        body_bn: [
          'আপনার ফোন নম্বর ও ঠিকানা অর্ডার নিশ্চিত করা, প্যাক করা ও ডেলিভারি দেওয়ার জন্য এবং কোনো সমস্যা হলে যোগাযোগের জন্য ব্যবহার করা হয়। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।',
        ],
      },
      {
        heading: 'Where your data lives',
        heading_bn: 'আপনার তথ্য কোথায় থাকে',
        body: [
          'Orders are stored in our secured cloud database so the shop can process them. Your customer account stays in this browser unless you sign in on another device. Reviews are stored with the order system so they can appear on product pages.',
        ],
        body_bn: [
          'অর্ডার প্রসেস করার জন্য আমাদের সুরক্ষিত ক্লাউড ডেটাবেসে সংরক্ষিত হয়। আপনার কাস্টমার অ্যাকাউন্ট এই ব্রাউজারেই থাকে, যদি না আপনি অন্য ডিভাইসে সাইন ইন করেন। রিভিউ অর্ডার সিস্টেমের সাথে সংরক্ষিত হয়, যাতে প্রোডাক্ট পেজে দেখা যায়।',
        ],
      },
      {
        heading: 'Your choices',
        heading_bn: 'আপনার অধিকার',
        body: [
          'You can ask us to correct or delete your order information by calling {{phone}} or emailing {{email}}. Clearing your browser data removes the account stored on this device.',
        ],
        body_bn: [
          '{{phone}} নম্বরে কল করে বা {{email}} ঠিকানায় ইমেইল করে আপনার অর্ডার তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন। ব্রাউজার ডেটা মুছে দিলে এই ডিভাইসে থাকা অ্যাকাউন্টটি মুছে যাবে।',
        ],
      },
    ],
  },

  'careers': {
    slug: 'careers',
    title: 'Careers',
    title_bn: 'ক্যারিয়ার',
    subtitle: 'Help us make gift shopping simple and trustworthy.',
    subtitle_bn: 'উপহার কেনাকাটা সহজ ও বিশ্বস্ত করতে আমাদের সাথে কাজ করুন।',
    sections: [
      {
        heading: 'Working with us',
        heading_bn: 'আমাদের সাথে কাজ',
        body: [
          'We are a small team that cares about product quality and honest customer service. If you enjoy detail-oriented work — packing, product photography, order support or content — we would like to hear from you.',
        ],
        body_bn: [
          'আমরা ছোট একটি টিম, যারা পণ্যের মান ও সৎ কাস্টমার সার্ভিসকে গুরুত্ব দেয়। প্যাকিং, প্রোডাক্ট ফটোগ্রাফি, অর্ডার সাপোর্ট বা কনটেন্ট — বিস্তারিত কাজে আগ্রহ থাকলে আমাদের জানান।',
        ],
      },
      {
        heading: 'How to apply',
        heading_bn: 'কীভাবে আবেদন করবেন',
        body: [
          'Send your CV and a short note about the role you are looking for to {{email}} with the subject “Career”. We read every application and reply within one week.',
        ],
        body_bn: [
          'আপনার সিভি এবং কোন ধরনের কাজে আগ্রহী তা সংক্ষেপে লিখে “Career” বিষয়সহ {{email}} ঠিকানায় পাঠান। আমরা প্রতিটি আবেদন পড়ি এবং এক সপ্তাহের মধ্যে উত্তর দিই।',
        ],
      },
      {
        heading: 'No matching role?',
        heading_bn: 'উপযুক্ত পদ নেই?',
        body: [
          'We still want to hear from you. Mention the skills you can bring and we will keep your details for future openings.',
        ],
        body_bn: [
          'তবুও আপনার কথা জানতে চাই। আপনার দক্ষতা উল্লেখ করুন, ভবিষ্যতের সুযোগে আমরা আপনার তথ্য সংরক্ষণ করব।',
        ],
      },
    ],
  },

  'support-center': {
    slug: 'support-center',
    title: 'Support Center',
    title_bn: 'সাপোর্ট সেন্টার',
    subtitle: 'Quick answers and the fastest ways to reach a human.',
    subtitle_bn: 'দ্রুত উত্তর এবং সরাসরি মানুষের সাথে যোগাযোগের সহজ উপায়।',
    sections: [
      {
        heading: 'Fastest ways to reach us',
        heading_bn: 'যোগাযোগের দ্রুততম উপায়',
        bullets: [
          'Call or WhatsApp: {{phone}} (9am – 9pm, every day)',
          'Email: {{email}}',
          'Track an order: use the Track Order page with your order ID and phone number.',
        ],
        bullets_bn: [
          'কল বা হোয়াটসঅ্যাপ: {{phone}} (প্রতিদিন সকাল ৯টা – রাত ৯টা)',
          'ইমেইল: {{email}}',
          'অর্ডার ট্র্যাক: অর্ডার আইডি ও ফোন নম্বর দিয়ে Track Order পেজ ব্যবহার করুন।',
        ],
      },
      {
        heading: 'Before you contact us',
        heading_bn: 'যোগাযোগের আগে',
        bullets: [
          'Keep your order ID ready.',
          'For a damaged item, send a photo of the product and the packaging.',
          'For a wrong item, mention the name of the product you received.',
        ],
        bullets_bn: [
          'অর্ডার আইডি হাতে রাখুন।',
          'পণ্য ভাঙা বা ক্ষতিগ্রস্ত হলে পণ্য ও প্যাকেজিংয়ের ছবি পাঠান।',
          'ভুল পণ্য এলে আপনি যে পণ্য পেয়েছেন তার নাম লিখুন।',
        ],
      },
      {
        heading: 'Response time',
        heading_bn: 'উত্তরের সময়',
        body: [
          'Messages sent during support hours are usually answered within a few minutes. Emails are answered within one working day.',
        ],
        body_bn: [
          'সাপোর্ট সময়ে পাঠানো বার্তার উত্তর সাধারণত কয়েক মিনিটের মধ্যে দেওয়া হয়। ইমেইলের উত্তর এক কর্মদিবসের মধ্যে দেওয়া হয়।',
        ],
      },
    ],
  },

  'how-to-order': {
    slug: 'how-to-order',
    title: 'How to Order',
    title_bn: 'কীভাবে অর্ডার করবেন',
    subtitle: 'Four simple steps from browsing to delivery.',
    subtitle_bn: 'ব্রাউজ করা থেকে ডেলিভারি — মাত্র চারটি সহজ ধাপ।',
    sections: [
      {
        heading: '1. Choose your product',
        heading_bn: '১. পণ্য বেছে নিন',
        body: [
          'Open a category or use the search bar, then tap “Add to Cart”. You can change the quantity in the cart before checkout.',
        ],
        body_bn: [
          'কোনো ক্যাটাগরি খুলুন বা সার্চ বার ব্যবহার করুন, তারপর “কার্টে যোগ করুন” চাপুন। চেকআউটের আগে কার্টে পরিমাণ বদলাতে পারবেন।',
        ],
      },
      {
        heading: '2. Fill in delivery details',
        heading_bn: '২. ডেলিভারি তথ্য দিন',
        body: [
          'Enter your name, mobile number, full address and area. The delivery charge is added automatically based on the area you select.',
        ],
        body_bn: [
          'নাম, মোবাইল নম্বর, সম্পূর্ণ ঠিকানা ও এলাকা লিখুন। আপনি যে এলাকা বাছাই করবেন তার ভিত্তিতে ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে যোগ হবে।',
        ],
      },
      {
        heading: '3. Choose a payment method',
        heading_bn: '৩. পেমেন্ট পদ্ধতি বাছুন',
        body: [
          'Cash on delivery is available everywhere. For mobile banking, send the amount to the number shown at checkout and enter the transaction ID.',
        ],
        body_bn: [
          'সারাদেশে ক্যাশ অন ডেলিভারি আছে। মোবাইল ব্যাংকিংয়ে চেকআউটে দেখানো নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি লিখুন।',
        ],
      },
      {
        heading: '4. Confirm and wait for our call',
        heading_bn: '৪. নিশ্চিত করুন ও কলের অপেক্ষা করুন',
        body: [
          'After placing the order you will see an order ID. We call or message to confirm before dispatch, and you can follow every step on the Track Order page.',
        ],
        body_bn: [
          'অর্ডার দেওয়ার পর একটি অর্ডার আইডি দেখতে পাবেন। ডেলিভারির আগে আমরা কল বা মেসেজ করে নিশ্চিত করি, আর Track Order পেজে প্রতিটি ধাপ দেখতে পারবেন।',
        ],
      },
    ],
  },

  'payment': {
    slug: 'payment',
    title: 'Payment',
    title_bn: 'পেমেন্ট',
    subtitle: 'Ways to pay and what to expect at checkout.',
    subtitle_bn: 'পেমেন্টের উপায় এবং চেকআউটে কী হবে।',
    sections: [
      {
        heading: 'Cash on delivery',
        heading_bn: 'ক্যাশ অন ডেলিভারি',
        body: [
          'Pay the courier in cash when your parcel arrives. Please keep the exact amount ready — our couriers may not carry change for large notes.',
        ],
        body_bn: [
          'পার্সেল হাতে পাওয়ার সময় কুরিয়ারকে নগদ টাকা দিন। সম্ভব হলে নির্দিষ্ট পরিমাণ টাকা প্রস্তুত রাখুন — বড় নোটের খুচরা কুরিয়ারের কাছে নাও থাকতে পারে।',
        ],
      },
      {
        heading: 'Mobile banking',
        heading_bn: 'মোবাইল ব্যাংকিং',
        body: [
          'bKash and Nagad are accepted. At checkout you will see the receiving number and instructions. Send the exact total, then enter your sender number and transaction ID so we can verify the payment.',
        ],
        body_bn: [
          'বিকাশ ও নগদ গ্রহণ করা হয়। চেকআউটে গ্রহণকারী নম্বর ও নির্দেশনা দেখতে পাবেন। নির্দিষ্ট মোট টাকা পাঠিয়ে আপনার প্রেরকের নম্বর ও ট্রানজেকশন আইডি লিখুন, যাতে আমরা পেমেন্ট যাচাই করতে পারি।',
        ],
      },
      {
        heading: 'Payment safety',
        heading_bn: 'পেমেন্ট নিরাপত্তা',
        bullets: [
          'We never ask for your mobile banking PIN or OTP.',
          'Only use the number shown on the checkout page.',
          'You will receive an order ID after a successful order — keep it for any follow-up.',
        ],
        bullets_bn: [
          'আমরা কখনো আপনার মোবাইল ব্যাংকিং পিন বা OTP চাই না।',
          'শুধু চেকআউট পেজে দেখানো নম্বরেই টাকা পাঠান।',
          'সফল অর্ডারের পর একটি অর্ডার আইডি পাবেন — পরবর্তী যোগাযোগের জন্য এটি রাখুন।',
        ],
      },
    ],
  },

  'shipping': {
    slug: 'shipping',
    title: 'Shipping',
    title_bn: 'শিপিং',
    subtitle: 'Delivery areas, timelines and charges.',
    subtitle_bn: 'ডেলিভারি এলাকা, সময় ও চার্জ।',
    sections: [
      {
        heading: 'Delivery charges',
        heading_bn: 'ডেলিভারি চার্জ',
        bullets: [
          'Inside Dhaka: {{chargeInside}}',
          'Outside Dhaka: {{chargeOutside}}',
          'Free delivery on orders of {{freeAt}} or more.',
        ],
        bullets_bn: [
          'ঢাকার ভিতরে: {{chargeInside}}',
          'ঢাকার বাইরে: {{chargeOutside}}',
          '{{freeAt}} বা তার বেশি অর্ডারে ফ্রি ডেলিভারি।',
        ],
      },
      {
        heading: 'Delivery time',
        heading_bn: 'ডেলিভারির সময়',
        body: [
          'Orders inside Dhaka are usually delivered within 1–2 working days. Outside Dhaka takes 2–4 working days depending on the courier route. Orders placed after 6pm may be processed the next morning.',
        ],
        body_bn: [
          'ঢাকার ভিতরের অর্ডার সাধারণত ১–২ কর্মদিবসে পৌঁছায়। ঢাকার বাইরে কুরিয়ার রুট অনুযায়ী ২–৪ কর্মদিবস লাগে। সন্ধ্যা ৬টার পরে দেওয়া অর্ডার পরদিন সকালে প্রসেস হতে পারে।',
        ],
      },
      {
        heading: 'Tracking your parcel',
        heading_bn: 'পার্সেল ট্র্যাকিং',
        body: [
          'Use the Track Order page with your order ID and phone number to see the current status. We also call before dispatch to confirm the address.',
        ],
        body_bn: [
          'অর্ডার আইডি ও ফোন নম্বর দিয়ে Track Order পেজে বর্তমান অবস্থা দেখুন। ডেলিভারির আগে ঠিকানা নিশ্চিত করতে আমরা কল করি।',
        ],
      },
      {
        heading: 'Fragile items',
        heading_bn: 'ভঙ্গুর পণ্য',
        body: [
          'Showpieces and other fragile items are wrapped with extra padding. Please check the parcel in front of the courier and contact us immediately if anything is broken.',
        ],
        body_bn: [
          'শোপিস ও অন্যান্য ভঙ্গুর পণ্য বাড়তি প্যাডিং দিয়ে মোড়া হয়। কুরিয়ারের সামনেই পার্সেল খুলে দেখুন, কিছু ভাঙা থাকলে সাথে সাথে আমাদের জানান।',
        ],
      },
    ],
  },

  'faq': {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    title_bn: 'সাধারণ প্রশ্ন',
    subtitle: 'Short answers to the questions we hear most.',
    subtitle_bn: 'সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের সংক্ষিপ্ত উত্তর।',
    sections: [
      {
        heading: 'How long does delivery take?',
        heading_bn: 'ডেলিভারিতে কত সময় লাগে?',
        body: [
          'Inside Dhaka 1–2 working days, outside Dhaka 2–4 working days. You can follow the status on the Track Order page.',
        ],
        body_bn: [
          'ঢাকার ভিতরে ১–২ কর্মদিবস, ঢাকার বাইরে ২–৪ কর্মদিবস। Track Order পেজে অবস্থা দেখতে পারবেন।',
        ],
      },
      {
        heading: 'Can I pay after receiving the product?',
        heading_bn: 'পণ্য পাওয়ার পর টাকা দিতে পারি?',
        body: [
          'Yes. Cash on delivery is available across Bangladesh. Mobile banking is also accepted if you prefer to pay in advance.',
        ],
        body_bn: [
          'হ্যাঁ। সারাদেশে ক্যাশ অন ডেলিভারি আছে। আগে টাকা দিতে চাইলে মোবাইল ব্যাংকিংও গ্রহণ করা হয়।',
        ],
      },
      {
        heading: 'What if the product is damaged?',
        heading_bn: 'পণ্য ভাঙা এলে কী করব?',
        body: [
          'Send us a photo of the item and the packaging within 48 hours of delivery. We will arrange a replacement or refund after checking the issue.',
        ],
        body_bn: [
          'পণ্য পাওয়ার ৪৮ ঘণ্টার মধ্যে পণ্য ও প্যাকেজিংয়ের ছবি পাঠান। যাচাই করে আমরা রিপ্লেসমেন্ট বা রিফান্ডের ব্যবস্থা করব।',
        ],
      },
      {
        heading: 'Can I cancel an order?',
        heading_bn: 'অর্ডার বাতিল করা যাবে?',
        body: [
          'Yes, before the order is handed to the courier. Use the Track Order page or call {{phone}} with your order ID.',
        ],
        body_bn: [
          'হ্যাঁ, কুরিয়ারে দেওয়ার আগ পর্যন্ত। Track Order পেজ ব্যবহার করুন অথবা অর্ডার আইডি দিয়ে {{phone}} নম্বরে কল করুন।',
        ],
      },
      {
        heading: 'Do you offer exchanges?',
        heading_bn: 'এক্সচেঞ্জ করা যায়?',
        body: [
          'Unused products in original packaging can be exchanged within 7 days. See the Exchange page for the full conditions.',
        ],
        body_bn: [
          'অব্যবহৃত ও আসল প্যাকেজিংয়ের পণ্য ৭ দিনের মধ্যে এক্সচেঞ্জ করা যায়। বিস্তারিত শর্ত Exchange পেজে দেখুন।',
        ],
      },
      {
        heading: 'Is there a warranty on watches?',
        heading_bn: 'ঘড়ির ওয়ারেন্টি আছে?',
        body: [
          'Warranty depends on the brand and is mentioned on the product page when available. Physical damage and water damage are not covered.',
        ],
        body_bn: [
          'ওয়ারেন্টি ব্র্যান্ডের উপর নির্ভর করে এবং থাকলে প্রোডাক্ট পেজে উল্লেখ করা হয়। শারীরিক ক্ষতি ও পানিতে ক্ষতির ক্ষেত্রে ওয়ারেন্টি প্রযোজ্য নয়।',
        ],
      },
    ],
  },

  'happy-return': {
    slug: 'happy-return',
    title: 'Happy Return',
    title_bn: 'হ্যাপি রিটার্ন',
    subtitle: 'If something is not right, we make it right.',
    subtitle_bn: 'কিছু ঠিক না থাকলে আমরা সেটি ঠিক করে দিই।',
    sections: [
      {
        heading: '7-day return window',
        heading_bn: '৭ দিনের রিটার্ন সুবিধা',
        body: [
          'You can request a return within 7 days of receiving your order. The product must be unused, undamaged and in its original packaging with any tags or accessories included.',
        ],
        body_bn: [
          'অর্ডার পাওয়ার ৭ দিনের মধ্যে রিটার্নের অনুরোধ করতে পারবেন। পণ্য অব্যবহৃত, অক্ষত এবং আসল প্যাকেজিংয়ে থাকতে হবে; ট্যাগ ও এক্সেসরিও সাথে থাকতে হবে।',
        ],
      },
      {
        heading: 'When a return is not accepted',
        heading_bn: 'কখন রিটার্ন গ্রহণ করা হয় না',
        bullets: [
          'Used, washed or altered products.',
          'Items damaged after delivery due to misuse.',
          'Products without the original packaging or missing accessories.',
          'Personalised or customised items.',
        ],
        bullets_bn: [
          'ব্যবহৃত, ধোয়া বা পরিবর্তন করা পণ্য।',
          'ডেলিভারির পর অসতর্ক ব্যবহারে ক্ষতিগ্রস্ত পণ্য।',
          'আসল প্যাকেজিং না থাকলে বা এক্সেসরি না থাকলে।',
          'ব্যক্তিগতভাবে তৈরি বা কাস্টমাইজ করা পণ্য।',
        ],
      },
      {
        heading: 'How to start a return',
        heading_bn: 'রিটার্ন কীভাবে শুরু করবেন',
        body: [
          'Call {{phone}} or email {{email}} with your order ID and a photo of the product. We will confirm whether a pickup or courier drop-off is available in your area.',
        ],
        body_bn: [
          'অর্ডার আইডি ও পণ্যের ছবিসহ {{phone}} নম্বরে কল করুন বা {{email}} ঠিকানায় ইমেইল করুন। আপনার এলাকায় পিকআপ নাকি কুরিয়ারে পাঠাতে হবে তা আমরা জানিয়ে দেব।',
        ],
      },
    ],
  },

  'refund-policy': {
    slug: 'refund-policy',
    title: 'Refund Policy',
    title_bn: 'রিফান্ড নীতি',
    subtitle: 'When refunds are issued and how long they take.',
    subtitle_bn: 'কখন রিফান্ড দেওয়া হয় এবং কত সময় লাগে।',
    sections: [
      {
        heading: 'When you get a refund',
        heading_bn: 'কখন রিফান্ড পাবেন',
        bullets: [
          'The product is out of stock after your order is confirmed.',
          'The item arrived damaged or is not the one you ordered.',
          'A return is accepted and the product passes inspection.',
          'A prepaid order is cancelled before dispatch.',
        ],
        bullets_bn: [
          'অর্ডার নিশ্চিত হওয়ার পর পণ্য স্টকে না থাকলে।',
          'পণ্য ভাঙা অবস্থায় এলে বা ভুল পণ্য এলে।',
          'রিটার্ন গ্রহণযোগ্য হলে এবং পণ্য যাচাইয়ে উত্তীর্ণ হলে।',
          'অগ্রিম পেমেন্টের অর্ডার ডেলিভারির আগে বাতিল হলে।',
        ],
      },
      {
        heading: 'How the refund is paid',
        heading_bn: 'রিফান্ড কীভাবে দেওয়া হয়',
        body: [
          'Mobile banking payments are refunded to the same account within 3–7 working days after approval. Cash-on-delivery refunds are paid through bKash or Nagad, or in cash for local deliveries.',
        ],
        body_bn: [
          'মোবাইল ব্যাংকিংয়ের টাকা অনুমোদনের পর ৩–৭ কর্মদিবসের মধ্যে একই অ্যাকাউন্টে ফেরত দেওয়া হয়। ক্যাশ অন ডেলিভারির ক্ষেত্রে বিকাশ বা নগদে, অথবা স্থানীয় ডেলিভারিতে নগদে রিফান্ড দেওয়া হয়।',
        ],
      },
      {
        heading: 'Delivery charges',
        heading_bn: 'ডেলিভারি চার্জ',
        body: [
          'Delivery charges are refunded only when the mistake was ours (wrong or damaged item). For change-of-mind returns, the delivery charge is not refunded.',
        ],
        body_bn: [
          'ভুল বা ক্ষতিগ্রস্ত পণ্যের মতো আমাদের ভুল হলে ডেলিভারি চার্জ ফেরত দেওয়া হয়। মন পরিবর্তনের কারণে রিটার্নে ডেলিভারি চার্জ ফেরত দেওয়া হয় না।',
        ],
      },
    ],
  },

  'exchange': {
    slug: 'exchange',
    title: 'Exchange',
    title_bn: 'এক্সচেঞ্জ',
    subtitle: 'Swap a product for another size, variant or item.',
    subtitle_bn: 'অন্য সাইজ, ভ্যারিয়েন্ট বা পণ্যের সাথে বদল করুন।',
    sections: [
      {
        heading: 'Exchange window',
        heading_bn: 'এক্সচেঞ্জের সময়',
        body: [
          'Exchanges are accepted within 7 days of delivery, subject to stock availability. The product must be unused and in its original packaging.',
        ],
        body_bn: [
          'স্টক থাকা সাপেক্ষে ডেলিভারির ৭ দিনের মধ্যে এক্সচেঞ্জ গ্রহণ করা হয়। পণ্য অব্যবহৃত ও আসল প্যাকেজিংয়ে থাকতে হবে।',
        ],
      },
      {
        heading: 'How it works',
        heading_bn: 'কীভাবে কাজ করে',
        bullets: [
          'Call {{phone}} with your order ID and the item you want instead.',
          'We confirm availability and any price difference.',
          'If the new item costs more, pay the difference; if it costs less, the balance is refunded.',
          'Pickup and re-delivery charges may apply for change-of-mind exchanges.',
        ],
        bullets_bn: [
          'অর্ডার আইডি ও আপনি যে পণ্য চান তা নিয়ে {{phone}} নম্বরে কল করুন।',
          'স্টক ও দামের পার্থক্য আমরা নিশ্চিত করব।',
          'নতুন পণ্যের দাম বেশি হলে পার্থক্য দিন; কম হলে বাকি টাকা ফেরত দেওয়া হবে।',
          'মন পরিবর্তনের কারণে এক্সচেঞ্জে পিকআপ ও পুনরায় ডেলিভারি চার্জ প্রযোজ্য হতে পারে।',
        ],
      },
      {
        heading: 'Faulty products',
        heading_bn: 'ত্রুটিপূর্ণ পণ্য',
        body: [
          'If the product is faulty or damaged on arrival, exchange and delivery are free. Send a photo within 48 hours so we can verify the issue quickly.',
        ],
        body_bn: [
          'পণ্য ত্রুটিপূর্ণ বা ভাঙা অবস্থায় এলে এক্সচেঞ্জ ও ডেলিভারি সম্পূর্ণ ফ্রি। দ্রুত যাচাইয়ের জন্য ৪৮ ঘণ্টার মধ্যে ছবি পাঠান।',
        ],
      },
    ],
  },

  'cancellation': {
    slug: 'cancellation',
    title: 'Cancellation',
    title_bn: 'অর্ডার বাতিল',
    subtitle: 'Cancel an order before it leaves our warehouse.',
    subtitle_bn: 'পণ্য ডেলিভারিতে যাওয়ার আগেই অর্ডার বাতিল করুন।',
    sections: [
      {
        heading: 'Before dispatch',
        heading_bn: 'ডেলিভারির আগে',
        body: [
          'Orders can be cancelled free of charge at any time before they are handed to the courier. Use the Track Order page or call {{phone}} with your order ID.',
        ],
        body_bn: [
          'কুরিয়ারে দেওয়ার আগ পর্যন্ত যেকোনো সময় বিনামূল্যে অর্ডার বাতিল করা যায়। Track Order পেজ ব্যবহার করুন অথবা অর্ডার আইডি দিয়ে {{phone}} নম্বরে কল করুন।',
        ],
      },
      {
        heading: 'After dispatch',
        heading_bn: 'ডেলিভারিতে যাওয়ার পর',
        body: [
          'Once the parcel is with the courier it cannot be cancelled online. You may refuse the delivery, but the delivery charge is not refunded in that case.',
        ],
        body_bn: [
          'পার্সেল কুরিয়ারের কাছে চলে গেলে অনলাইনে বাতিল করা যায় না। ডেলিভারি নিতে অস্বীকার করতে পারেন, তবে সেক্ষেত্রে ডেলিভারি চার্জ ফেরত দেওয়া হয় না।',
        ],
      },
      {
        heading: 'Prepaid orders',
        heading_bn: 'অগ্রিম পেমেন্টের অর্ডার',
        body: [
          'If you already paid by mobile banking and cancel before dispatch, the full amount including delivery is refunded within 3–7 working days.',
        ],
        body_bn: [
          'মোবাইল ব্যাংকিংয়ে টাকা দেওয়ার পর ডেলিভারির আগে বাতিল করলে ডেলিভারি চার্জসহ সম্পূর্ণ টাকা ৩–৭ কর্মদিবসের মধ্যে ফেরত দেওয়া হয়।',
        ],
      },
    ],
  },

  'pre-order': {
    slug: 'pre-order',
    title: 'Pre-Order',
    title_bn: 'প্রি-অর্ডার',
    subtitle: 'Reserve limited-stock or upcoming products ahead of time.',
    subtitle_bn: 'সীমিত স্টক বা আসন্ন পণ্য আগেই সংরক্ষণ করুন।',
    sections: [
      {
        heading: 'How pre-order works',
        heading_bn: 'প্রি-অর্ডার কীভাবে কাজ করে',
        body: [
          'Some products are listed as pre-order when stock is on the way. You can reserve one by placing a normal order; we confirm the expected delivery date by phone before you pay anything.',
        ],
        body_bn: [
          'স্টক পথে থাকলে কিছু পণ্য প্রি-অর্ডার হিসেবে দেখানো হয়। সাধারণ অর্ডারের মতোই আপনি একটি সংরক্ষণ করতে পারেন; টাকা দেওয়ার আগে ফোনে সম্ভাব্য ডেলিভারির তারিখ নিশ্চিত করা হয়।',
        ],
      },
      {
        heading: 'Payment and timeline',
        heading_bn: 'পেমেন্ট ও সময়',
        bullets: [
          'Cash on delivery is available for most pre-orders.',
          'The expected delivery date is shown on the product page or confirmed by our team.',
          'If the date changes, we inform you before dispatch.',
          'You can cancel a pre-order at any time before it ships.',
        ],
        bullets_bn: [
          'বেশিরভাগ প্রি-অর্ডারে ক্যাশ অন ডেলিভারি আছে।',
          'সম্ভাব্য ডেলিভারির তারিখ প্রোডাক্ট পেজে দেখানো হয় বা আমাদের টিম নিশ্চিত করে।',
          'তারিখ বদলালে ডেলিভারির আগে আপনাকে জানানো হয়।',
          'পণ্য পাঠানোর আগে যেকোনো সময় প্রি-অর্ডার বাতিল করা যায়।',
        ],
      },
      {
        heading: 'Questions',
        heading_bn: 'প্রশ্ন',
        body: ['Call {{phone}} for the latest stock and delivery estimate.'],
        body_bn: ['সর্বশেষ স্টক ও ডেলিভারির সম্ভাব্য সময় জানতে {{phone}} নম্বরে কল করুন।'],
      },
    ],
  },

  'extra-discount': {
    slug: 'extra-discount',
    title: 'Extra Discount',
    title_bn: 'এক্সট্রা ডিসকাউন্ট',
    subtitle: 'How coupons work on top of existing offers.',
    subtitle_bn: 'চলমান অফারের উপরে কুপন কীভাবে কাজ করে।',
    sections: [
      {
        heading: 'Applying a coupon',
        heading_bn: 'কুপন প্রয়োগ',
        body: [
          'Enter your coupon code in the cart or at checkout and tap Apply. The discount is shown before you place the order, so you always know the final total.',
        ],
        body_bn: [
          'কার্টে বা চেকআউটে কুপন কোড লিখে Apply চাপুন। অর্ডার দেওয়ার আগেই ছাড় দেখা যাবে, তাই চূড়ান্ত মোট টাকা সবসময় পরিষ্কার থাকবে।',
        ],
      },
      {
        heading: 'Coupon rules',
        heading_bn: 'কুপনের নিয়ম',
        bullets: [
          'One coupon per order.',
          'A minimum order value may apply and is shown with the coupon.',
          'Expired or fully used coupons do not apply.',
          'Coupons cannot be exchanged for cash.',
        ],
        bullets_bn: [
          'এক অর্ডারে একটি কুপন।',
          'সর্বনিম্ন অর্ডার মূল্য প্রযোজ্য হতে পারে, যা কুপনের সাথে দেখানো হয়।',
          'মেয়াদোত্তীর্ণ বা সম্পূর্ণ ব্যবহৃত কুপন কাজ করবে না।',
          'কুপন নগদে বদলানো যায় না।',
        ],
      },
      {
        heading: 'Getting new codes',
        heading_bn: 'নতুন কোড পাওয়া',
        body: [
          'Subscribe to our newsletter at the bottom of any page. Seasonal codes are also announced on our social pages.',
        ],
        body_bn: [
          'যেকোনো পেজের নিচে নিউজলেটারে সাবস্ক্রাইব করুন। মৌসুমি কোড আমাদের সোশ্যাল পেজেও ঘোষণা করা হয়।',
        ],
      },
    ],
  },
}

export const getPage = (slug) => {
  if (!slug) return null
  if (pages[slug]) return pages[slug]
  // Tolerate links saved with an accidental prefix such as /page/about-us.
  const cleaned = String(slug).replace(/^\/?page\//, '').replace(/\/$/, '')
  return pages[cleaned] || null
}
