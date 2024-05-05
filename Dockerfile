# استخدام صورة Debian الأساسية
FROM debian:latest

# تحديث الحزم
RUN apt-get update

# تثبيت Node.js و npm
RUN apt-get install -y nodejs npm

# حذف الحزم الزائدة وتنظيف الذاكرة المؤقتة
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# إنشاء مجلد في داخل الصورة ونقل المشروع من GitHub إليه
WORKDIR /usr/src/app
COPY . .

# تثبيت التبعيات باستخدام npm
RUN npm install

# تشغيل التطبيق
CMD ["npm", "start"]