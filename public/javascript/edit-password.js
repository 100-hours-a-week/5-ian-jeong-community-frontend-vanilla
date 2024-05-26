BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');


const profileImg = document.getElementById("profile-img");
const dropBox = document.getElementById("drop-down-box");
const userEditBtn = document.getElementById('user-edit-btn')
const passwordEditBtn = document.getElementById('password-edit-btn');

const passwordInput = document.getElementById("input-password");
const rePasswordInput = document.getElementById("input-password-double");
const passwordHelper = document.getElementById("password-helper-text");
const rePasswordHelper = document.getElementById("re-password-helper-text");
const editBtn = document.getElementById("edit-btn");
const editCompleteBtn = document.getElementById("edit-complete-btn");

let isCorrectPassword = false;
let isCorrectRePassword = false;



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


    document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement !== profileImg) {
            dropBox.style.visibility = "hidden";
        }
    });

    userEditBtn.addEventListener('click', (event) => {
        window.location.href=`/users/${userId}`;
    });

    passwordEditBtn.addEventListener('click', (event) => {
        window.location.href=`/users/${userId}/password`;
    });


    await fetch(`${BACKEND_IP_PORT}/users/${userId}`)
        .then(userData => userData.json())
        .then(userJson => {
            profileImg.src = userJson.result.profileImage;
        });



    
    passwordInput.addEventListener("input", (event) => {
        let value = event.target.value;

        if (!value) { 
            passwordHelper.style.visibility = "visible";
            passwordHelper.textContent = "*비밀번호를 입력해주세요";
            passwordHelper.style.color = "#FF0000";
            isCorrectPassword = false;

        } else if(!validatePasswordFormat(value)) { 
            passwordHelper.style.visibility = "visible";
            passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포합해야 합니다.";
            passwordHelper.style.color = "#FF0000";
            isCorrectPassword = false;

        } else {
            passwordHelper.style.color = "#0040FF";
            passwordHelper.textContent = "*사용가능한 비밀번호입니다.";
            isCorrectPassword = true;
        }

        validateAll();
    });




    rePasswordInput.addEventListener("input", (event) => {
        const value = event.target.value;

        if (!value) { 
            rePasswordHelper.style.visibility = "visible";
            rePasswordHelper.style.color = "#FF0000";
            rePasswordHelper.textContent = "*비밀번호를 한번 더 입력해주세요";
            isCorrectRePassword = false;

        } else if(!validatePasswordDouble()) {
            rePasswordHelper.style.visibility = "visible";
            rePasswordHelper.style.color = "#FF0000";
            rePasswordHelper.textContent = "*비밀번호가 다릅니다.";
            isCorrectRePassword = false;

        } else {
            rePasswordHelper.style.color = "#0040FF";
            rePasswordHelper.textContent = "*비밀번호가 일치합니다.";
            isCorrectRePassword = true;
        }

        validateAll();
    });




    editBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        if (isCorrectPassword && isCorrectRePassword) {
            executeToast();
            
            await setTimeout(async () => {
                editBtn.disabled = 'true';

                const obj = {
                    password : passwordInput.value,
                }
                    
                const data = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                }
            
                await fetch(`${BACKEND_IP_PORT}/users/${userId}/password`, data)
                    .then(response => {
                        editBtn.disabled = 'false';
                    if (response.status === 204) {
                        window.location.href = `/users/${userId}/password`;
                    } else {
                        alert('비밀번호 수정 실패');
                        window.location.href = `/users/${userId}/password`;
                    }
                  })
                  .catch(error => {
                    console.error('fetch error:', error);
                  });
                

            }, 2000);
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



function validatePasswordFormat(password) {
    const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    return passwordRegax.test(password);
}


function validatePasswordDouble() {
    const password = document.getElementById("input-password").value;
    const rePassowrd = document.getElementById("input-password-double").value;

    return password === rePassowrd;
}




function executeToast() {
    editCompleteBtn.style.marginTop = "5.9vh";
}


function validateAll() {
    if (isCorrectPassword && isCorrectRePassword) {
        editBtn.style.backgroundColor = '#7F6AEE';
        editBtn.disabled = false;
    } else {
        editBtn.style.backgroundColor = '#ACA0EB';
        editBtn.disabled = true;
    }
}