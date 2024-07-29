document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('convert-button').addEventListener('click', convert);
    document.getElementById('clear-button').addEventListener('click', clearFields);
    document.getElementById('download-button').addEventListener('click', downloadOutput); 
});

// Handles the conversion based on the input values
function convert() {
    let number = document.getElementById("number").value.trim();
    let base = document.getElementById("base").value;
    let exponent = parseInt(document.getElementById("exponent").value.trim() || "0", 10);

    // Check for special values (case insensitive)
    if (number.toLowerCase() === 'nan') {
        handleNaN(false, false);
        return;
    } else if (number.toLowerCase() === 'snan') {
        handleNaN(true, false);
        return;
    } else if (number.toLowerCase() === 'qnan') {
        handleNaN(false, true);
        return;
    } else if (number.toLowerCase() === 'infinity') {
        handleInfinity(false);
        return;
    } else if (number.toLowerCase() === '-infinity') {
        handleInfinity(true);
        return;
    } else if (number === '-0') {
        handleNegativeZero();
        return;
    } else if (number === '0') {
        handlePositiveZero();
        return;
    }

    if (!number || isNaN(exponent)) {
        alert("Please ensure all fields are filled in correctly.");
        return;
    }

    let result = base === '2' ? convertBase2(number, exponent) : convertBase10(number, exponent);
    document.getElementById('binaryOutput').textContent = result.binary;
    document.getElementById('hexOutput').textContent = result.hex;
}

// Convert a binary string to IEEE-754 format
function convertBase2(binaryString, exponent) {
    let sign = binaryString[0] === '-' ? '1' : '0';
    if (sign === '1') binaryString = binaryString.substring(1); // Remove sign for processing

    if (exponent <= -127) {
        return handleDenormalized(binaryString, exponent, sign);
    }

    let normalized = normalizeBinary(binaryString);
    let binary = formatIEEE754(sign, normalized.exponent + exponent + 127, normalized.mantissa);
    let hex = binaryToHex(binary);
    return {binary, hex};
}

// Convert a decimal string to IEEE-754 format
function convertBase10(decimalString, exponent) {
    let decimalValue = parseFloat(decimalString);
    let sign = decimalValue < 0 ? '1' : '0';
    decimalValue = Math.abs(decimalValue);

    let binaryConversion = toBinary(decimalValue);
    let normalized = normalizeBinary(binaryConversion);
    let binary = formatIEEE754(sign, normalized.exponent + exponent + 127, normalized.mantissa);
    let hex = binaryToHex(binary);
    return {binary, hex};
}

// Handles the NaN case
function handleNaN(isSignaling, isQuiet) {
    let sign = 'X'; // Default sign bit
    let binary, hex;

    if (isSignaling) {
        binary = `${sign} 11111111 01xxxxxxxxxxxxxxxxxxxxx`;
        hex = '7FA00000'; // Example of sNaN
    } else if (isQuiet) {
        binary = `${sign} 11111111 1xxxxxxxxxxxxxxxxxxxxxx`;
        hex = '7FC00000'; // Example of qNaN
    } else {
        binary = `${sign} 11111111 10000000000000000000000`;
        hex = '7FC00000'; // Example of general NaN
    }

    // Display the NaN result
    document.getElementById('binaryOutput').textContent = binary;
    document.getElementById('hexOutput').textContent = hex;

    return { binary, hex };
}

// Handles positive and negative infinity cases
function handleInfinity(isNegative) {
    // Infinity is represented by: exponent = all 1s, mantissa = all 0s
    let sign = isNegative ? '1' : '0';
    let binary = `${sign} 11111111 00000000000000000000000`;
    let hex = isNegative ? 'FF800000' : '7F800000';

    // Display the infinity result
    document.getElementById('binaryOutput').textContent = binary;
    document.getElementById('hexOutput').textContent = hex;

    return { binary, hex };
}

// Handles the negative zero case
function handleNegativeZero() {
    // Negative zero is represented by: sign bit = 1, exponent = all 0s, mantissa = all 0s
    let binary = '1 00000000 00000000000000000000000';
    let hex = '80000000';

    // Display the negative zero result
    document.getElementById('binaryOutput').textContent = binary;
    document.getElementById('hexOutput').textContent = hex;

    return { binary, hex };
}

// Handles the positive zero case
function handlePositiveZero() {
    // Positive zero is represented by: sign bit = 0, exponent = all 0s, mantissa = all 0s
    let binary = '0 00000000 00000000000000000000000';
    let hex = '00000000';

    // Display the positive zero result
    document.getElementById('binaryOutput').textContent = binary;
    document.getElementById('hexOutput').textContent = hex;

    return { binary, hex };
}

