const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const escapeHTML=(value='')=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const imagePath=id=>`assets/${id}.webp`;

let siteData=null;
let stories=new Map();
let storyKinds=new Map();
let currentFilter='All';
let visibleCount=8;
let lightboxItems=[];
let lightboxIndex=0;
let lightboxReturn=null;
let storyReturn=null;
let lockedScroll=0;

const storyDialog=$('#story-dialog');
const lightbox=$('#lightbox');
const galleryCategories=['All','Wish Bag','Community Projects','Dance & Arts','Creative Practice'];
const media=[
  ['wish-0','Wish Bag','Wish Bag — Reusable bags made from leftover textiles.'],
  ['echoes-0','Community Projects','Echoes of the Highlands — A moment with the school community.'],
  ['dance-0','Dance & Arts','Latin Dance — Rhythm and expression in performance.'],
  ['stream-3','Community Projects','The Stream of Love — Visiting the Southern Horticultural Research Institute.'],
  ['wish-36','Wish Bag','Wish Bag — Working with reusable textile products.'],
  ['echoes-17','Community Projects','Echoes of the Highlands — A shared moment during the program.'],
  ['dance-6','Dance & Arts','Latin Dance — A competition performance in turquoise.'],
  ['stream-0','Community Projects','The Stream of Love — A community outreach visit in Tien Giang.'],
  ['wish-48','Wish Bag','Wish Bag — A closer look at textile tote bag designs.'],
  ['echoes-3','Community Projects','Echoes of the Highlands — At the fundraising booth.'],
  ['dance-2','Dance & Arts','Latin Dance — Movement and stage presence.'],
  ['stream-1','Community Projects','The Stream of Love — Exploring agriculture in Tien Giang.'],
  ['wish-20','Wish Bag','Wish Bag — The project booth and textile collection.'],
  ['echoes-11','Community Projects','Echoes of the Highlands — Students at the community celebration.'],
  ['dance-3','Dance & Arts','Latin Dance — A moment on the competition floor.'],
  ['echoes-8','Community Projects','Echoes of the Highlands — Food and beverage booth activities.'],
  ['stream-4','Community Projects','The Stream of Love — A visit with fellow participants.'],
  ['wish-8','Wish Bag','Wish Bag — Sharing reusable designs at the booth.'],
  ['echoes-12','Community Projects','Echoes of the Highlands — Coming together for the Mid-Autumn program.'],
  ['dance-8','Dance & Arts','Latin Dance — Creative expression through performance.'],
  ['wish-32','Wish Bag','Wish Bag — Bringing textile ideas to life.'],
  ['arts-drawing','Creative Practice','Drawing — Elephant and forest study in mixed media.','assets/arts-drawing.jpg'],
  ['arts-academic-book','Creative Practice','Drawing — A storybook scene brought to life in colour.','assets/arts-academic-book.jpg'],
  ['arts-clothes','Creative Practice','Creative practice — Vietnamese-inspired clothing design on stage.','assets/arts-clothes.jpg']
].map(([id,category,caption,url])=>({id,category,caption,url:url||imagePath(id)}));

