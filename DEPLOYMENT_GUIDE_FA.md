# راهنمای جامع راه‌اندازی برنامه و پایگاه‌داده روی سرور شخصی (Self-Hosted)

این برنامه به گونه‌ای طراحی و پیاده‌سازی شده است که به صورت **کامل، مستقل و یکپارچه (Full-Stack)** همراه با **وب‌سایت و پایگاه‌داده اختصاصی** روی هر سرور شخصی، سرور مجازی (VPS)، یا سیستم محلی اجرا می‌شود و هیچ نیازی به وابستگی به سرویس‌های ابری خارجی ندارد.

---

## ۱. ساختار پایگاه‌داده روی سرور شما
پایگاه‌داده برنامه در مسیر زیر ذخیره و نگهداری می‌شود:
```text
./data/toyland_database.json
```
این پایگاه‌داده به صورت خودکار با اطلاعات اولیه راه‌اندازی می‌شود و هرگونه تغییر در محصولات، پادکست‌ها، نظرات کاربران، آمار بازدید و پیام‌های تماس با دقت بالا و به شکل امن بر روی هارد دیسک سرور شما ذخیره می‌گردد.

---

## ۲. روش اول: اجرا با Docker و Docker Compose (ساده‌ترین و سریع‌ترین روش)

اگر روی سرور شما داکر نصب است، تنها با اجرای دو دستور زیر برنامه و دیتابیس بالا می‌آیند:

```bash
# ۱. کلون یا کپی کردن فایل‌های پروژه روی سرور
cd toyland

# ۲. ساخت ایمیج و اجرای کانتینر
docker compose up -d --build
```

- برنامه بلافاصله روی پورت `3000` در دسترس خواهد بود (`http://YOUR_SERVER_IP:3000`).
- دایرکتوری `./data` روی هارد سرور به کانتینر متصل شده و تمامی اطلاعات دیتابیس همیشه حفظ می‌ماند.

---

## ۳. روش دوم: اجرای مستقیم با Node.js و PM2 (روی سرور لینوکس/اوبونتو)

### مرحله اول: نصب پیش‌نیازها
```bash
# نصب نود نسخه 20 یا بالاتر
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# نصب مدیر پروسه PM2
sudo npm install -g pm2
```

### مرحله دوم: بیلد و اجرای برنامه
```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. بیلد فرانت‌اند و سرور بک‌اند
npm run build

# ۳. اجرای دائم سرور با PM2
pm2 start dist/server.cjs --name "toyland-server"
pm2 save
pm2 startup
```

---

## ۴. تنظیم دامنه و SSL با Nginx و Certbot (اختیاری برای داشتن HTTPS)

یک فایل کانفیگ در مسیر `/etc/nginx/sites-available/toyland` ایجاد کنید:

```nginx
server {
    server_name yourdomain.ir www.yourdomain.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعال‌سازی و دریافت گواهی رایگان SSL:
```bash
sudo ln -s /etc/nginx/sites-available/toyland /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.ir -d www.yourdomain.ir
```

---

## ۵. پشتیبان‌گیری و بازیابی داده‌ها (Backup & Restore)
شما می‌توانید در هر زمان:
1. فایل `./data/toyland_database.json` را مستقیماً دانلود و نگهداری کنید.
2. از داخل پنل ادمین برنامه، روی دکمه «دریافت نسخه پشتیبان (JSON)» کلیک کنید تا تمام دیتابیس روی سیستم‌تان دانلود شود.
3. با دکمه «بارگذاری نسخه پشتیبان»، دیتابیس را به راحتی به هر سرور دیگری منتقل نمایید.
