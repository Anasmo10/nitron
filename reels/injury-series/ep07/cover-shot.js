const pw=require(process.env.PUPPETEER_PATH); const path=require('path');
(async()=>{ const b=await pw.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--allow-file-access-from-files']});
 const p=await b.newPage(); await p.setViewport({width:2160,height:2160,deviceScaleFactor:1}); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+path.resolve(process.argv[2])); await new Promise(r=>setTimeout(r,400));
 console.log(JSON.stringify(await p.evaluate(()=>window.PTS)));
 await p.screenshot({path:process.argv[3],omitBackground:true}); await b.close(); })();
