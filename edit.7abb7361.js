!function(){function e(e,u,t,n){Object.defineProperty(e,u,{get:t,set:n,enumerable:!0,configurable:!0})}function u(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},a={},i=t.parcelRequired7c6;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in a){var u=a[e];delete a[e];var t={id:e,exports:{}};return n[e]=t,u.call(t.exports,t,t.exports),t.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,u){a[e]=u},t.parcelRequired7c6=i);var r=i.register;r("gVbgG",function(u,t){e(u.exports,"loadAnswersToQuestions",function(){return a});var n=i("7ZMNl");let a=async e=>{let{data:u,error:t}=await (0,n.supabase).from("answers").select("question_id,answer, id, is_right").eq("question_id",e);if(t)throw Error(t.message);return u}}),r("9oxol",function(u,t){e(u.exports,"loadQuestionsToTest",function(){return a});var n=i("7ZMNl");let a=async e=>{let{data:u,error:t}=await (0,n.supabase).from("questions").select("*").eq("test_id",e);if(t)throw Error(t.message);return u}});var s=i("7ZMNl");let o=async e=>{try{let{data:u,error:t}=await (0,s.supabase).from("tests").select("*").eq("id",e);if(t)throw Error(t.message);return u[0]}catch(e){return e}};var l=i("gVbgG"),d=i("9oxol"),s=i("7ZMNl"),c=i("1NkZi");async function p(e){let u=document.getElementById(e);if(!u){console.warn(`\u{415}\u{43B}\u{435}\u{43C}\u{435}\u{43D}\u{442} ${e} \u{43D}\u{435} \u{437}\u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{43E}`);return}let t=parseInt(u.dataset.id,10);try{let{data:n,error:a}=await (0,s.supabase).from("answers").select("id").eq("question_id",t);if(a)throw a;let i=n.map(e=>e.id);i.length>0&&(await (0,s.supabase).from("question_answers").delete().in("answer_id",i),await (0,s.supabase).from("answers").delete().in("id",i)),await (0,s.supabase).from("questions").delete().eq("id",t),u.remove(),console.log(`\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${e} \u{443}\u{441}\u{43F}\u{456}\u{448}\u{43D}\u{43E} \u{432}\u{438}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{43E}`)}catch(e){console.error("Помилка видалення:",e)}updateQuestionNumbers()}async function m(e){let t=document.getElementById("test-title").value,n=document.getElementById("test-description").value,a=document.querySelectorAll(".question"),{error:i}=await (0,s.supabase).from("tests").update({title:t,description:n,count_questions:a.length}).eq("id",e);if(i){console.error("Помилка оновлення тесту:",i),u(c).Notify.failure("Не вдалося оновити тест!");return}let{data:r,error:o}=await (0,s.supabase).from("questions").select("id").eq("test_id",e);if(o){console.error("Помилка отримання питань:",o);return}let l=Array.from(a).map(e=>e.dataset.id?parseInt(e.dataset.id,10):null).filter(e=>null!==e),d=r.map(e=>e.id).filter(e=>!l.includes(e));for(let[u,t]of(d.length>0&&(await (0,s.supabase).from("question_answers").delete().in("question_id",d),await (0,s.supabase).from("answers").delete().in("question_id",d),await (0,s.supabase).from("questions").delete().in("id",d)),a.entries())){let n=t.dataset.id?parseInt(t.dataset.id,10):null,a=t.querySelector("#question-title").value,i=t.querySelector("#question-type").value,r=t.querySelector(".image-preview img")?.src||null;if(console.log(`\u{41E}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{43D}\u{44F} \u{43F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ID ${n} \u{437} \u{43F}\u{43E}\u{440}\u{44F}\u{434}\u{43A}\u{43E}\u{43C} ${u}`),n)await (0,s.supabase).from("questions").update({question:a,type:i,image_url:r,order:u}).eq("id",n);else{let{data:o,error:l}=await (0,s.supabase).from("questions").insert([{question:a,type:i,test_id:e,image_url:r,order:u}]).select().single();if(l){console.error("Помилка створення питання:",l);continue}n=o.id,t.dataset.id=n}for(let e of t.querySelectorAll(".answer")){let u=e.querySelector(".answer-input").value,t=e.querySelector(".correct-answer").checked?"true":"false",{data:a,error:i}=await (0,s.supabase).from("answers").select("*").eq("question_id",n).eq("answer",u).single();i||!a?await (0,s.supabase).from("answers").insert([{question_id:n,answer:u,is_right:t}]):await (0,s.supabase).from("answers").update({answer:u,is_right:t}).eq("id",a.id)}}let{data:p,error:m}=await (0,s.supabase).from("questions").select("id, question, order").eq("test_id",e).order("order",{ascending:!0});m?console.error("Помилка перевірки порядку:",m):console.log("Перевірка порядку питань після збереження:",p),u(c).Notify.success("Тест успішно оновлено!")}let g=null,w=null;function v(){document.querySelectorAll(".question").forEach((e,u)=>{let t=`question-${u+1}`;e.setAttribute("id",t),e.querySelector(".question-title").innerText=`\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${u+1}:`,e.querySelector("select").setAttribute("onchange",`updateAnswerType('${t}', this)`),e.querySelector(".answers").setAttribute("id",`${t}-answers`),e.querySelector(".add-answer").setAttribute("onclick",`addAnswer('${t}')`),e.querySelector('button[onclick^="removeElement"]').setAttribute("onclick",`removeElement('${t}')`),e.querySelectorAll(".correct-answer").forEach(e=>{e.name=`correct-${t}`})})}function f(e){w=(g=e.target).nextSibling,e.target.classList.add("dragging")}function q(e){e.preventDefault();let u=e.target.closest(".question"),t=document.getElementById("questions-container");if(u&&u!==g&&t.contains(u)){let e=Array.from(t.children);e.indexOf(g)>e.indexOf(u)?t.insertBefore(g,u):t.insertBefore(g,u.nextSibling)}}function b(e){e.preventDefault(),g.classList.remove("dragging")}function y(e){e.target.closest(".question")?.classList.remove("drag-over")}function E(){let e=document.getElementById("questions-container");e.contains(g)||(w?w.parentNode.insertBefore(g,w):e.appendChild(g)),g.classList.remove("dragging"),g=null,v(),document.querySelectorAll(".question").forEach((e,u)=>{let t=`question-${u+1}`;e.setAttribute("data-question-id",t);let n=e.querySelector(".image-wrapper");n&&(n.id=`${t}-image-preview`);let a=e.querySelector(".delete-image");a&&a.setAttribute("onclick",`removeImage('${t}')`)})}window.removeImage=function(e){let u=document.getElementById(e),t=u.querySelector('input[type="file"]');t&&(t.value=null);let n=u.querySelector(".image-preview");n&&(n.innerHTML="")},window.addAnswer=function(e){let u=document.getElementById(`${e}-answers`),t=document.getElementById(e);if(!t)return;let n=t.querySelector("select").value;if("text"===n){if(0===u.children.length){let e=document.createElement("input");e.type="text",e.name="text-answer",e.placeholder="Правильна відповідь",u.appendChild(e)}return}let a=document.createElement("div");a.classList.add("answer"),a.innerHTML=`
      <label>
          <input type="text" name="answer" class="answer-input" placeholder="\u{412}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}">
          <input type="${"single"===n?"radio":"checkbox"}" class="correct-answer" name="correct-${e}">
          <span>\u{41F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</span>
      </label>
      <button class="remove-question" onclick="this.parentElement.remove()">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
  `,u.appendChild(a)},window.updateAnswerType=function(e,u){document.getElementById(`${e}-answers`).innerHTML=""},window.previewImage=function(e,u){let t=e.target.files[0];if(t){let e=new FileReader;e.onload=function(e){document.getElementById(`${u}-image-preview`).innerHTML=`
            <div class="image-wrapper">
              <img src="${e.target.result}" alt="\u{417}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{43D}\u{44F}">
              <button class="delete-image" onclick="removeImage('${u}')">\xd7</button>
            </div>
          `},e.readAsDataURL(t)}},window.updateQuestionNumbers=v,window.dragEnd=E,window.dragLeave=y,window.dragOver=q,window.dragStart=f,window.drop=b,(async()=>{let e=new URLSearchParams(document.location.search).get("test_id"),u=await o(e);if(!u){document.title="Нічого не знайдено",document.querySelector(".container").innerHTML=`
      <div>
        <a class="rollback" href="/">\u{41F}\u{43E}\u{432}\u{435}\u{440}\u{43D}\u{443}\u{442}\u{438}\u{441}\u{44F} \u{43D}\u{430}\u{437}\u{430}\u{434}</a>
        <h1>\u{41D}\u{430} \u{436}\u{430}\u{43B}\u{44C} \u{442}\u{430}\u{43A}\u{43E}\u{433}\u{43E} \u{442}\u{435}\u{441}\u{442}\u{443} \u{449}\u{435} \u{43D}\u{435} \u{456}\u{441}\u{43D}\u{443}\u{454} \u{1F437}</h1>
      </div>
    `;return}let t=await (0,d.loadQuestionsToTest)(e);t||(document.title="Непередбачена помилка",document.querySelector(".container").innerHTML=`
      <div>
        <a class="rollback" href="/">\u{41F}\u{43E}\u{432}\u{435}\u{440}\u{43D}\u{443}\u{442}\u{438}\u{441}\u{44F} \u{43D}\u{430}\u{437}\u{430}\u{434}</a>
        <h1>\u{414}\u{43E} \u{446}\u{44C}\u{43E}\u{433}\u{43E} \u{442}\u{435}\u{441}\u{442}\u{443} \u{43D}\u{435} \u{431}\u{443}\u{43B}\u{43E} \u{437}\u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{43E} \u{434}\u{430}\u{43D}\u{43D}\u{438}\u{445}, \u{441}\u{43F}\u{440}\u{43E}\u{431}\u{443}\u{439}\u{442}\u{435} \u{43F}\u{456}\u{437}\u{43D}\u{456}\u{448}\u{435} \u{1F437}</h1>
      </div>
    `);let n=await Promise.all(t.map(async e=>await (0,l.loadAnswersToQuestions)(e.id))),a=t.length;window.removeElement=await p,window.removeImage=function(e){let u=document.getElementById(e);console.log(e);let t=u.querySelector('input[type="file"]');t&&(t.value=null);let n=u.querySelector(".image-preview");n&&(n.innerHTML="")},(async()=>{document.title=`\u{420}\u{435}\u{434}\u{430}\u{433}\u{443}\u{432}\u{430}\u{43D}\u{43D}\u{44F} - ${u.title}`,document.querySelector(".container").innerHTML=`
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
  `,t.map((e,u)=>{console.log(e.type);let t=document.createElement("div"),a=`question-${u+1}`;t.classList.add("question"),t.dataset.id=e.id,t.setAttribute("id",`${a}`),t.setAttribute("draggable",!0),t.innerHTML=`
      <div class="question-header">
              <span class="drag-handle">\u{2630}</span>
              <label><span class="question-title">\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${u+1}:</span> 
                  <input type="text" id="question-title" name="question" value="${e.question}" placeholder="\u{412}\u{432}\u{435}\u{434}\u{456}\u{442}\u{44C} \u{43F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F}">
              </label>
              <label>\u{422}\u{438}\u{43F}: 
                  <select id="question-type" onchange="updateAnswerType('${a}', this)">
                      <option value="text" ${"text"===e.type?"selected":""}>\u{422}\u{435}\u{43A}\u{441}\u{442}</option>
                      <option value="single" ${"single"===e.type?"selected":""}>\u{41E}\u{434}\u{438}\u{43D} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}</option>
                      <option value="multiple" ${"multiple"===e.type?"selected":""}>\u{41A}\u{456}\u{43B}\u{44C}\u{43A}\u{430} \u{432}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}\u{456}\u{432}</option>
                  </select>
              </label>
              <button onclick="removeElement('${a}')">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
          </div>
  
          <div class="image-upload">
              <input type="file" accept="image/*" onchange="previewImage(event, '${a}')">
              <div class="image-preview" id="${a}-image-preview">
                ${e.image_url?`<div class="image-wrapper">
              <img src="${e.image_url}">
              <button class="delete-image" onclick="removeImage('${a}')">\xd7</button>
            </div>`:""}
              </div>
          </div>
  
          <div class="answers" id="${a}-answers"></div>
          <button class="add-answer" onclick="addAnswer('${a}')">\u{414}\u{43E}\u{434}\u{430}\u{442}\u{438} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</button>
    `,document.getElementById("questions-container").appendChild(t),t.addEventListener("dragstart",f),t.addEventListener("dragover",q),t.addEventListener("drop",b),t.addEventListener("dragleave",y),t.addEventListener("dragend",E),n[u].map((u,t)=>{let n=document.getElementById(`${a}-answers`),i=e.type;if(console.log(i),console.log(e),"text"===i){if(console.log("Додаємо текстову відповідь для питання:",a),0===n.children.length){let e=document.createElement("input");e.type="text",e.name="text-answer",e.value=u.answer,e.placeholder="Правильна відповідь",n.appendChild(e)}return}let r=document.createElement("div");r.classList.add("answer"),r.innerHTML=`
            <label>
                <input type="text" value="${u.answer}" name="answer" class="answer-input" placeholder="\u{412}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}">
                <input type="${"single"===i?"radio":"checkbox"}" class="correct-answer" name="correct" ${"true"===u.is_right?"checked":""}> <span>\u{41F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</span>
            </label>
            <button class="remove-question" onclick="this.parentElement.remove()">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
        `,n.appendChild(r)})})})(),document.getElementById("add-question-btn").addEventListener("click",()=>{(function(){a++;let e=`question-${a}`,u=document.createElement("div");u.classList.add("question"),u.setAttribute("id",e),u.setAttribute("draggable",!0),u.innerHTML=`
            <div class="question-header">
                <span class="drag-handle">\u{2630}</span>
                <label><span class="question-title">\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${a}:</span> 
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
        `,document.getElementById("questions-container").appendChild(u),u.addEventListener("dragstart",f),u.addEventListener("dragover",q),u.addEventListener("drop",b),u.addEventListener("dragleave",y),u.addEventListener("dragend",E)})(),a++,v()}),document.getElementById("add-test-btn").addEventListener("click",async()=>{await m(u.id),setTimeout(()=>{window.location.replace("/")},1e3)})})()}();
//# sourceMappingURL=edit.7abb7361.js.map
