const http = require('http');
const url = require('url');
const fs = require('fs');

const FILEPATH = './../files/Students.json';

let GetAllStudents = () => {
    let userDataEntries = JSON.parse(fs.readFileSync(FILEPATH, 'utf8'));
    return userDataEntries;
}

let throw_error = (res, mess) => {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({error: mess}));
}

let DO_DELETE = (req, res) => {
    let path = req.url;
    let student_id = +path.slice(1);
    if (path.includes('.json')) {
        let backs = [];
        fs.readdir('./backups/', function (err, items) {
            for (let i = 0; i < items.length; i++) {
                backs.push({i: items[i]});
            }
            path = path.slice(1).replace('backup/', '');
            let year = path.slice(0, 4);
            let month = path.slice(4, 6);
            let day = path.slice(6, 8);
            let delete_backs = [];
            backs.forEach(function (item, i, arr) {
                let year_item = item.i.slice(0, 4);
                let month_item = item.i.slice(4, 6);
                let day_item = item.i.slice(6, 8);
                if (parseInt(year) > parseInt(year_item)) {
                    delete_backs.push(item);
                } else {
                    if (parseInt(year) == parseInt(year_item))
                        if (parseInt(month) > parseInt(month_item)) {
                            delete_backs.push(item);
                        } else {
                            if (parseInt(month) == parseInt(month_item) && parseInt(day) > parseInt(day_item)) {
                                delete_backs.push(item);
                            }
                        }
                }
            });
            delete_backs.forEach(function (item, i, arr) {
                fs.unlinkSync('./backups/' + item.i);
            });
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(delete_backs));
        });
    } else {
        if (!isNaN(student_id)) {
            fs.access(FILEPATH, fs.constants.R_OK, err => {
                if (err) {
                    throw_error(res, 'File read error');
                } else {
                    let students = GetAllStudents();
                    let flag = true;
                    students.forEach(function (item, i, arr) {
                        if (item.id == student_id) {
                            flag = false;
                            arr.splice(i, 1);
                            fs.writeFileSync(FILEPATH, JSON.stringify(students));
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(students));
                        }
                    })
                    if (flag) {
                        throw_error(res, "Student with this is not founded");
                    }
                }
            });
        } else {
            throw_error(res, "Bad request");
        }
    }
}

let DO_POST = (req, res) => {
    let path = req.url;
    switch (path) {
        case '/':
            let data_json = '';
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                fs.access(FILEPATH, fs.constants.R_OK, err => {
                    if (err) {
                        throw_error(res);
                    } else {
                        let students = GetAllStudents();
                        let flag = true;
                        students.forEach(function (item, i, arr) {
                            if (item.id == data_json.id) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            students.push(data_json);
                            console.log(students);
                            fs.writeFileSync(FILEPATH, JSON.stringify(students));
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(data_json));
                        } else {
                            throw_error(res, 'There are student with the same id')
                        }
                    }
                });
            });
            break;
        case '/backup':
            setTimeout(() => {
                    let cur = new Date();
                    let date = addZero(cur.getFullYear()) + addZero(cur.getMonth() + 1) +
                        addZero(cur.getDate()) + addZero(cur.getHours()) +
                        addZero(cur.getMinutes()) + addZero(cur.getSeconds());

                    function addZero(n) {
                        return (n < 10 ? '0' : '') + n;
                    }

                    fs.writeFile((__dirname + '/backups/' + date + '_StudentList.json'), JSON.stringify(GetAllStudents(), null, '  '), () => {
                    })
                    res.end("Backup created");
                },
                2000);
            break;
        default:
            res.statusCode = 405;
            res.statusMessage = 'Invalid method';
            res.end("HTTP ERROR 405: Invalid method");
    }
}

let DO_PUT = (req, res) => {
    let path = req.url;
    switch (path) {
        case '/':
            let data_json = '';
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                fs.access(FILEPATH, fs.constants.R_OK, err => {
                    if (err) {
                        throw_error(res, 'Read file error');
                    } else {
                        let students = GetAllStudents();

                        students.forEach(function (item, i, arr) {
                            if (item.id == data_json.id) {
                                item.name = data_json.name;
                                item.speciality = data_json.speciality;
                                fs.writeFileSync(FILEPATH, JSON.stringify(students));
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify(data_json));
                            }
                        })

                        res.end("OK");
                    }
                });
            });
            break;
        default:
            res.statusCode = 405;
            res.statusMessage = 'Invalid method';
            res.end("HTTP ERROR 405: Invalid method");
    }
}
let DO_GET = (req, res) => {
    let path = req.url;
    switch (path) {
        case '/':
            fs.access(FILEPATH, fs.constants.R_OK, err => {
                if (err) {
                    throw_error(res);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    fs.createReadStream(FILEPATH).pipe(res);
                }
            });
            break;
        case '/backup':
            let backs = [];
            fs.readdir('./backups/', function (err, items) {
                console.log(items);

                for (let i = 0; i < items.length; i++) {
                    backs.push({i: items[i]});
                }

                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(backs));
            });
            break;
        default:
            let student_id = +path.slice(1);
            if (!isNaN(student_id)) {
                fs.access(FILEPATH, fs.constants.R_OK, err => {
                    if (err) {
                        throw_error(res);
                    } else {
                        let students = GetAllStudents();
                        let return_student = null;
                        students.forEach((item, i, arr) => {
                            if (item.id == student_id) {
                                return_student = item;
                            }
                        })
                        if (return_student != null) {
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            res.end(JSON.stringify(return_student));
                        } else {
                            throw_error(res, 'Read file error');
                        }
                    }
                });
            } else {
                throw_error(res, 'Bad id');
            }
            break;
    }
}

let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            DO_GET(req, res);
            break;
        case 'POST':
            DO_POST(req, res);
            break;
        case 'PUT':
            DO_PUT(req, res);
            break;
        case 'DELETE':
            DO_DELETE(req, res);
            break;
        default:
            console.log("Unhandled request method:" + req.method);
            break;
    }
}

let server = http.createServer();
server.listen(3000, () => {
    const URL = `http://localhost:3000`;
    console.log('Listening on ' + URL);
})
    .on('request', http_handler);
