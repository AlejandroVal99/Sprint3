const comparisonForm = document.querySelector(".neighboursForm");
const personAselect = comparisonForm.personA;
const nNeighbours = comparisonForm.nNeighbours;
const resultFIeld = document.querySelector(".neighboursForm__result");

//let url = './data/dataPersons.csv';//Sprint 2
let url = './data/dataSprint3.csv'//Sprint 3
let result = 0;
let data = [];
let nameList = [];
let neighboursResults=[];
let currentPerson;

Papa.parse(url, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
       
        data = results.data;
        
        data.forEach(elem => {
            nameList.push(elem.Nombre);
        });
        renderNameOptions();
    }
});

comparisonForm.addEventListener('submit', event => {
    neighboursResults =[];
    event.preventDefault();
    let personA = getPersonFromList(personAselect.value);
    let number = nNeighbours.value;
    let dataFilter = data.filter(name=> name['Nombre'] != personAselect.value);
    let magnitudeA = getMagnitude(personA);


    dataFilter.forEach(element => {
        let dotProduct = getDotProduct(personA, element);
        let magnitudeB = getMagnitude(element);
        let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);
        let namePerson = element.Nombre;
        neighboursResults.push({namePerson,cosineSimilarity});
    });
    
    
    neighboursResults.sort((a,b) => b.cosineSimilarity-a.cosineSimilarity);
    
    renderResult(neighboursResults.splice(1,number));
  
    
})

function renderNameOptions() {
    nNeighbours.setAttribute("max",nameList.length);
    nameList.forEach(elem => {
        const optionsElemA = document.createElement("option");
       
        optionsElemA.innerText = elem;
      
        optionsElemA.value = elem;
      
        personAselect.appendChild(optionsElemA);

    });
}

function getPersonFromList(value) {
    let person = data.find(elem => {
        return elem.Nombre == value;
    });
    //console.log(person);
    return person;
}

function getDotProduct(elemA, elemB) {
    let dotProduct = 0;
    let elemProps = Object.keys(elemA);
    //console.log(elemProps);
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        dotProduct += (elemA[prop] * elemB[prop]);
    }
    return dotProduct;
}

function getMagnitude(elem) {
    let magnitude = 0;
    let elemProps = Object.keys(elem);
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        magnitude += Math.pow(elem[prop], 2);
    }
    return Math.sqrt(magnitude);
}

function getCosineSimilarity(dotProduct, magnitudeA, magnitudeB) {
    let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
    return cosineSimilarity;
}

function renderResult(result) {
    console.log(result);
    resultFIeld.innerHTML='';
    result.forEach(person=>{
        let personP = document.createElement('p');
        personP.innerHTML = `${person.namePerson}---- ${person.cosineSimilarity}`;
        resultFIeld.appendChild(personP);
    })

}