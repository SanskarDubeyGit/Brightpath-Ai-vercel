/* ============================================
   BRIGHTPATH AI — MAIN.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-menu a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuOpen = false;
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = 132; // announcement strip (28px) + navbar (64px) + buffer
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // ACTIVE LINK HIGHLIGHTING ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(function(section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Run once on load

  // ============================================
  // CONTACT FORM SUBMISSION
  // ============================================
  const contactForm = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      formSuccess.style.display = 'none';
      formError.style.display = 'none';

      const formData = new FormData(contactForm);
      const name = formData.get('fullName') || '';
      const email = formData.get('email') || '';

      // Basic validation
      if (!name || !email) {
        formError.textContent = 'Please fill in all required fields.';
        formError.style.display = 'block';
        return;
      }

      // Simulate submission with fetch to Formspree placeholder
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // NOTE: Replace YOUR_FORM_ENDPOINT with your actual Formspree/Web3Forms endpoint
      const FORM_ENDPOINT = 'YOUR_FORM_ENDPOINT';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          company: formData.get('company') || '',
          serviceType: formData.get('serviceType') || '',
          message: formData.get('message') || ''
        })
      })
      .then(function(response) {
        if (response.ok) {
          contactForm.reset();
          formSuccess.style.display = 'block';
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function(err) {
        // Fallback: mailto link
        console.warn('Form submission failed, falling back to mailto:', err);
        window.location.href = 'mailto:brightpathai@gmail.com?subject=Consultation%20Request&body=Name:%20' + encodeURIComponent(name) + '%0AEmail:%20' + encodeURIComponent(email) + '%0AMessage:%20' + encodeURIComponent(formData.get('message') || '');
        formError.textContent = 'Could not submit form. Opening email client as fallback.';
        formError.style.display = 'block';
      })
      .finally(function() {
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }

  // ============================================
  // ENSURE YOUTUBE LINKS OPEN IN NEW TAB
  // ============================================
  document.querySelectorAll('a[href*="youtube.com"]').forEach(function(link) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});