
function disableDel(){
    let del = document.getElementById('delete');

    if(del){
        del.disabled = true;
    }
}

function Add(){
    let Pnumber = document.getElementById('Pnumber').value;
    let FIO = document.getElementById('FIO').value;

    let LINK = `/Add`;
    fetch(LINK, {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            fio: FIO,
            number: Pnumber
        })
    })
        .catch((err) => console.log(`ERROR ${err}`))
    window.location.href = '/';
}

function Delete(){
    let FIO = document.getElementById('FIO').value;

    let LINK = `/Delete`;
    fetch(LINK, {
        method: 'Delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            fio: FIO
        })
    })
        .catch((err) => console.log(`ERROR ${err}`))
    location.href = '/Update';
}

function Choose(item){
    let del = document.getElementById('delete');
    if(del){
        del.disabled = false;

        // document.getElementsByClassName('ph-field').disabled = true;

        let Pnumber = document.getElementById('Pnumber');
        let FIO = document.getElementById('FIO');

        FIO.value = item.querySelector('#list-fio').innerHTML;
        Pnumber.value = item.querySelector('#list-number').innerHTML;
    }
    else {
        location.href = '/Update';
    }
}

function Update(){
    let Pnumber = document.getElementById('Pnumber').value;
    let FIO = document.getElementById('FIO').value;

    let LINK = `/Update`;
    fetch(LINK, {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            fio: FIO,
            number: Pnumber,
        })
    })
        .catch((err) => console.log(`ERROR ${err}`))

    window.location.href = '/Update';
}
