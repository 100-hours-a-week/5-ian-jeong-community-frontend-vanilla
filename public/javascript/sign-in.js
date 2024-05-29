
BACKEND_IP_PORT = localStorage.getItem('backend-ip-port');

const form = document.getElementById('sign-in-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const helperText = document.getElementById('helper-text'); 
const signInBtn = document.getElementById('sign-in-btn');


signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (await validateSignIn()) { 
        signInBtn.disabled = true;
        setTimeout(() => {
            signInBtn.style.backgroundColor = '#8fce92';
            signInBtn.disabled = false;
            window.location.href = '/posts';
        }, 3000);        
    }
});



async function validateSignIn() {
    const email = emailInput.value;
    const password = passwordInput.value;

	if (!validateEmailFormat(email)) { 
        helperText.style.visibility = 'visible'; 
        helperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";

        return false;
    }

    if (!password) {
        helperText.style.visibility = 'visible';
        helperText.textContent = "*비밀번호를 입력해주세요.";

        return false;
    }

    if(!validatePasswordFormat(password)) {
        helperText.style.visibility = 'visible';
        helperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포합해야 합니다.";

        return false;
    }

    const flag = {'flag' : false};

    await validateAccount(flag, email, password);
    
    if (flag['flag']) {
        document.getElementById('sign-in-btn').style.backgroundColor = '#409344';
        helperText.style.visibility = 'hidden';
        
        return flag['flag'];
    }
    
    helperText.style.visibility = 'visible';
    helperText.textContent = "*비밀번호가 다릅니다.";
    
            
    return flag['flag'];
}


function validateEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailRegex.test(email);
}


function validatePasswordFormat(password) {
    const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    return passwordRegax.test(password);
}

async function validateAccount(flag, email, password) {
    const obj = {
        email : `${email}`,
        password : `${password}`
    }

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
        credentials: 'include'
    }
    
    await fetch(`${BACKEND_IP_PORT}/users/sign-in`, data) 
        .then(isAuthenticated => isAuthenticated.json())
        .then(isAuthenticatedJson => {
            console.log(`게정 검증결과: ${isAuthenticatedJson.result}`);
             if(isAuthenticatedJson.result === true) {
                flag['flag'] = true;
             }
        });
}
