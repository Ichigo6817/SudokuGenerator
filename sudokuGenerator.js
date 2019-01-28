/* Sudoku generator using Genetic Algoritm */

/* GA Config */
constanta = 0.5;
populationSize = 5000 * constanta;
selectTheFittest = 500 * constanta;
breedNumber = 500 * constanta;
mutationRate = 0.1;
prmMutationRate = 0.01;
mutProb = 0.04;
/****************/

geneticAlgoritm();


function Individual(value){ // One individual(solution) in population
    this.value = value;
    this.fittnes = 0;
    this.evaulateMe = function(){
        rowEvaluation(this);
        columnEvaluation(this);
        boxEvaluation(this);
    }

}


function geneticAlgoritm(){
    var generation = 1;
    var solution = -1;
    var solutionIndividual;
    var TempPopulation =[];
    var population = initializePopulation(populationSize);
       while(solution!=0) {
           evaulate(population);
           TempPopulation = selection(population,selectTheFittest);
           crossover(population, breedNumber);
           indxMutation(population, mutationRate);
           permMutation(population, prmMutationRate,mutProb);
           population.push(...TempPopulation);
           solutionIndividual = TempPopulation[0];
           solution = solutionIndividual.fittnes;
           console.log("Generation:"+generation+"  bestFitness:"+TempPopulation[0].fittnes);
           TempPopulation=[];
           generation += 1;
       }

    console.log(solutionIndividual); // print the Solution
}


function initializePopulation(popNum) {

    var population = [];
        for(var i=0;i<popNum;i++){
            population[i] = new Individual(createIndividual());
        }
       // population;
    return population;
}

function selection(population,kill){
    var min,max,temp;
    var tmpPop = [];
        for(var k=0; k<kill;k++) {
            min = 0;
            max = 0;

            // Add fittest to the new population
                for (var i = 1; i < population.length; i++) {
                    if (population[i].fittnes < population[min].fittnes) {
                        min = i;
                    }
                }
            tmpPop.push(population[min]);
            population.splice(min, 1);

            // Delete worst from the population
                for (var i = 1; i < population.length; i++) {
                    if (population[i].fittnes > population[max].fittnes) {
                        max = i;
                    }
                }
            population.splice(max, 1);
        }
    return tmpPop;

}

function indxMutation(population,mutationRate){ // Switch 2 indexes in random row
    var individual,row,index1,index2,temp;
        for(var i=0;i<population.length*mutationRate;i++) {
            individual = Math.floor(Math.random() * population.length);
            row = Math.floor(Math.random() * 9);//0-8
            index1 = Math.floor(Math.random() * 9);
            index2 = Math.floor(Math.random() * 9);
            temp = population[individual].value[row][index1];
            population[individual].value[row][index1] = population[individual].value[row][index2];
            population[individual].value[row][index2] = temp;
        }
    return population;
}

function permMutation(population,mutationRate,prob){ // Switch 2 indexes in random row
    var individual,row,rowValue;
        for(var i=0;i<population.length*mutationRate;i++) {
            if(Math.random() < prob) {
                individual = Math.floor(Math.random() * population.length);
                row = Math.floor(Math.random() * 9);//0-8
                rowValue = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (var j = 0; j < 9; j++) {
                    population[individual].value[row][j] = rowValue[j];
                }
            }
        }
    return population;
}

function crossover(population,childNum){
    var parent1,parent2;
        for(var i=0;i<childNum;i++) {
            parent1 = Math.floor(Math.random() * population.length);
            parent2 = Math.floor(Math.random() * population.length);
            population[population.length]=new Individual(createChild(population[parent1],population[parent2]));
        }
    return population;
}

function evaulate(population) {  // Score the population

    for(var i=0;i<population.length;i++) {
        population[i].fittnes = 0;
        population[i].evaulateMe();
    }

}

function rowEvaluation(individual){ // checks duplicates in each row and adds penalty
    var check = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var duplicate = 0;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                for(var k=0; k<9; k++) {
                    if(individual.value[i][k]==check[j]){
                        duplicate+=1;
                    }

                }
                if(duplicate>1){
                    individual.fittnes += duplicate * 100;
                }
                duplicate = 0;
            }
        }
}

function columnEvaluation(individual){ // checks duplicates in each column and adds penalty

    var check = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var duplicate = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            for(var k=0; k<9; k++) {
                if(individual.value[k][i]==check[j]){
                    duplicate+=1;
                }
            }
            if(duplicate>1){
                individual.fittnes += duplicate * 100;
            }
            duplicate = 0;
            }
        }
}

function boxEvaluation(individual){ // checks duplicates in each box and adds panalty
    var check = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var duplicate = 0;
    for (var x = 0; x < 9; x=x+3) {
        for (var l = 0; l < 9; l=l+3) {
            for(var c=0;c<9;c++) {
                for (var i = l; i < l + 3; i++) {
                    for (var k = x; k < x + 3; k++) {
                        if (individual.value[i][k] == check[c]) {
                            duplicate += 1;
                        }
                    }
                }
                if(duplicate>1){
                    individual.fittnes += duplicate * 100;
                }
                duplicate = 0;
            }
        }
    }
}

function createIndividual(){ // create one individual in population
    var individual=[];
    var randPermutation = [];
        for(var i=0;i<9;i++){
            individual[i]=[];
            randPermutation = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for(var j=0;j<9;j++) {
                individual[i][j] = randPermutation[j];
            }
        }
    return individual;
}

function createChild(parent1,parent2){ // create one individual(child) from parents
    var rowsParent1 = Math.floor(Math.random() * 7); // 0-6
    var individual=[];
           for(var j=0;j<rowsParent1;j++){
               individual[j]=[];
                   for(var k=0;k<9;k++){
                        individual[j][k] = parent1.value[j][k];
                   }
           }

            for(var j=rowsParent1;j<9;j++){
                individual[j]=[];
                    for(var k=0;k<9;k++){
                        individual[j][k] = parent2.value[j][k];
                    }
            }

    return individual;
}

function shuffle(array) { // shuffle the input array
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
