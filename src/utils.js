import BN from 'bn.js'
// const utils = {};
import  crypto from 'crypto';

const randomUint256 = () => {
    return new BN(crypto.randomBytes(32), 16);
};

export const generatorBase64Key = () => {
    return btoa(randomUint256().toString())
}

export const downloadScret = (text, type) => {
    const anchor = document.createElement('a')
    anchor.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(`This private key is for the access of RUBY-p${type} account.It cannot be used to access any other Ruby account.`+'\n'+text))
    anchor.setAttribute('download', `ruby_${type}_secret_key_${Date.now()}`)
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
}


