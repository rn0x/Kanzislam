export const tafsirSurahIndex = async (options) => {
    const loading = document.getElementById("loading");
    const surah_index = document.getElementById("surah_index");
    const tafsir_index = document.getElementById("tafsir_index");

    loading.style.display = "block";
    tafsir_index.style.display = "none";
    const surahBox = document.getElementById("surahBox");
    const Quran = await dataQuran();
    const quranJson = Quran.quranJson;

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
        name.title = item?.name;
        name.ariaLabel = item?.name;
        a.appendChild(number);
        number.innerText = item?.number;
        number.title = item?.number;
        number.ariaLabel = item?.number;
        a.appendChild(div);
        div.appendChild(descent);
        descent.innerText = item?.descent;
        descent.title = item?.descent;
        descent.ariaLabel = item?.descent;
        descent.className = 'descent';
        div.appendChild(english_name);
        english_name.innerText = item?.english_name;
        english_name.title = item?.english_name;
        english_name.ariaLabel = item?.english_name;
        english_name.className = 'english_name';
    }

    loading.style.display = "none";
}

async function dataQuran() {
    const quranURL = `${window.location.origin}/data-quran`;
    const quranFetch = await fetch(quranURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!quranFetch.ok) {
        console.log(`HTTP error! Status: ${quranFetch.status}`);
        return false
    }

    const response = await quranFetch?.json();
    return response
}