class Users {
    constructor() {
        this.users = [];
    }

    addUsers(id, name, room) {
        const user = {id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return  this.users.filter((u) => u.id === id)[0];
    }

    getUsers(room) {
        let allUsers = this.users.filter((u) => u.room === room);
        let names = allUsers.map((i) => i.name);
        return names;
    }


}


module.exports =  {Users};