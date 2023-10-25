document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const topics = document.getElementById("topics");
    const comeents = document.getElementById("comeents");
    const likes = document.getElementById("likes");
    const countTopic = document.getElementById("countTopic");
    const countComment = document.getElementById("countComment");
    const countLike = document.getElementById("countLike");
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    const DataUsername = await getUsername();

    if (DataUsername) {

        countTopic.innerText = DataUsername?.topics?.length || 0;
        countComment.innerText = DataUsername?.comments?.length || 0;
        countLike.innerText = DataUsername?.like?.length || 0;

        if (DataUsername?.topics?.length === 0) {
            topics.style.display = "none";
        }
        if (DataUsername?.comments?.length === 0) {
            comeents.style.display = "none";
        }
        if (DataUsername?.like?.length === 0) {
            likes.style.display = "none";
        }

        for (const item of (DataUsername?.topics || []).slice(0, 10)) {
            const a = document.createElement("a");
            topics.appendChild(a);
            a.href = `${window.location.origin}/forum/topic/${item?.topic_id}`;
            a.innerText = item?.title;
            a.title = item?.title;
        }

        for (const item of (DataUsername?.comments || []).slice(0, 10)) {
            const a = document.createElement("a");
            comeents.appendChild(a);
            a.href = `${window.location.origin}/forum/topic/${item?.topic_id}#${item?.comment_id}`;
            a.innerText = item?.topic?.title;
            a.title = item?.topic?.title;
        }

        for (const item of (DataUsername?.like || []).slice(0, 10)) {
            const a = document.createElement("a");
            likes.appendChild(a);
            a.href = `${window.location.origin}/forum/topic/${item?.topic?.topic_id}`;
            a.innerText = item?.topic?.title;
            a.title = item?.topic?.title;
        }

    }
 
    async function getUsername() {
        const DataURL = `${window.location.origin}/get-username?username=${options?.user?.username}`;
        const DataFetch = await fetch(DataURL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (DataFetch.ok) {
            const response = await DataFetch?.json();
            if (response?.user) {
                return response
            } else return false
        } else return false
    }

    loading.style.display = "none";
});