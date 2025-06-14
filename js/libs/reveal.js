(function () {
    const revealClass = 'reveal-on-scroll';
    const visibleClass = 'is-visible';

    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = `
    .${revealClass} {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
      transition-delay: 0.12s;
      will-change: opacity, transform;
    }

    .${revealClass}.${visibleClass} {
      opacity: 1;
      transform: translateY(0);
    }
  `;
    document.head.appendChild(style);

    // Проверка поддержки IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver не поддерживается в этом браузере.');
        return;
    }

    // Создание обсерверов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add(visibleClass);
            } else {
                el.classList.remove(visibleClass);
            }
        });
    }, {
        threshold: 0.1
    });

    // Основной запуск
    window.addEventListener('DOMContentLoaded', () => {
        const elements = document.querySelectorAll(`.${revealClass}`);
        elements.forEach(el => {
            observer.observe(el);

            // ✨ Проверка: если уже виден в viewport — применить класс сразу
            const rect = el.getBoundingClientRect();
            const isVisibleNow =
                rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisibleNow) {
                el.classList.add(visibleClass);
            }
        });
    });
})();