// Converts a decimal number to a binary string
function toBinary(decimal) {
    let integerPart = Math.floor(decimal);
    let fractionalPart = decimal - integerPart;
    let binary = integerPart.toString(2);

    // Handling the fractional part for single precision (23 bits needed for mantissa)
    if (fractionalPart !== 0) {
        binary += '.';
        let counter = 0;
        // Only loop until you've resolved up to 23 bits of precision or the fractional part resolves to zero
        while (fractionalPart !== 0 && counter < 23) {
            fractionalPart *= 2;
            let bit = Math.floor(fractionalPart);
            binary += bit;
            fractionalPart -= bit;
            counter++;
        }
    }
    return binary;
}

// Normalize a binary string for IEEE-754 conversion
function normalizeBinary(binaryString) {
    let parts = binaryString.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts.length > 1 ? parts[1] : '';
    let shift, normalizedMantissa;

    // Handle numbers less than 1 where integer part is '0'
    if (integerPart === '0' || integerPart === '') {
        // Find the first '1' in the fractional part to determine the shift
        let firstOneIndex = fractionalPart.indexOf('1');
        if (firstOneIndex === -1) {
            // The number is actually zero
            return { mantissa: '0'.repeat(23), exponent: -127 }; // Exponent for zero in IEEE-754
        }
        // Adjust the fractional part to start after the first '1'
        normalizedMantissa = fractionalPart.substring(firstOneIndex + 1);
        shift = -firstOneIndex - 1; // Negative because we are shifting to the right
    } else {
        // For numbers with a non-zero integer part, normalize based on the location of the first '1'
        shift = integerPart.length - 1;
        normalizedMantissa = (integerPart.substring(1) + fractionalPart); // Skip the leading '1'
    }

    // Ensure the mantissa is exactly 23 bits long
    normalizedMantissa = (normalizedMantissa + '0'.repeat(23)).substring(0, 23);

    return {
        mantissa: normalizedMantissa,
        exponent: shift
    };
}

// Format a binary and exponent into IEEE-754 binary representation
function formatIEEE754(sign, exponent, mantissa) {
    let exponentBinary = exponent.toString(2).padStart(8, '0');
    return sign + exponentBinary + mantissa;
}

// Convert a binary string to hexadecimal
function binaryToHex(binary) {
    let hex = parseInt(binary.replace(/\s+/g, ''), 2).toString(16).toUpperCase();
    return hex.padStart(8, '0');
}

// Handle denormalized numbers
function handleDenormalized(binaryString, exponent, sign) {
    let mantissa = translateToMinus126Equivalent(binaryString, exponent);

    let binary = sign + ' 00000000 ' + mantissa;
    let hex = binaryToHex(binary.replace(/\s+/g, ''));

    return { binary, hex };
}

function translateToMinus126Equivalent(binaryString, exponent) {
    let parts = binaryString.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts.length > 1 ? parts[1] : '';
    let normalizedMantissa;

    // If the number is less than 1 (integer part is 0 or empty)
    if (integerPart === '0' || integerPart === '') {
        let firstOneIndex = fractionalPart.indexOf('1');
        if (firstOneIndex === -1) {
            return '0'.repeat(23); // Return 23 zeros if the number is effectively zero
        }

        // Calculate the shift needed to reach the exponent -126
        let shift = -126 - exponent - 1;
        normalizedMantissa = fractionalPart.substring(firstOneIndex);
        
        // Adjust normalizedMantissa to include the leading zeros after the decimal point
        if (shift > 0) {
            normalizedMantissa = '0'.repeat(shift) + normalizedMantissa;
        }
    } else {
        // For numbers greater than or equal to 1, shift the decimal point
        let combined = integerPart + fractionalPart;
        let shift = -126 - exponent;
        normalizedMantissa = combined;

        // Add leading zeros to the normalizedMantissa if needed
        if (shift > 0) {
            normalizedMantissa = '0'.repeat(shift) + normalizedMantissa;
        }
    }

    // Remove a single leading zero if it exists
    if (normalizedMantissa.startsWith('0')) {
        normalizedMantissa = normalizedMantissa.substring(1);
    }

    // Ensure the mantissa is exactly 23 bits long
    normalizedMantissa = normalizedMantissa.padEnd(23, '0');
    
    return normalizedMantissa;
}

// Clear input fields and output display
function clearFields() {
    document.getElementById("number").value = '';
    document.getElementById("exponent").value = '';
    document.getElementById('binaryOutput').textContent = '';
    document.getElementById('hexOutput').textContent = '';
}

// Download binary and hexadecimal output as a text file
function downloadOutput() {
    let binaryOutput = document.getElementById('binaryOutput').textContent;
    let hexOutput = document.getElementById('hexOutput').textContent;
    let content = `Binary Output: ${binaryOutput}\nHexadecimal: ${hexOutput}`;
    console.log(content); // This will help you verify the output content.

    let blob = new Blob([content], { type: 'text/plain' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'FloatingPointConversionOutput.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
