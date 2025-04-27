/**
 * Haupt-JavaScript-Datei für die PI Co Website
 * Steuert das mobile Menü und den Theme-Wechsel (Hell/Dunkel)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM-Elemente auswählen
    const hamburger = document.getElementById('hamburger');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeOverlay = document.getElementById('closeOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Gespeicherte Theme-Einstellung abrufen oder Standardwert verwenden
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Mobiles Menü öffnen
    hamburger.addEventListener('click', () => {
        overlayMenu.classList.add('show');
        document.body.style.overflow = 'hidden'; // Scrollen verhindern, wenn Menü geöffnet ist
    });

    // Mobiles Menü schließen
    closeOverlay.addEventListener('click', () => {
        overlayMenu.classList.remove('show');
        document.body.style.overflow = ''; // Scrollen wieder erlauben
    });

    // Menü schließen, wenn außerhalb des Menüs geklickt wird
    document.addEventListener('click', (e) => {
        if (overlayMenu.classList.contains('show') && 
            !overlayMenu.contains(e.target) && 
            e.target !== hamburger) {
            overlayMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Theme (Hell/Dunkel) wechseln
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Neue Einstellung speichern
    });

    // Menü automatisch schließen, wenn Fenstergröße größer wird (z. B. beim Verlassen des mobilen Modus)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && overlayMenu.classList.contains('show')) {
            overlayMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Funktion zum Setzen des Themes (Hell oder Dunkel)
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
    }

    // Sanftes Scrollen zu den jeweiligen Seitenbereichen (Ankerlinks)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Menü schließen, wenn es geöffnet ist
                if (overlayMenu.classList.contains('show')) {
                    overlayMenu.classList.remove('show');
                    document.body.style.overflow = '';
                }
                
                // Zum Zielbereich scrollen
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Elemente beim Scrollen animieren (Sichtbarkeit beobachten)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Animation aktivieren
            }
        });
    }, observerOptions);

    // Alle Inhaltsbereiche beobachten und vorbereiten
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('fade-in'); // Ausgangszustand für Animation
        observer.observe(section); // Bereich wird beobachtet
    });
});
