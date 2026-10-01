/**
 * AI COFFEE SHOP — MASTER RESPONSIVE SCRIPT
 * Features:
 *  1. Dynamic Color Page Theming (Blue, Coffee Amber, Forest Emerald, Royal Violet, Sunset Rose)
 *  2. Multi-Language Switcher & i18n Translation (English, Khmer, French, Chinese)
 *  3. Mobile Hamburger Navigation Drawer
 *  4. Active Nav Link Detection
 *  5. Real-Time Shopping Cart Counter Badge
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. THEMES DEFINITION & CONTROLLER
  // ==========================================================================
  const THEMES = [
    { id: 'blue', name: 'Ocean Blue', color: '#38bdf8', icon: '🔵' },
    { id: 'coffee', name: 'Warm Amber', color: '#e8a05a', icon: '☕' },
    { id: 'emerald', name: 'Forest Emerald', color: '#10b981', icon: '🟢' },
    { id: 'purple', name: 'Royal Violet', color: '#a855f7', icon: '🟣' },
    { id: 'sunset', name: 'Sunset Rose', color: '#f43f5e', icon: '🔴' }
  ];

  function getActiveTheme() {
    return localStorage.getItem('coffee_shop_theme') || 'blue';
  }

  function setTheme(themeId) {
    const valid = THEMES.some(t => t.id === themeId);
    const theme = valid ? themeId : 'blue';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coffee_shop_theme', theme);

    // Update UI states
    const dot = document.querySelector('.theme-current-dot');
    const matched = THEMES.find(t => t.id === theme);
    if (dot && matched) {
      dot.style.background = matched.color;
      dot.style.boxShadow = `0 0 6px ${matched.color}`;
    }

    document.querySelectorAll('.theme-opt-item, .mobile-theme-swatch').forEach(el => {
      const isTarget = el.getAttribute('data-theme-val') === theme;
      el.classList.toggle('active', isTarget);
    });

    window.dispatchEvent(new CustomEvent('coffee_theme_changed', { detail: { theme } }));
  }

  // Set theme immediately to prevent FOUC
  document.documentElement.setAttribute('data-theme', getActiveTheme());

  // ==========================================================================
  // 2. MULTI-LANGUAGE (i18n) DICTIONARY & CONTROLLER
  // ==========================================================================
  const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'km', label: 'ភាសាខ្មែរ', flag: '🇰🇭', short: 'ខ្មែរ' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
    { code: 'zh', label: '中文', flag: '🇨🇳', short: '中文' }
  ];

  const TRANSLATIONS = {
    en: {
      // Navigation
      nav_home: 'Home',
      nav_menu: 'Menu',
      nav_cart: 'Cart',
      nav_orders: 'My Orders',
      nav_feedback: 'Feedback',
      nav_profile: 'Profile',
      nav_admin: 'Admin',
      nav_signin: 'Sign In',
      nav_signup: 'Sign Up',
      nav_logout: 'Log Out',

      // Settings
      settings_lang: 'Language',
      settings_theme: 'Color Theme',

      // Common Buttons & Actions
      btn_explore_menu: 'Explore Menu',
      btn_order_online: 'Order Online →',
      btn_add_to_cart: 'Add to Cart',
      btn_customize: 'Customize & Order',
      btn_checkout: 'Proceed to Checkout',
      btn_back_menu: '← Back to Menu',
      btn_apply: 'Apply',
      btn_save: 'Save Changes',
      btn_submit: 'Submit',
      btn_search: 'Search',
      btn_filter: 'Filter',
      btn_add_item: '➕ Add New Product',
      modal_add_item_title: 'Add New Product Item',
      btn_custom_extra: '+ Custom Extra',
      toast_item_created: 'New product added to menu successfully!',

      // Hero Section
      hero_badge: '✨ Fresh Roasts Daily · 100% Organic',
      hero_title_1: 'Artisanal Coffee,',
      hero_title_2: 'Brewed to Perfection',
      hero_desc: 'Experience ethically sourced specialty beans, handcrafted lattes, cold brews, and oven-fresh pastries tailored to your taste.',

      // Features Strip
      feat_ethical_title: 'Ethical Sourcing',
      feat_ethical_desc: 'Direct-trade organic beans',
      feat_craft_title: 'Master Baristas',
      feat_craft_desc: 'Handcrafted coffee art',
      feat_fresh_title: 'Fresh Bakery',
      feat_fresh_desc: 'Baked fresh daily',
      feat_delivery_title: 'Express Delivery',
      feat_delivery_desc: 'Warm & prompt to door',

      // Categories
      cat_all: 'All Items',
      cat_hot: 'Hot Coffee',
      cat_cold: 'Cold & Iced Drinks',
      cat_food: 'Food & Pastries',

      // Process & About
      process_badge: 'Our Craft',
      process_title: 'How We Brew',
      process_sub: 'Simple, transparent, and refined from cherry to cup.',
      step_1_title: '1. Select Beans',
      step_1_desc: 'Carefully chosen organic harvests from premier estates.',
      step_2_title: '2. Precision Roast',
      step_2_desc: 'Custom heat profiles to unlock natural florals and caramel.',
      step_3_title: '3. Handcrafted Pour',
      step_3_desc: 'Expertly brewed by master baristas with filtered minerals.',
      step_4_title: '4. Enjoy Every Sip',
      step_4_desc: 'Served fresh at our café or delivered directly to you.',

      about_badge: 'Our Story',
      about_title: 'Passionate About Every Single Bean',
      about_desc: 'Founded with a mission to bring modern artisanal coffee culture to our community. Every sip tells a tale of mindful roasting, precise water profiling, and genuine dedication to the barista craft.',
      stat_varieties: 'Coffee Blends',
      stat_roasts: 'Artisan Roasts',
      stat_happy: 'Happy Patrons',

      // General Page Elements
      page_menu_title: 'Artisanal Menu',
      page_menu_sub: 'Handcrafted beverages, single-origin roasts, and oven-fresh bakery items.',
      search_placeholder: 'Search delicious coffee, drinks, or bakery...',
      cart_title: 'Your Cart',
      cart_summary: 'Order Summary',
      cart_subtotal: 'Subtotal',
      cart_tax: 'Tax (8%)',
      cart_shipping: 'Delivery',
      cart_total: 'Total',
      cart_empty: 'Your cart is currently empty.',
      order_confirmed_title: 'Order Confirmed!',
      order_confirmed_sub: 'Thank you for your order! Our baristas are preparing your beverage.',
      feedback_title: 'Customer Feedback',
      feedback_sub: 'We value your experience. Help us serve you better with your review.'
    },

    km: {
      // Navigation
      nav_home: 'ទំព័រដើម',
      nav_menu: 'ម៉ឺនុយ',
      nav_cart: 'កន្ត្រក',
      nav_orders: 'ការបញ្ជាទិញ',
      nav_feedback: 'មតិកែលម្អ',
      nav_profile: 'គណនី',
      nav_admin: 'គ្រប់គ្រង',
      nav_signin: 'ចូលគណនី',
      nav_signup: 'ចុះឈ្មោះ',
      nav_logout: 'ចាកចេញ',

      // Settings
      settings_lang: 'ភាសា',
      settings_theme: 'ពណ៌ទំព័រ',

      // Common Buttons & Actions
      btn_explore_menu: 'មើលម៉ឺនុយ',
      btn_order_online: 'កុម្ម៉ង់ឥឡូវនេះ →',
      btn_add_to_cart: 'ដាក់ក្នុងកន្ត្រក',
      btn_customize: 'កែប្រែ & កុម្ម៉ង់',
      btn_checkout: 'បន្តទៅការទូទាត់',
      btn_back_menu: '← ត្រឡប់ទៅម៉ឺនុយ',
      btn_apply: 'អនុវត្ត',
      btn_save: 'រក្សាទុកការកែប្រែ',
      btn_submit: 'ផ្ញើមតិ',
      btn_search: 'ស្វែងរក',
      btn_filter: 'ច្រោះ',
      btn_add_item: '➕ បន្ថែមទំនិញថ្មី',
      modal_add_item_title: 'បន្ថែមទំនិញកាហ្វេ/ម្ហូបថ្មី',
      btn_custom_extra: '+ បន្ថែមគ្រឿងផ្សំ',
      toast_item_created: 'ទំនិញថ្មីត្រូវបានបញ្ចូលទៅក្នុងម៉ឺនុយដោយជោគជ័យ!',

      // Hero Section
      hero_badge: '✨ កាហ្វេលីងថ្មីៗរាល់ថ្ងៃ · ធម្មជាតិ ១០០%',
      hero_title_1: 'កាហ្វេរសជាតិដើម,',
      hero_title_2: 'ឆុងយ៉ាងផ្ចិតផ្ចង់',
      hero_desc: 'រីករាយជាមួយគ្រាប់កាហ្វេពិសេសប្រកបដោយគុណភាព ឡាតេធ្វើដោយដៃ កាហ្វេត្រជាក់ និងនំកុម្ម៉ង់ថ្មីៗស្រស់ៗតាមចំណូលចិត្តរបស់អ្នក។',

      // Features Strip
      feat_ethical_title: 'ប្រភពច្បាស់លាស់',
      feat_ethical_desc: 'គ្រាប់កាហ្វេធម្មជាតិសុទ្ធ',
      feat_craft_title: 'អ្នកឆុងជំនាញ',
      feat_craft_desc: 'ឆុងដោយក្តីស្រឡាញ់',
      feat_fresh_title: 'នំដុតថ្មីៗ',
      feat_fresh_desc: 'ដុតស្រស់ៗរាល់ព្រឹក',
      feat_delivery_title: 'ដឹកជញ្ជូនរហ័ស',
      feat_delivery_desc: 'ក្តៅៗដល់ដៃអ្នក',

      // Categories
      cat_all: 'ទាំងអស់',
      cat_hot: 'កាហ្វេក្តៅ',
      cat_cold: 'ភេសជ្ជៈត្រជាក់',
      cat_food: 'នំ & អាហារ',

      // Process & About
      process_badge: 'សិល្បៈរបស់យើង',
      process_title: 'របៀបដែលយើងឆុង',
      process_sub: 'សាមញ្ញ គុណភាពខ្ពស់ និងល្អឥតខ្ចោះពីគ្រាប់ដល់ពែង។',
      step_1_title: '១. ជ្រើសរើសគ្រាប់កាហ្វេ',
      step_1_desc: 'ប្រមូលផលកាហ្វេធម្មជាតិប្រកបដោយការយកចិត្តទុកដាក់។',
      step_2_title: '២. លីងតាមកម្រិតត្រឹមត្រូវ',
      step_2_desc: 'ប្រើកម្តៅច្បាស់លាស់ដើម្បីបញ្ចេញក្លិនក្រអូបឈ្ងុយឆ្ងាញ់។',
      step_3_title: '៣. ឆុងដោយដៃយ៉ាងជំនាញ',
      step_3_desc: 'ឆុងដោយផ្ទាល់ដោយបារីស្តាជំនាញជាមួយទឹកបរិសុទ្ធ។',
      step_4_title: '៤. ក្រេបរសជាតិដ៏ឈ្ងុយឆ្ងាញ់',
      step_4_desc: 'ទទួលទាននៅហាង ឬដឹកជញ្ជូនដល់គេហដ្ឋានរបស់អ្នក។',

      about_badge: 'រឿងរ៉ាវរបស់យើង',
      about_title: 'ក្តីស្រឡាញ់ចំពោះគ្រាប់កាហ្វេគ្រប់គ្រាប់',
      about_desc: 'បង្កើតឡើងក្នុងគោលបំណងនាំយកវប្បធម៌កាហ្វេដ៏ទំនើបមកកាន់សហគមន៍យើង។ រាល់ការទទួលទានគឺជាបទពិសោធន៍នៃការលីងកាហ្វេដ៏ផ្ចិតផ្ចង់ និងការឆុងដ៏ត្រឹមត្រូវ។',
      stat_varieties: 'ប្រភេទកាហ្វេ',
      stat_roasts: 'កម្រិតលីងកាហ្វេ',
      stat_happy: 'អតិថិជនពេញចិត្ត',

      // General Page Elements
      page_menu_title: 'ម៉ឺនុយកាហ្វេពិសេស',
      page_menu_sub: 'ភេសជ្ជៈឆុងដោយដៃ កាហ្វេរសជាតិដើម និងនំដុតថ្មីៗ។',
      search_placeholder: 'ស្វែងរកកាហ្វេ ភេសជ្ជៈ ឬនំកុម្ម៉ង់...',
      cart_title: 'កន្ត្រករបស់អ្នក',
      cart_summary: 'សង្ខេបការបញ្ជាទិញ',
      cart_subtotal: 'តម្លៃសរុប',
      cart_tax: 'ពន្ធ (៨%)',
      cart_shipping: 'សេវាដឹកជញ្ជូន',
      cart_total: 'សរុបចុងក្រោយ',
      cart_empty: 'កន្ត្រករបស់អ្នកមិនទាន់មានទំនិញនៅឡើយទេ។',
      order_confirmed_title: 'ការកុម្ម៉ង់ទទួលបានជោគជ័យ!',
      order_confirmed_sub: 'សូមអរគុណ! អ្នកឆុងរបស់យើងកំពុងរៀបចំភេសជ្ជៈជូនអ្នក។',
      feedback_title: 'មតិកែលម្អពីអតិថិជន',
      feedback_sub: 'មតិរបស់អ្នកមានតម្លៃណាស់ ដើម្បីជួយឱ្យយើងបម្រើលោកអ្នកកាន់តែល្អ។'
    },

    fr: {
      // Navigation
      nav_home: 'Accueil',
      nav_menu: 'Menu',
      nav_cart: 'Panier',
      nav_orders: 'Commandes',
      nav_feedback: 'Avis',
      nav_profile: 'Profil',
      nav_admin: 'Admin',
      nav_signin: 'Connexion',
      nav_signup: "S'inscrire",
      nav_logout: 'Déconnexion',

      // Settings
      settings_lang: 'Langue',
      settings_theme: 'Thème de couleur',

      // Common Buttons & Actions
      btn_explore_menu: 'Découvrir le menu',
      btn_order_online: 'Commander en ligne →',
      btn_add_to_cart: 'Ajouter au panier',
      btn_customize: 'Personnaliser & Commander',
      btn_checkout: 'Passer la commande',
      btn_back_menu: '← Retour au menu',
      btn_apply: 'Appliquer',
      btn_save: 'Enregistrer',
      btn_submit: 'Envoyer',
      btn_search: 'Rechercher',
      btn_filter: 'Filtrer',
      btn_add_item: '➕ Ajouter un produit',
      modal_add_item_title: 'Ajouter un nouveau produit',
      btn_custom_extra: '+ Extra personnalisé',
      toast_item_created: 'Nouveau produit ajouté au menu avec succès !',

      // Hero Section
      hero_badge: '✨ Torréfaction fraîche du jour · 100% Bio',
      hero_title_1: 'Café artisanal,',
      hero_title_2: 'Infusé à la perfection',
      hero_desc: 'Savourez des grains de spécialité équitables, des lattes faits main, des cold brews et des pâtisseries fraîches selon vos envies.',

      // Features Strip
      feat_ethical_title: 'Approvisionnement éthique',
      feat_ethical_desc: 'Grains bio commerce équitable',
      feat_craft_title: 'Baristas experts',
      feat_craft_desc: 'Art du café artisanal',
      feat_fresh_title: 'Pâtisseries fraîches',
      feat_fresh_desc: 'Cuit sur place chaque jour',
      feat_delivery_title: 'Livraison express',
      feat_delivery_desc: 'Chaud et rapide chez vous',

      // Categories
      cat_all: 'Tous les articles',
      cat_hot: 'Cafés chauds',
      cat_cold: 'Boissons fraîches',
      cat_food: 'Pâtisseries & Snacks',

      // Process & About
      process_badge: 'Notre Savoir-Faire',
      process_title: 'Notre Préparation',
      process_sub: 'Simple, transparent et raffiné du grain à la tasse.',
      step_1_title: '1. Sélection des grains',
      step_1_desc: 'Récoltes biologiques soigneusement sélectionnées.',
      step_2_title: '2. Torréfaction précise',
      step_2_desc: 'Profil thermique révélant les arômes et le caramel.',
      step_3_title: '3. Extraction experte',
      step_3_desc: 'Infusion soignée par nos maîtres baristas.',
      step_4_title: '4. Dégustation pure',
      step_4_desc: 'Servi frais au café ou livré à votre porte.',

      about_badge: 'Notre Histoire',
      about_title: 'Passionnés par chaque grain de café',
      about_desc: 'Fondé avec la passion de partager la culture du café artisanal moderne. Chaque gorgée révèle une torréfaction soignée et un dévouement total envers nos clients.',
      stat_varieties: 'Variétés de café',
      stat_roasts: 'Torréfactions maison',
      stat_happy: 'Clients comblés',

      // General Page Elements
      page_menu_title: 'Menu Artisanal',
      page_menu_sub: 'Boissons soignées, cafés pure origine et douceurs tout juste sorties du four.',
      search_placeholder: 'Rechercher un café, une boisson ou un délice...',
      cart_title: 'Votre Panier',
      cart_summary: 'Récapitulatif de commande',
      cart_subtotal: 'Sous-total',
      cart_tax: 'Taxes (8%)',
      cart_shipping: 'Livraison',
      cart_total: 'Total',
      cart_empty: 'Votre panier est actuellement vide.',
      order_confirmed_title: 'Commande confirmée !',
      order_confirmed_sub: 'Merci pour votre commande ! Nos baristas préparent vos boissons.',
      feedback_title: 'Votre Avis Compte',
      feedback_sub: 'Partagez votre expérience pour nous aider à nous améliorer chaque jour.'
    },

    zh: {
      // Navigation
      nav_home: '首页',
      nav_menu: '菜单',
      nav_cart: '购物车',
      nav_orders: '我的订单',
      nav_feedback: '客户反馈',
      nav_profile: '个人资料',
      nav_admin: '管理后台',
      nav_signin: '登录',
      nav_signup: '注册账号',
      nav_logout: '退出登录',

      // Settings
      settings_lang: '选择语言',
      settings_theme: '主题色彩',

      // Common Buttons & Actions
      btn_explore_menu: '浏览菜单',
      btn_order_online: '在线点单 →',
      btn_add_to_cart: '加入购物车',
      btn_customize: '定制并点单',
      btn_checkout: '前往结账',
      btn_back_menu: '← 返回菜单',
      btn_apply: '应用',
      btn_save: '保存修改',
      btn_submit: '提交',
      btn_search: '搜索',
      btn_filter: '筛选',
      btn_add_item: '➕ 添加新商品',
      modal_add_item_title: '添加新商品项目',
      btn_custom_extra: '+ 自定义加料',
      toast_item_created: '新商品已成功添加到菜单！',

      // Hero Section
      hero_badge: '✨ 每日新鲜烘焙 · 100%有机咖啡豆',
      hero_title_1: '精心烘焙咖啡,',
      hero_title_2: '品味极致醇香',
      hero_desc: '体验甄选原产地特色咖啡豆、手工拉花拿铁、慢速冷萃咖啡及新鲜出炉的西点烘焙。',

      // Features Strip
      feat_ethical_title: '品质溯源',
      feat_ethical_desc: '直接贸易有机认证豆',
      feat_craft_title: '专业咖啡师',
      feat_craft_desc: '匠心手工调制拉花',
      feat_fresh_title: '现烤西点',
      feat_fresh_desc: '每日清晨新鲜出炉',
      feat_delivery_title: '极速外送',
      feat_delivery_desc: '温热饮品准时送达',

      // Categories
      cat_all: '全部商品',
      cat_hot: '经典热饮',
      cat_cold: '冰爽特饮',
      cat_food: '美味西点',

      // Process & About
      process_badge: '烘焙工艺',
      process_title: '冲泡工艺',
      process_sub: '从咖啡樱桃到暖心一杯，精益求精。',
      step_1_title: '1. 甄选豆源',
      step_1_desc: '精选来自全球优质庄园的高海拔有机咖啡豆。',
      step_2_title: '2. 精确烘焙',
      step_2_desc: '量身定制烘焙曲线，激发天然花香与焦糖风味。',
      step_3_title: '3. 手工萃取',
      step_3_desc: '资深咖啡师运用矿物质过滤水精准温控冲煮。',
      step_4_title: '4. 悦享醇香',
      step_4_desc: '在店内慢享惬意时光，或由外送专员送达手中。',

      about_badge: '品牌故事',
      about_title: '专注每一颗咖啡豆的醇厚本味',
      about_desc: '致力于将现代精品咖啡文化融入生活。每一口醇香，都凝聚着我们对烘焙曲线与萃取艺术的执着追求。',
      stat_varieties: '精品风味',
      stat_roasts: '独家烘焙',
      stat_happy: '顾客好评',

      // General Page Elements
      page_menu_title: '精品咖啡菜单',
      page_menu_sub: '特调手作咖啡、单一产区豆及现烤烘焙点心。',
      search_placeholder: '搜索心仪咖啡、饮品或西点...',
      cart_title: '购物车',
      cart_summary: '订单汇总',
      cart_subtotal: '商品小计',
      cart_tax: '消费税 (8%)',
      cart_shipping: '配送费',
      cart_total: '应付总额',
      cart_empty: '您的购物车还是空的。',
      order_confirmed_title: '订单已成功提交！',
      order_confirmed_sub: '感谢您的选购！咖啡师正在用心为您制作。',
      feedback_title: '用户评价与反馈',
      feedback_sub: '您的宝贵建议是我们持续改进的动力。'
    }
  };

  function getActiveLanguage() {
    return localStorage.getItem('coffee_shop_lang') || 'en';
  }

  function autoTagStandardNavLinks() {
    const map = {
      'Home.html': 'nav_home',
      'Menu.html': 'nav_menu',
      'Cart.html': 'nav_cart',
      'Orders.html': 'nav_orders',
      'Feedback.html': 'nav_feedback',
      'Profile.html': 'nav_profile',
      'Admin.html': 'nav_admin',
      'SignIn.html': 'nav_signin',
      'SignUp.html': 'nav_signup'
    };
    document.querySelectorAll('.site-header .nav-link').forEach(link => {
      if (link.getAttribute('data-i18n')) return;
      const href = link.getAttribute('href') || '';
      const file = href.split('/').pop().split('#')[0];
      if (map[file]) {
        link.setAttribute('data-i18n', map[file]);
      }
    });

    // Auto tag search inputs
    document.querySelectorAll('input[type="search"], input[placeholder*="Search" i]').forEach(inp => {
      if (!inp.getAttribute('data-i18n-ph')) {
        inp.setAttribute('data-i18n-ph', 'search_placeholder');
      }
    });
  }

  function applyLanguage(langCode) {
    autoTagStandardNavLinks();
    const valid = LANGUAGES.some(l => l.code === langCode);
    const lang = valid ? langCode : 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('coffee_shop_lang', lang);

    // 1. Text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // If element contains an inner element like a badge, preserve it
        const badge = el.querySelector('.nav-badge, .badge-counter');
        if (badge) {
          const badgeClone = badge.cloneNode(true);
          el.textContent = dict[key] + ' ';
          el.appendChild(badgeClone);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // 2. Placeholder elements with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 3. Update active state in pickers
    const langObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    const triggerLabel = document.querySelector('.lang-picker-btn .lang-btn-text');
    if (triggerLabel) {
      triggerLabel.textContent = `${langObj.flag} ${langObj.short}`;
    }

    document.querySelectorAll('.lang-opt-item, .mobile-lang-chip').forEach(el => {
      const isTarget = el.getAttribute('data-lang-code') === lang;
      el.classList.toggle('active', isTarget);
    });

    window.dispatchEvent(new CustomEvent('coffee_lang_changed', { detail: { lang, dict } }));
  }

  // ==========================================================================
  // 3. DYNAMIC UI CONTROLS INJECTION (HEADER & MOBILE DRAWER)
  // ==========================================================================
  function injectControls() {
    const headerActions = document.querySelector('.site-header .header-actions');
    const navMenu = document.querySelector('.site-header .nav-menu');

    if (headerActions && !headerActions.querySelector('.theme-picker-popover')) {
      const curTheme = getActiveTheme();
      const curLang = getActiveLanguage();
      const curLangObj = LANGUAGES.find(l => l.code === curLang) || LANGUAGES[0];
      const curThemeObj = THEMES.find(t => t.id === curTheme) || THEMES[0];

      // --- Color Theme Popover ---
      const themeContainer = document.createElement('div');
      themeContainer.className = 'theme-picker-popover';
      themeContainer.innerHTML = `
        <button type="button" class="theme-picker-btn" aria-label="Choose Theme Color" title="Color Theme">
          🎨
          <span class="theme-current-dot" style="background:${curThemeObj.color}; box-shadow:0 0 6px ${curThemeObj.color}"></span>
        </button>
        <div class="theme-menu-list" role="menu">
          <div class="menu-dropdown-header" data-i18n="settings_theme">Color Theme</div>
          ${THEMES.map(t => `
            <button type="button" class="theme-opt-item ${t.id === curTheme ? 'active' : ''}" data-theme-val="${t.id}">
              <span><span class="theme-swatch-badge" style="background:${t.color}; color:${t.color}"></span>${t.name}</span>
              <span>${t.icon}</span>
            </button>
          `).join('')}
        </div>
      `;

      // --- Language Dropdown ---
      const langContainer = document.createElement('div');
      langContainer.className = 'lang-picker-dropdown';
      langContainer.innerHTML = `
        <button type="button" class="lang-picker-btn" aria-label="Select Language" title="Language">
          <span class="lang-btn-text">${curLangObj.flag} ${curLangObj.short}</span>
          <span style="font-size:0.68rem; opacity:0.75;">▼</span>
        </button>
        <div class="lang-menu-list" role="menu">
          <div class="menu-dropdown-header" data-i18n="settings_lang">Language</div>
          ${LANGUAGES.map(l => `
            <button type="button" class="lang-opt-item ${l.code === curLang ? 'active' : ''}" data-lang-code="${l.code}">
              <span>${l.flag} ${l.label}</span>
              <span style="font-size:0.8rem; opacity:0.6;">${l.short}</span>
            </button>
          `).join('')}
        </div>
      `;

      // Insert before .nav-toggle
      const navToggle = headerActions.querySelector('.nav-toggle');
      if (navToggle) {
        headerActions.insertBefore(themeContainer, navToggle);
        headerActions.insertBefore(langContainer, navToggle);
      } else {
        headerActions.appendChild(themeContainer);
        headerActions.appendChild(langContainer);
      }

      // Event Listeners for Dropdowns
      const themeBtn = themeContainer.querySelector('.theme-picker-btn');
      const themeList = themeContainer.querySelector('.theme-menu-list');
      const langBtn = langContainer.querySelector('.lang-picker-btn');
      const langList = langContainer.querySelector('.lang-menu-list');

      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = themeList.classList.contains('show');
        langList.classList.remove('show');
        themeList.classList.toggle('show', !isOpen);
      });

      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langList.classList.contains('show');
        themeList.classList.remove('show');
        langList.classList.toggle('show', !isOpen);
      });

      // Item selection
      themeContainer.querySelectorAll('.theme-opt-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = btn.getAttribute('data-theme-val');
          setTheme(target);
          themeList.classList.remove('show');
        });
      });

      langContainer.querySelectorAll('.lang-opt-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = btn.getAttribute('data-lang-code');
          applyLanguage(target);
          langList.classList.remove('show');
        });
      });

      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!themeContainer.contains(e.target)) themeList.classList.remove('show');
        if (!langContainer.contains(e.target)) langList.classList.remove('show');
      });
    }

    // Mobile Drawer Settings
    if (navMenu && !navMenu.querySelector('.mobile-nav-settings')) {
      const curTheme = getActiveTheme();
      const curLang = getActiveLanguage();

      const mobileSettings = document.createElement('li');
      mobileSettings.className = 'mobile-nav-settings';
      mobileSettings.innerHTML = `
        <div class="mobile-settings-group">
          <label data-i18n="settings_lang">Language</label>
          <div class="mobile-lang-chips">
            ${LANGUAGES.map(l => `
              <button type="button" class="mobile-lang-chip ${l.code === curLang ? 'active' : ''}" data-lang-code="${l.code}">
                ${l.flag} ${l.short}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="mobile-settings-group" style="margin-top:14px;">
          <label data-i18n="settings_theme">Color Theme</label>
          <div class="mobile-theme-swatches">
            ${THEMES.map(t => `
              <button type="button" class="mobile-theme-swatch ${t.id === curTheme ? 'active' : ''}" 
                data-theme-val="${t.id}" 
                style="background:${t.color};" 
                title="${t.name}">
                ${t.icon}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      navMenu.appendChild(mobileSettings);

      mobileSettings.querySelectorAll('.mobile-lang-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const code = chip.getAttribute('data-lang-code');
          applyLanguage(code);
        });
      });

      mobileSettings.querySelectorAll('.mobile-theme-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          const val = swatch.getAttribute('data-theme-val');
          setTheme(val);
        });
      });
    }
  }

  // ==========================================================================
  // 4. CART BADGE LIVE COUNTER
  // ==========================================================================
  function updateCartBadge() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

      const badgeEls = document.querySelectorAll('.cart-badge-count, #navCartBadge, .badge-counter');
      badgeEls.forEach(el => {
        el.textContent = totalCount;
        el.style.display = totalCount > 0 ? 'inline-flex' : 'none';
      });
    } catch (e) {
      console.warn('Cart count error:', e);
    }
  }

  // ==========================================================================
  // 5. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let backdrop = document.querySelector('.nav-backdrop');

    if (!navToggle || !navMenu) return;

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function openMenu() {
      navToggle.classList.add('open');
      navMenu.classList.add('open');
      backdrop.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      backdrop.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) closeMenu();
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 991 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ==========================================================================
  // 6. ACTIVE NAV LINK DETECTION
  // ==========================================================================
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop().split('#')[0];

      if (
        linkFile === currentPath ||
        (currentPath === '' && (linkFile === 'Home.html' || linkFile === 'index.html')) ||
        (currentPath === 'index.html' && linkFile === 'Home.html')
      ) {
        link.classList.add('active');
      }
    });
  }

  // ==========================================================================
  // 7. PERSISTENT FLOATING ADMIN DOCK (ON PUBLIC SITE)
  // ==========================================================================
  function initAdminDock() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isPublicPage = !['Admin.html', 'AdminControl.html'].includes(currentPath);
    const isAdminActive = localStorage.getItem('coffee_admin_mode') === 'true';

    if (isPublicPage && isAdminActive && !document.getElementById('adminFloatingDock')) {
      const dock = document.createElement('div');
      dock.id = 'adminFloatingDock';
      dock.className = 'admin-floating-dock';
      dock.innerHTML = `
        <div class="dock-inner">
          <span class="dock-badge">👑 Admin Active</span>
          <a href="Admin.html" class="dock-link" title="Return to Admin Dashboard">📊 Dashboard</a>
          <a href="AdminControl.html" class="dock-link" title="Control Center">⚙️ Control Center</a>
          <button type="button" class="dock-close" title="Exit Admin Mode" id="btnExitAdminMode">&times;</button>
        </div>
      `;
      document.body.appendChild(dock);

      const closeBtn = document.getElementById('btnExitAdminMode');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          localStorage.removeItem('coffee_admin_mode');
          dock.remove();
        });
      }
    }
  }

  // Expose global methods
  window.updateCartBadge = updateCartBadge;
  window.setTheme = setTheme;
  window.setLanguage = applyLanguage;
  window.getActiveTheme = getActiveTheme;
  window.getActiveLanguage = getActiveLanguage;
  window.COFFEE_TRANSLATIONS = TRANSLATIONS;

  // Initialize on DOM Ready
  function initAll() {
    setTheme(getActiveTheme());
    injectControls();
    initMobileNav();
    initActiveNav();
    updateCartBadge();
    applyLanguage(getActiveLanguage());
    initAdminDock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Listen for storage changes across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartBadge();
    if (e.key === 'coffee_shop_theme') setTheme(e.newValue || 'blue');
    if (e.key === 'coffee_shop_lang') applyLanguage(e.newValue || 'en');
  });
})();
