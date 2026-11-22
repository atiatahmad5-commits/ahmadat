import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {analyze} from './engine.mjs';
const port=Number(process.env.PORT||4173),host='127.0.0.1';
const files={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
const send=(res,status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"});res.end(type==='application/json'?JSON.stringify(data):data);};
export const server=http.createServer(async(req,res)=>{
 if(req.headers.host!==`${host}:${port}`&&req.headers.host!==`localhost:${port}`)return send(res,403,{error:'Invalid host'});
 if(req.method==='POST'&&req.url==='/api/analyze'){
   if(req.headers.origin&&!new Set([`http://${host}:${port}`,`http://localhost:${port}`]).has(req.headers.origin))return send(res,403,{error:'Invalid origin'});
   if(!req.headers['content-type']?.startsWith('application/json'))return send(res,415,{error:'JSON required'});
   const chunks=[];let size=0;
   try{for await(const chunk of req){size+=chunk.length;if(size>50000){send(res,413,{error:'Input too large'});req.resume();return;}chunks.push(chunk);} const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));send(res,200,analyze(input.text));}catch{send(res,400,{error:'Provide valid JSON with 1–12,000 characters of text.'});}return;
 }
 if(req.method==='GET'&&req.url==='/api/health')return send(res,200,{ok:true,mode:'local',version:'0.1.0'});
 if(req.method==='GET'&&files[req.url]){try{const [file,type]=files[req.url];send(res,200,await readFile(new URL('../public/'+file,import.meta.url)),type);}catch{send(res,500,{error:'Asset unavailable'});}return;}
 send(res,404,{error:'Not found'});
});
server.requestTimeout=10000;
server.listen(port,host,()=>console.log(`SCAMSHIELD: http://${host}:${port}`));
