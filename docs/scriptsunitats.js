
    
let bancDePreguntes = [];
let preguntesBarrejades = [];
let indexPreguntaActual = 0;
let puntuacio = 0;

function barrejar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function actualitzarProgres() {
    const percentatge =
        (indexPreguntaActual / preguntesBarrejades.length) * 100;
    document.getElementById('progress-bar').style.width =
        percentatge + "%";
}

function actualitzarPercentatge() {
    const percentatge = Math.round(
        (puntuacio / preguntesBarrejades.length) * 100
    );
    document.getElementById('percentatge-text').innerText =""
       // `Encerts: 🎯 ${percentatge}%`;
}


function carregarPreguntes(RA) {
    fetch('preguntes/preguntesIP_' + RA + '.json')
        .then(res => res.json())
        .then(data => {
            bancDePreguntes = data;
            preguntesBarrejades = [...bancDePreguntes];
            barrejar(preguntesBarrejades);
            puntuacio = 0;
            indexPreguntaActual = 0;
            mostrarPregunta();
        })
        .catch(err => {
            console.error(err);
            document.getElementById('pregunta-text').innerText =
                "Error carregant les preguntes 😢";
        });
        //document.getElementById('percentatge-text').innerText = "0%";

}

function mostrarPregunta() {

    // Si ja no queden preguntes
    if (indexPreguntaActual >= preguntesBarrejades.length) {
        document.getElementById('pregunta-text').innerText =
            "🎉 Has acabat totes les preguntes!";
        document.getElementById('options-container').innerHTML = "";
        document.getElementById('feedback').innerHTML =
        `Has encertat <strong>${puntuacio}</strong> de 
        <strong>${preguntesBarrejades.length}</strong> preguntes.`;
        document.getElementById('btn-seguent').disabled = true;
        document.getElementById('progress-bar').style.width = "100%";
        actualitzarProgres();
        return;
    }

    const pregunta = preguntesBarrejades[indexPreguntaActual];

    // document.getElementById('pregunta-text').innerText = pregunta.titol;
    document.getElementById('pregunta-text').innerHTML = pregunta.titol;

    const container = document.getElementById('options-container');
    container.innerHTML = "";

    //pregunta.opcions.forEach(opcio => {
    const opcionsBarrejades = [...pregunta.opcions];
    barrejar(opcionsBarrejades);

    opcionsBarrejades.forEach(opcio => {        
        const btn = document.createElement('button');
        btn.innerText = opcio.text;
        btn.onclick = () => comprovaResposta(opcio.correcte, btn, opcio.feedback);
        container.appendChild(btn);
    });

    document.getElementById('feedback').textContent = "";
    document.getElementById('pista').textContent = "";
    document.getElementById('btn-seguent').disabled = true;
    actualitzarProgres();

}

function mostrarPista(){
      document.getElementById('pista').textContent = '🕵️‍♂️Pista: '+preguntesBarrejades[indexPreguntaActual].pista;
    }



function comprovaResposta(esCorrecte, element,feedback1) {
    const feedback = document.getElementById('feedback');

    document
        .querySelectorAll('#options-container button')
        .forEach(btn => btn.disabled = true);

    if (esCorrecte) {
        feedback.textContent = "✅ Correcte! Molt bé." + feedback1;
        element.style.background = "#d4edda";
        puntuacio++;
    } else {
        feedback.textContent = "❌ Incorrecte." + feedback1;
        element.style.background = "#f8d7da";
    }
    //actualitzarPercentatge();
    document.getElementById('btn-seguent').disabled = false;
}

function seguentPregunta() {
    indexPreguntaActual++;
    mostrarPregunta();
}


// Executar en carregar la pàgina
//window.onload = carregarPreguntes;
// Es crida des de cada html de cada RA / UD

