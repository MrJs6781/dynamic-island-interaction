(function(){
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hash options: #aurora #sunset #light #dark #auto  (join with -, e.g. #sunset-dark-auto)
  var t=location.hash.slice(1).split('-'),r=document.documentElement;
  if(t.indexOf('sunset')>-1)r.setAttribute('data-skin','sunset');
  if(t.indexOf('light')>-1)r.setAttribute('data-theme','light');
  if(t.indexOf('dark')>-1)r.setAttribute('data-theme','dark');
  var auto=t.indexOf('auto')>-1;

  var $=function(id){return document.getElementById(id);};
  var springs=[],raf=0,last=0,u=1,renders=[];
  function S(x,z,w){var s={x:x,v:0,t:x,z:z,w:rm?70:w};springs.push(s);return s;}
  function step(s,dt){var a=s.w*s.w*(s.t-s.x)-2*s.z*s.w*s.v;s.v+=a*dt;s.x+=s.v*dt;}
  function measure(){u=$('s1').getBoundingClientRect().width/420;}
  function render(){renders.forEach(function(f){f();});}
  function settled(s){return Math.abs(s.t-s.x)<.01&&Math.abs(s.v)<.1;}
  function frame(now){
    var dt=Math.min((now-last)/1000,1/30);last=now;
    var n=Math.max(1,Math.round(dt*240));
    for(var k=0;k<n;k++)springs.forEach(function(s){step(s,dt/n);});
    render();
    if(springs.every(settled)){springs.forEach(function(s){s.x=s.t;s.v=0;});render();raf=0;return;}
    raf=requestAnimationFrame(frame);
  }
  function go(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  measure();addEventListener('resize',function(){measure();render();});

  function chips(id,fn){
    var nav=$(id),bs=[].slice.call(nav.querySelectorAll('button'));
    bs.forEach(function(b){b.addEventListener('click',function(){fn(b.dataset.s);});});
    return function(s){bs.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s===s);});};
  }

  /* 01 morph: width and height are springs, content cross-fades with blur */
  var A={idle:[120,34],timer:[224,50],music:[264,56],trip:[360,124]},AL={idle:'Idle',timer:'Focus timer',music:'Now playing',trip:'Trip arriving in 6 minutes'};
  var isl=$('isl'),aw=S(120,.62,16),ah=S(34,.62,16),left=300,tmr=0;
  renders.push(function(){
    isl.style.width=aw.x*u+'px';isl.style.height=ah.x*u+'px';
    isl.style.borderRadius=Math.min(ah.x/2,34)*u+'px';
  });
  function tick(){
    left=Math.max(0,left-1);
    var m=('0'+Math.floor(left/60)).slice(-2),s=('0'+left%60).slice(-2);
    $('tm').textContent=m+':'+s;
    $('pg').style.strokeDashoffset=69.1*(1-left/300);
  }
  var mark1=chips('c1',set1);
  function set1(s){
    isl.dataset.s=s;aw.t=A[s][0];ah.t=A[s][1];mark1(s);$('live1').textContent=AL[s];
    clearInterval(tmr);
    if(s==='timer'){left=300;$('pg').style.strokeDashoffset=0;tick();tmr=setInterval(tick,1000);}
    go();
  }

  /* 02 split: a pill and a bubble inside a gooey filter; the bubble springs out and leaves a neck */
  var B={idle:{w:130,pc:0,bc:0,bs:.3},call:{w:168,pc:-34,bc:92,bs:1},chg:{w:150,pc:-30,bc:86,bs:1}},BL={idle:'Idle',call:'Call with Sara',chg:'Charging 82 percent'};
  var s2=$('s2'),pw=S(130,.7,15),pc=S(0,.7,15),bc=S(0,.5,13),bs=S(.3,.6,15),ctm=0,cs=12;
  var pillS=$('pillS'),bubS=$('bubS'),pl=$('pl'),bcEl=$('bc');
  renders.push(function(){
    var l=(210+pc.x-pw.x/2)*u,w=pw.x*u;
    pillS.style.left=pl.style.left=l+'px';pillS.style.width=pl.style.width=w+'px';
    var bl=(210+bc.x-18)*u,sc=Math.max(bs.x,0);
    bubS.style.left=bcEl.style.left=bl+'px';
    bubS.style.width=bubS.style.height=bcEl.style.width=bcEl.style.height=36*u+'px';
    bubS.style.top=bcEl.style.top=14*u+'px';
    bubS.style.transform='scale('+sc+')';
  });
  var mark2=chips('c2',set2);
  function set2(s){
    var o=B[s];s2.dataset.s=s;pw.t=o.w;pc.t=o.pc;bc.t=o.bc;bs.t=o.bs;mark2(s);$('live2').textContent=BL[s];
    clearInterval(ctm);
    if(s==='call'){cs=12;ctm=setInterval(function(){cs++;$('ct').textContent='00:'+('0'+cs).slice(-2);},1000);}
    go();
  }
  set1('idle');set2('idle');measure();render();

  if(auto){
    var a1=['timer','music','trip','idle'],a2=['call','chg','idle'],i1=0,i2=0;
    setInterval(function(){set1(a1[i1++%a1.length]);},2800);
    setTimeout(function(){setInterval(function(){set2(a2[i2++%a2.length]);},2800);},1400);
  }
})();
