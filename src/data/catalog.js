// GhorerBazar-style demo catalog. All prices are in BDT.
// Product photography is loaded from the public GhorerBazar CDN for demo fidelity.
// Replace with your own media before any public launch.

const cdn = (folder, file) => `https://cdn.ghorerbazar.com/${folder}/${file}`
export const productImage = (file) => cdn('productImages', file)
export const categoryImage = (file) => cdn('category_images', file)
export const bannerImage = (file) => cdn('banner', file)
export const brandImage = (file) => cdn('brand_images', file)
export const testimonialImage = (file) => cdn('testimonial', file)

export const categories = [
  {
    id: 1,
    slug: 'honey',
    name: 'Honey',
    name_bn: 'মধু',
    image: categoryImage('KbWCe1774766391.png'),
    children: [
      { slug: 'sundarban-honey', name: 'Sundarban Honey', name_bn: 'সুন্দরবনের মধু' },
      { slug: 'black-seed-honey', name: 'Black Seed Honey', name_bn: 'কালোজিরার মধু' },
      { slug: 'lychee-flower-honey', name: 'Lychee Flower Honey', name_bn: 'লিচু ফুলের মধু' },
      { slug: 'sidr-honey', name: 'Sidr Honey', name_bn: 'সিদর মধু' },
      { slug: 'honeycomb', name: 'Honeycomb', name_bn: 'মৌচাক' },
      { slug: 'sachet-box', name: 'Sachet Box', name_bn: 'স্যাশে বক্স' },
    ],
  },
  {
    id: 2,
    slug: 'oil-ghee',
    name: 'Oil & Ghee',
    name_bn: 'তেল ও ঘি',
    image: categoryImage('Zf99g1774766372.png'),
    children: [
      { slug: 'ghee', name: 'Ghee', name_bn: 'ঘি' },
      { slug: 'mustard-oil', name: 'Mustard Oil', name_bn: 'সরিষার তেল' },
      { slug: 'olive-oil', name: 'Olive Oil', name_bn: 'অলিভ অয়েল' },
      { slug: 'coconut-oil', name: 'Coconut Oil', name_bn: 'নারকেল তেল' },
      { slug: 'vinegar', name: 'Vinegar', name_bn: 'ভিনেগার' },
    ],
  },
  {
    id: 3,
    slug: 'dates',
    name: 'Dates',
    name_bn: 'খেজুর',
    image: categoryImage('wgCR01774766402.png'),
    children: [
      { slug: 'ajwa', name: 'Ajwa', name_bn: 'আজওয়া' },
      { slug: 'medjool', name: 'Medjool', name_bn: 'মেজদুল' },
      { slug: 'safawi-kalmi', name: 'Safawi / Kalmi', name_bn: 'সাফاوی / কালমি' },
      { slug: 'sukkari', name: 'Sukkari', name_bn: 'সুক্কারি' },
    ],
  },
  {
    id: 4,
    slug: 'spices',
    name: 'Spices',
    name_bn: 'মসলা',
    image: categoryImage('hXyU71774766413.png'),
    children: [
      { slug: 'whole-spices', name: 'Whole Spices', name_bn: 'আস্ত মসলা' },
      { slug: 'basic-spices', name: 'Basic Spices', name_bn: 'মৌলিক মসলা' },
      { slug: 'mixed-spices', name: 'Mixed Spices', name_bn: 'মিশ্র মসলা' },
    ],
  },
  {
    id: 5,
    slug: 'nuts-seeds',
    name: 'Nuts & Seeds',
    name_bn: 'বাদাম ও বীজ',
    image: categoryImage('5u39t1774766425.png'),
    children: [
      { slug: 'nuts', name: 'Nuts', name_bn: 'বাদাম' },
      { slug: 'seeds', name: 'Seeds', name_bn: 'বীজ' },
    ],
  },
  {
    id: 6,
    slug: 'beverage',
    name: 'Beverage',
    name_bn: 'পানীয়',
    image: categoryImage('AZG2N1774766442.png'),
    children: [
      { slug: 'tea', name: 'Tea', name_bn: 'চা' },
      { slug: 'coffee', name: 'Coffee', name_bn: 'কফি' },
    ],
  },
  {
    id: 7,
    slug: 'rice',
    name: 'Rice',
    name_bn: 'চাল',
    image: categoryImage('Emr6I1774766667.png'),
    children: [{ slug: 'rice', name: 'Rice', name_bn: 'চাল' }],
  },
  {
    id: 8,
    slug: 'flours-lentils',
    name: 'Flours & Lentils',
    name_bn: 'আটা ও ডাল',
    image: categoryImage('Lo11M1774766468.png'),
    children: [
      { slug: 'flours', name: 'Flours', name_bn: 'আটা' },
      { slug: 'lentils', name: 'Lentils', name_bn: 'ডাল' },
    ],
  },
  {
    id: 9,
    slug: 'organic',
    name: 'Organic',
    name_bn: 'অর্গানিক',
    image: categoryImage('HJOrw1774766749.png'),
    children: [{ slug: 'organic', name: 'Organic Certified', name_bn: 'অর্গানিক সার্টিফাইড' }],
  },
  {
    id: 10,
    slug: 'functional-food',
    name: 'Functional Food',
    name_bn: 'ফাংশনাল ফুড',
    image: categoryImage('JxBh61774766494.png'),
    children: [{ slug: 'functional-food', name: 'Functional Food', name_bn: 'ফাংশনাল ফুড' }],
  },
  {
    id: 11,
    slug: 'pickle',
    name: 'Pickle',
    name_bn: 'আচার',
    image: categoryImage('hXyU71774766413.png'),
    children: [{ slug: 'pickle', name: 'Pickle', name_bn: 'আচার' }],
  },
  {
    id: 12,
    slug: 'showpiece',
    name: 'Showpiece',
    name_bn: 'শোপিস',
    image: categoryImage('hXyU71774766413.png'),
    children: [{ slug: 'showpiece', name: 'Showpiece', name_bn: 'শোপিস' }],
  },
  {
    id: 13,
    slug: 'shoes-bags',
    name: 'Shoes & Bags',
    name_bn: 'জুতা ও ব্যাগ',
    image: categoryImage('hXyU71774766413.png'),
    children: [
      { slug: 'shoes', name: 'Shoes', name_bn: 'জুতা' },
      { slug: 'bags', name: 'Bags', name_bn: 'ব্যাগ' },
    ],
  },
]

export const brands = [
  { slug: 'ghorerbazar', name: 'GhorerBazar', name_bn: 'ঘরের বাজার', logo: brandImage('7hNKq1768887947.png') },
  { slug: 'glarvest', name: 'Glarvest', name_bn: 'গ্লারভেস্ট', logo: brandImage('RNTIU1763611802.png') },
  { slug: 'khejuri', name: 'Khejuri', name_bn: 'খেজুরি', logo: brandImage('8Gpl21757919440.png') },
  { slug: 'shosti-food', name: 'Shosti Food', name_bn: 'শস্তি ফুড', logo: brandImage('8matO1757919401.png') },
  { slug: 'honeyraj', name: 'Honeyraj', name_bn: 'হানিরাজ', logo: brandImage('lCfRt1759553456.png') },
]

export const heroSlides = [
  {
    id: 1,
    image: bannerImage('lrMlR1792818389-light-1001x401.png'),
    href: '/collections/honey',
    alt: 'Pure honey collection',
  },
  {
    id: 2,
    image: bannerImage('mM4zY1791177103-light-1000x400.jpg'),
    href: '/collections/dates',
    alt: 'Premium dates collection',
  },
  {
    id: 3,
    image: bannerImage('kdvcy1786290971-light-1000x400.png'),
    href: '/collections/oil-ghee',
    alt: 'Cooking essentials',
  },
]

