document.addEventListener("DOMContentLoaded", async function () {
    const options = window.options;
    const searchHistory = document.getElementById("searchHistory");
    const historyBox = document.getElementById("historyBox");
    const historyMore = document.getElementById("historyMore");
    const loading = document.getElementById("loading");
    loading.style.display = "block";

    let data = [];
    let currentIndex = 0;
    const itemsPerPage = 10;
    let searchTerm = ""; 

    async function fetchData() {
        const newData = await dataHistory();
        if (newData) {
            data = newData;
            // قم بإزالة حركات الحروف العربية من عناصر title في الخلفية
            data.forEach(item => {
                item.filteredTitle = item.title.replace(/[\u064B-\u0652\u06D4\u0670]/g, '');
            });
            displayData();
        }
    }

    async function dataHistory() {
        const radioURL = `${window.location.origin}/data-history`;
        const radioFetch = await fetch(radioURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (radioFetch.ok) {
            const response = await radioFetch.json();
            if (response?.length !== 0) {
                return response;
            }
        }
        return null;
    }

    function displayData() {
        // مسح العناصر الحالية فقط إذا كانت ليست جزءًا من نتائج البحث
        if (currentIndex === 0) {
            historyBox.innerHTML = "";
        }

        const filteredData = data.filter(item => item?.filteredTitle.toLowerCase().includes(searchTerm));

        for (let i = currentIndex; i < Math.min(currentIndex + itemsPerPage, filteredData.length); i++) {
            const item = filteredData[i];
            const li = document.createElement("li");
            const id = document.createElement("p");
            const link = document.createElement("a");
            historyBox.appendChild(li);
            li.appendChild(id);
            id.className = "id_history";
            id.innerText = item?.id;
            li.appendChild(link);
            link.className = "link_history";
            link.innerText = item?.title; 
            link.href = `${window.location.origin}/historical-events/${item?.id}`;
        }

        if (filteredData.length > currentIndex + itemsPerPage) {
            historyMore.style.display = "block";
        } else {
            historyMore.style.display = "none";
        }
    }

    historyMore.addEventListener("click", () => {
        currentIndex += itemsPerPage;
        displayData();
    });

    searchHistory.addEventListener("keyup", () => {
        currentIndex = 0;
        searchTerm = searchHistory.value.toLowerCase();
        // إزالة الحركات من عناصر title في الخلفية فقط
        data.forEach(item => {
            item.filteredTitle = item.title.replace(/[\u064B-\u0652\u06D4\u0670]/g, '');
        });
        displayData();
    });

    await fetchData();
    loading.style.display = "none";
});
