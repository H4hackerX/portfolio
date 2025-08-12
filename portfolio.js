document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Project Slider
    const sliderTrack = document.querySelector('.project-track');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let cardWidth = projectCards[0].offsetWidth + 20; // width + gap
    let currentPosition = 0;
    let currentSlide = 0;
    let autoSlideInterval;
    
    // Create dots
    projectCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Update slider position
    function updateSlider() {
        sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        currentPosition = -(index * cardWidth);
        updateSlider();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < projectCards.length - 1) {
            currentSlide++;
            currentPosition -= cardWidth;
            updateSlider();
        } else {
            // Loop back to first slide
            currentSlide = 0;
            currentPosition = 0;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            currentPosition += cardWidth;
            updateSlider();
        } else {
            // Loop to last slide
            currentSlide = projectCards.length - 1;
            currentPosition = -(currentSlide * cardWidth);
            updateSlider();
        }
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cardWidth = projectCards[0].offsetWidth + 20;
        currentPosition = -(currentSlide * cardWidth);
        updateSlider();
    });
    
    // Start auto sliding
    startAutoSlide();
    
    // Pause auto sliding on hover
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});

   emailjs.init('xfZtZP-7u-Ekpg7gu');
  
  document.querySelector('.contact-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    // Show loading state
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
      const templateParams = {
        from_name: document.getElementById('from_name').value.trim(),
        from_email: document.getElementById('from_email').value.trim(),
        to_email: document.getElementById('to_email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        cc_email: document.getElementById('cc_email').value.trim() || undefined,
        bcc_email: document.getElementById('bcc_email').value.trim() || undefined
      };
      
      // Validate email formats
      if (!isValidEmail(templateParams.from_email)) throw new Error('Invalid sender email');
      if (!isValidEmail(templateParams.to_email)) throw new Error('Invalid recipient email');
      if (templateParams.cc_email && !areAllEmailsValid(templateParams.cc_email)) {
        throw new Error('Invalid CC email format');
      }
      if (templateParams.bcc_email && !areAllEmailsValid(templateParams.bcc_email)) {
        throw new Error('Invalid BCC email format');
      }
      
      const response = await emailjs.send(
        'service_v2ii4qo', 
        'template_5kw4u0y', 
        templateParams
      );
      
      alert('Message sent successfully!');
      document.querySelector('.contact-form').reset();
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to send: ${error.message || 'Please try again later.'}`);
    } finally {
      // Reset button state
      btnText.style.display = 'inline-block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
  
  // Helper functions
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function areAllEmailsValid(emailsString) {
    const emails = emailsString.split(',').map(e => e.trim());
    return emails.every(email => isValidEmail(email));
  }