function adaptiveHumanIllustration(){
  return `<svg class="adaptive-illustration" viewBox="0 0 620 620" role="img" aria-labelledby="adaptive-title adaptive-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="adaptive-title">The adaptive human at work</title>
    <desc id="adaptive-desc">A service worker stands at the centre of three orbiting paths, connecting a traditional workplace on the left with an AI-integrated workplace on the right.</desc>
    <defs>
      <linearGradient id="adaptive-skin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F8E9E9"/>
        <stop offset="1" stop-color="#EFCFD9"/>
      </linearGradient>
      <linearGradient id="adaptive-coat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F8E9E9"/>
        <stop offset="1" stop-color="#B8A1D8"/>
      </linearGradient>
      <linearGradient id="adaptive-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#B8A1D8" stop-opacity=".8"/>
        <stop offset="1" stop-color="#6A405B" stop-opacity=".8"/>
      </linearGradient>
      <filter id="adaptive-soften" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <path id="adaptive-path-one" d="M115 265 C205 95 420 95 510 265"/>
      <path id="adaptive-path-two" d="M95 390 C220 555 400 555 525 390"/>
    </defs>

    <g class="adaptive-orbits" fill="none">
      <ellipse class="adaptive-orbit adaptive-orbit-one" cx="310" cy="310" rx="258" ry="155" transform="rotate(-25 310 310)"/>
      <ellipse class="adaptive-orbit adaptive-orbit-two" cx="310" cy="310" rx="230" ry="188" transform="rotate(34 310 310)"/>
      <ellipse class="adaptive-orbit adaptive-orbit-three" cx="310" cy="310" rx="178" ry="250" transform="rotate(-8 310 310)"/>
      <circle class="adaptive-orbit-core" cx="310" cy="310" r="105"/>
    </g>

    <g class="adaptive-traditional" aria-hidden="true">
      <path class="adaptive-work-line" d="M78 210h100M62 425h120"/>
      <rect class="adaptive-task-card" x="60" y="231" width="112" height="82" rx="5"/>
      <path class="adaptive-task-line" d="M77 255h60M77 273h43M77 291h70"/>
      <path class="adaptive-bubble" d="M77 367c0-16 14-28 31-28h54c17 0 31 12 31 28s-14 28-31 28h-23l-17 17v-17h-14c-17 0-31-12-31-28Z"/>
      <circle class="adaptive-bubble-dot" cx="126" cy="367" r="4"/>
      <circle class="adaptive-bubble-dot" cx="143" cy="367" r="4"/>
      <circle class="adaptive-bubble-dot" cx="160" cy="367" r="4"/>
      <rect class="adaptive-label-plate" x="53" y="444" width="150" height="28" rx="4"/>
      <text class="adaptive-side-label" x="128" y="462" text-anchor="middle">KNOWN ROUTINES</text>
    </g>

    <g class="adaptive-ai" aria-hidden="true">
      <path class="adaptive-network-line" d="M438 196 500 154 548 210 505 273 558 329 502 378 548 443 474 471"/>
      <path class="adaptive-network-line" d="M438 196 505 273 438 357 502 378"/>
      <path class="adaptive-network-line" d="M500 154 505 273 548 443"/>
      <circle class="adaptive-ai-node" cx="438" cy="196" r="8"/>
      <circle class="adaptive-ai-node" cx="500" cy="154" r="6"/>
      <circle class="adaptive-ai-node" cx="548" cy="210" r="10"/>
      <circle class="adaptive-ai-node" cx="505" cy="273" r="7"/>
      <circle class="adaptive-ai-node" cx="558" cy="329" r="6"/>
      <circle class="adaptive-ai-node" cx="438" cy="357" r="9"/>
      <circle class="adaptive-ai-node" cx="502" cy="378" r="6"/>
      <circle class="adaptive-ai-node" cx="548" cy="443" r="9"/>
      <circle class="adaptive-ai-node" cx="474" cy="471" r="6"/>
      <rect class="adaptive-label-plate" x="431" y="485" width="153" height="28" rx="4"/>
      <text class="adaptive-side-label" x="507" y="503" text-anchor="middle">NEW POSSIBILITIES</text>
      <circle class="adaptive-particle adaptive-particle-one" r="4" fill="#EFCFD9">
        <animateMotion dur="8s" repeatCount="indefinite" path="M438 196 505 273 558 329"/>
      </circle>
      <circle class="adaptive-particle adaptive-particle-two" r="3" fill="#B6B28B">
        <animateMotion dur="10s" repeatCount="indefinite" path="M500 154 505 273 438 357"/>
      </circle>
    </g>

    <g class="adaptive-human">
      <ellipse class="adaptive-ground" cx="310" cy="540" rx="88" ry="15"/>
      <g class="adaptive-human-body">
        <path class="adaptive-backpack" d="M263 291c-25 23-31 69-21 107l-13 74c-2 12 7 21 19 21h26l11-101 11 101h29l2-119-4-63c-13-21-40-29-60-20Z"/>
        <path class="adaptive-coat" d="M292 290c-20 10-31 35-29 63l10 51 26-8 5-65 9 65 27 8 9-51c2-28-9-53-29-63l-8 29-12 16-12-16-8-29Z"/>
        <path class="adaptive-shirt" d="m304 319 6 18 7-18 12 9-19 31-19-31 13-9Z"/>
        <path class="adaptive-arm adaptive-arm-left" d="M273 315c-16 18-29 40-37 68-3 10 3 19 13 22 8 2 16-2 20-10l25-53-21-27Z"/>
        <path class="adaptive-arm adaptive-arm-right" d="M349 315c16 18 29 40 37 68 3 10-3 19-13 22-8 2-16-2-20-10l-25-53 21-27Z"/>
        <path class="adaptive-hand" d="M235 397c-5 4-7 12-3 17 4 5 12 6 17 2l7-9-8-12-13 2Z"/>
        <path class="adaptive-hand" d="M385 397c5 4 7 12 3 17-4 5-12 6-17 2l-7-9 8-12 13 2Z"/>
        <path class="adaptive-leg" d="m278 414-5 110 26 0 14-74 14 74 27 0-6-110-70 0Z"/>
        <path class="adaptive-shoe" d="M273 518h27c7 0 12 6 12 13v6h-49v-6c0-7 4-13 10-13ZM326 518h27c6 0 11 6 11 13v6h-49v-6c0-7 5-13 11-13Z"/>
        <path class="adaptive-neck" d="M299 280h24v28c0 7-5 12-12 12s-12-5-12-12v-28Z"/>
        <ellipse class="adaptive-head" cx="311" cy="258" rx="43" ry="51"/>
        <path class="adaptive-hair" d="M271 264c-7-40 9-70 43-70 31 0 49 23 42 65l-14-25-15 13-31-18-13 35-12 0Z"/>
        <path class="adaptive-face-line" d="M294 267c4 3 8 3 12 0M322 267c4 3 8 3 12 0M305 284c5 4 10 4 15 0"/>
        <path class="adaptive-earpiece" d="M349 258c12 2 14 19 2 24"/>
      </g>
    </g>

    <g class="adaptive-captions" aria-hidden="true">
      <rect class="adaptive-caption-plate" x="135" y="59" width="350" height="58" rx="6"/>
      <text x="310" y="83" text-anchor="middle" class="adaptive-caption-main">ADAPTIVE HUMAN</text>
      <text x="310" y="103" text-anchor="middle" class="adaptive-caption-sub">perception · mindset · movement</text>
      <rect class="adaptive-caption-plate" x="133" y="555" width="354" height="35" rx="6"/>
      <text x="310" y="579" text-anchor="middle" class="adaptive-caption-sub">AI changes the context. People choose the next step.</text>
    </g>
  </svg>`;
}

