"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  // --- STATE YÖNETİMLERİ ---
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("ana-sayfa");
  const [typewriterText, setTypewriterText] = useState("");
  
  // Terminal State'leri
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Ceyhun OS v1.0.0'a hoş geldiniz.",
    "Kullanılabilir komutları görmek için 'help' yazın."
  ]);

  // --- REFS ---
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // --- GEREKLİ VERİLER ---
  const skills = [
    { name: "Python / Yapay Zeka", level: 95 },
    { name: "HTML & CSS / Web Geliştirme", level: 90 },
    { name: "Java & C (MIPS / Mimari)", level: 85 },
    { name: "SQL / Veri Tabanı", level: 80 }
  ];

  const typewriterWords = [
    "Bilgisayar Mühendisliği Öğrencisi",
    "Yapay Zeka Meraklısı",
    "Python Geliştirici",
    "Web Geliştirici"
  ];

  // --- SİHİRLİ LOADER ANİMASYONU (Premium Favori Açılışın) ---
  const loaderSteps = [
    "> Initializing Portfolio...",
    "> Loading Projects & Skills...",
    "> Loading AI Modules (BFS, DFS, A*)...",
    "> Portfolio Loaded Successfully v2.0.0 ✓"
  ];

  useEffect(() => {
    if (loadingStep < loaderSteps.length) {
      const timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loadingStep]);

  // --- GLOBAL CSS VE LOGO GİZLEME ENJEKSİYONU ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const style = document.createElement("style");
      style.innerHTML = `
        nextjs-portal, .nextjs-toast-errors-parent, [id^="nextjs-hot-middleware-error-dev"] { 
          display: none !important; visibility: hidden !important; pointer-events: none !important; 
        }
        html { scroll-behavior: smooth; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // --- MOUSE GLOW & SCROLL PROGRESS EFFECT ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      // Scroll Progress Bar Hesaplama
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Aktif Navigasyon Takibi (Active Navbar)
      const sections = ["ana-sayfa", "hakkimda", "yetenekler", "ilgi-alanlari", "terminal", "iletisim"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- TYPEWRITER EFFECT (Döngüsel Yazı Efekti) ---
  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentWord = typewriterWords[wordIndex];
      
      if (isDeleting) {
        setTypewriterText(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypewriterText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500; // Kelime bittiğinde bekleme süresi
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typewriterWords.length;
        typeSpeed = 400; // Yeni kelimeye geçmeden önce kısa mola
      }

      timeoutId = setTimeout(type, typeSpeed);
    };

    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  // --- INTERAKTİF TERMİNAL KOMUT MOTORU ---
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response = [...terminalHistory, `> ${terminalInput}`];

    if (cmd === "help") {
      response.push("Kullanılabilir komutlar: whoami, skills, projects, contact, clear");
    } else if (cmd === "whoami") {
      response.push("Ceyhun Eren - Bilgisayar Mühendisliği Öğrencisi & Yapay Zeka Meraklısı.");
    } else if (cmd === "skills") {
      response.push("Python/Yapay Zeka: %95", "Web Geliştirme (Next.js/Tailwind): %90", "Java & C (MIPS Mimari): %85", "SQL Veri Tabanı: %80");
    } else if (cmd === "projects") {
      response.push("4 Proje Listelendi:", "- AI Search Algorithms (BFS, DFS, A*)", "- MIPS Pipeline CPU Simulator", "- Portfolio V2 (Şu an buradasınız)", "- Data Analysis Dashboard");
    } else if (cmd === "contact") {
      response.push("Instagram: @cyhnern", "GitHub: github.com/Cyhnern", "E-posta: cyhnern9@gmail.com");
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else {
      response.push(`'${cmd}' komutu bulunamadı. Yardım almak için 'help' yazın.`);
    }

    setTerminalHistory(response);
    setTerminalInput("");

    // Otomatik aşağı kaydır
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // --- SEVİMLİ EASTER EGG ---
  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
      alert("👀 Sırrı Keşfettin! Geliştirici Moduna Hoş Geldin Ceyhun. Başarılar dilerim! 🚀");
      setClickCount(0);
    }
  };

  // --- PREMIUM LOADER EKRANI ---
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0b0f19] text-[#FED141] font-mono flex flex-col items-center justify-center p-6 z-[9999]">
        <div className="w-full max-w-lg bg-[#111827] rounded-xl p-6 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">ceyhun_boot_process.sh</span>
          </div>
          <div className="text-xl font-bold mb-4 text-white">Hello World.</div>
          <div className="space-y-2 text-sm text-slate-300 min-h-[100px]">
            {loaderSteps.slice(0, loadingStep).map((step, idx) => (
              <div key={idx} className={idx === loaderSteps.length - 1 ? "text-green-400 font-bold" : ""}>
                {step}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-xs text-slate-500 mb-1 flex justify-between">
              <span>Loading Portfolio...</span>
              <span>{Math.min(loadingStep * 25, 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#13294B] to-[#FED141] transition-all duration-500"
                style={{ width: `${loadingStep * 25}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen font-sans relative transition-colors duration-500 overflow-hidden ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-[#13294B]'}`}>
      
      {/* 2. MOUSE GLOW EFFECT */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-40 dark:opacity-20 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${darkMode ? 'rgba(254,209,65,0.07)' : 'rgba(19,41,75,0.05)'}, transparent 80%)`
        }}
      />

      {/* 3. SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-slate-200 dark:bg-slate-800">
        <div className="h-full bg-gradient-to-r from-[#13294B] to-[#FED141]" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* FLOATING SHAPES (Arka Plan Çok Hafif Geometrik Şekiller) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-current animate-pulse" />
        <div className="absolute top-2/3 right-12 w-32 h-32 bg-current rotate-45" />
        <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-current rounded-lg" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all backdrop-blur-xl ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/70 border-[#13294B]/10'}`}>
        <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4 font-bold">
          <div onClick={handleLogoClick} className="text-2xl font-black tracking-tight flex items-center gap-2 cursor-pointer select-none">
            Ceyhun EREN<span className="text-[#FED141]">.</span>
          </div>
          
          {/* 4. ACTIVE NAVBAR LINKLERI */}
          <div className="flex items-center gap-6 text-sm">
            {[
              { id: "ana-sayfa", label: "Ana Sayfa" },
              { id: "hakkimda", label: "Hakkımda" },
              { id: "yetenekler", label: "Yetenekler" },
              { id: "ilgi-alanlari", label: "Neler Yapıyorum?" },
              { id: "terminal", label: "Terminal" },
              { id: "iletisim", label: "İletişim" }
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`transition-all flex items-center gap-1 ${activeSection === item.id ? 'text-[#FED141] font-black' : 'hover:opacity-70'}`}
              >
                {activeSection === item.id && <span className="text-xs">►</span>}
                {item.label}
              </a>
            ))}
            
            {/* 13. DARK MODE TOGGLE */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-slate-100 border-slate-200 text-[#13294B]'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="ana-sayfa" className={`pt-32 pb-24 px-6 text-center transition-colors duration-500 relative z-10 ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-[#FED141]'}`}>
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase mb-6 shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B] text-white border-[#13294B]'}`}>
            Portfolyoma Hoş Geldiniz
          </div>
          
          <h1 className={`text-5xl sm:text-7xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-[#13294B]'}`}>
            Merhaba, ben Ceyhun 👋
          </h1>
          
          {/* 5. TYPEWRITER EFFECT */}
          <div className="h-10 mb-4 flex items-center justify-center">
            <h2 className={`text-xl sm:text-2xl font-extrabold border-r-2 pr-1 animate-pulse ${darkMode ? 'text-slate-300 border-[#FED141]' : 'text-[#13294B] border-[#13294B]'}`}>
              {typewriterText}
            </h2>
          </div>
          
          {/* 12. CURRENTLY WORKING ON BADGE */}
          <div className={`text-sm font-bold tracking-wide uppercase px-4 py-2 rounded-full shadow-sm mb-8 flex items-center gap-2 ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white/60 text-[#13294B]'}`}>
            <span>🚀 Currently Working On:</span>
            <span className="text-blue-600 dark:text-[#FED141] font-black">Portfolio V2</span>
          </div>

          <p className="text-lg font-medium max-w-2xl leading-relaxed opacity-90 mb-10">
            Kod yazıyor, karmaşık algoritmalar üzerine projeler geliştiriyor ve öğrendiklerimi paylaşıyorum. Sitemde teknik notlarıma ve kişisel deneyimlerime göz atabilirsiniz.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#ilgi-alanlari" className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-1 ${darkMode ? 'bg-[#FED141] text-[#13294B] hover:brightness-110' : 'bg-[#13294B] text-white hover:bg-[#13294B]/90'}`}>
              Projelerime Git
            </a>
            <a href="#terminal" className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-1 bg-slate-900 text-white hover:bg-black`}>
              Terminali Aç
            </a>
          </div>
        </div>
      </section>

      {/* HAKKIMDA BÖLÜMÜ */}
      <section id="hakkimda" className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex justify-center relative min-h-[400px] items-end group">
          <div className={`w-72 h-[420px] rounded-[2.5rem] rotate-2 shadow-2xl border-4 flex flex-col items-center justify-between p-4 hover:rotate-0 transition-all duration-300 hover:scale-105 cursor-pointer relative z-10 overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#13294B] border-white'}`}>
            <div className="text-xs font-black tracking-widest text-[#FED141] uppercase pt-2">Kişisel Blog / Alan</div>
            <div className="w-full h-[300px] rounded-2xl overflow-hidden">
  <img 
    src="/profil.png" 
    alt="Ceyhun Eren" 
    className="w-full h-full object-cover"
  />
</div>
            <div className={`font-black text-xs px-4 py-1.5 rounded-full shadow-md mb-2 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-[#13294B]'}`}>
              Computer Engineering
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start text-left">
          <div className={`font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B]/5 border-[#13294B]/10 text-[#13294B]'}`}>
            Ben Kimim?
          </div>
          <h3 className="text-3xl font-black mb-6">Her Gün Daha İyisi</h3>
          <div className="space-y-6 text-lg font-medium leading-relaxed opacity-90">
            <p>Bilgisayar mühendisliği öğrencisiyim. Yapay zeka, arama algoritmaları, veri analizi ve işlemci mimarileri üzerine derinlemesine çalışmalar yürütüyorum.</p>
            <p>Boş zamanlarımda ise tribün kültürüyle deşarj oluyor, tutkuyla bağlı olduğum Fenerbahçe'yi takip ediyor ve hayata dair samimi deneyimlerimi burada paylaşıyorum.</p>
          </div>
        </div>
      </section>

      {/* 6. İSTATİSTİKLER BÖLÜMÜ */}
      <section className={`py-12 border-y ${darkMode ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-bold">
          <div>
            <div className="text-4xl font-black text-[#FED141]">0+</div>
            <div className="text-xs uppercase tracking-wider opacity-60 mt-1">Tamamlanan Proje</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#FED141]">0+</div>
            <div className="text-xs uppercase tracking-wider opacity-60 mt-1">GitHub Commit</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#FED141]">0+</div>
            <div className="text-xs uppercase tracking-wider opacity-60 mt-1">Blog Yazısı</div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#FED141]">4</div>
            <div className="text-xs uppercase tracking-wider opacity-60 mt-1">Programlama Dili</div>
          </div>
        </div>
      </section>

      {/* 7. SKILLS SEKSİYONU (Yetenek Havuzu & Animasyonlu Progress Çizgileri) */}
      <section id="yetenekler" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className={`font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B]/5 border-[#13294B]/10 text-[#13294B]'}`}>
            Yetenek Havuzu
          </div>
          <h3 className="text-3xl font-black">Teknik Yetkinlikler</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between font-bold mb-3 text-sm">
                <span>{skill.name}</span>
                <span className="text-[#FED141]">{skill.level}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                {/* Scroll olunca dolsun mantığında çalışan css transition */}
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#13294B] to-[#FED141] transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NELER YAPIYORUM BÖLÜMÜ & 15. PROJE KARTLARI (3D Hover & Glow) */}
      <section id="ilgi-alanlari" className={`py-24 px-6 transition-colors duration-500 relative z-10 ${darkMode ? 'bg-slate-900' : 'bg-[#FED141]/10'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className={`font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B]/5 border-[#13294B]/10 text-[#13294B]'}`}>
              Çalışma Alanları
            </div>
            <h3 className="text-3xl font-black">Neler Yapıyorum?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Kart 1: Yapay Zeka */}
            <div className={`border rounded-3xl p-8 shadow-md transition-all duration-300 transform hover:-translate-y-3 hover:shadow-2xl hover:border-[#FED141]/50 group relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="p-4 bg-gradient-to-br from-[#13294B] to-blue-600 rounded-2xl w-fit text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/></svg>
              </div>
              <h4 className="text-2xl font-black mb-4">🧠 Yapay Zeka & Mühendislik</h4>
              <p className="opacity-80 font-medium mb-6 text-sm">Geliştirdiğim yapay zeka arama algoritmaları, işlemci simülatörleri ve veri analiz modelleri.</p>
              <ul className="space-y-2 text-sm font-semibold opacity-90 mb-6">
                <li>• BFS, DFS ve A* Arama Algoritmaları</li>
                <li>• MIPS İşlemci Pipeline Analizörü</li>
                <li>• Overfitting ve Model Optimizasyonu</li>
              </ul>
              <div className="flex gap-3 text-xs font-bold">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">GitHub</span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md">Demo</span>
              </div>
            </div>

            {/* Kart 2: Spor & Tribün */}
            <div className={`border rounded-3xl p-8 shadow-md transition-all duration-300 transform hover:-translate-y-3 hover:shadow-2xl hover:border-[#FED141]/50 group relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="p-4 bg-gradient-to-br from-[#13294B] to-yellow-500 rounded-2xl w-fit text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.886H3.894l5.018 3.646L6.999 18.42 12 14.774l5.001 3.645-1.913-5.887 5.018-3.646h-6.194L12 3Z"/></svg>
              </div>
              <h4 className="text-2xl font-black mb-4">⚽ Spor, Tribün & Deneyimler</h4>
              <p className="opacity-80 font-medium mb-6 text-sm">Beni besleyen aktiviteler, tribün kültürü, 1907 ÜNİFEB çalışmaları ve yaşam günlüğüm.</p>
              <ul className="space-y-2 text-sm font-semibold opacity-90 mb-6">
                <li>• Fenerbahçe Sevdası & Maç Günlükleri</li>
                <li>• ÜNİFEB Üniversite Teşkilat Çalışmaları</li>
                <li>• Sosyal Dinamikler & Deneyim Paylaşımları</li>
              </ul>
              <div className="flex gap-3 text-xs font-bold">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">Oku</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. TERMINAL BÖLÜMÜ (Etkileşimli Gerçekçi Terminal Yapısı) */}
      <section id="terminal" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className={`font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B]/5 border-[#13294B]/10 text-[#13294B]'}`}>
            Developer Console
          </div>
          <h3 className="text-3xl font-black">Etkileşimli Terminal</h3>
        </div>

        <div className="w-full bg-[#0b0f19] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm text-slate-200">
          {/* Üst Bar */}
          <div className="bg-[#111827] px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-xs text-slate-500">ceyhun@ubuntu:~</div>
            <div className="w-10" />
          </div>
          
          {/* Terminal Gövdesi */}
          <div className="p-6 h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
            {terminalHistory.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                {line}
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Input Formu */}
          <form onSubmit={handleTerminalSubmit} className="bg-[#111827] px-6 py-3 flex items-center gap-2 border-t border-slate-800">
            <span className="text-[#FED141] font-bold">ceyhun_os &gt;</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Komut yazın... (örn: help)"
              className="bg-transparent border-none outline-none flex-1 text-white focus:ring-0 p-0"
              autoComplete="off"
            />
          </form>
        </div>
      </section>

      {/* İLETİŞİM BÖLÜMÜ */}
      <section id="iletisim" className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700 text-[#FED141]' : 'bg-[#13294B]/5 border-[#13294B]/10 text-[#13294B]'}`}>
          İletişim Kanalları
        </div>
        <h3 className="text-3xl font-black mb-4">Bir Selam Verin! 🤝</h3>
        <p className="text-lg opacity-80 font-medium mb-10 max-w-md mx-auto">İster teknik konular, ister spor; dilediğiniz zaman aşağıdaki kanallardan ulaşabilirsiniz.</p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://instagram.com/cyhnern" target="_blank" rel="noopener noreferrer" className={`px-5 py-3 rounded-xl font-bold border transition-all transform hover:-translate-y-1 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            Instagram
          </a>
          <a href="https://github.com/Cyhnern" target="_blank" rel="noopener noreferrer" className={`px-5 py-3 rounded-xl font-bold border transition-all transform hover:-translate-y-1 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            GitHub
          </a>
          <a href="mailto:cyhnern9@gmail.com" className={`px-5 py-3 rounded-xl font-bold border transition-all transform hover:-translate-y-1 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            E-posta
          </a>
        </div>
      </section>

      {/* MODERN FOOTER */}
      <footer className={`border-t py-12 px-6 text-center text-sm font-semibold transition-colors duration-500 ${darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
        <div className="max-w-4xl mx-auto space-y-2">
          <p className={`text-base font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-200'}`}>Ceyhun Eren</p>
          <p className="text-xs opacity-75">Computer Engineering Student</p>
          <div className="w-10 h-0.5 mx-auto bg-slate-700 my-4" />
          <p className="text-xs opacity-60">© 2026 • Made with  using React, Next.js & Tailwind CSS</p>
        </div>
      </footer>

    </main>
  );
}