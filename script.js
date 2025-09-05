const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnLoginSup = document.querySelector('#btnLoginSup');
const iconClose = document.querySelector('.icon-close');


iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnLoginSup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});


