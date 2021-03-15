const fs = require('fs');
let phoneNumbers = require('./data/phoneNumbers');

function commit() {
    fs.writeFile(__dirname + '/data/phoneNumbers.json', JSON.stringify(phoneNumbers, null, '  '), err => {
        if (err) {
            throw err;
        }
    });
}

module.exports = {
    GetAll: () => {
        return phoneNumbers
    },
    Add(field) {
        const {fio, number} = field;
        if (fio && number) {
            phoneNumbers.push({
                fio,
                number
            });
            commit();
        }
    },
    Update(field) {
        const {fio, number, oldfio } = field;

        if (fio && number) {
            let isExist = phoneNumbers.find(phone => phone.fio == oldfio);
            if (!isExist) {
                throw new Error('Phone number is not exists');
            }

            isExist.fio = fio;
            isExist.number = number;

            commit();
        }
    },
    Delete(FIO) {
        let isExist = phoneNumbers.find(phone => phone.fio == FIO);
        if (!isExist) {
            throw new Error('Phone number is not exists');
        }
        phoneNumbers = phoneNumbers.filter(phone => phone.fio != FIO);
        commit();
    }
};
