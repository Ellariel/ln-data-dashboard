// modal-manager.js
// Simple modal implementation for metric descriptions.

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('modal-close');

if (closeBtn) {
  closeBtn.addEventListener('click', hideModal);
}
window.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});

export function showModal(htmlContent) {
  modalBody.innerHTML = htmlContent;
  modal.classList.remove('hidden');
}

export function hideModal() {
  modal.classList.add('hidden');
}
