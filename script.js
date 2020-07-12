const fireSound = new Audio('./sounds/fire.mp3');
const burstSound = new Audio('./sounds/burst.mp3');
const powerDown = new Audio('./sounds/powerDown.mp3');

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const app = new Vue({
    el: '.gameDiv',
    data(){
      return {
          score: 0,
          x: 200,
          y: 200,
          angle: 0,
          bullets: [],
          bubbles: [],
          bubbleReached: false
      }  
    },
    created() {
       
        this.updateBullet();
        this.updateBubble();
        
    },
    methods: {

        // Handling moving of our player (W, A, S, D) and (↑,  ←,  ↓,  →) =====> Respectively Up, Left, Down and Right
        move(event)
        {
            let amount = 10;
            if((event.key == 'a' || event.key == 'ArrowLeft') && this.x > 0)
            {
                this.x -= amount;
            }
            else if((event.key == 'd' || event.key == 'ArrowRight') && this.x < 1000 - 100)         // -100 width of the player
            {
                this.x += amount;
            }
            else if((event.key == 'w' || event.key == 'ArrowUp') && this.y > 0)
            {
                this.y -= amount;
            }
            else if((event.key == 's' || event.key == 'ArrowDown') && this.y < 600 - 100)           // -100 width of the player
            {
                this.y += amount;
            }
            else if(event.key == " ")
            {
                this.fire();
            }
        },


        // Handling mouse scroll to rotate player
        rotate(event)
        {
            if(event.deltaY > 0)            // Rotate player clockwise
            {
                this.angle += 10;
                if(this.angle > 360)
                {
                    this.angle = 0;
                }
            }
            else                            // Rotate anti-clockwise
            {
                this.angle -= 10;
                if(this.angle < 0)
                {
                    this.angle = 360;
                }
            }
        },


        // This function will call when pressing spacebar this will push a new object in bullets array
        fire()
        {
            this.bullets.push({
                x: this.x + (100/2),            // 100 is height of player
                y: this.y + (100/2),
                angle: this.angle           
            });
            fireSound.play();
        },


        // It removes the bullets which are outside the playground
        outOfScreen(i)
        {
            if (this.bullets[i].x < 0       ||
                this.bullets[i].y < 0       ||
                this.bullets[i].x > 1000    ||
                this.bullets[i].y > 600)        
            {
                this.bullets.splice(i, 1);
            }
        },

        updateBullet()
        {
            /*
            --------------------------------This function will run for each bullet-------------------------------------
            
                1.  If bullet goes outside the Playground it will remove that bullet
                2.  Update Bullet position
            */
            setInterval(()=>{
                const distance = 30;
                this.bullets.forEach((bullet, i) => {
                    this.outOfScreen(i);
                    bullet.x += -Math.sin((Math.PI / 180) * (bullet.angle + 45)) * distance;
                    bullet.y += Math.cos((Math.PI / 180) * (bullet.angle + 45)) * distance;
                });
                this.checkCollusion();
            }, 30)
        }, 


        // checking if any bullet is overlaping any bubble
        checkCollusion()
        {
            this.bullets.forEach((bullet)=>{
                this.bubbles.forEach((bubble, i)=>{
                    if(
                        Math.abs(bullet.x - bubble.x) < (25 + 7.5 ) &&       // 25 is radious of bubble
                        Math.abs(bullet.y - bubble.y) < (25 + 7.5)           // 7.5 is radious of bullet
                    ){
                        this.bubbles.splice(i, 1);
                        this.score++;
                        burstSound.play();
                    }
                })
            });
        },

        // When a bubble reached at the top of gameDiv
        bubbleReachTop()
        {
            this.bubbles.forEach((bubble, i)=>{
                if(bubble.y < 0)
                {
                    console.log('ho gya');
                    this.bubbles.splice(i, 1);
                    this.bubbleReached = true;
                    powerDown.play();
                    setTimeout(()=>{
                        this.bubbleReached = false;
                    }, 1000);
                }
            });
        },

        updateBubble()
        {
            const n = 50 / 2                // Height of bubble
            setInterval(()=>{
                this.bubbles.forEach(bubble => {
                    bubble.y -= 2;
                });
                this.bubbleReachTop();
            }, 30)
            setInterval(()=>{               // Spawn bubble every 2 seconds
                this.bubbles.push({
                    x: random(n, 1000 - n),
                    y: 600 + n,
                    color: random(1, 10)
                })
            }, 2000)
        }
        
    },
    computed: 
    {
        // For position and rotaion of the player
        player()
        {
            return {
                left: this.x + 'px',
                top: this.y + 'px',
                transform: `rotate(${this.angle}deg)`
            }
        }
    },
})

// listening to user input

document.addEventListener("keydown", app.move);
document.addEventListener("wheel", app.rotate);

