//only exists to hash a str from utf-8 to b64

//get the given string variable
var str = process.argv[2];
//function to converts the given string to b64 without using window.btoa
function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }

//convert string to b64
var b64 = toBinary(str);

//return the b64 string
console.log(b64);