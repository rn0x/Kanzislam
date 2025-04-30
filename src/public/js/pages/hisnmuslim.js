import filterSpan from '/js/modules/filterSpan.js';

const loading = document.getElementById("loading");
const SearchIndex = document.getElementById("SearchIndex");
const hisnmuslimIndex = document.getElementById("hisnmuslimIndex");
loading.style.display = "block";
const url = window.location.origin;
const hisnmuslimJson = await dataHisnMuslam();

export const HisnMuslimIndex = () => {
    for (let item of hisnmuslimJson) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        hisnmuslimIndex.appendChild(li);
        li.appendChild(a);
        a.innerText = item?.category;
        a.title = item?.category;
        a.ariaLabel = item?.category;
        a.href = `${url}/hisnmuslim/${item?.category?.split(" ").join("_")}`

    }
    loading.style.display = "none";

    SearchIndex.addEventListener("keyup", (e) => {
        searchAndDisplayLi("hisnmuslimIndex", SearchIndex.value);
    });
}
export const HisnMuslimList = (options) => {
    const hisnmuslimCategory = document.getElementById("hisnmuslimCategory");
    let currentAudio = null;
    let currentAudioIcon = null;

    for (let item of options?.hisnmuslimFound?.array) {
        let li = document.createElement("li");
        let HusId = document.createElement("small");
        let text = document.createElement("p");
        let Boxicons = document.createElement("div");
        let iconPlay = document.createElement("i");
        let link = document.createElement("a");
        let iconLink = document.createElement("img");
        let iconDownload = document.createElement("i");
        let Huscount = document.createElement("small");
        let audio = document.createElement("audio");
        let isPlay = false;
        let title = removeArabicDiacritics(item?.text, 15);

        hisnmuslimCategory.appendChild(li);
        li.appendChild(HusId);
        HusId.className = "HusId";
        HusId.innerText = item?.id;
        HusId.title = item?.id;
        HusId.ariaLabel = item?.id;
        li.appendChild(text);
        text.innerHTML = filterSpan(item?.text);
        text.title = item?.text;
        text.ariaLabel = item?.text;
        li.appendChild(Boxicons);
        Boxicons.className = "Boxicons";
        Boxicons.appendChild(iconPlay);
        iconPlay.className = "fa-solid fa-play";
        iconPlay.title = "play";
        iconPlay.ariaLabel = "play";
        Boxicons.appendChild(iconDownload);
        iconDownload.className = "fa-solid fa-cloud-arrow-down";
        iconDownload.title = "download";
        iconDownload.ariaLabel = "download";
        Boxicons.appendChild(link);
        link.href = `${url}/hisnmuslims/${title}`;
        link.title = "رابط الذكر في صفحة منفصلة";
        link.ariaLabel = "رابط الذكر في صفحة منفصلة";
        link.appendChild(iconLink);
        iconLink.src = "/icon/link.svg";
        iconLink.alt = "link";
        iconLink.ariaLabel = "link";
        iconLink.title = "link";
        iconLink.className = "iconFilter";
        li.appendChild(Huscount);
        Huscount.className = "Huscount";
        Huscount.innerHTML = `التكرار : <span>${item?.count}</span>`;
        Huscount.ariaLabel = `التكرار ${item?.count}`;
        Huscount.title = `التكرار ${item?.count}`;

        iconDownload.addEventListener("click", async () => {
            iconDownload.className = "fa-solid fa-spinner";
            try {
                const response = await fetch(item.audio, { mode: 'cors' });
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const filename = `${options?.hisnmuslimFound?.category?.split(" ").join("_")}_${title}.mp3`;
                const link = document.createElement('a');
                link.href = url;
                link.download = decodeURIComponent(filename);
                link.click();
                iconDownload.className = "fa-solid fa-cloud-arrow-down";
            } catch (error) {
                iconDownload.title = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
                iconDownload.ariaLabel = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
                console.error("Error:", error);
                iconDownload.src = "/icon/error.svg";
                setTimeout(() => {
                    iconDownload.className = "fa-solid fa-cloud-arrow-down";
                }, 30000);
            }
        });

        iconPlay.addEventListener("click", () => {
            if (currentAudio) { // التحقق من وجود مقطع صوتي حالي وإيقاف تشغيله
                currentAudio.pause();
                currentAudioIcon.className = "fa-solid fa-play";
            }

            if (currentAudio !== audio || !isPlay) {
                audio.src = item.audio;
                audio.play();
                iconPlay.className = "fa-solid fa-pause";
                isPlay = true;
                currentAudio = audio;
                currentAudioIcon = iconPlay;
            }
            else {
                currentAudio.pause();
                iconPlay.className = "fa-solid fa-play";
                isPlay = false;
                currentAudio = null;
            }
        });

        audio.addEventListener("ended", () => {
            currentAudio = null;
            currentAudioIcon.className = "fa-solid fa-play";
            isPlay = false;
        });
    }
    loading.style.display = "none";
}
export const HisnMuslimItem = (options) => {
    const textHis = document.getElementById("textHis");
    const hisPlay = document.getElementById("hisPlay");
    const hisDownload = document.getElementById("hisDownload");
    const audio = document.createElement("audio");
    let isPlay = false;
    textHis.innerHTML = filterSpan(options.ObjectHis.text);
    hisDownload.addEventListener("click", async () => {
        hisDownload.className = "fa-solid fa-spinner";
        try {
            const response = await fetch(options.ObjectHis.audio, { mode: 'cors' });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const filename = `${options?.category?.split(" ").join("_")}_${window.location.pathname}.mp3`;
            const link = document.createElement('a');
            link.href = url;
            link.download = decodeURIComponent(filename);
            link.click();
            hisDownload.className = "fa-solid fa-cloud-arrow-down";
        } catch (error) {
            hisDownload.title = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
            hisDownload.ariaLabel = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
            console.error("Error:", error);
            hisDownload.src = "/icon/error.svg";
            setTimeout(() => {
                hisDownload.className = "fa-solid fa-cloud-arrow-down";
            }, 30000);
        }
    });

    hisPlay.addEventListener("click", () => {
        if (!isPlay) {
            audio.src = options.ObjectHis.audio;
            hisPlay.className = "fa-solid fa-spinner";
            audio.play();
            hisPlay.className = "fa-solid fa-pause";
            isPlay = true;
        }
        else {
            audio.pause();
            hisPlay.className = "fa-solid fa-play";
            isPlay = false;
        }
    });

    audio.addEventListener("ended", () => {
        hisPlay.className = "fa-solid fa-play";
        isPlay = false;
    });

    loading.style.display = "none";
}



