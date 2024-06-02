BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');

const currentUrl = window.location.href;
const urlParams = currentUrl.split('/');
const postId = parseInt(urlParams[urlParams.length - 1]); 

const postTitle = document.getElementById("post-title");
const postProfileImg = document.getElementById("post-profile-img");
const writer = document.getElementById("writer");
const time = document.getElementById("time");
const postImage = document.getElementById("post-img");
const postText = document.getElementById("post-text");
const hitsNum = document.getElementById("hits-num");
const commentsNum = document.getElementById("comments-num");

const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById("delete-btn"); 

const modalBack = document.getElementById("modal-back");
const modal = document.getElementById("modal");
const modalCancel = document.getElementById("modal-cancel"); 
const modalDelete = document.getElementById("modal-delete"); 

const commentModalCancel = document.getElementById("comment-modal-cancel");
const commentModalDelete = document.getElementById("comment-modal-delete");

const commentInput = document.getElementById("comment-input"); 
const addCommentBtn = document.getElementById("add-comment-btn");




init();



async function init() {
    var userId = 0;
    const result = {
        id: 0
    }

    await getUserIdFromSession(result);
    userId = result.id;

    profileImg.addEventListener("click", () => {
        dropBox.style.visibility = "visible";
    });

    userEditBtn.addEventListener('click', (event) => {
        window.open(`/users/${userId}`, "계정 업데이트", "width=620,height=600,top=0,left=0");
    });

    passwordEditBtn.addEventListener('click', (event) => {
        window.open(`/users/${userId}/password`, "비밀번호 수정", "width=620,height=600,top=0,left=0");
    });

    document.addEventListener('click', (event) => { 
        const clickedElement = event.target;
    
        if (clickedElement !== profileImg) {
            dropBox.style.visibility = "hidden";
        }
    });
    
    
    await fetch(`${BACKEND_IP_PORT}/users/${userId}`)
        .then(userData => userData.json())
        .then(userJson => {
            profileImg.src = userJson.result.image;
        });
    

    editBtn.addEventListener('click', (event) => {
        window.location.href=`/posts/${postId}/edit`;
    });

    deleteBtn.addEventListener('click', (event) => {
        modalBack.style.visibility = "visible";
        modal.style.visibility = "visible";

        document.body.overflow = 'hidden';
    });

    modalCancel.addEventListener('click', (event) => {
        modalBack.style.visibility = "hidden";
        modal.style.visibility = "hidden";

        document.body.style.overflow = "visible";
    });

    modalDelete.addEventListener('click', (event) => {
        fetch(`${BACKEND_IP_PORT}/posts/${postId}`, {method: 'DELETE'});
        alert('해당 게시글이 삭제되었습니다!');

        window.location.href= '/posts'; 
    });



    await fetch(`${BACKEND_IP_PORT}/posts/${postId}`) 
        .then(postData => postData.json()) 
        .then(async (postJson) => {
            postTitle.textContent = postJson.post.title;
            await fetch(`${BACKEND_IP_PORT}/users/${postJson.post.user_id}`) 
                .then(userData => userData.json())
                .then(userJson => {
                    if (parseInt(userId) !== parseInt(userJson.result.id)) {
                        editBtn.style.visibility = 'hidden';
                        deleteBtn.style.visibility = 'hidden';
                    }
                    
                    writer.textContent = userJson.result.nickname;
                    postProfileImg.src = userJson.result.image;
                });
            
            time.textContent = postJson.post.created_at;
            
            if (postJson.post.imageName == "") {
                postImage.style.display = "none";
            } 
            postImage.src = postJson.post.image;
            postText.textContent = postJson.post.content;
            hitsNum.textContent = makeShortNumber(parseInt(postJson.post.view_count));
            commentsNum.textContent = makeShortNumber(parseInt(postJson.post.comment_count));

            postJson.comments.forEach(comment => {

                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.id = comment.id;
                        
                const writerInfoBoxDiv = document.createElement('div');
                writerInfoBoxDiv.classList.add('writer-info-box');
                        
                const writerInfoDiv = document.createElement('div');
                writerInfoDiv.classList.add('writer-info');
                        
                const writerInfoImg = document.createElement('img');
                writerInfoImg.classList.add('writer-info-img');
                                
                const writerInfoIdDiv = document.createElement('div');
                writerInfoIdDiv.classList.add('writer-info-id');
                        
                                
                const writerInfoTimeDiv = document.createElement('div');
                writerInfoTimeDiv.classList.add('writer-info-time');
                writerInfoTimeDiv.textContent = comment.created_at;
                        
                const contentInput = document.createElement('input');
                contentInput.classList.add('content-info');
                contentInput.type = 'text';
                contentInput.value = comment.content;
                contentInput.readOnly = true;
                        
                const btnInfoDiv = document.createElement('div');
                btnInfoDiv.classList.add('btn-info');
                        
                const writerEditBtn = document.createElement('button');
                writerEditBtn.classList.add('writer-edit-btn');
                writerEditBtn.textContent = '수정';
                        
                const writerDeleteBtn = document.createElement('button');
                writerDeleteBtn.classList.add('writer-delete-btn');
                writerDeleteBtn.textContent = '삭제';
                        
                fetch(`${BACKEND_IP_PORT}/users/${comment.user_id}`) // 댓글 작성자 데이터 가져오기
                    .then(userData => userData.json())
                    .then(userJson => {
                        if (parseInt(userJson.result.id) !== parseInt(userId)) {
                            writerEditBtn.style.visibility = 'hidden';
                            writerDeleteBtn.style.visibility = 'hidden';
                        }
            
                        writerInfoImg.src = userJson.result.image;
                        writerInfoIdDiv.textContent = userJson.result.nickname;
                    });
                        
                writerInfoDiv.appendChild(writerInfoImg);
                writerInfoDiv.appendChild(writerInfoIdDiv);
                writerInfoDiv.appendChild(writerInfoTimeDiv);
                        
                writerInfoBoxDiv.appendChild(writerInfoDiv);
                writerInfoBoxDiv.appendChild(contentInput);
                        
                btnInfoDiv.appendChild(writerEditBtn);
                btnInfoDiv.appendChild(writerDeleteBtn);
                        
                commentDiv.appendChild(writerInfoBoxDiv);
                commentDiv.appendChild(btnInfoDiv);
                                
                writerEditBtn.addEventListener('click', async () => {  
                    addCommentBtn.textContent = "댓글 수정";
                    addCommentBtn.setAttribute("data-id", comment.id);
                    addCommentBtn.style.backgroundColor = "#7cc08c";
                    addCommentBtn.disabled = false;
            
                    commentInput.value = contentInput.value;
                });
                        
                        
                writerDeleteBtn.addEventListener('click', () => {
                    writerDeleteBtn.addEventListener('click', (event) => {
                        const modalBack = document.getElementById("modal-back");
                        modalBack.style.visibility = "visible";
                                
                        const commentModal = document.getElementById("comment-modal");
                        commentModal.style.visibility = "visible";
                        commentModal.setAttribute("data-id", comment.id);
                                
                        document.body.style.overflow = "hidden";
                    });
                });
                        
                document.getElementById('post-detail-whole').appendChild(commentDiv);
            })
        });

        
    commentInput.addEventListener('input', (event) => { 
        const value = event.target.value;

        if(value) {
            addCommentBtn.style.backgroundColor = "#7cc08c";
            addCommentBtn.disabled = false;
        } else {
            addCommentBtn.style.backgroundColor = "#8a9f8f";
            addCommentBtn.disabled = true;
        }
    });
        






    addCommentBtn.addEventListener('click', async (event) => { 
        if (addCommentBtn.textContent === "댓글 수정") {
            const obj = {
                text : `${commentInput.value}`
            }
        
            const data = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        
            await fetch(`${BACKEND_IP_PORT}/posts/${postId}/comments/${addCommentBtn.getAttribute("data-id")}`, data)
            .then(response => {
                if (response.status !== 204) {
                    alert('댓글 수정 실패!');
                }
                    
                    window.location.href= `/posts/${postId}`;
                })
                .catch(error => {
                    console.error('fetch error:', error);
                });

                window.location.href= `/posts/${postId}`;
        
        } else {
            const obj = {
                postId : postId,
                writer : userId,
                text : commentInput.value
            }
        
            const data = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        
            await fetch(`${BACKEND_IP_PORT}/posts/${postId}/comments`, data)
                .then(response => {
                if (response.status !== 201) {
                    alert('댓글 작성 실패!');
                }
                    
                window.location.href= `/posts/${postId}`;
                })
                .catch(error => {
                    console.error('fetch error:', error);
                });
            
        }
    });









    // await fetch(`${BACKEND_IP_PORT}/posts/${postId}/comments`) 
    //     .then(commentsData => commentsData.json())
    //     .then(commentsJson => {
    //         commentsJson.result.forEach(comment => {
            
    //         const commentDiv = document.createElement('div');
    //         commentDiv.classList.add('comment');
    //         commentDiv.id = comment.id;
            
    //         const writerInfoBoxDiv = document.createElement('div');
    //         writerInfoBoxDiv.classList.add('writer-info-box');
            
    //         const writerInfoDiv = document.createElement('div');
    //         writerInfoDiv.classList.add('writer-info');
            
    //         const writerInfoImg = document.createElement('img');
    //         writerInfoImg.classList.add('writer-info-img');
            
            
    //         const writerInfoIdDiv = document.createElement('div');
    //         writerInfoIdDiv.classList.add('writer-info-id');
            
            
            
            
    //         const writerInfoTimeDiv = document.createElement('div');
    //         writerInfoTimeDiv.classList.add('writer-info-time');
    //         writerInfoTimeDiv.textContent = comment.time;
            
    //         const contentInput = document.createElement('input');
    //         contentInput.classList.add('content-info');
    //         contentInput.type = 'text';
    //         contentInput.value = comment.text;
    //         contentInput.readOnly = true;
            
    //         const btnInfoDiv = document.createElement('div');
    //         btnInfoDiv.classList.add('btn-info');
            
    //         const writerEditBtn = document.createElement('button');
    //         writerEditBtn.classList.add('writer-edit-btn');
    //         writerEditBtn.textContent = '수정';
            
    //         const writerDeleteBtn = document.createElement('button');
    //         writerDeleteBtn.classList.add('writer-delete-btn');
    //         writerDeleteBtn.textContent = '삭제';
            
    //         fetch(`${BACKEND_IP_PORT}/users/${comment.writer}`) // 댓글 작성자 데이터 가져오기
    //             .then(userData => userData.json())
    //             .then(userJson => {
    //                 if (parseInt(userJson.result.id) !== parseInt(userId)) {
    //                     writerEditBtn.style.visibility = 'hidden';
    //                     writerDeleteBtn.style.visibility = 'hidden';
    //                 }

    //                 writerInfoImg.src = userJson.result.profileImage;
    //                 writerInfoIdDiv.textContent = userJson.result.nickname;
    //             });
            
    //         writerInfoDiv.appendChild(writerInfoImg);
    //         writerInfoDiv.appendChild(writerInfoIdDiv);
    //         writerInfoDiv.appendChild(writerInfoTimeDiv);
            
    //         writerInfoBoxDiv.appendChild(writerInfoDiv);
    //         writerInfoBoxDiv.appendChild(contentInput);
            
    //         btnInfoDiv.appendChild(writerEditBtn);
    //         btnInfoDiv.appendChild(writerDeleteBtn);
            
    //         commentDiv.appendChild(writerInfoBoxDiv);
    //         commentDiv.appendChild(btnInfoDiv);
            
            
            
    //         writerEditBtn.addEventListener('click', async () => {  
    //             addCommentBtn.textContent = "댓글 수정";
    //             addCommentBtn.setAttribute("data-id", comment.result.id);
    //             addCommentBtn.style.backgroundColor = "#7F6AEE";
    //             addCommentBtn.disabled = false;

    //             commentInput.value = contentInput.value;
    //         });
            
            
    //         writerDeleteBtn.addEventListener('click', () => {
    //             writerDeleteBtn.addEventListener('click', (event) => {
    //                 const modalBack = document.getElementById("modal-back");
    //                 modalBack.style.visibility = "visible";
                    
    //                 const commentModal = document.getElementById("comment-modal");
    //                 commentModal.style.visibility = "visible";
    //                 commentModal.setAttribute("data-id", comment.id);
                    
    //                 document.body.style.overflow = "hidden";
    //             });
    //         });
            
            
    //         document.body.appendChild(commentDiv);
    //     })
    // });

    const padding = document.createElement('div');
    padding.classList.add('padding');
    document.body.appendChild(padding);
    
    
    
    
    
    commentModalCancel.addEventListener('click', (event) => {
        const modalBack = document.getElementById("modal-back");
        modalBack.style.visibility = "hidden";
        
        const commentModal = document.getElementById("comment-modal");
        commentModal.style.visibility = "hidden";
        document.body.style.overflow = 'visible';
    });
    
    
    commentModalDelete.addEventListener('click', async (event) => { 
        const commentModal = document.getElementById("comment-modal");
        const modalBack = document.getElementById("modal-back");
        
        fetch(`${BACKEND_IP_PORT}/posts/${postId}/comments/${commentModal.getAttribute("data-id")}`, {method: 'DELETE'});
        

        alert('해당 댓글이 삭제되었습니다!');
        modalBack.style.visibility = "hidden";
        commentModal.style.visibility = "hidden";
        document.body.style.overflow = 'visible';
        
        window.location.href= `/posts/${postId}`; 
    });

}




async function getUserIdFromSession(result) {

    await fetch(`${BACKEND_IP_PORT}/users/session`, {credentials: 'include'})
        .then(response => response.json())
        .then(user => {
            if (parseInt(user.result) !== 0) {
                result.id = user.result;
            } else {
                alert('로그아웃 되었습니다 !');
                window.location.href = `/users/sign-in`;
            }
        });
}

function makeShortNumber(number) { 
    if (number >= 1000) {
        return (number / 1000).toFixed(0) + 'K';
                    
    } else {
        return number.toString(); 
    }
}