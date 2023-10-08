import manipulateLocalStorage from '../js/manipulateLocalStorage.js';
import filterSpan from '../js/filterSpan.js';

document.addEventListener("DOMContentLoaded", async function () {

    let options = window.options;
    let adhkar_boxPage = document.getElementById("adhkar_boxPage");
    let adhkarBox = document.getElementById("adhkarBox");
    let adhkarsBox = document.getElementById("adhkarsBox");

    if (adhkar_boxPage) {

        let adhkarKey = Object.keys(options?.adhkarJson);
        let adhkarCategory = document.getElementById("adhkarCategory");
        let adhkarRepeat = document.querySelector("#adhkarRepeat > p");
        let GetAdhkarRepeat = manipulateLocalStorage("get", "adhkarRepeat");
        for (let item of adhkarKey) {
            let adhkar = options?.adhkarJson[item];
            let li = document.createElement("li");
            let a = document.createElement("a");
            let icon = document.createElement("img");
            let title = document.createElement("h2");
            adhkarCategory.appendChild(li);
            li.appendChild(a);
            a.href = `/adhkar/${adhkar?.category?.split(" ")?.join("_")}`;
            a.appendChild(icon);
            icon.src = adhkar?.icon;
            icon.alt = adhkar?.category;
            icon.className = "adhkarBoxIcon";
            a.appendChild(title);
            title.innerText = adhkar?.category;
        }
        adhkarRepeat.innerText = GetAdhkarRepeat?.value ? GetAdhkarRepeat?.value : 0
    }

    else if (adhkarBox) {

        for (let item of options?.adhkarJson?.array) {
            let li = document.createElement("li");
            let repetition = document.createElement("div");
            let repetition_p = document.createElement("p");
            let repetition_img = document.createElement("img");
            let adhkar_text = document.createElement("div");
            let adhkar_text_h3 = document.createElement("h3");
            let adhkar_text_p = document.createElement("p");
            let adhkar_text_small = document.createElement("small");
            let adhkar_text_a = document.createElement("a");
            let linkAdhkar = document.createElement("img");
            adhkarBox.appendChild(li);
            li.appendChild(repetition);
            repetition.className = "repetition";
            repetition.appendChild(repetition_p);
            repetition_p.innerText = item?.repetition;
            repetition.appendChild(repetition_img);
            repetition_img.src = "/icon/return.svg";
            repetition_img.alt = "إعداة التكرار";
            li.appendChild(adhkar_text);
            adhkar_text.className = "adhkar_text"
            adhkar_text.appendChild(adhkar_text_h3);
            adhkar_text_h3.innerHTML = filterSpan(item?.adhkar);
            adhkar_text.appendChild(adhkar_text_p);
            adhkar_text_p.innerHTML = filterSpan(item?.description);
            adhkar_text.appendChild(adhkar_text_small);
            adhkar_text_small.innerHTML = filterSpan(item?.source);
            adhkar_text.appendChild(adhkar_text_a);
            adhkar_text_a.href = `/adhkars/${item?.title?.split(" ")?.join("_")}`;
            adhkar_text_a.appendChild(linkAdhkar);
            linkAdhkar.id = "linkAdhkar";
            linkAdhkar.src = "/icon/link.svg";
            linkAdhkar.alt = "رابط الذكر";

            repetition.addEventListener("click", () => {
                if (parseInt(repetition_p.innerText) > 0) {
                    let value = parseInt(repetition_p.innerText) - 1;
                    repetition_p.innerText = value;
                    if (parseInt(repetition_p.innerText) === 0) {
                        repetition.style.backgroundColor = "#fad1d1";
                    }
                    let GetAdhkarRepeat = manipulateLocalStorage("get", "adhkarRepeat").value;
                    if (!GetAdhkarRepeat || isNaN(GetAdhkarRepeat)) {
                        GetAdhkarRepeat = 0;
                    }
                    manipulateLocalStorage("set", "adhkarRepeat", parseInt(GetAdhkarRepeat) + 1);
                }
            });

            repetition_img.addEventListener("click", (event) => {
                event.stopPropagation();
                repetition_p.innerText = item?.repetition;
                repetition.style.backgroundColor = "";
            });

        }
    }

    else if (adhkarsBox) {

        let repetition = document.getElementById("repetition");
        let repetition_img = document.getElementById("repetition_img");
        let repetition_p = document.getElementById("repetition_p");

        repetition.addEventListener("click", () => {

            if (parseInt(repetition_p.textContent) > 0) {
                let value = parseInt(repetition_p.textContent) - 1;
                repetition_p.textContent = value;
                if (parseInt(repetition_p.textContent) === 0) {
                    repetition.style.backgroundColor = "#fad1d1";
                }
                let GetAdhkarRepeat = manipulateLocalStorage("get", "adhkarRepeat").value;
                if (!GetAdhkarRepeat || isNaN(GetAdhkarRepeat)) {
                    GetAdhkarRepeat = 0;
                }
                manipulateLocalStorage("set", "adhkarRepeat", parseInt(GetAdhkarRepeat) + 1);
            }
        });

        repetition_img.addEventListener("click", (event) => {
            event.stopPropagation();
            repetition_p.textContent = options?.AdhkarObject?.repetition;
            repetition.style.backgroundColor = "";
        });
    }
});