function renderResearch(){
  const facts=[['S-O-R framework','SmartPLS','302 survey responses'],['Mixed methods','PLS-SEM','CEO & HR interviews']];
  $('#research-stories').innerHTML=siteData.research.map((research,index)=>{
    const external=research.paper_url||research.source_paper_url;
    const diagram=index===0
      ? adaptiveHumanIllustration()
      : '<div class="method-path" aria-hidden="true"><span>Interview insights</span><span>Survey evidence</span><span>PLS-SEM</span><span>Organizational change</span></div>';
    return `<article class="research-story reveal">
      <div class="research-diagram">${diagram}</div>
      <div class="research-content">
        <div class="research-meta"><span>Study 0${index+1}</span><span>${escapeHTML(research.meta)}</span></div>
        <h3>${escapeHTML(research.title)}</h3>
        <p>${escapeHTML(research.overview)}</p>
        <div class="research-facts">${facts[index].map(item=>`<span>${escapeHTML(item)}</span>`).join('')}</div>
        <div class="research-actions"><button class="text-button light" type="button" data-story="${escapeHTML(research.id)}">Read the research note ↗</button>${external?`<a class="text-button light" href="${escapeHTML(external)}" target="_blank" rel="noopener noreferrer">View paper ↗</a>`:''}</div>
      </div>
    </article>`;
  }).join('');
}

