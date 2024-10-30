
document.addEventListener("DOMContentLoaded", function () {

    const formContainer = document.getElementById('coupon-form-container');
    const resultForm = document.getElementById('result-form');
    const couponCodeElement = document.getElementById('coupon-code');
    const closeButton = document.querySelector(".close-btn");
    const closeButtonResult = document.querySelector(".close-btn-result");
    const topbar = document.getElementById('topbar');
    const bottombar = document.getElementById('bottombar');
    const nothanksbtn = document.getElementById('btn-no-thank');
    const containerElement = document.getElementById('coupon-form-container');
    const formContentElement = document.getElementById('form-content');
    const headerColor = containerElement.getAttribute('data-header-color');
    const contentColor = containerElement.getAttribute('data-content-color');
    const fontSize = containerElement.getAttribute('data-font-size');
    const fontSizeContent = containerElement.getAttribute('data-font-size-content');
    const borderRadius = containerElement.getAttribute('data-border-radius');
    const backgroundColor = formContentElement.getAttribute('data-background-color');
    const fontWeights = containerElement.getAttribute('data-bold-text');
    const namebox = document.getElementById('namebox');
    const getName = containerElement.getAttribute('data-checkbox-name');
    const phoneInput = document.getElementById('phone-input');
    const getPhone = formContainer.getAttribute('data-checkbox-phone');
    const emailInput = document.getElementById('email-input');
    const getEmail = formContainer.getAttribute('data-checkbox-email');
    const agreeBox = document.getElementById('agree-box');
    const acceptTerms = formContainer.getAttribute('data-checkbox-terms');
    const submitButton = document.getElementById('btn-submit');
    const buttonType = document.getElementById('coupon-form-container').getAttribute('data-type-button-submit');
    const buttonBackgroundColor = containerElement.getAttribute('data-background-button-color');
    const textColor = containerElement.getAttribute('data-text-button-color');

    // let visitorCloseOption;
    // let initialTime;
    // let noThanksSetting;
    // let subscribeReminder;
    // let forbiddenDomains = [];

    if (headerColor) {
        document.getElementById('header-title').style.color = headerColor;
    }
    if (contentColor) {
        document.getElementById('content-text').style.color = contentColor;
    }
    if (fontSize) {
        document.documentElement.style.setProperty('--font-size', fontSize + 'px');
    }
    if (fontSizeContent) {
        document.documentElement.style.setProperty('--font-size-content', fontSizeContent + 'px');
    }
    if (borderRadius) {
        document.documentElement.style.setProperty('--border-radius', borderRadius + 'px');
    }
    if (backgroundColor) {
        formContentElement.style.backgroundColor = backgroundColor;
    }
    if (fontWeights) {
        document.documentElement.style.setProperty('--font-weight', fontWeights ? 'bold' : 'normal');
    }
    if (getName === 'true') {
        namebox.style.display = 'flex';
    } else {

        namebox.style.display = 'none';
    }

    if (getPhone === 'true') {
        phoneInput.style.display = 'flex';
    } else {
        phoneInput.style.display = 'none';
    }

    if (getEmail === 'true') {
        emailInput.style.display = 'flex';
    } else {
        emailInput.style.display = 'none';
    }

    if (acceptTerms === 'true') {
        agreeBox.style.display = 'flex';
    } else {
        agreeBox.style.display = 'none';
    }

    if (buttonType === 'Short') {
        submitButton.classList.add('short');
    } else {
        submitButton.classList.remove('short');
    }

    if (buttonBackgroundColor) {
        submitButton.style.backgroundColor = buttonBackgroundColor;
    }
    if (textColor) {
        submitButton.style.color = textColor;
    }


    // if (localStorage.getItem('noThanksSetting') === 'true') {
    //     formContainer.style.display = 'none';
    // }


    // function minimizeForm(option) {
    //     formContainer.style.display = 'none';
    //     if (option === 'Minimize to topbar') {
    //         topbar.style.display = 'flex';
    //     } else if (option === 'Minimize to bottombar') {
    //         bottombar.style.display = 'flex';
    //     }
    // }

    // function showPopup() {
    //     formContainer.style.display = 'flex';
    // }

    // function setupPopupTrigger(popupTrigger, initialTime) {
    //     if (popupTrigger === 'After initial time') {
    //         setTimeout(function () {
    //             showPopup();
    //         }, initialTime * 1000);
    //     } else if (popupTrigger === 'When users scroll') {
    //         window.addEventListener('scroll', function () {
    //             if (window.scrollY > 500) {
    //                 showPopup();
    //             }
    //         });
    //     } else if (popupTrigger === 'When users are about to exit') {
    //         document.addEventListener('mousemove', function (e) {
    //             if (e.clientY < 50) {
    //                 showPopup();
    //             }
    //         });
    //     }
    // }

    // closeButton.addEventListener('click', function () {
    //     if (visitorCloseOption === 'Minimize to topbar') {
    //         minimizeForm('Minimize to topbar');
    //     } else if (visitorCloseOption === 'Minimize to bottombar') {
    //         minimizeForm('Minimize to bottombar');
    //     }
    // });

    // document.getElementById('topbar').addEventListener('click', function () {
    //     formContainer.style.display = 'flex';
    //     topbar.style.display = 'none';
    // });

    // document.getElementById('bottombar').addEventListener('click', function () {
    //     formContainer.style.display = 'flex';
    //     bottombar.style.display = 'none';
    // });

    // nothanksbtn.addEventListener('click', function () {
    //     if (noThanksSetting === true) {
    //         localStorage.setItem('noThanksSetting', 'true');
    //         formContainer.style.display = 'none';
    //     } else {
    //         formContainer.style.display = 'none';
    //     }
    // });

    // closeButtonResult.addEventListener("click", function () {
    //     resultForm.style.display = 'none';
    // });


    // async function fetchGeneralSettings() {
    //     try {
    //         const response = await fetch("http://localhost:50398/get-general-setting");
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }

    //         const data = await response.json();

    //         const settings = data.settings.generalSetting[0];

    //         const visitorCloseOption = settings.visitor_close_option;
    //         const popupTrigger = settings.popup_trigger;
    //         const initialTime = settings.initial_time;
    //         const noThanksSetting = settings.no_thanks_reminder;
    //         const subscribeReminder = settings.subscribe_reminder;
    //         const forbiddenDomains = settings.email_domains.split(',').map(domain => domain.trim());

    //         if (localStorage.getItem('noThanksSetting') === 'true') {
    //             formContainer.style.display = 'none';
    //         } else {
    //             setupPopupTrigger(popupTrigger, initialTime);
    //         }

    //         document.getElementById('popup-trigger').value = popupTrigger;
    //         document.getElementById('initial-time').value = initialTime;
    //         document.getElementById('no-thanks-reminder').checked = noThanksSetting;
    //         document.getElementById('reminder-time').value = settings.reminder_time;
    //         document.getElementById('reminder-unit').value = settings.reminder_unit;
    //         document.getElementById('subscribe-reminder').value = subscribeReminder;
    //         document.getElementById('email-domains').value = settings.email_domains;

    //     } catch (error) {
    //         console.error('Error fetching settings:', error);
    //     }
    // }
    // fetchGeneralSettings();


//     document.getElementById('coupon-form').addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const recaptchaResponse = document.getElementById('g-recaptcha-response').value || grecaptcha.getResponse();

//         console.log('reCAPTCHA response:', recaptchaResponse);

//         const data = {
//             firstname: document.getElementById('firstname-input').value,
//             lastname: document.getElementById('lastname-input').value,
//             email: document.getElementById('email-input').value,
//             phone: document.getElementById('phone-input').value,
//             agree: document.getElementById('agree').checked,
//             'g-recaptcha-response': recaptchaResponse
//         };


//         const email = data.email.toLowerCase();

//         const isEmailValid = forbiddenDomains.every(domain => !email.endsWith(domain));

//         if (!isEmailValid) {
//             alert('We do not accept this email domain: ' + forbiddenDomains.join(', '));
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:3000/user/request-coupon', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             const result = await response.json();

//             if (response.status !== 200) {
//                 alert('Error: ' + result.message);
//                 return;
//             }

//             formContainer.style.display = 'none';
//             couponCodeElement.textContent = result.couponCode;
//             resultForm.style.display = 'flex';


//             // localStorage.setItem('formSubmitted', 'true');
//             // const reminderTimeInDays = parseInt(subscribeReminder);
//             // const reminderTimeInMilliseconds = reminderTimeInDays * 24 * 60 * 60 * 1000;

//             // setTimeout(function () {
//             //     formContainer.style.display = 'flex';
//             //     localStorage.removeItem('formSubmitted');
//             // }, reminderTimeInMilliseconds);

//         } catch (error) {
//             console.error('Error:', error);
//         }
//     });

//     async function fetchCapchaSetting() {
//         try {
//             const response = await fetch('http://localhost:50398/get-capcha-setting');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }


//             const data = await response.json();


//             if (data.is_enabled) {
//                 if (data.version === 'v2') {
//                     await fetchSiteKeyV2();
//                 } else if (data.version === 'v3') {
//                     await fetchSiteKeyV3();
//                 }
//             } else {
//                 const recaptchaElement = document.getElementById('g-recaptcha');
//                 recaptchaElement.style.display = 'none';
//             }
//         } catch (error) {
//             console.error('Error fetching capcha setting:', error);
//         }
//     }

//     fetchCapchaSetting();


//     async function fetchSiteKeyV2() {
//         try {
//             const response = await fetch('http://localhost:3000/get-site-key');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             const siteKey = data.site_key;
//             if (siteKey) {
//                 const recaptchaElement = document.getElementById('g-recaptcha');
//                 recaptchaElement.setAttribute('data-sitekey', siteKey);
//                 grecaptcha.render(recaptchaElement, { 'sitekey': siteKey });
//             } else {
//                 console.error('Site_key was not found in the response.');
//             }
//         } catch (error) {
//             console.error('Error fetching site key:', error);
//         }
//     }

//     async function fetchSiteKeyV3() {
//         try {
//             const response = await fetch('http://localhost:3000/get-site-key');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             const siteKey = data.site_key;
//             if (siteKey) {
//                 grecaptcha.ready(function () {
//                     grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
//                         document.getElementById('g-recaptcha-response').value = token;
//                         console.log('reCAPTCHA v3 token generated:', token);
//                     });
//                 });
//             } else {
//                 console.error('Site_key was not found in the response.');
//             }
//         } catch (error) {
//             console.error('Error fetching site key:', error);
//         }
//     }
});
