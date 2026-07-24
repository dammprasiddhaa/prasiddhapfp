class ImageSlider {
    constructor(moduleSelector) {
        this.module = document.querySelector(moduleSelector);
        if (!this.module) return;

        this.track = this.module.querySelector('.slides');
        this.originalSlides = Array.from(this.track.querySelectorAll('.slide'));
        this.prevBtn = this.module.querySelector('.prev-btn');
        this.nextBtn = this.module.querySelector('.next-btn');
        this.dotsContainer = this.module.querySelector('.slider-dots');

        this.slideCount = this.originalSlides.length;
        this.currentIndex = 1; 
        this.isAnimating = false; 
        this.dots = [];

        this.init();
    }

    init() {
        this.setupDots();
        this.setupInfiniteLoopClones();
        this.bindEvents();
        this.updateView(false);
    }

    setupDots() {
        this.originalSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Maps to image ${index + 1}`);
            
            dot.addEventListener('click', () => {
                if (this.isAnimating) return;
                this.currentIndex = index + 1; 
                this.updateView(true);
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    setupInfiniteLoopClones() {
        const firstClone = this.originalSlides[0].cloneNode(true);
        const lastClone = this.originalSlides[this.slideCount - 1].cloneNode(true);

        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.originalSlides[0]);
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.move(1));
        this.prevBtn.addEventListener('click', () => this.move(-1));
        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());
    }

    move(direction) {
        if (this.isAnimating) return; 
        this.currentIndex += direction;
        this.updateView(true);
    }

    updateView(animate) {
        if (animate) {
            this.track.style.transition = 'transform 0.4s ease-in-out';
            this.isAnimating = true;
        } else {
            this.track.style.transition = 'none';
        }

        const offset = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${offset}%)`;

        this.updateActiveDot();
    }

    updateActiveDot() {
        this.dots.forEach(dot => dot.classList.remove('active'));

        let dotIndex = this.currentIndex - 1;

        if (this.currentIndex === this.slideCount + 1) dotIndex = 0;
        if (this.currentIndex === 0) dotIndex = this.slideCount - 1;

        if (this.dots[dotIndex]) {
            this.dots[dotIndex].classList.add('active');
        }
    }

    handleTransitionEnd() {
        this.isAnimating = false; 

        if (this.currentIndex === this.slideCount + 1) {
            this.currentIndex = 1;      
            this.updateView(false);     
        }
        else if (this.currentIndex === 0) {
            this.currentIndex = this.slideCount; 
            this.updateView(false);              
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider('#portfolio-slider');
});