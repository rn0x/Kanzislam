import '../js/modules/ckeditor.js';

document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const ButtonAdd = document.getElementById("ButtonAdd");
    const titleTopic = document.getElementById("titleTopic");
    const ErrorMessage = document.getElementById("ErrorMessage");
    const alertErrorMessage = document.getElementById("ErrorMessage");
    let imageCount = 0;
    const maxImages = 10;
    const editorBox = await ClassicEditor
        .create(document.getElementById('editorBox'), {
            ckfinder: {
                uploadUrl: '/api/upload',
            },
        })
        .catch(error => {
            console.error(error);
        });

    const add_image = document.querySelector('.ck-file-dialog-button');

    let previousContent = editorBox.getData();

    editorBox.model.document.on('change', () => {
        const currentContent = editorBox.getData();
        const eventImages = EventImages(previousContent, currentContent);

        if (eventImages.removed.length > 0 && eventImages.added.length === 0) {
            for (let item of eventImages.removed) {
                if (item === "") return;
                if (imageCount > 0) {
                    imageCount = imageCount - 1;
                    if (imageCount <= maxImages) {
                        add_image.style.display = 'block';
                    }

                    console.log("remove image : ", imageCount);
                }
            }
        }

        if (eventImages.added.length > 0 && eventImages.removed.length === 0) {
            for (let item of eventImages.added) {
                if (item === "") return;
                if (imageCount < maxImages) {
                    imageCount = imageCount + 1;
                    if (imageCount >= maxImages) {
                        console.log(`You can only insert ${maxImages} images.`);
                        add_image.style.display = 'none';
                        ErrorMessage.innerText = `يمكنك إدراج ${maxImages} صور فقط.`;
                        ErrorMessage.style.display = "block";
                        ErrorMessage.style.scrollMarginTop = "150px";
                        ErrorMessage.scrollIntoView();
                        setTimeout(() => {
                            ErrorMessage.style.display = "none";
                        }, 10000);
                    }

                    console.log("add image : ", imageCount);
                }
            }
        }

        previousContent = currentContent;
    });

    function EventImages(previousContent, currentContent) {
        const previousImages = extractImages(previousContent);
        const currentImages = extractImages(currentContent);

        const removedImages = previousImages.filter(image => !currentImages.includes(image));
        const addedImages = currentImages.filter(image => !previousImages.includes(image));

        const changes = {
            removed: removedImages,
            added: addedImages
        };

        return changes;
    }

    function extractImages(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const images = Array.from(doc.querySelectorAll('img'));
        return images.map(image => image.src);
    }

    let isCreated = false;

    ButtonAdd.addEventListener("click", async () => {
        const titleValue = titleTopic.value;
        const editorBoxValue = editorBox.getData();

        if (isCreated) {
            return;
        }

        if (titleValue.split(" ").length >= 3 && titleValue.length < 80) {
            if (editorBoxValue.split(" ").length >= 5 && editorBoxValue.length < 6000) {

                const editorBoxRawValue = removeHtmlTags(editorBoxValue);
                const createTopicURL = `${window.location.origin}/create-topic`;
                const createTopicFetch = await fetch(createTopicURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        category_id: options.Category.category_id,
                        title: titleValue?.substring(0, 80)?.trim(),
                        content: editorBoxValue?.substring(0, 6000),
                        content_raw: editorBoxRawValue?.substring(0, 6000),
                        description: editorBoxRawValue?.substring(0, 150),
                    }),
                });
                const response = await createTopicFetch?.json();

                if (response?.isCreated) {
                    isCreated = true;
                    ErrorMessage.innerText = response?.message;
                    ErrorMessage.style.display = "block";
                    ErrorMessage.style.backgroundColor = "#d2fad1";
                    ErrorMessage.style.color = "#558554";
                    ErrorMessage.style.borderColor = "#96e296";
                    ErrorMessage.style.scrollMarginTop = "150px";
                    ErrorMessage.scrollIntoView();

                    setTimeout(() => {
                        window.location.href = response?.topicUrl
                    }, 10000);
                }

                else {
                    const message = response?.message;
                    ErrorMessage.innerText = message;
                    ErrorMessage.style.display = "block";
                    ErrorMessage.style.scrollMarginTop = "150px";
                    ErrorMessage.scrollIntoView();

                    setTimeout(() => {
                        ErrorMessage.style.display = "none";
                    }, 10000);
                }
            }

            else {
                const message = "يجب ان يحتوي الموضوع على الأقل 5 كلمات وان يكون اقل من 6000 حرف";
                ErrorMessage.innerText = message;
                ErrorMessage.style.display = "block";
                ErrorMessage.style.scrollMarginTop = "150px";
                ErrorMessage.scrollIntoView();

                setTimeout(() => {
                    ErrorMessage.style.display = "none";
                }, 10000);
            }
        }

        else {
            const message = "يجب ان يكون عنوان الموضوع اقل من 80 حرف و ان يحتوي على الأقل 3 كلمات";
            ErrorMessage.innerText = message;
            ErrorMessage.style.display = "block";
            ErrorMessage.style.scrollMarginTop = "150px";
            ErrorMessage.scrollIntoView();

            setTimeout(() => {
                ErrorMessage.style.display = "none";
            }, 10000);
        }
    });


    function removeHtmlTags(html) {
        let div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText;
    }
});