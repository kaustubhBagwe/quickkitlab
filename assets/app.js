
const $=s=>document.querySelector(s);
document.addEventListener('DOMContentLoaded',()=>{
 const mb=$('#menuBtn'),mp=$('#menuPanel');
 if(mb&&mp){
  mb.addEventListener('click',()=>{mp.classList.toggle('open');mb.setAttribute('aria-expanded',mp.classList.contains('open'))});
  document.addEventListener('click',e=>{if(!mp.contains(e.target)&&!mb.contains(e.target)){mp.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
 }
 const themeToggle=$('#themeToggle');
 if(themeToggle){
  let theme='dark';
  try{theme=localStorage.getItem('quickkitlab-theme')==='light'?'light':'dark'}catch(e){console.warn('Theme preference could not be loaded.',e)}
  document.body.dataset.theme=theme;
  const updateThemeToggle=()=>{const dark=document.body.dataset.theme==='dark';themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.innerHTML=`<span aria-hidden="true">${dark?'☀':'☾'}</span> ${dark?'Light mode':'Dark mode'}`};
  updateThemeToggle();
  themeToggle.addEventListener('click',()=>{const theme=document.body.dataset.theme==='dark'?'light':'dark';document.body.dataset.theme=theme;try{localStorage.setItem('quickkitlab-theme',theme)}catch(e){console.warn('Theme preference could not be saved.',e)}updateThemeToggle()});
 }
 const hero=$('.hero');
 if(hero){
  const searchBox=hero.querySelector('.searchbox');
  const copy=document.createElement('div');
  copy.className='hero-copy';
  hero.querySelectorAll('.eyebrow,h1,p').forEach(element=>copy.appendChild(element));
  hero.replaceChildren(copy,searchBox);
 }
 const categories=[
  {id:'all',label:'All tools'},
  {id:'image-tools',label:'Images'},
  {id:'pdf-tools',label:'PDF'},
  {id:'text-tools',label:'Text & developer'},
  {id:'everyday-tools',label:'Everyday'}
 ];
 const firstSection=$('#image-tools');
 if(firstSection){
  const filters=document.createElement('div');
  filters.className='category-filters';
  filters.setAttribute('aria-label','Filter tools by category');
  categories.forEach(({id,label})=>{
   const button=document.createElement('button');
   button.type='button';
   button.className='category-filter';
   button.dataset.category=id;
   button.setAttribute('aria-pressed',String(id==='all'));
   button.textContent=label;
   filters.appendChild(button);
  });
  firstSection.before(filters);
 }
 const toolIcons={
  'image-compressor.html':'📉','image-resizer.html':'↔️','image-cropper.html':'✂️','heic-to-jpg.html':'🖼️',
  'pdf-to-jpg.html':'🖼️','merge-pdf.html':'📚','split-pdf.html':'✂️','rotate-pdf.html':'🔄',
  'word-counter.html':'🔢','json-formatter.html':'{ }','remove-duplicate-lines.html':'≡',
  'text-case-converter.html':'Aa','qr-code-generator.html':'▦','age-calculator.html':'🎂',
  'percentage-calculator.html':'%'
 };
 document.querySelectorAll('.tool-card').forEach(card=>{
  const icon=card.querySelector('.tool-icon');
  const name=card.getAttribute('href')?.split('/').pop();
  if(icon&&toolIcons[name]){icon.textContent=toolIcons[name];icon.setAttribute('aria-hidden','true')}
 });
 const search=$('#toolSearch');
 if(search){
  const clear=document.createElement('button');
  clear.type='button';
  clear.className='search-clear hidden';
  clear.setAttribute('aria-label','Clear search');
  clear.textContent='×';
  search.closest('.searchbox').appendChild(clear);
  let activeCategory='all';
  const filterTools=()=>{
   const q=search.value.trim().toLowerCase();
   document.querySelectorAll('.section').forEach(section=>{
    const cards=section.querySelectorAll('.tool-card');
    const categoryMatches=activeCategory==='all'||section.id===activeCategory;
    cards.forEach(card=>card.classList.toggle('hidden',!categoryMatches||!card.innerText.toLowerCase().includes(q)));
   });
   document.querySelectorAll('.section').forEach(section=>{
    const cards=section.querySelectorAll('.tool-card');
    if(cards.length)section.classList.toggle('hidden',![...cards].some(card=>!card.classList.contains('hidden')));
   });
   clear.classList.toggle('hidden',!search.value);
   document.querySelectorAll('.category-filter').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===activeCategory)));
  };
  search.addEventListener('input',filterTools);
  clear.addEventListener('click',()=>{search.value='';activeCategory='all';filterTools();search.focus()});
  document.querySelectorAll('.category-filter').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;filterTools()}));
 }
 const contact=$('#contactForm'); if(contact) contact.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(contact);const subject=encodeURIComponent(d.get('subject')||'QuickKitLab enquiry');const body=encodeURIComponent(`Name: ${d.get('name')||'Not provided'}\nEmail: ${d.get('email')}\nMessage:\n${d.get('message')}`);location.href=`mailto:REPLACE-WITH-YOUR-EMAIL@example.com?subject=${subject}&body=${body}`});
 const report=$('#reportForm'); if(report) report.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(report);const subject=encodeURIComponent('QuickKitLab bug report: '+d.get('tool'));const body=encodeURIComponent(`Tool: ${d.get('tool')}\nIssue: ${d.get('issue')}\nBrowser/device: ${d.get('device')||'Not provided'}\nEmail: ${d.get('email')||'Not provided'}\nDetails:\n${d.get('details')}`);location.href=`mailto:REPLACE-WITH-YOUR-EMAIL@example.com?subject=${subject}&body=${body}`});
 initTool();
});
function msg(s){const el=$('#result');if(el)el.textContent=s}
function downloadBlob(blob,name){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function initTool(){
 const kind=document.body.dataset.tool;if(!kind)return;
 const btn=(id,fn)=>{const e=document.getElementById(id);if(e)e.addEventListener('click',fn)};
 if(kind==='word'){const t=$('#textInput');const run=()=>{let v=t.value.trim();$('#words').textContent=v?(v.match(/\S+/g)||[]).length:0;$('#chars').textContent=t.value.length;$('#sentences').textContent=v?(v.match(/[.!?]+(?=\s|$)/g)||[]).length:0;$('#paragraphs').textContent=v?v.split(/\n\s*\n/).filter(x=>x.trim()).length:0;$('#reading').textContent=Math.ceil((v?(v.match(/\S+/g)||[]).length:0)/200)+' min'};t.addEventListener('input',run);run()}
 if(kind==='json'){btn('formatBtn',()=>{try{$('#textInput').value=JSON.stringify(JSON.parse($('#textInput').value),null,2);msg('Valid JSON formatted successfully.')}catch(e){msg('Invalid JSON: '+e.message)}});btn('minifyBtn',()=>{try{$('#textInput').value=JSON.stringify(JSON.parse($('#textInput').value));msg('JSON minified successfully.')}catch(e){msg('Invalid JSON: '+e.message)}});btn('copyBtn',()=>navigator.clipboard?.writeText($('#textInput').value).then(()=>msg('Copied to clipboard.')).catch(()=>msg('Clipboard access unavailable. Select and copy the text.')))}
 if(kind==='dedupe'){btn('processBtn',()=>{const lines=$('#textInput').value.split(/\r?\n/),seen=new Set(),out=[];for(const l of lines){const k=$('#ignoreCase').checked?l.trim().toLowerCase():l.trim();if(!seen.has(k)){seen.add(k);out.push(l)}}$('#textInput').value=out.join('\n');msg(`${lines.length-out.length} duplicate line(s) removed. ${out.length} lines remain.`)});btn('copyBtn',()=>navigator.clipboard?.writeText($('#textInput').value).then(()=>msg('Copied.')))}
 if(kind==='case'){btn('convertBtn',()=>{let v=$('#textInput').value,m=$('#caseMode').value;if(m==='upper')v=v.toUpperCase();if(m==='lower')v=v.toLowerCase();if(m==='title')v=v.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());if(m==='sentence')v=v.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g,c=>c.toUpperCase());if(m==='alternating'){let n=0;v=[...v].map(c=>/[a-z]/i.test(c)?(n++%2?c.toLowerCase():c.toUpperCase()):c).join('')}$('#textInput').value=v;msg('Text converted.')} );btn('copyBtn',()=>navigator.clipboard?.writeText($('#textInput').value).then(()=>msg('Copied.')))}
 if(kind==='percent'){btn('calc1',()=>{let a=+$('#p1').value,b=+$('#p2').value;msg(Number.isFinite(a*b/100)?`${a}% of ${b} = ${(a*b/100).toLocaleString(undefined,{maximumFractionDigits:6})}`:'Enter valid numbers.')});btn('calc2',()=>{let a=+$('#p3').value,b=+$('#p4').value;msg(b===0?'Original value cannot be zero.':`Percentage change = ${(((a-b)/b)*100).toFixed(2)}%`)})}
 if(kind==='age'){btn('ageBtn',()=>{const d=new Date($('#dob').value+'T00:00:00'),now=new Date();if(!$('#dob').value||d>now){msg('Please enter a valid date in the past.');return}let y=now.getFullYear()-d.getFullYear(),m=now.getMonth()-d.getMonth(),day=now.getDate()-d.getDate();if(day<0){m--;day+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}let next=new Date(now.getFullYear(),d.getMonth(),d.getDate());if(next<new Date(now.getFullYear(),now.getMonth(),now.getDate()))next.setFullYear(now.getFullYear()+1);const days=Math.ceil((next-new Date(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);msg(`Your age is ${y} years, ${m} months and ${day} days. ${days} day(s) until your next birthday.`)})}
 if(kind==='qr'){btn('qrBtn',async()=>{const value=$('#qrText').value.trim();if(!value){msg('Enter text or a URL first.');return}if(!window.QRCode){msg('QR library could not load. Check your internet connection.');return}const box=$('#qrOutput');box.innerHTML='';new QRCode(box,{text:value,width:260,height:260,correctLevel:QRCode.CorrectLevel.H});setTimeout(()=>{const c=box.querySelector('canvas');if(c)$('#qrDownload').onclick=()=>c.toBlob(b=>downloadBlob(b,'quickkitlab-qr.png'))},200);msg('QR code generated. Download the PNG below.')})}
 if(['compress','resize','crop'].includes(kind)){const file=$('#imageFile');let img=null;file.addEventListener('change',()=>{const f=file.files[0];if(!f)return;const u=URL.createObjectURL(f);img=new Image();img.onload=()=>{$('#preview').src=u;$('#preview').classList.remove('hidden');$('#imageInfo').textContent=`Original: ${img.naturalWidth} × ${img.naturalHeight} px · ${(f.size/1024).toFixed(1)} KB`};img.src=u});btn('processImage',()=>{if(!img){msg('Choose an image first.');return}let w=img.naturalWidth,h=img.naturalHeight;if(kind==='resize'){w=Math.max(1,+$('#width').value||w);h=Math.max(1,+$('#height').value||h);if($('#keepRatio').checked){const ratio=img.naturalWidth/img.naturalHeight;if($('#width').value&&!$('#height').value)h=Math.round(w/ratio);else if($('#height').value&&!$('#width').value)w=Math.round(h*ratio)}}if(kind==='crop'){const side=Math.min(w,h);w=side;h=side}const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(kind==='crop'){const s=Math.min(img.naturalWidth,img.naturalHeight);x.drawImage(img,(img.naturalWidth-s)/2,(img.naturalHeight-s)/2,s,s,0,0,w,h)}else x.drawImage(img,0,0,w,h);const mime=$('#format')?.value||'image/jpeg',q=kind==='compress'?(+$('#quality').value||80)/100:.9;c.toBlob(b=>{if(!b){msg('Could not process this image format.');return}downloadBlob(b,kind==='compress'?'compressed-image.jpg':kind==='crop'?'cropped-image.png':'resized-image.jpg');msg(`Done: ${w} × ${h} px · ${(b.size/1024).toFixed(1)} KB downloaded.`)},mime,q)})}
 if(kind==='heic'){btn('heicBtn',async()=>{const f=$('#imageFile').files[0];if(!f){msg('Choose a HEIC image first.');return}try{if(!window.heic2any)throw Error('HEIC converter library did not load.');const b=await heic2any({blob:f,toType:'image/jpeg',quality:.9});downloadBlob(Array.isArray(b)?b[0]:b,'converted-image.jpg');msg('JPG conversion complete.')}catch(e){msg(e.message)}})}
 if(['merge','split','rotate','pdfjpg'].includes(kind)){btn('pdfBtn',async()=>{const files=[...$('#pdfFiles').files];if(!files.length){msg('Choose one or more PDF files.');return}try{if(kind==='pdfjpg'){if(!window.pdfjsLib)throw Error('PDF renderer library did not load.');const f=files[0],buf=await f.arrayBuffer(),pdf=await pdfjsLib.getDocument({data:buf}).promise;const scale=+$('#pdfScale').value||1.5;for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),vp=page.getViewport({scale}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;await new Promise(res=>c.toBlob(b=>{downloadBlob(b,`page-${i}.jpg`);res()},'image/jpeg',.9))}msg(`${pdf.numPages} page(s) converted and downloaded.`);return}if(!window.PDFLib)throw Error('PDF library did not load.');const {PDFDocument,degrees}=PDFLib;if(kind==='merge'){const out=await PDFDocument.create();for(const f of files){const doc=await PDFDocument.load(await f.arrayBuffer());const pages=await out.copyPages(doc,doc.getPageIndices());pages.forEach(p=>out.addPage(p))}downloadBlob(new Blob([await out.save()],{type:'application/pdf'}),'merged.pdf');msg('PDF files merged and downloaded.')}else{const src=await PDFDocument.load(await files[0].arrayBuffer()),out=await PDFDocument.create();if(kind==='rotate'){src.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+(+$('#rotation').value||90))%360)));const bytes=await src.save();downloadBlob(new Blob([bytes],{type:'application/pdf'}),'rotated.pdf');msg('Rotated PDF downloaded.')}else{const ranges=$('#pageRanges').value.split(',').flatMap(part=>{const [a,b]=part.trim().split('-').map(Number);return b?[...Array(Math.max(0,b-a+1))].map((_,i)=>a-1+i):[a-1]}).filter(i=>i>=0&&i<src.getPageCount());const pages=await out.copyPages(src,ranges);pages.forEach(p=>out.addPage(p));downloadBlob(new Blob([await out.save()],{type:'application/pdf'}),'split-pages.pdf');msg(`${pages.length} page(s) extracted.`)}}}catch(e){msg('Could not process PDF: '+e.message)}})}
}
