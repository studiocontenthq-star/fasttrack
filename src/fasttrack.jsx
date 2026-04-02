import { useState, useEffect, useCallback } from "react";

const C = {
  teal50:"#E1F5EE",teal400:"#1D9E75",teal600:"#0F6E56",teal800:"#085041",
  purple50:"#EEEDFE",purple400:"#7F77DD",purple600:"#534AB7",purple800:"#3C3489",
  amber50:"#FAEEDA",amber400:"#BA7517",amber800:"#633806",
  coral50:"#FAECE7",coral400:"#D85A30",coral800:"#712B13",
  green50:"#EAF3DE",green400:"#639922",green800:"#27500A",
  gray50:"#F1EFE8",gray200:"#B4B2A9",gray400:"#888780",gray800:"#444441",
};

const I18N = {
  zh:{
    appName:"FastTrack", langLabel:"EN",
    navTimer:"計時",navHistory:"紀錄",navWeight:"體重",navSettings:"設定",
    planSub:{"14:10":"穩定習慣","16:8":"經典斷食","18:6":"進階挑戰","20:4":"勇士斷食"},
    fastHours:(h)=>`斷食 ${h}h`,
    goalTime:"目標時間",remaining:"還剩",achieved:"達成！",elapsedPfx:"已",
    startFast:"開始斷食",endFast:"完成斷食",earlyEnd:"提早結束",editStart:"修改開始時間",
    activePlan:"斷食進行中，無法切換計畫",
    hydrationTitle:"今日喝水",cups:"杯",hydrationTip:"建議每天 8 杯",
    zones:[
      {label:"消化期",desc:"身體仍在處理上一餐，血糖供能中"},
      {label:"血糖穩定",desc:"胰島素下降，血糖趨於平穩"},
      {label:"燃脂啟動",desc:"肝醣耗盡，開始動用脂肪供能"},
      {label:"酮體上升",desc:"酮體開始生成，大腦獲得穩定能量"},
      {label:"自噬啟動",desc:"細胞開始清理受損蛋白質"},
      {label:"深度自噬",desc:"自噬達到高峰，細胞修復最活躍"},
    ],
    phases:[
      {name:"月經期",rec:"14:10",hint:"身體正在大掃除。14 小時溫和休息就很好，不需要給自己額外壓力。",mot:"今天最重要的事是補水和好好休息"},
      {name:"濾泡期",rec:"16:8",hint:"能量逐漸回升，體力感較好。這個階段許多人覺得斷食比平時更輕鬆。",mot:"這個階段是建立斷食習慣的好時機"},
      {name:"排卵期",rec:"16:8",hint:"許多人在這個階段感到體力最佳。可以嘗試稍長窗口，但隨時可以提早結束。",mot:"繼續保持，身體狀態不錯"},
      {name:"黃體期",rec:"14:10",hint:"食慾上升是這個階段的正常生理現象，不是失控。縮短斷食窗口是照顧自己，不是放棄。",mot:"傾聽身體，今天 14 小時就是完美的成就"},
    ],
    cycleDay:(d,n)=>`第 ${d} 天・${n}`,cycleSuggest:(r)=>`建議 ${r}`,
    toastStart:(n,m)=>n?`斷食開始！${m}。`:"斷食開始！加油！",
    toastDone:(h,s)=>`完成了！今天斷食 ${h} 小時，連勝 ${s} 天。`,
    toastEarlyLuteal:(h)=>`今天讓身體休息了 ${h} 小時，傾聽身體就是在照顧自己。`,
    toastEarly:(h)=>`今天完成了 ${h} 小時，每一次都是進步！`,
    toastWeight:(v)=>`記錄 ${v} kg`,toastWeightErr:"請輸入合理的體重（20–300 kg）",
    streakLabel:"連勝",doneLabel:"完成",recordLabel:"紀錄",
    recentWeeks:"近兩週紀錄",recentList:"最近紀錄",
    target:(h)=>`目標 ${h}h`,reached:"達標",partial:"部分完成",noRecord:"未記錄",
    noHistory:"還沒有記錄，開始你的第一次斷食吧！",
    streakDays:(n)=>`${n} 天連勝`,
    currentWeight:"目前體重",weightDown:"▼",weightUp:"▲",
    weightVsPrev:(d,v)=>`${d} ${v} kg vs 上次`,
    weightTrend:"近期趨勢",weightRecord:"記錄今日體重",
    weightPlaceholder:"例：62.5",weightBtn:"記錄",
    weightTip:"建議早晨空腹測量，數值更準確",weightHistory:"記錄明細",
    cycleTitle:"週期感知",cycleSub:"根據生理週期調整建議",
    lastPeriod:"上次月經第一天",
    cycleLength:(n)=>`週期天數：${n} 天`,cycleLengthHint:"（通常 25–35 天）",
    cyclePrivacy:"所有週期資料只存在你的裝置上，不會上傳至任何伺服器。以上提示僅供參考，請以自身感受為主。",
    planTitle:"斷食計畫",aboutTitle:"關於",
    aboutDesc:"FastTrack v1.0・所有資料只存在你的裝置上・零廣告・免費使用",
    resetBtn:"重新設定",resetConfirm:"確定要重置 onboarding 嗎？",
    langSectionTitle:"語言 / Language",
    ob:[
      {title:"歡迎使用 FastTrack",sub:"無廣告・免註冊・資料只存在你的裝置"},
      {title:"選擇起始計畫",sub:"隨時可以更改"},
      {title:"啟用週期感知？",sub:"選填功能，隨時可在設定中開關"},
      {title:"週期資料設定",sub:"資料只存在你的裝置上"},
    ],
    obC1T:"零壓力開始",obC1D:"提早結束不是失敗，縮短窗口不是放棄。每一次都算數。",
    obC2T:"週期感知陪跑",obC2D:"根據你的生理週期，提供今天最適合的斷食建議。",
    obNext:"開始設定",obEnableCycle:"啟用週期感知",obSkip:"先跳過",obFinish:"完成設定，開始使用",
  },
  en:{
    appName:"FastTrack",langLabel:"中",
    navTimer:"Timer",navHistory:"Log",navWeight:"Weight",navSettings:"Settings",
    planSub:{"14:10":"Steady","16:8":"Classic","18:6":"Advanced","20:4":"Warrior"},
    fastHours:(h)=>`${h}h fast`,
    goalTime:"Goal",remaining:"left",achieved:"Done!",elapsedPfx:"",
    startFast:"Start Fast",endFast:"Complete Fast",earlyEnd:"End Early",editStart:"Edit start time",
    activePlan:"Can't switch plan while fasting",
    hydrationTitle:"Hydration",cups:"cups",hydrationTip:"8 cups recommended daily",
    zones:[
      {label:"Digesting",desc:"Processing last meal, running on glucose"},
      {label:"Blood sugar stable",desc:"Insulin dropping, blood sugar levelling out"},
      {label:"Fat burning",desc:"Glycogen depleted, tapping fat stores"},
      {label:"Ketones rising",desc:"Ketones forming, brain getting steady fuel"},
      {label:"Autophagy",desc:"Cells clearing damaged proteins"},
      {label:"Deep autophagy",desc:"Peak autophagy, cellular repair most active"},
    ],
    phases:[
      {name:"Menstrual",rec:"14:10",hint:"Your body is in deep repair mode. A gentle 14-hour window is plenty — no extra pressure needed.",mot:"Today: hydrate and rest well"},
      {name:"Follicular",rec:"16:8",hint:"Energy is building. Many people find fasting easier during this phase.",mot:"A great time to build your fasting habit"},
      {name:"Ovulatory",rec:"16:8",hint:"Many people feel at their best now. Try a longer window — but stop anytime you need to.",mot:"Keep it up, your body is feeling good"},
      {name:"Luteal",rec:"14:10",hint:"Increased appetite is a normal physical response this phase, not a lack of control. Shortening your window is self-care, not giving up.",mot:"Listen to your body — 14 hours is a perfect win today"},
    ],
    cycleDay:(d,n)=>`Day ${d} · ${n}`,cycleSuggest:(r)=>`Suggested: ${r}`,
    toastStart:(n,m)=>n?`Fast started! ${m}.`:"Fast started! You've got this!",
    toastDone:(h,s)=>`Done! ${h}h fast completed — ${s}-day streak!`,
    toastEarlyLuteal:(h)=>`You gave your body ${h} hours of rest. Listening to yourself is self-care.`,
    toastEarly:(h)=>`${h} hours done — every session counts!`,
    toastWeight:(v)=>`Logged ${v} kg`,toastWeightErr:"Please enter a valid weight (20–300 kg)",
    streakLabel:"Streak",doneLabel:"Done",recordLabel:"Logged",
    recentWeeks:"Past 2 Weeks",recentList:"Recent Sessions",
    target:(h)=>`Goal ${h}h`,reached:"Reached",partial:"Partial",noRecord:"None",
    noHistory:"No logs yet — start your first fast!",
    streakDays:(n)=>`${n}-day streak`,
    currentWeight:"Current Weight",weightDown:"▼",weightUp:"▲",
    weightVsPrev:(d,v)=>`${d} ${v} kg vs last`,
    weightTrend:"Trend",weightRecord:"Log Today's Weight",
    weightPlaceholder:"e.g. 62.5",weightBtn:"Log",
    weightTip:"For best accuracy, weigh yourself fasted in the morning",weightHistory:"History",
    cycleTitle:"Cycle Awareness",cycleSub:"Adjust suggestions to your cycle",
    lastPeriod:"First day of last period",
    cycleLength:(n)=>`Cycle length: ${n} days`,cycleLengthHint:"(typically 25–35 days)",
    cyclePrivacy:"All cycle data stays on your device only. These hints are informational — always listen to your own body first.",
    planTitle:"Fasting Plan",aboutTitle:"About",
    aboutDesc:"FastTrack v1.0 · All data stored locally · No ads · Free",
    resetBtn:"Reset onboarding",resetConfirm:"Reset onboarding?",
    langSectionTitle:"Language / 語言",
    ob:[
      {title:"Welcome to FastTrack",sub:"No ads · No sign-up · Data stays on your device"},
      {title:"Choose a starting plan",sub:"You can change this anytime"},
      {title:"Enable Cycle Awareness?",sub:"Optional — toggle anytime in Settings"},
      {title:"Cycle settings",sub:"All data stays on your device"},
    ],
    obC1T:"Low-pressure start",obC1D:"Ending early isn't failure. Shortening your window isn't quitting. Every session counts.",
    obC2T:"Cycle-aware support",obC2D:"Get gentle, phase-based suggestions tailored to your body's natural rhythm.",
    obNext:"Get started",obEnableCycle:"Enable Cycle Awareness",obSkip:"Skip for now",obFinish:"Finish setup",
  },
};

