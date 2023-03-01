
module.exports = class Client{
    constructor(name,phone,email,website){
        const { v4: uuidv4 } = require('uuid');
        this.id = uuidv4();
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.datetime = new Date().toLocaleString();
    }
}

/* For the code review

    Stores the clients informations 

    Stores the date and time in javascript format ex: 1/23/2023, 4:07:32 PM

    also have a unique id for either modify or delete it! 
*/