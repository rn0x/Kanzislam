const loading = document.getElementById("loading");
loading.style.display = "block";

let currentAudio = null;
let currentIcon = null;

export const radioIndexPage = async (options) => {
    const radio = document.getElementById("radio");
    const radioJson = await dataRadio();

    if (radioJson) {
        for (const item of radioJson) {
            const li = document.createElement("li");
            const RadioId = document.createElement("p");
            const RadioTitle = document.createElement("a");
            const iconRadio = document.createElement("i");
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
            iconRadio.className = "iconRadio fa-solid fa-play"
            iconRadio.alt = "play";
            iconRadio.title = item?.name;
            audio.src = item?.link;
            audio.preload = 'none';

            iconRadio.addEventListener("click", () => {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentIcon.className = "iconRadio fa-solid fa-play"
                }
                if (audio.paused) {
                    iconRadio.className = "fa-solid fa-spinner iconRadio";
                    audio.play();
                    iconRadio.className = "iconRadio fa-solid fa-pause"
                    currentAudio = audio;
                    currentIcon = iconRadio;
                } else {
                    audio.pause();
                    iconRadio.className = "iconRadio fa-solid fa-play"
                    currentAudio = null;
                    currentIcon = null;
                }
            });

            audio.addEventListener("ended", () => {
                iconRadio.className = "iconRadio fa-solid fa-play"
                currentAudio = null;
            });
        }

        loading.style.display = "none";
    }
}

export const radioItemPage = async (options) => {
    const audio = document.createElement("audio");
    const iconRadio = document.getElementById("iconRadio");

    iconRadio.className = "iconRadio fa-solid fa-play"
    iconRadio.title = options?.radioJson?.name;
    audio.src = options?.radioJson?.link;
    audio.preload = 'none';

    iconRadio.addEventListener("click", () => {
        if (audio.paused) {
            iconRadio.className = "fa-solid fa-spinner iconRadio";
            audio.play();
            iconRadio.className = "iconRadio fa-solid fa-pause"
        } else {
            audio.pause();
            iconRadio.className = "iconRadio fa-solid fa-play"
        }
    });

    audio.addEventListener("ended", () => {
        iconRadio.className = "iconRadio fa-solid fa-play"
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

    if (!radioFetch.ok) {
        console.log(`HTTP error! Status: ${radioFetch.status}`);
        return false
    }

    const response = await radioFetch?.json();
    return response
}
