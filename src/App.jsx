import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowRight, Instagram, Youtube, Music as MusicIcon, Menu, X, MapPin } from 'lucide-react';

// --- ASSETS & DATA (PLACEHOLDERS DE ALTA CALIDAD PARA DEMO) ---
const ASSETS = {
  heroVideo: "https://videos.pexels.com/video-files/2034988/2034988-hd_1920_1080_30fps.mp4", // Video de DJ/Club
  images: [
    { src: "https://images.unsplash.com/photo-1571266028243-371695039989?q=80&w=1000&auto=format&fit=crop", alt: "Travel Life", tag: "ON TOUR" },
    { src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop", alt: "Vocals", tag: "LIVE PERF" },
    { src: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop", alt: "Crowd Control", tag: "FESTIVAL" },
    { src: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1000&auto=format&fit=crop", alt: "In The Mix", tag: "CLUB" },
    { src: "https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=1000&auto=format&fit=crop", alt: "Paris", tag: "WORLDWIDE" },
  ],
  videos: [
    { src: "https://videos.pexels.com/video-files/8056241/8056241-hd_1920_1080_25fps.mp4", title: "EDC MEXICO", loc: "CDMX" },
    { src: "https://videos.pexels.com/video-files/2649987/2649987-hd_1920_1080_30fps.mp4", title: "MINISTRY OF SOUND", loc: "LONDON" },
    { src: "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4", title: "VANCOUVER TOUR", loc: "CANADA" },
    { src: "https://videos.pexels.com/video-files/4831682/4831682-hd_1920_1080_25fps.mp4", title: "ARENA VIBES", loc: "WORLD" }
  ]
};

// --- HOOKS ---
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) observer.disconnect();
      }
    }, options);

    if (targetRef.current) observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [options]);

  return [targetRef, isIntersecting];
};

// --- COMPONENTS ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.07] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  </div>
);

