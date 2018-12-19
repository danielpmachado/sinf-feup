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
    $('#step-4-link').removeClass('disabled');
    $('#step-4-link').tab('show')
    setPurchaseInfo();
  }



}

// ---------------------------------
//            Cart
//----------------------------------

$("#confirmation").on("click", sendConfirmationRequest);

function sendConfirmationRequest(){
  let address = document.querySelector('#address-conf').innerHTML;
  let city = document.querySelector('#city').value;
  let zip = document.querySelector('#zip').value;
  let payment = document.querySelector('#payment-conf').innerHTML;
  let total = document.querySelector('#total-conf').innerHTML;
  let products = Cookies.getJSON('cart');
  let id = $("#load_data")[0].getAttribute("data-id");

  let order = {
    "Linhas": [], 
    "Tipodoc": "ECL", 
    "Entidade": id,
    "TipoEntidade": "C",
    "ModoPag": payment,
    "MoradaEntrega": address,
    "LocalidadeEntrega": city,
    "CodPostalEntrega": zip,
    "DataVenc": "22-10-2018",
  }
  products.forEach(function(element){
    order.Linhas.push({"Artigo": element.id, "Quantidade": element.count});
  })

  if(+total>0){
    $.ajax({
      method: 'post',
      url: '/cart/orders/create',
      data: order,
      success: function(data, textStatus, jQxhr) {
        console.log("Fdsfsd");
        confirmationHandler();
      }
    });
  }
  else
    alert("You can not make an order whit no products attached!");
}

function confirmationHandler(){
  console.log("gsfsd");
  let element = document.getElementById('progress-bar');

  element.innerHTML = `
                        <div class="jumbotron text-center" style="background-color:transparent;">
                        <br><br><br>
                        <h1 class="display-3">Thank You!</h1><br>
                        <p class="lead"> Your purchase has been successfully aproved. You will received your order as soon as possible.</p>
                        <hr>
                        <p class="lead"><br>
                          <a class="btn btn-success btn-lg" href="/" role="button">Continue to homepage</a>
                        </p>
                        <br><br><br>
                      </div>`
  
}

function sendAddCartRequest(button){
  let id = button.closest('div.product').getAttribute('data-id');

  if(!button.disabled){
    addProductToCard(id);
    button.innerHTML ='<i class="fa fa-check"></i> In Cart';
    qty_nav = document.querySelector('#unit-cart');
    qty_nav.innerText= +qty_nav.innerText +1;
    button.disabled =true;
  }

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

function increaseProductToCard(id_product){
  var cart = Cookies.getJSON('cart');
  if(cart != null){
    cart.forEach(function(x) {
      if(x.id == id_product){
        x.count++;

      }
    })
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

function sendUpdateQuantityRequest(button){
  let id = button.closest('div.product-order').getAttribute('data-id');
  let value = button.value;

  updateQuantityHandler(id, value);


}

function sendDeleteOrderRequest(button){
  let id = button.closest('div.product-order').getAttribute('data-id');

  let quantity = document.querySelector('div.product-order[data-id="' + id + '"] .qty').value;
  let price =document.querySelector('div.product-order[data-id="' + id + '"] .price').innerHTML;
  let total_old =document.querySelector('#totalPrice');

  let total_new = Math.round((+total_old.innerText- (+price* +quantity) ) * 100) / 100 ;
  total_old.innerText = total_new;

  qty_nav = document.querySelector('#unit-cart');
    qty_nav.innerText= +qty_nav.innerText -quantity;
 
  let element = document.querySelector('div.product-order[data-id="' + id + '"]');
  element.remove();

  removeProductFromCard(id);

}

function updateQuantityHandler(id, op){

  let cart_quantity =document.querySelector('div.product-order[data-id="' + id + '"] .qty');
  let price = document.querySelector('div.product-order[data-id="'+ id + '"] .price').innerText;
  let total_old =document.querySelector('#totalPrice');

  let total =0;

  if(op== '+')
  total = Math.round((+total_old.innerHTML + +price) * 100) / 100 ;

  if(op== '-')
    total = Math.round((+total_old.innerHTML - +price) * 100) / 100 ;

  if(total >0){
    qty_nav = document.querySelector('#unit-cart');
    if(op== '+'){
      qty_nav.innerText= +qty_nav.innerText +1;
      cart_quantity.value++;
      increaseProductToCard(id);
    }
    if(op== '-'){
      qty_nav.innerText= +qty_nav.innerText -1;
      cart_quantity.value--;
      decreaseProductToCard(id);
    }

    total_old.innerHTML = total; 
   
  }

}
// ---------------------------------
//         Profile Buttons
//----------------------------------


let profile_button = document.querySelectorAll(".profile-user-menu li");
[].forEach.call(profile_button, function(change) {
  change.onclick = function(){
    changeProfilePill(this);
  }
});

function changeProfilePill(pill){
  let active_pill = document.querySelector(".profile-user-menu li.active");

  active_pill.classList.remove('active');
  pill.classList.add('active');

}

addEventListeners();

// ---------------------------------
//         Ban User
//----------------------------------


$('.ban-user-btn').on('click', banUser);
function banUser(context){
    let userID = context.target.getAttribute("data-id");
    $("li[data-id=" + userID + "]").remove();
    
    $.ajax({
      url: '/admin/ban/' + userID});

}


// ---------------------------------
//            Cart
//----------------------------------


$('#load_data').on('click', loadData);
function loadData(context){
    let userID = context.target.getAttribute("data-id");
    $("li[data-id=" + userID + "]").remove();
    
    $.ajax({
      url: '/user/' + userID,
      success: function(data, textStatus, jQxhr) {
        $("#address").val(data.Fac_Mor);
        $("#city").val(data.Fac_Local);
        $("#zip").val(data.Fac_Cp);
        $("#nif").val(data.NumContrib);
      }
    });
}

function setPurchaseInfo(){
  $("#address-conf").text($("#address").val() + " " + $("#city").val() + " " + $("#zip").val());
  $("#nif-conf").text($("#nif").val());
  $("#total-conf").text($("#totalPrice").text());

  let payment;
  let radios = document.getElementsByName('payment');
  for (let i = 0, length = radios.length; i < length; i++){
    if (radios[i].checked){
       payment=radios[i].value;
      break;
    }
  }

  $("#payment-conf").text(payment);

  let list = document.getElementById("products_list");
  list.innerHTML = `<h5><strong>Products</strong></h5>`;
  let cart = $(".product-order");
  for(i=0; i < cart.length; i++){
    let name = cart[i].querySelector(".product-name strong").innerHTML;
    let price = cart[i].querySelector(".price").innerHTML;
    let quantity = cart[i].querySelector(".qty").value;
    
    list.innerHTML += 
    `
     <div class="product-conf">
        <h6><strong>Name:</strong> ` + name + `</h6>
        <h6 class="qty"><strong>Quantity:</strong> ` + quantity + `</h6>
        <h6><strong>Price:</strong> ` + price + ` €</h6>
        <br>
     </div>
     `
  } 

  list.innerHTML += `<hr>`

  $("#payment-conf").text(payment)
}

