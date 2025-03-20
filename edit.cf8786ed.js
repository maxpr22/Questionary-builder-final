import"./edit.446baefd.js";import"./edit.df487508.js";function e(e,u,t,n){Object.defineProperty(e,u,{get:t,set:n,enumerable:!0,configurable:!0})}var u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},i=u.parcelRequired7c6;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in n){var u=n[e];delete n[e];var i={id:e,exports:{}};return t[e]=i,u.call(i.exports,i,i.exports),i.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,u){n[e]=u},u.parcelRequired7c6=i);var r=i.register;r("7ftR3",function(u,t){e(u.exports,"loadAnswersToQuestions",function(){return r});var n=i("nuyhG");let r=async e=>{let{data:u,error:t}=await (0,n.supabase).from("answers").select("question_id,answer, id, is_right").eq("question_id",e);if(t)throw Error(t.message);return u}}),r("e2YgP",function(u,t){e(u.exports,"loadQuestionsToTest",function(){return r});var n=i("nuyhG");let r=async e=>{let{data:u,error:t}=await (0,n.supabase).from("questions").select("*").eq("test_id",e);if(t)throw Error(t.message);return u}});var a=i("nuyhG");let s=async e=>{try{let{data:u,error:t}=await (0,a.supabase).from("tests").select("*").eq("id",e);if(t)throw Error(t.message);return u[0]}catch(e){return e}};var o=i("7ftR3"),l=i("e2YgP"),a=i("nuyhG"),d=i("5a6Bh");async function c(e){let u=document.getElementById("test-title").value,t=document.getElementById("test-description").value,{error:n}=await (0,a.supabase).from("tests").update({title:u,description:t}).eq("id",e);if(n){console.error("Помилка оновлення тесту:",n),alert("Не вдалося оновити тест!");return}let i=document.querySelectorAll(".question"),r=1;for(let u of i){let t=u.dataset.id,n=u.querySelector("#question-title").value,i=u.querySelector("#question-type").value,s=u.querySelector(".image-preview img")?.src||null;if(t){let{error:e}=await (0,a.supabase).from("questions").update({question:n,type:i,image_url:s,order:r}).eq("id",t);if(e){console.error("Помилка оновлення питання:",e);continue}}else{let{data:u,error:t}=await (0,a.supabase).from("questions").insert([{question:n,type:i,test_id:e,image_url:s,order:r}]).select().single();if(t){console.error("Помилка додавання питання:",t);continue}}for(let e of(r++,u.querySelectorAll(".answer"))){let u=e.querySelector(".answer-input").value,n=e.querySelector(".correct-answer").checked?"true":"false",{data:i,error:r}=await (0,a.supabase).from("answers").select("*").eq("question_id",t).eq("answer",u).single();r||!i?await (0,a.supabase).from("answers").insert([{question_id:t,answer:u,is_right:n}]):await (0,a.supabase).from("answers").update({answer:u,is_right:n}).eq("id",i.id)}}let s=i.length,{error:o}=await (0,a.supabase).from("tests").update({count_questions:s}).eq("id",e);o&&console.error("Помилка оновлення count_questions:",o),(d&&d.__esModule?d.default:d).Notify.success("Тест успішно оновлено")}let p=null,m=null;function g(){document.querySelectorAll(".question").forEach((e,u)=>{let t=`question-${u+1}`;e.setAttribute("id",t),e.querySelector(".question-title").innerText=`\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${u+1}:`,e.querySelector("select").setAttribute("onchange",`updateAnswerType('${t}', this)`),e.querySelector(".answers").setAttribute("id",`${t}-answers`),e.querySelector(".add-answer").setAttribute("onclick",`addAnswer('${t}')`),e.querySelector('button[onclick^="removeElement"]').setAttribute("onclick",`removeElement('${t}')`),e.querySelectorAll(".correct-answer").forEach(e=>{e.name=`correct-${t}`})})}function v(e){m=(p=e.target).nextSibling,e.target.classList.add("dragging")}function w(e){e.preventDefault();let u=e.target.closest(".question"),t=document.getElementById("questions-container");if(u&&u!==p&&t.contains(u)){let e=Array.from(t.children);e.indexOf(p)>e.indexOf(u)?t.insertBefore(p,u):t.insertBefore(p,u.nextSibling)}}function f(e){e.preventDefault(),p.classList.remove("dragging")}function y(e){e.target.closest(".question")?.classList.remove("drag-over")}function q(){let e=document.getElementById("questions-container");e.contains(p)||(m?m.parentNode.insertBefore(p,m):e.appendChild(p)),p.classList.remove("dragging"),p=null,g(),document.querySelectorAll(".question").forEach((e,u)=>{let t=`question-${u+1}`;e.setAttribute("data-question-id",t);let n=e.querySelector(".image-wrapper");n&&(n.id=`${t}-image-preview`);let i=e.querySelector(".delete-image");i&&i.setAttribute("onclick",`removeImage('${t}')`)})}window.removeImage=function(e){let u=document.getElementById(e),t=u.querySelector('input[type="file"]');t&&(t.value=null);let n=u.querySelector(".image-preview");n&&(n.innerHTML="")},window.addAnswer=function(e){let u=document.getElementById(`${e}-answers`),t=document.getElementById(e);if(!t)return;let n=t.querySelector("select").value;if("text"===n){if(0===u.children.length){let e=document.createElement("input");e.type="text",e.name="text-answer",e.placeholder="Правильна відповідь",u.appendChild(e)}return}let i=document.createElement("div");i.classList.add("answer"),i.innerHTML=`
      <label>
          <input type="text" name="answer" class="answer-input" placeholder="\u{412}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}">
          <input type="${"single"===n?"radio":"checkbox"}" class="correct-answer" name="correct-${e}">
          <span>\u{41F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</span>
      </label>
      <button class="remove-question" onclick="this.parentElement.remove()">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
  `,u.appendChild(i)},window.updateAnswerType=function(e,u){document.getElementById(`${e}-answers`).innerHTML=""},window.previewImage=function(e,u){let t=e.target.files[0];if(t){let e=new FileReader;e.onload=function(e){document.getElementById(`${u}-image-preview`).innerHTML=`
            <div class="image-wrapper">
              <img src="${e.target.result}" alt="\u{417}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{43D}\u{44F}">
              <button class="delete-image" onclick="removeImage('${u}')">\xd7</button>
            </div>
          `},e.readAsDataURL(t)}},window.updateQuestionNumbers=g,window.dragEnd=q,window.dragLeave=y,window.dragOver=w,window.dragStart=v,window.drop=f,(async()=>{let e=new URLSearchParams(document.location.search).get("test_id"),u=await s(e);if(!u){document.title="Нічого не знайдено",document.querySelector(".container").innerHTML=`
      <div>
        <a class="rollback" href="/">\u{41F}\u{43E}\u{432}\u{435}\u{440}\u{43D}\u{443}\u{442}\u{438}\u{441}\u{44F} \u{43D}\u{430}\u{437}\u{430}\u{434}</a>
        <h1>\u{41D}\u{430} \u{436}\u{430}\u{43B}\u{44C} \u{442}\u{430}\u{43A}\u{43E}\u{433}\u{43E} \u{442}\u{435}\u{441}\u{442}\u{443} \u{449}\u{435} \u{43D}\u{435} \u{456}\u{441}\u{43D}\u{443}\u{454} \u{1F437}</h1>
      </div>
    `;return}let t=await (0,l.loadQuestionsToTest)(e);t||(document.title="Непередбачена помилка",document.querySelector(".container").innerHTML=`
      <div>
        <a class="rollback" href="/">\u{41F}\u{43E}\u{432}\u{435}\u{440}\u{43D}\u{443}\u{442}\u{438}\u{441}\u{44F} \u{43D}\u{430}\u{437}\u{430}\u{434}</a>
        <h1>\u{414}\u{43E} \u{446}\u{44C}\u{43E}\u{433}\u{43E} \u{442}\u{435}\u{441}\u{442}\u{443} \u{43D}\u{435} \u{431}\u{443}\u{43B}\u{43E} \u{437}\u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{43E} \u{434}\u{430}\u{43D}\u{43D}\u{438}\u{445}, \u{441}\u{43F}\u{440}\u{43E}\u{431}\u{443}\u{439}\u{442}\u{435} \u{43F}\u{456}\u{437}\u{43D}\u{456}\u{448}\u{435} \u{1F437}</h1>
      </div>
    `);let n=await Promise.all(t.map(async e=>await (0,o.loadAnswersToQuestions)(e.id))),i=t.length;window.removeElement=function(e){let u=document.getElementById(e);u&&(u.remove(),i--,g())},window.removeImage=function(e){let u=document.getElementById(e);console.log(e);let t=u.querySelector('input[type="file"]');t&&(t.value=null);let n=u.querySelector(".image-preview");n&&(n.innerHTML="")},(async()=>{document.title=`\u{420}\u{435}\u{434}\u{430}\u{433}\u{443}\u{432}\u{430}\u{43D}\u{43D}\u{44F} - ${u.title}`,document.querySelector(".container").innerHTML=`
      <a class="rollback" href="/">\u{41D}\u{430} \u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43D}\u{443}</a>
      <div class="quiz-container">
        <h2>\u{420}\u{435}\u{434}\u{430}\u{433}\u{443}\u{432}\u{430}\u{442}\u{438} \u{442}\u{435}\u{441}\u{442} - ${u.title}</h2>
        <div class="test-content">
          <label
            >\u{41D}\u{430}\u{437}\u{432}\u{430} \u{442}\u{435}\u{441}\u{442}\u{443}:
            <input
              required
              type="text"
              id="test-title"
              placeholder="\u{412}\u{432}\u{435}\u{434}\u{456}\u{442}\u{44C} \u{43D}\u{430}\u{437}\u{432}\u{443} \u{442}\u{435}\u{441}\u{442}\u{443}"
              value="${u.title}"
            />
          </label>
          <label
            >\u{41E}\u{43F}\u{438}\u{441} \u{442}\u{435}\u{441}\u{442}\u{443}:
            <textarea
              id="test-description"
              placeholder="\u{412}\u{432}\u{435}\u{434}\u{456}\u{442}\u{44C} \u{43E}\u{43F}\u{438}\u{441} \u{442}\u{435}\u{441}\u{442}\u{443}"
            >${u.description}</textarea>
          </label>
        </div>
        <div id="questions-container"></div>
        <div id="button-wrapper">
          <button class="add-question" id="add-question-btn">
            \u{414}\u{43E}\u{434}\u{430}\u{442}\u{438} \u{43F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F}
          </button>
          <button class="make-test" id="add-test-btn">\u{41E}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{438} \u{442}\u{435}\u{441}\u{442}</button>
        </div>
      </div>
  `,t.map((e,u)=>{let t=document.createElement("div"),i=`question-${u+1}`;t.classList.add("question"),t.dataset.id=e.id,t.setAttribute("id",`${i}`),t.setAttribute("draggable",!0),t.innerHTML=`
      <div class="question-header">
              <span class="drag-handle">\u{2630}</span>
              <label><span class="question-title">\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${u+1}:</span> 
                  <input type="text" id="question-title" name="question" value="${e.question}" placeholder="\u{412}\u{432}\u{435}\u{434}\u{456}\u{442}\u{44C} \u{43F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F}">
              </label>
              <label>\u{422}\u{438}\u{43F}: 
                  <select id="question-type" onchange="updateAnswerType('${i}', this)">
                      <option value="text" ${"text"===e.type?"selected":""}>\u{422}\u{435}\u{43A}\u{441}\u{442}</option>
                      <option value="single" ${"single"===e.type?"selected":""}>\u{41E}\u{434}\u{438}\u{43D} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}</option>
                      <option value="multiple" ${"multiple"===e.type?"selected":""}>\u{41A}\u{456}\u{43B}\u{44C}\u{43A}\u{430} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}\u{456}\u{432}</option>
                  </select>
              </label>
              <button onclick="removeElement('${i}')">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
          </div>
  
          <div class="image-upload">
              <input type="file" accept="image/*" onchange="previewImage(event, '${i}')">
              <div class="image-preview" id="${i}-image-preview">
                ${e.image_url?`<div class="image-wrapper">
              <img src="${e.image_url}">
              <button class="delete-image" onclick="removeImage('${i}')">\xd7</button>
            </div>`:""}
              </div>
          </div>
  
          <div class="answers" id="${i}-answers"></div>
          <button class="add-answer" onclick="addAnswer('${i}')">\u{414}\u{43E}\u{434}\u{430}\u{442}\u{438} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</button>
    `,document.getElementById("questions-container").appendChild(t),t.addEventListener("dragstart",v),t.addEventListener("dragover",w),t.addEventListener("drop",f),t.addEventListener("dragleave",y),t.addEventListener("dragend",q),n[u].map((e,u)=>{let t=document.getElementById(`${i}-answers`),n=document.querySelector(`#${i} select`).value;if("text"===n){if(0===t.children.length){let u=document.createElement("input");u.type="text",u.name="text-answer",u.value=e.answer,u.placeholder="Правильна відповідь",t.appendChild(u)}return}let r=document.createElement("div");r.classList.add("answer"),r.innerHTML=`
            <label>
                <input type="text" value="${e.answer}" name="answer" class="answer-input" placeholder="\u{412}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}">
                <input type="${"single"===n?"radio":"checkbox"}" class="correct-answer" name="correct" ${"true"===e.is_right?"checked":""}> <span>\u{41F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</span>
            </label>
            <button class="remove-question" onclick="this.parentElement.remove()">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
        `,t.appendChild(r)})})})(),document.getElementById("add-question-btn").addEventListener("click",()=>{(function(){i++;let e=`question-${i}`,u=document.createElement("div");u.classList.add("question"),u.setAttribute("id",e),u.setAttribute("draggable",!0),u.innerHTML=`
            <div class="question-header">
                <span class="drag-handle">\u{2630}</span>
                <label><span class="question-title">\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${i}:</span> 
                    <input type="text" id="question-title" name="question" placeholder="\u{412}\u{432}\u{435}\u{434}\u{456}\u{442}\u{44C} \u{43F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F}">
                </label>
                <label>\u{422}\u{438}\u{43F}: 
                    <select id="question-type" onchange="updateAnswerType('${e}', this)">
                        <option value="text">\u{422}\u{435}\u{43A}\u{441}\u{442}</option>
                        <option value="single">\u{41E}\u{434}\u{438}\u{43D} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}</option>
                        <option value="multiple">\u{41A}\u{456}\u{43B}\u{44C}\u{43A}\u{430} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}\u{456}\u{432}</option>
                    </select>
                </label>
                <button onclick="removeElement('${e}')">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
            </div>
    
            <div class="image-upload">
                <input type="file" accept="image/*" onchange="previewImage(event, '${e}')">
                <div class="image-preview" id="${e}-image-preview"></div>
            </div>
    
            <div class="answers" id="${e}-answers"></div>
            <button class="add-answer" onclick="addAnswer('${e}')">\u{414}\u{43E}\u{434}\u{430}\u{442}\u{438} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</button> 
        `,document.getElementById("questions-container").appendChild(u),u.addEventListener("dragstart",v),u.addEventListener("dragover",w),u.addEventListener("drop",f),u.addEventListener("dragleave",y),u.addEventListener("dragend",q)})(),i++,g()}),document.getElementById("add-test-btn").addEventListener("click",async()=>{await c(u.id),setTimeout(()=>{window.location.replace("/")},1e3)})})();
//# sourceMappingURL=edit.cf8786ed.js.map
