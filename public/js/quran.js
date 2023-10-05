document.addEventListener("DOMContentLoaded", async function () {

    let options = window.options;
    let url = window.location.origin;
    let quranIndex = document.getElementById("quranIndex");
    let quranFetch = await fetch(`${url}/json/quran.json`);
    let quranJson = await quranFetch?.json();

    for (let item of quranJson) {

        let li = document.createElement("li");
        let a = document.createElement("a");
        let name = document.createElement("h2");
        let number = document.createElement("p");
        let div = document.createElement("div");
        let descent = document.createElement("small");
        let english_name = document.createElement("small");

        quranIndex.appendChild(li);
        li.appendChild(a);
        a.href = `/quran/سورة_${item?.name.split(" ").join("_")}`;
        a.appendChild(name);
        name.innerText = item?.name;
        a.appendChild(number);
        number.innerText = item?.number;
        a.appendChild(div);
        div.appendChild(descent);
        descent.innerText = item?.descent;
        descent.className = 'descent';
        div.appendChild(english_name);
        english_name.innerText = item?.english_name;
        english_name.className = 'english_name';
    }
});