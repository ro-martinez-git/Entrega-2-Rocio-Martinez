const formLogin = document.getElementById('form-login');


if (localStorage.getItem('usuarioLogueado')) {
    window.location.href = '../pages/facturacion.html';
}

formLogin.addEventListener('submit', async function(e) {
    e.preventDefault();

    const userInput = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    if (!userInput || !passwordInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos'
        });
        return;
    }

    try {

        const response = await fetch('../data/usuarios.json');
        const usuariosJSON = await response.json();

        const usuariosLocal = JSON.parse(localStorage.getItem('usuarioRegistrado')) || [];

        const usuariosTotales = [...usuariosJSON, ...usuariosLocal];

        const usuario = usuariosTotales.find(u => u.email === userInput && u.password === passwordInput);

        if (usuario) {
            localStorage.setItem('usuarioLogueado', usuario.email);

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Redirigiendo a la página principal...',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '../pages/paciente.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o contraseña incorrectos'
            });
        }

    } catch (error) {
        console.error("Error cargando usuarios:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo verificar el usuario. Intenta nuevamente.'
        });
    }
});
