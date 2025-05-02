import filterSpan from '/js/modules/filterSpan.js';

const loading = document.getElementById("loading");
loading.style.display = "block";
const adhkarJson = await dataAdhkar();
const adhkarBox = document.getElementById("adhkarBox");


export const PageAdhkarIndex = () => {
    const adhkarKey = Object.keys(adhkarJson);
    const adhkarCategory = document.getElementById("adhkarCategory");
    const adhkarRepeat = document.querySelector("#adhkarRepeat > p");
    const GetAdhkarRepeat = localStorage.getItem("adhkarRepeat");
    for (const item of adhkarKey) {
        const adhkar = adhkarJson[item];
        const li = document.createElement("li");
        const a = document.createElement("a");
        const icon = document.createElement("img");
        const title = document.createElement("h2");
        adhkarCategory.appendChild(li);
        li.appendChild(a);
        a.href = `/adhkar/${adhkar?.category?.split(" ")?.join("_")}`;
        a.appendChild(icon);
        icon.src = adhkar?.icon;
        icon.alt = adhkar?.category;
        icon.title = adhkar?.category;
        icon.ariaLabel = adhkar?.category;
        icon.className = "adhkarBoxIcon";
        icon.height = 50;
        icon.width = 50;
        a.appendChild(title);
        title.innerText = adhkar?.category;
    }
    adhkarRepeat.innerText = GetAdhkarRepeat ? GetAdhkarRepeat : 0;

    loading.style.display = "none";
}

export const PageAdhkarList = (options) => {
    const adhkarKey = Object.keys(adhkarJson);
    const isPathAdhkar = adhkarKey.find((e) => adhkarJson[e]?.category?.split(" ")?.join("_") === options?.pathname);

    if (!isPathAdhkar) {
        window.location = "/404";
    }

    const adhkarItem = adhkarJson[isPathAdhkar];
    const adhkarTitle = document.getElementById("adhkarTitle");
    const breadcrumbCategory = document.getElementById("breadcrumbCategory");
    adhkarTitle.innerText = adhkarItem.category;
    adhkarTitle.title = adhkarItem.category;
    adhkarTitle.ariaLabel = adhkarItem.category;
    breadcrumbCategory.innerText = adhkarItem.category;
    breadcrumbCategory.title = adhkarItem.category;
    breadcrumbCategory.ariaLabel = adhkarItem.category;
    breadcrumbCategory.href = `/adhkar/${adhkarItem.category.split(" ").join("_")}`

    for (let item of adhkarItem?.array) {
        let li = document.createElement("li");
        let repetition = document.createElement("div");
        let repetition_p = document.createElement("p");
        let repetition_i = document.createElement("i");
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
        repetition_p.title = item?.repetition;
        repetition_p.ariaLabel = item?.repetition;
        repetition.appendChild(repetition_i);
        repetition_i.className = "fa-solid fa-rotate-left repetitionIcon";
        
        // Initially check if the reset button should be disabled (if counter is at full value)
        updateResetButtonState(repetition_i, repetition_p, item?.repetition);
        
        li.appendChild(adhkar_text);
        adhkar_text.className = "adhkar_text"
        adhkar_text.appendChild(adhkar_text_h3);
        adhkar_text_h3.innerHTML = filterSpan(item?.adhkar);
        adhkar_text_h3.title = item?.adhkar;
        adhkar_text_h3.ariaLabel = item?.adhkar;
        adhkar_text.appendChild(adhkar_text_p);
        adhkar_text_p.innerHTML = filterSpan(item?.description);
        adhkar_text_p.title = item?.description;
        adhkar_text_p.ariaLabel = item?.description;
        adhkar_text.appendChild(adhkar_text_small);
        adhkar_text_small.innerHTML = filterSpan(item?.source);
        adhkar_text_small.title = item?.source;
        adhkar_text_small.ariaLabel = item?.source;
        adhkar_text.appendChild(adhkar_text_a);
        adhkar_text_a.href = `/adhkars/${item?.title?.split(" ")?.join("_")}`;
        adhkar_text_a.appendChild(linkAdhkar);
        linkAdhkar.id = "linkAdhkar";
        linkAdhkar.src = "/icon/link.svg";
        linkAdhkar.alt = "رابط الذكر";
        linkAdhkar.title = "رابط الذكر";
        linkAdhkar.ariaLabel = "رابط الذكر";

        repetition.addEventListener("click", function(event) {
            // Prevent any default behavior
            event.preventDefault();
            
            // Handle click on counter
            decrementCounter(repetition, repetition_p, item?.repetition, repetition_i);
        });

        // Also add touchend event for mobile devices
        repetition.addEventListener("touchend", function(event) {
            // Prevent any default behavior and immediate propagation
            event.preventDefault();
            event.stopPropagation();
            
            // Handle touch on counter
            decrementCounter(repetition, repetition_p, item?.repetition, repetition_i);
        }, { passive: false });

        repetition_i.addEventListener("click", (event) => {
            // Only process if the button is not disabled
            if (!repetition_i.classList.contains('disabled')) {
                event.stopPropagation();
                event.preventDefault();
                resetCounter(repetition, repetition_p, item?.repetition, repetition_i);
            }
        });

        // Also add touchend event for the reset icon
        repetition_i.addEventListener("touchend", (event) => {
            // Only process if the button is not disabled
            if (!repetition_i.classList.contains('disabled')) {
                event.stopPropagation();
                event.preventDefault();
                resetCounter(repetition, repetition_p, item?.repetition, repetition_i);
            }
        }, { passive: false });

    }

    loading.style.display = "none";
}

// Helper function to decrement counter
function decrementCounter(repetitionEl, counterEl, originalValue, resetIcon) {
    if (parseInt(counterEl.innerText) > 0) {
        let value = parseInt(counterEl.innerText) - 1;
        counterEl.innerText = value;
        if (parseInt(counterEl.innerText) === 0) {
            repetitionEl.style.backgroundColor = "#fad1d1";
        }
        let GetAdhkarRepeat = localStorage.getItem("adhkarRepeat");
        if (!GetAdhkarRepeat || isNaN(GetAdhkarRepeat)) {
            GetAdhkarRepeat = 0;
        }
        localStorage.setItem("adhkarRepeat", parseInt(GetAdhkarRepeat) + 1);
        
        // Enable reset button as soon as counter is decremented
        if (resetIcon) {
            resetIcon.classList.remove('disabled');
        }
    }
}

// Helper function to reset counter
function resetCounter(repetitionEl, counterEl, originalValue, resetIcon) {
    counterEl.innerText = originalValue;
    counterEl.title = originalValue;
    counterEl.ariaLabel = originalValue;
    repetitionEl.style.backgroundColor = "";
    
    // Disable reset button after reset since there's nothing to reset anymore
    if (resetIcon) {
        updateResetButtonState(resetIcon, counterEl, originalValue);
    }
}

// Function to update the reset button state based on counter value
function updateResetButtonState(resetIcon, counterEl, originalValue) {
    if (parseInt(counterEl.innerText) === parseInt(originalValue)) {
        resetIcon.classList.add('disabled');
    } else {
        resetIcon.classList.remove('disabled');
    }
}

async function dataAdhkar() {
    const adhkarURL = `${window.location.origin}/data-adhkar`;
    const adhkarFetch = await fetch(adhkarURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!adhkarFetch.ok) {
        console.log(`HTTP error! Status: ${adhkarFetch.status}`);
        return false
    }

    const response = await adhkarFetch?.json();
    return response
}