function renderProjects(){
  $('#project-stories').innerHTML=siteData.projects.map((project,index)=>{
    const image=project.cover?`<img src="${imagePath(project.cover)}" alt="${escapeHTML(media.find(item=>item.id===project.cover)?.caption||project.title)}" width="1200" height="900" loading="lazy">`:'';
    if(index===0){
      return `<article class="project-feature reveal">
        <button class="project-media" type="button" data-story="${escapeHTML(project.id)}" aria-label="Explore ${escapeHTML(project.title)}"><span class="project-label">${escapeHTML(project.category)}</span>${image}</button>
        <div class="project-feature-copy"><p class="eyebrow">Lead project / Applied entrepreneurship</p><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.overview)}</p><p class="research-meta"><span>${escapeHTML(project.meta)}</span></p><button class="button" type="button" data-story="${escapeHTML(project.id)}">Explore the project <span aria-hidden="true">↗</span></button></div>
      </article>`;
    }
    return `<article class="project-card${project.cover?'':' no-image'} reveal">
      <button class="project-media" type="button" data-story="${escapeHTML(project.id)}" aria-label="Explore ${escapeHTML(project.title)}"><span class="project-label">${escapeHTML(project.category)}</span>${image}</button>
      <div class="project-card-copy"><p class="eyebrow">${escapeHTML(project.meta)}</p><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.preview)}</p><button class="text-button" type="button" data-story="${escapeHTML(project.id)}">Read field note ↗</button></div>
    </article>`;
  }).join('');
  $('#activity-list').innerHTML=siteData.activities.map((activity,index)=>`<article class="activity-item"><span>0${index+1} · ${escapeHTML(activity.meta)}</span><h4>${escapeHTML(activity.title)}</h4><button type="button" data-story="${escapeHTML(activity.id)}" aria-label="Read ${escapeHTML(activity.title)}">↗</button></article>`).join('');
}

function renderHonors(){
  $('#academic-honors').innerHTML='';
  $('#performing-honors').innerHTML='';
  siteData.honors.forEach((award,index)=>{
    const title=award.certificate_image_url
      ? `<button class="award-title" type="button" data-certificate="${index}">${escapeHTML(award.award_title)}</button>`
      : `<h3 class="award-title">${escapeHTML(award.award_title)}</h3>`;
    const certificate=award.certificate_image_url?`<button class="certificate-button" type="button" data-certificate="${index}">View certificate</button>`:'';
    const html=`<article class="award-row"><span class="award-year">${escapeHTML(award.year)}</span><div>${title}<p class="award-subtitle">${escapeHTML(award.competition)}${award.round?` · ${escapeHTML(award.round)}`:''}</p></div>${certificate}</article>`;
    $(index===7?'#performing-honors':'#academic-honors').insertAdjacentHTML('beforeend',html);
  });
}

