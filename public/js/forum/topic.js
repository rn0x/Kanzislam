import '../../js/modules/ckeditor.js';

document.querySelectorAll
document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    let imageCount = 0;
    const maxImages = 10;
    const editorBoxElement = document.getElementById("editorBox");
    const CommentBox = document.getElementById("CommentBox");
    const CreateReply = document.getElementById("CreateReply");
    const copyLink = document.getElementById("copyLink");
    const whatsappLink = document.getElementById("whatsappLink");
    const telegramLink = document.getElementById("telegramLink");
    const sharing = document.getElementById("sharing");
    const sharingBox = document.getElementById("sharingBox");
    const likeTopic = document.getElementById("likeTopic");
    const removeTopic = document.getElementById("removeTopic");
    const reportTopic = document.getElementById("reportTopic");
    const alertMessage = document.getElementById("alertMessage");
    const editorBox = await ClassicEditor
        .create(editorBoxElement, {
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
                        alertMessage.style.display = "block";
                        alertMessage.innerText = `يمكنك إدراج ${maxImages} صور فقط. ❌`;
                        setTimeout(() => {
                            alertMessage.style.display = "none";
                        }, 5000);
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


    // الرد على التعليق
    const toReplyElements = document.querySelectorAll('.ToReply');

    toReplyElements.forEach(function (element) {
        if (!options.session.isLoggedIn) {
            element.style.display = "none";
        }
        element.addEventListener('click', function (event) {
            const parentElement = event.currentTarget.closest('.TopicCommentBox');
            const commentContent = parentElement.querySelector('.CommentContent');
            const contentToCopy = commentContent?.innerHTML;
            const reply = `<blockquote>${contentToCopy}</blockquote><br>`;
            editorBox.setData(reply);
            CommentBox.style.scrollMarginTop = "150px";
            CommentBox.scrollIntoView();
        });
    });



    // حذف التعليق
    const removeComeent = document.querySelectorAll('.removeComeent');

    for (let element of removeComeent) {
        if (!options?.session?.isLoggedIn) {
            element.style.display = "none";
        } else {
            element.addEventListener('click', async function (event) {
                const id = event.target.id;
                const { user_id } = extractUsernameAndUserId(id);
                if (user_id) {
                    if (options?.session?.username === username) {
                        const parentElement = event.currentTarget.closest('.TopicCommentBox');
                        const commentContent = parentElement.querySelector('.CommentContent');
                        const contentToCopy = commentContent?.id;
                        const { comment_id } = extractCommetId(contentToCopy)
                        const removeCommentURL = `${window.location.origin}/remove-comment`;
                        const removeCommentFetch = await fetch(removeCommentURL, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                user_id: user_id,
                                comment_id: comment_id,
                            }),
                        });
                        const response = await removeCommentFetch?.json();
                        if (response?.isRemoved) {
                            alertMessage.style.display = "block";
                            alertMessage.innerText = "تم حذف التعليق ✔️";
                            setTimeout(() => {
                                alertMessage.style.display = "none";
                            }, 5000);
                            commentContent.innerHTML = "تم حذف التعليق ✔️";
                        }
                    }
                }
            });

            const id = element.id;
            const { username, user_id } = extractUsernameAndUserId(id);
            if (options?.session?.username !== username) {
                element.style.display = "none";
            }
        }
    }

    let isCreated = false;
    CreateReply.addEventListener("click", async () => {

        if (isCreated) {
            return;
        }

        if (options?.session?.isLoggedIn) {

            const maxLength = 6000; // تحديد الحد الأقصى لطول النص
            const editorBoxValue = editorBox.getData();

            if (editorBoxValue.length < maxLength) {
                const createCommentURL = `${window.location.origin}/create-comment`;
                const createCommentFetch = await fetch(createCommentURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: options?.session?.user_id,
                        topic_id: options?.TopicJosn?.topic?.topic_id,
                        content: editorBoxValue?.substring(0, 6000),
                    }),
                });
                const response = await createCommentFetch?.json();

                if (response?.isCreatedComment) {
                    isCreated = true;
                    alertMessage.style.display = "block";
                    alertMessage.innerText = `تم إنشاء التعليق ✔️`;
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                        window.location.href = window.location.href;
                    }, 5000);
                }

                else {
                    alertMessage.style.display = "block";
                    alertMessage.innerText = "حدث خطأ, لايمكن اضافة التعليق ❌";
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                    }, 5000);
                }
            }

            else {
                alertMessage.style.display = "block";
                alertMessage.innerText = `يجب ان يكون طول النص اقل من ${maxLength}`;
                setTimeout(() => {
                    alertMessage.style.display = "none";
                }, 5000);
                editorBox.setData(`${editorBoxValue}<br><br> يجب ان يكون طول النص اقل من ${maxLength}`);
            }

        }
    });

    if (!options.session.isLoggedIn) {
        CommentBox.style.display = "none";
    }

    sharing.addEventListener("click", () => {
        sharingBox.style.display = "block";
    });

    copyLink.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        alertMessage.style.display = "block";
        alertMessage.innerText = "تم نسخ رابط الصفحة ✔️";
        setTimeout(() => {
            sharingBox.style.display = "none";
        }, 100);
        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 5000);
    });

    whatsappLink.addEventListener("click", () => {
        window.open(`https://api.whatsapp.com/send?text=${window.location.origin}/topic/${options?.TopicJosn?.topic?.topic_id}`, '_blank');
        setTimeout(() => {
            sharingBox.style.display = "none";
        }, 100);
    });

    telegramLink.addEventListener("click", () => {
        window.open(`https://t.me/share/url?url=${window.location.origin}/topic/${options?.TopicJosn?.topic?.topic_id}&text=${options?.TopicJosn?.topic?.title}`, '_blank');
        setTimeout(() => {
            sharingBox.style.display = "none";
        }, 100);
    });

    if (likeTopic) {
        let isLiked = false;
        likeTopic.addEventListener("click", async () => {
            const isLoggedIn = options?.session?.isLoggedIn;

            if (isLiked) {
                return;
            }

            if (isLoggedIn) {
                const user_id = options?.session?.user_id;
                const topic_id = options?.TopicJosn?.topic?.topic_id;

                const likeURL = `${window.location.origin}/like-topic`;
                const likeFetch = await fetch(likeURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        topic_id: topic_id,
                    }),
                });
                const response = await likeFetch?.json();
                if (response?.isLiked) {
                    isLiked = true;
                    alertMessage.style.display = "block";
                    alertMessage.innerText = response?.message;
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                        window.location.href = window.location.href;
                    }, 5000);
                }

                else {
                    alertMessage.style.display = "block";
                    alertMessage.innerText = response?.message;
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                    }, 5000);
                }

            }
        });
    }

    if (reportTopic) {
        let isReported = false;
        reportTopic.addEventListener("click", async () => {
            const isLoggedIn = options?.session?.isLoggedIn;
            if (isReported) {
                return;
            }

            if (isLoggedIn) {
                const user_id = options?.session?.user_id;
                const topic_id = options?.TopicJosn?.topic?.topic_id;

                const reportURL = `${window.location.origin}/report-topic`;
                const reportFetch = await fetch(reportURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        topic_id: topic_id,
                    }),
                });
                const response = await reportFetch?.json();
                if (response?.isReported) {
                    isReported = true;
                    alertMessage.style.display = "block";
                    alertMessage.innerText = response?.message;
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                        window.location.href = window.location.href;
                    }, 5000);
                }

                else {
                    alertMessage.style.display = "block";
                    alertMessage.innerText = response?.message;
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                    }, 5000);
                }

            }
        });
    }


    if (removeTopic) {
        let isDeleted = false;
        removeTopic.addEventListener("click", async () => {
            const isLoggedIn = options?.session?.isLoggedIn;
            if (isDeleted) {
                return;
            }

            if (isLoggedIn) {
                const user_id = options?.session?.user_id;
                const topic_id = options?.TopicJosn?.topic?.topic_id;

                const reportURL = `${window.location.origin}/remove-topic`;
                const reportFetch = await fetch(reportURL, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        topic_id: topic_id,
                    }),
                });
                const response = await reportFetch?.json();
                if (response?.isDeleted) {
                    isDeleted = true;
                    alertMessage.style.display = "block";
                    alertMessage.innerText = "تم حذف الموضوع ✔️";
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                        window.location.href = window.location.href;
                    }, 5000);
                }

                else {
                    alertMessage.style.display = "block";
                    alertMessage.innerText = "لم يتم حذف الموضوع ❌";
                    setTimeout(() => {
                        alertMessage.style.display = "none";
                    }, 5000);
                }

            }
        });
    }

    function extractUsernameAndUserId(id) {
        const regex = /username_(.*?)_user_id_(\d+)/;
        const matches = id.match(regex);
        if (matches) {
            const username = matches[1];
            const user_id = matches[2];
            return { username, user_id };
        }
        return null;
    }

    function extractCommetId(id) {
        const regex = /comment_id_(\d+)/;
        const matches = id.match(regex);
        if (matches) {
            const comment_id = matches[1];
            return { comment_id };
        }
        return null;
    }

});