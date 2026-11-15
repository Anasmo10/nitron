// render the canvas only (scenes over a black frame) at many times and tile them: frame-by-frame review of a drawing
const path=require('path'), fs=require('fs'); const pw=require(process.env.PUPPETEER_PATH);
(async()=>{ const [,,out,t0,t1,step,cols]=process.argv; const b=await pw.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--allow-file-access-from-files']}); const p=await b.newPage();
  await p.setViewport({width:1080,height:1920}); await p.goto('file://'+path.resolve('compose.html')); await new Promise(r=>setTimeout(r,1500));
  const ts=[]; for(let t=+t0;t<=+t1+1e-6;t+=+step) ts.push(+t.toFixed(3));
  const urls=await p.evaluate(async ts=>{ const c=document.createElement('canvas'); c.width=1080; c.height=1920; const g=c.getContext('2d'); const o=[];
    for(const t of ts){ X.save(); X.setTransform(1,0,0,1,0,0); X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); for(const [n,f] of SCENE_LIST){ if(['ahmadBack','titleCard','ahmadFront','takeaway'].includes(n)) continue; try{ X.save(); f(t); X.restore(); }catch(e){ X.restore(); } } X.restore();
      g.drawImage(X.canvas,0,0); g.fillStyle='#fff'; g.font='bold 54px sans-serif'; g.fillText(t.toFixed(2),30,1880); o.push(c.toDataURL('image/jpeg',0.8)); } return o; },ts);
  const dir=path.dirname(out); urls.forEach((u,i)=>fs.writeFileSync(`${dir}/_s${String(i).padStart(3,'0')}.jpg`,Buffer.from(u.split(',')[1],'base64')));
  console.log(urls.length); await b.close(); })();
