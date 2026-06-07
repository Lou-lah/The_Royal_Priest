// MOBILE MENU
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

// NEWSLETTER FORM HANDLER
(() => {
  const forms = Array.from(document.querySelectorAll('form'));
  const newsletterForm = forms.find(f => f.querySelector('input[type="email"]'));

  if (!newsletterForm) return;

  const emailInput = newsletterForm.querySelector('input[type="email"]');

  const showMessage = (msg, isError = false) => {
    let msgEl = newsletterForm.querySelector('.newsletter-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'newsletter-msg mt-4 text-sm';
      newsletterForm.appendChild(msgEl);
    }
    msgEl.textContent = msg;
    msgEl.style.color = isError ? '#ff6b6b' : '#C8A96B';
  };

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (emailInput && emailInput.value || '').trim();
    if (!email) {
      showMessage('Please enter your email address', true);
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address', true);
      return;
    }

    // store locally (for demo) and show confirmation
    const list = JSON.parse(localStorage.getItem('newsletter')) || [];
    if (!list.includes(email)) list.push(email);
    localStorage.setItem('newsletter', JSON.stringify(list));

    showMessage('Thanks — you are subscribed!');
    if (emailInput) emailInput.value = '';
  });

})();


// SCROLL REVEAL ANIMATION SYSTEM

const scrollElements = document.querySelectorAll(".animate-on-scroll");

// function to check if element is in view
const elementInView = (el, offset = 100) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

// add show class
const displayScrollElement = (element) => {
  element.classList.add("show");
};

// hide (optional for reset behavior)
const hideScrollElement = (element) => {
  element.classList.remove("show");
};

// loop scroll elements
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 120)) {
      displayScrollElement(el);
    }
  });
};

// run on scroll
window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

// run once on load (important)
handleScrollAnimation();



// ===============================
// SIZE & COLOR SELECTION
// ===============================

document.querySelectorAll(".product-card").forEach(card => {

  // Default selections: only set when the product actually has options

  // SIZE
  const sizeButtons = card.querySelectorAll(".size-option");

  sizeButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      sizeButtons.forEach(button => {
        button.classList.remove(
          "border-[#5A189A]",
          "bg-[#5A189A]",
          "text-white"
        );

        button.classList.add("border-gray-600");
      });

      btn.classList.remove("border-gray-600");

      btn.classList.add(
        "border-[#5A189A]",
        "bg-[#5A189A]",
        "text-white"
      );

      card.dataset.selectedSize = btn.dataset.size;

    });

  });

  // COLOR
  const colorButtons = card.querySelectorAll(".color-option");

  // initialize defaults only if options exist
  if (sizeButtons.length > 0 && !card.dataset.selectedSize) {
    // pick first size option as default
    const first = sizeButtons[0].dataset.size || null;
    if (first) card.dataset.selectedSize = first;
  }

  if (colorButtons.length > 0 && !card.dataset.selectedColor) {
    // infer from the first color button
    try {
      const name = inferColorName(colorButtons[0]);
      if (name) card.dataset.selectedColor = name;
    } catch (e) {}
  }

  // helper: convert rgb(...) to hex
  const rgbToHex = (r, g, b) => {
    const toHex = n => {
      const h = Number(n).toString(16);
      return h.length === 1 ? '0' + h : h;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
  };

  // helper: infer a friendly color name from computed style or dataset
  const inferColorName = (btn) => {
    const aria = btn.getAttribute('aria-label') || btn.getAttribute('title');
    const datasetName = btn.dataset.color || '';

    const bg = window.getComputedStyle(btn).backgroundColor;
    let mappedName = '';
    if (bg && bg !== 'transparent') {
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (m) {
        const hex = rgbToHex(m[1], m[2], m[3]);
        const map = {
          '#5a189a': 'Purple',
          '#000000': 'Black',
          '#111111': 'Black',
          '#ffffff': 'White',
          '#f5f5f5': 'White',
          '#0000ff': 'Blue',
          '#00008b': 'Dark Blue',
          '#4169e1': 'Royal Blue',
          '#008000': 'Green',
          '#98fb98': 'Mint',
          '#808080': 'Gray',
          '#a52a2a': 'Brown',
          '#800020': 'Burgundy',
          '#c8a96b': 'Gold',
          '#ffff00': 'Yellow',
          '#ff0000': 'Red'
        };
        mappedName = map[hex] || hex.toUpperCase();
      }
    }

    if (datasetName) {
      // if dataset name disagrees with computed mapped name, prefer computed mapped name
      if (mappedName && datasetName.toLowerCase() !== mappedName.toLowerCase()) {
        return mappedName;
      }
      return datasetName;
    }

    if (aria) return aria;
    if (mappedName) return mappedName;
    return 'Custom';
  };

  colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      colorButtons.forEach(button => {
        button.classList.remove(
          "ring-4",
          "ring-[#C8A96B]"
        );
      });

      btn.classList.add(
        "ring-4",
        "ring-[#C8A96B]"
      );

      // store an inferred color name (falls back to computed style if data-color missing)
      card.dataset.selectedColor = inferColorName(btn);

    });
  });

  // initialize visual selection from dataset (if present)
  try {
    const initial = card.dataset.selectedColor;
    if (initial) {
      const found = Array.from(colorButtons).find(b => inferColorName(b) === initial || (b.dataset.color && b.dataset.color === initial));
      if (found) {
        colorButtons.forEach(button => button.classList.remove('ring-4','ring-[#C8A96B]'));
        found.classList.add('ring-4','ring-[#C8A96B]');
      }
    }
  } catch (e) {
    // noop
  }

});






