/* Lokale E-Mail-Vorbereitung: keine API, keine Speicherung, kein automatischer Versand. */
document.querySelectorAll('form[data-email-subject]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const lines = [];
    form.querySelectorAll('input,select,textarea').forEach((input) => {
      if (!input.name || input.disabled || ['submit','button','hidden'].includes(input.type)) return;
      if (['checkbox','radio'].includes(input.type) && !input.checked) return;
      const value = input.value.trim();
      if (!value) return;
      const label = (input.labels?.[0]?.textContent || input.name).replace(/\s*\*\s*$/, '').replace(/\s+/g, ' ').trim();
      lines.push(label + ': ' + value);
    });
    const subject = form.dataset.emailSubject;
    const body = lines.join('\n\n');
    const uri = 'mailto:team@culinaryapprenticeprojekt.net?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const panel = form.querySelector('.cap-email-preview');
    panel.hidden = false;
    panel.querySelector('textarea').value = 'An: team@culinaryapprenticeprojekt.net\nBetreff: ' + subject + '\n\n' + body;
    const link = panel.querySelector('a[data-open-email]');
    link.href = uri;
    panel.querySelector('[role=status]').textContent = 'E-Mail vorbereitet, noch nicht versendet. Öffnet euer E-Mail-Programm oder kopiert die Nachricht.';
    const mailEvent = new CustomEvent('cap:email-prepared', {cancelable:true, detail:{uri,subject,body}});
    if (form.dispatchEvent(mailEvent)) window.location.href = uri;
    panel.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block:'center'});
    panel.querySelector('textarea').focus({preventScroll:true});
  });
});

const toggle = document.querySelector('.cap-toggle');
const menu = document.querySelector('.cap-mobile');
function closeMenu() {
  if (!toggle || !menu) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menü öffnen');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
matchMedia('(min-width:961px)').addEventListener('change', closeMenu);
