const modules_flsModules = {};
function getHash() {
    if (location.hash) return location.hash.replace("#", "");
}
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = "";
            }));
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        }));
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}
function uniqArray(array) {
    return array.filter((function (item, index, self) {
        return self.indexOf(item) === index;
    }));
}
function formQuantity() {
    function updateButtonState(quantityBlock) {
        const valueElement = quantityBlock.querySelector("[data-quantity-value]");
        const card = quantityBlock.closest(".footer-product-card");
        const button = card?.querySelector(".top-footer__button");
        const value = parseInt(valueElement.value);
        if (button) if (value >= 1) button.classList.add("_active"); else button.classList.remove("_active");
    }
    document.addEventListener("click", (function (e) {
        let targetElement = e.target;
        const quantityControl = targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]");
        if (quantityControl) {
            const quantityBlock = targetElement.closest("[data-quantity]");
            const valueElement = quantityBlock.querySelector("[data-quantity-value]");
            let value = parseInt(valueElement.value);
            if (targetElement.hasAttribute("data-quantity-plus")) {
                value++;
                if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
            } else {
                value--;
                if (+valueElement.dataset.quantityMin) {
                    if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                } else if (value < 1) value = 0;
            }
            valueElement.value = value;
            if (value <= 0) {
                const orderColumn = quantityBlock.closest(".order__column");
                if (orderColumn) orderColumn.classList.add("fade-out");
            } else updateButtonState(quantityBlock);
        }
    }));
    function initializeButtonsState() {
        document.querySelectorAll("[data-quantity]").forEach((quantityBlock => {
            updateButtonState(quantityBlock);
        }));
    }
    initializeButtonsState();
}
function formRating() {
    const ratings = document.querySelectorAll("[data-rating]");
    if (ratings) ratings.forEach((rating => {
        const ratingValue = +rating.dataset.ratingValue;
        const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
        formRatingInit(rating, ratingSize);
        ratingValue ? formRatingSet(rating, ratingValue) : null;
        document.addEventListener("click", formRatingAction);
    }));
    function formRatingAction(e) {
        const targetElement = e.target;
        if (targetElement.closest(".rating__input")) {
            const currentElement = targetElement.closest(".rating__input");
            const ratingValue = +currentElement.value;
            const rating = currentElement.closest(".rating");
            const ratingSet = "set" === rating.dataset.rating;
            ratingSet ? formRatingGet(rating, ratingValue) : null;
        }
    }
    function formRatingInit(rating, ratingSize) {
        let ratingItems = ``;
        for (let index = 0; index < ratingSize; index++) {
            0 === index ? ratingItems += `<div class="rating__items">` : null;
            ratingItems += `\n\t\t\t\t<label class="rating__item">\n\t\t\t\t\t<input class="rating__input" type="radio" name="rating" value="${index + 1}">\n\t\t\t\t</label>`;
            index === ratingSize ? ratingItems += `</div">` : null;
        }
        rating.insertAdjacentHTML("beforeend", ratingItems);
    }
    function formRatingGet(rating, ratingValue) {
        const resultRating = ratingValue;
        formRatingSet(rating, resultRating);
    }
    function formRatingSet(rating, value) {
        const ratingItems = rating.querySelectorAll(".rating__item");
        const resultFullItems = parseInt(value);
        const resultPartItem = value - resultFullItems;
        rating.hasAttribute("data-rating-title") ? rating.title = value : null;
        ratingItems.forEach(((ratingItem, index) => {
            ratingItem.classList.remove("rating__item--active");
            ratingItem.querySelector("span") ? ratingItems[index].querySelector("span").remove() : null;
            if (index <= resultFullItems - 1) ratingItem.classList.add("rating__item--active");
            if (index === resultFullItems && resultPartItem) ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${100 * resultPartItem}%"></span>`);
        }));
    }
}
const buttons = document.querySelectorAll(".button");
if (buttons) buttons.forEach((button => {
    button.addEventListener("click", (() => {
        button.classList.add("_active");
    }));
}));
const langHeader = document.querySelector(".lang-header");
const langButton = document.querySelector(".lang-header__button");
if (langButton) {
    langButton.addEventListener("click", (function (e) {
        langHeader.classList.toggle("_active");
        e.stopPropagation();
    }));
    document.addEventListener("click", (function (e) {
        if (!langHeader.contains(e.target)) langHeader.classList.remove("_active");
    }));
    const langLinks = langHeader.querySelectorAll(".lang-header__link");
    langLinks.forEach((link => {
        link.addEventListener("click", (function (e) {
            e.preventDefault();
            langLinks.forEach((item => item.classList.remove("_active")));
            this.classList.add("_active");
            langHeader.classList.remove("_active");
        }));
    }));
}
document.addEventListener("click", (function (e) {
    const addBasket = e.target.closest(".add-basket");
    if (!addBasket) return;
    const card = addBasket.closest(".footer-product-card");
    if (!card) return;
    const button = card.querySelector(".top-footer__button");
    const quantityInput = card.querySelector("[data-quantity-value]");
    const isActive = button?.classList.contains("_active");
    popupText.textContent = isActive ? "Удалено из заказа" : "Добавлено в заказ";
    if (button) {
        button.classList.toggle("_active", !isActive);
        if (quantityInput) quantityInput.value = 1;
    }
    const showBasket = card.querySelector(".show-basket");
    if (showBasket) {
        addBasket.style.display = isActive ? "inline" : "none";
        showBasket.style.display = isActive ? "none" : "inline";
    }
    addPopup.classList.add("popup_show");
    addPopup.setAttribute("aria-hidden", "false");
    setTimeout((() => {
        addPopup.classList.remove("popup_show");
        addPopup.setAttribute("aria-hidden", "true");
    }), 2e3);
}));
class HorizontalDragScroll {
    constructor(selector, options = {}) {
        this.containers = document.querySelectorAll(selector);
        this.sensitivity = options.sensitivity || 1.5;
        this.init();
    }
    init() {
        this.containers.forEach((container => this.attachListeners(container)));
    }
    attachListeners(container) {
        let isDragging = false;
        let startX = 0;
        let scrollStart = 0;
        const onMouseDown = e => {
            if (0 !== e.button) return;
            isDragging = true;
            container.classList.add("dragging");
            startX = e.pageX - container.offsetLeft;
            scrollStart = container.scrollLeft;
            document.addEventListener("mousemove", onMouseMove, {
                passive: false
            });
            document.addEventListener("mouseup", onMouseUp);
        };
        const onMouseMove = e => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const delta = (x - startX) * this.sensitivity;
            container.scrollLeft = scrollStart - delta;
        };
        const onMouseUp = () => {
            isDragging = false;
            container.classList.remove("dragging");
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseleave", (() => {
            if (isDragging) onMouseUp();
        }));
    }
}
document.addEventListener("DOMContentLoaded", (() => {
    new HorizontalDragScroll(".scroll", {
        sensitivity: 1.8
    });
}));
let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
    const targetBlockElement = document.querySelector(targetBlock);
    if (targetBlockElement) {
        let headerItem = "";
        let headerItemHeight = 0;

        // Получаем высоту хедера, если нужно
        if (!noHeader) {
            headerItem = "header.header";
            const headerElement = document.querySelector(headerItem);
            if (headerElement && !headerElement.classList.contains("_header-scroll")) {
                headerElement.style.cssText = `transition-duration: 0s;`;
                headerElement.classList.add("_header-scroll");
                headerItemHeight = headerElement.offsetHeight;
                headerElement.classList.remove("_header-scroll");
                setTimeout(() => {
                    headerElement.style.cssText = ``;
                }, 0);
            } else if (headerElement) {
                headerItemHeight = headerElement.offsetHeight;
            }
        }

        // Опции для SmoothScroll (если используется)
        let options = {
            speedAsDuration: true,
            speed,
            header: headerItem,
            offset: offsetTop,
            easing: "easeOutQuad"
        };

        // Закрываем меню при открытом мобильном
        if (document.documentElement.classList.contains("menu-open")) {
            menuClose();
        }

        // Получаем текущий масштаб
        const wrapper = document.getElementById('scale-wrapper');
        let scale = 1;
        if (wrapper) {
            const style = window.getComputedStyle(wrapper);
            const transform = style.transform || '';
            if (transform && transform !== 'none') {
                const match = transform.match(/matrix$([^)]+)$/);
                if (match) {
                    scale = parseFloat(match[1].split(', ')[0]);
                }
            }
        }

        // Вычисляем позицию с учётом масштаба
        let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + window.scrollY;
        targetBlockElementPosition -= headerItemHeight;
        targetBlockElementPosition -= offsetTop;

        // Учёт масштаба — делим на текущий scale
        targetBlockElementPosition /= scale;

        // Прокрутка
        if ("undefined" !== typeof SmoothScroll) {
            (new SmoothScroll).animateScroll(targetBlockElement, "", options);
        } else {
            window.scrollTo({
                top: targetBlockElementPosition,
                behavior: "smooth"
            });
        }

        functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
    } else {
        functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    }
};

