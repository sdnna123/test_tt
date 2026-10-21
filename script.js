const initialMenus = [
  { name: '라면', image: 'https://images.unsplash.com/photo-1644082653870-3eaacc76c5c2?auto=format&fit=crop&w=240&q=80', emoji: '🍜' },
  { name: '돈까스', image: 'https://tblg.k-img.com/restaurant/images/Rvw/86774/640x640_rect_e955793a051df9a16291a206a280c16c.jpg', emoji: '🍛' },
  { name: '김밥', image: 'https://d12zq4w4guyljn.cloudfront.net/750_750_20250618132508_photo2_b31163104d72.webp', emoji: '🍙' },
  { name: '쫄면', image: 'https://i.pinimg.com/originals/3a/e4/29/3ae429b889701a801f828d73ffdd3b89.jpg', emoji: '🍝' },
  { name: '김치볶음밥', image: 'https://d12zq4w4guyljn.cloudfront.net/750_750_20250504071607_photo2_75b38cec497d.webp', emoji: '🍚' },
  { name: '치킨덮밥', image: 'https://recipesen.com/wp-content/uploads/2025/04/Korean-Chicken-Rice-Bowls-Recipe-1.png', emoji: '🍗' },
  { name: '크림파스타', image: 'https://awsimages.detik.net.id/community/media/visual/2019/08/22/586abc49-1ac0-418c-b36d-ee99088a1d85.jpeg', emoji: '🍝' }
];

let menus = initialMenus.map(menu => ({ ...menu }));

const menuList = document.querySelector('#menuList');
const menuCount = document.querySelector('#menuCount');
const result = document.querySelector('#pickResult');
const message = document.querySelector('#formMessage');

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function renderMenus() {
  menuCount.textContent = `${menus.length}가지`;

  if (!menus.length) {
    menuList.innerHTML =
      '<li class="menu-empty">등록된 메뉴가 없어요.<br>위에서 새 메뉴를 등록해 주세요.</li>';
    return;
  }

  menuList.innerHTML = menus.map((menu, index) => `
    <li class="menu-item">
      <div class="menu-card">
        <button class="menu-select" type="button" data-pick="${index}"
                aria-label="${escapeHtml(menu.name)} 추천받기">
          <span class="food-thumb" aria-hidden="true">
            ${menu.image
              ? `<img src="${menu.image}" alt="" loading="lazy" onerror="this.style.display='none'">`
              : ''}
            <span>${menu.emoji || '🍽️'}</span>
          </span>
          <span class="menu-name">${escapeHtml(menu.name)}</span>
        </button>
        <button class="delete-menu" type="button" data-delete="${index}"
                aria-label="${escapeHtml(menu.name)} 삭제" title="메뉴 삭제">×</button>
      </div>
    </li>
  `).join('');
}

document.querySelector('#addMenuForm').addEventListener('submit', event => {
  event.preventDefault();

  const nameInput = document.querySelector('#newMenuName');
  const name = nameInput.value.trim();
  message.classList.remove('success');

  if (!name) {
    message.textContent = '메뉴 이름을 입력해 주세요.';
    nameInput.focus();
    return;
  }

  const duplicate = menus.some(menu =>
    menu.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase()
  );

  if (duplicate) {
    message.textContent = '같은 이름의 메뉴가 이미 있어요.';
    nameInput.focus();
    return;
  }

  menus.push({ name, emoji: '🍽️' });
  nameInput.value = '';
  message.textContent = `${name} 메뉴를 등록했어요.`;
  message.classList.add('success');
  renderMenus();
});

menuList.addEventListener('click', event => {
  const deleteButton = event.target.closest('[data-delete]');

  if (deleteButton) {
    menus.splice(Number(deleteButton.dataset.delete), 1);
    renderMenus();
    return;
  }

  const pickButton = event.target.closest('[data-pick]');

  if (pickButton) {
    showRecommendation(menus[Number(pickButton.dataset.pick)]);
  }
});

function showRecommendation(menu) {
  result.innerHTML =
    `<span class="plate-icon">🍴</span><span>${escapeHtml(menu.name)} 어때요?</span>`;
}

document.querySelector('#recommendBtn').addEventListener('click', () => {
  if (!menus.length) {
    result.innerHTML =
      '<span class="plate-icon">💌</span><span>메뉴를 먼저 등록해 주세요!</span>';
    return;
  }

  result.innerHTML =
    '<span class="plate-icon">🍽️</span><span>고르는 중…</span>';

  window.setTimeout(() => {
    const pick = menus[Math.floor(Math.random() * menus.length)];
    showRecommendation(pick);
  }, 420);
});

const contactModal = document.querySelector('#contactModal');

document.querySelector('#contactBtn').addEventListener('click', () => {
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
});

function closeContact() {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

contactModal.addEventListener('click', event => {
  if (event.target.matches('[data-contact-close]')) {
    closeContact();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && contactModal.classList.contains('open')) {
    closeContact();
  }
});

document.querySelector('#sendFeedback').addEventListener('click', () => {
  const feedback = document.querySelector('#feedbackText');
  const status = document.querySelector('#feedbackMessage');

  if (!feedback.value.trim()) {
    status.textContent = '문의 또는 건의 내용을 적어주세요.';
    feedback.focus();
    return;
  }

  status.textContent = '전송완료! 소중한 의견 감사합니다 ♡';
  feedback.value = '';
});

renderMenus();