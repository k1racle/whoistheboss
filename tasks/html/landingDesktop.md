```html
<!DOCTYPE html>

<html lang="ru"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Кто здесь главный?</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style data-purpose="custom-fonts-and-styles">
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap');

    :root {
      --terracotta: #DB2A00;
      --light-grey: #E5E5E5;
      --border-color: #D1D1D1;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--light-grey);
      color: #000;
    }

    .font-condensed {
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
      line-height: 0.9;
    }

    .bg-terracotta {
      background-color: var(--terracotta);
    }
    .text-terracotta {
      color: var(--terracotta);
    }
    .border-terracotta {
      border-color: var(--terracotta);
    }

    /* Arrow icon utility */
    .arrow-icon::after {
      content: '↗';
      font-family: sans-serif;
      margin-left: 4px;
    }
  
    .btn-red {
      background-color: var(--terracotta);
      color: white;
      text-transform: uppercase;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      transition: background-color 0.2s;
    }
    .btn-red:hover {
      background-color: #b52200;
    }
  
    .thin-border {
      border: 1px solid var(--border-color);
    }
  
    .article-border {
      border-bottom: 1px solid #ccc;
    }

    /* Huge text scaling */
    .hero-text {
      font-size: clamp(4rem, 12vw, 15rem);
      letter-spacing: -0.02em;
    }
    .footer-text {
      font-size: clamp(3rem, 10vw, 12rem);
      letter-spacing: -0.02em;
    }
    .for-whom-text {
      font-size: clamp(4rem, 15vw, 18rem);
      letter-spacing: -0.02em;
      color: #000;
    }
  </style>
</head>
<body class="antialiased">
<!-- BEGIN: Header -->
<header class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
<div class="container mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-8">
<a aria-label="Home" class="w-4 h-4 bg-terracotta block" href="#"></a>
<nav class="hidden md:flex gap-6 text-xs uppercase tracking-wide font-medium">
<a class="hover:text-terracotta transition-colors" href="#">Предприниматели</a>
<a class="hover:text-terracotta transition-colors" href="#">Компании</a>
<a class="hover:text-terracotta transition-colors" href="#">Блог</a>
</nav>
</div>
<div class="flex items-center gap-6">
<a class="text-xs uppercase tracking-wide font-medium hover:text-terracotta transition-colors hidden md:block" href="#">Видео</a>
<a class="btn-red arrow-icon" href="#">Стать героем [ </a>
</div>
</div>
</header>
<!-- END: Header -->
<!-- BEGIN: Main Content -->
<main class="pt-16">
<!-- Hero Section -->
<section class="container mx-auto px-6 pt-24 pb-12">
<h1 class="font-condensed font-bold text-terracotta hero-text mb-8">
        КТО ЗДЕСЬ<br/>ГЛАВНЫЙ?
      </h1>
<div class="flex justify-end">
<button class="bg-terracotta text-white px-2 py-1 text-xs arrow-icon">[ ? </button>
</div>
</section>
<!-- Project Info Section -->
<section class="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
<div class="lg:w-1/3 flex flex-col justify-between">
<div>
<div class="w-16 h-8 bg-terracotta text-white text-[10px] font-bold flex items-center justify-center uppercase mb-8">
            Кто здесь<br/>главный?
          </div>
<h2 class="font-condensed font-bold text-5xl mb-6">О ПРОЕКТЕ</h2>
<div class="text-sm space-y-4 mb-8">
<p>Мы рассказываем личные истории предпринимателей через их дело. За каждым рестораном, магазином, студией, производством или компанией стоит человек со своим путем, идеями, победами и трудностями. Именно эти истории мы показываем честно и без прикрас.</p>
<p>Наши интервью, биографии, статьи и репортажи помогают увидеть не только успешный бизнес, но и людей, которые стоят за ним. Потому что главное - не вывеска, а человек, который ее создал.</p>
</div>
</div>
<a class="btn-red arrow-icon self-start" href="#">Стать героем [ </a>
</div>
<div class="lg:w-2/3 bg-white flex items-center justify-center aspect-video relative">
<!-- Video Placeholder -->
<button aria-label="Play video" class="w-16 h-16 bg-terracotta rounded-full flex items-center justify-center absolute">
<svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewbox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
</button>
</div>
</section>
<!-- Featured Hero Banner -->
<section class="container mx-auto px-6 py-12">
<div class="bg-terracotta text-white flex flex-col md:flex-row overflow-hidden relative">
<div class="p-8 md:p-12 md:w-1/2 flex flex-col justify-between z-10">
<div>
<h3 class="font-bold text-xl mb-1 uppercase tracking-wide">Андрей Шевченко</h3>
<p class="text-sm uppercase tracking-wide mb-12">Мидийное<br/>место</p>
</div>
<h2 class="font-condensed font-bold text-6xl md:text-8xl lg:text-[7rem] leading-none mb-8">
            НОВЫЙ ГЕРОЙ<br/>УЖЕ НА САЙТЕ
          </h2>
<div class="text-3xl font-light tracking-widest">[ <span class="arrow-icon inline-block"></span> ]</div>
</div>
<div class="md:w-1/2 relative min-h-[400px]">
<img alt="Andrey Shevchenko" class="absolute inset-0 w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiZeNY7IP8PyIGo43lfdn6EcUHQilxZQ9mY1laLOfT_6mzvBMboCQQ2RNpl1fcy7mXNSYg0GocegBOQ1osktI0g8G3PW2jcIThvu630lQeHR8TlFdqm1SjyWhQ3Ub-BzzUvCANqQbMH02xsfOSxMkOj_YP9rgbVJM5cS7rOmnmIDbHUC85BeXY1g5_gmPMRmOllXC8kt8fhlHKRjDM-Ba4Iy5sqE6DN41iwpsO4mIHv89OnbquMR4qZQ"/>
</div>
</div>
</section>
<!-- Heroes Grid -->
<section class="container mx-auto px-6 py-12">
<div class="flex justify-between items-end mb-8">
<h2 class="font-condensed font-bold text-6xl">НАШИ ГЕРОИ</h2>
<a class="bg-terracotta text-white px-3 py-1 text-xs uppercase arrow-icon" href="#">ЕЩЕ [ </a>
</div>
<p class="text-xs max-w-2xl mb-12">
        Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.
      </p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Hero Card 1 -->
<a class="group relative block aspect-square bg-terracotta overflow-hidden" href="#">
<img alt="Андрей Шевченко" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdb_-L-uOaxMXTHy1_MdalLZwtqazWdRdKHbASA-QHw9kr4TL3JHqi-EfnbnSEkpjpEPZrvF3zYCjTM4IpAOZF9C76eKUTWjn1bXnR6a4TTjXJSUFp5Mot9SrUc_J6dQ5yeGXvCqUv53IzH__l2OE8tek7RQbgKbMARU8k25fjoMkfR1Rj3VVAdVFzdXIv4Xa8sDyFU50PqiIkcHdj-KqD6HBBpKirdAZIZgijvniLEsyq2OWeoHqTRg"/>
<div class="absolute inset-0 p-6 flex flex-col justify-between text-white">
<div class="flex justify-between items-start">
<h3 class="font-condensed font-bold text-5xl leading-none max-w-[70%]">АНДРЕЙ<br/>ШЕВЧЕНКО</h3>
<span class="text-xl">[ ↗ ]</span>
</div>
<div class="text-xs uppercase tracking-wide font-medium">
              Управляющий<br/>партнер<br/><br/>Мидийное<br/>место
            </div>
</div>
</a>
<!-- Hero Card 2 -->
<a class="group relative block aspect-square bg-terracotta overflow-hidden" href="#">
<img alt="Эленика Корелова" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALt_fHenxTt8Lmc1D03unvrN0R8YMVs5iKo6J-6ZaSvAg5k6FYm6pxhr_obF63_yi0kd6hE6ueJY8QbzMzbgKzaE5Bg-td4FZ3HiX942mdTePIt8MinBZstbWMcB1Ja76MjCmBn7b2j0J22JKuvjIkx1ZMLlFnF9GI8FFG0Vb-jrx4Ar0Ql9eiQ0RkS86Uq3rhUpziwwzIUk51ZOnmGHScuAuJAS9c742y_xFAiPMINFs_zSvdmUMqcA"/>
<div class="absolute inset-0 p-6 flex flex-col justify-between text-white">
<div class="flex justify-between items-start">
<h3 class="font-condensed font-bold text-5xl leading-none max-w-[70%]">ЭЛЕНИКА<br/>КОРЕЛОВА</h3>
<span class="text-xl">[ ↗ ]</span>
</div>
<div class="text-xs uppercase tracking-wide font-medium">
              Управляющий<br/>партнер<br/><br/>Gimza<br/>Орех-Бар
            </div>
</div>
</a>
<!-- Hero Card 3 -->
<a class="group relative block aspect-square bg-terracotta overflow-hidden" href="#">
<img alt="Вячеслав Морковский" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2QCrc-a6Ix_mJfTE3S67dGrS36WZPTo999YxXrPaE22lhLzws_6_8aqOjG2igZBPL1dG5Hali9EoZxIPmfKng9I4G-n1JcT4fkgHMT1VhGfoIc0foj98VXJC9oO49O9b9bGI9kdLSXkVj3feTcQXBLxgGmY8XiwUn4j4TjCvEChJ26x2Oobrvmew7J-b0ud8oWHCYgB7ey75gpvv2Hp8pCtcVYmr2rLlE_METKYgKjbY0UzpaJY10Bg"/>
<div class="absolute inset-0 p-6 flex flex-col justify-between text-white">
<div class="flex justify-between items-start">
<h3 class="font-condensed font-bold text-5xl leading-none max-w-[70%]">ВЯЧЕСЛАВ<br/>МОРКОВСКИЙ</h3>
<span class="text-xl">[ ↗ ]</span>
</div>
<div class="text-xs uppercase tracking-wide font-medium">
              Управляющий<br/>партнер<br/><br/>Big Baby Burger
            </div>
</div>
</a>
</div>
</section>
<!-- Places Section -->
<section class="container mx-auto px-6 py-12">
<div class="flex justify-between items-end mb-8">
<h2 class="font-condensed font-bold text-6xl">МЕСТА</h2>
<a class="bg-terracotta text-white px-3 py-1 text-xs uppercase arrow-icon" href="#">ЕЩЕ [ </a>
</div>
<p class="text-xs max-w-2xl mb-12">
        Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.
      </p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Place Card 1 -->
<a class="bg-terracotta p-4 flex flex-col h-[400px] text-white hover:bg-[#b52200] transition-colors" href="#">
<div class="flex justify-between items-center mb-4">
<h3 class="font-bold text-lg uppercase tracking-wide">СЕЛЬДЕРЕЙ [ КАФЕ-БАР ]</h3>
</div>
<div class="bg-white/90 flex-1 mb-4"></div>
<div class="flex justify-between items-end">
<span class="text-2xl font-light">[ ↗ ]</span>
<span class="text-[10px] uppercase text-right max-w-[150px]">Салат-бар здоровых привычек в самом центре города</span>
</div>
</a>
<!-- Place Card 2 -->
<a class="bg-terracotta p-4 flex flex-col h-[400px] text-white hover:bg-[#b52200] transition-colors" href="#">
<div class="flex justify-between items-center mb-4">
<h3 class="font-bold text-lg uppercase tracking-wide">СЕЛЬДЕРЕЙ [ КАФЕ-БАР ]</h3>
</div>
<div class="bg-white/90 flex-1 mb-4"></div>
<div class="flex justify-between items-end">
<span class="text-2xl font-light">[ ↗ ]</span>
<span class="text-[10px] uppercase text-right max-w-[150px]">Салат-бар здоровых привычек в самом центре города</span>
</div>
</a>
<!-- Place Card 3 -->
<a class="bg-terracotta p-4 flex flex-col h-[400px] text-white hover:bg-[#b52200] transition-colors" href="#">
<div class="flex justify-between items-center mb-4">
<h3 class="font-bold text-lg uppercase tracking-wide">СЕЛЬДЕРЕЙ [ КАФЕ-БАР ]</h3>
</div>
<div class="bg-white/90 flex-1 mb-4"></div>
<div class="flex justify-between items-end">
<span class="text-2xl font-light">[ ↗ ]</span>
<span class="text-[10px] uppercase text-right max-w-[150px]">Салат-бар здоровых привычек в самом центре города</span>
</div>
</a>
</div>
</section>
<!-- Main Articles Section -->
<section class="container mx-auto px-6 py-16">
<h2 class="font-condensed font-bold text-6xl mb-12">ГЛАВНЫЕ СТАТЬИ</h2>
<div class="bg-white p-8 md:p-12">
<ul class="flex flex-col">
<!-- Article Item -->
<li class="article-border py-6 flex gap-6 group hover:bg-gray-50 transition-colors">
<div class="w-1/4">
<span class="font-bold uppercase tracking-wider text-sm">ЭЛЕНИКА КОРЕЛОВА</span>
</div>
<div class="w-3/4 flex flex-col">
<div class="flex justify-between items-start mb-2">
<h3 class="font-bold text-xl uppercase">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</h3>
<span class="text-gray-400 group-hover:text-terracotta transition-colors">[ ↗ ]</span>
</div>
<p class="text-xs text-gray-500 uppercase max-w-xl">
                50 СПОСОБОВ ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ И ДОБИТЬСЯ СОСТОЯНИЯ В СТО ПЯТЬДЕСЯТ МИЛЛИАРДОВ МИЛЛИОНОВ РУБЛЕЙ
              </p>
</div>
</li>
<!-- Article Item (Repeated for visual match) -->
<li class="article-border py-6 flex gap-6 group hover:bg-gray-50 transition-colors">
<div class="w-1/4">
<span class="font-bold uppercase tracking-wider text-sm">ЭЛЕНИКА КОРЕЛОВА</span>
</div>
<div class="w-3/4 flex flex-col">
<div class="flex justify-between items-start mb-2">
<h3 class="font-bold text-xl uppercase">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</h3>
<span class="text-gray-400 group-hover:text-terracotta transition-colors">[ ↗ ]</span>
</div>
<p class="text-xs text-gray-500 uppercase max-w-xl">
                50 СПОСОБОВ ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ И ДОБИТЬСЯ СОСТОЯНИЯ В СТО ПЯТЬДЕСЯТ МИЛЛИАРДОВ МИЛЛИОНОВ РУБЛЕЙ
              </p>
</div>
</li>
<!-- Article Item -->
<li class="article-border py-6 flex gap-6 group hover:bg-gray-50 transition-colors">
<div class="w-1/4">
<span class="font-bold uppercase tracking-wider text-sm">ЭЛЕНИКА КОРЕЛОВА</span>
</div>
<div class="w-3/4 flex flex-col">
<div class="flex justify-between items-start mb-2">
<h3 class="font-bold text-xl uppercase">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</h3>
<span class="text-gray-400 group-hover:text-terracotta transition-colors">[ ↗ ]</span>
</div>
<p class="text-xs text-gray-500 uppercase max-w-xl">
                50 СПОСОБОВ ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ И ДОБИТЬСЯ СОСТОЯНИЯ В СТО ПЯТЬДЕСЯТ МИЛЛИАРДОВ МИЛЛИОНОВ РУБЛЕЙ
              </p>
</div>
</li>
<!-- Article Item -->
<li class="article-border py-6 flex gap-6 group hover:bg-gray-50 transition-colors">
<div class="w-1/4">
<span class="font-bold uppercase tracking-wider text-sm">ЭЛЕНИКА КОРЕЛОВА</span>
</div>
<div class="w-3/4 flex flex-col">
<div class="flex justify-between items-start mb-2">
<h3 class="font-bold text-xl uppercase">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</h3>
<span class="text-gray-400 group-hover:text-terracotta transition-colors">[ ↗ ]</span>
</div>
<p class="text-xs text-gray-500 uppercase max-w-xl">
                50 СПОСОБОВ ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ И ДОБИТЬСЯ СОСТОЯНИЯ В СТО ПЯТЬДЕСЯТ МИЛЛИАРДОВ МИЛЛИОНОВ РУБЛЕЙ
              </p>
</div>
</li>
<!-- Article Item -->
<li class="py-6 flex gap-6 group hover:bg-gray-50 transition-colors">
<div class="w-1/4">
<span class="font-bold uppercase tracking-wider text-sm">ЭЛЕНИКА КОРЕЛОВА</span>
</div>
<div class="w-3/4 flex flex-col">
<div class="flex justify-between items-start mb-2">
<h3 class="font-bold text-xl uppercase">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</h3>
<span class="text-gray-400 group-hover:text-terracotta transition-colors">[ ↗ ]</span>
</div>
<p class="text-xs text-gray-500 uppercase max-w-xl">
                50 СПОСОБОВ ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ И ДОБИТЬСЯ СОСТОЯНИЯ В СТО ПЯТЬДЕСЯТ МИЛЛИАРДОВ МИЛЛИОНОВ РУБЛЕЙ
              </p>
</div>
</li>
</ul>
</div>
</section>
<!-- For Whom Section -->
<section class="container mx-auto px-6 py-24 text-center">
<h2 class="font-condensed font-bold for-whom-text leading-none uppercase">ДЛЯ КОГО</h2>
</section>
</main>
<!-- END: Main Content -->
<!-- BEGIN: Footer -->
<footer class="bg-terracotta text-white mt-12">
<!-- Contact Form Section -->
<div class="container mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12 border-b border-white/20">
<div class="md:w-1/2">
<h2 class="font-bold text-3xl uppercase leading-tight">ЗАПОЛНИТЕ ВАШИ ДАННЫЕ<br/>ДЛЯ СВЯЗИ</h2>
</div>
<div class="md:w-1/2 max-w-md w-full">
<form class="flex flex-col gap-6">
<div>
<input class="w-full bg-transparent border-0 border-b border-white/50 focus:border-white focus:ring-0 px-0 py-2 text-sm placeholder-white/70" placeholder="Ваше имя*" required="" type="text"/>
</div>
<div>
<input class="w-full bg-transparent border-0 border-b border-white/50 focus:border-white focus:ring-0 px-0 py-2 text-sm placeholder-white/70" placeholder="Номер телефона*" required="" type="tel"/>
</div>
<button class="border border-white hover:bg-white hover:text-terracotta transition-colors uppercase text-sm py-3 mt-4" type="submit">ОТПРАВИТЬ</button>
</form>
</div>
</div>
<!-- Become Participant Section -->
<div class="container mx-auto px-6 py-16 pb-32 relative">
<h2 class="font-condensed font-bold footer-text leading-none">
        СТАТЬ<br/>УЧАСТНИКОМ
      </h2>
<a class="absolute bottom-16 right-6 bg-white text-terracotta px-8 py-3 text-sm font-bold uppercase hover:bg-gray-100 transition-colors" href="#">
        УЗНАТЬ ПОДРОБНЕЕ
      </a>
</div>
<!-- Sub Footer Navigation -->
<div class="bg-white text-black py-8 border-t border-gray-200 text-[10px] uppercase font-medium">
<div class="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
<div class="flex flex-col gap-2">
<a class="hover:text-terracotta" href="#">Места</a>
<a class="hover:text-terracotta" href="#">Биографии</a>
<a class="hover:text-terracotta" href="#">Интервью</a>
<a class="hover:text-terracotta" href="#">Статьи</a>
<a class="hover:text-terracotta" href="#">Блог</a>
</div>
<div class="flex flex-col gap-2">
<a class="hover:text-terracotta" href="#">Telegram</a>
<a class="hover:text-terracotta" href="#">Youtube</a>
</div>
<div class="flex flex-col gap-2">
<a class="hover:text-terracotta" href="#">Instagram*</a>
<a class="hover:text-terracotta" href="#">Pinterest</a>
</div>
<div class="flex flex-col gap-2 text-right">
<a class="hover:text-terracotta" href="#">VK</a>
<a class="hover:text-terracotta" href="#">Dzen</a>
</div>
</div>
<div class="container mx-auto px-6 mt-12 flex justify-between items-center flex-wrap gap-4 text-gray-500">
<div class="flex gap-4 items-center">
<span>ГОТОВЫ</span>
<span>К</span>
<span>ОБСУЖДЕНИЮ</span>
<span>ПРОЕКТА</span>
<span>?</span>
<a class="btn-red ml-4 text-[10px] px-2 py-1 arrow-icon" href="#">СТАТЬ ГЕРОЕМ [ </a>
</div>
<div class="flex gap-8">
<span>ИП БАТАТОВ А.А.</span>
<span>ТИЛА EXPERTS</span>
<a class="hover:text-black" href="#">ПОЛИТИКА КОНФ-ТИ</a>
</div>
</div>
</div>
</footer>
<!-- END: Footer -->
</body></html>
```
