document.addEventListener('DOMContentLoaded', () => {
    let cartItems = {};
    const cartList = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const comicItem = button.closest('.comic-item');
            const comicName = comicItem.querySelector('h2').textContent;
            const comicPrice = parseInt(comicItem.querySelector('p').dataset.price);

            if (cartItems[comicName]) {
                cartItems[comicName].quantity++;
            } else {
                cartItems[comicName] = { price: comicPrice, quantity: 1 };
            }
            updateCart();
        });
    });

    clearCartButton.addEventListener('click', () => {
        cartItems = {};
        updateCart();
    });

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;

        Object.entries(cartItems).forEach(([name, item]) => {
            const li = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            li.innerHTML = `
                ${name} x ${item.quantity} = ${itemTotal} UAH
                <button class="cart-btn add-one" data-name="${name}">Add</button>
                <button class="cart-btn remove-one" data-name="${name}">Remove One</button>
                <button class="cart-btn delete-item" data-name="${name}">Remove All</button>
            `;
            cartList.appendChild(li);
            total += itemTotal;

            // Add event listeners for the new buttons
            li.querySelector('.add-one').addEventListener('click', () => {
                cartItems[name].quantity++;
                updateCart();
            });

            li.querySelector('.remove-one').addEventListener('click', () => {
                if (cartItems[name].quantity > 1) {
                    cartItems[name].quantity--;
                } else {
                    delete cartItems[name];
                }
                updateCart();
            });

            li.querySelector('.delete-item').addEventListener('click', () => {
                delete cartItems[name];
                updateCart();
            });
        });

        totalPriceElement.textContent = total;
    }
});