jQuery(document).ready(function($) {
  var alterClass = function() {
    var ww = document.body.clientWidth;
    if (ww < 990) {
      $('.mega-dropdown-menu').removeClass('show');
    } else if (ww >= 991) {
      $('.mega-dropdown-menu').addClass('show');
    };
  };
  $(window).resize(function(){
    alterClass();
  });
  //Fire it when the page first loads:
  alterClass();
});

function encodeForAjax(data) {
  if (data == null) return null;
  return Object.keys(data).map(function(k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');
}

function sendAjaxRequest(method, url, data, handler) {
  let request = new XMLHttpRequest();

  request.open(method, url, true);
  request.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.addEventListener('load', handler);
  request.send(encodeForAjax(data));
}


function addEventListeners() {

// ---------------------------------
//            PROFILE
//----------------------------------

  let profile_button = document.querySelectorAll(".profile-user-menu li");
  [].forEach.call(profile_button, function(change) {
    change.onclick = function(){
      changeProfilePill(this);
    }
  });

// ---------------------------------
//            PRODUCT
//----------------------------------

  let fav_button = document.querySelectorAll(' #fav');
  [].forEach.call(fav_button, function(fav) {
    fav.onclick = function(){
      favoriteRequest(this);
    }
  });

  let comment_button = document.querySelector('form.submit-review #submit_review');
  if(comment_button!=null)
    comment_button.onclick = function(event){
      addReviewRequest(this,event);
  }

  let rate_button = document.querySelectorAll('form.submit-review .review-block-rate button');
  [].forEach.call(rate_button, function(rate) {
    rate.onmouseover = function(){
      activateRateButtons(this);
    }
    rate.onmouseleave = function(){
      deactivateRateButtons(this);
    }

    rate.onclick = function(){
      finalRateButtons(this);
    }
  });

// ---------------------------------
//            CART
//----------------------------------

  let order_deleter = document.querySelectorAll('.product-order #delete');
  [].forEach.call(order_deleter, function(deleter) {
    deleter.onclick = function(){
      sendDeleteOrderRequest(this);
    }
  });

  let delete_review = document.querySelectorAll('.remove_comment #delete');
  [].forEach.call(delete_review, function(del){
    del.onclick = function(){
      sendDeleteReviewRequest(this);
    }
  });

  let quantity_button = document.querySelectorAll('.product-order #quantity');
  [].forEach.call(quantity_button, function(changer) {
    changer.onclick = function(){
      sendUpdateQuantityRequest(this);
    }
  });

  let cart_button = document.querySelectorAll('#cart');
  [].forEach.call(cart_button, function(adder) {
    adder.onclick = function(){
      sendAddCartRequest(this);
    }
  });
 

  let final_step = document.querySelector('#step-3-next');
  if(final_step!=null)
  final_step.onclick = function(){
    makeFinalStep(this);
  }

  let confirmation = document.querySelector("#confirmation");
  if(confirmation!=null)
    confirmation.onclick = function(){
    sendConfirmationRequest(this);
  }

}

// ---------------------------------
//            Cart
//----------------------------------

function sendConfirmationRequest(button){
  let address = document.querySelector('#address-conf').innerHTML;
  let contact = document.querySelector('#contact-conf').innerHTML;
  let payment = document.querySelector('#payment-conf').innerHTML;
  let total = document.querySelector('#total-conf').innerHTML;

  if(+total>0)
    sendAjaxRequest('put', '/orders/create' ,{address:address,contact:contact,payment:payment},confirmationHandler);
  else
    alert("You can not make an order whit no products attached!");
}

function confirmationHandler(){
  let order = JSON.parse(this.responseText);
  let element = document.getElementById('progress-bar');
  let price_cart =document.querySelector('#nav_cart').innerHTML = `<i class="fa fa-shopping-cart"></i>0,00 € `;

  element.innerHTML = `
                        <div class="jumbotron text-center" style="background-color:transparent;">
                        <br><br><br>
                        <h1 class="display-3">Thank You!</h1><br>
                        <p class="lead"> Your transaction has been successfully aproved. You will received your order really soon.</p>
                        <hr>
                      
                        <p class="lead"><br>
                          <a class="btn btn-success btn-lg" href="/" role="button">Continue to homepage</a>
                        </p>
                        <br><br><br>
                      </div>`
  
}


function makeFinalStep(button){

  let address_final = document.getElementById('address').value
                + " " + document.getElementById('city').value
                + " " + document.getElementById('zip').value;
  let contact_final= document.getElementById('contact').value;
  let radios = document.getElementsByName('payment');
 
  let payment_final;
  for (let i = 0, length = radios.length; i < length; i++){
    if (radios[i].checked){
       payment_final=radios[i].value;
      break;
    }
  }

  let address = document.querySelector('#address-conf');
  address.innerHTML = `${address_final}`;
  let contact = document.querySelector('#contact-conf');
  contact.innerHTML = `${contact_final}`;
  let payment = document.querySelector('#payment-conf');
  payment.innerHTML = `${payment_final}`;


}

function sendAddCartRequest(button){
  let id = button.closest('div.product').getAttribute('data-id');

  if(!button.disabled)
    addProductToCard(id);

}

function addProductToCard(id_product) {
  var cart = Cookies.getJSON('cart');
  if(cart == null){
    let product = {
      id: id_product,
      count: 1
    }
    cart = [product];
    Cookies('cart', cart);
  }
  else{
    let found = false
    cart.forEach(function(x) {
      if(x.id == id_product){
        found = true;
        x.count++;
      }
    })
    if(!found) {
      let product = {
        id: id_product,
        count: 1
      }
      cart.push(product);
    }
    Cookies.set('cart', cart);
  }
  return cart;
}

function decreaseProductToCard(id_product) {
  var cart = Cookies.getJSON('cart');
  if(cart != null){
    cart.forEach(function(x) {
      if(x.id == id_product){
        x.count--;
        if(x.count == 0){
          cart.splice(cart.indexOf(x), 1);
        }
      }
    })
    Cookies.set('cart', cart);
  }
  return cart;
}

function removeProductFromCard(id_product) {
  var cart = Cookies.getJSON('cart');
  if(cart != null){
    cart.forEach(function(x) {
      if(x.id == id_product){
        cart.splice(cart.indexOf(x), 1);
      }
    })
    Cookies.set('cart', cart);
  }
  return cart;
}

function  addCartHandler(){
  let product = JSON.parse(this.responseText);
  let button = document.querySelector('div.product[data-id="' + product.id + '"] #cart');

  button.innerHTML ='<i class="fa fa-check"></i> In Cart';
  button.disabled =true;

}

function sendUpdateQuantityRequest(button){
  let id = button.closest('div.product-order').getAttribute('data-id');
  let value = button.value;

  if(value == "+")
    addProductToCard(id);

  if(value == "-")
    decreaseProductToCard(id);

}

function sendDeleteOrderRequest(button){
  let id = button.closest('div.product-order').getAttribute('data-id');

  removeProductFromCard(id);
}

function deleteOrderHandler(){
  if (this.status != 200) window.location = '/';

  let response = JSON.parse(this.responseText);
  let product = response['product'];
  let quantity = response['quantity'];


  let price_cart =document.querySelector('div.shopping-cart .price');
  let price_nav = document.querySelector('#nav_cart');
  let price = Math.round((+price_cart.innerHTML - (+product.price* +quantity) ) * 100) / 100 ;

  price_cart.innerHTML = price;
  price_nav.innerHTML = `<i class="fa fa-shopping-cart"></i>${price} € `;


  let element = document.querySelector('div.product-order[data-id="' + product.id + '"]');
  element.remove();

}

function deleteReviewHandler(){
  if (this.status != 200) window.location = '/';

  let id = JSON.parse(this.responseText);


  let element = document.querySelector('div.review-container[data-id="' + id + '"]');
  element.remove();

}

function updateQuantityHandler(){
  if (this.status != 200) window.location = '/';

  let response = JSON.parse(this.responseText);
  let product = response['product'];
  let quantity = response['quantity'];
  let op = response['op'];

  let cart_quantity =document.querySelector('div.product-order[data-id="' + product.id + '"] .qty');
  let conf_quantity = document.querySelector('div.product-conf[data-id="' + product.id + '"] .qty');
  let price_cart =document.querySelector('div.shopping-cart .price');
  let price_nav = document.querySelector('#nav_cart');
  let price_conf =document.querySelector('#total-conf');


  if(quantity >=1){
     cart_quantity.value = quantity;
     conf_quantity.innerHTML = `<strong>Quantity:</strong>  ${quantity}`
  }

  let price =0;
  if(op== 'add')
    price = Math.round((+price_cart.innerHTML + +product.price) * 100) / 100 ;
  

  if(op== 'sub')
    price = Math.round((+price_cart.innerHTML - +product.price) * 100) / 100 ;
  
  if(price >0){
    price_cart.innerHTML = price;
    price_nav.innerHTML = `<i class="fa fa-shopping-cart"></i>${price} € ` 
    price_conf.innerHTML = price;
  }

}
// ---------------------------------
//         Profile Buttons
//----------------------------------

function changeProfilePill(pill){
  let active_pill = document.querySelector(".profile-user-menu li.active");

  active_pill.classList.remove('active');
  pill.classList.add('active');

}

addEventListeners();