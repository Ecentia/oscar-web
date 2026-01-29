// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup GSAP & ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Setup Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Conectar Lenis con ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });

    // 3. Preloader Animation
    let counter = 0;
    const counterElement = document.getElementById('counter');
    const loader = document.querySelector('.loader');

    const interval = setInterval(() => {
        counter += Math.floor(Math.random() * 5) + 1;
        if (counter > 100) {
            counter = 100;
            clearInterval(interval);
            // Salida del loader
            gsap.to(loader, {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
                onComplete: initAnimations
            });
        }
        counterElement.innerText = counter;
    }, 50);

    // 4. Main Animations Function
    function initAnimations() {
        
        // A. Hero Title Reveal
        const tlHero = gsap.timeline();
        tlHero.from(".line", {
            y: 200,
            skewY: 10,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "power3.out"
        });

        // B. Scrolling Text (Marquee)
        gsap.to(".scrolling-text", {
            xPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".manifesto-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
            }
        });

        // C. Parallax Images (Manifesto & Tour)
        gsap.utils.toArray(".image-parallax img").forEach(img => {
            gsap.to(img, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // D. Background Color Change System
        // Cambia el tema de la web según la sección
        const sections = document.querySelectorAll('[data-bgcolor]');
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => updateColors(section),
                onEnterBack: () => updateColors(section)
            });
        });

        function updateColors(section) {
            const bgColor = section.dataset.bgcolor;
            const textColor = section.dataset.textcolor;
            
            gsap.to("body", {
                backgroundColor: bgColor,
                color: textColor,
                duration: 0.5
            });
        }

        // E. Tour Cards Stagger Effect
        gsap.from(".tour-card", {
            y: 100,
            opacity: 0,
            rotation: 5,
            stagger: 0.3,
            scrollTrigger: {
                trigger: ".cards-container",
                start: "top 70%",
                end: "bottom center",
                scrub: 1
            }
        });

        // F. Crowd Text Scale
        gsap.from(".crowd-text", {
            scale: 0.5,
            opacity: 0,
            scrollTrigger: {
                trigger: ".crowd-section",
                start: "top center",
                end: "center center",
                scrub: true
            }
        });
    }

    // 5. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
        gsap.to(follower, {x: e.clientX, y: e.clientY, duration: 0.3});
    });

    // 6. Glitch Effect on Fast Scroll (Experimental)
    let lastScrollY = 0;
    lenis.on('scroll', ({ scroll }) => {
        const velocity = Math.abs(scroll - lastScrollY);
        lastScrollY = scroll;

        // Si la velocidad es alta, aplicar skew/glitch
        if (velocity > 15) {
            gsap.to(".glitch-target", {
                skewY: velocity * 0.1,
                filter: "hue-rotate(90deg)",
                duration: 0.1
            });
        } else {
            gsap.to(".glitch-target", {
                skewY: 0,
                filter: "hue-rotate(0deg)",
                duration: 0.3
            });
        }
    });
});