const form = document.querySelector('form');

// If form is not falsey, listen for form submit event
form && form.addEventListener('submit', (event) => {
    let formIsValid = true;
    const userData = {};
    event.preventDefault();
    $('.invalid-feedback').remove();
    $('input').removeClass('is-invalid');

    // For each input,
    $('input').each((index, element) => {

        // Form is invalid if input is empty
        if (element.value === '') {
            formIsValid = false;
            $(element).addClass('is-invalid');
            if (element.name === 'password2') {
                $(element).parent('div').append(`
                    <div class="invalid-feedback">
                        Please confirm your password.
                    </div>
                `)
            } else {
            $(element).parent('div').append(`
                <div class="invalid-feedback">
                    Please enter your ${element.name}.
                </div>
            `)};
        // Form is invalid if password is <8 chars
        } else if (element.type === 'password' && element.value.length < 8) {
            formIsValid = false;
            $(element).addClass('is-invalid');
            $(element).parent('div').append(`
                <div class="invalid-feedback">
                    Password must be at least 8 characters.
                </div>
            `);
        } else if (element.type === 'email' && !RegExp('[^@]+@([^@]\.)+([^@]+)').test(element.value)) {
            formIsValid = false;
            $(element).addClass('is-invalid');
            $(element).parent('div').append(`
                <div class="invalid-feedback">
                    Please enter a valid email address.
                </div>
            `);
        } else if (form.id === 'signup') {
            if ($(`#password`).val() !== $(`#password2`).val()) {
                formIsValid = false;
                if (element.type === "password") {
                    $(element).addClass('is-invalid');
                    $(element).parent('div').append(`
                        <div class="invalid-feedback">
                            Passwords do not match.
                        </div>
                    `);
                };
            }
        }

        // If all inputs are valid, form is valid and store input values in userData object
        if (formIsValid) {
            userData[element.name] = element.value;
        };
    });

    // SECTION If signup form is valid & passwords match, store data in database
    if (form.id === 'signup' && formIsValid) {
        fetch('/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(dataStream => dataStream.json())
        .then(res => {
            if (res.status === 201) return window.location = '/signin';
        })
        .catch(err => console.log(err));
    };


    // SECTION If sign-in form is valid, store data
    if (form.id === 'signin' && formIsValid) {
        fetch('/api/v1/signin', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(dataStream => dataStream.json())
        .then(res => {
            if (res.status === 400) {
                $('#password').addClass('is-invalid');
                $(`#password`).parent('div').append(`
                    <div class="invalid-feedback">
                        Username or password is incorrect. Please try again.
                    </div>
                `);
            }
            if (res.status === 201) {
                window.sessionStorage.setItem(`userId`, `${res.data.id}`);
                window.sessionStorage.setItem(`username`, `${userData.username}`);
                return window.location = `/feed/${res.data.id}`
            };
        })
        .catch(err => console.log(err));
    };
});
// });
