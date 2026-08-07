```html
<!DOCTYPE html>

<html lang="ru"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Кто здесь главный? - Мобильная версия</title>
<!-- Font -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;800;900&display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
<script data-purpose="tailwind-config">
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#db2a00',
            black: '#000000',
            white: '#ffffff',
            gray: {
              100: '#f5f5f5',
              200: '#e5e5e5',
              900: '#1a1a1a'
            }
          },
          fontFamily: {
            sans: ['Hanken Grotesk', 'sans-serif'],
            condensed: ['Hanken Grotesk', 'sans-serif'], // Fallback for Dexa Pro Condensed
          },
          letterSpacing: {
            tighter: '-.04em',
            tight: '-.02em',
            normal: '0',
            wide: '.02em',
            wider: '.04em',
          }
        }
      }
    }
  </script>
<!-- Custom Styles -->
<style data-purpose="custom-utilities">
    body {
      font-family: 'Hanken Grotesk', sans-serif;
      background-color: #e5e5e5;
    }
    .font-condensed {
      font-family: 'Hanken Grotesk', sans-serif;
      font-stretch: condensed;
      letter-spacing: -0.05em;
    }
    .red-gradient {
      background: linear-gradient(180deg, rgba(219,42,0,1) 0%, rgba(180,30,0,1) 100%);
    }
  </style>
</head>
<body class="antialiased text-black bg-[#e7e5e4] max-w-md mx-auto relative overflow-x-hidden">
<!-- BEGIN: Navigation Overlay (Hidden by default, shown when menu is clicked - simulated) -->
<div class="fixed inset-0 bg-[#e7e5e4] z-50 flex flex-col pt-16 hidden" id="mobile-menu">
<div class="absolute top-4 right-4 cursor-pointer" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="24"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
</div>
<div class="flex flex-col items-end px-6 space-y-4">
<a class="bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase" href="#">ПРЕДПРИНИМАТЕЛИ</a>
<a class="bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase" href="#">КОМПАНИИ</a>
<a class="bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase" href="#">БЛОГ</a>
<a class="bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase" href="#">СЪЕМКА</a>
</div>
</div>
<!-- END: Navigation Overlay -->
<!-- BEGIN: MainHeader -->
<header class="w-full flex justify-between items-center px-4 py-4 z-40 relative">
<a class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1 uppercase tracking-wider" href="#">
      СТАТЬ ГЕРОЕМ [ ↗ ]
    </a>
<button aria-label="Menu" class="flex flex-col gap-1.5 cursor-pointer" onclick="document.getElementById('mobile-menu').classList.remove('hidden')">
<span class="w-6 h-0.5 bg-primary block"></span>
<span class="w-6 h-0.5 bg-primary block"></span>
</button>
</header>
<!-- END: MainHeader -->
<div class="flex flex-col items-end px-4 space-y-3 mb-12 relative z-30 -mt-2">
<a class="bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm" href="#">ПРЕДПРИНИМАТЕЛИ</a>
<a class="bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm" href="#">КОМПАНИИ</a>
<a class="bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm" href="#">БЛОГ</a>
<a class="bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm" href="#">СЪЕМКА</a>
</div>
<main>
<!-- BEGIN: Hero Section -->
<section class="px-4 mb-8">
<h1 class="font-condensed font-black text-6xl leading-[0.85] text-primary break-words">
        КТО ЗДЕСЬ<br/>ГЛАВНЫЙ?
      </h1>
</section>
<!-- END: Hero Section -->
<!-- BEGIN: Video Placeholder -->
<section class="px-4 mb-12">
<div class="w-full aspect-[4/3] bg-[#f5f5f5] flex items-center justify-center cursor-pointer">
<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center pl-1 shadow-md">
<svg fill="white" height="16" viewbox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
<path d="M5 3L19 12L5 21V3Z" fill="white"></path>
</svg>
</div>
</div>
</section>
<!-- END: Video Placeholder -->
<!-- BEGIN: About Project -->
<section class="px-4 mb-16">
<h2 class="font-condensed font-black text-3xl mb-6 tracking-tighter uppercase">О ПРОЕКТЕ</h2>
<div class="space-y-4 text-xs leading-relaxed font-medium">
<p>
          Мы рассказываем личные истории предпринимателей через их дело. За каждым рестораном, магазином, студией, производством или компанией стоит человек со своим путем, идеями, победами и трудностями. Именно эти истории мы показываем честно и без прикрас.
        </p>
<p>
          Наши интервью, биографии, статьи и репортажи помогают увидеть не только успешный бизнес, но и людей, которые стоят за ним. Потому что главное — не вывеска, а человек, который ее создал.
        </p>
</div>
<a class="inline-flex mt-6 bg-primary text-white text-[10px] font-bold px-4 py-2 items-center gap-1 uppercase tracking-wider" href="#">
        СТАТЬ ГЕРОЕМ [ ↗ ]
      </a>
</section>
<!-- END: About Project -->
<!-- BEGIN: Hero Highlight Banner -->
<section class="mb-16">
<div class="bg-primary w-full aspect-[1/1.5] relative overflow-hidden flex flex-col justify-between p-6">
<div class="relative z-10 text-white flex justify-between items-start">
<div class="text-[8px] font-bold uppercase tracking-widest leading-tight">
            АНДРЕЙ ШЕВЧЕНКО<br/>
            МЕДИЙНОЕ ЛИЦО
          </div>
</div>
<h2 class="relative z-10 font-condensed font-black text-6xl text-white leading-[0.8] mt-6 w-3/4">
          НОВЫЙ<br/>ГЕРОЙ<br/>УЖЕ<br/>НА<br/>САЙТЕ
        </h2>
<!-- Image placeholder - would normally be absolute positioned behind text -->
<div class="absolute right-[-10%] bottom-0 w-[80%] h-[80%] bg-black/20 mix-blend-multiply flex items-end justify-center">
<span class="text-white/50 text-xs pb-4">[ PHOTO PLACEHOLDER ]</span>
</div>
<div class="relative z-10 text-white mt-auto text-xl font-light">
          [ ↗ ]
        </div>
</div>
</section>
<!-- END: Hero Highlight Banner -->
<!-- BEGIN: Heroes Section -->
<section class="px-4 mb-16">
<h2 class="font-condensed font-black text-3xl mb-6 tracking-tighter uppercase">НАШИ ГЕРОИ</h2>
<p class="text-[11px] leading-tight font-medium mb-6 w-[90%]">
        Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.
      </p>
<!-- Horizontal Scroll Container -->
<div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
<!-- Hero Card 1 -->
<div class="min-w-[85%] snap-center relative bg-primary aspect-[4/5] flex flex-col justify-between p-4">
<div class="absolute right-4 top-4 text-white text-sm">
                [ ↗ ]
            </div>
<h3 class="font-condensed font-black text-[2.5rem] text-white leading-none mt-8 z-10 uppercase w-3/4">
                АНДРЕЙ<br/>ШЕВЧЕНКО
            </h3>
<div class="absolute right-[-5%] bottom-0 w-[80%] h-[70%] bg-black/20 mix-blend-multiply flex items-end justify-center">
<span class="text-white/50 text-xs pb-4">[ PHOTO PLACEHOLDER ]</span>
</div>
<div class="relative z-10 text-white text-[8px] font-bold uppercase tracking-widest mt-auto">
                ОСНОВАТЕЛЬ<br/>КОМПАНИИ<br/>
<br/>
                МЕДИЙНОЕ<br/>ЛИЦО
            </div>
</div>
<!-- Hero Card 2 (Partial visibility) -->
<div class="min-w-[85%] snap-center relative bg-primary aspect-[4/5] flex flex-col justify-between p-4">
<div class="absolute right-4 top-4 text-white text-sm">
                [ ↗ ]
            </div>
<h3 class="font-condensed font-black text-[2.5rem] text-white leading-none mt-8 z-10 uppercase w-3/4">
                ДРУГОЙ<br/>ГЕРОЙ
            </h3>
</div>
</div>
<!-- Dots indicator -->
<div class="flex gap-2 mt-2 mb-4">
<div class="w-8 h-0.5 bg-primary"></div>
<div class="w-8 h-0.5 bg-gray-400"></div>
<div class="w-8 h-0.5 bg-gray-400"></div>
</div>
<a class="inline-flex bg-primary text-white text-[10px] font-bold px-4 py-2 items-center gap-1 uppercase tracking-wider" href="#">
        ЕЩЕ [ ↗ ]
      </a>
</section>
<!-- END: Heroes Section -->
<!-- BEGIN: Places Section -->
<section class="px-4 mb-16">
<h2 class="font-condensed font-black text-3xl mb-6 tracking-tighter uppercase">НАШИ МЕСТА</h2>
<p class="text-[11px] leading-tight font-medium mb-6 w-[90%]">
        Главные герои проекта — предприниматели, которые своим трудом, идеями и решениями создают бизнес и меняют окружающий мир. У каждого из них свой путь, свои ценности и своя история. Мы знакомим вас с людьми, которые стоят за известными компаниями, предприятиями, ресторанами, магазинами и другими успешными проектами.
      </p>
<!-- Horizontal Scroll Container -->
<div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
<!-- Place Card 1 -->
<div class="min-w-[85%] snap-center border-4 border-primary bg-primary p-1 flex flex-col h-64 relative">
<div class="absolute top-3 left-3 bg-primary text-white text-[8px] font-bold px-2 py-0.5 z-10 uppercase">
                СЕЛЬДЕРЕЙ [ КАФЕ-БАР ]
            </div>
<div class="w-full flex-grow bg-[#d4d4d4] mb-1"></div>
<div class="bg-primary pt-2 pb-1 px-2 flex justify-between items-end">
<div class="text-white text-sm">
                    [ ↗ ]
                </div>
<div class="text-white text-[8px] text-right font-bold uppercase leading-tight">
                    САЛАТ-БАР ЗДОРОВЫХ<br/>
                    ПРИВЫЧЕК В САМОМ<br/>
                    ЦЕНТРЕ ГОРОДА
                </div>
</div>
</div>
<!-- Place Card 2 -->
<div class="min-w-[85%] snap-center border-4 border-primary bg-primary p-1 flex flex-col h-64 relative">
<div class="absolute top-3 left-3 bg-primary text-white text-[8px] font-bold px-2 py-0.5 z-10 uppercase">
                СЕЛЬДЕРЕЙ [ КАФЕ-БАР ]
            </div>
<div class="w-full flex-grow bg-[#d4d4d4] mb-1"></div>
<div class="bg-primary pt-2 pb-1 px-2 flex justify-between items-end">
<div class="text-white text-sm">
                    [ ↗ ]
                </div>
</div>
</div>
</div>
<!-- Dots indicator -->
<div class="flex gap-2 mt-2 mb-4">
<div class="w-8 h-0.5 bg-primary"></div>
<div class="w-8 h-0.5 bg-gray-400"></div>
<div class="w-8 h-0.5 bg-gray-400"></div>
</div>
<a class="inline-flex bg-primary text-white text-[10px] font-bold px-4 py-2 items-center gap-1 uppercase tracking-wider" href="#">
        ЕЩЕ [ ↗ ]
      </a>
</section>
<!-- END: Places Section -->
<!-- BEGIN: Articles List -->
<section class="bg-white px-4 py-8 mb-16">
<div class="space-y-6">
<!-- Article Item -->
<a class="block border-b border-gray-300 pb-4 group" href="#">
<div class="text-[8px] font-bold uppercase tracking-widest mb-1">ЭЛЕНИКА КОРЕЛОВА</div>
<div class="font-bold text-[10px] uppercase mb-1">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</div>
<div class="flex justify-between items-end">
<p class="text-[10px] text-gray-600 w-3/4 leading-tight">5 способов заработать на сельдерее и добиться состояния в сто пятьдесят</p>
<span class="text-sm text-black group-hover:text-primary transition-colors">[ ↗ ]</span>
</div>
</a>
<!-- Article Item -->
<a class="block border-b border-gray-300 pb-4 group" href="#">
<div class="text-[8px] font-bold uppercase tracking-widest mb-1">ЭЛЕНИКА КОРЕЛОВА</div>
<div class="font-bold text-[10px] uppercase mb-1">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</div>
<div class="flex justify-between items-end">
<p class="text-[10px] text-gray-600 w-3/4 leading-tight">5 способов заработать на сельдерее и добиться состояния в сто пятьдесят</p>
<span class="text-sm text-black group-hover:text-primary transition-colors">[ ↗ ]</span>
</div>
</a>
<!-- Article Item -->
<a class="block border-b border-gray-300 pb-4 group" href="#">
<div class="text-[8px] font-bold uppercase tracking-widest mb-1">ЭЛЕНИКА КОРЕЛОВА</div>
<div class="font-bold text-[10px] uppercase mb-1">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</div>
<div class="flex justify-between items-end">
<p class="text-[10px] text-gray-600 w-3/4 leading-tight">5 способов заработать на сельдерее и добиться состояния в сто пятьдесят</p>
<span class="text-sm text-black group-hover:text-primary transition-colors">[ ↗ ]</span>
</div>
</a>
<!-- Article Item -->
<a class="block border-b border-gray-300 pb-4 group" href="#">
<div class="text-[8px] font-bold uppercase tracking-widest mb-1">ЭЛЕНИКА КОРЕЛОВА</div>
<div class="font-bold text-[10px] uppercase mb-1">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</div>
<div class="flex justify-between items-end">
<p class="text-[10px] text-gray-600 w-3/4 leading-tight">5 способов заработать на сельдерее и добиться состояния в сто пятьдесят</p>
<span class="text-sm text-black group-hover:text-primary transition-colors">[ ↗ ]</span>
</div>
</a>
<!-- Article Item -->
<a class="block group" href="#">
<div class="text-[8px] font-bold uppercase tracking-widest mb-1">ЭЛЕНИКА КОРЕЛОВА</div>
<div class="font-bold text-[10px] uppercase mb-1">КАК ЗАРАБОТАТЬ НА СЕЛЬДЕРЕЕ?</div>
<div class="flex justify-between items-end">
<p class="text-[10px] text-gray-600 w-3/4 leading-tight">5 способов заработать на сельдерее и добиться состояния в сто пятьдесят</p>
<span class="text-sm text-black group-hover:text-primary transition-colors">[ ↗ ]</span>
</div>
</a>
</div>
</section>
<!-- END: Articles List -->
<!-- BEGIN: For Whom Section -->
<section class="px-8 py-16 text-center">
<p class="text-[9px] font-medium leading-relaxed uppercase tracking-wide mb-12">
        МЫ УБЕЖДЕНЫ, ЧТО КАЖДЫЙ УСПЕШНЫЙ<br/>
        БИЗНЕС НАЧИНАЕТСЯ С ЧЕЛОВЕКА.<br/>
        ПОЭТОМУ РАССКАЗЫВАЕМ НЕ ТОЛЬКО О<br/>
        КОМПАНИЯХ И ПРОЕКТАХ, НО ПРЕЖДЕ<br/>
        ВСЕГО О ЛЮДЯХ, КОТОРЫЕ ИХ СОЗДАЛИ.
      </p>
<div class="flex justify-center items-end">
<h2 class="font-condensed font-black text-6xl uppercase leading-none tracking-tighter text-black flex flex-col items-start">
<span>ДЛЯ</span>
<span class="pl-8">КОГО</span>
</h2>
</div>
</section>
<!-- END: For Whom Section -->
<!-- BEGIN: Contact Form Section -->
<section class="bg-[#db2a00] p-6 text-white pb-12">
<h2 class="font-condensed font-black text-5xl leading-[0.85] uppercase mb-2">
        СТАТЬ<br/>УЧАСТНИКОМ
      </h2>
<p class="text-[10px] font-bold uppercase tracking-widest mb-8">ЗАПОЛНИТЕ ВАШИ ДАННЫЕ ДЛЯ СВЯЗИ</p>
<form class="space-y-6">
<div>
<input class="w-full bg-transparent border-0 border-b border-white/50 text-white placeholder-white/80 focus:ring-0 focus:border-white px-0 py-2 text-xs" placeholder="Ваше имя*" required="" type="text"/>
</div>
<div class="mb-8">
<input class="w-full bg-transparent border-0 border-b border-white/50 text-white placeholder-white/80 focus:ring-0 focus:border-white px-0 py-2 text-xs" placeholder="Номер телефона*" required="" type="tel"/>
</div>
<button class="w-full border border-white text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-primary transition-colors" type="submit">
          ОТПРАВИТЬ
        </button>
<button class="w-full bg-white text-primary text-[10px] font-bold uppercase tracking-widest py-3 mt-2 hover:bg-gray-100 transition-colors" type="button">
          УЗНАТЬ ПОДРОБНЕЕ
        </button>
</form>
</section>
<!-- END: Contact Form Section -->
</main>
<!-- BEGIN: Footer -->
<footer class="bg-white pt-8 pb-4 px-4 border-t border-gray-200">
<div class="flex justify-between mb-12">
<div class="space-y-2">
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">МЕСТА</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">БИОГРАФИЯ</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">ИНТЕРВЬЮ</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">СТАТЬИ</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">БЛОГ</a>
</div>
<div class="space-y-2 text-right">
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">TELEGRAM</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">INSTAGRAM*</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">VK</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">YOUTUBE</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">PINTEREST</a>
<a class="block text-[8px] font-bold uppercase tracking-widest" href="#">DZEN</a>
</div>
</div>
<div class="mb-8">
<p class="text-[10px] font-medium mb-3">готовы к обсуждению проекта ?</p>
<a class="inline-flex bg-primary text-white text-[10px] font-bold px-3 py-1.5 items-center gap-1 uppercase tracking-wider" href="#">
            СТАТЬ ГЕРОЕМ [ ↗ ]
        </a>
</div>
<div class="flex justify-between text-[8px] text-gray-500 uppercase tracking-widest mt-8">
<a href="#">ПОЛИТИКА<br/>КОНФ-ТИ</a>
<a class="text-center" href="#">ПОЧТА<br/>НАША</a>
<span class="text-right">ИП<br/>БАТАГОВ</span>
</div>
</footer>
<!-- END: Footer -->
<style>
    /* Utility to hide scrollbar for horizontal scrolling areas */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  </style>
</body></html>
```
