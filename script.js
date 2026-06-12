(function () {
  const viewport = document.querySelector('.slider-viewport');
  const track = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsBox = document.querySelector('.slider-dots');
  const slides = Array.from(track.children);
  const count = slides.length;
  const CLONES = 3; // 中央3枚+両端の見切れを見せるため左右に3枚ずつ複製を置く

  for (let i = 0; i < CLONES; i++) {
    track.appendChild(slides[i % count].cloneNode(true));
    track.insertBefore(slides[count - 1 - (i % count)].cloneNode(true), track.firstChild);
  }

  let index = CLONES; // 複製を含めた位置。CLONES が実スライドの先頭
  let isMoving = false;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'カテゴリ ' + (i + 1));
    dot.addEventListener('click', () => {
      if (isMoving) return;
      index = i + CLONES;
      move(true);
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  // 現在のスライドがビューポート中央に来る位置へトラックを動かす
  function move(animate) {
    const current = track.children[index];
    const offset = current.offsetLeft - (viewport.clientWidth - current.offsetWidth) / 2;
    track.style.transition = animate ? 'transform 0.45s ease' : 'none';
    track.style.transform = 'translateX(' + -offset + 'px)';
    if (animate) isMoving = true;

    Array.from(track.children).forEach(function (el, i) {
      el.classList.toggle('is-active', i === index);
    });
    const active = ((index - CLONES) % count + count) % count;
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === active);
    });
  }

  prevBtn.addEventListener('click', function () {
    if (isMoving) return;
    index--;
    move(true);
  });

  nextBtn.addEventListener('click', function () {
    if (isMoving) return;
    index++;
    move(true);
  });

  // 複製スライドに到達したら、同じ見た目の実スライドへ瞬間移動して一周をつなぐ
  track.addEventListener('transitionend', function (e) {
    if (e.target !== track || e.propertyName !== 'transform') return;
    isMoving = false;
    if (index >= count + CLONES) {
      index -= count;
      move(false);
    } else if (index < CLONES) {
      index += count;
      move(false);
    }
  });

  window.addEventListener('resize', function () {
    move(false);
  });

  move(false);
})();
