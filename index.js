const input = document.getElementById("input");
const ouput = document.getElementById("output");

function convert(){
    const text = input.value;
    // const text = "123.45x678^910";

    var firstInteger = document.getElementById("firstInteger");
    var secondInteger = document.getElementById("secondInteger");
    var thirdInteger = document.getElementById("thirdInteger");
    var fourthInteger = document.getElementById("fourthInteger");
    
    const pattern = /(\d+)\.(\d+)x(\d+)\^(\d+)/;   // expected pattern of input      i.e., 101.01x2⁵
    const match = pattern.exec(text);       // parse text according to pattern

    if (match) {
        const groups = match.slice(1); // Get captured groups (excluding whole match)
    
        // Update the label text
        firstInteger.textContent = groups[0];
        secondInteger.textContent = groups[1];
        thirdInteger.textContent = groups[2];
        fourthInteger.textContent = groups[3];
    } else {
        firstInteger.textContent = '1';
        decimal.textContent = text;
    }
}