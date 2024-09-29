const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
];


// form.addEventListener('submit', event => {
//     event.preventDefault();
//     const form = document.forms[0];
//     const output = document.getElementById('encrypt-output');
//     output.innerHTML = [...form.plaintext.value].map(char => encrypt(char)).join('');
// }
// );

function tryEncrypt() {
    const form = document.forms[0];
    const output = document.getElementById('encrypt-output');
    output.innerHTML = [...form.plaintext.value].map(char => encrypt(char)).join('');    
}

function encrypt(char) {
    const form = document.forms[0];
    const shift = Number(form.shift.value);
    if (alphabet.includes(char.toUpperCase())) {
        const position = alphabet.indexOf(char.toUpperCase());
        const newPosition = (position + shift) % 26;
        return alphabet[newPosition]
    }
    else { return char }
}

function tryDecrypt() {
    const textArea = document.getElementById('cipherText');
    const cipherText = textArea.value;
    let result = "";

    // Iterate through all possible shifts (0-25)
    for (let shift = 0; shift < 26; shift++) {
        result += `Shift ${shift}: ${caesarDecrypt(cipherText, shift)}\n`;
    }

    document.getElementById('decrypt-output').innerText = result;
}

function caesarDecrypt(cipherText, shift) {
    return cipherText.split('').map(char => {
        if (char.match(/[a-z]/)) {
            // For lowercase letters
            return String.fromCharCode((char.charCodeAt(0) - 97 - shift + 26) % 26 + 97);
        } else if (char.match(/[A-Z]/)) {
            // For uppercase letters
            return String.fromCharCode((char.charCodeAt(0) - 65 - shift + 26) % 26 + 65);
        } else {
            // Non-alphabetic characters remain unchanged
            return char;
        }
    }).join('');
}
