module.exports = class User{
    constructor(email,password,access_permission){
        // acces_permission will be the url of the website they can see ; MASTER will be an administrator
        const { v4: uuidv4 } = require('uuid');
        this.id = uuidv4();
        this.email = email;
        this.password = password;
        this.access_permission = access_permission;
    }
}

/* For the code review

    Simple class that will differentiate users for wich data they can access

    access_permission is only the url they can acces ( when it's == MASTER it will grant total access)

    also have a unique id for either modify or delete it! 
*/