let addWindowScrollEvent = false;

function pageNavigation() {
    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);

    function pageNavigationAction(e) {
        if ("click" === e.type) {
            const targetElement = e.target;

            // Поддержка кнопок напрямую с data-goto
            const gotoLink = targetElement.closest("[data-goto]") || (targetElement.hasAttribute("data-goto") ? targetElement : null);

            if (gotoLink) {
                const gotoLinkSelector = gotoLink.dataset.goto || "";
                const noHeader = gotoLink.hasAttribute("data-goto-header");
                const gotoSpeed = parseInt(gotoLink.dataset.gotoSpeed) || 500;
                const offsetTop = parseInt(gotoLink.dataset.gotoTop) || 0;

                gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);

                e.preventDefault();
            }
        } else if ("watcherCallback" === e.type && e.detail) {
            const entry = e.detail.entry;
            const targetElement = entry.target;

            if (targetElement.dataset.watch === "navigator") {
                let navigatorCurrentItem = null;

                if (targetElement.id) {
                    navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
                } else if (targetElement.classList.length) {
                    for (let index = 0; index < targetElement.classList.length; index++) {
                        const className = targetElement.classList[index];
                        navigatorCurrentItem = document.querySelector(`[data-goto=".${className}]`);
                        if (navigatorCurrentItem) break;
                    }
                }

                if (entry.isIntersecting) {
                    if (navigatorCurrentItem) {
                        navigatorCurrentItem.classList.add("_navigator-active");
                    }
                } else {
                    if (navigatorCurrentItem) {
                        navigatorCurrentItem.classList.remove("_navigator-active");
                    }
                }
            }
        }
    }

    // Прокрутка по хэшу из адресной строки
    if (getHash()) {
        let goToHash = null;
        const hash = getHash();

        if (document.querySelector(`#${hash}`)) {
            goToHash = `#${hash}`;
        } else if (document.querySelector(`.${hash}`)) {
            goToHash = `.${hash}`;
        }

        if (goToHash) {
            gotoblock_gotoBlock(goToHash, true, 500, 20);
        }
    }
}



