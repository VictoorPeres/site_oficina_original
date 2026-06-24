const WHATSAPP_NUMBER = '5500000000000';

window.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initHeaderState();
  initRevealAnimation();
  initContactForm();
});

function initMobileMenu() {
  const menuButton = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuButton || !navMenu) return;

  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuButton.classList.toggle('active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => closeMenu(navMenu, menuButton));
  });
}

function closeMenu(navMenu, menuButton) {
  navMenu.classList.remove('active');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetSelector = anchor.getAttribute('href');
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initHeaderState() {
  const header = document.querySelector('.header');
  if (!header) return;

  const toggleHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
  toggleHeader();
  window.addEventListener('scroll', toggleHeader);
}

function initRevealAnimation() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const vehicle = (data.get('vehicle') || '').toString().trim();
    const service = (data.get('service') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !phone || !service || !message) {
      showToast('Preencha os campos obrigatórios antes de continuar.', 'error');
      return;
    }

    const serviceLabel = getServiceLabel(service);
    const whatsappMessage = [
      'Olá! Vim pelo site da oficina e quero solicitar atendimento.',
      '',
      '*Dados do cliente*',
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      vehicle ? `*Veículo:* ${vehicle}` : null,
      `*Serviço:* ${serviceLabel}`,
      '',
      '*Detalhes do atendimento*',
      message,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener');
    showToast('Redirecionando para o WhatsApp...', 'success');
    form.reset();
  });
}

function getServiceLabel(service) {
  const labels = {
    preventiva: 'Manutenção preventiva',
    corretiva: 'Manutenção corretiva',
    pecas: 'Venda de peças',
    diagnostico: 'Diagnóstico automotivo especializado',
  };

  return labels[service] || service;
}

function showToast(message, type) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}
