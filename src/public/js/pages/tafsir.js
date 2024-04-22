

document.addEventListener("DOMContentLoaded", async function () {
    const loading = document.getElementById("loading");
    const surah_index = document.getElementById("surah_index");
    const tafsirSurahPage = document.getElementById("tafsirSurahPage");

    if (surah_index) {

        loading.style.display = "block";
        const surahBox = document.getElementById("surahBox");
        const quranJson = await dataQuran();

        if (!quranJson) {
            return
        }

        for (let item of quranJson) {

            let li = document.createElement("li");
            let a = document.createElement("a");
            let name = document.createElement("h2");
            let number = document.createElement("p");
            let div = document.createElement("div");
            let descent = document.createElement("small");
            let english_name = document.createElement("small");

            surahBox.appendChild(li);
            li.title = item?.name.split(" ").join("_");
            li.appendChild(a);
            a.href = `/tafsir-quran/${options.tafsir.name_english}/${item?.number}`;
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

        loading.style.display = "none";

    }

    else if (tafsirSurahPage) {
        
    }

    async function dataQuran() {
        const quranURL = `${window.location.origin}/data-quran`;
        const quranFetch = await fetch(quranURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (quranFetch.ok) {
            const response = await quranFetch?.json();
            if (response?.[0]?.name) {
                return response
            } else return false
        } else return false
    }

    async function dataSurah(nameSurah) {
        const quranURL = `${window.location.origin}/data-quran?nameSurah=${nameSurah}`;
        const quranFetch = await fetch(quranURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (quranFetch.ok) {
            const response = await quranFetch?.json();
            if (response?.nameSurah) {
                return response
            } else return false
        } else return false
    }
});