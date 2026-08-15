const PRODUCTS = [
  {id:'americano',name:'Americano',desc:'Bold espresso softened with hot water.',price:120,image:'./assets/coffee-cutout.png'},
  {id:'iced',name:'Iced Americano',desc:'Bold, smooth, and refreshing.',price:120,image:'./assets/coffee-cutout.png'},
  {id:'caramel',name:'Caramel Macchiato',desc:'Silky milk, espresso, and caramel.',price:150,image:'./assets/coffee-cutout.png'},
  {id:'mocha',name:'Mocha',desc:'Chocolate, espresso, and creamy foam.',price:160,image:'./assets/coffee-cutout.png'},
  {id:'coldbrew',name:'Cold Brew',desc:'Slow-steeped, naturally sweet and low acid.',price:130,image:'./assets/coffee-cutout.png'},
  {id:'latte',name:'Latte',desc:'Smooth espresso with steamed milk.',price:150,image:'./assets/coffee-cutout.png'}
];
const SIZES=[{id:'s',label:'S',oz:'12oz',add:0},{id:'m',label:'M',oz:'16oz',add:30},{id:'l',label:'L',oz:'20oz',add:60}];
let state={index:1,size:'s',qty:1,cart:{}};
const $=id=>document.getElementById(id);
const money=n=>'₱'+Math.round(n).toLocaleString('en-PH');
const product=()=>PRODUCTS[state.index];
const size=()=>SIZES.find(s=>s.id===state.size);
const currentPrice=()=>product().price+size().add;
function cartCount(){return Object.values(state.cart).reduce((n,i)=>n+i.qty,0)}
function cartTotal(){return Object.values(state.cart).reduce((n,i)=>n+i.qty*i.price,0)}
function renderSizes(){
  $('sizes').innerHTML=SIZES.map(s=>`<button class="size-btn ${s.id===state.size?'active':''}" data-size="${s.id}"><div class="lbl">${s.label}</div><div class="oz">${s.oz}</div></button>`).join('');
  document.querySelectorAll('.size-btn').forEach(b=>b.onclick=()=>{state.size=b.dataset.size;renderSizes();renderDetails();});
}
function renderDeck(){
  const deck=$('product-deck');deck.innerHTML='';
  PRODUCTS.forEach((p,i)=>{
    let d=i-state.index;if(d>PRODUCTS.length/2)d-=PRODUCTS.length;if(d<-PRODUCTS.length/2)d+=PRODUCTS.length;
    const card=document.createElement('div');card.className='product-card';
    let cls=''; if(d===0)cls='front'; else if(d===1)cls='back-1'; else if(d===2)cls='back-2'; else if(d===3)cls='back-3'; else if(d===4)cls='back-4'; else if(d===5)cls='back-5';
    card.classList.add(cls, `product-${i}`);
    const transforms={front:'translate(-50%,-50%) scale(1)', 'back-1':'translate(-50%,-32%) scale(.83)','back-2':'translate(-50%,-18%) scale(.69)','back-3':'translate(-50%,-8%) scale(.57)','back-4':'translate(-50%,0) scale(.47)','back-5':'translate(-50%,7%) scale(.39)'};
    card.style.transform=transforms[cls]||'translate(-50%,12%) scale(.3)';card.style.opacity=cls==='front'?1:Math.max(.05,1-Math.abs(d)*.16);card.style.filter=cls==='front'?'none':'blur(1.2px) saturate(.75)';
    card.innerHTML=`<img src="${p.image}" alt="${p.name}" draggable="false" onerror="this.onerror=null;this.src='./assets/iced-coffee.png'"><div class="peek-label">${String(i+1).padStart(2,'0')}<br>${p.name}</div>`;
    deck.appendChild(card);
  });
}
function renderDetails(){
  const p=product();$('product-counter').textContent=`${String(state.index+1).padStart(2,'0')} / ${String(PRODUCTS.length).padStart(2,'0')}`;$('detail-number').textContent=String(state.index+1).padStart(2,'0');$('detail-name').textContent=p.name;$('detail-desc').textContent=p.desc;$('detail-price').textContent=money(currentPrice());$('addbtn-label').textContent=`Add to cart · ${money(currentPrice()*state.qty)}`;renderDeck();
}
function go(step){state.index=(state.index+step+PRODUCTS.length)%PRODUCTS.length;const d=$('details');d.classList.remove('bump');void d.offsetWidth;d.classList.add('bump');renderDetails()}
function addCurrent(){const p=product(),key=`${p.id}-${state.size}`;if(state.cart[key])state.cart[key].qty+=state.qty;else state.cart[key]={name:`${p.name} (${size().label})`,price:currentPrice(),qty:state.qty};renderBadge();renderCart();const b=$('btn-add-bottom');b.classList.add('bump');b.querySelector('#addbtn-label').textContent='Added to cart';setTimeout(()=>{b.classList.remove('bump');renderDetails()},850)}
function renderBadge(){const b=$('cart-badge'),n=cartCount();b.hidden=n===0;b.textContent=n}
function renderCart(){const entries=Object.entries(state.cart),wrap=$('cart-items');wrap.innerHTML='';$('cart-empty').classList.toggle('hidden',entries.length>0);$('checkout-wrap').classList.toggle('hidden',entries.length===0);entries.forEach(([key,item])=>{const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<div class="cart-item-icon">☕</div><div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-meta">Qty ${item.qty} · ${money(item.price)}</div></div><div class="cart-item-price">${money(item.price*item.qty)}</div><button class="cart-item-remove">×</button>`;row.querySelector('.cart-item-remove').onclick=()=>{delete state.cart[key];renderBadge();renderCart()};wrap.appendChild(row)});$('subtotal').textContent=money(cartTotal());$('checkout-total').textContent=money(cartTotal())}
function showCart(v){$('screen-product').classList.toggle('hidden',v);$('screen-cart').classList.toggle('hidden',!v)}
let touchY=0,touchX=0,lastWheel=0;
function bindSwipe(){const stage=$('swipe-stage');stage.addEventListener('touchstart',e=>{touchY=e.changedTouches[0].clientY;touchX=e.changedTouches[0].clientX},{passive:true});stage.addEventListener('touchend',e=>{const y=e.changedTouches[0].clientY,x=e.changedTouches[0].clientX;const dy=y-touchY,dx=x-touchX;if(Math.abs(dy)>42&&Math.abs(dy)>Math.abs(dx)){go(dy>0?1:-1)}},{passive:true});stage.addEventListener('wheel',e=>{const now=Date.now();if(now-lastWheel<420)return;if(Math.abs(e.deltaY)>18){go(e.deltaY>0?1:-1);lastWheel=now}}, {passive:true});stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')stage.setPointerCapture(e.pointerId)});}
function init(){renderSizes();renderDetails();renderBadge();renderCart();bindSwipe();$('btn-add').onclick=addCurrent;$('btn-add-bottom').onclick=addCurrent;$('qty-minus').onclick=()=>{state.qty=Math.max(1,state.qty-1);renderDetails()};$('qty-plus').onclick=()=>{state.qty++;renderDetails()};$('btn-cart').onclick=()=>showCart(true);$('btn-toproduct').onclick=()=>showCart(false);$('btn-back').onclick=()=>showCart(false);$('btn-checkout').onclick=()=>alert('Demo checkout — connect this to your payment flow.');}
document.addEventListener('DOMContentLoaded',init);
