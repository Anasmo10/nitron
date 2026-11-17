const pw=require(process.env.PUPPETEER_PATH); const path=require('path');
(async()=>{ const b=await pw.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--allow-file-access-from-files']});
 const p=await b.newPage(); await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 await p.goto('file://'+path.resolve(process.argv[2])); await p.evaluate(()=>document.fonts.ready); await new Promise(r=>setTimeout(r,400));
 await p.screenshot({path:process.argv[3],type:'jpeg',quality:95}); await b.close(); })();