export const sideBanners = [
  { id: 1, image: bannerImage('iiROP1792818389-light-501x281.png'), href: '/collections/dates', alt: 'Dates offer' },
  { id: 2, image: bannerImage('CMSdo1791180033-light-500x279.jpg'), href: '/offer-zone', alt: 'Special offer' },
]

export const promoBanners = [
  { id: 1, image: bannerImage('KQlqd1788006502-4000x1039.jpeg'), href: '/collections/oil-ghee', alt: 'Cooking essentials' },
  { id: 2, image: bannerImage('nr4nq1788005117-1000x400.png'), href: '/collections/honey', alt: 'Natural honey' },
]

export const testimonials = [
  {
    id: 1,
    name: 'Farhana Akter',
    name_bn: 'ফারহানা আক্তার',
    location: 'Dhaka',
    location_bn: 'ঢাকা',
    avatar: testimonialImage('NgeCj1758183204.jpg'),
    rating: 5,
    text: 'The honey tastes exactly like the raw honey we get from our village. Packaging was sealed and delivery reached within two days.',
    text_bn: 'মধুর স্বাদ একেবারে গ্রামের খাঁটি মধুর মতো। প্যাকেজিং সিলড ছিল আর দুই দিনের মধ্যে ডেলিভারি পেয়েছি।',
  },
  {
    id: 2,
    name: 'Tanvir Ahmed',
    name_bn: 'তানভীর আহমেদ',
    location: 'Chattogram',
    location_bn: 'চট্টগ্রাম',
    avatar: testimonialImage('7XD7v1758183150.jpg'),
    rating: 5,
    text: 'Ordered Medjool dates for iftar. Fresh, soft and big — better than what I usually buy from the local market.',
    text_bn: 'ইফতারের জন্য মেজদুল খেজুর অর্ডার করেছিলাম। টাটকা, নরম আর বড় — বাজারের চেয়ে অনেক ভালো।',
  },
  {
    id: 3,
    name: 'Nusrat Jahan',
    name_bn: 'নুসরাত জাহান',
    location: 'Sylhet',
    location_bn: 'সিলেট',
    avatar: testimonialImage('PZDyt1758183005.jpg'),
    rating: 4,
    text: 'Gawa ghee smells amazing. I use it for everyday cooking and the 1kg jar lasts my family a long time.',
    text_bn: 'গাওয়া ঘিয়ের ঘ্রাণ দারুণ। প্রতিদিনের রান্নায় ব্যবহার করি, ১ কেজি জার পরিবারের জন্য অনেকদিন চলে।',
  },
  {
    id: 4,
    name: 'Rakib Hasan',
    name_bn: 'রাকিব হাসান',
    location: 'Rajshahi',
    location_bn: 'রাজশাহী',
    avatar: testimonialImage('0Jti61758182944.png'),
    rating: 5,
    text: 'Customer support answered on WhatsApp within minutes and helped me pick the right olive oil. Genuine service.',
    text_bn: 'হোয়াটসঅ্যাপে কয়েক মিনিটেই সাপোর্ট পেয়েছি, ঠিক অলিভ অয়েল বেছে নিতে সাহায্য করেছে। সত্যিকারের সার্ভিস।',
  },
  {
    id: 5,
    name: 'Sumaiya Islam',
    name_bn: 'সুমাইয়া ইসলাম',
    location: 'Khulna',
    location_bn: 'খুলনা',
    avatar: testimonialImage('3qPit1758182893.jpg'),
    rating: 5,
    text: 'I have reordered the masala combo three times. Fresh aroma, no fillers, and the price is fair for the quality.',
    text_bn: 'মসলা কম্বো তিনবার অর্ডার করেছি। টাটকা ঘ্রাণ, ভেজাল নেই, আর দামও মানের তুলনায় ন্যায্য।',
  },
]

