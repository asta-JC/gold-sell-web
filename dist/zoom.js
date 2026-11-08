function clampPhotoView(view, width, height, imageWidth, imageHeight) {
  const scale = Math.max(1, Math.min(5, view.scale));
  const maxX = Math.max(0, (imageWidth * scale - width) / 2);
  const maxY = Math.max(0, (imageHeight * scale - height) / 2);
  return {scale, x:Math.max(-maxX,Math.min(maxX,view.x)), y:Math.max(-maxY,Math.min(maxY,view.y))};
}

function openProductZoom(trigger) {
  if (document.querySelector('.photo-viewer')) return;
  const source = trigger.querySelector('img');
  if (!source) return;
  const ru = document.documentElement.lang === 'ru';
  const labels = ru
    ? {title:'Фото изделия',close:'Закрыть',in:'Приблизить',out:'Отдалить',reset:'Сбросить',hint:'Масштаб: два пальца или колесо мыши. Перетаскивайте фото, чтобы рассмотреть детали.'}
    : {title:'Mahsulot rasmi',close:'Yopish',in:'Yaqinlashtirish',out:'Uzoqlashtirish',reset:'Asliga qaytarish',hint:'Ikki barmoq yoki sichqoncha g‘ildiragi bilan yaqinlashtiring. Detallarni ko‘rish uchun rasmni suring.'};
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-label',labels.title);
  dialog.innerHTML = `<div class="photo-viewer-bar"><strong>${labels.title}</strong><div class="photo-viewer-controls"><button type="button" data-zoom="out" aria-label="${labels.out}">−</button><button type="button" data-zoom="reset" aria-label="${labels.reset}"><span class="photo-zoom-level" aria-live="polite">100%</span></button><button type="button" data-zoom="in" aria-label="${labels.in}">+</button><button type="button" data-zoom="close" aria-label="${labels.close}" autofocus>×</button></div></div><div class="photo-viewer-stage" tabindex="0" aria-label="${labels.hint}"></div><p class="photo-viewer-hint">${labels.hint}</p>`;
  const stage = dialog.querySelector('.photo-viewer-stage');
  const image = document.createElement('img');
  image.alt = source.alt;
  image.draggable = false;
  stage.append(image);
  let view = {scale:1,x:0,y:0};
  let fitWidth = 0, fitHeight = 0;
  const pointers = new Map();
  let gesture;
  const point = event => {
    const rect = stage.getBoundingClientRect();
    return {x:event.clientX-rect.left-rect.width/2,y:event.clientY-rect.top-rect.height/2};
  };
  function paint() {
    view = clampPhotoView(view,stage.clientWidth,stage.clientHeight,fitWidth,fitHeight);
    image.style.transform = `translate(-50%,-50%) translate(${view.x}px,${view.y}px) scale(${view.scale})`;
    dialog.querySelector('.photo-zoom-level').textContent = Math.round(view.scale*100)+'%';
    dialog.querySelector('[data-zoom="out"]').disabled = view.scale <= 1;
    dialog.querySelector('[data-zoom="in"]').disabled = view.scale >= 5;
    stage.classList.toggle('is-zoomed',view.scale>1);
  }
  function fit() {
    if (!image.naturalWidth) return;
    const ratio = Math.min(stage.clientWidth/image.naturalWidth,stage.clientHeight/image.naturalHeight);
    fitWidth = image.naturalWidth*ratio;
    fitHeight = image.naturalHeight*ratio;
    image.style.width = fitWidth+'px';
    image.style.height = fitHeight+'px';
    view = {scale:1,x:0,y:0};
    pointers.clear(); gesture = null;
    paint();
  }
  function zoom(scale, anchor = {x:0,y:0}) {
    const next = Math.max(1,Math.min(5,scale));
    const ratio = next/view.scale;
    view = {scale:next,x:anchor.x-(anchor.x-view.x)*ratio,y:anchor.y-(anchor.y-view.y)*ratio};
    paint();
  }
  function beginGesture() {
    const points = [...pointers.values()];
    if (!points.length) { gesture = null; return; }
    const mid = points.length > 1 ? {x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2} : points[0];
    const distance = points.length > 1 ? Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y) : 0;
    gesture = {...view,mid,distance};
  }
  stage.addEventListener('pointerdown',event=>{
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,point(event));
    beginGesture();
  });
  stage.addEventListener('pointermove',event=>{
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId,point(event));
    const points = [...pointers.values()];
    const mid = points.length > 1 ? {x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2} : points[0];
    const distance = points.length > 1 ? Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y) : 0;
    const scale = Math.max(1,Math.min(5,gesture.distance ? gesture.scale*distance/gesture.distance : gesture.scale));
    const ratio = scale/gesture.scale;
    view = {scale,x:mid.x-(gesture.mid.x-gesture.x)*ratio,y:mid.y-(gesture.mid.y-gesture.y)*ratio};
    paint();
  });
  for (const type of ['pointerup','pointercancel','lostpointercapture']) stage.addEventListener(type,event=>{
    pointers.delete(event.pointerId); beginGesture();
  });
  stage.addEventListener('wheel',event=>{
    event.preventDefault(); zoom(view.scale*Math.exp(-event.deltaY*.002),point(event));
  },{passive:false});
  stage.addEventListener('dblclick',event=>zoom(view.scale>1?1:2.5,point(event)));
  dialog.addEventListener('click',event=>{
    const action = event.target.closest('[data-zoom]')?.dataset.zoom;
    if (action === 'close') dialog.close();
    if (action === 'in') zoom(view.scale*1.4);
    if (action === 'out') zoom(view.scale/1.4);
    if (action === 'reset') zoom(1);
  });
  dialog.addEventListener('keydown',event=>{
    if (['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) event.preventDefault();
    if (['+','='].includes(event.key)) zoom(view.scale*1.4);
    if (event.key === '-') zoom(view.scale/1.4);
    if (event.key === '0') zoom(1);
    const directions = {ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};
    if (directions[event.key]) { view.x+=directions[event.key][0]; view.y+=directions[event.key][1]; paint(); }
  });
  const close = () => dialog.close();
  const previousOverflow = document.body.style.overflow;
  dialog.addEventListener('close',()=>{
    window.removeEventListener('resize',fit);
    window.removeEventListener('hashchange',close);
    document.body.style.overflow = previousOverflow;
    dialog.remove();
    if (trigger.isConnected) trigger.focus({preventScroll:true});
  },{once:true});
  image.addEventListener('load',fit);
  image.addEventListener('error',()=>{ stage.textContent = ru ? 'Не удалось загрузить фото.' : 'Rasmni yuklab bo‘lmadi.'; });
  document.body.append(dialog);
  document.body.style.overflow = 'hidden';
  dialog.showModal();
  window.addEventListener('resize',fit);
  window.addEventListener('hashchange',close);
  image.src = source.currentSrc || source.src;
  if (image.complete) fit();
}
