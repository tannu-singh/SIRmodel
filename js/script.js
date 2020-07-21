d3.select("#InfectivityRate").append("input")
  .attr("class", "slider")
  .attr("id", "InfectivityRateStep")
  .attr("type", "range")
  .attr("min", 0)
  .attr("max", 1)
  .attr("step", "0.01")
  .attr("value", 0.01);



d3.select("#Population").append("input")
  .attr("class", "slider")
  .attr("id", "PopulationStep")
  .attr("type", "range")
  .attr("min", 10)
  .attr("max", 1000)
  .attr("step", "1")
  .attr("value", 350);


d3.select("#ContactFrequency").append("input")
  .attr("class", "slider")
  .attr("id", "ContactFrequencyStep")
  .attr("type", "range")
  .attr("min", 0)
  .attr("max", 100)
  .attr("step", "1")
  .attr("value", 10);

d3.select("#DurationofInfectivity").append("input")
  .attr("class", "slider")
  .attr("id", "DurationofInfectivityStep")
  .attr("type", "range")
  .attr("min", 1)
  .attr("max", 15)
  .attr("step", "1")
  .attr("value", 7);



SIRModel();

//infection rate = contact b/w infected and uninfected people * infectivity
//Population susceptible = integral(infection rate) || Total poulation
//Population infected = integral(Infection Rate – Recovery Rate) || 1
//Susceptible contacts = Population susceptible * contact frequency
//contact b/w infected and uninfected people = Susceptible contacts * probability of contact with infected person
//probability of contact with infected person = population infected / Total Population
//Population Recovered = 0
//Recovery Rate = Population Infected /Average Duration of Infectivity
//Average Duration of Infectivity = 3(weeks) * 7(day)


//Inflow S = Total poulation
//Outflow S = infection rate

//infection rate = contact frequency  * infectivity
//infection rate = Population susceptible * contact frequency * population infected / Total Population * infectivity

function SIRModel(){
  var sirSystem = new System(),
      timeline = sirSystem.timeline,
      infectivity = 0.01,
      contactFrequency = 10,
      populationInfected = 1,
      averageDurationOfInfectivity = 7,
      populationRecovered = 0,
      population = 100;


  var infectionRate = sirSystem.makeFlow({
    expression : function (tStep) {
      var result = stockSusceptible.getValue(tStep) * contactFrequency  * (stockInfected.getValue(tStep)/population) * infectivity;
      return  result;
    }
  });

  var recoveryRate = sirSystem.makeFlow({
    expression : function (tStep) {
      var result2 = stockInfected.getValue(tStep) / averageDurationOfInfectivity;
      return  result2;
    }
  });
  var stockSusceptible = sirSystem.makeStock({
    outFlows: [infectionRate],
    initialize: function(){return population;}
  });

  var stockInfected = sirSystem.makeStock({
    inFlows: [infectionRate],
    outFlows: [recoveryRate],
    initialize: function(){return populationInfected;}
  });

  var stockRecovered = sirSystem.makeStock({
    inFlows: [recoveryRate],
    initialize: function(){return populationRecovered;}
  });


  d3.select("#InfectivityRateStep").on("input", function() {
    infectivity = +this.value;
    console.log('infectivity = ', infectivity);
    sirSystem.update();
  });

  d3.select("#ContactFrequencyStep").on("input", function() {
    contactFrequency = +this.value;
    console.log('contactFrequency = ', contactFrequency);
    sirSystem.update();
  });

  d3.select("#PopulationStep").on("input", function() {
    population  = +this.value;
    console.log('population = ',population);
    sirSystem.update();
  });

  d3.select("#DurationofInfectivityStep").on("input", function() {0
    averageDurationOfInfectivity = +this.value;
    console.log('infectivity duration = ', averageDurationOfInfectivity);
    sirSystem.update();
  });

  sirSystem.update();

  var stock_susceptiblSvg = d3.selectAll("#SusceptibleStock" );
  var stock_susceptible = sirSystem.addGraph({
    svg: stock_susceptiblSvg,
    classes: [ "graph", "stock"],
    showAxis: 'false',
    showAxis2: 'false',
    //containerDivClass: 'SusceptibleStock',
    data: [stockSusceptible],
    // height: 200,
    interpolation: 'cardinal',
    height: parseInt(stock_susceptiblSvg.select("rect").node().getBBox().height ),
    width: parseInt(stock_susceptiblSvg.select("rect").node().getBBox().width ),
    xPos: parseInt(stock_susceptiblSvg.select("rect").node().getBBox().x ),
    yPos: parseInt(stock_susceptiblSvg.select("rect").node().getBBox().y ),
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    stackData: false
  });

  var stock_infectedSvg = d3.selectAll("#InfectedStock" );
  var stock_infected  = sirSystem.addGraph({
    svg: stock_infectedSvg,
    classes: [ "graph", "stock"],
    showAxis: 'false',
    showAxis2: 'false',
    //containerDivClass: 'InfectedStock',
    data: [ stockInfected],
    interpolation: 'cardinal',
    height: parseInt(stock_infectedSvg.select("rect").node().getBBox().height ),
    width: parseInt(stock_infectedSvg.select("rect").node().getBBox().width ),
    xPos: parseInt(stock_infectedSvg.select("rect").node().getBBox().x ),
    yPos: parseInt(stock_infectedSvg.select("rect").node().getBBox().y ),
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    stackData: false
  });

  var stock_recoveredSvg = d3.selectAll("#RecoveredStock" );
  var stock_recovered  = sirSystem.addGraph({
    svg: stock_recoveredSvg,
    classes: [ "graph", "stock"],
    showAxis: 'false',
    showAxis2: 'false',
    //containerDivClass: 'RecoveredStock',
    data: [ stockRecovered],
    interpolation: 'cardinal',
    height: parseInt(stock_recoveredSvg.select("rect").node().getBBox().height ),
    width: parseInt(stock_recoveredSvg.select("rect").node().getBBox().width ),
    xPos: parseInt(stock_recoveredSvg.select("rect").node().getBBox().x ),
    yPos: parseInt(stock_recoveredSvg.select("rect").node().getBBox().y ),
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    stackData: false
  });
}
