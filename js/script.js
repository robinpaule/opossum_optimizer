//Update copyright year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright-year');

    if (copyrightElement) {
        copyrightElement.textContent = copyrightElement.textContent.replace('YEAR', currentYear);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenuButton = document.querySelector('[data-role="BurgerMenu"]');
    const mobileMenu = document.querySelector('[data-role="MobileMenu"]');
    const menuItems = mobileMenu.querySelectorAll('a'); // Select all links inside the menu

    burgerMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickBurgerButton = burgerMenuButton.contains(event.target);

        if (!isClickInsideMenu && !isClickBurgerButton && mobileMenu.classList.contains('visible')) {
            mobileMenu.classList.remove('visible');
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('visible');
        });
    });
});

// Dropdown Menu interactions
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown')) {
        var dropdowns = document.querySelectorAll('.dropdown-items');
        dropdowns.forEach(function(dropdown) {
            dropdown.style.display = 'none';
        });
    }
});

document.querySelectorAll('.dropdown').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.stopPropagation();
        var dropdownItems = this.nextElementSibling;
        if (dropdownItems.style.display === 'flex') {
            dropdownItems.style.display = 'none';  
        } else {
            dropdownItems.style.display = 'flex';
        }
    });
});

document.querySelectorAll('.dropdown-element').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.stopPropagation();
        var dropdown = this.closest('.home-institution-dropdown').querySelector('.dropdown');
        dropdown.textContent = this.textContent;
        dropdown.setAttribute('data-selected-value', this.textContent);
        var dropdownItems = this.closest('.dropdown-items');
        dropdownItems.style.display = 'none';
        dropdown.style.color = '#000000'
    });
});


