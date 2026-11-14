# Supabase সেটআপ গাইড (বাংলা)

> ✅ **এই প্রজেক্টে সেটআপ ইতিমধ্যে সম্পন্ন।**
> - Project: `e-shop` — ref `agfvtgzmhzuxuaetfinv` (Singapore)
> - Dashboard: https://supabase.com/dashboard/project/agfvtgzmhzuxuaetfinv
> - URL ও anon key Vercel-এর Environment Variables-এ বসানো আছে (Production/Preview/Development)
> - `store` টেবিল, RLS policy ও realtime চালু; লাইভে দুই ব্রাউজারে সিঙ্ক টেস্ট করা হয়েছে
> - অ্যাডমিন লগইন এখন **Supabase Auth** দিয়ে: `admin@shoeshop.com` — পাসওয়ার্ড `.secrets/admin-password.txt`-এ
> - RLS: সাইট কনটেন্ট/প্রোডাক্ট/ক্যাটাগরি শুধু লগইন করা অ্যাডমিন লিখতে পারে; গেস্ট অর্ডার, রিভিউ ও রেজিস্ট্রেশন আগের মতোই কাজ করে
> - ডাটাবেস পাসওয়ার্ড লোকাল `.secrets/supabase-db-password.txt`-এ রাখা আছে (Git-এ যায় না)
>
> নিচের গাইডটি শুধু রেফারেন্সের জন্য — নতুন প্রজেক্ট বানাতে চাইলে বা সেটআপ বুঝতে কাজে লাগবে।

এই গাইড ফলো করলে অ্যাডমিন প্যানেলের সব পরিবর্তন **সব ডিভাইসে লাইভ** দেখাবে (শুধু আপনার ব্রাউজারে সেভ থাকবে না)।

> আগে কোডে Supabase ইন্টিগ্রেশন রেডি করা আছে। শুধু নিচের ২টি কাজ বাকি:
> ১) Supabase-এ ফ্রি প্রজেক্ট + ডাটাবেস টেবিল তৈরি
> ২) Vercel-এ ২টি Environment Variable বসানো

---

## ধাপ ১ — Supabase অ্যাকাউন্ট ও প্রজেক্ট তৈরি

1. ব্রাউজারে যান: **https://supabase.com** → উপরে ডানদিকে **Start your project**।
2. **GitHub** দিয়ে সাইন ইন করুন (সহজ) অথবা ইমেইল দিয়ে সাইন আপ করুন।
3. ড্যাশবোর্ডে **New project** বাটনে ক্লিক করুন।
4. ফর্মটি এভাবে পূরণ করুন:
   - **Organization:** ডিফল্ট রাখতে পারেন
   - **Name:** `e-shop`
   - **Database Password:** একটি শক্ত পাসওয়ার্ড দিন → **অবশ্যই কোথাও লিখে রাখুন**
   - **Region:** **Southeast Asia (Singapore)** (বাংলাদেশের জন্য সবচেয়ে কাছ)
   - **Plan:** Free
5. **Create new project** ক্লিক করুন। ১–২ মিনিট লাগবে, অপেক্ষা করুন।

---

## ধাপ ২ — ডাটাবেস টেবিল তৈরি (SQL)

1. প্রজেক্ট খোলার পর বাঁ দিকের মেনু থেকে **SQL Editor** এ যান।
2. **New query** ক্লিক করুন।
3. এই রিপোর `supabase/schema.sql` ফাইলের **পুরো কোড** কপি করে পেস্ট করুন।
4. নিচে ডানদিকে **Run** বাটনে ক্লিক করুন।
5. নিশ্চিত হন উপরে **Success. No rows returned** দেখাচ্ছে।
6. আবার **New query** নিয়ে `supabase/security-v2.sql` ফাইলের পুরো কোড পেস্ট করে **Run** করুন।
   এতে আলাদা `orders` ও `reviews` টেবিল, গেস্ট অর্ডার-ট্র্যাকিং RPC এবং ছবির `media`
   স্টোরেজ তৈরি হবে। দুটো ফাইলই বারবার চালানো নিরাপদ।

এতে `store` নামে একটি টেবিল, তার permission policy এবং realtime sync চালু হয়ে যাবে।

> ⚠️ আগে শুধু `schema.sql` চালানো থাকলে এখন অবশ্যই `security-v2.sql`-ও একবার চালান।
> এটি না চালালে নতুন অর্ডার ক্লাউডে সেভ হবে না (সাইট লোকালি তবুও চলবে)।

> ✔ চেক করতে: বাঁ মেনু → **Table Editor** → `store` টেবিল দেখা যাবে (এখন খালি থাকবে)।

---

## ধাপ ৩ — API Key কপি করুন

1. বাঁ মেনু থেকে **Project Settings** (গিয়ার আইকন) → **API**।
2. এই ২টি মান কপি করুন:
   - **Project URL** → যেমন `https://abcdefghijk.supabase.co`
   - **anon public** key → লম্বা `eyJ...` দিয়ে শুরু হওয়া কোড
3. ⚠️ **service_role** key কখনো ব্যবহার করবেন না — সেটা গোপন।

---

## ধাপ ৪ — Vercel-এ Key বসান

1. যান: **https://vercel.com/dashboard** → আপনার `e-shop` প্রজেক্ট খুলুন।
2. **Settings** → বাঁ দিকের মেনু **Environment Variables**।
3. দুটি ভ্যারিয়েবল যোগ করুন (Name / Value):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | আপনার **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | আপনার **anon public** key |

4. প্রতিটি ক্ষেত্রে Environment হিসেবে **Production, Preview, Development** তিনটাই টিক দিন।
5. **Save** করুন।

---

## ধাপ ৫ — Redeploy (জরুরি)

