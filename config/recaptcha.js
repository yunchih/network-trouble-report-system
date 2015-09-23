
if( process.env.DEV ){
    console.log( "Warning: Recaptcha is in DEV mode !!" );
    module.exports = {
        secret: "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
    };
}else{ 
    module.exports = {        
        secret: "6LfbdQwTAAAAAEDl7ZCqgzYhR2my59myT-oIIyY8"
    };
}   
