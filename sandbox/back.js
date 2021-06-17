
let arr = [14,28,56,82,90,132,197,284,231,455];
let sum = 516;
let ressum = -1;

while (ressum!=sum){
    ressum = 0;
    let gen;
    let arrayRes ="";
    for(let i = 0;i<10;i++) {
        gen = Math.round(Math.random()) * arr[i];
        arrayRes +=  gen + " ";
        ressum += gen;
    }
    console.log(arrayRes);
}
