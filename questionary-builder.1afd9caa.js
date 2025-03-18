!function(){function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},u={},r=t.parcelRequire94c2;null==r&&((r=function(e){if(e in n)return n[e].exports;if(e in u){var t=u[e];delete u[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){u[e]=t},t.parcelRequire94c2=r),r.register;var i=r("7ZMNl"),a=r("1NkZi");let o=async e=>{let t=`${crypto.randomUUID()}.${e.name.split(".").pop()}`,{error:n}=await (0,i.supabase).storage.from("images").upload(t,e);if(n)throw Error("Помилка завантаження зображення: "+n.message);let{data:u}=(0,i.supabase).storage.from("images").getPublicUrl(t);return u.publicURL},l=async()=>{let t=null;try{let n=document.getElementById("test-title").value.trim(),u=document.getElementById("test-description").value.trim();if(!n||!u)throw Error("Назва і опис тексту не можуть бути пустими!");let r=await Promise.all(Array.from(document.querySelectorAll(".question")).map(async e=>{let t=e.id,n=e.querySelector('input[name="question"]').value.trim(),u=e.querySelector("select").value;if(!n)throw Error("Питання не може бути пустим!");let r=e.querySelector('input[type="file"]').files[0],i=r?await o(r,t):null,a=Array.from(e.querySelectorAll(".answer")).map(e=>{let t=e.querySelector('input[name="answer"]'),n=e.querySelector(".correct-answer")?.checked,r=t.value.trim();if(!r)throw Error("Відповідь не може бути пустою!");return{text:r,correct_answer:"text"===u?r:n?"true":"false"}});if("text"===u&&0===a.length){let t=e.querySelector('input[name="text-answer"]');if(!t)throw Error("Відсутнє поле для вводу відповіді!");let n=t.value.trim();if(!n)throw Error("Відповідь на текстове питання не може бути пустою!");a=[{text:n,correct_answer:n}]}return{id:t,title:n,type:u,imageUrl:i,answers:a}})),{data:l,error:s}=await (0,i.supabase).from("tests").insert([{title:n,description:u,count_questions:r.length,completed:0}]).select();if(s)throw Error(s.message);t=l[0].id;let d=r.map(e=>({test_id:t,question:e.title,type:e.type,image_url:e.imageUrl})),{data:c,error:m}=await (0,i.supabase).from("questions").insert(d).select();if(m)throw Error(m.message);let p=c.flatMap((e,t)=>r[t].answers.map(t=>({question_id:e.id,answer:t.text,is_right:t.correct_answer}))),{error:g}=await (0,i.supabase).from("answers").insert(p);if(g)throw Error(g.message);e(a).Notify.success("Успішно додано новий тест!")}catch(n){e(a).Notify.failure(n.message),console.error(n),t&&await (0,i.supabase).from("tests").delete().eq("id",t)}};document.addEventListener("DOMContentLoaded",()=>{document.getElementById("add-question-btn").addEventListener("click",d)});let s=0;function d(){s++;let e=`question-${s}`,t=document.createElement("div");t.classList.add("question"),t.setAttribute("id",e),t.setAttribute("draggable",!0),t.innerHTML=`
          <div class="question-header">
              <span class="drag-handle">\u{2630}</span>
              <label><span class="question-title">\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${s}:</span> 
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
      `,document.getElementById("questions-container").appendChild(t),t.addEventListener("dragstart",p),t.addEventListener("dragover",g),t.addEventListener("drop",f),t.addEventListener("dragleave",w),t.addEventListener("dragend",v)}function c(){document.querySelectorAll(".question .question-title").forEach((e,t)=>{e.innerText=`\u{41F}\u{438}\u{442}\u{430}\u{43D}\u{43D}\u{44F} ${t+1}:`,e.parentElement.parentNode.parentElement.setAttribute("id",`question-${t+1}`)})}let m=null;function p(e){originalPosition=(m=e.target).nextSibling,e.target.classList.add("dragging")}function g(e){e.preventDefault();let t=e.target.closest(".question"),n=document.getElementById("questions-container");if(t&&t!==m&&n.contains(t)){let e=Array.from(n.children);e.indexOf(m)>e.indexOf(t)?n.insertBefore(m,t):n.insertBefore(m,t.nextSibling)}}function f(e){e.preventDefault(),m.classList.remove("dragging")}function w(e){e.target.closest(".question")?.classList.remove("drag-over")}function v(){let e=document.getElementById("questions-container");e.contains(m)||(originalPosition?originalPosition.parentNode.insertBefore(m,originalPosition):e.appendChild(m)),m.classList.remove("dragging"),m=null,c()}document.getElementById("add-test-btn").addEventListener("click",async e=>{e.target.setAttribute("disabled",!0),await l(),setTimeout(()=>{window.location.replace("/")},1e3)}),window.removeImage=function(e){document.getElementById(`${e}-image-preview`).innerHTML="",document.getElementById("question-1-image-preview").previousElementSibling.value=null},window.addAnswer=function(e){let t=document.getElementById(`${e}-answers`),n=document.querySelector(`#${e} select`).value;if("text"===n){if(0===t.children.length){let e=document.createElement("input");e.type="text",e.name="text-answer",e.placeholder="Правильна відповідь",t.appendChild(e)}return}let u=document.createElement("div");u.classList.add("answer"),u.innerHTML=`
            <label>
                <input type="text" name="answer" class="answer-input" placeholder="\u{412}\u{430}\u{440}\u{456}\u{430}\u{43D}\u{442}">
                <input type="${"single"===n?"radio":"checkbox"}" class="correct-answer" name="correct-${e}"> <span>\u{41F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{43E}\u{432}\u{456}\u{434}\u{44C}</span>
            </label>
            <button class = "remove-question" onclick="this.parentElement.remove()">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
        `,t.appendChild(u)},window.updateAnswerType=function(e,t){document.getElementById(`${e}-answers`).innerHTML=""},window.removeElement=function(e){let t=document.getElementById(e);t&&(t.remove(),s--,c())},window.previewImage=function(e,t){let n=e.target.files[0];if(n){let e=new FileReader;e.onload=function(e){document.getElementById(`${t}-image-preview`).innerHTML=`
            <div class="image-wrapper">
              <img src="${e.target.result}" alt="\u{417}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{43D}\u{44F}">
              <button class="delete-image" onclick="removeImage('${t}')">\xd7</button>
            </div>
          `},e.readAsDataURL(n)}},d()}();
//# sourceMappingURL=questionary-builder.1afd9caa.js.map
