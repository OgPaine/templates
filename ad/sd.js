document.addEventListener("DOMContentLoaded", () => {
    function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;

        const updateUrl = `/cart/set/${productId}?quantity=${newQuantity}`;

        fetch(updateUrl, {
            method: 'GET',
        })
            .then(response => response.text())
            .then(html => {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;

                const updatedItem = tempElement.querySelector(`[data-item-id="${productId}"]`);
                if (updatedItem) {
                    const quantityElement = updatedItem.querySelector('.quantity');
                    if (quantityElement) {
                        document.getElementById(`quantity-${productId}`).innerText = quantityElement.innerText;
                    }

                    const priceElement = updatedItem.querySelector('.item-price');
                    if (priceElement) {
                        document.querySelector(`[data-item-id="${productId}"] .item-price`).innerText = priceElement.innerText;
                    }

                    updateCartSummary(tempElement);
                } else {
                    console.error('Updated item not found in the response');
                }
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
    }

    function updateCartSummary(tempElement) {
        const cartSummary = tempElement.querySelector('#cartModal .flex.items-center p');
        if (cartSummary) {
            const currentSummary = document.querySelector('#cartModal .flex.items-center p');
            if (currentSummary) {
                currentSummary.innerText = cartSummary.innerText;
            }
        }

        const cartItems = tempElement.querySelector('#cart-items');
        if (cartItems) {
            document.getElementById('cart-items').innerHTML = cartItems.innerHTML;
        }
    }


    const cartModal = document.getElementById('cartModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const openCartModalBtn = document.getElementById('openCartModal');
    const closeCartModalBtn = document.getElementById('closeCartModal');

    openCartModalBtn.addEventListener('click', function (event) {
        event.preventDefault();
        cartModal.classList.remove('translate-x-full');
        modalOverlay.classList.remove('hidden');
    });

    closeCartModalBtn.addEventListener('click', function () {
        cartModal.classList.add('translate-x-full');
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', function () {
        cartModal.classList.add('translate-x-full');
        modalOverlay.classList.add('hidden');
    });

    function subscribeToProduct() {
        var productSlug = document.querySelector("[data-product-slug]").getAttribute("data-product-slug");
        var gameServerId = document.getElementById('gameServerDropdown')?.value;

        const query = new URLSearchParams({ subscription: true });

        if (gameServerId) {
            query.set('gameserver_id', gameServerId);
        }

        const checkoutUrl = `/products/${productSlug}/checkout?${query.toString()}`;
        window.location.href = checkoutUrl;
    }

    function addProductToCart() {
        var productSlug = document.querySelector("[data-product-slug]").getAttribute("data-product-slug");
        var gameServerId = document.getElementById('gameServerDropdown')?.value;

        const query = new URLSearchParams();
        if (gameServerId) {
            query.set('gameserver_id', gameServerId);
        }

        const checkoutUrl = `/cart/add/${productSlug}?${query.toString()}`;
        window.location.href = checkoutUrl;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('err')) {
        const errorMessage = urlParams.get('err');
        alert(decodeURIComponent(errorMessage));
    }

    function toggleGiftActions() {
        var mainActions = document.getElementById('mainActions');
        var giftActions = document.getElementById('giftActions');

        if (mainActions && giftActions) {
            mainActions.classList.toggle('hidden');
            giftActions.classList.toggle('hidden');
        } else {
            console.error('Elements not found');
        }
    }

    function isValidSteamID(steamid) {
        var numericCheck = /^[0-9]+$/.test(steamid);
        var lengthCheck = steamid.length >= 16 && steamid.length <= 20;

        return numericCheck && lengthCheck;
    }

    function handlePurchase() {
        var steamidInput = document.getElementById('steamidInput');
        var steamid = steamidInput.value.trim();
        var productSlug = document.querySelector("[data-product-slug]").getAttribute("data-product-slug");
        var gameServerId = document.getElementById('gameServerDropdown')?.value;

        if (isValidSteamID(steamid)) {
            const query = new URLSearchParams({ "gift_to": steamid });

            if (gameServerId) {
                query.set('gameserver_id', gameServerId);
            }

            var checkoutUrl = `/products/${productSlug}/checkout?${query.toString()}`;
            window.location.href = checkoutUrl;
        } else {
            alert("Please enter a valid SteamID!");
        }
    }

    document.getElementById('currencyButton').addEventListener('click', function () {
        const modal = document.getElementById('currencyModal');
        modal.classList.toggle('hidden');
    });

    document.addEventListener('click', function (event) {
        const button = document.getElementById('currencyButton');
        const modal = document.getElementById('currencyModal');

        if (!button.contains(event.target) && !modal.contains(event.target)) {
            modal.classList.add('hidden');
        }
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenuModal = document.getElementById('mobile-menu-modal');
    const modalBackdrop = mobileMenuModal.querySelector('.absolute.inset-0');
    const modalContent = mobileMenuModal.querySelector('section');

    function openMobileMenu() {
        mobileMenuModal.classList.remove('pointer-events-none');
        modalBackdrop.classList.remove('opacity-0');
        modalContent.classList.remove('translate-x-full');
    }

    function closeMobileMenu() {
        modalBackdrop.classList.add('opacity-0');
        modalContent.classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenuModal.classList.add('pointer-events-none');
        }, 300);
    }

    mobileMenuButton.addEventListener('click', openMobileMenu);
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);
    modalBackdrop.addEventListener('click', closeMobileMenu);
});
