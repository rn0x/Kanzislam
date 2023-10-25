

document.addEventListener("DOMContentLoaded", async function () {
    const options = window.options;
    const CategoriesBox = document.getElementById("CategoriesBox");
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    const Categories = await dataCategories();

    if (Categories) {

        for (let item of Categories?.getAllCategories) {
            const DivCategories = document.createElement("div");
            const IconCategories = document.createElement("img");
            const MainCategories = document.createElement("div");
            const MainCategories_a = document.createElement("a");
            const MainCategories_p = document.createElement("p");
            const CountTopic = document.createElement("div");
            const CountTopic_p = document.createElement("p");
            const CountTopic_small = document.createElement("small");
            const CountComment = document.createElement("div");
            const CountComment_p = document.createElement("p");
            const CountComment_small = document.createElement("small");
            CategoriesBox.appendChild(DivCategories);
            DivCategories.className = "DivCategories"
            DivCategories.appendChild(IconCategories);
            IconCategories.className = "IconCategories iconFilter";
            IconCategories.src = "/icon/forum.svg";
            IconCategories.alt = item.title;
            IconCategories.title = item.title;
            DivCategories.appendChild(MainCategories);
            MainCategories.className = "MainCategories";
            MainCategories.appendChild(MainCategories_a);
            MainCategories_a.href = `/forum/${item.category_id}`;
            MainCategories_a.title = item.description;
            MainCategories_a.innerText = item.title;
            MainCategories.appendChild(MainCategories_p);
            MainCategories_p.innerText = item.description;
            DivCategories.appendChild(CountTopic);
            CountTopic.className = "CountCategories";
            CountTopic.appendChild(CountTopic_p);
            CountTopic_p.innerText = "المواضيع";
            CountTopic_p.title = `عدد المواضيع ${item.counttopics}`;
            CountTopic.appendChild(CountTopic_small);
            CountTopic_small.innerText = item.counttopics;
            CountTopic_small.title = `عدد المواضيع ${item.counttopics}`;
            DivCategories.appendChild(CountComment);
            CountComment.className = "CountCategories";
            CountComment.appendChild(CountComment_p);
            CountComment_p.innerText = "المشاركات";
            CountComment_p.title = `عدد المشاركات ${item.countcomments}`;
            CountComment.appendChild(CountComment_small);
            CountComment_small.innerText = item.countcomments;
            CountComment_small.title = `عدد المشاركات ${item.countcomments}`;
        }

    }

    async function dataCategories() {
        const categoriesURL = `${window.location.origin}/categories`;
        const categoriesFetch = await fetch(categoriesURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (categoriesFetch.ok) {
            const response = await categoriesFetch?.json();
            if (response?.getAllCategories) {
                return response
            } else return false
        } else return false
    }

    loading.style.display = "none";
});