const categoryCopy = {
  honey: {
    short: 'Raw, unfiltered honey with no added sugar.',
    short_bn: 'খাঁটি, আনফিল্টারড মধু — কোনো অতিরিক্ত চিনি নেই।',
    description: [
      'Collected from trusted beekeepers and packed without heating, this honey keeps its natural aroma, enzymes and nutrients intact.',
      'Use it every morning with warm water, spread it on toast, or sweeten tea and desserts. Store in a cool, dry place away from direct sunlight. Natural crystallisation is normal and does not affect quality.',
    ],
    description_bn: [
      'বিশ্বস্ত মৌচাষীদের কাছ থেকে সংগ্রহ করা এই মধু গরম না করেই প্যাক করা হয়, ফলে এর প্রাকৃতিক ঘ্রাণ, এনজাইম ও পুষ্টি অটুট থাকে।',
      'প্রতিদিন সকালে কুসুম গরম পানিতে, টোস্টে বা চা-মিষ্টিতে ব্যবহার করুন। সরাসরি রোদ থেকে দূরে, ঠান্ডা ও শুকনো জায়গায় রাখুন। প্রাকৃতিকভাবে মধু জমে গেলে তা মানের কোনো সমস্যা নয়।',
    ],
    features: ['100% raw and unprocessed', 'No added sugar, colour or preservatives', 'Lab tested for purity', 'Sealed food-grade jar'],
    features_bn: ['১০০% খাঁটি ও আনপ্রসেসড', 'অতিরিক্ত চিনি, রং বা প্রিজারভেটিভ নেই', 'খাঁটিতার জন্য ল্যাব টেস্টেড', 'সিলড ফুড-গ্রেড জার'],
  },
  dates: {
    short: 'Hand-picked premium dates, soft and naturally sweet.',
    short_bn: 'হাতে বাছাই করা প্রিমিয়াম খেজুর, নরম ও প্রাকৃতিক মিষ্টি।',
    description: [
      'Our dates are sourced from selected orchards and packed fresh in food-grade pouches. Each date is plump, soft and naturally sweet — ideal for iftar, snacking and gifting.',
      'Keep the pouch sealed after opening and refrigerate for longer freshness. A naturally occurring white layer is harmless and can be wiped off.',
    ],
    description_bn: [
      'নির্বাচিত বাগান থেকে সংগ্রহ করা খেজুর ফুড-গ্রেড প্যাকে টাটকা অবস্থায় প্যাক করা হয়। প্রতিটি খেজুর মোটা, নরম ও প্রাকৃতিকভাবে মিষ্টি — ইফতার, নাস্তা ও উপহারের জন্য আদর্শ।',
      'খোলার পর প্যাক সিল করে ফ্রিজে রাখলে বেশি দিন টাটকা থাকবে। প্রাকৃতিক সাদা আস্তরণ ক্ষতিকর নয়, মুছে ফেললেই হবে।',
    ],
    features: ['Hand-sorted premium grade', 'Soft, chewy texture', 'No added sugar or syrup', 'Resealable pouch'],
    features_bn: ['হাতে বাছাই করা প্রিমিয়াম গ্রেড', 'নরম ও মোলায়েম', 'অতিরিক্ত চিনি বা সিরাপ নেই', 'রিসিলেবল প্যাক'],
  },
  'oil-ghee': {
    short: 'Traditional taste, carefully processed for everyday cooking.',
    short_bn: 'প্রথাগত স্বাদ, প্রতিদিনের রান্নার জন্য যত্নে প্রসেসড।',
    description: [
      'Made in small batches from carefully selected ingredients, this product brings authentic flavour to everyday cooking without artificial colour or preservatives.',
      'Store in a cool, dry place with the lid tightly closed. Use a dry spoon every time to keep it fresh for longer.',
    ],
    description_bn: [
      'সতর্কভাবে বাছাই করা উপকরণ থেকে ছোট ব্যাচে তৈরি এই পণ্য কৃত্রিম রং বা প্রিজারভেটিভ ছাড়াই প্রতিদিনের রান্নায় খাঁটি স্বাদ আনে।',
      'ঢাকনাসহ ঠান্ডা ও শুকনো জায়গায় রাখুন। প্রতিবার শুকনো চামচ ব্যবহার করলে বেশি দিন টাটকা থাকবে।',
    ],
    features: ['Traditional small-batch production', 'No artificial colour', 'Food-grade bottle or jar', 'Everyday cooking essential'],
    features_bn: ['প্রথাগত ছোট ব্যাচে উৎপাদিত', 'কৃত্রিম রং নেই', 'ফুড-গ্রেড বোতল বা জার', 'প্রতিদিনের রান্নার প্রয়োজনীয়'],
  },
  spices: {
    short: 'Freshly ground spices with full aroma and no fillers.',
    short_bn: 'টাটকা গুঁড়া মসলা — পূর্ণ ঘ্রাণ, ভেজালমুক্ত।',
    description: [
      'Whole spices are cleaned, sun-dried and ground in small batches so the natural oils and aroma stay in the packet.',
      'Add to hot oil or simmer with your curry for a richer flavour. Keep the packet closed and store away from moisture.',
    ],
    description_bn: [
      'আস্ত মসলা পরিষ্কার করে রোদে শুকিয়ে ছোট ব্যাচে গুঁড়া করা হয়, যাতে প্রাকৃতিক তেল ও ঘ্রাণ প্যাকেই থাকে।',
      'গরম তেলে বা ঝোলের সাথে দিলে স্বাদ আরও গাঢ় হয়। প্যাক বন্ধ রাখুন এবং আর্দ্রতা থেকে দূরে সংরক্ষণ করুন।',
    ],
    features: ['Freshly ground in small batches', 'No artificial colour or filler', 'Airtight pouch', 'Rich natural aroma'],
    features_bn: ['ছোট ব্যাচে টাটকা গুঁড়া', 'কৃত্রিম রং বা ভেজাল নেই', 'এয়ারটাইট প্যাক', 'সমৃদ্ধ প্রাকৃতিক ঘ্রাণ'],
  },
  'nuts-seeds': {
    short: 'Crunchy, carefully sorted nuts and seeds for everyday snacking.',
    short_bn: 'প্রতিদিনের নাস্তার জন্য মুচমুচে, যত্নে বাছাই করা বাদাম ও বীজ।',
    description: [
      'Sorted and packed fresh, these nuts are perfect for snacking, baking and adding to breakfast bowls. Rich in natural protein, fibre and healthy fats.',
      'Store in an airtight container away from heat. Refrigerate after opening to keep them crunchy for longer.',
    ],
    description_bn: [
      'বাছাই করে টাটকা প্যাক করা এই বাদাম নাস্তা, বেকিং ও সকালের নাস্তায় দুর্দান্ত। প্রাকৃতিক প্রোটিন, ফাইবার ও স্বাস্থ্যকর ফ্যাটে সমৃদ্ধ।',
      'তাপ থেকে দূরে এয়ারটাইট পাত্রে রাখুন। খোলার পর ফ্রিজে রাখলে বেশিদিন মুচমুচে থাকবে।',
    ],
    features: ['Hand-sorted quality grade', 'Rich in protein and fibre', 'No added salt or oil', 'Resealable pack'],
    features_bn: ['হাতে বাছাই করা মানসম্মত গ্রেড', 'প্রোটিন ও ফাইবারে সমৃদ্ধ', 'অতিরিক্ত লবণ বা তেল নেই', 'রিসিলেবল প্যাক'],
  },
  'flours-lentils': {
    short: 'Everyday pantry staple, cleaned and packed fresh.',
    short_bn: 'প্রতিদিনের রান্নাঘরের নিত্যপণ্য, পরিষ্কার করে টাটকা প্যাক করা।',
    description: [
      'Cleaned and machine-sorted for consistent quality, this pantry staple cooks evenly and tastes home-style.',
      'Store in an airtight container in a dry place. Rinse before cooking and soak lentils for a softer texture.',
    ],
    description_bn: [
      'পরিষ্কার ও মেশিনে বাছাই করা এই নিত্যপণ্য সমানভাবে সেদ্ধ হয় এবং ঘরোয়া স্বাদ দেয়।',
      'শুকনো জায়গায় এয়ারটাইট পাত্রে রাখুন। রান্নার আগে ধুয়ে নিন, ডাল নরম করতে কিছুক্ষণ ভিজিয়ে রাখুন।',
    ],
    features: ['Cleaned and sorted', 'Consistent cooking quality', 'Airtight packaging', 'Great value pack'],
    features_bn: ['পরিষ্কার ও বাছাই করা', 'সমান মানের রান্না', 'এয়ারটাইট প্যাকেজিং', 'সাশ্রয়ী প্যাক'],
  },
  rice: {
    short: 'Aromatic, well-milled rice for everyday meals.',
    short_bn: 'প্রতিদিনের খাবারের জন্য সুগন্ধি, ভালোভাবে মিল করা চাল।',
    description: [
      'Selected paddy is milled and sorted to remove broken grains, giving you clean rice that cooks fluffy and separate.',
      'Store in a dry container with a tight lid. Rinse two to three times before cooking.',
    ],
    description_bn: [
      'বাছাই করা ধান মিল করে ভাঙা দানা আলাদা করা হয়, ফলে পরিষ্কার চাল রান্নায় ঝরঝরে হয়।',
      'শক্ত ঢাকনাযুক্ত শুকনো পাত্রে রাখুন। রান্নার আগে দুই-তিনবার ধুয়ে নিন।',
    ],
    features: ['Clean, well-milled grains', 'Fluffy when cooked', 'Airtight sack', 'Family value pack'],
    features_bn: ['পরিষ্কার, ভালোভাবে মিল করা দানা', 'রান্নায় ঝরঝরে', 'এয়ারটাইট বস্তা', 'পরিবারের জন্য সাশ্রয়ী প্যাক'],
  },
  beverage: {
    short: 'A refreshing everyday brew, packed for freshness.',
    short_bn: 'প্রতিদিনের সতেজ পানীয়, টাটকা অবস্থায় প্যাক করা।',
    description: [
      'Made from carefully selected leaves and beans, this brew is smooth, aromatic and easy to prepare at home.',
      'Store in an airtight container away from moisture and strong smells. Best enjoyed fresh.',
    ],
    description_bn: [
      'যত্নে বাছাই করা পাতা ও বীজ থেকে তৈরি এই পানীয় ঘরে বানানো সহজ, মসৃণ ও সুগন্ধি।',
      'আর্দ্রতা ও তীব্র গন্ধ থেকে দূরে এয়ারটাইট পাত্রে রাখুন। টাটকা অবস্থায় উপভোগ করুন।',
    ],
    features: ['Selected leaves and beans', 'Fresh sealed pack', 'No artificial flavouring', 'Easy to brew'],
    features_bn: ['বাছাই করা পাতা ও বীজ', 'টাটকা সিলড প্যাক', 'কৃত্রিম ফ্লেভার নেই', 'সহজে তৈরি'],
  },
  organic: {
    short: 'Certified organic, grown without synthetic chemicals.',
    short_bn: 'সার্টিফাইড অর্গানিক, কৃত্রিম রাসায়নিক ছাড়া উৎপাদিত।',
    description: [
      'Grown without synthetic pesticides or fertilisers, this organic product is processed gently to retain its natural goodness.',
      'Store as directed on the pack. Small variations in colour and texture are normal for organic produce.',
    ],
    description_bn: [
      'কৃত্রিম কীটনাশক বা সার ছাড়া উৎপাদিত এই অর্গানিক পণ্য যত্নে প্রসেস করা হয়, যাতে প্রাকৃতিক গুণ অটুট থাকে।',
      'প্যাকে দেওয়া নির্দেশনা অনুযায়ী সংরক্ষণ করুন। অর্গানিক পণ্যে রং ও গঠনে সামান্য তারতম্য স্বাভাবিক।',
    ],
    features: ['Certified organic', 'No synthetic pesticides', 'Gentle processing', 'Traceable sourcing'],
    features_bn: ['সার্টিফাইড অর্গানিক', 'কৃত্রিম কীটনাশক নেই', 'যত্নশীল প্রসেসিং', 'ট্রেসেবল সোর্সিং'],
  },
  'functional-food': {
    short: 'Everyday wellness support from natural ingredients.',
    short_bn: 'প্রাকৃতিক উপকরণ থেকে প্রতিদিনের সুস্থতার সহায়ক।',
    description: [
      'A carefully prepared functional food made from natural ingredients, designed to fit easily into your daily routine.',
      'Use as suggested on the pack. This is a food supplement, not a medicine — consult a doctor if you are pregnant, nursing or on medication.',
    ],
    description_bn: [
      'প্রাকৃতিক উপকরণ থেকে যত্নে তৈরি ফাংশনাল ফুড, সহজেই প্রতিদিনের রুটিনে যোগ করা যায়।',
      'প্যাকে দেওয়া নিয়ম অনুযায়ী ব্যবহার করুন। এটি খাদ্য পরিপূরক, ওষুধ নয় — গর্ভবতী, স্তন্যদানকারী বা নিয়মিত ওষুধ সেবন করলে চিকিৎসকের পরামর্শ নিন।',
    ],
    features: ['Natural ingredients', 'Easy daily serving', 'No added sugar', 'Sealed pouch'],
    features_bn: ['প্রাকৃতিক উপকরণ', 'সহজ দৈনিক ডোজ', 'অতিরিক্ত চিনি নেই', 'সিলড প্যাক'],
  },
  pickle: {
    short: 'Homestyle pickle with a tangy, spicy kick.',
    short_bn: 'ঘরোয়া স্বাদের আচার — টক-ঝাল মজাদার।',
    description: [
      'Made with fresh fruit, mustard oil and a traditional spice blend, this pickle adds a punch to rice, paratha and everyday meals.',
      'Always use a dry spoon and keep the jar closed. Refrigerate after opening.',
    ],
    description_bn: [
      'টাটকা ফল, সরিষার তেল ও প্রথাগত মসলার মিশ্রণে তৈরি এই আচার ভাত, পরোটা ও প্রতিদিনের খাবারে বাড়তি স্বাদ আনে।',
      'সবসময় শুকনো চামচ ব্যবহার করুন ও জার বন্ধ রাখুন। খোলার পর ফ্রিজে রাখুন।',
    ],
    features: ['Homestyle recipe', 'Mustard oil base', 'No artificial preservatives', 'Glass jar'],
    features_bn: ['ঘরোয়া রেসিপি', 'সরিষার তেলের বেস', 'কৃত্রিম প্রিজারভেটিভ নেই', 'কাচের জার'],
  },
}

