</div>

# Game Card Design Tool

---

### 🌐 English

## Description
The Game Card Design Tool is an innovative and professional web application that enables users to design and create custom game cards in SVG format with ease and creativity. The application provides an intuitive graphical user interface that allows for complete control over every detail of the design, from dimensions and layout to colors, fonts, images, and text. Whether you are a game developer looking for unique designs for your cards, or a designer wanting to unleash your imagination, this tool provides everything you need to produce attractive, high-quality cards.


## Features
*   **🎨 Comprehensive Customization:** Full control over all card elements, including colors, gradients, text, icons, and card dimensions.
*   **🖼️ Custom Image Upload:** Add your personal touch by uploading your own images to use as the card's background or main image.
*   **✍️ Font Management:** Choose from a variety of built-in fonts, or upload your own custom fonts (TTF, OTF, WOFF, WOFF2) to use in your design.
*   **🔄 Live Preview:** Watch your changes reflect directly on the card design in real-time, making the design process easier and more interactive.
*   **📐 Multiple Layouts:** Choose between vertical or horizontal card layouts, with the ability to modify templates to suit your needs.
*   **💾 Import and Export Themes:** Save your custom designs as JSON files and import them later to continue working on them or share them with others.
*   **⬇️ SVG & PNG Export:** Export the final design as a clean, high-quality SVG or PNG file. You can also export individual assets like the button or the card without the button, and download all assets in a ZIP archive.
*   **💡 Easy User Interface:** A simple and clear design focused on the user experience, making the card creation process enjoyable and fast.
*   **⚙️ Advanced Settings:** Control interface settings such as theme (dark/light) and UI scale for a comfortable working experience.

---

### 🐪 العربية (Arabic)
<div dir="rtl">

## الوصف
أداة تصميم بطاقات الألعاب هي تطبيق ويب مبتكر واحترافي يُمكّن المستخدمين من تصميم وإنشاء بطاقات ألعاب مخصصة بصيغة SVG بكل سهولة وإبداع. يوفر التطبيق واجهة مستخدم رسومية بديهية تتيح التحكم الكامل في كل تفاصيل التصميم، بدءًا من الأبعاد والتخطيط، ومرورًا بالألوان والخطوط، وانتهاءً بالصور والنصوص. سواء كنت مطور ألعاب تبحث عن تصميمات فريدة لبطاقاتك، أو مصممًا يرغب في إطلاق العنان لخياله، فإن هذه الأداة توفر لك كل ما تحتاجه لإنتاج بطاقات جذابة وعالية الجودة.

## المميزات
*   **🎨 تخصيص شامل:** تحكم كامل في جميع عناصر البطاقة، بما في ذلك الألوان، التدرجات اللونية، النصوص، الأيقونات، وأبعاد البطاقة.
*   **🖼️ رفع الصور المخصص:** أضف لمستك الشخصية عن طريق رفع صورك الخاصة لاستخدامها كخلفية للبطاقة أو كصورة رئيسية.
*   **✍️ إدارة الخطوط:** اختر من بين مجموعة متنوعة من الخطوط المدمجة، أو قم برفع خطوطك الخاصة (TTF, OTF, WOFF, WOFF2) لاستخدامها في التصميم.
*   **🔄 معاينة حية:** شاهد تعديلاتك تنعكس مباشرة على تصميم البطاقة في الوقت الفعلي، مما يسهل عملية التصميم ويجعلها أكثر تفاعلية.
*   **📐 تخطيطات متعددة:** اختر بين التخطيط العمودي أو الأفقي للبطاقة، مع إمكانية تعديل القوالب لتناسب احتياجاتك.
*   **💾 استيراد وتصدير السمات:** قم بحفظ تصميماتك المخصصة كملفات JSON، واستوردها لاحقًا لمواصلة العمل عليها أو مشاركتها مع الآخرين.
*   **⬇️ تصدير بصيغة SVG و PNG:** قم بتصدير التصميم النهائي كملف SVG أو PNG نظيف وعالي الجودة، بالإضافة إلى إمكانية تصدير زر الدعوة لاتخاذ إجراء (CTA) بشكل منفصل أو تجميع كل الأصول في ملف ZIP.
*   **💡 واجهة مستخدم سهلة:** تصميم بسيط وواضح يركز على تجربة المستخدم، مما يجعل عملية إنشاء البطاقات ممتعة وسريعة.
*   **⚙️ إعدادات متقدمة:** تحكم في إعدادات الواجهة مثل المظهر (داكن/فاتح) ومقياس الواجهة لتجربة عمل مريحة.

</div>

---

## 🛠️ Technical Documentation

### Project Overview
This is a responsive, single-page application built with **React** and **TypeScript**, powered by the **Vite** development server. It allows users to create highly customizable SVG-based game cards through a user-friendly interface. The application state is managed reactively using custom React hooks, and it features a robust theme import/export system that utilizes the browser's `localStorage` to persist user-imported themes.

### Running Locally

#### Prerequisites
*   **Node.js:** v18.x or later is recommended.
*   **npm:** v8.x or later is recommended. You can check your versions with `node -v` and `npm -v`.

#### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    This project uses `npm` for package management. Run the following command in the root directory to install all required dependencies from `package.json`:
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    This application can use a `.env.local` file for environment variables. While not strictly required for the application to run, it is good practice to create it.
    ```bash
    touch .env.local
    ```
    The application code includes a reference to `GEMINI_API_KEY`. If you plan to extend the app with AI features in the future, you can add your key here:
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    *Note: For Vite projects, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.*

4.  **Run the development server:**
    This command starts the Vite development server, which provides an excellent development experience with Hot Module Replacement (HMR).
    ```bash
    npm run dev
    ```
    The application will be accessible at **http://localhost:3000** by default.

### Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode with hot-reloading.
*   `npm run build`: Bundles the app for production into the `dist` folder. It correctly handles asset optimization and tree-shaking.
*   `npm run preview`: Serves the production build from the `dist` folder locally. This is a great way to check the final bundle before deploying.


### Project Structure
```
/
├── public/               # Static assets (e.g., favicons)
├── src/
│   ├── components/       # Reusable React components (UI elements, panels, etc.)
│   │   ├── controls/     # Atomic input controls (ColorInput, NumberInput, etc.)
│   │   └── panel-tabs/   # Components for the main control panel tabs
│   ├── hooks/            # Custom React hooks for state management (useAppSettings, useCardConfig)
│   ├── utils/            # Utility functions (color manipulation, file exports, validation)
│   ├── App.tsx           # Main application component, orchestrating all other components
│   ├── index.tsx         # The entry point of the React application
│   ├── themes.ts         # Contains the pre-defined, default theme configurations
│   └── types.ts          # Centralized TypeScript type definitions and interfaces
├── .gitignore            # Files and folders to be ignored by Git
├── package.json          # Project dependencies, scripts, and metadata
└── README.md             # This file
```
