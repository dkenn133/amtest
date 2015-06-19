var gameStep=1;
var animal={
		name:'',
		food:'',
		foodBonus:'',
		foodBonusAmount:0,
		foodBonusMessage:'',
		weaponCode:'',
		weaponName:'',
		monsterCode:'',
		monsterName:'',
		battleResult:'',
		battleResultMessage:''
};

var gameData={};
/*
var gameData={
	"gameData":{
	"monsters":[
				{"code":"sk", "name":"Skeleton","appearanceRate":.25},	
				{"code":"zo", "name":"zombie","appearanceRate":.50},
				{"code":"be", "name":"bear","appearanceRate":.24},
				{"code":"un", "name":"unicorn","appearanceRate":.01}
			],
			
			"weapons":[
				{"code":"bs","name":"Broken Sword"},
				{"code":"bk","name":"broken knife"},
				{"code":"s","name":"sword"},
				{"code":"k","name":"knife"},
				{"code":"ha","name":"hatchet"},
				{"code":"nu","name":"nun chucks"}
			],
			
			"weaponDamages":[
				{"mCode":"sk","wCode":"bs", "killRate":.20},
				{"mCode":"sk","wCode":"bk", "killRate":.30},
				{"mCode":"sk","wCode":"s", "killRate":.50},
				{"mCode":"sk","wCode":"k", "killRate":.70},
				{"mCode":"sk","wCode":"ha", "killRate":.80},
				{"mCode":"sk","wCode":"nu", "killRate":.90},	
				{"mCode":"zo","wCode":"bs", "killRate":.30},
				{"mCode":"zo","wCode":"bk", "killRate":.40},
				{"mCode":"zo","wCode":"s", "killRate":.60},
				{"mCode":"zo","wCode":"k", "killRate":.80},
				{"mCode":"zo","wCode":"ha", "killRate":.90},
				{"mCode":"zo","wCode":"nu", "killRate":01},
				{"mCode":"be","wCode":"bs", "killRate":.10},
				{"mCode":"be","wCode":"bk", "killRate":.30},
				{"mCode":"be","wCode":"s", "killRate":.45},
				{"mCode":"be","wCode":"k", "killRate":.60},
				{"mCode":"be","wCode":"ha", "killRate":.75},
				{"mCode":"be","wCode":"nu", "killRate":.90},
				{"mCode":"un","wCode":"bs", "killRate":.01},
				{"mCode":"un","wCode":"bk", "killRate":.10},
				{"mCode":"un","wCode":"s", "killRate":.25},
				{"mCode":"un","wCode":"k", "killRate":.30},
				{"mCode":"un","wCode":"ha", "killRate":.40},
				{"mCode":"un","wCode":"nu", "killRate":.50}

			],
			"dropRates":
			[
				{"mCode":"sk",
					"weaponRate":[
					              {"wCode":"k", "dropRate":.50},
					              {"wCode":"ha", "dropRate":.25},				
					              {"wCode":"bs", "dropRate":.24},
					              {"wCode":"nu", "dropRate":.1}
					 ],
					 "nothingRate":0
				},
				{"mCode":"zo",
					"weaponRate":[
					            {"wCode":"bk", "dropRate":.50},
					            {"wCode":"ha", "dropRate":.20},				
					        	{"wCode":"k", "dropRate":.4},
					        	{"wcode":"nu","dropRate":.1}
					 ],
					 "nothingRate":.25
				},
				
				{"mCode":"be",
					"weaponRate":[
					            {"wCode":"bk", "dropRate":.50},
					            {"wCode":"ha", "dropRate":.30},				
					        	{"wCode":"k", "dropRate":.19},
					        	{"wcode":"nu","dropRate":.1}
					 ],
					 "nothingRate":0
				},
				
				{"mCode":"un",
					"weaponRate":[
					            {"wCode":"bk", "dropRate":0},
					            {"wCode":"ha", "dropRate":0},				
					        	{"wCode":"k", "dropRate":0},
					        	{"wcode":"nu","dropRate":.99}
					 ],
					 "nothingRate":.01
				}
			]
		}
};*/

function initGame(){

	 $.ajax({url: "data/am.json", dataType: 'json', success: function(data){
		 console.log(data);
		 gameData=data.gameData;
	    }});
	
	 
/*	 $.ajax({ 
		    type: 'GET', 
		    url: 'data/am.json', 
		    //data: { get_param: 'value' }, 
		    dataType: 'json',
		    success: function (data) { 
		    	console.log(data);
		       gameData=data;
		    }
		});
	*/ 
	//show the header text
	showTemplate('header', '#headerPane', null);
	
	//set the game pane
	showTemplate('gameInit', '#gamePane', null);
	
	//set the control pane
	//var footerData={
	//	 'step1':'press the button to setup the Name'
	//};
	showTemplate('footer', '#footerPane', animal);
}	




function goToName(){	
	showTemplate('gameView', '#gamePane', null);
	
	
	setTimeout(function(){
		if(animal.name){
			showTemplate('gameDisplayStatus', '#gameDisplay', animal);
			showTemplate('gameFeedAnimal', '#gameControl', animal);
		}else{
			showTemplate('gameControlName', '#gameControl', null);
			showTemplate('gameDisplayStatus', '#gameDisplay', animal);
		}
		}, 100);
	
}

