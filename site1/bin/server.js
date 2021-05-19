const crypto = require('crypto');
let original = 'myPassword';
let test = "somePassword";

let main = async () => {

  function encryptTmp(password) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password);
    return cipher.final();
  }

  let originalEncrypted = await encryptTmp(original);
  let testEncrypted = await encryptTmp(test);
  const salt = await crypto.randomBytes(8).toString("hex");

  crypto.pbkdf2(originalEncrypted, salt, 100000, 64, 'sha512', (err, hash) => {
    // Store hash
    console.log("Password: %s hashed", original);
    crypto.pbkdf2(testEncrypted, salt, 100000, 64, 'sha512', (err, testKey) => {
      console.log("Compare password %s to %s", test, original);
      if (hash.toString('hex') == testKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
    crypto.pbkdf2(originalEncrypted, salt, 100000, 64, 'sha512', (err, originalKey) => {
      console.log("Compare password %s to %s", original, original);
      if (hash.toString('hex') == originalKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
  });
}

main();
