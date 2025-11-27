document.addEventListener('DOMContentLoaded', () => {
  // === Модуль: Кастомный select ===
  class CustomSelect {
    constructor(selectElement) {
      this.select = selectElement;
      this.valueEl = this.select.querySelector('.select__value');
      this.dropdown = this.select.querySelector('.select__dropdown');
      this.options = this.dropdown.querySelectorAll('.select__option');
      this.hiddenInput = this.select.querySelector('input[type="hidden"]');
      this.isOpen = false;

      this.initEvents();
      this.closeDropdown(); // Инициализация: скрываем dropdown
    }

    toggleDropdown() {
      this.isOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
      this.dropdown.style.display = 'block';
      this.isOpen = true;
      this.valueEl.setAttribute('aria-expanded', 'true');
      this.dropdown.setAttribute('aria-hidden', 'false');
      this.valueEl.classList.add('select__open');
    }

    closeDropdown() {
      this.dropdown.style.display = 'none';
      this.isOpen = false;
      this.valueEl.setAttribute('aria-expanded', 'false');
      this.dropdown.setAttribute('aria-hidden', 'true');
      this.valueEl.classList.remove('select__open');
    }

    updateValue(option) {
      const value = option.dataset.value;
      const text = option.textContent;  
      this.valueEl.textContent = text.trim();
      if (this.hiddenInput) {
        this.hiddenInput.value = value;
      }
      this.select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    initEvents() {
      this.valueEl.addEventListener('click', () => this.toggleDropdown());
      this.valueEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown();
        }
      });

      this.options.forEach(option => {
        option.addEventListener('click', () => {
          this.updateValue(option);
          this.closeDropdown();
        });
      });

      this.dropdown.addEventListener('keydown', e => {
        const focused = this.dropdown.querySelector('.select__option.focused');
        let index = focused ? Array.from(this.options).indexOf(focused) : -1;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            index = (index + 1) % this.options.length;
            break;
          case 'ArrowUp':
            e.preventDefault();
            index = (index - 1 + this.options.length) % this.options.length;
            break;
          case 'Enter':
            if (index >= 0) this.options[index].click();
            return;
          case 'Escape':
            this.closeDropdown();
            this.valueEl.focus();
            return;
        }

        if (index >= 0) {
          this.options[index].classList.add('focused');
          if (focused) focused.classList.remove('focused');
          this.options[index].scrollIntoView({ block: 'nearest' });
        }
      });

      // Закрытие при клике вне компонента
      document.addEventListener('click', e => {
        if (!this.select.contains(e.target)) this.closeDropdown();
      });
    }
  }

  // Инициализация select
  document.querySelectorAll('.select').forEach(select => new CustomSelect(select));


  // === Модуль: Слайдер ===
  const slider = document.querySelector('.order-form__slider');
  const valueDisplay = document.querySelector('.order-form__slider-value');

  if (slider && valueDisplay) {
    const updateValue = () => {
      valueDisplay.textContent = `${slider.value}%`;
    };

    slider.addEventListener('input', updateValue);
    slider.addEventListener('change', updateValue); // для IE
    updateValue(); // Инициализация
  }

  // === Модуль: Мобильное меню ===
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('#mobile-menu');
  const closeBtn = document.querySelector('.header__close-btn');

  if (burger && nav) {
    const toggleMenu = () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active', !isExpanded);
    };

    burger.addEventListener('click', toggleMenu);

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !nav.contains(e.target)) {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
      }
    });
  }
});
