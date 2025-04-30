import filterSpan from '../modules/filterSpan.js';
import { playSurah, pauseAudio } from '../modules/globalAudioPlayer.js';

const loading = document.getElementById("loading");
const quranIndex = document.getElementById("quranIndex");
loading.style.display = "block";
const QuranData = await dataQuran();

export const quranIdex = () => {

    for (const item of QuranData?.quranJson) {

        const li = document.createElement("li");
        const a = document.createElement("a");
        const name = document.createElement("h2");
        const number = document.createElement("p");
        const div = document.createElement("div");
        const descent = document.createElement("small");
        const english_name = document.createElement("small");

        quranIndex.appendChild(li);
        li.appendChild(a);
        a.href = `/quran/سورة_${item?.name.split(" ").join("_")}`;
        a.title = `سورة ${item?.name}`;
        a.ariaLabel = `سورة ${item?.name}`;
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

export const quranItem = (options) => {
    const fontPlus = document.getElementById("Plus");
    const fontMinus = document.getElementById("Minus");
    const readerBoxUl = document.getElementById("readerBoxUl");
    const previousSurah = document.getElementById("previousSurah");
    const nextSurah = document.getElementById("nextSurah");
    const titleInfo = document.getElementById("titleInfo");
    const number_verses_span = document.getElementById("number_verses_span");
    const number_words_span = document.getElementById("number_words_span");
    const number_span = document.getElementById("number_span");
    const number_letters_span = document.getElementById("number_letters_span");
    const descent_span = document.getElementById("descent_span");
    const english_name_span = document.getElementById("english_name_span");
    const bisamla = document.getElementById("bisamla");
    const surah = document.getElementById("surah");
    const DataSurah = dataQuranSurah(QuranData, options.nameSurah);

    if (!DataSurah?.nameSurah) {
        window.location = "/404";
    }
    
    previousSurah.href = `/quran/سورة_${DataSurah?.previousSurah?.name?.split(" ")?.join("_")}`;
    previousSurah.innerText = DataSurah?.previousSurah?.name;
    previousSurah.title = DataSurah?.previousSurah?.name;
    previousSurah.ariaLabel = DataSurah?.previousSurah?.name;
    nextSurah.href = `/quran/سورة_${DataSurah?.nextSurah?.name?.split(" ")?.join("_")}`;
    nextSurah.innerText = DataSurah.nextSurah.name;
    nextSurah.title = DataSurah.nextSurah.name;
    nextSurah.ariaLabel = DataSurah.nextSurah.name;
    titleInfo.innerText = `معلومات حول سورة ${DataSurah?.currentSurah?.name}`;
    number_verses_span.innerText = DataSurah?.currentSurah?.number_verses;
    number_verses_span.title = DataSurah?.currentSurah?.number_verses;
    number_verses_span.ariaLabel = DataSurah?.currentSurah?.number_verses;
    number_words_span.innerText = DataSurah?.currentSurah?.number_words;
    number_words_span.title = DataSurah?.currentSurah?.number_words;
    number_words_span.ariaLabel = DataSurah?.currentSurah?.number_words;
    number_span.innerText = DataSurah?.currentSurah?.number;
    number_span.title = DataSurah?.currentSurah?.number;
    number_span.ariaLabel = DataSurah?.currentSurah?.number;
    number_letters_span.innerText = DataSurah?.currentSurah?.number_letters;
    number_letters_span.title = DataSurah?.currentSurah?.number_letters;
    number_letters_span.ariaLabel = DataSurah?.currentSurah?.number_letters;
    descent_span.innerText = DataSurah?.currentSurah?.descent;
    descent_span.title = DataSurah?.currentSurah?.descent;
    descent_span.ariaLabel = DataSurah?.currentSurah?.descent;
    english_name_span.innerText = DataSurah?.currentSurah?.english_name;
    english_name_span.title = DataSurah?.currentSurah?.english_name;
    english_name_span.ariaLabel = DataSurah?.currentSurah?.english_name;
    bisamla.innerText = DataSurah?.bisamla;
    bisamla.title = DataSurah?.bisamla;
    bisamla.ariaLabel = DataSurah?.bisamla;
    surah.innerHTML = DataSurah?.surah;
    surah.title = DataSurah?.surah;
    surah.ariaLabel = DataSurah?.surah;

    fontPlus.addEventListener("click", () => {
        changeFontSize("bisamla", 2);
        changeFontSize("surah", 2);
    });

    fontMinus.addEventListener("click", () => {
        changeFontSize("bisamla", -2);
        changeFontSize("surah", -2);
    });

    let currentItem = null;
    let currentLi = null;

    for (const item of DataSurah.mp3quranFind) {
        if (!item.link) continue; // Skip items without a link

        const li = document.createElement("li");
        const p = document.createElement("p");
        const small = document.createElement("small");
        const span = document.createElement("span");
        const IconDownload = document.createElement("i");
        
        readerBoxUl.appendChild(li);
        li.appendChild(small);
        small.innerText = item.rewaya;
        small.title = item.rewaya;
        small.ariaLabel = item.rewaya;
        li.appendChild(p);
        p.innerText = item.reader;
        p.title = item.reader;
        p.ariaLabel = item.reader;
        li.appendChild(span);
        span.className = 'timeupdate';
        span.style.display = 'none';
        li.appendChild(IconDownload);
        IconDownload.className = "fa-solid fa-cloud-arrow-down icon_download";

        IconDownload.addEventListener("click", async (event) => {
            event.stopPropagation();
            // IconDownload.className = "fa-solid fa-spinner icon_download";
            const response = await fetch(item.link);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const filename = `سورة_${DataSurah.currentSurah.name.split(" ").join("_")}_القارئ_${item.reader.split(" ").join("_")}_رواية_${item.rewaya.split(" ").join("_")}.mp3`;
            const link = document.createElement('a');
            link.href = url;
            link.download = decodeURIComponent(filename);
            link.click();
            IconDownload.className = "fa-solid fa-cloud-arrow-down icon_download";
        });

        li.addEventListener("click", () => {
            // Reset previous selection
            if (currentLi) {
                currentLi.style.backgroundColor = '';
            }
            
            // If clicking the same item again, pause
            if (currentItem === item) {
                pauseAudio();
                currentLi.style.backgroundColor = '';
                currentItem = null;
                currentLi = null;
            } else {
                // Play the new audio
                playSurah(
                    DataSurah.currentSurah.name,
                    item.reader,
                    item.rewaya,
                    item.link
                );
                li.style.backgroundColor = 'var(--backgroundQuranStart)';
                currentItem = item;
                currentLi = li;
            }
        });
    }

    loading.style.display = "none";
}

function changeFontSize(elementId, increment) {
    const element = document.getElementById(elementId);
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    fontSize += increment;
    element.style.fontSize = fontSize + 'px';
}

function dataQuranSurah(QuranData, nameSurah) {
    const currentQuranIndex = QuranData.quranJson.findIndex(e => e.name === nameSurah);
    const currentSurahIndex = QuranData.surahJson.findIndex(e => e.name === nameSurah);
    const currentSurah = { ...QuranData.quranJson[currentQuranIndex], ...QuranData.surahJson[currentSurahIndex] };

    if (!currentSurah?.name) {
        return false
    }

    const previousSurah = currentQuranIndex === 0 ? { ...QuranData.quranJson[QuranData.quranJson.length - 1], ...QuranData.surahJson[QuranData.surahJson.length - 1] } : { ...QuranData.quranJson[currentQuranIndex - 1], ...QuranData.surahJson[currentSurahIndex.length - 1] };
    const nextSurah = currentQuranIndex === QuranData.quranJson.length - 1 ? { ...QuranData.quranJson[0], ...QuranData.surahJson[0] } : { ...QuranData.quranJson[currentQuranIndex + 1], ...QuranData.surahJson[currentSurah + 1] };
    const mp3quranFind = QuranData.mp3quranJson.map(reader => {
        const surah = reader.audio.find(item => item.name === nameSurah);
        return {
            reader: reader.name,
            rewaya: reader.rewaya,
            link: surah?.link
        };
    });

    return {
        nameSurah,
        bisamla: nameSurah !== 'التوبة' ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ',
        surah: filterSpan(currentSurah.surah.replace(/\(/g, '﴿').replace(/\)/g, '﴾')),
        currentSurah,
        previousSurah,
        nextSurah,
        mp3quranFind
    }
}

async function dataQuran() {
    try {
        const response = await fetch('/data-quran');
        if (!response.ok) {
            throw new Error('Error Fetch data');
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}