const rawProducts = [
  // Honey
  { slug: 'sundarban-honey', name: 'Sundarban Honey 1kg', name_bn: 'সুন্দরবনের মধু ১ কেজি', price: 2125, oldPrice: 2500, image: 'KWSqQ1785577173-light-1000x1000.jpg', category: 'honey', subcategory: 'sundarban-honey', unit: '1 kg', badges: [], top: true, featured: true, rating: 4.9, reviewCount: 214, sold: 1820 },
  { slug: 'black-seed-honey-1kg', name: 'Black Seed Honey 1kg', name_bn: 'কালোজিরার মধু ১ কেজি', price: 1600, oldPrice: 1800, image: 'fAewT1767418525.jpg', category: 'honey', subcategory: 'black-seed-honey', unit: '1 kg', top: true, rating: 4.8, reviewCount: 96, sold: 940 },
  { slug: 'black-seed-honey-500g', name: 'Black Seed Honey 500g', name_bn: 'কালোজিরার মধু ৫০০ গ্রাম', price: 800, oldPrice: 900, image: 'JdeWl1767418564.jpg', category: 'honey', subcategory: 'black-seed-honey', unit: '500 g', rating: 4.7, reviewCount: 58, sold: 610 },
  { slug: 'lychee-flower-honey-500g', name: 'Lychee Flower Honey 500g', name_bn: 'লিচু ফুলের মধু ৫০০ গ্রাম', price: 650, oldPrice: 700, image: 'TtgOl1767418640.jpg', category: 'honey', subcategory: 'lychee-flower-honey', unit: '500 g', badges: ['Offered'], featured: true, rating: 4.7, reviewCount: 77, sold: 720 },
  { slug: 'kashmiri-sidr-honey-800g', name: 'Kashmiri Sidr Honey 800g', name_bn: 'কাশ্মীরি সিদর মধু ৮০০ গ্রাম', price: 2000, oldPrice: 0, image: 'OY4JB1768121526.jpg', category: 'honey', subcategory: 'sidr-honey', unit: '800 g', badges: ['New Arrival'], rating: 4.9, reviewCount: 34, sold: 260 },
  { slug: 'mixed-flower-honey-with-comb-500g', name: 'Mixed Flower Honey with Comb 500g', name_bn: 'মিশ্র ফুলের মধু মৌচাকসহ ৫০০ গ্রাম', price: 850, oldPrice: 1000, image: '0ldaX1767531519.jpg', category: 'honey', subcategory: 'honeycomb', unit: '500 g', rating: 4.8, reviewCount: 41, sold: 380 },
  { slug: 'lychee-flower-honey-1kg', name: 'Lychee Flower Honey 1kg', name_bn: 'লিচু ফুলের মধু ১ কেজি', price: 1300, oldPrice: 1400, image: 'A14zf1767418585.jpg', category: 'honey', subcategory: 'lychee-flower-honey', unit: '1 kg', top: true, rating: 4.8, reviewCount: 112, sold: 1050 },
  { slug: 'sundarban-honey-sachet-24', name: 'Sundarban Honey Sachet (15g × 24)', name_bn: 'সুন্দরবনের মধু স্যাশে (১৫ গ্রাম × ২৪)', price: 768, oldPrice: 0, image: 'xtAP0176075952.png', category: 'honey', subcategory: 'sachet-box', unit: '24 pcs', rating: 4.6, reviewCount: 27, sold: 310 },
  { slug: 'lychee-honey-sachet-24', name: 'Lychee Flower Honey Sachet (15g × 24)', name_bn: 'লিচু ফুলের মধু স্যাশে (১৫ গ্রাম × ২৪)', price: 432, oldPrice: 0, image: 'UxodJ1776075897.png', category: 'honey', subcategory: 'sachet-box', unit: '24 pcs', rating: 4.6, reviewCount: 19, sold: 240 },
  { slug: 'sundarban-honey-8g-24', name: 'Sundarban Honey Sachet (8g × 24)', name_bn: 'সুন্দরবনের মধু স্যাশে (৮ গ্রাম × ২৪)', price: 432, oldPrice: 0, image: 'omV471776075964.png', category: 'honey', subcategory: 'sachet-box', unit: '24 pcs', rating: 4.5, reviewCount: 15, sold: 190 },
  { slug: 'honey-nuts-800g', name: 'Honey Nuts 800g', name_bn: 'হানি নাটস ৮০০ গ্রাম', price: 1445, oldPrice: 1700, image: '4BTRl1767443347.jpg', category: 'honey', subcategory: 'honeycomb', unit: '800 g', badges: ['Best Selling'], top: true, featured: true, rating: 4.9, reviewCount: 143, sold: 1320 },
  { slug: 'african-wild-honey-500g', name: 'African Wild Honey 500g', name_bn: 'আফ্রিকান ওয়াইল্ড মধু ৫০০ গ্রাম', price: 1150, oldPrice: 1250, image: 'g7Qx11775107164.jpg', category: 'honey', subcategory: 'sidr-honey', unit: '500 g', badges: ['Offered'], rating: 4.8, reviewCount: 52, sold: 470 },

  // Dates
  { slug: 'ajwa-fresh-dates-1kg', name: 'Ajwa Fresh Dates 1kg', name_bn: 'আজওয়া তাজা খেজুর ১ কেজি', price: 1870, oldPrice: 2200, image: 'TY03p1782300772.webp', category: 'dates', subcategory: 'ajwa', unit: '1 kg', badges: ['Best Selling'], top: true, featured: true, rating: 4.9, reviewCount: 188, sold: 1610 },
  { slug: 'egyptian-medjool-jumbo-1kg', name: 'Egyptian Medjool Jumbo 1kg', name_bn: 'মিসরীয় মেজদুল জাম্বো ১ কেজি', price: 2125, oldPrice: 2500, image: 'j5HUH1788236401-light-1000x1000.jpg', category: 'dates', subcategory: 'medjool', unit: '1 kg', top: true, rating: 4.9, reviewCount: 91, sold: 820 },
  { slug: 'ajwa-dates-1kg-large', name: 'Ajwa Dates 1kg Large', name_bn: 'আজওয়া খেজুর ১ কেজি (বড়)', price: 2125, oldPrice: 2500, image: 'brZpn1776762573.webp', category: 'dates', subcategory: 'ajwa', unit: '1 kg', rating: 4.8, reviewCount: 74, sold: 690 },
  { slug: 'safawi-kalmi-1kg', name: 'Safawi / Kalmi Dates 1kg', name_bn: 'সাফاوی / কালমি খেজুর ১ কেজি', price: 1300, oldPrice: 1450, image: 'IyJYh1776762485.jpg', category: 'dates', subcategory: 'safawi-kalmi', unit: '1 kg', featured: true, rating: 4.7, reviewCount: 63, sold: 700 },
  { slug: 'ajwa-dates-500g', name: 'Ajwa Dates 500g', name_bn: 'আজওয়া খেজুর ৫০০ গ্রাম', price: 935, oldPrice: 1100, image: 'EESft1782301652.webp', category: 'dates', subcategory: 'ajwa', unit: '500 g', rating: 4.8, reviewCount: 47, sold: 520 },
  { slug: 'medjool-large-1kg', name: 'Medjool Dates Large 1kg', name_bn: 'মেজদুল খেজুর (বড়) ১ কেজি', price: 2090, oldPrice: 2200, image: 'LfSyl1788236394-light-1000x1000.jpg', category: 'dates', subcategory: 'medjool', unit: '1 kg', rating: 4.8, reviewCount: 55, sold: 480 },
  { slug: 'safawi-kalmi-500g', name: 'Safawi / Kalmi Dates 500g', name_bn: 'সাফاوی / কালমি খেজুর ৫০০ গ্রাম', price: 700, oldPrice: 0, image: 'lLEg51774852853.jpeg', category: 'dates', subcategory: 'safawi-kalmi', unit: '500 g', rating: 4.6, reviewCount: 38, sold: 430 },
  { slug: 'medjool-super-jumbo-1kg', name: 'Medjool Super Jumbo 1kg', name_bn: 'মেজদুল সুপার জাম্বো ১ কেজি', price: 2565, oldPrice: 2700, image: 'VVNLX1788236388-light-1000x1000.jpg', category: 'dates', subcategory: 'medjool', unit: '1 kg', badges: ['Premium'], rating: 4.9, reviewCount: 29, sold: 210 },
  { slug: 'ajwa-dates-500g-large', name: 'Ajwa Dates 500g Large', name_bn: 'আজওয়া খেজুর ৫০০ গ্রাম (বড়)', price: 1062, oldPrice: 1250, image: '3VEFg1771303741.webp', category: 'dates', subcategory: 'ajwa', unit: '500 g', rating: 4.7, reviewCount: 26, sold: 300 },
  { slug: 'sukkari-dates-1kg', name: 'Sukkari Dates 1kg', name_bn: 'সুক্কারি খেজুর ১ কেজি', price: 1400, oldPrice: 1500, image: 'VpK6Q1776762386.jpg', category: 'dates', subcategory: 'sukkari', unit: '1 kg', rating: 4.7, reviewCount: 44, sold: 390 },

  // Oil & Ghee
  { slug: 'gawa-ghee-1kg', name: 'Gawa Ghee 1kg', name_bn: 'গাওয়া ঘি ১ কেজি', price: 1890, oldPrice: 1990, image: 'pZqip1790829043-light-1000x1000.jpg', category: 'oil-ghee', subcategory: 'ghee', unit: '1 kg', badges: ['Best Selling'], top: true, featured: true, rating: 4.9, reviewCount: 206, sold: 1740 },
  { slug: 'deshi-mustard-oil-5-liter', name: 'Deshi Mustard Oil 5 liter', name_bn: 'দেশি সরিষার তেল ৫ লিটার', price: 1700, oldPrice: 1850, image: 'vkVdH1767248022.jpg', category: 'oil-ghee', subcategory: 'mustard-oil', unit: '5 L', badges: ['Best Selling'], top: true, rating: 4.8, reviewCount: 134, sold: 1200 },
  { slug: 'glarvest-olive-oil-1000ml', name: 'Glarvest Olive Oil 1000ml', name_bn: 'গ্লারভেস্ট অলিভ অয়েল ১০০০ মিলি', price: 2700, oldPrice: 2900, image: 'BZHUx1788773094-light-2000x2000.png', category: 'oil-ghee', subcategory: 'olive-oil', brand: 'Glarvest', unit: '1000 ml', featured: true, rating: 4.8, reviewCount: 68, sold: 560 },
  { slug: 'glarvest-olive-oil-500ml', name: 'Glarvest Olive Oil 500ml', name_bn: 'গ্লারভেস্ট অলিভ অয়েল ৫০০ মিলি', price: 1400, oldPrice: 1550, image: 'Nl9C61789057275-light-1000x1000.jpg', category: 'oil-ghee', subcategory: 'olive-oil', brand: 'Glarvest', unit: '500 ml', rating: 4.7, reviewCount: 51, sold: 490 },
  { slug: 'organic-coconut-oil-500ml', name: 'Organic Coconut Oil 500ml', name_bn: 'অর্গানিক নারকেল তেল ৫০০ মিলি', price: 1260, oldPrice: 1400, image: 'tPCCx1789400058-light-2000x2000.jpg', category: 'oil-ghee', subcategory: 'coconut-oil', unit: '500 ml', badges: ['Organic'], rating: 4.8, reviewCount: 39, sold: 350 },
  { slug: 'organic-coconut-oil-1l', name: 'Organic Coconut Oil 1L', name_bn: 'অর্গানিক নারকেল তেল ১ লিটার', price: 2080, oldPrice: 2250, image: 'AsZsn1790246426-light-2000x2000.jpg', category: 'oil-ghee', subcategory: 'coconut-oil', unit: '1 L', badges: ['Organic'], rating: 4.8, reviewCount: 33, sold: 290 },
  { slug: 'coconut-milk-400ml', name: 'Coconut Milk 400ml', name_bn: 'নারকেল দুধ ৪০০ মিলি', price: 350, oldPrice: 0, image: 'exdEw1789194925-light-1024x1024.jpeg', category: 'oil-ghee', subcategory: 'coconut-oil', unit: '400 ml', rating: 4.6, reviewCount: 22, sold: 260 },
  { slug: 'coconut-vinegar-500ml', name: 'Coconut Vinegar 500ml', name_bn: 'নারকেল ভিনেগার ৫০০ মিলি', price: 1065, oldPrice: 0, image: 'GHKMJ1772862114.png', category: 'oil-ghee', subcategory: 'vinegar', unit: '500 ml', rating: 4.6, reviewCount: 18, sold: 180 },
  { slug: 'discovery-apple-cider-vinegar-250ml', name: 'Discovery Apple Cider Vinegar 250ml', name_bn: 'ডিসকভারি অ্যাপল সাইডার ভিনেগার ২৫০ মিলি', price: 520, oldPrice: 0, image: 'TTSB61772525925.png', category: 'oil-ghee', subcategory: 'vinegar', unit: '250 ml', rating: 4.5, reviewCount: 26, sold: 240 },
  { slug: 'karkuma-apple-cider-vinegar-480ml', name: 'Karkuma Apple Cider Vinegar 480ml', name_bn: 'কারকুমা অ্যাপল সাইডার ভিনেগার ৪৮০ মিলি', price: 900, oldPrice: 0, image: 'nzvWc1767505402.jpg', category: 'oil-ghee', subcategory: 'vinegar', unit: '480 ml', rating: 4.6, reviewCount: 21, sold: 200 },
  { slug: 'coconut-sugar-200g', name: 'Coconut Sugar 200g', name_bn: 'নারকেল চিনি ২০০ গ্রাম', price: 650, oldPrice: 0, image: 'yEQlL1767517342.jpg', category: 'oil-ghee', subcategory: 'ghee', unit: '200 g', rating: 4.6, reviewCount: 14, sold: 150 },

  // Spices
  { slug: 'kala-bhuna-masala-500g', name: 'Kala Bhuna Masala 500g', name_bn: 'কালা ভুনা মসলা ৫০০ গ্রাম', price: 1400, oldPrice: 1500, image: '5e9Vi1787487618-light-1000x1000.jpg', category: 'spices', subcategory: 'mixed-spices', unit: '500 g', badges: ['Offered'], featured: true, rating: 4.8, reviewCount: 57, sold: 530 },
  { slug: 'kala-bhuna-masala-250g', name: 'Kala Bhuna Masala 250g', name_bn: 'কালা ভুনা মসলা ২৫০ গ্রাম', price: 700, oldPrice: 750, image: 'ABLDV1787487602-light-1000x1000.jpg', category: 'spices', subcategory: 'mixed-spices', unit: '250 g', rating: 4.7, reviewCount: 35, sold: 340 },
  { slug: 'cumin-powder-500g', name: 'Cumin Powder 500g', name_bn: 'জিরা গুঁড়া ৫০০ গ্রাম', price: 880, oldPrice: 0, image: 'kGxNK1787487507-light-1000x1000.jpg', category: 'spices', subcategory: 'basic-spices', unit: '500 g', rating: 4.7, reviewCount: 28, sold: 310 },
  { slug: 'shahi-masala-combo', name: 'Shahi Masala Combo', name_bn: 'শাহী মসলা কম্বো', price: 1445, oldPrice: 1700, image: 'Nly4i1767100328.jpg', category: 'spices', subcategory: 'mixed-spices', unit: 'Combo pack', badges: ['Best Selling'], top: true, rating: 4.8, reviewCount: 84, sold: 780 },
  { slug: 'panch-foron-50g', name: 'Panch Foron 50g', name_bn: 'পাঁচ ফোড়ন ৫০ গ্রাম', price: 30, oldPrice: 0, image: 'fn9f51778742184.png', category: 'spices', subcategory: 'whole-spices', unit: '50 g', rating: 4.5, reviewCount: 12, sold: 420 },
  { slug: 'turmeric-powder-250g', name: 'Turmeric Powder 250g', name_bn: 'হলুদ গুঁড়া ২৫০ গ্রাম', price: 180, oldPrice: 200, image: 'kGxNK1787487507-light-1000x1000.jpg', category: 'spices', subcategory: 'basic-spices', unit: '250 g', rating: 4.6, reviewCount: 31, sold: 510 },

  // Flours & Lentils
  { slug: 'mashkalai-dal-1kg', name: 'Mashkalai Dal 1kg', name_bn: 'মাষকলাই ডাল ১ কেজি', price: 300, oldPrice: 0, image: 'unBAY1767438328.jpg', category: 'flours-lentils', subcategory: 'lentils', unit: '1 kg', rating: 4.6, reviewCount: 24, sold: 380 },
  { slug: 'masoor-dal-1kg', name: 'Masoor Dal 1kg', name_bn: 'মসুর ডাল ১ কেজি', price: 170, oldPrice: 190, image: '52i8w1789300726-light-1000x1000.jpg', category: 'flours-lentils', subcategory: 'lentils', unit: '1 kg', featured: true, rating: 4.7, reviewCount: 42, sold: 640 },
  { slug: 'atta-flour-2kg', name: 'Whole Wheat Atta 2kg', name_bn: 'লাল আটা ২ কেজি', price: 140, oldPrice: 155, image: 'Lo11M1774766468.png', category: 'flours-lentils', subcategory: 'flours', unit: '2 kg', rating: 4.6, reviewCount: 33, sold: 580 },

  // Rice
  { slug: 'lal-chal-5kg', name: 'Lal Chal (Red Rice) 5kg', name_bn: 'লাল চাল ৫ কেজি', price: 675, oldPrice: 720, image: 'DA91S1777297562.jpg', category: 'rice', subcategory: 'rice', unit: '5 kg', featured: true, rating: 4.7, reviewCount: 45, sold: 660 },

  // Nuts & Seeds
  { slug: 'cashew-nuts-1kg', name: 'Cashew Nuts 1kg', name_bn: 'কাজু বাদাম ১ কেজি', price: 2000, oldPrice: 2200, image: 'xmShY1767096349.jpg', category: 'nuts-seeds', subcategory: 'nuts', unit: '1 kg', top: true, featured: true, rating: 4.8, reviewCount: 72, sold: 690 },
  { slug: 'almonds-1kg', name: 'Almonds 1kg', name_bn: 'কাঠবাদাম ১ কেজি', price: 1600, oldPrice: 1750, image: 'IvsiP1767095664.jpg', category: 'nuts-seeds', subcategory: 'nuts', unit: '1 kg', rating: 4.8, reviewCount: 64, sold: 610 },
  { slug: 'mixed-nuts-500g', name: 'Mixed Nuts 500g', name_bn: 'মিক্সড নাটস ৫০০ গ্রাম', price: 950, oldPrice: 1050, image: 'IvsiP1767095664.jpg', category: 'nuts-seeds', subcategory: 'nuts', unit: '500 g', rating: 4.7, reviewCount: 27, sold: 300 },

  // Functional food
  { slug: 'ashwagandha-powder-100g', name: 'Ashwagandha Powder 100g', name_bn: 'অশ্বগন্ধা পাউডার ১০০ গ্রাম', price: 600, oldPrice: 0, image: 'rubc61777091900.jpg', category: 'functional-food', subcategory: 'functional-food', unit: '100 g', badges: ['New Arrival'], featured: true, rating: 4.6, reviewCount: 19, sold: 210 },

  // Beverage
  { slug: 'premium-green-tea-200g', name: 'Premium Green Tea 200g', name_bn: 'প্রিমিয়াম গ্রিন টি ২০০ গ্রাম', price: 420, oldPrice: 480, image: 'premium-green-tea-200g.jpg', category: 'beverage', subcategory: 'tea', unit: '200 g', rating: 4.5, reviewCount: 17, sold: 190, externalImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop' },
  { slug: 'black-coffee-beans-500g', name: 'Black Coffee Beans 500g', name_bn: 'ব্ল্যাক কফি বিনস ৫০০ গ্রাম', price: 850, oldPrice: 950, image: 'black-coffee-beans-500g.jpg', category: 'beverage', subcategory: 'coffee', unit: '500 g', rating: 4.6, reviewCount: 23, sold: 240, externalImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop' },

  // Pickle
  { slug: 'mango-pickle-400g', name: 'Mango Pickle 400g', name_bn: 'আমের আচার ৪০০ গ্রাম', price: 320, oldPrice: 360, image: 'mango-pickle-400g.jpg', category: 'pickle', subcategory: 'pickle', unit: '400 g', rating: 4.6, reviewCount: 16, sold: 260, externalImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1000&auto=format&fit=crop' },

  // Showpiece
  { slug: '3-layer-wall-shelf', name: '3 layer wall shelf', name_bn: '৩ লেয়ার ওয়াল শেলফ', price: 1250, oldPrice: 1650, image: 'https://resellkori.com/wp-content/uploads/2025/08/1-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 12, sold: 86, externalImage: 'https://resellkori.com/wp-content/uploads/2025/08/1-300x300.jpg' },
  { slug: '3-tier-cylindrical-meshrechargable-led-table-lamp', name: '3- tier cylindrical meshrechargable Led table lamp', name_bn: '৩ টিয়ার সিলিন্ডার মেশ রিচার্জেবল এলইডি টেবিল ল্যাম্প', price: 1650, oldPrice: 2150, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-12-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 18, sold: 92, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-12-300x300.webp' },
  { slug: 'allah-crystal-showpiece', name: 'Allah Crystal Showpiece', name_bn: 'আল্লাহ ক্রিস্টাল শোপিস', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41689464075044-scaled-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.9, reviewCount: 24, sold: 134, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41689464075044-scaled-300x300.jpg' },
  { slug: 'butterfly-led-table-lamp', name: 'Butterfly LED table lamp', name_bn: 'বাটারফ্লাই এলইডি টেবিল ল্যাম্প', price: 1450, oldPrice: 1850, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-10-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 16, sold: 78, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-10-300x300.webp' },
  { slug: 'creative-alarm-clock', name: 'Creative Alarm Clock', name_bn: 'ক্রিয়েটিভ অ্যালার্ম ঘড়ি', price: 550, oldPrice: 750, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage21695638729111_0-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 21, sold: 156, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage21695638729111_0-300x300.jpg' },
  { slug: 'crystal-lotus-flower', name: 'Crystal Lotus Flower', name_bn: 'ক্রিস্টাল পদ্মফুল শোপিস', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage31689315327069-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 19, sold: 112, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage31689315327069-300x300.jpg' },
  { slug: 'crystal-mokkah-tower', name: 'Crystal Mokkah Tower', name_bn: 'ক্রিস্টাল মক্কা টাওয়ার শোপিস', price: 950, oldPrice: 1200, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41698679895489-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.9, reviewCount: 26, sold: 148, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41698679895489-300x300.jpg' },
  { slug: 'decorative-table-lamp', name: 'Decorative table lamp', name_bn: 'ডেকোরেটিভ টেবিল ল্যাম্প', price: 1350, oldPrice: 1750, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-9-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 14, sold: 84, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-9-300x300.webp' },
  { slug: 'eye-protection-night-light', name: 'Eye Protection Night Light 250mAh KD300 Burger Desk Eye Lamp', name_bn: 'আই প্রটেকশন নাইট লাইট বার্গার ডেক্স এল্যাম্প', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-8-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 17, sold: 96, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-8-300x300.webp' },
  { slug: 'flame-shaped-crystal-table-lamp', name: 'flame-shaped crystal table lamp', name_bn: 'ফ্লেম শেপড ক্রিস্টাল টেবিল ল্যাম্প', price: 1550, oldPrice: 1950, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-6-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 15, sold: 76, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-6-300x300.webp' },
  { slug: 'flowing-water-ornaments', name: 'Flowing Water Ornaments', name_bn: 'ফ্লোইং ওয়াটার অর্নামেন্টস শোপিস', price: 1450, oldPrice: 1850, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-37-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 13, sold: 68, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-37-300x300.jpg' },
  { slug: 'handcrafted-aluminium-wire-argentina-football-fan-bonsai-tree', name: 'Handcrafted Aluminium Wire Argentina Football Fan Bonsai Tree', name_bn: 'হ্যান্ডক্রাফটেড অ্যালুমিনিয়াম তার আর্জেন্টিনা বোনসাই গাছ', price: 950, oldPrice: 1250, image: 'https://resellkori.com/wp-content/uploads/2026/06/chatgpt-image-jun-11-2026-11-24-25-pm-2caa-1-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 11, sold: 74, externalImage: 'https://resellkori.com/wp-content/uploads/2026/06/chatgpt-image-jun-11-2026-11-24-25-pm-2caa-1-300x300.webp' },
  { slug: 'handcrafted-aluminium-wire-brazil-fan-world-cup-bonsai-tree', name: 'Handcrafted Aluminium Wire Brazil Fan World Cup Bonsai Tree', name_bn: 'হ্যান্ডক্রাফটেড অ্যালুমিনিয়াম তার ব্রাজিল বোনসাই গাছ', price: 950, oldPrice: 1250, image: 'https://resellkori.com/wp-content/uploads/2026/06/chatgpt-image-jun-11-2026-11-41-48-pm-f863-1-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 12, sold: 72, externalImage: 'https://resellkori.com/wp-content/uploads/2026/06/chatgpt-image-jun-11-2026-11-41-48-pm-f863-1-300x300.webp' },
  { slug: 'hariken-lamp-showpiece', name: 'Hariken lamp Showpiece', name_bn: 'হারিকেন ল্যাম্প শোপিস', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2024/12/1733758537241-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 16, sold: 94, externalImage: 'https://resellkori.com/wp-content/uploads/2024/12/1733758537241-300x300.jpg' },
  { slug: 'metal-globe', name: 'Metal Globe', name_bn: 'মেটাল গ্লোব শোপিস', price: 750, oldPrice: 950, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41686755397546-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 14, sold: 88, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41686755397546-300x300.jpg' },
  { slug: 'led-snow-globe', name: 'LED Snow Globe', name_bn: 'এলইডি স্নো গ্লোব', price: 950, oldPrice: 1200, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-5-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 18, sold: 95, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-5-300x300.webp' },
  { slug: 'resin-flower-vase', name: 'Resin Flower Vase', name_bn: 'রেজিন ফুলদানি', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2026/10/download-4-300x300.webp', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 16, sold: 88, externalImage: 'https://resellkori.com/wp-content/uploads/2026/10/download-4-300x300.webp' },
  { slug: 'crystal-elephant-showpiece', name: 'Crystal Elephant Showpiece', name_bn: 'ক্রিস্টাল হাতি শোপিস', price: 780, oldPrice: 950, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage31689315327069-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 20, sold: 110, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage31689315327069-300x300.jpg' },
  { slug: 'metal-towin-towers', name: 'Metal Towin Towers', name_bn: 'মেটাল টুইন টাওয়ার শোপিস', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11691670189774_0-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 15, sold: 82, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11691670189774_0-300x300.jpg' },
  { slug: 'motorcycle-alarm-clock', name: 'Motorcycle Alarm Clock', name_bn: 'মটরসাইকেল অ্যালার্ম ঘড়ি শোপিস', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11691427495985-1-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 18, sold: 104, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11691427495985-1-300x300.jpg' },
  { slug: 'moving-quicksand-art-3d-hourglass-lamp', name: 'Moving Quicksand Art 3D Hourglass Lamp', name_bn: 'মুভিং কুইক্স্যান্ড আর্ট ৩ডি আওয়ারগ্লাস ল্যাম্প', price: 1650, oldPrice: 2150, image: 'https://resellkori.com/wp-content/uploads/2026/05/61FRRwOlXnL._AC_-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.9, reviewCount: 22, sold: 118, externalImage: 'https://resellkori.com/wp-content/uploads/2026/05/61FRRwOlXnL._AC_-300x300.jpg' },
  { slug: 'peris-city', name: 'Peris city', name_bn: 'প্যারিস সিটি শোপিস', price: 950, oldPrice: 1200, image: 'https://resellkori.com/wp-content/uploads/2024/12/4e2d1b3b81158fd62c2406f0f67b8138-300x300-1.png', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 16, sold: 92, externalImage: 'https://resellkori.com/wp-content/uploads/2024/12/4e2d1b3b81158fd62c2406f0f67b8138-300x300-1.png' },
  { slug: 'rose-light-1pc', name: 'Rose Light 1pc', name_bn: 'গোলাপ লাইট শোপিস ১টি', price: 450, oldPrice: 650, image: 'https://resellkori.com/wp-content/uploads/2024/12/1733756220327-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 19, sold: 126, externalImage: 'https://resellkori.com/wp-content/uploads/2024/12/1733756220327-300x300.jpg' },
  { slug: 'telephone-alarm-clock', name: 'Telephone Alarm Clock', name_bn: 'টেলিফোন অ্যালার্ম ঘড়ি শোপিস', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41695237379269-1-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 21, sold: 98, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage41695237379269-1-300x300.jpg' },
  { slug: 'wall-calligraphy', name: 'Wall calligraphy', name_bn: 'ওয়াল ক্যালিগ্রাফি শোপিস', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2024/11/IMG-20241109-WA0010-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 17, sold: 86, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/IMG-20241109-WA0010-300x300.jpg' },
  { slug: 'omrah-saving-box-combo', name: 'ওমরাহ সেভিং বক্স COMBO', name_bn: 'ওমরাহ সেভিং বক্স কম্বো', price: 950, oldPrice: 1200, image: 'https://resellkori.com/wp-content/uploads/2026/08/IMG-20260816-WA0000-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.9, reviewCount: 14, sold: 92, externalImage: 'https://resellkori.com/wp-content/uploads/2026/08/IMG-20260816-WA0000-300x300.jpg' },
  { slug: 'walmet-diyale-jhuliye', name: 'ওয়ালমেট দেয়ালে ঝুলিয়ে রাখা', name_bn: 'ওয়ালমেট দেয়ালে ঝুলিয়ে রাখা', price: 750, oldPrice: 950, image: 'https://resellkori.com/wp-content/uploads/2026/03/1000022792-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 13, sold: 76, externalImage: 'https://resellkori.com/wp-content/uploads/2026/03/1000022792-300x300.jpg' },
  { slug: 'canvas-walmet', name: 'ক্যানভাস ওয়ালমেট', name_bn: 'ক্যানভাস ওয়ালমেট', price: 850, oldPrice: 1100, image: 'https://resellkori.com/wp-content/uploads/2026/03/1000022951-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 15, sold: 82, externalImage: 'https://resellkori.com/wp-content/uploads/2026/03/1000022951-300x300.jpg' },
  { slug: 'camping-lamp', name: 'ক্যাম্পিং ল্যাম্প', name_bn: 'ক্যাম্পিং ল্যাম্প', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11695669646776-1-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 12, sold: 68, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11695669646776-1-300x300.jpg' },
  { slug: 'grill-hanger', name: 'গ্রিল হ্যাঙ্গার', name_bn: 'গ্রিল হ্যাঙ্গার', price: 550, oldPrice: 750, image: 'https://resellkori.com/wp-content/uploads/2025/01/Screenshot_20241030-174627-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.6, reviewCount: 11, sold: 64, externalImage: 'https://resellkori.com/wp-content/uploads/2025/01/Screenshot_20241030-174627-300x300.jpg' },
  { slug: 'stylish-alarm-clock', name: 'স্টাইলিশ অ্যালার্ম ঘড়ি', name_bn: 'স্টাইলিশ অ্যালার্ম ঘড়ি', price: 650, oldPrice: 850, image: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11690646848846_1-300x300.jpg', category: 'showpiece', subcategory: 'showpiece', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 16, sold: 92, externalImage: 'https://resellkori.com/wp-content/uploads/2024/11/pimage11690646848846_1-300x300.jpg' },
  // Shoes & Bags
  { slug: 'sneakers', name: 'Sneakers', name_bn: 'স্নিকার্স', price: 1850, oldPrice: 2450, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop', category: 'shoes-bags', subcategory: 'shoes', unit: 'pair', badges: ['Sale'], rating: 4.8, reviewCount: 67, sold: 320, externalImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop' },
  { slug: 'leather-shoes', name: 'Leather Shoes', name_bn: 'চামড়ার জুতা', price: 2450, oldPrice: 2950, image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1000&auto=format&fit=crop', category: 'shoes-bags', subcategory: 'shoes', unit: 'pair', badges: ['Sale'], rating: 4.8, reviewCount: 54, sold: 280, externalImage: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1000&auto=format&fit=crop' },
  { slug: 'backpack', name: 'Backpack', name_bn: 'ব্যাকপ্যাক', price: 1250, oldPrice: 1650, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop', category: 'shoes-bags', subcategory: 'bags', unit: 'pcs', badges: ['Sale'], rating: 4.7, reviewCount: 76, sold: 390, externalImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop' },
  { slug: 'handbag', name: 'Handbag', name_bn: 'হ্যান্ডব্যাগ', price: 1650, oldPrice: 2150, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', category: 'shoes-bags', subcategory: 'bags', unit: 'pcs', badges: ['Sale'], rating: 4.8, reviewCount: 62, sold: 310, externalImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop' },
]

export const products = rawProducts.map((item, index) => {
  const copy = categoryCopy[item.category] || categoryCopy.honey
  const image = item.externalImage || productImage(item.image)
  return {
    id: index + 1,
    slug: item.slug,
    name: item.name,
    name_bn: item.name_bn,
    price: item.price,
    oldPrice: item.oldPrice || 0,
    image,
    gallery: item.gallery || [image],
    category: item.category,
    subcategory: item.subcategory,
    brand: item.brand || '',
    unit: item.unit || '',
    badges: item.badges || [],
    stock: item.stock ?? 12 + ((index * 7) % 40),
    sold: item.sold || 0,
    rating: item.rating || 4.7,
    reviewCount: item.reviewCount || 0,
    featured: Boolean(item.featured),
    topSelling: Boolean(item.top),
    tags: [item.name, item.category, item.subcategory, item.brand || '', item.unit].filter(Boolean)
      .filter(Boolean)
      .map((tag) => String(tag).toLowerCase()),
    short: copy.short,
    short_bn: copy.short_bn,
    description: copy.description,
    description_bn: copy.description_bn,
    features: copy.features,
    features_bn: copy.features_bn,
    createdAt: new Date(2026, 0, 1 + index).toISOString(),
  }
})

export const getCategory = (slug) => categories.find((category) => category.slug === slug)
export const getSubcategory = (categorySlug, subSlug) => {
  const category = getCategory(categorySlug)
  return category?.children.find((child) => child.slug === subSlug)
}
export const getBrand = (slug) => brands.find((brand) => brand.slug === slug)
export const discountPercent = (product) =>
  product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

export const coupons = [
  { code: 'GB100', type: 'flat', value: 100, min: 1000, label: '৳100 off on orders over ৳1,000' },
  { code: 'NEW10', type: 'percent', value: 10, min: 1500, label: '10% off for new customers' },
  { code: 'FREESHIP', type: 'shipping', value: 0, min: 2000, label: 'Free delivery over ৳2,000' },
]
