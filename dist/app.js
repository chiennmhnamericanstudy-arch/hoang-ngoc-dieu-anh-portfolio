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
const galleryCategories=['All','Wish Bag','Community Projects','Dance & Arts'];
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
  ['wish-32','Wish Bag','Wish Bag — Bringing textile ideas to life.']
].map(([id,category,caption])=>({id,category,caption,url:imagePath(id)}));

function renderResearch(){
  const facts=[['S-O-R framework','SmartPLS','302 survey responses'],['Mixed methods','PLS-SEM','CEO & HR interviews']];
  $('#research-stories').innerHTML=siteData.research.map((research,index)=>{
    const external=research.paper_url||research.source_paper_url;
    const diagram=index===0
      ? '<div class="signal-orbit" aria-hidden="true"><span class="o1">AI at work</span><span class="o2">Mindset</span><span class="o3">Adaptation</span><span class="o4">People</span></div>'
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
    const items=media.filter(item=>item.category===galleryTrigger.dataset.gallery);
    openLightbox(items,0);return;
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
  if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('shown');revealObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -4%'});
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
    renderGallery();observeReveals();initScrollUI();
    $('#year').textContent=new Date().getFullYear();
  }catch(error){
    console.error(error);
    $('#research-stories').innerHTML='<p>Detailed stories could not load. Please refresh the page, or use the résumé link below.</p>';
  }
}
init();