const ZONE_DATA=[
  {h:0, bg:C.amber50, dot:C.amber400,txt:C.amber800},
  {h:4, bg:C.green50, dot:C.green400,txt:C.green800},
  {h:8, bg:C.teal50,  dot:C.teal400, txt:C.teal800},
  {h:12,bg:C.teal50,  dot:C.teal600, txt:C.teal800},
  {h:16,bg:C.purple50,dot:C.purple400,txt:C.purple800},
  {h:24,bg:C.purple50,dot:C.purple600,txt:C.purple800},
];
function getZoneIdx(hrs){let z=0;for(let i=0;i<ZONE_DATA.length;i++){if(hrs>=ZONE_DATA[i].h)z=i;}return z;}

const PHASE_DATA=[
  {id:"menstrual", days:[1,7], bg:C.coral50, dot:C.coral400,txt:C.coral800},
  {id:"follicular",days:[8,14],bg:C.green50, dot:C.green400,txt:C.green800},
  {id:"ovulation", days:[15,18],bg:C.teal50, dot:C.teal400, txt:C.teal800},
  {id:"luteal",    days:[19,28],bg:C.purple50,dot:C.purple400,txt:C.purple800},
];
function getPhaseIdx(day){
  const i=PHASE_DATA.findIndex(p=>day>=p.days[0]&&day<=p.days[1]);
  return i>=0?i:3;
}
function calcCycleDay(s,len){
  if(!s)return null;
  const start=new Date(s);start.setHours(0,0,0,0);
  const today=new Date();today.setHours(0,0,0,0);
  const diff=Math.floor((today-start)/86400000);
  return diff<0?null:(diff%len)+1;
}

