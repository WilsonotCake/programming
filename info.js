document.addEventListener('DOMContentLoaded', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    
    const cartList = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const themeSwitch = document.getElementById('checkbox');
    
    // Theme switcher
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const comicItem = button.closest('.comic-item');
            const comicName = comicItem.querySelector('h2').textContent;
            const comicPrice = parseInt(comicItem.querySelector('p').dataset.price);
            
            if (cartItems[comicName]) {
                cartItems[comicName].quantity++;
            } else {
                cartItems[comicName] = { price: comicPrice, quantity: 1 };
            }
            
            updateCart();
            saveCart();
        });
    });

    // Clear cart button
    clearCartButton.addEventListener('click', function() {
        if (Object.keys(cartItems).length === 0) {
            return;
        }
        
        cartItems = {};
        updateCart();
        saveCart();
    });

    // Update cart function
    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;

        if (Object.keys(cartItems).length === 0) {
            const emptyCartMessage = document.createElement('li');
            emptyCartMessage.className = 'empty-cart-message';
            emptyCartMessage.innerHTML = '<i class="fas fa-shopping-basket"></i> Your cart is empty';
            cartList.appendChild(emptyCartMessage);
        } else {
            for (let name in cartItems) {
                const item = cartItems[name];
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
                
                // Add item buttons
                li.querySelector('.add-one').addEventListener('click', function() {
                    cartItems[name].quantity++;
                    updateCart();
                    saveCart();
                });
                
                // Remove item buttons
                li.querySelector('.remove-one').addEventListener('click', function() {
                    if (cartItems[name].quantity > 1) {
                        cartItems[name].quantity--;
                        updateCart();
                        saveCart();
                    } else {
                        delete cartItems[name];
                        updateCart();
                        saveCart();
                    }
                });
                
                // Delete item buttons
                li.querySelector('.delete-item').addEventListener('click', function() {
                    delete cartItems[name];
                    updateCart();
                    saveCart();
                });
            }
        }

        totalPriceElement.textContent = total;
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Initialize the cart
    updateCart();
});