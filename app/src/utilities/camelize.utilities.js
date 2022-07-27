export const camelize = (str) => {
    const palabras = str.split(" ");
    for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1).toLowerCase();
    }
    return palabras.join(" ");
};