const EventEmitter = require('events');
const fs = require('fs');

class DataBase extends EventEmitter {
//----------------constructor----------------------
    constructor(elements) {
        super();
        this.elements = elements;
        console.log("Data base was created");
    }
//----------------shell----------------------
    async stateCommit() {
        await fs.writeFile('db/data/notes.json', JSON.stringify(this.elements), () =>
        {
            console.log('Commit command');
        });
    }

    async getRows() {
        return await this.select().catch(err => console.log(err));
    }

    async addRow(newNote) {
        return await this.insert(newNote).catch(err => console.log(err));
    }

    async updateRow(ChangedNote) {
        return await this.update(ChangedNote).catch(err => console.log(err));
    }

    async removeRow(id) {
        return await this.delete(id).catch(err => console.log(err));
    }
//----------------commands----------------------
    async select() {
        console.log("Select command");
        return this.elements;
    }

    async insert(object) {
        object.id = Math.max(...this.elements.map(m => m.id)) + 1;
        await this.commit(object, 'insert');
        console.log("Insert command");
        return object;
    }

    async update(updatedNote) { //check deleted
        let oldObject = this.elements.find(m => m.id === updatedNote.id);
        if (!oldObject) {
            throw Error('401 Invalid Request');
        }
        let newNote = this.elements.splice(this.elements.indexOf(oldObject), 1)[0];
        Object.keys(updatedNote).forEach(field => {
            if (newNote[field]) {
                newNote[field] = updatedNote[field];
            }
        });
        await this.commit(newNote, 'update');
        console.log("Update command");
        return newNote;
    }

    async delete(id) {
        let oldNote = this.elements.find(m => m.id == id);
        if (!oldNote) {
            throw Error('401 Invalid Request');
        }
        await this.commit(oldNote, 'delete');
        console.log("Delete command");
        return oldNote;
    }
//----------------commit----------------------
    async commit(object, action) {
        switch (action) {
            case 'insert':
            case 'update':
                this.elements.push(object);
                break;
            case 'delete':
                this.elements.splice(this.elements.indexOf(object), 1);
                break;
            default:
                console.log('Undefined action: ' + action);
                break;
        }
    }
}

module.exports = DataBase;
