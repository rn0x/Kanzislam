import filterSpan from '/js/modules/filterSpan.js';

document.addEventListener("DOMContentLoaded", async function () {

    const loading = document.getElementById("loading");
    const fatwasItemPage = document.getElementById("fatwasItemPage");
    const fatwasContentPage = document.getElementById("fatwasContentPage");

    console.log(window.location);

    if (window.location.pathname === "/fataawa-ibn-baaz") {
        loading.style.display = "block";
        const url = `${window.location.protocol}//${window.location.host}`
        const categoryFetch = await fetch(`/fataawa-get-category-and-counts`);
        const category = await categoryFetch?.json();
        const box_fatwas = document.getElementById("box_fatwas");

        for (const item of category) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const fataawa_category = document.createElement("p");
            const fataawa_counts = document.createElement("p");

            box_fatwas.appendChild(li);
            li.appendChild(a);
            a.href = `/fataawa-ibn-baaz/${item.category.replace(/ /g, '_')}`;

            a.appendChild(fataawa_category);
            fataawa_category.className = "fataawa_category";
            fataawa_category.innerText = item.category;

            let countText;
            if (item.numberOfFatwas <= 10 && item.numberOfFatwas !== 1) {
                countText = 'فتاوى';
            } else {
                countText = 'فتوى';
            }
            a.appendChild(fataawa_counts);
            fataawa_counts.className = "fataawa_counts";
            fataawa_counts.innerText = `${item.numberOfFatwas} ${countText}`;

        }

        loading.style.display = "none";
    } else if (fatwasItemPage) {
        const more_fatwa = document.getElementById("more_fatwa");
        const box_fatwas_item = document.getElementById("box_fatwas_item");

        // عدد العناصر التي تم عرضها حتى الآن
        let displayedCount = 0;
        // عدد العناصر التي يتم عرضها في كل دفعة
        const batchSize = 10;

        // عرض أول دفعة من العناصر
        displayBatch();

        // تعريف دالة لعرض دفعة من العناصر
        function displayBatch() {
            const itemsToDisplay = options.fatwasArray.slice(displayedCount, displayedCount + batchSize);

            itemsToDisplay.forEach(item => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                const fatwas_item_id = document.createElement("small");
                const fatwas_item_title = document.createElement("h2");
                const fatwas_item_question = document.createElement("p");

                box_fatwas_item.appendChild(li);
                li.appendChild(a);
                a.href = `/fataawa-ibn-baaz/${options.category.replace(/ /g, '_')}/${item.id}`;

                fatwas_item_id.className = "fatwas_item_id";
                fatwas_item_id.innerText = item.id;

                fatwas_item_title.className = "fatwas_item_title";
                fatwas_item_title.innerText = item.title;

                fatwas_item_question.className = "fatwas_item_question";
                fatwas_item_question.innerText = item.question;

                a.appendChild(fatwas_item_id);
                a.appendChild(fatwas_item_title);
                a.appendChild(fatwas_item_question);
            });

            // تحديث العداد لعدد العناصر المعروضة حتى الآن
            displayedCount += itemsToDisplay.length;

            // إذا كان عدد العناصر المعروضة يزيد عن عدد كل العناصر، يتم إخفاء زر "المزيد"
            if (displayedCount >= options.fatwasArray.length) {
                more_fatwa.style.display = "none";
            }
        }

        // إضافة مستمع للنقر على زر "المزيد"
        more_fatwa.addEventListener("click", () => {
            // عرض دفعة إضافية من العناصر
            displayBatch();
        });

    } else if (fatwasContentPage) {
        const fatwasContentDownload = document.getElementById("fatwasContentDownload");
        const fatwasContentAnswer = document.getElementById("fatwasContentAnswer");
        fatwasContentAnswer.innerHTML = filterSpan(options.FatwaById.answer);
        fatwasContentDownload.addEventListener("click", () => {
            downloadFile(options.FatwaById.audio, `${options.FatwaById.title.replace(/ /g, '_')}_كنز_الإسلام.mp3`);
        })
    }
});


function downloadFile(url, filename) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob'; // تعيين نوع الرد على Blob (Binary Large Object)
    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };
    xhr.send();
}