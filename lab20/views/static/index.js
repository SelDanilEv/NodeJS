let oldfio = "";

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
        .catch((err) => console.log(`ERROR ${err}`));

    setInterval(()=>{window.location.href = '/';},1000);
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
    setInterval(()=>{window.location.href = '/Update';},1000);
}

function Choose(item){
    let del = document.getElementById('delete');
    if(del){
        del.disabled = false;

        // document.getElementsByClassName('ph-field').disabled = true;
        let Pnumber = document.getElementById('Pnumber');
        let FIO = document.getElementById('FIO');

        oldfio = FIO.value = item.querySelector('#list-fio').innerHTML;
        Pnumber.value = item.querySelector('#list-number').innerHTML;
    }
    else {
        setInterval(()=>{window.location.href = '/Update';},1000);
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
            oldfio: oldfio,
        })
    })
        .catch((err) => console.log(`ERROR ${err}`))
    setInterval(()=>{window.location.href = '/Update';},1000);
}