Environment variable যোগ করার পর পুরনো deploy-এ সেটা থাকে না। তাই:

1. Vercel প্রজেক্ট → **Deployments** ট্যাব।
2. সবচেয়ে উপরের deployment-এর ডানদিকের **⋯** → **Redeploy** → **Redeploy**।
3. ১–২ মিনিট পর সাইট খুলে **Ctrl + F5** দিন।

---

## ধাপ ৬ — টেস্ট করুন

1. **https://e-shop-peach-rho-49.vercel.app/admin** → লগইন করুন।
2. Site Content থেকে সাইটের নাম বা কোনো ছবি বদলান → Save।
3. অন্য একটি ব্রাউজার বা **Incognito উইন্ডো**তে সাইট খুলুন (অথবা মোবাইলে)।
4. পরিবর্তন দেখা যাবে ✅ — লগইন ছাড়াই।

> খোলা ট্যাব থাকলে Supabase Realtime-এর কারণে কয়েক সেকেন্ডের মধ্যে নিজেই আপডেট হবে, রিফ্রেশ লাগবে না।

---

## প্রথমবার ডাটা ওঠানো (একবারই)

- ডিফল্টভাবে ব্রাউজারের ক্যাশ ক্লাউডে আপলোড হয় না। অ্যাডমিন প্যানেল থেকে যা সেভ করবেন
  শুধু সেটাই Supabase-এ যায়।
- ডেমো প্রোডাক্ট দরকার হলে **Admin → Products → Import from Catalog** চাপুন।
- ছবি আপলোড করলে সেটি সরাসরি `media` বাকেটে যায়; পুরনো base64 ছবি একবারে সরাতে
  **Admin → Site Content → Move images to Storage** ব্যবহার করুন।

---

## সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| পরিবর্তন অন্য ডিভাইসে যাচ্ছে না | Vercel-এ Redeploy করেছেন কি? ব্রাউজারে Ctrl+F5 |
| কনসোলে `[supabase]` warning | URL/key ভুল বা টেবিল/Policy তৈরি হয়নি — ধাপ ২ ও ৩ আবার দেখুন |
| কিছুই কাজ করছে না | Vercel থেকে দুইটি env variable মুছে Redeploy দিলে সাইট আগের মতো localStorage-এ চলবে |
| ফ্রি প্রজেক্ট pause | ৭ দিন একদম ব্যবহার না হলে Supabase pause করে; ড্যাশবোর্ড থেকে Restore করবেন |

---

## নিরাপত্তা — এখন যা চালু আছে

### অ্যাডমিন লগইন (Supabase Auth)
- অ্যাডমিন ইমেইল: `admin@shoeshop.com`
- পাসওয়ার্ড: `.secrets/admin-password.txt` (GitHub-এ নেই)
- পাসওয়ার্ড বদলাতে: Supabase Dashboard → **Authentication → Users** → ইউজার → **Update password**
- এই ইউজারের `app_metadata`-এ `{"role":"admin"}` আছে — এটাই তাকে কনটেন্ট লেখার অনুমতি দেয়

### ডাটাবেসে কী কে লিখতে পারে (RLS)
| টেবিল | পড়া | লেখা |
|---|---|---|
| `store` (`settings`, `products`, `categories`, `brands`, `pages`) | সবাই | শুধু লগইন করা অ্যাডমিন |
| `orders` | অ্যাডমিন (গেস্ট শুধু id + ফোন দিয়ে `track_order` RPC) | গেস্ট শুধু নতুন `Pending` অর্ডার; বদলানো/মুছানো শুধু অ্যাডমিন |
| `reviews` | সবাই | গেস্ট নতুন রিভিউ; এডিট/ডিলিট শুধু অ্যাডমিন |
| `users` (কাস্টমার অ্যাকাউন্ট) | শুধু নিজের ডিভাইস | শুধু নিজের ডিভাইস |

- `anon` key দিয়ে কেউ সাইট কনটেন্ট বা অন্য কারো অর্ডার বদলাতে পারবে না — Supabase সরাসরি ০ row আপডেট করে।
- পুরনো `store`-এর `orders`/`users`/`reviews` jsonb রো `security-v2.sql` নিজেই মুছে দেয়, তাই প্লেইনটেক্সট পাসওয়ার্ড আর ক্লাউডে থাকে না।
- ছবি এখন `media` বাকেটে যায় (পাবলিক পড়া, অ্যাডমিন লেখা)। পুরনো base64 ছবি সরাতে
  **Admin → Site Content → Image storage cleanup → Move images to Storage** চাপুন।
- অ্যাডমিন লগইন ছাড়া শুধু localStorage-এ `role: admin` বসিয়ে অ্যাডমিন প্যানেলে ঢোকা যায় না — সেশন না থাকলে অ্যাপ নিজেই লগআউট করে দেয়।

### এখনও যা লোকাল
- কাস্টমার অ্যাকাউন্ট (রেজিস্ট্রেশন/লগইন) এখনো লোকালস্টোরেজভিত্তিক; চাইলে পরে Supabase Auth-এ মাইগ্রেট করা যাবে।
- `AdminStaff` থেকে বানানো স্টাফ অ্যাকাউন্ট Supabase Auth-এ থাকে না, তাই তারা ক্লাউডে লিখতে পারবে না। স্টাফ লাগলে Supabase Auth-এ একই ইমেইলে ইউজার বানিয়ে `app_metadata.role = admin` দিতে হবে।

> নতুন করে ডাটাবেস বানালে `schema.sql` চালানোর পর অবশ্যই উপরের `role: admin` সহ অ্যাডমিন Auth ইউজারটি তৈরি করবেন, নাহলে কনটেন্ট সেভ হবে না।
