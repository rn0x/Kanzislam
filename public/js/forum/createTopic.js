import '../js/modules/ckeditor.js';

document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const ButtonAdd = document.getElementById("ButtonAdd");
    const titleTopic = document.getElementById("titleTopic");
    const ErrorMessage = document.getElementById("ErrorMessage");
    const editorBox = await ClassicEditor
        .create(document.getElementById('editorBox'), {
            ckfinder: {
                uploadUrl: '/api/upload',
            },
        })
        .catch(error => {
            console.error(error);
        });
        

    ButtonAdd.addEventListener("click", async () => {
        const titleValue = titleTopic.value;
        const editorBoxValue = editorBox.getData();

        if (titleValue.split(" ").length >= 3 && titleValue.length < 80) {
            if (editorBoxValue.split(" ").length >= 5 && editorBoxValue.length < 6000) {
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
                    }),
                });
                const response = await createTopicFetch?.json();

                if (response?.isCreated) {

                    ErrorMessage.innerText = response?.message;
                    ErrorMessage.style.display = "block";
                    ErrorMessage.style.backgroundColor = "#d2fad1";
                    ErrorMessage.style.color = "#558554";
                    ErrorMessage.style.borderColor = "#96e296";

                    setTimeout(() => {
                        window.location.href = response?.topicUrl
                    }, 10000);
                }

                else {
                    const message = response?.message;
                    ErrorMessage.innerText = message;
                    ErrorMessage.style.display = "block";

                    setTimeout(() => {
                        ErrorMessage.style.display = "none";
                    }, 10000);
                }
            }

            else {
                const message = "يجب ان يحتوي الموضوع على الأقل 5 كلمات وان يكون اقل من 6000 حرف";
                ErrorMessage.innerText = message;
                ErrorMessage.style.display = "block";

                setTimeout(() => {
                    ErrorMessage.style.display = "none";
                }, 10000);
            }
        }

        else {
            const message = "يجب ان يكون عنوان الموضوع اقل من 80 حرف و ان يحتوي على الأقل 3 كلمات";
            ErrorMessage.innerText = message;
            ErrorMessage.style.display = "block";

            setTimeout(() => {
                ErrorMessage.style.display = "none";
            }, 10000);
        }
    })
});