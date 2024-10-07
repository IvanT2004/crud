function elementosComunesONo(array1, array2, esComun) {
    let resultado = [];
    
    if (esComun) {
        // Buscar elementos comunes
        for (let i = 0; i < array1.length; i++) {
            if (array2.includes(array1[i])) {
                resultado.push(array1[i]);
            }
        }
    } else {
        // Buscar elementos no comunes
        for (let i = 0; i < array1.length; i++) {
            if (!array2.includes(array1[i])) {
                resultado.push(array1[i]);
            }
        }
        for (let i = 0; i < array2.length; i++) {
            if (!array1.includes(array2[i])) {
                resultado.push(array2[i]);
            }
        }
    }

    return resultado;
}

// Ejemplos
let array1 = [1, 2, 3, 4];
let array2 = [2, 4, 5, 6, 7];

// Caso booleano verdadero (comunes)
console.log(elementosComunesONo(array1, array2, true));  // [2, 4]

// Caso booleano falso (no comunes)
console.log(elementosComunesONo(array1, array2, false));  // [1, 3, 5, 6, 7]
