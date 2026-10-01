/**
 * MINIMALIST DEVELOPER PORTFOLIO - JAVASCRIPT
 * Interactivity: Loss Function Canvas, Live Search, Category Filters, Theme Switcher & Terminal CLI
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursorGlow();
  initPhysicsCanvas();
  initCollapsibleSections();
  initSearchAndFilters();
  initTerminal();
  initProofLightbox();
});

/* ==========================================
   Collapsible Sections Logic
   ========================================== */
function initCollapsibleSections() {
  const headers = document.querySelectorAll('.collapsible-header');

  headers.forEach(header => {
    const sectionBlock = header.closest('.section-block');
    const toggleIcon = header.querySelector('.toggle-icon');

    function toggleSection() {
      if (!sectionBlock) return;
      sectionBlock.classList.toggle('collapsed');
      const isExpanded = !sectionBlock.classList.contains('collapsed');
      header.setAttribute('aria-expanded', isExpanded.toString());
      if (toggleIcon) {
        toggleIcon.textContent = isExpanded ? '▼' : '►';
      }
    }

    header.addEventListener('click', toggleSection);

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection();
      }
    });
  });
}

/* ==========================================
   Cursor Spotlight Glow & Physics Canvas
   ========================================== */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  window.addEventListener('pointermove', (e) => {
    glow.style.setProperty('--mouse-x', `${e.clientX}px`);
    glow.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}

function initPhysicsCanvas() {
  const canvas = document.getElementById('bgPhysicsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, active: false, radius: 180 };

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  const particleCount = Math.min(Math.floor((width * height) / 32000), 42);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      baseVx: (Math.random() - 0.5) * 0.8,
      baseVy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1.2,
      color: ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#38BDF8'][Math.floor(Math.random() * 5)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineBaseColor = isDark ? '66, 133, 244' : '26, 115, 232';

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Physics repelling logic from mouse cursor
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 3.5;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.4;
          p.vy += Math.sin(angle) * force * 0.4;
        }
      }

      // Smooth damping back to drift speed
      p.vx += (p.baseVx - p.vx) * 0.03;
      p.vy += (p.baseVy - p.vy) * 0.03;

      p.x += p.vx;
      p.y += p.vy;

      // Screen edge bounce
      if (p.x < 0) { p.x = 0; p.vx *= -1; p.baseVx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; p.baseVx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; p.baseVy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; p.baseVy *= -1; }

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = isDark ? 0.4 : 0.28;
      ctx.fill();

      // Draw connection lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const lineAlpha = (1 - dist / 130) * (isDark ? 0.18 : 0.12);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lineBaseColor}, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   1. Theme Toggle & Persistence
   ========================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const iconSpan = document.querySelector('.theme-icon');
  if (iconSpan) {
    iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}


/* ==========================================
   3. Search & Filter Functionality
   ========================================== */
function initSearchAndFilters() {
  // Papers Search & Category Filters
  const paperSearch = document.getElementById('paperSearch');
  const paperFilterPills = document.querySelectorAll('#paperFilterPills .filter-pill');
  const paperItems = document.querySelectorAll('.paper-item');

  let currentPaperCategory = 'all';

  function filterPapers() {
    const query = paperSearch ? paperSearch.value.toLowerCase() : '';

    paperItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const text = item.textContent.toLowerCase();

      const matchesCategory = (currentPaperCategory === 'all') || (category === currentPaperCategory);
      const matchesSearch = text.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (paperSearch) {
    paperSearch.addEventListener('input', filterPapers);
  }

  paperFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      paperFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPaperCategory = pill.getAttribute('data-filter');
      filterPapers();
    });
  });

  // Projects Search
  const projectSearch = document.getElementById('projectSearch');
  const projectItems = document.querySelectorAll('.project-item');

  if (projectSearch) {
    projectSearch.addEventListener('input', () => {
      const query = projectSearch.value.toLowerCase();
      projectItems.forEach(item => {
        const keywords = (item.getAttribute('data-keywords') || '') + ' ' + item.textContent;
        if (keywords.toLowerCase().includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================
   4. Proof Lightbox Modal Handler
   ========================================== */
function initProofLightbox() {
  const modal = document.getElementById('proofModal');
  const overlay = document.getElementById('proofModalOverlay');
  const closeBtn = document.getElementById('proofModalClose');
  const modalImg = document.getElementById('proofModalImg');
  const modalTitle = document.getElementById('proofModalTitle');
  const modalCaption = document.getElementById('proofModalCaption');
  const proofBtns = document.querySelectorAll('.proof-btn');

  if (!modal || !modalImg) return;

  function openProofModal(imgSrc, titleText, captionText) {
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = titleText || 'Verified Testimonial Proof';
    if (modalCaption) modalCaption.textContent = captionText || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeProofModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  proofBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-proof-img');
      const titleText = btn.getAttribute('data-proof-title');
      const captionText = btn.getAttribute('data-proof-caption');
      if (imgSrc) {
        openProofModal(imgSrc, titleText, captionText);
      }
    });
  });

  if (overlay) overlay.addEventListener('click', closeProofModal);
  if (closeBtn) closeBtn.addEventListener('click', closeProofModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProofModal();
    }
  });
}

/* ==========================================
   5. Dheeraj AI — chat assistant (chat bubbles, no bash)
   ========================================== */
function initTerminal() {
  const modal = document.getElementById('termModal');
  const cmdTrigger = document.getElementById('cmdTrigger');
  const chatFab = document.getElementById('chatFab');
  const termInput = document.getElementById('termInput');
  const termBody = document.getElementById('termBody');
  const chatSend = document.getElementById('chatSend');
  const chatQuick = document.getElementById('chatQuick');
  const heroSearch = document.getElementById('heroSearch');

  if (heroSearch) {
    heroSearch.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const q = heroSearch.value.trim().toLowerCase();
      if (!q) return;
      const paperSearch = document.getElementById('paperSearch');
      const projectSearch = document.getElementById('projectSearch');
      if (paperSearch) {
        paperSearch.value = heroSearch.value;
        paperSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (projectSearch) {
        projectSearch.value = heroSearch.value;
        projectSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const target = document.getElementById('projects') || document.getElementById('publications');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (!modal || !termInput || !termBody) return;

  function openTerminal() {
    modal.classList.add('active');
    if (!termBody.dataset.greeted) {
      termBody.dataset.greeted = '1';
      botSay('Hey, I\'m <strong>Dheeraj AI</strong> ✦ — ask me about roles, research, books, or where to follow along.');
      botSay('Try: “experience”, “papers”, “books”, “contact”, or “instagram”.');
    }
    setTimeout(() => termInput.focus(), 60);
  }

  function closeTerminal() {
    modal.classList.remove('active');
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openTerminal);
  if (chatFab) chatFab.addEventListener('click', () => {
    modal.classList.contains('active') ? closeTerminal() : openTerminal();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) closeTerminal();
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeTerminal(); });

  window.closeTerminal = closeTerminal;

  function scrollDown() { termBody.scrollTop = termBody.scrollHeight; }

  function addBubble(html, who) {
    const row = document.createElement('div');
    row.className = 'chat-row ' + who;
    const b = document.createElement('div');
    b.className = 'chat-bubble';
    b.innerHTML = html;
    row.appendChild(b);
    termBody.appendChild(row);
    scrollDown();
  }
  function botSay(html) { addBubble(html, 'bot'); }

  function send(text) {
    const msg = (text !== undefined ? text : termInput.value).trim();
    if (!msg) return;
    termInput.value = '';
    addBubble(msg.replace(/</g, '&lt;'), 'user');
    setTimeout(() => botSay(answerFor(msg.toLowerCase())), 220);
  }

  termInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  if (chatSend) chatSend.addEventListener('click', () => send());
  if (chatQuick) chatQuick.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-q]');
    if (btn) send(btn.getAttribute('data-q'));
  });

  function answerFor(q) {
    if (/(hi|hello|hey|yo)\b/.test(q)) return 'Hey! Ask me about <strong>experience</strong>, <strong>papers</strong>, <strong>books</strong>, or <strong>contact</strong>.';
    if (q.includes('about') || q.includes('yourself') || q.includes('who are')) return '<strong>Sai Dheeraj Gummadi</strong> — Lead Data Scientist @ The Hartford. Applied AI: LLMs, RAG, document intelligence. 2 master\'s, 8 papers, 1 US patent, 2 books.';
    if (q.includes('exp') || q.includes('work') || q.includes('role') || q.includes('job')) return '<strong>The Hartford</strong> (now) · <strong>FactSet</strong> SE-3 AI/ML · <strong>Motorola</strong> RAG + FinOps · <strong>Brane</strong> distilled LLMs · <strong>HighRadius</strong> LayoutLM + OCR. Scroll to Experience for details.';
    if (q.includes('paper') || q.includes('research') || q.includes('pub') || q.includes('patent')) return '1 granted US patent (18/396,772) + 8 papers across IEEE, Springer, TechRxiv. See the Research section or <a href="https://scholar.google.com/citations?user=ERJe5ugAAAAJ&hl=en" target="_blank">Scholar</a>.';
    if (q.includes('book')) return '2 books on Amazon: <strong>Cracking Data Science Case Study Interview</strong> + <strong>The Complete Hands-On Language Models Playbook</strong>. See Books & Talks.';
    if (q.includes('skill')) return 'LLMs · RAG · PyTorch · Gemini · GPT-4o · vLLM · LayoutLM · YOLO · K8s · FinOps · quant modeling.';
    if (q.includes('insta') || q.includes('creator') || q.includes('follow') || q.includes('reel')) return 'Follow <a href="https://www.instagram.com/saidheeraj.ai/" target="_blank">@saidheeraj.ai</a> — 60-second LLM breakdowns, paper-to-prod notes, career playbooks.';
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('collab')) return 'Email: dheerajsaigummadi@gmail.com · <a href="https://www.instagram.com/saidheeraj.ai/" target="_blank">Instagram</a> · <a href="https://www.linkedin.com/in/gummadi-saidheeraj/" target="_blank">LinkedIn</a> · <a href="https://github.com/GSaiDheeraj" target="_blank">GitHub</a>';
    if (q.includes('theme') || q.includes('dark') || q.includes('light')) { toggleTheme(); return 'Done — theme switched. Minimal looks good either way.'; }
    if (q.includes('thank')) return 'Anytime! Want papers, projects, or contact?';
    return 'I can help with <strong>about, experience, research, books, skills, instagram,</strong> or <strong>contact</strong> — what do you want to know?';
  }
}
