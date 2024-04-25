import filterSpan from '../js/modules/filterSpan.js';

document.addEventListener("DOMContentLoaded", async function () {

    const loading = document.getElementById("loading");
    const SearchIndex = document.getElementById("SearchIndex");
    const hisnmuslimIndex = document.getElementById("hisnmuslimIndex");
    loading.style.display = "block";
    const url = window.location.origin;
    const hisnmuslimFetch = await fetch(`${url}/json/hisnmuslim.json`);
    const hisnmuslimJson = await hisnmuslimFetch?.json();

    if (options?.isIndex) {

        for (let item of hisnmuslimJson) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            hisnmuslimIndex.appendChild(li);
            li.appendChild(a);
            a.innerText = item?.category;
            a.href = `${url}/hisnmuslim/${item?.category?.split(" ").join("_")}`

        }
        loading.style.display = "none";

        SearchIndex.addEventListener("keyup", (e) => {
            searchAndDisplayLi("hisnmuslimIndex", SearchIndex.value);
        });
    }

    else if (options?.isAdhkarHisnMuslim) {
        const hisnmuslimCategory = document.getElementById("hisnmuslimCategory");
        let currentAudio = null;
        let currentAudioIcon = null;

        for (let item of options?.hisnmuslimFound?.array) {
            let li = document.createElement("li");
            let HusId = document.createElement("small");
            let text = document.createElement("p");
            let Boxicons = document.createElement("div");
            let iconPlay = document.createElement("img");
            let link = document.createElement("a");
            let iconLink = document.createElement("img");
            let iconDownload = document.createElement("img");
            let Huscount = document.createElement("small");
            let audio = document.createElement("audio");
            let isPlay = false;
            let title = removeArabicDiacritics(item?.text, 15);

            hisnmuslimCategory.appendChild(li);
            li.appendChild(HusId);
            HusId.className = "HusId";
            HusId.innerText = item?.id;
            li.appendChild(text);
            text.innerHTML = filterSpan(item?.text);
            li.appendChild(Boxicons);
            Boxicons.className = "Boxicons";
            Boxicons.appendChild(iconPlay);
            iconPlay.src = "/icon/play.svg";
            iconPlay.alt = "play";
            iconPlay.className = "iconFilter";
            Boxicons.appendChild(iconDownload);
            iconDownload.src = "/icon/download.svg";
            iconDownload.alt = "download";
            iconDownload.className = "iconFilter";
            Boxicons.appendChild(link);
            link.href = `${url}/hisnmuslims/${title}`;
            link.title = "رابط الذكر في صفحة منفصلة";
            link.appendChild(iconLink);
            iconLink.src = "/icon/link.svg";
            iconLink.alt = "link";
            iconLink.className = "iconFilter";
            li.appendChild(Huscount);
            Huscount.className = "Huscount";
            Huscount.innerHTML = `التكرار : <span>${item?.count}</span>`;

            iconDownload.addEventListener("click", async () => {
                iconDownload.src = "/icon/loading.svg";
                try {
                    const response = await fetch(item.audio, { mode: 'cors' });
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const filename = `${options?.hisnmuslimFound?.category?.split(" ").join("_")}_${title}.mp3`;
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
                    iconDownload.src = "/icon/download.svg";
                } catch (error) {
                    iconDownload.title = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
                    console.error("Error:", error);
                    iconDownload.src = "/icon/error.svg";
                    setTimeout(() => {
                        iconDownload.src = "/icon/download.svg";
                    }, 30000);
                }
            });

            iconPlay.addEventListener("click", () => {
                if (currentAudio) { // التحقق من وجود مقطع صوتي حالي وإيقاف تشغيله
                    currentAudio.pause();
                    currentAudioIcon.src = "/icon/play.svg";
                }

                if (currentAudio !== audio || !isPlay) {
                    audio.src = item.audio;
                    audio.play();
                    iconPlay.src = "/icon/pause.svg";
                    isPlay = true;
                    currentAudio = audio;
                    currentAudioIcon = iconPlay;
                }
                else {
                    currentAudio.pause();
                    iconPlay.src = "/icon/play.svg";
                    isPlay = false;
                    currentAudio = null;
                }
            });

            audio.addEventListener("ended", () => {
                currentAudio = null;
                currentAudioIcon.src = "/icon/play.svg";
                isPlay = false;
            });
        }
        loading.style.display = "none";
    }

    else if (options?.isHisText) {

        const textHis = document.getElementById("textHis");
        const hisPlay = document.getElementById("hisPlay");
        const hisDownload = document.getElementById("hisDownload");
        const audio = document.createElement("audio");
        let isPlay = false;
        textHis.innerHTML = filterSpan(options.ObjectHis.text);
        hisDownload.addEventListener("click", async () => {
            hisDownload.src = "/icon/loading.svg";
            try {
                const response = await fetch(options.ObjectHis.audio, { mode: 'cors' });
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const filename = `${options?.category?.split(" ").join("_")}_${window.location.pathname}.mp3`;
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                hisDownload.src = "/icon/download.svg";
            } catch (error) {
                hisDownload.title = "حدث خطأ, لايمكن تحميل الملف الصوتي ❌"
                console.error("Error:", error);
                hisDownload.src = "/icon/error.svg";
                setTimeout(() => {
                    hisDownload.src = "/icon/download.svg";
                }, 30000);
            }
        });

        hisPlay.addEventListener("click", () => {
            if (!isPlay) {
                audio.src = options.ObjectHis.audio;
                hisPlay.src = "/icon/loading.svg";
                audio.play();
                hisPlay.src = "/icon/pause.svg";
                isPlay = true;
            }
            else {
                audio.pause();
                hisPlay.src = "/icon/play.svg";
                isPlay = false;
            }
        });

        audio.addEventListener("ended", () => {
            hisPlay.src = "/icon/play.svg";
            isPlay = false;
        });

        loading.style.display = "none";
    }



    // ========| FUNCTION |========

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
            'آ': 'ا',
            'أ': 'ا',
            'إ': 'ا',
            'اً': 'ا',
            'ٱ': 'ا',
            'ٲ': 'ا',
            'ٳ': 'ا',
            'ٵ': 'ا',
            'ٷ': 'ؤ',
            'ٹ': 'ت',
            // Add more Arabic characters and their replacements as needed
        };
        return sentence?.replace(/[\u064B-\u065F\u0670]/g, '')
            .split(" ")?.slice(0, parseInt(itemWords))?.join(' ')
            .replace(/\)/g, "")
            .replace(/\(/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")
            .replace(/\﴿/g, "")
            .replace(/\﴾/g, "")
            .replace(/\ /g, "_")
            .replace(/\,/g, "")
            .replace(/\،/g, "")
            .replace(/\:/g, "")
            .replace(/\./g, "")
            .replace(/./g, char => diacriticsMap[char] || char);
    }

});