// Функция для получения хэша без решетки
function getHash() {
    return window.location.hash.replace("#", "");
}

// Диспетчеризация скролла
setTimeout(() => {
    if (addWindowScrollEvent) {
        const windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", () => {
            document.dispatchEvent(windowScroll);
        });
    }
}, 0);
window["FLS"] = false;
formQuantity();
formRating();
pageNavigation();

function updateScale() {
    const wrapper = document.getElementById('scale-wrapper');
    const baseWidth = 1000;
    const fullWidth = baseWidth + 40;

    const currentWidth = window.innerWidth;

    if (currentWidth <= fullWidth) {
        const scale = currentWidth / fullWidth;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.width = fullWidth + 'px';
        wrapper.style.minHeight = (window.innerHeight / scale) + 'px';
        wrapper.style.marginBottom = `-${(1 - scale) * wrapper.scrollHeight}px`;
    } else {
        wrapper.style.transform = 'scale(1)';
        wrapper.style.minHeight = 'auto';
        wrapper.style.marginBottom = '0';
    }
}
updateScale();
window.addEventListener('resize', updateScale);
function updatePopupHeight() {
    const popup = document.querySelector('.vh100');
    if (!popup) return;

    const scaleWrapper = document.getElementById('scale-wrapper');
    const style = window.getComputedStyle(scaleWrapper);
    const transform = style.transform || '';

    let scale = 1;
    if (transform && transform !== 'none') {
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (match) {
            scale = parseFloat(match[1].split(', ')[0]);
        }
    }

    popup.style.position = 'absolute';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = (window.innerHeight / scale) + 'px';
    popup.style.overflowY = 'auto';
}
window.addEventListener('resize', updatePopupHeight);
window.addEventListener('DOMContentLoaded', updatePopupHeight);

