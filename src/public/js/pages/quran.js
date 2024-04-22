document.addEventListener("DOMContentLoaded", async function () {

    let options = window.options;
    let url = window.location.origin;
    let loading = document.getElementById("loading");
    let quranIndex = document.getElementById("quranIndex");
    let quranPage = document.getElementById("quranPage");
    let quranPathPage = document.getElementById("quranPathPage");

    if (quranPage) {
        loading.style.display = "block";

        for (let item of options?.quranJson) {

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

        loading.style.display = "none";
    }

    if (quranPathPage) {

        loading.style.display = "block";
        let fontPlus = document.getElementById("Plus");
        let fontMinus = document.getElementById("Minus");
        let readerBoxUl = document.getElementById("readerBoxUl");
        let previousSurah = document.getElementById("previousSurah");
        let nextSurah = document.getElementById("nextSurah");
        let titleInfo = document.getElementById("titleInfo");
        let number_verses_span = document.getElementById("number_verses_span");
        let number_words_span = document.getElementById("number_words_span");
        let number_span = document.getElementById("number_span");
        let number_letters_span = document.getElementById("number_letters_span");
        let descent_span = document.getElementById("descent_span");
        let english_name_span = document.getElementById("english_name_span");
        let bisamla = document.getElementById("bisamla");
        let surah = document.getElementById("surah");
        const data = await dataQuran();

        if (data?.nameSurah) {

            previousSurah.href = `/quran/سورة_${data?.previousSurah?.name?.split(" ")?.join("_")}`;
            previousSurah.innerText = data?.previousSurah?.name;
            nextSurah.href = `/quran/سورة_${data?.nextSurah?.name?.split(" ")?.join("_")}`;
            nextSurah.innerText = data.nextSurah.name;
            titleInfo.innerText = `معلومات حول سورة ${data?.currentSurah?.name}`;
            number_verses_span.innerText = data?.currentSurah?.number_verses;
            number_words_span.innerText = data?.currentSurah?.number_words;
            number_span.innerText = data?.currentSurah?.number;
            number_letters_span.innerText = data?.currentSurah?.number_letters;
            descent_span.innerText = data?.currentSurah?.descent;
            english_name_span.innerText = data?.currentSurah?.english_name;
            bisamla.innerText = data?.bisamla;
            surah.innerHTML = data?.surah;

            fontPlus.addEventListener("click", async () => {
                changeFontSize("bisamla", 2);
                changeFontSize("surah", 2);
            });

            fontMinus.addEventListener("click", async () => {
                changeFontSize("bisamla", -2);
                changeFontSize("surah", -2);
            });

            let currentAudio = null; // تعريف المقطع الصوتي الحالي
            let currentLi = null;
            let currentTimeupdate = null;

            for (const item of data.mp3quranFind) {

                let li = document.createElement("li");
                let p = document.createElement("p");
                let small = document.createElement("small");
                let audio = document.createElement("audio");
                let span = document.createElement("span");
                let img = document.createElement("img");
                let isPlay = false;
                readerBoxUl.appendChild(li);
                li.appendChild(small);
                small.innerText = item.rewaya;
                li.appendChild(p);
                p.innerText = item.reader;
                li.appendChild(span);
                span.className = 'timeupdate';
                audio.preload = 'none';
                li.appendChild(img);
                img.id = "icon_download";
                img.alt = "تحميل";
                img.src = "/static/icon/download.svg";
                img.className = "iconFilter";

                img.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    img.src = "/static/icon/loading.svg";
                    const response = await fetch(item.link);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const filename = `سورة_${data.currentSurah.name.split(" ").join("_")}_القارئ_${item.reader.split(" ").join("_")}_رواية_${item.rewaya.split(" ").join("_")}.mp3`;
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
                    img.src = "/static/icon/download.svg";
                });

                li.addEventListener("click", async () => {

                    if (currentAudio) { // التحقق من وجود مقطع صوتي حالي وإيقاف تشغيله
                        currentAudio.pause();
                        currentLi.style.backgroundColor = '';
                        currentTimeupdate.style.display = 'none';
                        currentTimeupdate.innerText = '';
                    }

                    if (currentAudio !== audio || !isPlay) { // التحقق من عدم تشغيل المقطع الصوتي الحالي
                        audio.src = item.link;
                        audio.play();
                        li.style.backgroundColor = 'var(--backgroundQuranStart)';
                        isPlay = true;
                        currentAudio = audio; // تعيين المقطع الصوتي الحالي
                        currentLi = li;
                        currentTimeupdate = span;
                        span.style.display = 'block';
                    }
                    else {
                        audio.pause();
                        li.style.backgroundColor = '';
                        isPlay = false;
                        currentAudio = null; // إزالة المقطع الصوتي الحالي
                        currentLi = null; // إزالة العنصر الحالي
                        currentTimeupdate.style.display = 'none';
                        currentTimeupdate.innerText = '';
                    }
                });

                audio.addEventListener("timeupdate", () => {
                    let remainingTime = audio.duration - audio.currentTime;
                    let hours = Math.floor(remainingTime / 3600); // حساب عدد الساعات
                    let minutes = Math.floor((remainingTime % 3600) / 60); // حساب عدد الدقائق
                    let seconds = Math.floor(remainingTime % 60); // حساب عدد الثواني

                    if (hours > 0) {
                        span.innerText = `${hours}:${minutes}:${seconds}`; // عرض الوقت المتبقي بالساعات
                    } else {
                        span.innerText = `${minutes}:${seconds}`; // عرض الوقت المتبقي بالدقائق والثواني
                    }
                });


                audio.addEventListener("ended", () => {
                    li.style.backgroundColor = ''; // استعادة اللون الأصلي للعنصر
                    currentAudio = null; // إزالة المقطع الصوتي الحالي
                    currentLi = null; // إزالة العنصر الحالي
                    currentTimeupdate.style.display = 'none'; // إزالة عرض مدة الصوت المتبقية عند الانتهاء
                    currentTimeupdate.innerText = '';
                });
            }

        }
        loading.style.display = "none";
    }

    function changeFontSize(elementId, increment) {
        let element = document.getElementById(elementId);
        let fontSize = parseInt(window.getComputedStyle(element).fontSize);
        fontSize += increment;
        element.style.fontSize = fontSize + 'px';
    }

    async function dataQuran() {
        const quranURL = `${window.location.origin}/data-quran?nameSurah=${options?.nameSurah}`;
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