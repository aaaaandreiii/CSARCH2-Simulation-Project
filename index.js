const input = document.getElementById("input");
const ouput = document.getElementById("output");

function convert(){
    var text = input.value;
    var beforeRadixPoint = document.getElementById("beforeRadixPoint");
    var afterRadixPoint = document.getElementById("afterRadixPoint");
    var base = document.getElementById("base");
    var exponent = document.getElementById("exponent");
        
    if (input.value != "") {
        
        //convert to binary
        const patterns = [/(\d+)\.(\d+)x(\d+)\^(\d+)/, /\+(\d+)\.(\d+)x(\d+)\^(\d+)/, /\-(\d+)\.(\d+)x(\d+)\^(\d+)/];
        
        for (let pattern of patterns) {
            const match = pattern.exec(text);
            if (match) {
                // if (match3) {
                //     alert("negative");
                // }
                var sign = document.getElementById("sign");
                var eprime = document.getElementById("eprime");
                var mantissa = document.getElementById("mantissa");
                
                const groups = match.slice(1); // Get captured groups (excluding whole match)
                
                // Update the label text
                if (groups[2] == 2){
                    beforeRadixPoint.textContent = groups[0];
                    afterRadixPoint.textContent = groups[1];
                } else if (groups[2] != 2) {
                    let decimalNumber = Number(groups[0]);
                    let binaryNumber = decimalNumber.toString(2);
                    alert(binaryNumber / Number(11).toString(2));
                    beforeRadixPoint.textContent = binaryNumber;
                    afterRadixPoint.textContent = groups[1];
                }
                
                base.textContent = groups[2];
                exponent.textContent = groups[3];
                // Parse the match data here
                break; // Exit the loop if a match is found
            } else {
                alert("input is formatted wrongly");
            }
        }
    } else {
        beforeRadixPoint.textContent = "";
        afterRadixPoint.textContent = "";
        base.textContent = "";
        exponent.textContent = "";
        alert("input is blank");
    }
}