// ADD TO CART + POPUP

const cartButtons = document.querySelectorAll(".add-to-cart");

if (cartButtons.length > 0) {

  cartButtons.forEach(button => {

    button.addEventListener("click", () => {

      const productPrice = Number(String(button.dataset.price || '').replace(/,/g, ''));

      const productCard = button.closest(".product-card");

      const sizeExists = !!productCard.querySelector('.size-option');
      const colorExists = !!productCard.querySelector('.color-option');

      const selectedSize = sizeExists ? (productCard.dataset.selectedSize || null) : null;
      const selectedColor = colorExists ? (productCard.dataset.selectedColor || null) : null;

      const product = {
        name: button.dataset.name,
        price: Number.isFinite(productPrice) ? productPrice : 0,
        image: button.dataset.image,
        ...(selectedSize ? { size: selectedSize } : {}),
        ...(selectedColor ? { color: selectedColor } : {}),
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(item => {
        if (item.name !== product.name) return false;
        if (product.size) {
          if (item.size !== product.size) return false;
        }
        if (product.color) {
          if (item.color !== product.color) return false;
        }
        return true;
      });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // UPDATE POPUP PRODUCT NAME
      const popupProduct = document.getElementById("popup-product-name");

      if (popupProduct) {
        const details = [];
        if (product.color) details.push(product.color);
        if (product.size) details.push(product.size);
        popupProduct.textContent = details.length ? `${product.name} (${details.join(', ')})` : product.name;
      }

      // SHOW POPUP
      const popup = document.getElementById("cart-popup");

      if (popup) {
        popup.classList.remove("hidden");
        popup.classList.add("flex");
      }

    });

  });

}


// POPUP BUTTONS

const continueBtn = document.getElementById("continue-shopping");
const cartBtn = document.getElementById("go-to-cart");
const popup = document.getElementById("cart-popup");

if (continueBtn && popup) {

  continueBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
  });
}

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}


//cart
const cartItems=document.getElementById("cart-items");
const cartTotal=document.getElementById("cart-total");

let cart= JSON.parse(localStorage.getItem("cart"))||[];
// normalize price to number (handles stored strings like "12,000")
cart = cart.map(item => ({
  ...item,
  price: Number(String(item.price || '').replace(/,/g, '')) || 0
}));
let total = 0;

function renderCart() {

  if (!cartItems || !cartTotal) return;

  total = 0;
  cartItems.innerHTML = '';

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const sizeLine = item.size ? `<p class="text-sm text-gray-400">Size: ${item.size}</p>` : '';
    const colorLine = item.color ? `<p class="text-sm text-gray-400">Color: ${item.color}</p>` : '';
    cartItems.innerHTML += `
    <div class="flex items-center justify-between bg-[#141414] p-5 rounded-xl mb-4">
      <div class="flex items-center gap-6">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg mr-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold">${item.name}</h3>
            ${sizeLine}
            ${colorLine}
            <p class="text-sm text-gray-600">
              ₦${item.price.toLocaleString()} each
            </p>
           
            <div class="mt-2 flex items-center gap-2">
              <button onclick="changeQuantity(${index}, -1)" class="px-2 py-1 bg-gray-800 rounded">-</button>
              <span class="px-3 py-1 bg-[#0d0d0d] rounded">${item.quantity}</span>
              <button onclick="changeQuantity(${index}, 1)" class="px-2 py-1 bg-gray-800 rounded">+</button>
            </div>
          </div>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-400">Subtotal: ₦${(item.price * item.quantity).toLocaleString()}</p>
        <button onclick="removeItem(${index})" class="text-red-500 mt-2">Remove</button>
      </div>
    </div>
    `;
  });

  cartTotal.textContent = `₦${total.toLocaleString()}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// change quantity by delta (can be +1 or -1)
function changeQuantity(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity = (Number(cart[index].quantity) || 0) + delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

//remove item from cart
function removeItem(index){
  cart.splice(index,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// initial render
if (cartItems && cartTotal) {
  renderCart();
}


// Checkout
const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    let message =
      "Hello TRP,\n\n" +
      "I would like to place an order for the following items:\n\n";

    cart.forEach(item => {
      message += `• ${item.name}\n`;
      if (item.size) message += `  Size: ${item.size}\n`;
      if (item.color) message += `  Color: ${item.color}\n`;
      message += `  Quantity: ${item.quantity}\n`;
      message += `  Price: ₦${(item.price * item.quantity).toLocaleString()}\n\n`;
    });

    message += `\nTotal: ₦${total.toLocaleString()}`;

    window.location.href =
      `https://wa.me/2348157996371?text=${encodeURIComponent(message)}`;
  });
}