const PLANS=[{id:"14:10",h:14},{id:"16:8",h:16},{id:"18:6",h:18},{id:"20:4",h:20}];

function fmt(ms){
  const t=Math.max(0,Math.floor(ms/1000));
  return [Math.floor(t/3600),Math.floor((t%3600)/60),t%60].map(v=>String(v).padStart(2,"0")).join(":");
}
function fmtHM(ms){
  const t=Math.max(0,Math.floor(ms/1000));
  const h=Math.floor(t/3600),m=Math.floor((t%3600)/60);
  return h>0?`${h}h ${m}m`:`${m}m`;
}
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function last14Days(){
  return Array.from({length:14},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-13+i);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  });
}
function ld(k,def){try{const v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch{return def;}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

function Ring({pct,color,size=188,stroke=13,children}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,offset=circ*(1-Math.min(1,pct));
  return(
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.gray50} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:"stroke-dashoffset .8s ease,stroke .5s ease"}}/>
      </svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",width:"80%"}}>
        {children}
      </div>
    </div>
  );
}

const icons={
  timer:(c)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="11" r="7" stroke={c} strokeWidth="1.5"/><path d="M10 7v4l2.5 2.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M8 2h4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  history:(c)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="3" stroke={c} strokeWidth="1.5"/><path d="M7 2v4M13 2v4M3 9h14" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  weight:(c)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16L7 6h6l3 10H4z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6c0-1.1.9-2 2-2s2 .9 2 2" stroke={c} strokeWidth="1.5"/><path d="M8 11h4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  settings:(c)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export default function FastTrack(){
  const [lang,setLang]          = useState(()=>ld("ft3_lang","zh"));
  const [tab,setTab]            = useState("timer");
  const [now,setNow]            = useState(Date.now());
  const [planId,setPlanId]      = useState(()=>ld("ft3_planId","16:8"));
  const [startTs,setStartTs]    = useState(()=>ld("ft3_start",null));
  const [records,setRecords]    = useState(()=>ld("ft3_records",{}));
  const [weights,setWeights]    = useState(()=>ld("ft3_weights",[]));
  const [hydration,setHydration]= useState(()=>ld("ft3_hydro_"+todayKey(),0));
  const [toast,setToast]        = useState("");
  const [cycleOn,setCycleOn]    = useState(()=>ld("ft3_cycleOn",false));
  const [cycleLen,setCycleLen]  = useState(()=>ld("ft3_cycleLen",28));
  const [cycleStart,setCycleStart]=useState(()=>ld("ft3_cycleStart",""));
  const [wInput,setWInput]      = useState("");
  const [onboarded,setOnboarded]= useState(()=>ld("ft3_onboarded",false));
  const [obStep,setObStep]      = useState(0);

  const T=I18N[lang];

  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[]);
  useEffect(()=>sv("ft3_lang",lang),[lang]);
  useEffect(()=>sv("ft3_planId",planId),[planId]);
  useEffect(()=>sv("ft3_start",startTs),[startTs]);
  useEffect(()=>sv("ft3_records",records),[records]);
  useEffect(()=>sv("ft3_weights",weights),[weights]);
  useEffect(()=>sv("ft3_hydro_"+todayKey(),hydration),[hydration]);
  useEffect(()=>sv("ft3_cycleOn",cycleOn),[cycleOn]);
  useEffect(()=>sv("ft3_cycleLen",cycleLen),[cycleLen]);
  useEffect(()=>sv("ft3_cycleStart",cycleStart),[cycleStart]);

  const plan     = PLANS.find(p=>p.id===planId)||PLANS[1];
  const elapsed  = startTs?now-startTs:0;
  const targetMs = plan.h*3600000;
  const remaining= Math.max(0,targetMs-elapsed);
  const pct      = startTs?Math.min(1,elapsed/targetMs):0;
  const zIdx     = getZoneIdx(elapsed/3600000);
  const zData    = ZONE_DATA[zIdx];
  const zI18n    = T.zones[zIdx];
  const isActive = !!startTs;
  const isDone   = isActive&&elapsed>=targetMs;
  const cDay     = cycleOn&&cycleStart?calcCycleDay(cycleStart,cycleLen):null;
  const phIdx    = cDay!=null?getPhaseIdx(cDay):-1;
  const pData    = phIdx>=0?PHASE_DATA[phIdx]:null;
  const pI18n    = phIdx>=0?T.phases[phIdx]:null;

  const streak=useCallback(()=>{
    let s=0;const days=[...last14Days()].reverse();
    for(const d of days){if(records[d]?.done)s++;else break;}
    return s;
  },[records])();

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(""),5000);}
  function toggleLang(){setLang(l=>l==="zh"?"en":"zh");}
  function startFast(){setStartTs(Date.now());showToast(T.toastStart(pI18n?.name,pI18n?.mot));}
  function endFast(){
    const hrs=(elapsed/3600000).toFixed(1),done=elapsed>=targetMs;
    setRecords(r=>({...r,[todayKey()]:{start:startTs,end:Date.now(),elapsed,done,planH:plan.h}}));
    setStartTs(null);
    showToast(done?T.toastDone(hrs,streak+1):pData?.id==="luteal"?T.toastEarlyLuteal(hrs):T.toastEarly(hrs));
  }
  function addWeight(){
    const v=parseFloat(wInput);
    if(isNaN(v)||v<20||v>300){showToast(T.toastWeightErr);return;}
    setWeights(w=>[...w.slice(-59),{date:todayKey(),kg:v,ts:Date.now()}]);
    setWInput("");showToast(T.toastWeight(v));
  }

  const card={background:"#fff",border:"0.5px solid #E8E8E2",borderRadius:14,padding:"13px 15px",marginBottom:12};
  const sLabel={fontSize:11,color:C.gray400,fontWeight:500,letterSpacing:.7,marginBottom:10,display:"block"};
  const pBtn=(bg=C.teal400)=>({width:"100%",padding:14,borderRadius:14,border:"none",background:bg,color:"#fff",fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:8});
  const gBtn={width:"100%",padding:10,borderRadius:14,border:"0.5px solid #DDD",background:"transparent",fontSize:12,color:C.gray400,cursor:"pointer",marginBottom:8};

  if(!onboarded){
    return(
      <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#FAFAF8",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
        <div style={{position:"fixed",top:16,right:16}}>
          <button onClick={toggleLang} style={{padding:"5px 12px",borderRadius:20,border:"0.5px solid #DDD",background:"#fff",fontSize:12,cursor:"pointer",color:C.gray800}}>{T.langLabel}</button>
        </div>
        <div style={{width:"100%",maxWidth:340}}>
          <div style={{display:"flex",gap:6,marginBottom:32,justifyContent:"center"}}>
            {T.ob.map((_,i)=>(
              <div key={i} style={{height:4,borderRadius:2,flex:1,background:i<=obStep?C.teal400:C.gray50,transition:"background .3s"}}/>
            ))}
          </div>
          <h1 style={{fontSize:22,fontWeight:500,color:C.gray800,marginBottom:8}}>{T.ob[obStep].title}</h1>
          <p style={{fontSize:14,color:C.gray400,marginBottom:32,lineHeight:1.6}}>{T.ob[obStep].sub}</p>

          {obStep===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:C.teal50,borderRadius:14,padding:"14px 16px"}}>
                <p style={{fontSize:13,fontWeight:500,color:C.teal800,marginBottom:4}}>{T.obC1T}</p>
                <p style={{fontSize:12,color:C.teal600,lineHeight:1.6}}>{T.obC1D}</p>
              </div>
              <div style={{background:C.purple50,borderRadius:14,padding:"14px 16px"}}>
                <p style={{fontSize:13,fontWeight:500,color:C.purple800,marginBottom:4}}>{T.obC2T}</p>
                <p style={{fontSize:12,color:C.purple600,lineHeight:1.6}}>{T.obC2D}</p>
              </div>
              <button onClick={()=>setObStep(1)} style={{...pBtn(),marginTop:8,marginBottom:0}}>{T.obNext}</button>
            </div>
          )}

          {obStep===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {PLANS.map(p=>(
                <button key={p.id} onClick={()=>{setPlanId(p.id);setObStep(2);}}
                  style={{padding:"14px 18px",borderRadius:14,border:`1.5px solid ${planId===p.id?C.teal400:"#E8E8E2"}`,background:planId===p.id?C.teal50:"#fff",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:15,fontWeight:500,color:C.gray800}}>{p.id}</div>
                    <div style={{fontSize:12,color:C.gray400,marginTop:2}}>{T.planSub[p.id]}</div>
                  </div>
                  <div style={{fontSize:12,color:C.teal600}}>{T.fastHours(p.h)}</div>
                </button>
              ))}
            </div>
          )}

          {obStep===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{background:C.gray50,borderRadius:14,padding:"14px 16px",marginBottom:4}}>
                <p style={{fontSize:12,color:C.gray400,lineHeight:1.6}}>{T.cyclePrivacy}</p>
              </div>
              <button onClick={()=>{setCycleOn(true);setObStep(3);}} style={{...pBtn(C.purple400),marginBottom:0}}>{T.obEnableCycle}</button>
              <button onClick={()=>{setCycleOn(false);setOnboarded(true);sv("ft3_onboarded",true);}} style={gBtn}>{T.obSkip}</button>
            </div>
          )}

          {obStep===3&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,color:C.gray400,display:"block",marginBottom:6}}>{T.lastPeriod}</label>
                <input type="date" value={cycleStart} onChange={e=>setCycleStart(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"0.5px solid #E0E0D8",fontSize:14,color:C.gray800,outline:"none",background:"#fff"}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gray400,display:"block",marginBottom:6}}>{T.cycleLength(cycleLen)} {T.cycleLengthHint}</label>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="range" min="21" max="40" step="1" value={cycleLen} onChange={e=>setCycleLen(Number(e.target.value))} style={{flex:1}}/>
                  <span style={{fontSize:15,fontWeight:500,color:C.gray800,minWidth:28}}>{cycleLen}</span>
                </div>
              </div>
              <button onClick={()=>{setOnboarded(true);sv("ft3_onboarded",true);}} disabled={!cycleStart}
                style={{...pBtn(cycleStart?C.teal400:C.gray200),cursor:cycleStart?"pointer":"not-allowed",marginBottom:0}}>{T.obFinish}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function TabTimer(){
    const ringColor=isDone?C.purple400:pData?pData.dot:C.teal400;
    return(
      <div style={{paddingTop:16}}>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {PLANS.map(p=>{
            const active=p.id===planId;
            return(
              <button key={p.id} onClick={()=>{if(!isActive)setPlanId(p.id);}}
                style={{flex:1,padding:"9px 4px",borderRadius:11,border:active?`1.5px solid ${C.teal400}`:"0.5px solid #E8E8E2",background:active?C.teal50:"#fff",cursor:isActive?"not-allowed":"pointer",opacity:isActive&&!active?0.45:1}}>
                <div style={{fontSize:12,fontWeight:500,color:active?C.teal600:C.gray400}}>{p.id}</div>
                <div style={{fontSize:9,color:active?C.teal400:C.gray200,marginTop:1}}>{T.planSub[p.id]}</div>
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
          <Ring pct={pct} color={ringColor}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:28,fontWeight:500,color:ringColor,letterSpacing:-1.5,lineHeight:1}}>
              {isActive?fmt(isDone?elapsed:remaining):`${plan.h}:00:00`}
            </div>
            <div style={{fontSize:11,color:C.gray400,marginTop:4}}>{isActive?(isDone?T.achieved:T.remaining):T.goalTime}</div>
            {isActive&&<div style={{fontSize:10,color:C.gray200,marginTop:2}}>{T.elapsedPfx} {fmtHM(elapsed)}</div>}
          </Ring>
        </div>
        {isActive&&(
          <div style={{background:zData.bg,borderRadius:13,padding:"11px 14px",marginBottom:10,display:"flex",gap:9,alignItems:"flex-start"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:zData.dot,marginTop:5,flexShrink:0}}/>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:zData.txt}}>{zI18n.label}</div>
              <div style={{fontSize:11,color:zData.dot,marginTop:2,lineHeight:1.4}}>{zI18n.desc}</div>
            </div>
          </div>
        )}
        {pData&&(
          <div style={{background:pData.bg,borderRadius:13,padding:"11px 14px",marginBottom:10,display:"flex",gap:9,alignItems:"flex-start"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:pData.dot,marginTop:5,flexShrink:0}}/>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:pData.txt}}>
                {T.cycleDay(cDay,pI18n.name)}
                <span style={{fontSize:10,fontWeight:400,color:pData.dot,marginLeft:6}}>{T.cycleSuggest(pI18n.rec)}</span>
              </div>
              <div style={{fontSize:11,color:pData.dot,marginTop:2,lineHeight:1.5}}>{pI18n.hint}</div>
            </div>
          </div>
        )}
        {!isActive
          ?<button onClick={startFast} style={pBtn()}>{T.startFast}</button>
          :<>
            <button onClick={endFast} style={pBtn(isDone?C.purple400:C.teal400)}>{isDone?T.endFast:T.earlyEnd}</button>
            <button style={gBtn}>{T.editStart}</button>
          </>
        }
        <div style={card}>
          <span style={sLabel}>{T.hydrationTitle}</span>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <button onClick={()=>setHydration(h=>Math.max(0,h-1))} style={{width:34,height:34,borderRadius:9,border:"0.5px solid #E0E0D8",background:"transparent",fontSize:18,cursor:"pointer",color:C.gray400}}>−</button>
            <div style={{flex:1,textAlign:"center"}}>
              <span style={{fontSize:28,fontWeight:500,color:C.teal600,fontFamily:"'DM Mono',monospace"}}>{hydration}</span>
              <span style={{fontSize:12,color:C.gray400,marginLeft:5}}>{T.cups}</span>
            </div>
            <button onClick={()=>setHydration(h=>Math.min(20,h+1))} style={{width:34,height:34,borderRadius:9,border:"none",background:C.teal50,fontSize:18,cursor:"pointer",color:C.teal600}}>+</button>
          </div>
          <div style={{display:"flex",gap:4}}>
            {Array.from({length:8},(_,i)=><div key={i} style={{flex:1,height:5,borderRadius:3,background:i<hydration?C.teal400:C.gray50,transition:"background .2s"}}/>)}
          </div>
          <div style={{fontSize:10,color:C.gray200,marginTop:5,textAlign:"center"}}>{T.hydrationTip}</div>
        </div>
      </div>
    );
  }

  function TabHistory(){
    const days=last14Days();
    const total=Object.values(records).length,done=Object.values(records).filter(r=>r.done).length;
    return(
      <div style={{paddingTop:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[{l:T.streakLabel,v:streak},{l:T.doneLabel,v:done},{l:T.recordLabel,v:total}].map(s=>(
            <div key={s.l} style={{background:"#fff",border:"0.5px solid #E8E8E2",borderRadius:13,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:500,color:C.teal600,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
              <div style={{fontSize:10,color:C.gray400,marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={card}>
          <span style={sLabel}>{T.recentWeeks}</span>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
            {days.map(d=>{
              const rec=records[d],isToday=d===todayKey(),dn=rec?.done,pt=rec&&!rec.done;
              const bg=isToday&&isActive?C.teal400:dn?C.teal50:pt?C.amber50:C.gray50;
              const cl=isToday&&isActive?"#fff":dn?C.teal800:pt?C.amber800:C.gray200;
              return(
                <div key={d} style={{aspectRatio:"1",borderRadius:9,background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
                  <span style={{fontSize:11,fontWeight:500,color:cl}}>{d.split("-")[2]}</span>
                  {(dn||pt)&&<span style={{fontSize:8,color:cl,opacity:.8}}>{((rec.elapsed||0)/3600000).toFixed(1)}h</span>}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
            {[{bg:C.teal50,c:C.teal800,l:T.reached},{bg:C.amber50,c:C.amber800,l:T.partial},{bg:C.gray50,c:C.gray200,l:T.noRecord}].map(x=>(
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:3,background:x.bg,border:`0.5px solid ${x.c}`}}/>
                <span style={{fontSize:10,color:C.gray400}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <span style={sLabel}>{T.recentList}</span>
          {Object.entries(records).slice(-5).reverse().map(([d,r])=>(
            <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"0.5px solid #F2F2EE"}}>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:C.gray800}}>{d}</div>
                <div style={{fontSize:11,color:C.gray400,marginTop:1}}>{T.target(r.planH)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,fontWeight:500,color:r.done?C.teal600:C.amber400,fontFamily:"'DM Mono',monospace"}}>{((r.elapsed||0)/3600000).toFixed(1)}h</div>
                <div style={{fontSize:10,color:r.done?C.teal400:C.amber400,marginTop:1}}>{r.done?T.reached:T.partial}</div>
              </div>
            </div>
          ))}
          {Object.keys(records).length===0&&<p style={{fontSize:13,color:C.gray200,textAlign:"center",padding:"12px 0"}}>{T.noHistory}</p>}
        </div>
      </div>
    );
  }

  function TabWeight(){
    const last=weights.slice(-1)[0],prev=weights.slice(-2,-1)[0];
    const diff=last&&prev?(last.kg-prev.kg):null;
    const pts=weights.slice(-14);
    const cW=320,cH=110,minKg=pts.length?Math.min(...pts.map(p=>p.kg))-1:50,maxKg=pts.length?Math.max(...pts.map(p=>p.kg))+1:80;
    const toX=(i)=>pts.length<2?cW/2:i*(cW-20)/(pts.length-1)+10;
    const toY=(kg)=>cH-((kg-minKg)/(maxKg-minKg))*(cH-10)-5;
    return(
      <div style={{paddingTop:16}}>
        <div style={{...card,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:11,color:C.gray400,marginBottom:4}}>{T.currentWeight}</div>
            <div style={{fontSize:32,fontWeight:500,color:C.gray800,fontFamily:"'DM Mono',monospace"}}>
              {last?last.kg.toFixed(1):"--"}<span style={{fontSize:16,color:C.gray400}}> kg</span>
            </div>
            {diff!==null&&<div style={{fontSize:12,color:diff<0?C.teal600:C.coral400,marginTop:4}}>{T.weightVsPrev(diff<0?T.weightDown:T.weightUp,Math.abs(diff).toFixed(1))}</div>}
          </div>
          {last&&<div style={{fontSize:11,color:C.gray200}}>{last.date}</div>}
        </div>
        {pts.length>1&&(
          <div style={card}>
            <span style={sLabel}>{T.weightTrend}</span>
            <svg width="100%" viewBox={`0 0 ${cW} ${cH}`}>
              {pts.map((_,i)=>i>0&&<line key={i} x1={toX(i-1)} y1={toY(pts[i-1].kg)} x2={toX(i)} y2={toY(pts[i].kg)} stroke={C.teal400} strokeWidth="2" strokeLinecap="round"/>)}
              {pts.map((p,i)=><circle key={i} cx={toX(i)} cy={toY(p.kg)} r="4" fill={C.teal400}/>)}
            </svg>
          </div>
        )}
        <div style={card}>
          <span style={sLabel}>{T.weightRecord}</span>
          <div style={{display:"flex",gap:8}}>
            <input type="number" placeholder={T.weightPlaceholder} value={wInput} onChange={e=>setWInput(e.target.value)}
              style={{flex:1,padding:"10px 12px",borderRadius:10,border:"0.5px solid #E0E0D8",fontSize:15,color:C.gray800,outline:"none",background:"#FAFAF8"}}/>
            <button onClick={addWeight} style={{padding:"10px 18px",borderRadius:10,border:"none",background:C.teal400,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer"}}>{T.weightBtn}</button>
          </div>
          <p style={{fontSize:10,color:C.gray200,marginTop:8}}>{T.weightTip}</p>
        </div>
        {weights.length>0&&(
          <div style={card}>
            <span style={sLabel}>{T.weightHistory}</span>
            {weights.slice(-7).reverse().map((w,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"0.5px solid #F2F2EE"}}>
                <span style={{fontSize:13,color:C.gray800}}>{w.date}</span>
                <span style={{fontSize:13,fontWeight:500,color:C.teal600,fontFamily:"'DM Mono',monospace"}}>{w.kg.toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function TabSettings(){
    return(
      <div style={{paddingTop:16}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:C.gray800}}>{T.cycleTitle}</div>
              <div style={{fontSize:11,color:C.gray400,marginTop:2}}>{T.cycleSub}</div>
            </div>
            <button onClick={()=>setCycleOn(v=>!v)} style={{width:44,height:26,borderRadius:13,border:"none",cursor:"pointer",background:cycleOn?C.teal400:"#DDD",position:"relative",transition:"background .2s"}}>
              <div style={{position:"absolute",top:3,left:cycleOn?20:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
            </button>
          </div>
          {cycleOn&&(
            <div style={{display:"flex",flexDirection:"column",gap:12,borderTop:"0.5px solid #F0F0E8",paddingTop:12}}>
              <div>
                <label style={{fontSize:12,color:C.gray400,display:"block",marginBottom:6}}>{T.lastPeriod}</label>
                <input type="date" value={cycleStart} onChange={e=>setCycleStart(e.target.value)}
                  style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"0.5px solid #E0E0D8",fontSize:14,color:C.gray800,outline:"none",background:"#FAFAF8"}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gray400,display:"block",marginBottom:6}}>{T.cycleLength(cycleLen)} {T.cycleLengthHint}</label>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="range" min="21" max="40" step="1" value={cycleLen} onChange={e=>setCycleLen(Number(e.target.value))} style={{flex:1}}/>
                  <span style={{fontSize:15,fontWeight:500,color:C.gray800,minWidth:28}}>{cycleLen}</span>
                </div>
              </div>
              {cDay&&pData&&(
                <div style={{background:pData.bg,borderRadius:10,padding:"10px 12px"}}>
                  <div style={{fontSize:12,fontWeight:500,color:pData.txt}}>{T.cycleDay(cDay,pI18n.name)}</div>
                  <div style={{fontSize:11,color:pData.dot,marginTop:3}}>{T.cycleSuggest(pI18n.rec)}</div>
                </div>
              )}
              <p style={{fontSize:10,color:C.gray200,lineHeight:1.6}}>{T.cyclePrivacy}</p>
            </div>
          )}
        </div>

        <div style={card}>
          <div style={{fontSize:14,fontWeight:500,color:C.gray800,marginBottom:12}}>{T.planTitle}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PLANS.map(p=>(
              <button key={p.id} onClick={()=>{if(!isActive)setPlanId(p.id);}}
                style={{padding:"12px 14px",borderRadius:11,cursor:isActive?"not-allowed":"pointer",border:`1.5px solid ${planId===p.id?C.teal400:"#E8E8E2"}`,background:planId===p.id?C.teal50:"#FAFAF8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{textAlign:"left"}}>
                  <span style={{fontSize:14,fontWeight:500,color:planId===p.id?C.teal600:C.gray800}}>{p.id}</span>
                  <span style={{fontSize:11,color:C.gray400,marginLeft:8}}>{T.planSub[p.id]}</span>
                </div>
                <span style={{fontSize:11,color:C.gray400}}>{T.fastHours(p.h)}</span>
              </button>
            ))}
          </div>
          {isActive&&<p style={{fontSize:11,color:C.gray200,marginTop:8}}>{T.activePlan}</p>}
        </div>

        <div style={card}>
          <div style={{fontSize:14,fontWeight:500,color:C.gray800,marginBottom:12}}>{T.langSectionTitle}</div>
          <div style={{display:"flex",gap:8}}>
            {["zh","en"].map(l=>(
              <button key={l} onClick={()=>setLang(l)}
                style={{flex:1,padding:"10px",borderRadius:11,cursor:"pointer",border:`1.5px solid ${lang===l?C.teal400:"#E8E8E2"}`,background:lang===l?C.teal50:"#FAFAF8",fontSize:13,fontWeight:500,color:lang===l?C.teal600:C.gray400}}>
                {l==="zh"?"中文（台灣）":"English"}
              </button>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{fontSize:14,fontWeight:500,color:C.gray800,marginBottom:4}}>{T.aboutTitle}</div>
          <p style={{fontSize:12,color:C.gray400,lineHeight:1.6,marginBottom:12}}>{T.aboutDesc}</p>
          <button onClick={()=>{if(window.confirm(T.resetConfirm)){sv("ft3_onboarded",false);setOnboarded(false);setObStep(0);}}}
            style={{padding:"8px 14px",borderRadius:9,border:"0.5px solid #E0E0D8",background:"transparent",fontSize:12,color:C.gray400,cursor:"pointer"}}>
            {T.resetBtn}
          </button>
        </div>
      </div>
    );
  }

  const TABS=[
    {id:"timer",label:T.navTimer,icon:icons.timer},
    {id:"history",label:T.navHistory,icon:icons.history},
    {id:"weight",label:T.navWeight,icon:icons.weight},
    {id:"settings",label:T.navSettings,icon:icons.settings},
  ];

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#FAFAF8",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {toast&&(
        <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:C.teal800,color:"#fff",padding:"10px 18px",borderRadius:12,fontSize:13,zIndex:999,maxWidth:360,textAlign:"center",lineHeight:1.5}}>
          {toast}
        </div>
      )}
      <div style={{padding:"14px 20px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"0.5px solid #E8E8E2",background:"#FAFAF8"}}>
        <div>
          <span style={{fontSize:16,fontWeight:500,color:C.gray800}}>{T.appName}</span>
          {streak>0&&<span style={{fontSize:11,color:C.teal600,marginLeft:8}}>{T.streakDays(streak)}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {pData&&<div style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:pData.bg,color:pData.txt,fontWeight:500}}>{pI18n.name} · {cDay}</div>}
          <button onClick={toggleLang} style={{padding:"4px 10px",borderRadius:20,border:"0.5px solid #DDD",background:"#fff",fontSize:11,cursor:"pointer",color:C.gray800,fontWeight:500}}>{T.langLabel}</button>
        </div>
      </div>
      <div style={{flex:1,padding:"0 20px 90px",overflowY:"auto"}}>
        {tab==="timer"&&<TabTimer/>}
        {tab==="history"&&<TabHistory/>}
        {tab==="weight"&&<TabWeight/>}
        {tab==="settings"&&<TabSettings/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,display:"flex",justifyContent:"space-around",padding:"9px 0 13px",background:"#FAFAF8",borderTop:"0.5px solid #E8E8E2",zIndex:100}}>
        {TABS.map(tb=>{
          const active=tab===tb.id;
          return(
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,border:"none",background:"none",cursor:"pointer",padding:"0 12px"}}>
              {tb.icon(active?C.teal400:C.gray200)}
              <span style={{fontSize:10,fontWeight:500,color:active?C.teal400:C.gray200}}>{tb.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