const CustomCursor = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const moveCursor = (e) => {
      if(cursorRef.current) {
        // Simple follow logic without heavy GSAP
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out will-change-transform"
    >
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if(prev >= 100) {
          clearInterval(interval);
          setFinished(true);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] bg-black text-white flex items-center justify-center transition-transform duration-[800ms] cubic-bezier(0.76, 0, 0.24, 1) ${finished ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="relative">
        <span className="text-[20vw] font-black leading-none font-sans tracking-tighter tabular-nums">
          {count}
        </span>
        <span className="absolute top-0 -right-12 text-xl font-bold">%</span>
      </div>
    </div>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-40 mix-blend-difference text-white">
        <a href="#" className="text-xl md:text-2xl font-black tracking-tighter uppercase relative z-50">Oscar Herrera</a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest uppercase">
          {['About', 'Gallery', 'Music', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gray-400 transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden z-50 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-[45] flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {['About', 'Gallery', 'Music', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-5xl font-black uppercase text-white hover:text-gray-500 transition-all">
            {item}
          </a>
        ))}
      </div>
    </>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Hero Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video 
          autoPlay muted loop playsInline 
          className="w-full h-full object-cover scale-105"
        >
          <source src={ASSETS.heroVideo} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 flex flex-col items-center w-full px-4 mix-blend-screen">
        <h1 className={`text-[15vw] md:text-[13vw] leading-[0.85] font-black text-white text-center uppercase tracking-tighter transition-all duration-1000 ease-out ${loaded ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-32 opacity-0 blur-lg'}`}>
          Oscar<br />Herrera
        </h1>
        
        <div className={`mt-10 flex items-center gap-6 overflow-hidden transition-all duration-1000 delay-300 ease-out ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="h-[1px] w-12 md:w-32 bg-white/80"></div>
          <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/90">Global DJ & Producer</p>
          <div className="h-[1px] w-12 md:w-32 bg-white/80"></div>
        </div>
      </div>

      <div className="absolute bottom-10 z-20 animate-bounce text-white">
         <ArrowRight className="rotate-90" size={32} />
      </div>
    </section>
  );
};

const Marquee = ({ text, reverse }) => (
  <div className="w-full bg-[#050505] border-y border-white/10 py-6 md:py-10 overflow-hidden flex relative z-20">
    <div className={`flex whitespace-nowrap animate-marquee ${reverse ? 'reverse' : ''}`}>
      {[...Array(8)].map((_, i) => (
        <span key={i} className="text-6xl md:text-8xl font-black uppercase text-transparent px-8 transition-colors hover:text-white duration-500 cursor-default" style={{ WebkitTextStroke: '1px #555' }}>
          {text} <span className="text-white mx-4">•</span>
        </span>
      ))}
    </div>
  </div>
);

const About = () => {
  const [ref, visible] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="min-h-screen bg-[#050505] text-white flex items-center py-20 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Image Side */}
        <div ref={ref} className={`relative aspect-[3/4] md:aspect-[4/5] overflow-hidden ${visible ? 'reveal-image' : 'opacity-0'}`}>
          <img 
            src={ASSETS.images[2].src} 
            alt="Oscar Profile" 
            className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100" 
          />
          <div className="absolute top-0 left-0 bg-blue-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest z-10">
            Est. 202X
          </div>
        </div>

        {/* Text Side */}
        <div className={`flex flex-col gap-8 ${visible ? 'animate-slide-up' : 'opacity-0 translate-y-20'}`}>
          <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
            Beyond<br /><span className="text-outline text-transparent" style={{ WebkitTextStroke: '2px white' }}>The Beat.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg font-light">
            Desde los clubes underground de Madrid hasta los escenarios masivos de <span className="text-white font-bold">EDC México</span> y <span className="text-white font-bold">Ministry of Sound</span>.
            <br/><br/>
            Oscar Herrera no solo pone música; construye atmósferas. Una fusión de técnica precisa y energía cruda que conecta fronteras.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-4">
            <div>
              <span className="block text-4xl font-black">15+</span>
              <span className="text-xs uppercase text-gray-500 tracking-widest">Países</span>
            </div>
            <div>
              <span className="block text-4xl font-black">100K+</span>
              <span className="text-xs uppercase text-gray-500 tracking-widest">Asistentes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  return (
    <section id="gallery" className="bg-[#080808] py-20 text-white overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Visual Tour</h2>
        <span className="hidden md:block font-mono text-xs text-gray-500 uppercase tracking-widest">Swipe to explore →</span>
      </div>
      
      <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide">
        {ASSETS.images.map((img, i) => (
          <div key={i} className="snap-center shrink-0 relative w-[85vw] md:w-[500px] aspect-[4/5] bg-gray-900 group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 mix-blend-color opacity-0 group-hover:opacity-50 transition-opacity z-10 duration-500"></div>
            <img 
              src={img.src} 
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-xs font-mono bg-white text-black px-2 py-1 mb-2 inline-block">{img.tag}</span>
              <h3 className="text-3xl font-black uppercase leading-none">{img.alt}</h3>
            </div>
            <span className="absolute top-4 right-4 text-6xl font-black text-white/5 z-0 group-hover:text-white/20 transition-colors">
              0{i+1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Music = () => (
  <section id="music" className="bg-black text-white py-24 px-6 md:px-12">
    <div className="container mx-auto">
      <h2 className="text-6xl md:text-[10vw] font-black uppercase text-center leading-none mb-20 text-transparent text-outline cursor-default hover:text-white transition-colors duration-500" style={{ WebkitTextStroke: '2px white' }}>
        Live Sets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ASSETS.videos.map((vid, i) => (
          <div key={i} className="group relative aspect-video bg-[#111] overflow-hidden">
            <video 
              src={vid.src} 
              muted loop playsInline 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105"
              onMouseOver={e => e.target.play()}
              onMouseOut={e => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-10">
              <div className="flex justify-between items-start">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Live</span>
                <MapPin size={16} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">{vid.title}</h3>
                <p className="text-sm text-gray-400 uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">{vid.loc}</p>
              </div>
            </div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center backdrop-blur-sm">
                <Play fill="white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => {
  const [ref, visible] = useIntersectionObserver({ threshold: 0.5 });
  
  return (
    <footer id="contact" ref={ref} className="bg-blue-700 text-white min-h-[80vh] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <img src={ASSETS.images[0].src} className="w-full h-full object-cover grayscale mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-20">
        <h2 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter mb-8">
          Let's<br/>Work
        </h2>
        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a href="mailto:booking@oscarherrera.com" className="text-2xl md:text-4xl font-bold border-b-2 border-white pb-2 hover:text-black hover:border-black transition-colors inline-block mb-4">
            booking@oscarherrera.com
          </a>
          <p className="text-xl md:text-2xl font-mono">+34 600 000 000</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 border-t border-white/20 pt-8">
        <div className="flex gap-6">
          {[Instagram, Youtube, MusicIcon].map((Icon, i) => (
            <a key={i} href="#" className="w-12 h-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-blue-700 transition-colors">
              <Icon size={20} />
            </a>
          ))}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-widest opacity-70">© 2024 Oscar Herrera</p>
          <p className="text-[10px] uppercase tracking-widest opacity-50">Designed for the Night</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Syne:wght@400;700;800&display=swap');
        
        :root {
          --font-display: 'Syne', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        
        html { scroll-behavior: smooth; }
        body { font-family: var(--font-body); background: #000; cursor: none; margin: 0; padding: 0; }
        h1, h2, h3, nav { font-family: var(--font-display); }
        
        /* Animations */
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-marquee.reverse { animation-direction: reverse; }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .reveal-image { clip-path: inset(0 0 0 0); transition: clip-path 1.2s cubic-bezier(0.76, 0, 0.24, 1); }
        
        .animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <NoiseOverlay />
      <CustomCursor />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <main className="w-full relative overflow-x-hidden">
          <Navigation />
          <Hero />
          <Marquee text="WORLD TOUR • MEXICO • LONDON • PARIS" />
          <About />
          <Marquee text="HOUSE • TECHNO • VIBES • ENERGY" reverse />
          <Gallery />
          <Music />
          <Footer />
        </main>
      )}
    </>
  );
};

export default App;