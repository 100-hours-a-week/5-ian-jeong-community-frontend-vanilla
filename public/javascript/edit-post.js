BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn');
const passwordEditBtn = document.getElementById('password-edit-btn');
const backBtn = document.getElementById("back-btn")

const titleInput = document.getElementById("title-input");
const title = document.getElementById("title-input");
const postInput = document.getElementById("post-input");
const imageInput = document.getElementById("image-selection");
const image = document.getElementById("image");
const fileName = document.getElementById("file-name");
const helperText = document.getElementById("helper-text");
const editBtn = document.getElementById("edit-btn");

const currentUrl = window.location.href;
const urlParams = currentUrl.split('/');
const postId = urlParams[urlParams.length - 2];


init();


async function init() {
    var userId = 0;
    const result = {
        id: 0
    }

    backBtn.addEventListener('click', () => {
        window.location.href=`/posts/${postId}`;
    }) 
    
    profileImg.addEventListener("click", () => {
        dropBox.style.visibility = "visible";
    });

    await getUserIdFromSession(result);
    userId = result.id;

    userEditBtn.addEventListener('click', (event) => {
        window.location.href=`/users/${userId}/edit`;
    });

    passwordEditBtn.addEventListener('click', (event) => {
        window.location.href=`/users/${userId}/password`;
    })


    document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement !== profileImg) {
            dropBox.style.visibility = "hidden";
        }
    });


    await fetch(`${BACKEND_IP_PORT}/users/${userId}`)
        .then(userData => userData.json())
        .then(userJson => {
            profileImg.src = userJson.result.profileImage;
        });


    titleInput.addEventListener("input", () => {
        const title = titleInput.value;
        const post = postInput.value;
    
        if (title.length > 26) {
            titleInput.value = title.slice(0, 26);
        }

        if (title && post) {
            editBtn.style.backgroundColor = '#7F6AEE';
            helperText.style.visibility = "hidden";
        } else {
            editBtn.style.backgroundColor = '#ACA0EB';        
        }
    });

    postInput.addEventListener('input', () => {
        const title = titleInput.value;
        const post = postInput.value;

        if (title && post) {
            editBtn.style.backgroundColor = '#7F6AEE';
            helperText.style.visibility = "hidden";
        } else {
            editBtn.style.backgroundColor = '#ACA0EB';       
        }
    });


    await fetch(`${BACKEND_IP_PORT}/posts/${postId}`)
        .then(postData => postData.json())
        .then(postJson => {
            titleInput.value = postJson.result.title;
            
            postInput.value = postJson.result.content;
            fileName.textContent = postJson.result.imageName;
            image.src = postJson.result.image;
    });


    editBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const post = postInput.value;
        const imageName = fileName.textContent;
        const imageUrl = image.src;

        if (!title || !post) {
            helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
            helperText.style.visibility = "visible";

        } else { 
            const obj = {
                title: title,
                content: post,
                imageName: imageName,
                image: imageUrl,
                hits: post.hits
            }
                
            const data = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        
            await fetch(`${BACKEND_IP_PORT}/posts/${postId}`, data)
                .then(response => {
                if (response.status === 204) {
                    alert('게시글이 수정되었습니다!');
                    window.location.href = `/posts/${postId}`;

                } else {
                    alert('게시글 수정 실패!');
                    window.location.href = `/posts/${postId}`;

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
        .then(user => {
            if (parseInt(user.result) !== 0) {
                result.id = user.result;
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
            image.src = e.target.result;
            fileName.textContent = imageInput.value.split('\\').pop();
        }
        reader.readAsDataURL(file); 
        
        return;
    } 
    
    image.src = "";
    fileName.textContent = "";
}
    