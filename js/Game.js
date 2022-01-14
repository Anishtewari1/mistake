class Game {
  constructor() {
    this.resetButton=createButton("")
    this.leaderBoard=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
    this.playerMoving=false
  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // TA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    fuels=new Group();
    powerCoins=new Group();
    this.addSprites(fuels,4,fuelImage,0.02)
    this.addSprites(powerCoins,18,powerCoinImage,0.09)
  }
    addSprites(spriteGroup,numberOfSprites,spriteImage,scale){
      for(var i=0;i<numberOfSprites;i++){
        var x=random(width/2+150,width/2-150)
        var y =random(-height*4.5,height-400)
        var sprite = createSprite(x,y)
        sprite.addImage(spriteImage)
        sprite.scale=scale
        spriteGroup.add(sprite)
      }
    }
  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetButton.position(width/2+230,50)
    this.resetButton.class("reset")
    this.leaderBoard.html("LEADERBOARD")
    this.leaderBoard.position(width/3-60,40)
    this.leaderBoard.class("resetText")
    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)
  }

  //SA
  play() {
    this.handleElements();
    this.handleResetButton();
    this.handlePlayerControls();
    

    Player.getPlayersInfo();
    player.getCarsAtEnd()
    if(allPlayers!==undefined){
    image(track,0,-height*5,width,height*6)
    this.showLeaderBoard()
    this.showFuelBar()
    this.showLifeBar()
    var index=0
    for(var plr in allPlayers){
      index=index+1
      var x = allPlayers[plr].positionX
      var y = height-allPlayers[plr].positionY
      cars[index-1].position.x=x
      cars[index-1].position.y=y
      if(index===player.index){
       stroke(10)
       fill("red")
       ellipse(x,y,80,80)
       camera.position.x=width/2
       camera.position.y=cars[index-1].position.y
       this.handleFuel(index)
       this.handlePowerCoins(index)

      }
    }
    
     if(keyIsDown(UP_ARROW)){
     player.positionY+=10
     player.update()
     }
     const finishline= height*6-100
     if(player.positionY>finishline){
        gameState=2
        player.rank+=1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
     }
      drawSprites();
    }
  }
  handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel=185
      collected.remove()
    })
    if(player.fuel>0&&this.playerMoving){
       player.fuel-=0.3
    }
    if(player.fuel<=0){
       gameState=2
       this.gameOver()
    }
  }
  handlePowerCoins(index){
    cars[index-1].overlap(powerCoins,function(collector,collected){
      player.score+=20
      player.update()
      collected.remove()
    })
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,gameState:0,players:{},carsAtEnd:0
      })
      window.location.reload()
    })
  }
  showLeaderBoard(){
    var leader1,leader2
    var player=Object.values(allPlayers)
    if(
      (player[0].rank===0&&player[1].rank===0)|| player[0].rank===1
    ){
       leader1=player[0].rank+"&emsp"+player[0].name+"&emsp"+player[0].score
       leader2=player[1].rank+"&emsp"+player[1].name+"&emsp"+player[1].score
    }
    if(player[1].rank===1){
      leader1=player[1].rank+"&emsp"+player[1].name+"&emsp"+player[1].score
      leader2=player[0].rank+"&emsp"+player[0].name+"&emsp"+player[0].score
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }
  handlePlayerControls(){
    if(keyIsDown(UP_ARROW)){
      this.playerMoving=true
      player.positionY+=10
      player.update()
      }
      if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
        player.positionX-=5
        player.update()
        } 
        if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
          player.positionX+=5
          player.update()
          }
  }
  showRank(){
    swal({
      title:`Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text:"YOU REACHED THE FINISH LINE SUCCESSFULLY",
      imageUrl:
      "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"ok"
    })
  }
  gameOver(){
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    }) 
  }
  showFuelBar(){
    push()
    image(fuelImage,width/2-130,height-player.positionY-300,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-300,185,20)
    fill("yellow")
    rect(width/2-100,height-player.positionY-300,player.fuel,20)
    pop()
  }
  showLifeBar(){
    push()
    image(lifeImage,width/2-130,height-player.positionY-400,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-400,185,20)
    fill("red")
    rect(width/2-100,height-player.positionY-400,player.life,20)
    pop()
  }

}
