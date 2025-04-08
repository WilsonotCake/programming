document.addEventListener('DOMContentLoaded', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    
    const cartList = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const comicItems = document.querySelectorAll('.comic-item');
    const themeSwitch = document.getElementById('checkbox');
    
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', switchTheme);
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            showNotification('Dark theme activated!', 'info');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            showNotification('Light theme activated!', 'info');
        }
    }
    
    comicItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px)';
            item.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.boxShadow = '';
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const comicItem = button.closest('.comic-item');
            const comicName = comicItem.querySelector('h2').textContent;
            const comicPrice = parseInt(comicItem.querySelector('p').dataset.price);
            
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 300);

            if (cartItems[comicName]) {
                cartItems[comicName].quantity++;
            } else {
                cartItems[comicName] = { price: comicPrice, quantity: 1 };
                showNotification(`${comicName} added to cart!`);
            }
            
            updateCart();
            saveCart();
        });
    });

    clearCartButton.addEventListener('click', () => {
        if (Object.keys(cartItems).length === 0) {
            showNotification('Your cart is already empty!', 'info');
            return;
        }
        
        cartItems = {};
        updateCart();
        saveCart();
        showNotification('Cart cleared!', 'warning');
    });

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;

        if (Object.keys(cartItems).length === 0) {
            const emptyCartMessage = document.createElement('li');
            emptyCartMessage.className = 'empty-cart-message';
            emptyCartMessage.innerHTML = '<i class="fas fa-shopping-basket"></i> Your cart is empty';
            cartList.appendChild(emptyCartMessage);
        } else {
            Object.entries(cartItems).forEach(([name, item]) => {
                const li = document.createElement('li');
                const itemTotal = item.price * item.quantity;
                li.innerHTML = `
                    <span class="item-name">${name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                    <span class="item-price">${itemTotal} UAH</span>
                    <div class="item-actions">
                        <button class="add-one" data-name="${name}">+</button>
                        <button class="remove-one" data-name="${name}">-</button>
                        <button class="delete-item" data-name="${name}">🗑️</button>
                    </div>
                `;
                cartList.appendChild(li);
                total += itemTotal;
                
                li.querySelector('.add-one').addEventListener('click', () => {
                    cartItems[name].quantity++;
                    updateCart();
                    saveCart();
                    showNotification(`Added one more ${name}!`, 'success');
                });
                
                li.querySelector('.remove-one').addEventListener('click', () => {
                    if (cartItems[name].quantity > 1) {
                        cartItems[name].quantity--;
                        updateCart();
                        saveCart();
                        showNotification(`Removed one ${name}!`, 'warning');
                    } else {
                        delete cartItems[name];
                        updateCart();
                        saveCart();
                        showNotification(`${name} removed from cart!`, 'warning');
                    }
                });
                
                li.querySelector('.delete-item').addEventListener('click', () => {
                    delete cartItems[name];
                    updateCart();
                    saveCart();
                    showNotification(`${name} removed from cart!`, 'warning');
                });
            });
        }

        totalPriceElement.textContent = total;
        
        totalPriceElement.classList.add('highlight');
        setTimeout(() => {
            totalPriceElement.classList.remove('highlight');
        }, 500);
    }
    
    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    updateCart();
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1000;
            max-width: 300px;
        }
        
        [data-theme="dark"] .notification {
            background: #333;
            color: #edf2f4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification.warning {
            border-left: 4px solid var(--warning-color);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary-color);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            margin-right: 10px;
            font-size: 1.5rem;
        }
        
        .notification.success i {
            color: var(--success-color);
        }
        
        .notification.warning i {
            color: var(--warning-color);
        }
        
        .notification.info i {
            color: var(--primary-color);
        }
        
        .empty-cart-message {
            color: var(--secondary-color);
            font-size: 1.1rem;
            padding: 20px;
            text-align: center;
            width: 100%;
        }
        
        .empty-cart-message i {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        
        .item-name {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .item-quantity {
            color: var(--secondary-color);
        }
        
        .item-price {
            font-weight: bold;
            color: var(--success-color);
        }
        
        .item-actions {
            display: flex;
            gap: 5px;
        }
        
        #total-price.highlight {
            animation: pulse 0.5s ease;
        }
        
        .button.clicked .button__icon {
            animation: pulse 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});