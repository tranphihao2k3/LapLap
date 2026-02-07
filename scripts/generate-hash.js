import bcrypt from 'bcryptjs';

async function generatePasswordHash() {
    const password = 'Admin123456';
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nCopy the hash above to use in MongoDB Compass');
}

generatePasswordHash();