function renderGallery(){
  const filtered=currentFilter==='All'?media:media.filter(item=>item.category===currentFilter);
  $('#media-gallery').innerHTML=filtered.slice(0,visibleCount).map(item=>`<button class="gallery-item reveal" type="button" data-image="${item.id}" aria-label="Open image: ${escapeHTML(item.caption)}"><img src="${item.url}" alt="${escapeHTML(item.caption)}" width="800" height="650" loading="lazy"><span class="gallery-caption">${escapeHTML(item.caption)}</span></button>`).join('');
  $('#gallery-empty').hidden=filtered.length>0;
  $('#gallery-more').hidden=filtered.length<=visibleCount;
  $$('#gallery-filters button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===currentFilter)));
  observeReveals($('#media-gallery'));
}

function lockPage(){
  if(document.body.classList.contains('locked'))return;
  lockedScroll=window.scrollY;
  document.body.style.paddingRight=`${Math.max(0,window.innerWidth-document.documentElement.clientWidth)}px`;
  document.body.classList.add('locked');
}
function unlockPage(){
  if(storyDialog.open||lightbox.open)return;
  document.body.classList.remove('locked');
  document.body.style.paddingRight='';
  if(Math.abs(window.scrollY-lockedScroll)>2)window.scrollTo({top:lockedScroll,behavior:'instant'});
}

function getStoryMedia(story){
  if(story.id==='galaxy')return (story.gallery||[]).map(id=>({id,url:`assets/${id}.jpg`,caption:'Galaxy Technology Service — Business analytics internship.'}));
  return (story.gallery||[]).map(id=>media.find(item=>item.id===id)||{id,url:imagePath(id),caption:story.title});
}

function openStory(id){
  const story=stories.get(id);
  if(!story)return;
  storyReturn=document.activeElement;
  const kind=storyKinds.get(id)||'Project story';
  const gallery=getStoryMedia(story);
  const cover=story.cover?`<img src="${imagePath(story.cover)}" alt="${escapeHTML(media.find(item=>item.id===story.cover)?.caption||story.title)}" width="1200" height="900">`:'';
  const storySections=(story.sections||[]).map(section=>`<section class="story-section"><h3>${escapeHTML(section.title)}</h3>${section.text?`<p>${escapeHTML(section.text)}</p>`:''}${section.items?`<ul>${section.items.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>`:''}</section>`).join('');
  const external=story.link||story.paper_url||story.source_paper_url;
  const externalLabel=storyKinds.get(id)==='Research note'?'View research paper':'Visit project page';
  const video=story.video_url?`<section class="story-section"><h3>A moment in motion</h3><video class="story-video" controls playsinline preload="none" poster="${escapeHTML(story.video_poster)}" aria-label="Video from The Stream of Love in Tien Giang"><source src="${escapeHTML(story.video_url)}" type="video/mp4">Your browser does not support embedded video.</video><p>The Stream of Love — a hands-on activity during the Tien Giang visit.</p></section>`:'';
  $('#story-body').innerHTML=`
    <div class="story-hero${cover?'':' no-image'}">${cover}<div class="story-hero-copy"><p class="eyebrow">${escapeHTML(kind)}</p><h2 id="story-title">${escapeHTML(story.title)}</h2><p class="story-meta">${escapeHTML(story.meta||'')}${story.mentor?`<br>Research mentor: ${escapeHTML(story.mentor)}`:''}</p></div></div>
    <div class="story-main"><p class="story-overview">${escapeHTML(story.overview)}</p><div class="story-sections">${storySections}${external?`<div class="story-links"><a class="button button-dark" href="${escapeHTML(external)}" target="_blank" rel="noopener noreferrer">${externalLabel} ↗</a></div>`:''}${video}</div></div>
    ${gallery.length?`<section class="story-gallery-wrap"><p class="eyebrow">Documented moments</p><div class="story-gallery">${gallery.map(item=>`<button type="button" data-image="${item.id}" aria-label="Open image: ${escapeHTML(item.caption)}"><img src="${item.url}" alt="${escapeHTML(item.caption)}" width="700" height="525" loading="lazy"></button>`).join('')}</div></section>`:''}`;
  lockPage();
  storyDialog.showModal();
  storyDialog.scrollTop=0;
  $('.dialog-close',storyDialog).focus({preventScroll:true});
}

function closeStory(){if(storyDialog.open)storyDialog.close()}
function openLightbox(items,index=0){
  if(!items.length)return;
  lightboxReturn=document.activeElement;
  lightboxItems=items;
  lightboxIndex=Math.max(0,index);
  lockPage();
  renderLightbox();
  lightbox.showModal();
  $('.dialog-close',lightbox).focus({preventScroll:true});
}
function renderLightbox(){
  const item=lightboxItems[lightboxIndex];
  $('#lightbox-image').src=item.url;
  $('#lightbox-image').alt=item.caption;
  $('#lightbox-caption').textContent=item.caption;
  $('#lightbox-count').textContent=`${String(lightboxIndex+1).padStart(2,'0')} / ${String(lightboxItems.length).padStart(2,'0')}`;
  const singleImage=lightboxItems.length<2;
  $('#lightbox-prev').hidden=$('#lightbox-next').hidden=singleImage;
  $('#zoom-button').hidden=singleImage;
  $('.lightbox-stage').classList.toggle('single-image',singleImage);
  $('.lightbox-image-wrap').classList.remove('zoomed');
  $('#zoom-button').setAttribute('aria-pressed','false');
  $('#zoom-button').textContent='Zoom +';
}
function advanceImage(direction){lightboxIndex=(lightboxIndex+direction+lightboxItems.length)%lightboxItems.length;renderLightbox()}
function closeLightbox(){if(lightbox.open)lightbox.close()}
function toggleZoom(){
  const zoomed=$('.lightbox-image-wrap').classList.toggle('zoomed');
  $('#zoom-button').setAttribute('aria-pressed',String(zoomed));
  $('#zoom-button').textContent=zoomed?'Fit image':'Zoom +';
}
function openGallery(category){
  const items=media.filter(item=>item.category===category);
  if(!items.length)return;
  openLightbox(items,0);
}

document.addEventListener('click',event=>{
  const storyTrigger=event.target.closest('[data-story]');
  if(storyTrigger){openStory(storyTrigger.dataset.story);return}
  const certificateTrigger=event.target.closest('[data-certificate]');
  if(certificateTrigger){
    const award=siteData.honors[Number(certificateTrigger.dataset.certificate)];
    if(award?.certificate_image_url)openLightbox([{url:award.certificate_image_url,caption:`${award.year} — ${award.award_title}, ${award.competition}${award.round?` · ${award.round}`:''}`}]);
    return;
  }
  const imageTrigger=event.target.closest('[data-image]');
  if(imageTrigger){
    let resolvedItems;
    if(storyDialog.open){
      const ids=$$('.story-gallery [data-image]',storyDialog).map(button=>button.dataset.image);
      resolvedItems=ids.map(id=>media.find(item=>item.id===id)||{id,url:imagePath(id),caption:$('#story-title').textContent});
    }else resolvedItems=currentFilter==='All'?media:media.filter(item=>item.category===currentFilter);
    openLightbox(resolvedItems,Math.max(0,resolvedItems.findIndex(item=>item.id===imageTrigger.dataset.image)));
    return;
  }
  const galleryTrigger=event.target.closest('[data-gallery]');
  if(galleryTrigger){
    openGallery(galleryTrigger.dataset.gallery);return;
  }
  const filterTrigger=event.target.closest('[data-filter]');
  if(filterTrigger){currentFilter=filterTrigger.dataset.filter;visibleCount=8;renderGallery()}
});

$('.dialog-close',storyDialog).addEventListener('click',closeStory);
$('.dialog-close',lightbox).addEventListener('click',closeLightbox);
storyDialog.addEventListener('click',event=>{if(event.target===storyDialog)closeStory()});
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox()});
storyDialog.addEventListener('close',()=>{$$('video',storyDialog).forEach(video=>video.pause());unlockPage();storyReturn?.focus({preventScroll:true})});
lightbox.addEventListener('close',()=>{if(!lightbox.open)$('#lightbox-image').removeAttribute('src');unlockPage();lightboxReturn?.focus({preventScroll:true})});
$('#lightbox-prev').addEventListener('click',()=>advanceImage(-1));
$('#lightbox-next').addEventListener('click',()=>advanceImage(1));
$('#zoom-button').addEventListener('click',toggleZoom);
$('#lightbox-image').addEventListener('click',()=>{if($('.lightbox-image-wrap').classList.contains('zoomed'))toggleZoom()});
document.addEventListener('keydown',event=>{
  if(lightbox.open&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();advanceImage(event.key==='ArrowLeft'?-1:1)}
});

