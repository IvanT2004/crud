const bcrypt = require('bcryptjs');

const password = 'NuevaContraseñaSegura123*';
const hash = '$2a$10$p2S9ErEbLK6pVCWKPhisleaoxmroYC08JUi274z3ELr1TKhl1WFhS'; // Hash de la base de datos

bcrypt.compare(password, hash, function(err, isMatch) {
    if (err) {
        console.error('Error comparing:', err);
    } else {
        console.log('Is match:', isMatch); // Debería imprimir true si coinciden
    }
});
