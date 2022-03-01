function menuToggle() {

    let menu = document.querySelector('.menu');
    menu.classList.toggle('active');

    let links = document.querySelectorAll('.menu a');
    links.forEach(e => e.addEventListener('click', () => menu.classList.remove('active')));

    let buttons = document.querySelectorAll('.menu button');
    buttons.forEach(e => e.addEventListener('click', () => menu.classList.remove('active')));
}


/* SHORTEN URL*/

/* API LINK DOCUMENTATION : https://shrtco.de/docs/ */

const apiLink = 'https://api.shrtco.de/v2/';

const shortenLinkAreas = document.querySelector('.shorten-link-areas');
const inputLink = document.querySelector('.shorten input');

const shortenedLinks = JSON.parse(sessionStorage.getItem('shortenedLinks')) || [];


if (shortenedLinks != '') {


    shortenedLinks.forEach(element => {

        shortenLinkAreas.classList.add('active');

        let shortenLinkArea = document.createElement('div');
        shortenLinkArea.classList.add('shorten-link-area');

        shortenLinkAreas.appendChild(shortenLinkArea);

        let link = document.createElement('p');
        link.classList.add('link');
        link.textContent = element[0];

        let shortenLink = document.createElement('input');
        shortenLink.type = 'text';
        shortenLink.classList.add('shorten-link');
        shortenLink.value = element[1];
        shortenLink.readOnly = true;

        let buttonSubmit = document.createElement('button');
        buttonSubmit.classList.add('button-submit');
        buttonSubmit.textContent = 'Copy';

        shortenLinkArea.appendChild(link);
        shortenLinkArea.appendChild(shortenLink);
        shortenLinkArea.appendChild(buttonSubmit);

        buttonSubmit.addEventListener('click', (e) => {
            shortenLink.select();
            document.execCommand('copy');

            e.target.style.backgroundColor = 'hsl(257, 27%, 26%)';
            e.target.textContent = 'Copied!';

            setTimeout(() => {
                buttonSubmit.style.backgroundColor = 'hsl(180, 66%, 49%)';
                buttonSubmit.textContent = 'Copy';
            }, 5000);
        })
    });
}

function apiFunction(event) {

    event.preventDefault();

    // Use regular function to check valid http://www.example.com format
    let urlRegex = /^(http|https)(:\/\/)/;

    const inputLinkValue = inputLink.value;

    let spanError = document.querySelector('.shorten span');

    if (urlRegex.test(inputLinkValue)) {
        disableInputAndButton(event);
        shortenLinkAreas.classList.add('active');

        apiFetch(event, inputLinkValue);

        inputLink.classList.remove('error');
        spanError.classList.remove('error');
    } else {
        inputLink.classList.add('error');
        spanError.classList.add('error');
    }
}

/* SHORTEN */

// DISABLE INPUT BUTTON
function disableInputAndButton(event) {
    inputLink.setAttribute('disabled', 'disable');
    event.target.disabled = true;
}

// ENABLE INPUT BUTTON
function activeInputAndButton(event) {
    inputLink.removeAttribute('disabled');
    event.target.disabled = false;
}

// CREATE PAGE ELEMENTS
function createElements(inputLinkValue) {
    let shortenLinkArea = document.createElement('div');
    shortenLinkArea.classList.add('shorten-link-area');

    shortenLinkAreas.appendChild(shortenLinkArea);

    let link = document.createElement('p');
    link.classList.add('link');
    link.textContent = inputLinkValue;

    let shortenLink = document.createElement('input');
    shortenLink.type = 'text';
    shortenLink.classList.add('shorten-link');
    shortenLink.value = 'Loading...';
    shortenLink.readOnly = true;

    let buttonSubmit = document.createElement('button');
    buttonSubmit.classList.add('button-submit');
    buttonSubmit.textContent = 'Copy';

    shortenLinkArea.appendChild(link);
    shortenLinkArea.appendChild(shortenLink);
    shortenLinkArea.appendChild(buttonSubmit);

    return { shortenLinkArea, link, shortenLink, buttonSubmit };
}

function apiFetch(event, inputLinkValue) {

    const { shortenLink, buttonSubmit } = createElements(inputLinkValue);

    fetch(`${apiLink}shorten?url=${inputLinkValue}`)
        .then(response => response.json())
        .then(response => {

            let shortenedLink = response.result.short_link;
            shortenLink.value = shortenedLink;

            // CREATE SESSION IN LOCAL STORAGE
            shortenedLinks.push([inputLinkValue, shortenedLink]);
            sessionStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks));

            activeInputAndButton(event);


            buttonSubmit.addEventListener('click', (e) => {
                shortenLink.select();
                document.execCommand('copy');

                e.target.style.backgroundColor = 'hsl(257, 27%, 26%)';
                e.target.textContent = 'Copied!';

                setTimeout(() => {
                    buttonSubmit.style.backgroundColor = 'hsl(180, 66%, 49%)';
                    buttonSubmit.textContent = 'Copy';
                }, 5000);
            })
        })
        .catch((error) => {
            console.log(error);
            shortenLink.value = 'Invalid link!';
            shortenLink.style.color = 'red';
            activeInputAndButton(event);
        })
}