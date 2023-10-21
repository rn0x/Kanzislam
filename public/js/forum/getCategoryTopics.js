import getElapsedTime from '../js/modules/getElapsedTime.js';

document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const loading = document.getElementById("loading");
    const ButtonMore = document.getElementById("ButtonMore");
    const buttonAddTopics = document.getElementById("buttonAddTopics");
    const topiscTbody = document.getElementById("topiscTbody");
    loading.style.display = "block";
    const apiTopics = `${window.location.origin}/api/forum?category_id=${options?.getCategorie?.category_id}`;
    const apiTopicsFetch = await fetch(apiTopics, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const response = await apiTopicsFetch?.json();

    if (response && topiscTbody) {

        // Define the variables for pagination
        const itemsPerPage = 10; // Number of topics to show in each page
        let currentPage = 1; // The current page number
        let numPages = Math.ceil(response.topics.length / itemsPerPage); // The total number of pages

        // Sort the topics array by the updatedAt property in descending order
        response.topics.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // A function to show the topics according to the page number
        function showPage(page) {
            // Loop through the topics array and append only the ones that belong to the current page
            for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage && i < response.topics.length; i++) {
                let item = response.topics[i];
                const tr = document.createElement("tr");
                const topicsMain = document.createElement("td"); 
                const likes = document.createElement("td");
                const views = document.createElement("td");
                const comments = document.createElement("td");
                const topicsMainDiv = document.createElement("div");
                const topicUsername = document.createElement("div");
                const topicUsernameImage = document.createElement("img");
                const topicUsernameLink = document.createElement("a");
                const Linktopics = document.createElement("a");
                const topicsTime = document.createElement("small");

                topiscTbody.appendChild(tr);
                tr.appendChild(topicsMain);
                topicsMain.className = "topicsMain";
                topicsMain.appendChild(topicsMainDiv);
                topicsMainDiv.appendChild(Linktopics);
                Linktopics.href = `${window.location.origin}/forum/topic/${item?.topic_id}`;
                Linktopics.title = item?.title;
                Linktopics.innerText = item?.title;
                /////////////////
                topicsMainDiv.appendChild(topicUsername);
                topicUsername.className = "topicUsername";
                topicUsername.appendChild(topicUsernameImage);
                topicUsernameImage.src = "/icon/user.svg";
                topicUsernameImage.alt = item?.user?.username;
                topicUsernameImage.title = item?.user?.username;
                topicUsername.appendChild(topicUsernameLink);
                topicUsernameLink.href = `/username/${item?.user?.username}`;
                topicUsernameLink.innerText = item?.user?.username;
                topicUsernameLink.title = item?.user?.username;
                ////////////////
                topicsMainDiv.appendChild(topicsTime);
                topicsTime.className = "topicsTime";
                topicsTime.innerHTML = getElapsedTime(item?.updatedAt);
                tr.appendChild(likes);
                likes.className = "likes";
                likes.innerText = item?.likeCount ? item?.likeCount : 0;
                tr.appendChild(views);
                views.className = "views";
                views.innerText = item?.viewCount ? item?.viewCount : 0;
                tr.appendChild(comments);
                comments.className = "comments";
                comments.innerText = item?.commentCount ? item?.commentCount : 0;
            }
        }

        // A function to go to the next page
        function nextPage() {
            // Check if the current page is not the last one
            if (currentPage < numPages) {
                // Increment the current page
                currentPage++;
                // Show the page
                showPage(currentPage);
            }
            // Check if the current page is the last one
            if (currentPage == numPages) {
                // Hide the more button
                ButtonMore.style.display = "none";
            }
        }

        // Show the first page initially
        showPage(currentPage);

        // Add event listener to the more button
        ButtonMore.addEventListener("click", nextPage);
        // Add event listener to the create topic
        buttonAddTopics.addEventListener("click", () => {
            window.location.href = `/create-topic?category_id=${options?.getCategorie?.category_id}`
        });

        // Show or hide the more button depending on the number of pages
        if (numPages > 1) {
            ButtonMore.style.display = "block";
        } else {
            ButtonMore.style.display = "none";
        }

    }

    loading.style.display = "none";

});