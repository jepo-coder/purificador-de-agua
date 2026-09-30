const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* Materiales y pasos */
const mats=["Cartón","Botellas o frascos de plástico vacíos","Papel cartulina","Alambre galvanizado calibre 16 (~100 g)","Pistola y barras de silicón","Masilla epóxica tipo M-Seal","Manguera transparente de 6–7 mm, 3 m","Mini bomba de agua","Interruptor","Batería o fuente compatible con la bomba","Cables eléctricos","Adaptador DC o cargador compatible","Pegamento blanco e instantáneo","Algodón","Piedras de diferentes tamaños","Árboles artificiales","Agua y recipiente para prepararla","Tierra limpia u otro material inocuo"];
const pasos=[["Preparar la base","Cortar cartón y forrarlo con cartulina."],["Planificar","Ubicar botellas, bomba y mangueras y definir el recorrido del agua."],["Preparar recipientes","Limpiar, secar y hacer los orificios para las mangueras."],["Construir el filtro","Colocar piedras y algodón para que el agua los atraviese."],["Colocar mangueras","Cortar según las distancias e introducir los extremos."],["Sellar conexiones","Silicón caliente o masilla epóxica contra fugas."],["Instalar la bomba","Ubicarla y conectar la manguera."],["Circuito eléctrico","Bomba → interruptor → fuente compatible."],["Prueba con agua limpia","Encender y verificar la circulación."],["Corregir fugas","Apagar, secar y volver a sellar."],["Agua turbia","Mezclar agua con un poco de tierra limpia."],["Filtrar","Poner el agua en el recipiente inicial y activar la bomba."],["Observar el filtro","Ver cómo se retienen las partículas."],["Recolectar","Comparar el agua final con la inicial."],["Decorar","Árboles, cartulina y rótulos."]];
$("#mats").innerHTML=mats.map((m,i)=>`<li><label><input type="checkbox" data-m><span> ${m}</span></label></li>`).join("");
$("#pasos").innerHTML=pasos.map(p=>`<li><b>${p[0]}.</b> ${p[1]}</li>`).join("");
const prog=()=>{const c=$$("[data-m]");$("#prog").textContent=`(${c.filter(x=>x.checked).length}/${c.length})`};
$$("[data-m]").forEach(c=>c.onchange=prog);prog();
$$("#pasos li").forEach(l=>l.onclick=()=>l.classList.toggle("done"));
/* Pestañas */
$$(".tabs button").forEach(b=>b.onclick=()=>{$$(".tabs button,.panel").forEach(e=>e.classList.remove("on"));b.classList.add("on");$("#"+b.dataset.t).classList.add("on")});
/* Simulador de partículas */
const cv=$("#cv"),cx=cv.getContext("2d"),W=640;
const PATH=[[80,190],[80,36],[320,36],[320,80]],OUT=[[320,340],[320,366],[440,366],[440,250],[560,250],[560,300]],LAY=[80,170,215,340];
const rnd=(a,b)=>a+Math.random()*(b-a),val=id=>+$(id).value;
const rocks=Array.from({length:44},()=>({x:rnd(282,358),y:rnd(88,164),r:rnd(6,11),c:`hsl(${rnd(25,45)},${rnd(5,15)}%,${rnd(35,60)}%)`}));
const puffs=Array.from({length:60},()=>({x:rnd(278,362),y:rnd(222,334),r:rnd(7,13)}));
const grains=Array.from({length:70},()=>({x:rnd(276,364),y:rnd(174,212)}));
let P,st,lvl,on,esc=1,H=[],fr=0;
function reset(){H=[];P=[];st={in:0,ret:0,out:0,pass:0};lvl=1;on=false;$("#pw").textContent="⏻ Encender bomba"}
reset();
function along(p,d){let r=d;for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(r<=L)return[a[0]+(b[0]-a[0])*r/L,a[1]+(b[1]-a[1])*r/L];r-=L}return null}
function prob(l,z){const a=val("#rA"),s=val("#rP");let p;
if(l==0)p=[.12+.07*s,.04+.03*s,.01+.01*s][z];else if(l==1)p=$("#cC").checked?[.3,.5,.55][z]:0;else p=[.5+.04*a,.3+.06*a,.08+.06*a][z];return Math.min(.97,p)}
const jarTop=()=>405-105*Math.min(1,st.out/260);
function step(){const pw=val("#rB"),clog=Math.min(1,st.ret/380);
if(on&&lvl>0&&Math.random()<pw*.05*esc){P.push({s:0,d:0,x:80,y:190,z:Math.random()<.4?0:Math.random()<.58?1:2,ly:-1});st.in++;lvl-=.0012}
const vf=pw*.8/(1+.22*val("#rA")+.07*val("#rP")+3*clog)*(on?1:.35);
for(const p of P){
if(p.s==0){p.d+=on?pw*.9:0;const q=along(PATH,p.d);if(q){p.x=q[0];p.y=q[1]}else{p.s=1;p.x=rnd(290,350);p.y=80}}
else if(p.s==1){p.y+=vf;p.x=Math.max(280,Math.min(360,p.x+rnd(-.5,.5)));
const ly=p.y>=LAY[2]?2:p.y>=LAY[1]?1:0;
if(ly>p.ly){p.ly=ly;if(Math.random()<prob(ly,p.z)){p.s=3;st.ret++}else if(ly==2)st.pass++}
if(p.s==1&&p.y>=LAY[3]){p.s=2;p.d=0}}
else if(p.s==2){p.d+=pw*(on?.9:.3);const q=along(OUT,p.d);if(q){p.x=q[0];p.y=q[1]}else{p.s=4;p.x=560;p.y=300}}
else if(p.s==4){p.y+=3;if(p.y>=jarTop()){p.s=5;st.out++}}}
P=P.filter(p=>p.s!=5);
const res=st.ret+st.pass;
$("#sIn").textContent=st.in;$("#sRet").textContent=st.ret;$("#sOut").textContent=st.pass;
$("#sEf").textContent=(res?Math.round(100*st.ret/res)+"%":"—");
$("#sFl").textContent=Math.round(120*pw/5/(1+.25*val("#rA")+.1*val("#rP")+4*clog))+" mL/min";
$("#sCl").textContent=Math.round(clog*100)+"%";
if(++fr%40==0&&res>0){H.push(Math.round(100*st.ret/res));if(H.length>60)H.shift()}
$("#est").textContent=!on?"🔴 BOMBA APAGADA":lvl<=0?"⚪ SIN AGUA SUCIA":clog>=.8?"🟠 CAMBIAR EL ALGODÓN":"🟢 FILTRANDO";
$("#msg").textContent=!on?"Bomba apagada: el agua que ya está en el filtro baja solo por gravedad, pero más lento.":lvl<=0?"Se acabó el agua sucia. Pulsa Reiniciar para repetir.":clog>.8?"¡El algodón se está saturando! El flujo bajó mucho.":"Filtrando… más algodón retiene más, pero frena el flujo."}
function tube(p){cx.beginPath();p.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));cx.strokeStyle="#0c3d7a";cx.lineWidth=13;cx.stroke();cx.strokeStyle="rgba(120,200,255,.4)";cx.lineWidth=7;cx.stroke()}
function jar(x,y,w,h){cx.beginPath();cx.roundRect(x,y,w,h,12);cx.strokeStyle="#9fd2ff";cx.lineWidth=3;cx.stroke()}
function txt(t,x,y){cx.fillStyle="#cfe8ff";cx.font="600 13px sans-serif";cx.textAlign="center";cx.fillText(t,x,y)}
function draw(){cx.clearRect(0,0,W,450);cx.lineCap=cx.lineJoin="round";tube(PATH);tube(OUT);
const res=st.ret+st.pass,t=res?st.pass/res:0,c=[90,200,240].map((v,i)=>Math.round(v+([160,122,69][i]-v)*t));
cx.fillStyle="rgba(160,122,69,.75)";cx.fillRect(34,405-215*lvl,92,215*lvl);
const oh=105*Math.min(1,st.out/260);cx.fillStyle=`rgba(${c},.8)`;cx.fillRect(504,405-oh,112,oh);
jar(30,190,100,215);jar(500,290,120,115);jar(270,80,100,260);
cx.save();cx.beginPath();cx.rect(272,82,96,256);cx.clip();
rocks.slice(0,Math.round(val("#rP")*4.4)).forEach(r=>{cx.fillStyle=r.c;cx.beginPath();cx.arc(r.x,r.y,r.r,0,7);cx.fill()});
if($("#cC").checked){cx.fillStyle="#0d1b26";cx.fillRect(272,170,96,45);grains.forEach(g=>{cx.fillStyle="#3b4f5e";cx.fillRect(g.x,g.y,3,3)})}
cx.fillStyle=`rgba(250,252,255,${.3+.065*val("#rA")})`;puffs.forEach(f=>{cx.beginPath();cx.arc(f.x,f.y,f.r,0,7);cx.fill()});
cx.restore();
for(const p of P){cx.fillStyle=p.s==3?"#6b4a22":"#b98b4e";cx.beginPath();cx.arc(p.x,p.y,[3,2.2,1.4][p.z],0,7);cx.fill()}
cx.fillStyle="#123a6e";cx.strokeStyle="#9fd2ff";cx.lineWidth=2;cx.beginPath();cx.roundRect(52,92,56,34,6);cx.fill();cx.stroke();
cx.fillStyle=on?"#3cff8a":"#ff4d4d";cx.beginPath();cx.arc(62,109,5,0,7);cx.fill();txt("bomba",86,113);
txt("Agua sucia",80,435);txt("Agua filtrada",560,435);txt("Piedras",425,130);txt(val("#rP")?"":"",0,0);txt("Carbón (opcional)",440,197);txt("Algodón",428,285);hist()}
function hist(){const g=$("#hist").getContext("2d");g.fillStyle="#061426";g.fillRect(0,0,640,110);g.setLineDash([6,6]);g.strokeStyle="#ffd36b";g.lineWidth=1.5;g.beginPath();g.moveTo(0,45);g.lineTo(640,45);g.stroke();g.setLineDash([]);g.strokeStyle="#19d3f0";g.lineWidth=3;g.beginPath();H.forEach((v,i)=>i?g.lineTo(i*11,105-v):g.moveTo(0,105-v));g.stroke()}
function loop(){step();draw();requestAnimationFrame(loop)}loop();
$$(".esc button").forEach(b=>b.onclick=()=>{esc=+b.dataset.e;$$(".esc button").forEach(x=>x.classList.toggle("on",x===b))});
$("#filtro").onclick=()=>$("#btnDemo").click();
$("#frm").onsubmit=e=>{e.preventDefault();$("#ok").textContent="¡Gracias! Este formulario es una demostración: el mensaje no se envía a ningún servidor."};
$("#pw").onclick=()=>{on=!on;$("#pw").textContent=on?"⏻ Apagar bomba":"⏻ Encender bomba"};$("#rs").onclick=reset;
[["A","A"],["P","P"],["B","B"]].forEach(([i])=>$("#r"+i).oninput=e=>$("#v"+i).textContent=e.target.value);
/* Demo animada del hero */
let corriendo=false;
$("#btnDemo").onclick=function(){if(corriendo)return;corriendo=true;this.textContent="Bombeando…";
const g=$("#gota"),l=$("#limpia"),s=$("#sucia");let t=0;
const id=setInterval(()=>{t++;g.setAttribute("opacity",1);g.setAttribute("cy",20+(t%20)*14);
s.setAttribute("y",200+t*.5);s.setAttribute("height",Math.max(0,146-t*.5));
l.setAttribute("y",340-t*.45);l.setAttribute("height",6+t*.45);
if(t>=90){clearInterval(id);g.setAttribute("opacity",0);corriendo=false;$("#btnDemo").textContent="Reiniciar demostración";
s.setAttribute("y",200);s.setAttribute("height",146);l.setAttribute("y",340);l.setAttribute("height",6)}},60)};
/* Código Python */
$("#cod").textContent=`import random

class CapaFiltrante:
    """Una capa del filtro: piedras, carbón o algodón."""
    def __init__(self, nombre, prob_grande, prob_mediana, prob_pequena):
        self.nombre = nombre
        self.prob = (prob_grande, prob_mediana, prob_pequena)
    def retiene(self, tamano):  # 0 grande, 1 mediana, 2 pequeña
        return random.random() < min(.97, self.prob[tamano])

class Bomba:
    """Convierte energía eléctrica en movimiento del agua."""
    def __init__(self):
        self.encendida = False
    def conmutar(self):
        self.encendida = not self.encendida

class Purificador:
    """Controlador: si la bomba está encendida, filtra."""
    def __init__(self, bomba, capas):
        self.bomba, self.capas = bomba, capas
    def filtrar(self, tamano):
        if not self.bomba.encendida:
            return "Bomba apagada"
        for capa in self.capas:
            if capa.retiene(tamano):
                return "Retenida en " + capa.nombre
        return "Pasó al agua filtrada"

bomba = Bomba(); bomba.conmutar()
filtro = Purificador(bomba, [CapaFiltrante("piedras", .47, .19, .06),
                             CapaFiltrante("algodón", .66, .54, .32)])
print(filtro.filtrar(tamano=2))`;
$("#copy").onclick=async e=>{try{await navigator.clipboard.writeText($("#cod").textContent);e.target.textContent="Copiado"}catch{e.target.textContent="Selecciona y copia"}};

/* Mejoras de navegación */
const onScroll=()=>{const m=document.documentElement.scrollHeight-innerHeight;$("#bar").style.width=(m>0?scrollY/m*100:0)+"%";$("#top").classList.toggle("on",scrollY>600)};
addEventListener("scroll",onScroll,{passive:true});onScroll();
$("#top").onclick=()=>scrollTo({top:0});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$(".nav nav a").forEach(a=>a.classList.toggle("act",a.getAttribute("href")=="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>io.observe(s));
$$(".gal img").forEach(i=>i.onclick=()=>{$("#lb img").src=i.src;$("#lb img").alt=i.alt;$("#lb").classList.add("on")});
$("#lb").onclick=()=>$("#lb").classList.remove("on");
addEventListener("keydown",e=>{if(e.key=="Escape")$("#lb").classList.remove("on")});
