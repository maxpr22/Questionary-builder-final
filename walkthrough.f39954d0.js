document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{let e=document.querySelectorAll(".question-card"),t=new URLSearchParams(window.location.search).get("test_id");if(!t){console.error("test_id не найден в URL!");return}let r=`quizAnswers_${t}`;function l(){let t={};e.forEach((e,r)=>{let l=e.querySelector(".answers");if(!l)return;let n=l.querySelector("input[type='text']"),o=l.querySelectorAll("input[type='radio']"),c=l.querySelectorAll("input[type='checkbox']");n&&(t[`question-${r}`]=n.value.trim()),o.forEach(e=>{e.checked&&(t[`question-${r}`]=e.value)});let u=[...c].filter(e=>e.checked).map(e=>e.value);u.length>0&&(t[`question-${r}`]=u)}),localStorage.setItem(r,JSON.stringify(t))}e.forEach(e=>{let t=e.querySelector(".answers");if(!t)return;let r=t.querySelector("input[type='text']"),n=t.querySelectorAll("input[type='radio']"),o=t.querySelectorAll("input[type='checkbox']");r&&r.addEventListener("input",l),n.forEach(e=>{e.addEventListener("change",l)}),o.forEach(e=>{e.addEventListener("change",l)})}),function(){let t=JSON.parse(localStorage.getItem(r))||{};e.forEach((e,r)=>{let l=e.querySelector(".answers");if(!l)return;let n=l.querySelector("input[type='text']"),o=l.querySelectorAll("input[type='radio']"),c=l.querySelectorAll("input[type='checkbox']");n&&t[`question-${r}`]&&(n.value=t[`question-${r}`]),o.forEach(e=>{t[`question-${r}`]===e.value&&(e.checked=!0)}),Array.isArray(t[`question-${r}`])&&c.forEach(e=>{t[`question-${r}`].includes(e.value)&&(e.checked=!0)})}),"function"==typeof checkIfAllAnswered?checkIfAllAnswered():console.error("Функция checkForAllAnswers не найдена")}()},1e3)});
//# sourceMappingURL=walkthrough.f39954d0.js.map
