// load compose.html and print any page error (a scene script that fails does so silently in the renderer)
const fs=require('fs'), path=require('path');
const P='/root/.claude/plugins/synced/f7beef22-58cd-404b-b9dd-fb2264046dd2_99a281da-b2db-45e5-bb8f-504c67586c72/majed-video/video-ad-editor/';
let pw=null; for(const q of [process.env.PUPPETEER_PATH,'puppeteer-core','puppeteer',path.join(process.cwd(),'node_modules/puppeteer-core')]){ if(!q) continue; try{ pw=require(q); break; }catch(e){} }
(async()=>{ if(!pw){ console.log('no puppeteer-core'); return; }
  const b=await pw.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--allow-file-access-from-files']}); const p=await b.newPage();
  p.on('pageerror',e=>console.log('PAGE ERROR:',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log('console.error:',m.text().slice(0,200)); });
  await p.goto('file://'+path.resolve(process.argv[2])); await new Promise(r=>setTimeout(r,1500));
  console.log('scenes registered:', await p.evaluate(()=>typeof SCENE_LIST!=='undefined'?SCENE_LIST.map(s=>s[0]).join(','):'none')); await b.close(); })();
