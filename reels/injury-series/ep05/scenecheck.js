// call every scene at every 0.1 s and report the first error per scene (the engine swallows them)
const path=require('path'); const pw=require(process.env.PUPPETEER_PATH);
(async()=>{ const b=await pw.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--allow-file-access-from-files']}); const p=await b.newPage();
  await p.goto('file://'+path.resolve('compose.html')); await new Promise(r=>setTimeout(r,1500));
  const r=await p.evaluate(()=>{ const err={}; for(let t=0;t<28.2;t+=0.1){ for(const [n,f] of SCENE_LIST){ try{ X.save(); f(t); X.restore(); }catch(e){ X.restore(); if(!err[n]) err[n]=t.toFixed(1)+': '+e.message; } } try{ outro(28); }catch(e){ err.outro=e.message; } } return err; });
  console.log(Object.keys(r).length?r:'no scene errors'); await b.close(); })();
