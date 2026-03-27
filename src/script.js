// Hero Slideshow Implementation
class HeroSlideshow {
    constructor() {
        this.heroElement = document.getElementById('heroSlideshow');
        this.images = JSON.parse(this.heroElement.getAttribute('data-images'));
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds between slides
        
        this.init();
    }

    init() {
        this.setupDots();
        this.setBackgroundImage(this.currentIndex);
        this.attachEventListeners();
        this.startAutoPlay();
    }

    setupDots() {
        const dotsContainer = this.heroElement.querySelector('.hero-dots');
        dotsContainer.innerHTML = ''; // Clear existing dots
        
        this.images.forEach((image, index) => {
            const dot = document.createElement('div');
            dot.className = 'hero-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    setBackgroundImage(index) {
        // Ensure index is within bounds
        this.currentIndex = (index + this.images.length) % this.images.length;
        const imagePath = this.images[this.currentIndex];
        this.heroElement.style.backgroundImage = `url('${imagePath}')`;
        this.updateDots();
    }

    updateDots() {
        const dots = this.heroElement.querySelectorAll('.hero-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.setBackgroundImage(this.currentIndex + 1);
        this.resetAutoPlay();
    }

    prevSlide() {
        this.setBackgroundImage(this.currentIndex - 1);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.setBackgroundImage(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    attachEventListeners() {
        const leftArrow = this.heroElement.querySelector('.hero-arrow-left');
        const rightArrow = this.heroElement.querySelector('.hero-arrow-right');

        leftArrow.addEventListener('click', () => this.prevSlide());
        rightArrow.addEventListener('click', () => this.nextSlide());

        // Pause autoplay on hover
        this.heroElement.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        // Resume autoplay on mouse leave
        this.heroElement.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlideshow();
});
