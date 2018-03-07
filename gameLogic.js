
let game = function(playerName, startStats) {
  var map = [];
  var player = playerName;
  var dementions = 0
  var location = [0,0];
  var charLocation;
  var currentSituation;
  var playerStats = {
    'level': 1,
    'Exp': 0,
    'health': startStats.health,
    'currentHealth': startStats.health,
    'speed': startStats.speed,
    'strength': startStats.strength,
    'attack': startStats.attack,
    'defense': startStats.defense,
    'regeneration': startStats.regeneration,
    'intellegence': startStats.intellegence,
    'luck': startStats.luck
    
  };
  var requiredExp = 40;
  var inventory = {
    weight: startStats * 2,
    main: [],
    hasBackPack: false,
    backPackWeight: 0,
    backPack: [],
    gold: 0
  };
  
  var generateMap = function(mapDementions) {
    dementions = mapDementions;
    let newDementions = 0 - (Math.floor(mapDementions / 2))
    charLocation = [Math.abs(newDementions),Math.abs(newDementions)]
    for(var i = Math.abs(newDementions); i >= newDementions; i--){
      let matrix = []
      for(var x = newDementions; x < Math.abs(newDementions) + 1; x++){
        matrix.push([x,i, new plot([x,i])])
      }
      map.push(matrix)
    }
  }
  generateMap(5)
  
  var regenerate = function(){
    var regenerationPoints = playerStats.regeneration * 5;
    if(playerStats.currentHealth + regenerationPoints < playerStats.health){
      playerStats.currentHealth += regenerationPoints;
    } else {
      playerStats.currentHealth = playerStats.health;
    }
  }
  this.move = function(direction) {
    var horizontal = direction[0]
    var vertical = direction[1]
    location[0] += horizontal;
    location[1] += vertical;
    if(horizontal === 1){
       map.forEach(each => {
         let newPosition = [each[each.length - 1][0], each[each.length - 1][1], new plot([each[each.length - 1][0],each[each.length - 1][1]])]
         newPosition[0] ++
         each.shift()
         each.push(newPosition)
       })
    }
    if(horizontal === -1){
       map.forEach(each => {
         let newPosition = [each[0][0], each[0][1], new plot([each[0][0], each[0][1]])]
         newPosition[0] --
         each.pop()
         each.unshift(newPosition)
       })
    }
    if(vertical === 1){
       let newUpper = []
       map[0].forEach(each => {
         newUpper.push([each[0], each[1] + 1, new plot([each[0], each[1] + 1])])
       })
       map.pop()
       map.unshift(newUpper)
    }
    if(vertical === -1){
      let newLower = []
      map[map.length - 1].forEach(each => {
        newLower.push([each[0], each[1] - 1, new plot([each[0], each[1] - 1])])
      })
      map.push(newLower)
      map.shift()
    }
    currentSituation = map[2][2][2]
    if(currentSituation.enemy){
      let fightOutcome = fight({stats: playerStats}, {stats: currentSituation.enemy.stats})
      if(fightOutcome[0] === 'player'){
        //Fight outcome - 
        playerStats.currentHealth = fightOutcome[1]
        inventory.gold += currentSituation.enemy.inventory.gold
        currentSituation.enemy = null
      } else {
        //Should eventually restart the game at death 
        alert('you died')
      }
    }
    regenerate();
  }
  this.getLocation = function(){
    return location
  }
  this.getMap = function(){
    return map
  }
  this.getStats = function(){
    return playerStats
  }
  this.getInventory = function(){
    return inventory.main
  }
  this.getBackPack = function(){
    return inventory.backPack
  }
  this.getSituation = function(){
    return currentSituation;
  }
  this.getGold = function(){
    return inventory.gold
  }
}

