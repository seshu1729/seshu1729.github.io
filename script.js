document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.page');
  if (page) requestAnimationFrame(() => page.classList.add('visible'));

  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('darkMode', isDark);
    });
  }

  // Smooth scroll function
  const smoothScrollTo = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      history.pushState(null, null, '#' + targetId);

      window.scrollTo({
        top: targetElement.offsetTop - (targetId === 'hero' ? 84 : 0),
        behavior: 'smooth'
      });

      handleAboutPageSections();
    }
  };

  // Update active nav link (for About link)
  const updateActiveNavLink = (targetHash) => {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(a => {
      a.classList.remove('active');
    });

    if (targetHash === 'about-content' || targetHash === 'contact-details') {
      document.querySelector('.nav-about').classList.add('active');
    }
  };

  // Function to handle showing/hiding sections and updating nav link
  const handleAboutPageSections = () => {
    const heroSection = document.getElementById('hero');
    const aboutContentSection = document.getElementById('about-content');
    const currentHash = window.location.hash.substring(1);

    if (heroSection && aboutContentSection) {
      if (currentHash === 'about-content' || currentHash === 'contact-details') {
        heroSection.style.display = 'none';
        aboutContentSection.style.display = 'block';
        updateActiveNavLink('about-content');
      } else { // Default to hero if no hash or unrecognized hash
        heroSection.style.display = 'flex';
        aboutContentSection.style.display = 'none';
        updateActiveNavLink('hero');
      }
    }
  };

  // Handle brand click (top-left name) to scroll to hero
  const brandLink = document.getElementById('brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo('hero');
    });
  }

  // Populate config-driven content
  if (typeof CONFIG !== 'undefined') {
    // Header brand
    document.querySelectorAll('#cfg-name').forEach(el => el.textContent = CONFIG.name);
    document.querySelectorAll('#cfg-title').forEach(el => el.textContent = CONFIG.title);

    const currentFilename = window.location.pathname.split('/').pop().split('#')[0];
    if (currentFilename === 'about.html' || currentFilename === '') {
      // const cardShortBioBig = document.getElementById('card-short-bio-big'); // <--- REMOVE THIS LINE
      // if (cardShortBioBig) cardShortBioBig.textContent = CONFIG.shortBio; // <--- REMOVE THIS LINE

      const cfgHeroCaption = document.getElementById('cfg-hero-caption');
      if (cfgHeroCaption) cfgHeroCaption.textContent = CONFIG.heroCaption;

      const aboutP = document.getElementById('about-p');
      if (aboutP) aboutP.textContent = CONFIG.about;

      // Removed references to cfgNameSmallCard and cfgTitleSmallCard as sidebar card is gone.

      // Skills section
      const skillsExpanded = document.getElementById('skills-expanded');
      if (skillsExpanded && typeof CONFIG.skills !== 'undefined') {
          skillsExpanded.innerHTML = '';
          CONFIG.skills.forEach(group => {
              const groupDiv = document.createElement('div');
              groupDiv.className = 'skills-group';
              groupDiv.innerHTML = `<h4>${group.group}</h4><div class="skills"></div>`;
              const skillsContainer = groupDiv.querySelector('.skills');
              group.items.forEach(skill => {
                  const chip = document.createElement('span');
                  chip.className = 'chip';
                  chip.textContent = skill;
                  skillsContainer.appendChild(chip);
              });
              skillsExpanded.appendChild(groupDiv);
          });
      }

      // Contact section population
      const contactMessage = document.getElementById('contact-message');
      if (contactMessage) contactMessage.textContent = CONFIG.contactMessage;

      const contactPhone = document.getElementById('contact-phone');
      if (contactPhone) contactPhone.textContent = CONFIG.contact.phone;

      const contactEmail = document.getElementById('contact-email');
      if (contactEmail) {
        contactEmail.href = `mailto:${CONFIG.contact.email}`;
        contactEmail.textContent = CONFIG.contact.email;
      }

      const linkGithub = document.getElementById('link-github');
      if (linkGithub && CONFIG.contact.github) {
        linkGithub.href = CONFIG.contact.github;
        linkGithub.textContent = CONFIG.contact.github.replace('https://github.com/', '');
      } else if (linkGithub) {
        linkGithub.parentElement.style.display = 'none';
      }

      const linkLinkedin = document.getElementById('link-linkedin');
      if (linkLinkedin && CONFIG.contact.linkedin) {
        linkLinkedin.href = CONFIG.contact.linkedin;
        linkLinkedin.textContent = CONFIG.contact.linkedin.replace('https://linkedin.com/in/', '').split('/')[0];
      } else if (linkLinkedin) {
        linkLinkedin.parentElement.style.display = 'none';
      }

      // "Hire / Contact" button on About page
      const hireMeBtn = document.getElementById('hire-me');
      if (hireMeBtn) {
          hireMeBtn.addEventListener('click', () => {
              smoothScrollTo('contact-details');
          });
      }

      // "About" nav link
      const aboutNavLink = document.querySelector('.nav-about');
      if (aboutNavLink) {
        aboutNavLink.addEventListener('click', (e) => {
          e.preventDefault();
          smoothScrollTo('about-content');
        });
      }

      // Initial handling of about page sections on load
      handleAboutPageSections();
      // Listen for hash changes to re-evaluate which section to show
      window.addEventListener('hashchange', handleAboutPageSections);
    }
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if (window.AOS) AOS.init({ duration: 900, once: true });
});