const menuToggle=$('.menu-toggle');
const navigation=$('#navigation');
function setMenu(open){menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open)}
menuToggle.addEventListener('click',()=>setMenu(menuToggle.getAttribute('aria-expanded')!=='true'));
$$('#navigation a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){setMenu(false);menuToggle.focus()}});

$('#gallery-more').addEventListener('click',()=>{
  const previous=visibleCount;visibleCount+=8;renderGallery();
  $$('#media-gallery .gallery-item')[previous]?.focus({preventScroll:true});
});
$('.back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));

let revealObserver=null;
function observeReveals(root=document){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){$$('.reveal',root).forEach(element=>element.classList.add('shown'));return}
  document.body.classList.add('motion-ready');
  if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('shown');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 12% 0px'});
  $$('.reveal',root).forEach(element=>revealObserver.observe(element));
}

function initScrollUI(){
  const header=$('[data-header]');
  const progress=$('.page-progress span');
  const backTop=$('.back-top');
  const stackSections=$$('main>.section[id]');
  const stackNav=document.createElement('nav');
  stackNav.className='section-stack-nav';
  stackNav.setAttribute('aria-label','Section progress');
  stackNav.innerHTML=stackSections.map((section,index)=>{
    const label=section.dataset.tab||`${String(index+1).padStart(2,'0')} · Contact`;
    const shortLabel=label.replace(/^\d+\s*[·/]\s*/, '');
    return `<a href="#${section.id}" style="--tab-index:${index}" aria-label="Go to ${escapeHTML(shortLabel)}"><span>${String(index+1).padStart(2,'0')}</span><b>${escapeHTML(shortLabel)}</b></a>`;
  }).join('');
  document.body.append(stackNav);
  const stackLinks=$$('a',stackNav);
  let scheduled=false;
  const paint=()=>{
    scheduled=false;
    const y=window.scrollY;
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    header.classList.toggle('scrolled',y>24);
    progress.style.transform=`scaleX(${Math.min(1,y/max)})`;
    backTop.hidden=y<850;
    let activeIndex=0;
    stackSections.forEach((section,index)=>{
      const rect=section.getBoundingClientRect();
      if(rect.top<=window.innerHeight*.5)activeIndex=index;
      section.classList.toggle('is-current-panel',rect.top<window.innerHeight*.58&&rect.bottom>window.innerHeight*.28);
    });
    stackLinks.forEach((link,index)=>{
      link.classList.toggle('is-passed',index<activeIndex);
      link.classList.toggle('is-current',index===activeIndex);
      if(index===activeIndex)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(paint)}},{passive:true});
  paint();
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)$$('#navigation a[href^="#"]').forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`))}),{rootMargin:'-25% 0px -65%',threshold:0});
  $$('main>section[id]').forEach(section=>navObserver.observe(section));
}

async function init(){
  try{
    const response=await fetch('content.json');
    if(!response.ok)throw new Error(`Content unavailable (${response.status})`);
    siteData=await response.json();
    stories=new Map([['about',siteData.about],['galaxy',siteData.experience],...[...siteData.research,...siteData.projects,...siteData.activities].map(item=>[item.id,item])]);
    storyKinds=new Map([['about','Personal field note'],['galaxy','Professional experience'],...siteData.research.map(item=>[item.id,'Research note']),...siteData.projects.map(item=>[item.id,'Project field note']),...siteData.activities.map(item=>[item.id,'Community field note'])]);
    renderResearch();renderProjects();renderHonors();
    $('#gallery-filters').innerHTML=galleryCategories.map(category=>`<button type="button" data-filter="${escapeHTML(category)}" aria-pressed="${category==='All'}">${escapeHTML(category)}</button>`).join('');
    renderGallery();observeReveals();
    $$('.creative-note-button').forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      openGallery(button.dataset.gallery);
    }));
    initScrollUI();
    $('#year').textContent=new Date().getFullYear();
  }catch(error){
    console.error(error);
    $('#research-stories').innerHTML='<p>Detailed stories could not load. Please refresh the page, or use the résumé link below.</p>';
  }
}
init();