let fight = function(player, enemy){
  console.log(player.stats, enemy.stats)
  this.playerHealth = player.stats.currentHealth;
  this.enemyHealth = enemy.stats.health;
  this.attackPoints = calculateDamageRange(player.stats, enemy.stats)
  this.playerAttackRange = attackPoints[0]
  this.enemyAttackRange = attackPoints[1]
  let turn = 'player';
  let winner;
  while(this.playerHealth > 0 && this.enemyHealth > 0){
    this.playerAttack = playerAttackRange[Math.floor(Math.random() * (playerAttackRange.length - 1))]
    this.enemyAttack = enemyAttackRange[Math.floor(Math.random() * (enemyAttackRange.length - 1))]
    if(turn === 'player'){
      let attack = prompt('Its your turn to attack - Goblin lvl ' + enemy.stats.level + ' - Your Health ' + this.playerHealth + ' - Enemy Health ' + this.enemyHealth + '\n PlayerStats - ' + player.stats.attack + '\n Enemy Stats - ' + enemy.stats.attack)
      console.log(attack)
      if(attack === 'attack'){
        this.enemyHealth = this.enemyHealth - this.playerAttack
      }
      if(this.enemyHealth <= 0){
        winner = 'player';
        break;
      }
      turn = 'enemy';
    }
    if(turn === 'enemy'){
      this.playerHealth = this.playerHealth - this.enemyAttack
      if(this.playerHealth <= 0){
        winner = 'enemy';
        break;
      }
      turn = 'player'
    }
  }
  return [winner, this.playerHealth];
}

let plot = function(plotLocation){
  var horizontal = location[0]
  var vertical = location[1]
  this.terrain = 'Grass';
  this.enemy;
  Math.random() > .75 ? this.enemy = new enemy(plotLocation) : null
  this.loc = plotLocation
}

let enemy = function(plotLocation){
  var level = Math.abs(Math.floor(Math.max(plotLocation[0], plotLocation[1])/5)) + 1;
  var gold = Math.floor(10 * (Math.random() * level))
  this.type = 'Goblin';
  this.inventory = {
    main: [],
    hasBackPack: false,
    backPackWeight: 0,
    backPack: [],
    'gold': gold
  }
  this.stats = enemyStatPoints(level)
}

let enemyStatPoints = function(level){
  var enemyExp = 
  var baseAttack = 1;
  var baseDefense = 1;
  var remaining = level - 1;
  var remainingPoints = [];
  var additionalAttack = 0;
  var additionalDefense = 0;
  for(var i = 0; i < remaining + 1; i++){
    remainingPoints.push(i);
  }
  var split = Math.floor(Math.random() * remainingPoints.length + 1)
  additionalAttack = remainingPoints[split - 1]
  additionalDefense = (level - 1) - remainingPoints[split - 1]
  console.log(remainingPoints, split)
  
  var baseStats = {
    'level': level,
    'Exp': 0,
    'health': 100 + (30 * (level - 1)),
    'speed': 1,
    'strength': 10,
    'attack': baseAttack + additionalAttack,
    'defense': baseDefense + additionalDefense,
    'regeneration': 1,
    'intellegence': 1,
    'luck': 1
  }
  return baseStats;
}

let calculateDamageRange = function(playerStats, enemyStats){
  let playerAttack = [];
  let enemyAttack = [];
  let playerStart = 19 - (Math.floor(enemyStats.defense * .5))
  let playerEnd = 24
  let enemyStart = 9 - (Math.floor(playerStats.defense * .5))
  let enemyEnd = 14
  for(var i = playerStart; i < playerEnd; i++){
    let attackPoint = i + (Math.floor(i * (playerStats.level * .2)))
    attackPoint += (playerStats.attack * 3)
    attackPoint = attackPoint + Math.floor((playerStats.attack - enemyStats.defense) * (attackPoint *.03))
    attackPoint = attackPoint + Math.floor(playerStats.attack * (attackPoint * .01))
    playerAttack.push(attackPoint)
  }
  for(var x = enemyStart; x < enemyEnd; x++){
    let enemyAttackPoint = x + (Math.floor(x * (enemyStats.level * .2)))
    enemyAttackPoint += enemyStats.attack * 3
    enemyAttackPoint = enemyAttackPoint + Math.floor((enemyStats.attack - playerStats.defense) * (enemyAttackPoint *.03))
    enemyAttackPoint = enemyAttackPoint + Math.floor(enemyStats.attack * (enemyAttackPoint * .01))
    enemyAttack.push(enemyAttackPoint)
  }
  return [playerAttack, enemyAttack]
}


let enemyData = {
  
}

let game1 = new game('Viktor', {
  'health': 100,
  'speed': 1,
  'strength': 10,
  'attack': 1,
  'defense': 1,
  'regeneration': 1,
  'intellegence': 1,
  'luck': 1
})

//game1.move([0, -1])
//game1.move([-1,0])
//game1.move([0,-1])
//game1.move([0,-1])
//game1.getLocation()
game1.getSituation()
//game1.getMap();
//game1.getStats()
//game1.getMap()
//game1.getBackPack()

