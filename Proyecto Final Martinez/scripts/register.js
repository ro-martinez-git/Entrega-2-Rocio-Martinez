const formRegister = document.getElementById('form-register');

if (localStorage.getItem('loggedUser')) {
    window.location.href = '../pages/facturacion.html';
}

formRegister.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirm = document.getElementById('reg-confirm').value.trim();

    if (!name || !email || !password || !confirm) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos'
        });
        return;
    }

    if (password !== confirm) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseñas diferentes',
            text: 'La contraseña y la confirmación no coinciden'
        });
        return;
    }

    
    let usuarioRegistrado = JSON.parse(localStorage.getItem('usuarioRegistrado')) || [];

    const existe = usuarioRegistrado.some(u => u.email === email);
    if (existe) {
        Swal.fire({
            icon: 'error',
            title: 'Correo ya registrado',
            text: 'Ingresa otro correo o inicia sesión'
        });
        return;
    }

  
    usuarioRegistrado.push({ name, email, password });
    localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioRegistrado));

    Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Serás redirigido al login',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        window.location.href = 'login.html';
    });
});
