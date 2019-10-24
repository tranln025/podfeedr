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
        console.log(element.value);

        // Form is invalid if input is empty
        if (element.value === '') {
            formIsValid = false;
            $(element).addClass('is-invalid');
            $(element).parent('div').append(`
                <div class="invalid-feedback">
                    Please enter your ${element.name}.
                </div>
            `);

        // Form is invalid if password is <4 chars
        } else if (element.type === 'password' && element.value.length < 4) {
            formIsValid = false;
            console.log(element);
            $(element).addClass('is-invalid');
            $(element).parent('div').append(`
                <div class="invalid-feedback">
                    Password must be at least 4 characters.
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
        }

        // If all inputs are valid, form is valid and store input values in userData object
        if (formIsValid) {
            userData[element.name] = element.value;
        };



    // SECTION If signup form is valid & passwords match, store data in database
    if (form.id === 'signup' && formIsValid) {

        // Check if passwords match
        if ($(`#password`).val() !== $(`#password2`).val()) {
            if (element.type === "password") {
                $(element).addClass('is-invalid');
                $(element).parent('div').append(`
                    <div class="invalid-feedback">
                        Passwords do not match.
                    </div>
                `);
            };
        } else {
            // console.log('userData: ', userData);
            fetch('/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(dataStream => dataStream.json())
            .then(res => {
                console.log(res);
                if (res.status === 201) return window.location = '/signin';
            })
            .catch(err => console.log(err));
        };
    };

    // SECTION If sign-in form is valid, store data
    if (form.id === 'signin' && formIsValid) {
        console.log('Submitting user signin: ', userData);
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
                $(`#password`).after(`
                    <div class="error-msg">
                        Username or password is incorrect. Please try again.
                    </div>
                `)
            }
            if (res.status === 201) {
                window.sessionStorage.setItem(`userId`, `${res.data.id}`);
                console.log(res);
                window.sessionStorage.setItem(`username`, `${userData.username}`);
                return window.location = `/feed/${res.data.id}`
            };
        })
        .catch(err => console.log(err));
    };
});
});