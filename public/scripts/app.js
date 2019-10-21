const form = document.querySelector('form');

// If form is not falsey, listen for form submit event
form && form.addEventListener('submit', (event) => {
    let formIsValid = true;
    const userData = {};
    event.preventDefault();

    $('input').each((index, element) => {
        console.log(element.value);
        
        if (element.value === '') {
            formIsValid = false;
            $(element).addClass('input-error');
            $(element).parent('div').append(`
                <div>
                    Please enter your ${element.name}.
                </div>
            `)
        } else if (element.type === 'password' && element.value.length < 4) {
            formIsValid = false;
            console.log(element);
            $(element).addClass('input-error');
            $(element).parent('div').append(`
                <div>
                    Password must be at least 4 characters.
                </div>
            `)
        } else if ($(`#password`).val() !== $(`#password2`).val()) {
            formIsValid = false;
            if (element.type === "password") {
                $(element).addClass('input-error');
                $(element).parent('div').append(`
                    <div>
                        Passwords do not match.
                    </div>
                `);    
            }
        };

        if (formIsValid) {
            userData[element.name] = element.value;
        };
    });
    

    // SECTION Handle Signup Form
    if (form.id === 'signup' && formIsValid) {
        console.log('Submitting new user --> ', userData);
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
            if (res.status === 201) return window.location = '/feed';
        })
        .catch(err => console.log(err));
    };

    // SECTION Handle Sign In
    if (form.id === 'signin' && formIsValid) {
        console.log('Submitting user signin --> ', userData);
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
            console.log(res);
            if (res.status === 201) return window.location = `/feed/${res.data.id}`;
        })
        .catch(err => console.log(err));
    };
});

