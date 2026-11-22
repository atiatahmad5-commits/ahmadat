import {normalize,predict} from './model.mjs';
import {isIP} from 'node:net';
const rule=(id,pattern,weight,en,ar)=>({id,pattern,weight,en,ar});
const psychological=[
 rule('urgency',/\b(urgent|immediately|now|within \d+ minutes|final warning)\b|عاجل|فورا|الان|خلال\s+[\d٠-٩]+\s+دقيق|تحذير اخير/i,20,'Time pressure reduces time to verify.','ضغط الوقت يقلل فرصة التحقق قبل التصرف.'),
 rule('threat',/\b(arrest|suspended|blocked|closure|penalty|legal action)\b|عقوب|اغلاق|تعليق|ايقاف|اجراء قانوني|الاجراء القانوني|حظر/i,25,'Threats or loss can push someone to act out of fear.','التهديد أو الخسارة قد يدفعان الشخص للتصرف بدافع الخوف.'),
 rule('authority',/\b(police|bank|government|manager|support)\b|شرطه|شرطة|البنك|حكوم|مدير|الدعم/i,10,'An authority claim can borrow trust. The claim is not authenticated.','ذكر جهة ذات سلطة قد يستغل الثقة؛ هوية المرسل غير موثقة.'),
 rule('reward',/\b(prize|won|lottery|guaranteed|double your money)\b|جائزه|جائزة|ربحت|مضمون|ضاعف/i,20,'A reward or guaranteed return can weaken caution.','وعد الجائزة أو الربح المضمون قد يقلل الحذر.'),
 rule('secrecy',/\b(secret|confidential|do not tell|don't tell)\b|سريه|سرية|بسري|لا تخبر|لا تخبري/i,20,'Secrecy can isolate the recipient from advice.','طلب السرية قد يعزل الشخص عن نصيحة الآخرين.'),
 rule('curiosity',/\b(look who|private photos|is this you)\b|صورك الخاصه|صورك الخاصة|هل هذا انت/i,15,'Curiosity or embarrassment can prompt an impulsive click.','الفضول أو الإحراج قد يدفعان للنقر دون تحقق.'),
 rule('credential',/(?:send|share|provide|enter|give).{0,55}(?:otp|password|verification code|card number|security code)|(?:ارسل|شارك|ادخل|اعطني).{0,55}(?:رمز|كلمه المرور|كلمة المرور|بطاق)/i,35,'A request for authentication or payment secrets can enable account takeover.','طلب رمز التحقق أو بيانات سرية قد يتيح الاستيلاء على الحساب.'),
 rule('payment',/\b(pay|transfer|gift cards|processing fee)\b|ادفع|حول المبلغ|بطاقات هدايا|رسوم/i,15,'A payment request needs independent verification.','طلب الدفع يحتاج إلى تحقق مستقل.')
];
const brands=[['adpolice','adpolice.gov.ae'],['emiratesnbd','emiratesnbd.com'],['adcb','adcb.com'],['fab','bankfab.com']];
export const extractURLs=text=>[...new Set(text.match(/(?:https?:\/\/|www\.)[^\s<>"'،]+/giu)||[])].map(x=>x.replace(/[).,;!?،؛]+$/g,''));
const distance=(a,b)=>{let row=Array.from({length:b.length+1},(_,i)=>i); for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next;}return row[b.length];};
export function inspectURL(raw){
 const findings=[]; const add=(id,weight,en,ar)=>findings.push({id,weight,en,ar,evidence:raw});
 let u; try{u=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw);}catch{return {input:raw,host:null,score:25,findings:[{id:'invalid_url',weight:25,en:'URL could not be parsed.',ar:'تعذر تفسير الرابط.',evidence:raw}]};}
 if(!['http:','https:'].includes(u.protocol))return {input:raw,host:null,score:25,findings:[{id:'unsupported',weight:25,en:'Unsupported URL scheme.',ar:'نوع رابط غير مدعوم.',evidence:raw}]};
 const host=u.hostname.toLowerCase(), plain=host.replace(/^\[|\]$/g,'');
 if(u.protocol==='http:')add('http',10,'Connection does not use HTTPS.','الاتصال لا يستخدم HTTPS.');
 if(u.username||u.password)add('userinfo',35,'Text before @ can disguise the actual host.','النص قبل @ قد يخفي اسم المضيف الفعلي.');
 if(isIP(plain))add('ip_host',25,'The host is a numeric IP address.','المضيف عنوان IP رقمي.');
 if(host.includes('xn--'))add('punycode',20,'Internationalized domain needs careful visual verification.','اسم نطاق دولي يحتاج تحققًا بصريًا دقيقًا.');
 if(['bit.ly','tinyurl.com','t.co','shorturl.at'].includes(host))add('shortener',15,'Short link destination is unknown here.','الوجهة النهائية للرابط المختصر غير معروفة هنا.');
 if(host.split('.').length>4)add('deep_host',10,'Many subdomains can obscure the destination.','كثرة النطاقات الفرعية قد تربك قراءة الوجهة.');
 let referenceMatch=null;
 for(const [brand,domain] of brands){
   if(host===domain||host.endsWith('.'+domain)){referenceMatch=domain;continue;}
   const labels=host.split('.');
   if(labels.some(x=>x.includes(brand)||(brand.length>4&&distance(x,brand)<=1)))add('brand_mismatch',45,`Host resembles ${brand} but is outside the reference domain ${domain}.`,`المضيف يشبه ${brand} لكنه خارج النطاق المرجعي ${domain}.`);
 }
 return {input:raw,host,score:Math.min(100,findings.reduce((s,f)=>s+f.weight,0)),referenceMatch,findings};
}
export function analyze(text){
 if(typeof text!=='string'||!text.trim()||text.length>12000)throw new Error('Provide 1–12,000 characters.');
 const normalized=normalize(text);
 // Suppress explicit safety advice only in the matched sentence, not the whole message.
 const sentences=normalized.split(/[.!?\n؛؟]+/);
 const findings=[];
 for(const r of psychological){
   const segment=sentences.find(s=>r.pattern.test(s)&&!/(?:never share|do not share|don't share|لا تشارك|لا ترسل|لا تعطي|do not click|لا تضغط)/i.test(s));
   if(segment) findings.push({id:r.id,weight:r.weight,en:r.en,ar:r.ar,evidence:segment.trim().slice(0,200)});
 }
 let urls=extractURLs(text);
 if(!urls.length&&/^[\w.-]+\.[a-z]{2,}(?:[/:?#]\S*)?$/i.test(text.trim()))urls=[text.trim()];
 const urlResults=urls.slice(0,20).map(inspectURL);
 const technicalScore=urlResults.length?Math.max(...urlResults.map(x=>x.score)):null;
 const manipulationScore=Math.min(100,findings.reduce((s,f)=>s+f.weight,0));
 const ml=predict(text);
 const evidenceScore=Math.max(technicalScore||0,manipulationScore);
 // ML can add at most 10 points when independent rule evidence exists. No dilution.
 const mlContribution=evidenceScore>=15&&ml.knownTokens>=3?Math.round(Math.max(0,ml.signal-50)/5):0;
 const finalScore=Math.min(100,evidenceScore+mlContribution);
 const level=finalScore>=65?'high':finalScore>=30?'review':'limited';
 return {version:'0.1.0',technicalScore,manipulationScore,finalScore,level,urls:urlResults,findings,model:{name:'Multinomial Naive Bayes',training:'40 synthetic bilingual examples',...ml,contribution:mlContribution},coverage:{urlsAnalyzed:urlResults.length,urlsOmitted:Math.max(0,urls.length-20),fetched:false,reputation:false,domainAge:false},disclaimer:{en:'A risk index, not a calibrated probability. Few signals do not prove safety. Sender and page contents are not verified.',ar:'مؤشر خطر وليس احتمالًا إحصائيًا. قلة المؤشرات لا تثبت الأمان. لم نتحقق من هوية المرسل أو محتوى الصفحة.'}};
}