function setName(name){
	animal.name=name;
	showTemplate('gameDisplayStatus', '#gameDisplay', animal);
	showTemplate('gameFeedAnimal', '#gameControl', animal);
	//alert("The animal name is: " +name);
}

function goToFood(){
	
	showTemplate('gameDisplayStatus', '#gameDisplay', animal);
	showTemplate('gameFeedAnimal', '#gameControl', animal);
	//alert("The animal name is: " +name);
}

/*
function setFood(food){
	animal.food=food;
	showTemplate('footer', '#footerPane', animal);
	//showTemplate('gameFeedAnimal', '#gamePane', null);
	//alert("The animal name is: " +name);
}
*/

function selectFood(food){
	var bonusAmt=20;
	animal.food=food;
	showTemplate('gameDisplayStatus', '#gameDisplay', animal);
	var selector ="#img"+food;
	if(food===getRandomFood()){
		animal.foodBonus='y';
		animal.foodBonusAmount=bonusAmt;
		animal.foodBonusMessage= "You got the special food. Bonus "+bonusAmt+
		"% chance of defeating the next monster";
	}
	showTemplate('gameFeedBonus', '#gameControl', animal);
}

function goFoundWeapon(){
	if(animal.weaponCode){
		goMonsterEncounter();
	}else{
		animal.weaponCode='s';
		animal.weaponName=getWeaponName(animal.weaponCode);
		showTemplate('gameDisplayStatus', '#gameDisplay', animal);
		showTemplate('gameFoundWeapon', '#gameControl', animal);
	}	
}

function goMonsterEncounter(){
	animal.monsterCode=getWeightedMonsterEncounter();
	animal.monsterName=getMonsterName(animal.monsterCode);
	showTemplate('gameDisplayStatus', '#gameDisplay', animal);
	showTemplate('gameMonsterEncounter', '#gameControl', animal);
}

function goMonsterBattle(){
	var kRate=getKillRate(animal.monsterCode, animal.weaponCode);
	var battleResult=isMonsterDead(kRate);
	if(battleResult){
		animal.battleResultMessage="You won the Battle. Great job!";
		animal.battleResult="won";
	}else{
		animal.battleResultMessage="You lost the Battle. Better luck next time.";
		animal.battleResult="lost";
	}
	showTemplate('gameDisplayStatus', '#gameDisplay', animal);
	showTemplate('gameBattleResult', '#gameControl', animal);
}

function getKillRate(monster, weapon){
	for(var i=0;i<gameData.weaponDamages.length;i++){
		if(gameData.weaponDamages[i].mCode==monster&&gameData.weaponDamages[i].wCode==weapon){
			return gameData.weaponDamages[i].killRate;
		} 
	}
	return 0;
	
}

function getWeaponName(code){
	for(var i=0;i<gameData.weapons.length;i++){
		if(gameData.weapons[i].code==code){
			return gameData.weapons[i].name;
		} 
	}
	return 'unknown';
	
}
function getMonsterName(code){
	for(var i=0;i<gameData.monsters.length;i++){
		if(gameData.monsters[i].code==code){
			return gameData.monsters[i].name;
		} 
	}
	return 'unknown';
	
}

function getWeightedMonsterEncounter(){
	var data=[];
	//var item={'code':'','value':''};
	for (var i=0;i<gameData.monsters.length;i++){
		var item={};
		item.code=gameData.monsters[i].code;
		item.value=gameData.monsters[i].appearanceRate;
		data.push(item);
	}
	
	return(weightedRandom(data));
	
};

function weightedRandom(data){
	var table=[];
	for(i=0;i<data.length;i++){
		for(j=0;j<data[i].value;j++){
			table.push(data[i].code);
		};
	}
	 var result = table[Math.floor(Math.random() *table.length)];
	 return result;
};

function showTemplate(templateName, pane, data){
	 //remove the current pane 
	 $(pane).empty();  
	 var source;
     var template;
     var path = "js/template/"+templateName+".html";
     $.ajax({
         url: path,
         
         cache: true,
         success: function (htmlData) {
             source = htmlData;
             template = Handlebars.compile(source);
             //$(pane).html(template(data));
             //$('#controlPane').append(template(data));
             $(pane).append(template(data));        
         }
     });
}

function getRandomFood(){
	var randomNumber = Math.random();
	
	if(randomNumber<=.33){
		return 'melon';
	}else if(randomNumber<=.66){
		return 'pie';
	}else{
		return 'taco';
	}
	
}
//return true if monster killed
//return false if not killed
function isMonsterDead(kRate){
	var randomNumber = Math.random();
	
	return(randomNumber<=(kRate/100));
}


Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	  if(v1 === v2) {
	    return options.fn(this);
	  }
	  return options.inverse(this);
	});

/*
function weightedRandom(data){
	var table[];
	for(i=0;i<data.length;i++){
		for(j=0;j<data[i].value;j++){
			table.push(i);
		};
	}
	return table[Math.floor(Math.random() *table.length)];
};
*/
/*
function weightedRand(spec) {
	  var i, j, table=[];
	  for (i in spec) {
	    // The constant 10 below should be computed based on the
	    // weights in the spec for a correct and optimal table size.
	    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
	    for (j=0; j<spec[i]*10; j++) {
	      table.push(i);
	    }
	  }
	  return function() {
	    return table[Math.floor(Math.random() * table.length)];
	  };
	}
	var rand012 = weightedRand({0:0.8, 1:0.1, 2:0.1});
	rand012(); // random in distribution...
*/