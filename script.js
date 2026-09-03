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

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
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
      ctx.globalAlpha = isDark ? 0.65 : 0.45;
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
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
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
   4. Interactive Terminal (Modal CLI)
   ========================================== */
function initTerminal() {
  const modal = document.getElementById('termModal');
  const cmdTrigger = document.getElementById('cmdTrigger');
  const termInput = document.getElementById('termInput');
  const termBody = document.getElementById('termBody');

  if (!modal || !cmdTrigger || !termInput) return;

  function openTerminal() {
    modal.classList.add('active');
    termInput.focus();
  }

  function closeTerminal() {
    modal.classList.remove('active');
  }

  cmdTrigger.addEventListener('click', openTerminal);

  // Keyboard shortcut Ctrl+K or Cmd+K or `~`
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTerminal();
    }
  });

  // Global close terminal function
  window.closeTerminal = closeTerminal;

  // Command Execution Handler
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = termInput.value.trim();
      termInput.value = '';
      if (!rawCmd) return;

      appendTermLine(`guest@dheeraj-ai:~$ ${rawCmd}`, 'command');
      processCommand(rawCmd.toLowerCase());
      termBody.scrollTop = termBody.scrollHeight;
    }
  });

  function appendTermLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = 'term-line';
    if (type === 'command') {
      line.style.color = '#58a6ff';
      line.style.fontWeight = 'bold';
    } else if (type === 'error') {
      line.style.color = '#f85149';
    } else if (type === 'success') {
      line.style.color = '#7ee787';
    } else {
      line.style.color = '#c9d1d9';
    }
    line.innerHTML = text;
    termBody.appendChild(line);
  }

  function processCommand(cmd) {
    const parts = cmd.split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        appendTermLine('Available Commands:', 'success');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">about</span>      - Quick bio summary');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">exp</span>        - Work experience summary');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">pubs</span>       - Research papers & patents count');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">skills</span>     - AI/ML & Engineering skill keywords');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">contact</span>    - Social links & email');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">theme</span>      - Toggle light/dark mode');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">clear</span>      - Clear terminal screen');
        appendTermLine('&nbsp;&nbsp;<span class="term-cmd-highlight">exit</span>       - Close terminal window');
        break;

      case 'about':
        appendTermLine('Sai Dheeraj Gummadi — Software Engineer-3 (AI/ML) @ FactSet.');
        appendTermLine('M.Sc. Data Science (IU Germany) & M.A. Economics (Andhra Univ). 8 IEEE/Springer Papers, 1 Granted US Patent.');
        break;

      case 'exp':
        appendTermLine('• <span class="term-cmd-highlight">FactSet</span> (Jan 2026 - Present): SE-3 AI/ML — Financial Data Extractions');
        appendTermLine('• <span class="term-cmd-highlight">Motorola Solutions</span> (Jul 2024 - Jan 2026): SE-1 AI/ML — RAG & FinOps');
        appendTermLine('• <span class="term-cmd-highlight">Brane Enterprises</span> (Nov 2023 - Jul 2024): Deep Learning Eng — Distilled LLMs & vLLM');
        appendTermLine('• <span class="term-cmd-highlight">HighRadius</span> (Aug 2021 - Oct 2023): Data Scientist — LayoutLM & Document OCR');
        break;

      case 'pubs':
        appendTermLine('1 US Patent Office 18/396,772 Granted (2026).');
        appendTermLine('8 Research Publications across IEEE, Springer, TechRxiv.');
        appendTermLine('Scholar Link: <a href="https://scholar.google.com/citations?user=ERJe5ugAAAAJ&hl=en" target="_blank" style="color:#58a6ff;">Google Scholar Profile</a>');
        break;

      case 'skills':
        appendTermLine('LLMs, RAG, PyTorch, Gemini 1.5, GPT-4o, Ray Serve, vLLM, LayoutLM, YOLO, OpenCV, Kubernetes, Financial Modeling.');
        break;

      case 'contact':
        appendTermLine('Email: dheerajsaigummadi@gmail.com');
        appendTermLine('GitHub: <a href="https://github.com/GSaiDheeraj" target="_blank" style="color:#58a6ff;">GSaiDheeraj</a> | LinkedIn: <a href="https://www.linkedin.com/in/gummadi-saidheeraj/" target="_blank" style="color:#58a6ff;">gummadi-saidheeraj</a>');
        break;

      case 'theme':
        toggleTheme();
        appendTermLine('Switched theme mode!', 'success');
        break;

      case 'clear':
        termBody.innerHTML = '';
        break;

      case 'exit':
        closeTerminal();
        break;

      default:
        appendTermLine(`Command not found: '${mainCmd}'. Type '<span class="term-cmd-highlight">help</span>' for options.`, 'error');
        break;
    }
  }
}
