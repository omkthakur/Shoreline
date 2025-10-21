document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');

    // Check if the preloader has been shown in this session
    if (sessionStorage.getItem('preloaderShown')) {
        // If it has been shown, hide it immediately without animation
        if(preloader) {
            preloader.style.display = 'none';
        }
    } else {
        // If it's the first visit of the session, show it and then hide it
        if(preloader) {
            // Wait for a set time (e.g., 4 seconds) before fading out
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 7500); // Duration in milliseconds (adjust to match your video length)

            // Set a flag in session storage so it doesn't show again
            sessionStorage.setItem('preloaderShown', 'true');
        }
    }


    // --- Enhanced Slideshow Logic ---
    const allSlideshows = document.querySelectorAll('.slideshow-container');

    allSlideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.dot');
        const prevBtn = slideshow.querySelector('.prev');
        const nextBtn = slideshow.querySelector('.next');
        let currentSlide = 0;
        let slideInterval;

        function moveToSlide(n) {
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            if (dots.length > 0) dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            moveToSlide(currentSlide + 1);
        }

        function prevSlide() {
            moveToSlide(currentSlide - 1);
        }
        
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); stopSlideshow(); });
            prevBtn.addEventListener('click', () => { prevSlide(); stopSlideshow(); });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { moveToSlide(index); stopSlideshow(); });
        });
        
        if (slides.length > 1) {
            startSlideshow();
        }
    });


    // --- Stats Counter Logic ---
    const counters = document.querySelectorAll('.counter');
    const runCounter = (counter) => {
        const target = +counter.dataset.target;
        let count = 0;
        const increment = target / 200;
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countersInSection = entry.target.querySelectorAll('.counter');
                countersInSection.forEach(counter => { runCounter(counter); });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    const statsSections = document.querySelectorAll('.stats-counter-section');
    if (statsSections) {
        statsSections.forEach(section => {
            observer.observe(section);
        });
    }
});