// Обработчик кликов по кнопкам навигации
document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", e => {
        e.preventDefault();

        const target = button.getAttribute("data-goto");
        const element = document.querySelector(target);

        // Прокрутка к секции
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            console.error("Блок не найден:", target);
        }

        // Обновляем активное состояние кнопок
        updateActiveNavigation(target);
    });
});

// Функция обновления активного состояния навигации
function updateActiveNavigation(target) {
    // Синхронизируем все кнопки с таким же data-goto
    const allButtonsWithSameTarget = document.querySelectorAll(`[data-goto="${target}"]`);

    // Удаляем старый активный класс у всех кнопок во всех навигациях
    document.querySelectorAll("[data-goto]._navigator-active").forEach(btn => {
        btn.classList.remove("_navigator-active");
    });

    // Добавляем новый активный класс всем подходящим кнопкам
    allButtonsWithSameTarget.forEach(navButton => {
        navButton.classList.add("_navigator-active");

        // Прокручиваем .navigation__body к активной кнопке
        const navigationBody = navButton.closest('.navigation__body');
        if (navigationBody) {
            const containerWidth = navigationBody.clientWidth;
            const buttonPosition = navButton.offsetLeft;
            const buttonWidth = navButton.offsetWidth;

            const scrollLeft = buttonPosition - (containerWidth / 2) + (buttonWidth / 2);

            navigationBody.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    });
}

// Инициализация IntersectionObserver для отслеживания видимости секций
function initSectionObserver() {
    const sections = document.querySelectorAll('[data-watch="navigator"]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Срабатывает, когда видно 50% элемента
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Получаем класс секции (например "popular" из класса "products popular")
                const sectionClass = Array.from(entry.target.classList)
                    .find(className => className !== 'products' && className !== 'reveal-on-scroll');
                
                if (sectionClass) {
                    // Обновляем активное состояние навигации
                    updateActiveNavigation(`.${sectionClass}`);
                }
            }
        });
    }, observerOptions);

    // Начинаем наблюдение за всеми секциями
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initSectionObserver();
    
    // Если в URL есть хэш, прокручиваем к соответствующей секции
    if (window.location.hash) {
        const target = window.location.hash;
        const element = document.querySelector(target);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth" });
                updateActiveNavigation(target);
            }, 100);
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".navigation.navigation--fixed");
    const header = document.querySelector(".header");

    if (!nav || !header) return;


    // Используем IntersectionObserver для отслеживания видимости заголовка
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                nav.classList.add("fixed");
            } else {
                nav.classList.remove("fixed");
            }
        },
        {
            rootMargin: "0px",
            threshold: 0,
        }
    );

    // Начинаем отслеживать header
    observer.observe(header);
});
