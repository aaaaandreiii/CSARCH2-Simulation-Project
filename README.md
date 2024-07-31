# CSARCH2-Simulation-Project
## IEEE-754 Binary-32 Floating-Point Converter
### Contents of this project

1. Source Code
    - [Contribution guidelines for this project](docs/CONTRIBUTING.md)
2. Video Demonstration
    - [Video Demo](https://drive.google.com/file/d/1mSGdYKpHMkBCCt-zeIa0sVZg9inRjW0q/view?usp=drive_link).
3. Documentation of Test Cases
    - [Screenshots of Test Cases](Documentation.pdf)
5. Technical Analysis Write-Up
    - [Analysis Document](Analysis-Write-Up.pdf)
6. Website Actual
    - [IEEE-754 Binary-32 Floating-Point Converter](https://aaaaandreiii.github.io/CSARCH2-Simulation-Project/)

## Description
The IEEE-754 Binary-32 Floating-Point Converter is a web-based application designed to facilitate the conversion of floating-point numbers between binary and decimal representations according to the IEEE-754 standard. This tool supports conversion of regular numbers as well as special values like NaN (Not a Number), Infinity, and Zero. 

## How to Use the Converter

1. **Input Number**: Enter the number you wish to convert. You can input special values like NaN, Infinity, and Zero using specific keywords (e.g., `sNaN`, `qNaN`, `Infinity`, `-Infinity`, `-0`).

2. **Select Base**: Choose the base of the input number from the dropdown menu (`Binary` for base-2 or `Decimal` for base-10).

3. **Enter Exponent**: Provide the exponent value for the number.

4. **Convert**: Click the "Convert" button to perform the conversion. The output will display the binary and hexadecimal representations of the input number.

5. **Clear**: Use the "Clear" button to reset all input fields and clear the output.

6. **Download Output**: Click the "Download Output" button to save the conversion results to a text file.

### Features
- **Input Validation**: Ensures that the inputs are correctly formatted and within acceptable ranges.
- **Special Values Handling**: Supports special IEEE-754 values like sNaN, qNaN, Infinity, and Zero.
- **Output Formats**: Provides both binary and hexadecimal outputs, formatted for readability.
- **Downloadable Results**: Users can download the conversion results as a text file.

### Special Values Instructions
- **Signaling NaN**: Enter `sNaN`
- **Quiet NaN**: Enter `qNaN`
- **Positive Infinity**: Enter `Infinity`
- **Negative Infinity**: Enter `-Infinity`
- **Negative Zero**: Enter `-0`
- **Positive Zero**: Enter `0`

### Example Outputs
- **Binary Output**: Displayed with spaces between the sign bit, exponent, and mantissa for clarity.
- **Hexadecimal Output**: Direct conversion of the binary representation.

## Files in the Repository
- **index.html**: HTML file that defines the structure of the converter.
- **index.css**: CSS file for styling the application.
- **index.js**: JavaScript file implementing the logic for conversion, input validation, and special values handling.
- **README.md**: Documentation and usage instructions for the converter.

### Contributors
- Andrei Balingit
- Maria Sarah Althea Mata
- Arianne Ranada

This project showcases a solid understanding of the IEEE-754 standard and web development principles, providing an educational and practical tool for converting floating-point numbers accurately.
