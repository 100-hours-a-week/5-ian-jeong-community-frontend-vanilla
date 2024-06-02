BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const backBtn = document.getElementById("back-btn")
const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');

const titleInput = document.getElementById("title-input");
const postInput = document.getElementById("post-input");
const fileInput = document.getElementById("file-input");
const postImage = document.getElementById("post-image");
const completeBtn = document.getElementById("complete-btn");
const helperText = document.getElementById("helper-text");

const postPreviewTitle = document.getElementById("post-preview-title");
const postPreviewImage = document.getElementById("post-preview-image");
const postPreviewContent = document.getElementById("post-preview-content");



init()



async function init() {
    var userId = 0;
    const result = {
        id: 0
    }

    await getUserIdFromSession(result);
    userId = result.id;

    backBtn.addEventListener('click', () => {
        window.location.href=`/posts`;
    }) 
    

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
        })
    
    
    titleInput.addEventListener("input", (event) => {
        const title = titleInput.value;
        const post = postInput.value;
        postPreviewTitle.textContent = titleInput.value; 
        
        if (title.length > 26) {
            titleInput.value = title.slice(0, 26);
            postPreviewTitle.textContent = titleInput.value; 
        }
        
        if (title && post) {
            completeBtn.style.backgroundColor = '#b6d2bd';
            helperText.style.visibility = "hidden";
        } else {
            completeBtn.style.backgroundColor = '#8a9f8f';        
        }
    });

    postInput.addEventListener('input', () => {
        const title = titleInput.value;
        const post = postInput.value;
        postPreviewContent.textContent = postInput.value;

        if (title && post) {
            completeBtn.style.backgroundColor = '#b6d2bd';
            helperText.style.visibility = "hidden";
        } else {
            completeBtn.style.backgroundColor = '#8a9f8f';       
        }
    });




    completeBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const post = postInput.value;
        const file = fileInput.value.split('\\').pop();
        const image = postImage.src;

        if (!title || !post) {
            helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
            helperText.style.visibility = "visible";

        } else { 
            const obj = {
                userId : userId,
                title: title,
                content: post,
                imageName: file,
                image: image
            }
                
            const data = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        
            await fetch(`${BACKEND_IP_PORT}/posts`, data)
                .then(response => {
                if (response.status === 201) {
                    alert('게시글이 생성되었습니다!');
                    window.location.href = '/posts';

                } else {
                    alert('게시글 작성 실패!');
                    window.location.href = '/posts';

                }
              })
              .catch(error => {
                console.error('fetch error:', error);
              });
            
        }
    });
}




async function getUserIdFromSession(result) {
    await fetch(`${BACKEND_IP_PORT}/users/session`, {credentials: 'include'})
        .then(response => response.json())
        .then(responseJson => {
            if (parseInt(responseJson.result) !== 0) {
                result.id = responseJson.result;
            } else {
                alert('로그아웃 되었습니다 !');
                window.location.href = `/users/sign-in`;
            }
        });
}


function addImage(event) {
    const file = event.target.files[0]; 
    
    if (file) { 
        const reader = new FileReader();

        reader.onload = function(e) {
            postImage.src = e.target.result;
            postPreviewImage.src = e.target.result;
        }
        reader.readAsDataURL(file); 
    
        return;
    } 

    postPreviewImage.src = "";
    document.getElementById("file-input").value = "";
}




