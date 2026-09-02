/**
 * MINIMALIST DEVELOPER PORTFOLIO - JAVASCRIPT
 * Interactivity: Loss Function Canvas, Live Search, Category Filters, Theme Switcher & Terminal CLI
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursorGlow();
  initSearchAndFilters();
  initTerminal();
});

/* ==========================================
   Cursor Spotlight Glow
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