function searchAndDisplayLi(ulId, searchText) {
    // العثور على عنصر UL بواسطة معرفه
    const ulElement = document.getElementById(ulId);

    // الحصول على قائمة بجميع عناصر LI داخل عنصر UL
    const liElements = ulElement.getElementsByTagName("li");

    // عرض عناصر LI التي تطابق النص المبحوث عنه
    for (let i = 0; i < liElements.length; i++) {
        const liText = liElements[i].textContent;
        if (liText.includes(searchText)) {
            liElements[i].style.display = "block";
        } else {
            liElements[i].style.display = "none";
        }
    }
}

function removeArabicDiacritics(sentence, itemWords) {
    const diacriticsMap = {
        'آ': 'ا', 'أ': 'ا', 'إ': 'ا', 'اً': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا', 'ٵ': 'ا',
        'ٷ': 'ؤ', 'ٹ': 'ت',
    };
    const arabicDiacriticsRegex = /[\u064B-\u065F\u0670\u0610-\u061A]/g;
    const withoutDiacritics = sentence?.replace(arabicDiacriticsRegex, '');
    const words = withoutDiacritics?.split(/\s+/);
    const selectedWords = words?.slice(0, parseInt(itemWords));
    const correctedWords = selectedWords?.map(word =>
        word.replace(/./g, char => diacriticsMap[char] || char)
    );
    const result = correctedWords?.join('_');
    return result?.replace(/[\(\[\﴿]/g, "").replace(/[\)\]\﴾]/g, "").replace(/[\,\،\:\.]/g, "");
}

async function dataHisnMuslam() {
    const hisnmuslimURL = `${window.location.origin}/data-hisnmuslim`;
    const hisnmuslimFetch = await fetch(hisnmuslimURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!hisnmuslimFetch.ok) {
        console.log(`HTTP error! Status: ${hisnmuslimFetch.status}`);
        return false
    }

    const response = await hisnmuslimFetch?.json();
    return response
}