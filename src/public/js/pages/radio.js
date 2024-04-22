document.addEventListener("DOMContentLoaded", async function () {
    const radioIndex = document.getElementById("radioIndex");
    const radioPage = document.getElementById("radioPage");
    const loading = document.getElementById("loading");
    loading.style.display = "block";

    let currentAudio = null;
    let currentIcon = null;

    if (radioIndex) {
        const radio = document.getElementById("radio");
        const radioJson = await dataRadio();

        if (radioJson) {
            for (const item of radioJson) {
                const li = document.createElement("li");
                const RadioId = document.createElement("p");
                const RadioTitle = document.createElement("a");
                const iconRadio = document.createElement("img");
                const audio = document.createElement("audio");
                radio.appendChild(li);
                li.appendChild(RadioId);
                RadioId.className = "RadioId";
                RadioId.innerText = item?.id;
                li.appendChild(RadioTitle);
                RadioTitle.className = "RadioTitle";
                RadioTitle.href = `${window.location.origin}/radios/${item?.id}`;
                RadioTitle.innerText = item?.name;
                RadioTitle.title = item?.name;
                li.appendChild(iconRadio);
                iconRadio.className = "iconRadio iconFilter";
                iconRadio.src = "/static/icon/play.svg";
                iconRadio.alt = "play";
                iconRadio.title = item?.name;
                audio.src = item?.link;
                audio.preload = 'none';

                iconRadio.addEventListener("click", () => {
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentIcon.src = "/static/icon/play.svg";
                    }
                    if (audio.paused) {
                        iconRadio.src = "/static/icon/loading.svg";
                        audio.play();
                        iconRadio.src = "/static/icon/pause.svg";
                        currentAudio = audio;
                        currentIcon = iconRadio;
                    } else {
                        audio.pause();
                        iconRadio.src = "/static/icon/play.svg";
                        currentAudio = null;
                        currentIcon = null;
                    }
                });

                audio.addEventListener("ended", () => {
                    iconRadio.src = "/static/icon/play.svg";
                    currentAudio = null;
                });
            }

            loading.style.display = "none";
        }
    }

    else if (radioPage) {
        const audio = document.createElement("audio");
        const iconRadio = document.getElementById("iconRadio");

        iconRadio.src = "/static/icon/play.svg";
        iconRadio.title = options?.radioJson?.name;
        audio.src = options?.radioJson?.link;
        audio.preload = 'none';

        iconRadio.addEventListener("click", () => {
            if (audio.paused) {
                iconRadio.src = "/static/icon/loading.svg";
                audio.play();
                iconRadio.src = "/static/icon/pause.svg";
            } else {
                audio.pause();
                iconRadio.src = "/static/icon/play.svg";
            }
        });

        audio.addEventListener("ended", () => {
            iconRadio.src = "/static/icon/play.svg";
        });

        loading.style.display = "none";
    }

    async function dataRadio() {
        const radioURL = `${window.location.origin}/data-radio`;
        const radioFetch = await fetch(radioURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (radioFetch.ok) {
            const response = await radioFetch?.json();
            if (response?.response !== 0) {
                return response;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
});
