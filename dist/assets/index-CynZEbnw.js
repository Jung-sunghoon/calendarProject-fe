(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))a(l);new MutationObserver(l=>{for(const h of l)if(h.type==="childList")for(const m of h.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&a(m)}).observe(document,{childList:!0,subtree:!0});function n(l){const h={};return l.integrity&&(h.integrity=l.integrity),l.referrerPolicy&&(h.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?h.credentials="include":l.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function a(l){if(l.ep)return;l.ep=!0;const h=n(l);fetch(l.href,h)}})();const $={scheduleData:[],originalSchedule:null,selectedScheduleId:null,selectedDate:null},u={$modalScheduleView:document.querySelector(".modal-schedule-view"),$modalScheduleEdit:document.querySelector(".modal-schedule-edit"),$closeBtn:document.querySelector(".view-close-button"),$addBtn:document.querySelector(".view-add-button"),calendarMonthElement:document.querySelector(".calendar-month"),calendarYearElement:document.querySelector(".calendar-year"),$saveBtn:document.querySelector("#save-btn"),$clearBtn:document.querySelector("#clear-btn"),deleteModal:document.querySelector(".modal-schedule-delete"),$modalDeleteConfirmBtn:document.querySelector(".delete-confirmation-btn"),$modalDeleteCancelBtn:document.querySelector(".delete-cancel-btn")};function H(e){const t=e.match(/\d{2}:\d{2}/);if(!t)throw new Error("입력된 형식이 잘못되었습니다.");return t[0]}function De(e){const t=Ee(e.target);if(t){const n=xe(t);$.selectedDate=n,se(n)}}function Ee(e){return e.closest("td.calendar-day, td.prev-month, td.next-month")}function xe(e){let t=parseInt(u.calendarYearElement.textContent),n=parseInt(u.calendarMonthElement.textContent)-1,a;const l=e.querySelector(".calendar-day-date");return l?a=parseInt(l.textContent,10):a=parseInt(e.textContent,10),e.classList.contains("prev-month")?n===0?(t--,n=11):n--:e.classList.contains("next-month")&&(n===11?(t++,n=0):n++),new Date(t,n,a)}function se(e){$e(e),Ce(e),u.$modalScheduleView.style.display="block"}function $e(e){const t=u.$modalScheduleView.querySelector(".modal-date-display");t&&(t.innerHTML=`
      <p class="view-year">${e.getFullYear()}</p>
      <p class="view-month">${String(e.getMonth()+1).padStart(2,"0")}</p>
      <span class="view-separator">/</span>
      <p class="view-day">${String(e.getDate()).padStart(2,"0")}</p>
    `)}function j(){u.$modalScheduleView.style.display="none",u.$modalScheduleEdit.style.display="none"}async function Ce(e){const t=u.$modalScheduleView.querySelector(".modal-view-content");if(t)try{const n=await fetch("http://localhost:8080/api/schedules");if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);const a=await n.json();if(!Array.isArray(a))throw new Error("Received data is not an array");$.scheduleData=a;const l=de(a,e);t.innerHTML=Le(l)}catch(n){console.error("Error fetching schedule data:",n),t.innerHTML=`<p>일정을 불러오는 중 오류가 발생했습니다: ${n.message}</p>`}}function de(e,t){return!e||!Array.isArray(e)?(console.error("Invalid data provided to filteredScheduleData"),[]):e.filter(n=>{const a=new Date(n.schedule_start),l=new Date(n.schedule_end),h=new Date(a.getFullYear(),a.getMonth(),a.getDate()),m=new Date(t.getFullYear(),t.getMonth(),t.getDate());return h.getTime()===m.getTime()||m>=a&&m<=l})}function Le(e){return!e||e.length===0?"<p>조회 가능한 일정이 없습니다</p>":e.map(t=>`
        <div class="modal-view-box" data-schedule-id="${t.schedule_id}">
          <h3 class="modal-view-title">${t.schedule_title}</h3>
          <div class="modal-view-time">
            <span class="view-time-start">${H(t.schedule_start)}</span>
            <span class="view-time-separator">~</span>
            <span class="view-time-end">${H(t.schedule_end)}</span>
          </div>
          <p class="view-description">${t.schedule_description||""}</p>
        </div>
      `).join("")}function ke(e){const t=new Date(e.schedule_start),n=new Date(e.schedule_end);document.querySelector(".modal-edit-container .modal-title").value=e.schedule_title,document.querySelector("#selectedDate").textContent=`${t.getFullYear()}년 ${t.getMonth()+1}월 ${t.getDate()}일`,document.querySelector("#selectedTime").textContent=H(e.schedule_start),document.querySelector("#completeDate").textContent=`${n.getFullYear()}년 ${n.getMonth()+1}월 ${n.getDate()}일`,document.querySelector("#completeTime").textContent=H(e.schedule_end),document.querySelector(".textarea-container textarea").value=e.schedule_description||""}function te(e){const t=e.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일 (\d{1,2}):(\d{2})/);if(!t)throw new Error("입력 형식이 잘못되었습니다.");const[n,a,l,h,m,v]=t,C=`${a}-${String(l).padStart(2,"0")}-${String(h).padStart(2,"0")}`,g=`${String(m).padStart(2,"0")}:${String(v).padStart(2,"0")}:00`;return`${C} ${g}`}function qe(){const e=document.querySelector(".modal-edit-container .modal-title").value,t=document.querySelector("#selectedDate").textContent,n=document.querySelector("#selectedTime").textContent,a=document.querySelector("#completeDate").textContent,l=document.querySelector("#completeTime").textContent,h=document.querySelector(".textarea-container textarea").value,m=te(`${t} ${n}`),v=te(`${a} ${l}`);return{schedule_title:e,schedule_start:m,schedule_end:v,schedule_description:h}}async function Me(e,t){try{const n={...$.originalSchedule,...t},a=await fetch(`http://localhost:8080/api/schedule/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!a.ok)throw new Error(`error status: ${a.status}`);const l=await a.json();console.log("Update response:",l),j(),await T(),E(),b(),B()}catch(n){console.error("Error updating schedule data:",n),alert(`오류 발생: ${n.message}`)}}async function Te(){if(!$.selectedScheduleId){j();return}const e=$.selectedScheduleId;try{const t=await fetch(`http://localhost:8080/api/schedule/${e}`,{method:"DELETE"});if(!t.ok)throw new Error("Failed to delete the schedule");const n=await t.json();console.log(n),j(),u.deleteModal.style.display="none",await T(),E(),b(),B()}catch(t){console.error("에러:",t)}}function ne(e){const t=new Date(e),n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),l=String(t.getDate()).padStart(2,"0");return`${n}년 ${a}월 ${l}일`}function re(){u.$modalScheduleEdit.style.display="block",u.$clearBtn.style.display="none",u.$saveBtn.textContent="저장",document.querySelector(".modal-edit-container .modal-title").value="",document.querySelector(".textarea-container textarea").value="",document.querySelector("#selectedDate").textContent=ne($.selectedDate),document.querySelector("#completeDate").textContent=ne($.selectedDate),document.querySelector("#selectedTime").textContent="00:00",document.querySelector("#completeTime").textContent="00:00"}function be(e){if(e.target===u.$addBtn&&re(),e.target===u.$modalScheduleView||e.target===u.$closeBtn)j();else if(e.target.closest(".modal-view-box")){u.$clearBtn.style.display="block";const t=e.target.closest(".modal-view-box").dataset.scheduleId,n=$.scheduleData.find(a=>a.schedule_id===parseInt(t));n&&($.selectedScheduleId=n.schedule_id,$.originalSchedule={...n},ke(n),u.$modalScheduleEdit.style.display="block")}}function Be(){if(u.$saveBtn.textContent==="수정"){const e=qe(),t=new Date(e.schedule_start),n=new Date(e.schedule_end);if(t>n){alert("시작 날짜와 시간이 종료 날짜와 시간보다 이후일 수 없습니다.");return}Me($.selectedScheduleId,e)}}function Ie(){u.deleteModal.style.display="block"}function _e(){Te()}function Fe(){u.deleteModal.style.display="none"}function Ye(){document.body.addEventListener("click",De),u.$addBtn.addEventListener("click",re),window.addEventListener("click",be),u.$saveBtn.addEventListener("click",Be),u.$clearBtn.addEventListener("click",Ie),u.$modalDeleteConfirmBtn.addEventListener("click",_e),u.$modalDeleteCancelBtn.addEventListener("click",Fe)}document.addEventListener("DOMContentLoaded",Ye);let A=[];async function T(){try{const e=await fetch("http://localhost:8080/api/schedules");if(!e.ok)throw new Error("Network response was not ok");A=await e.json(),E(),console.log(A,"캘린더js에서 호출")}catch(e){console.error("Fetch error:",e)}}let L=new Date;const Ne=document.querySelector(".sidebar-logo a"),oe=document.querySelector(".calendar-month"),Oe=document.querySelector(".calendar-year"),He=document.querySelector(".arrow-left"),je=document.querySelector(".arrow-right"),ae=document.querySelector(".calendar-date"),ie=document.querySelector(".calendar-select-year-text"),ue=document.querySelector(".calendar-select-month-text"),P=document.querySelector(".calendar-select-year-box"),R=document.querySelector(".calendar-select-month-box"),Ae=document.querySelector(".calendar-select-year"),Pe=document.querySelector(".calendar-select-month"),Re=document.querySelectorAll(".calendar-select-year-list li"),Ve=document.querySelectorAll(".calendar-select-month-list li");P.style.display="none";R.style.display="none";function E(e){const t=L.getFullYear(),n=L.getMonth()+1;oe.textContent=String(n).padStart(2,"0"),Oe.textContent=t,ie.textContent=`${t} 년`,ue.textContent=`${oe.textContent} 월`,Xe(t,n)}Re.forEach(e=>{e.addEventListener("click",function(){const t=parseInt(this.textContent,10);L.setFullYear(t),ie.textContent=`${t} 년`,E()})});Ve.forEach(e=>{e.addEventListener("click",function(){const t=parseInt(this.textContent,10);L.setMonth(t-1),ue.textContent=`${t} 월`,E()})});function le(e,t){e.style.display==="block"?(P.style.display="none",R.style.display="none"):(e.style.display="block",t.style.display="none")}function We(){Ae.addEventListener("click",function(){le(P,R)}),Pe.addEventListener("click",function(){le(R,P)}),E()}function Xe(e,t){ae.innerHTML="";const n=["일","월","화","수","목","금","토"];let a=document.createElement("table"),l=document.createElement("tr");n.forEach((p,S)=>{let x=document.createElement("th");x.textContent=p,x.classList.add("day-header"),S===0&&x.classList.add("sunday"),S===6&&x.classList.add("saturday"),l.appendChild(x)}),a.appendChild(l);const h=new Date(e,t-1,1).getDay(),m=new Date(e,t,0).getDate(),v=new Date,C=new Date(e,t-1,0).getDate();let g=document.createElement("tr");for(let p=0;p<h;p++){let S=document.createElement("td");S.textContent=C-h+p+1,S.classList.add("prev-month"),g.appendChild(S)}for(let p=1;p<=m;p++){g.children.length===7&&(a.appendChild(g),g=document.createElement("tr"));let S=document.createElement("td"),x=document.createElement("span");if(x.textContent=p,S.appendChild(x),S.classList.add("calendar-day"),x.classList.add("calendar-day-date"),e===v.getFullYear()&&t===v.getMonth()+1&&p===v.getDate()){S.classList.add("today");let w=document.createElement("span");w.classList.add("calendar-day-date");let D=document.createElement("div");D.classList.add("today-indicator"),D.textContent=p,S.innerHTML="",w.appendChild(D),S.appendChild(w)}A.filter(w=>{const D=new Date(w.schedule_start),I=new Date(w.schedule_end);if(D.getFullYear()===e&&D.getMonth()+1===t&&D.getDate()<=p&&I.getFullYear()===e&&I.getMonth()+1===t&&I.getDate()>=p)return!0}).forEach(w=>{const D=document.createElement("div");D.classList.add("schedule-bar"),D.textContent=w.schedule_title,S.appendChild(D)}),g.appendChild(S)}let V=1;for(;g.children.length<7;){let p=document.createElement("td");p.textContent=V++,p.classList.add("next-month"),g.appendChild(p)}a.appendChild(g),ae.appendChild(a)}He.addEventListener("click",()=>{L.setMonth(L.getMonth()-1),E()});je.addEventListener("click",()=>{L.setMonth(L.getMonth()+1),E()});Ne.addEventListener("click",function(e){e.preventDefault(),L=new Date,E()});const z=document.querySelector(".sidebar-schedule-list"),Je=document.querySelector(".sidebar-schedule-add"),G=document.querySelector(".sidebar-new-item"),F=G.querySelector(".sidebar-schedule-input"),q=document.querySelector(".modal-schedule-delete"),Ke=q.querySelector(".delete-confirmation-btn"),Ue=q.querySelector(".delete-cancel-btn"),ze=document.querySelector(".sidebar-weather-text"),Ge=document.querySelector(".sidebar-weather-temp"),Qe=document.querySelector(".sidebar-weather-icon");let Y=null,M=null,O=!1,he=[];const ce=e=>{const t=new Date(e),n=9*60;return new Date(t.getTime()+n*6e4).toISOString().slice(0,19).replace("T"," ")};function b(){he=de(A,new Date)}function B(){z.innerHTML="",he.forEach(et)}Je.addEventListener("click",()=>{G.style.display="block",F.focus()});F.addEventListener("keydown",async e=>{e.key==="Enter"&&(e.preventDefault(),O||await Ze())});async function Ze(){if(!O){O=!0;try{if(!F.value.trim())return;if(!(await fetch("http://localhost:8080/api/schedule",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_email:"john.doe@example.com",schedule_title:F.value,schedule_description:"",schedule_start:ce(new Date),schedule_end:ce(new Date),schedule_notification:!1,schedule_recurring:!1})})).ok)throw new Error("Failed to add new schedule");F.value="",await T(),b(),B(),G.style.display="none",E()}catch(e){console.error("일정 추가 중 오류 발생:",e)}finally{O=!1}}}function et(e){const t=document.createElement("li");t.innerHTML=`
    <a href="#">
      <div class="sidebar-list-box" data-id="${e.schedule_id}">
        <div class="sidebar-list-cont">
          <img src="./src/assets/img/list-circle.svg" alt="" />
          <span>${e.schedule_title||""}</span>
        </div>
        <div class="sidebar-list-close">
          <img src="./src/assets/img/close-btn.svg" alt="" />
        </div>
      </div>
    </a>
  `,z.appendChild(t)}async function me(e){try{const t=await fetch(`http://localhost:8080/api/schedule/${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json();throw new Error(n.error||`HTTP error! status: ${t.status}`)}Y.remove(),Q(),await T(),b(),B(),E()}catch(t){console.error("Error deleting schedule:",t),alert(`서버 통신 실패: ${t.message}`)}}z.addEventListener("click",e=>{const t=e.target.closest(".sidebar-list-close");if(t){e.preventDefault();const n=t.closest(".sidebar-list-box");if(n){Y=n.closest("li"),M=n.dataset.id;const a=n.querySelector("span").textContent;tt(a)}}else e.target.closest(".sidebar-list-box")&&(e.preventDefault(),nt())});function tt(e){q.querySelector(".delete-txt strong").textContent=e,q.style.display="block",document.addEventListener("keydown",ye)}function ye(e){e.key==="Enter"&&q.style.display==="block"?(e.preventDefault(),Y&&M&&me(M)):e.key==="Escape"&&q.style.display==="block"&&(e.preventDefault(),Q())}function Q(){Y=null,M=null,q.style.display="none",document.removeEventListener("keydown",ye)}Ke.addEventListener("click",()=>{Y&&M?me(M):console.error("Invalid delete attempt: itemToDelete or scheduleIdToDelete is null")});Ue.addEventListener("click",Q);async function nt(){try{await se(new Date)}catch(e){console.error("Error fetching schedule details:",e),alert(`일정 정보를 가져오는데 실패했습니다: ${e.message}`)}}const ot={200:"천둥번개와 가벼운 비",201:"천둥번개와 비",202:"천둥번개와 폭우",210:"가벼운 천둥번개",211:"천둥번개",212:"강한 천둥번개",221:"불규칙한 천둥번개",230:"천둥번개와 가벼운 이슬비",231:"천둥번개와 이슬비",232:"천둥번개와 강한 이슬비",300:"약한 이슬비",301:"이슬비",302:"강한 이슬비",310:"약한 이슬비와 비",311:"이슬비와 비",312:"강한 이슬비와 비",313:"소나기와 이슬비",314:"강한 소나기와 이슬비",321:"소나기 이슬비",500:"가벼운 비",501:"보통 비",502:"강한 비",503:"매우 강한 비",504:"극심한 비",511:"어는 비",520:"가벼운 소나기 비",521:"소나기 비",522:"강한 소나기 비",531:"불규칙한 소나기 비",600:"가벼운 눈",601:"눈",602:"강한 눈",611:"진눈깨비",612:"가벼운 진눈깨비 소나기",613:"진눈깨비 소나기",615:"가벼운 비와 눈",616:"비와 눈",620:"가벼운 눈 소나기",621:"눈 소나기",622:"강한 눈 소나기",701:"엷은 안개",711:"연기",721:"연무",731:"모래/먼지 소용돌이",741:"안개",751:"모래",761:"먼지",762:"화산재",771:"돌풍",781:"토네이도",800:"맑은 하늘",801:"구름 조금",802:"드문드문 구름",803:"흐린 구름",804:"구름 많음"};function at(e){return ot[e]||e}async function lt(){try{const e=await fetch("http://localhost:8080/api/weather?city=seoul");if(!e.ok)throw new Error("Failed to fetch weather data");const t=await e.json();ze.innerText=at(t.weather[0].id),Ge.innerText=`${Math.round(t.main.temp)}º`,Qe.src=`http://openweathermap.org/img/wn/${t.weather[0].icon}@4x.png`}catch(e){console.error(e)}}lt();async function ct(){await T(),E(),We(),b(),B()}ct();document.addEventListener("DOMContentLoaded",function(){const e=document.querySelector(".modal-schedule-edit"),t=document.querySelector(".modal-schedule-view"),n=document.getElementById("close-btn"),a=document.getElementById("exit-btn"),l=document.getElementById("save-btn"),h=document.getElementById("clear-btn"),m=document.getElementById("selectedDate"),v=document.getElementById("selectedTime"),C=document.getElementById("completeDate"),g=document.getElementById("completeTime"),V=document.querySelector(".start-date-input"),p=document.querySelector(".start-time-input"),S=document.querySelector(".end-date-input"),x=document.querySelector(".end-time-input"),i=document.getElementById("datePicker"),w=document.getElementById("calendar"),D=document.getElementById("currentMonth"),I=document.getElementById("prevMonth"),pe=document.getElementById("nextMonth"),fe=document.getElementById("start-confirm"),ge=document.getElementById("end-confirm");n.onclick=function(){e.style.display="none"},a.onclick=function(){e.style.display="none"},h.style.display="none";let d=new Date,N=new Date,W=null,X=!1;function k(){w.innerHTML="",D.textContent=`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}`;const o=new Date(d.getFullYear(),d.getMonth(),1),c=new Date(d.getFullYear(),d.getMonth()+1,0),y=new Date(d.getFullYear(),d.getMonth(),0);for(let r=o.getDay()-1;r>=0;r--){const s=J(new Date(y.getFullYear(),y.getMonth(),y.getDate()-r));s.classList.add("other-month"),w.appendChild(s)}for(let r=1;r<=c.getDate();r++){const s=J(new Date(d.getFullYear(),d.getMonth(),r));w.appendChild(s)}const f=42-w.children.length;for(let r=1;r<=f;r++){const s=J(new Date(d.getFullYear(),d.getMonth()+1,r));s.classList.add("other-month"),w.appendChild(s)}}function J(o){const c=document.createElement("div");return c.textContent=o.getDate(),c.classList.add("day"),o.getDay()===0&&c.classList.add("sun"),o.getDay()===6&&c.classList.add("sat"),o.toDateString()===new Date().toDateString()&&c.classList.add("today"),W&&o.toDateString()===W.toDateString()&&c.classList.add("selected"),c.addEventListener("click",()=>Se(o)),c}function Se(o){W=o,d=new Date(o),k()}I.addEventListener("click",()=>{d.setMonth(d.getMonth()-1),k()}),pe.addEventListener("click",()=>{d.setMonth(d.getMonth()+1),k()}),fe.addEventListener("click",function(){const o=document.getElementById("start-hour"),c=document.getElementById("start-minute");o.addEventListener("input",function(){const y=this.dataset.maxLength,f=this.dataset.min,r=this.dataset.max;let s=parseInt(this.value,10);this.value.length>y&&(this.value=this.value.slice(0,y)),!isNaN(s)&&s>=0&&s<=9&&(this.value=s.toString().padStart(2,"0")),parseInt(o.value)<f&&(o.value=f),parseInt(o.value)>r&&(o.value=r)}),o.value>=0&&o.value<=9&&o.value.toString().padStart(2,"0"),c.addEventListener("input",function(){const y=this.dataset.maxLength,f=this.dataset.min,r=this.dataset.max;let s=parseInt(this.value,10);this.value.length>y&&(this.value=this.value.slice(0,y)),!isNaN(s)&&s>=0&&s<=9&&(this.value=s.toString().padStart(2,"0")),parseInt(this.value)<f&&(this.value=f),parseInt(this.value)>r&&(this.value=r)}),c.value>=0&&c.value<=9&&c.value.toString().padStart(2,"0"),m.textContent=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`,console.log(m.textContent),v.textContent=`${o.value.slice(0,"2")}:${c.value.slice(0,"2")}`,console.log(v.textContent),i.style.display=i.style.display=="none"?"block":"none"}),ge.addEventListener("click",function(){const o=document.getElementById("end-hour"),c=document.getElementById("end-minute");o.addEventListener("input",function(){const y=this.dataset.maxLength,f=this.dataset.min,r=this.dataset.max;let s=parseInt(this.value,10);this.value.length>y&&(this.value=this.value.slice(0,y)),!isNaN(s)&&s>=0&&s<=9&&(this.value=s.toString().padStart(2,"0")),parseInt(this.value)<f&&(this.value=f),parseInt(this.value)>r&&(this.value=r)}),c.addEventListener("input",function(){const y=this.dataset.maxLength,f=this.dataset.min,r=this.dataset.max;let s=parseInt(this.value,10);this.value.length>y&&(this.value=this.value.slice(0,y)),!isNaN(s)&&s>=0&&s<=9&&(this.value=s.toString().padStart(2,"0")),parseInt(this.value)<f&&(this.value=f),parseInt(this.value)>r&&(this.value=r)}),C.textContent=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`,console.log(C.textContent),g.textContent=`${o.value.slice(0,"2")}:${c.value.slice(0,"2")}`,console.log(g.textContent),i.style.display=i.style.display=="none"?"block":"none"});function ve(){const o=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;m.textContent=o;const c=`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;C.textContent=c;const y=`${String(N.getHours()).padStart(2,"0")}:${String(N.getMinutes()).padStart(2,"0")}`;v.textContent=y;const f=`${String(N.getHours()).padStart(2,"0")}:${String(N.getMinutes()).padStart(2,"0")}`;g.textContent=f}ve(),V.addEventListener("click",()=>{const o=document.querySelector(".start-time"),c=document.querySelector(".end-time");c.style.display="none",o.style.display="block"}),p.addEventListener("click",()=>{const o=document.querySelector(".start-time"),c=document.querySelector(".end-time");c.style.display="none",o.style.display="block"}),S.addEventListener("click",()=>{const o=document.querySelector(".start-time"),c=document.querySelector(".end-time");o.style.display="none",c.style.display="block"}),x.addEventListener("click",()=>{const o=document.querySelector(".start-time"),c=document.querySelector(".end-time");o.style.display="none",c.style.display="block"}),window.addEventListener("click",function(o){const c=()=>{e.style.display="none",i.style.display="none"};(o.target===e||o.target===i)&&c()});function Z(o){const c=o.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일 (\d{1,2}):(\d{2})/);if(!c)throw new Error("입력 형식이 잘못되었습니다.");const[y,f,r,s,K,U]=c,_=`${f}-${String(r).padStart(2,"0")}-${String(s).padStart(2,"0")}`,ee=`${String(K).padStart(2,"0")}:${String(U).padStart(2,"0")}:00`;return`${_} ${ee}`}const we=async function(){const o=document.querySelector(".modal-title").value,c=document.querySelector("#selectedDate").textContent,y=document.querySelector("#selectedTime").textContent,f=document.querySelector("#completeDate").textContent,r=document.querySelector("#completeTime").textContent,s=document.querySelector(".schedule-memo").value,K=Z(`${c} ${y}`),U=Z(`${f} ${r}`);if(!X){X=!0;try{let _=function(){t.style.display="none",e.style.display="none"};if(!(await fetch("http://localhost:8080/api/schedule",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_email:"john.doe@example.com",schedule_title:o,schedule_description:s,schedule_start:K,schedule_end:U})})).ok)throw new Error("Failed to add new schedule");_(),await T(),E(),b(),B()}catch(_){console.error("일정 추가 중 오류 발생:",_)}finally{X=!1}}};l.addEventListener("click",()=>{l.textContent.trim()==="저장"&&we(),e.style.display="none"}),document.body.addEventListener("click",function(o){o.target.closest(".modal-view-box")&&(l.textContent="수정")}),m.addEventListener("click",function(){this.value="",i.style.display=i.style.display=="none"?"block":"none",i.style.display=i.style.top=`${m.getBoundingClientRect().bottom+window.scrollY}px`,i.style.left=`${m.getBoundingClientRect().left+window.scrollX}px`,k()}),v.addEventListener("click",function(){this.value="",i.style.display=i.style.display=="none"?"block":"none",i.style.top=`${v.getBoundingClientRect().bottom+window.scrollY}px`,i.style.left=`${v.getBoundingClientRect().left+window.scrollX}px`,k()}),C.addEventListener("click",function(){this.value="",i.style.display=i.style.display=="none"?"block":"none",i.style.display=i.style.top=`${C.getBoundingClientRect().bottom+window.scrollY}px`,i.style.left=`${C.getBoundingClientRect().left+window.scrollX}px`,k()}),g.addEventListener("click",function(){this.value="",i.style.display=i.style.display=="none"?"block":"none",i.style.top=`${g.getBoundingClientRect().bottom+window.scrollY}px`,i.style.left=`${g.getBoundingClientRect().left+window.scrollX}px`,k()}),k()});
