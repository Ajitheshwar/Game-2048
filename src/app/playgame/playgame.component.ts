import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.css']
})
export class PlaygameComponent implements OnInit {

  constructor(private ds : DataService, private ar : ActivatedRoute) { }

  n=4
  game = new Array(this.n)
  merged = new Array(this.n*this.n).fill(false);

  ngOnInit(): void {

    this.n=4
    //console.log(this.ar.snapshot.params)
     this.newGame()
     this.btnName = "Start Game"
     this.gameOver = false
     this.ds.highscore.subscribe(
       value =>{
         this.highscore=value
         this.loggedin = this.ds.checklogin()
        }
     )
  }

  highscore = 0
  loggedin = false
  sum =0;
  btnName = ""
  gameOver = false;
  
  gameplay()
  {
    if(this.btnName=="Restart Game")
    {
      this.newGame()
      this.gameOver =false
      this.btnName="Start Game"
    }
    else
    {
      this.btnName = "Continue"
    }
  }


  gameCheck()
  {
    let count=0;
    if((this.game[0][0]!=this.game[0][1] && this.game[0][0]!=this.game[1][0]))
    {
      count++;
    }
    if((this.game[this.n - 1][0]!=this.game[this.n-2][0] && this.game[this.n - 1][0]!=this.game[this.n - 1][1]))
    {
      count++
    }
    if((this.game[0][this.n - 1]!=this.game[0][this.n-2] && this.game[0][this.n - 1]!=this.game[1][this.n - 1]))
    {
      count++
    }
    if((this.game[this.n - 1][this.n - 1]!=this.game[this.n - 1][this.n-2] && this.game[this.n - 1][this.n - 1]!=this.game[this.n-2][this.n - 1]))
    {
      count++
    }
       
    for(let i=1 ; i<this.n - 1 ;i++)
    {
      if((this.game[i][0]!=this.game[i+1][0] && this.game[i][0]!=this.game[i-1][0] && this.game[i][0]!=this.game[i][1]))
      {
        count++
      }
      
      if((this.game[i][this.n - 1]!=this.game[i+1][this.n - 1] && this.game[i][this.n - 1]!=this.game[i-1][this.n - 1] && this.game[i][this.n - 1]!=this.game[i][this.n-2]))
      {
        count++
      }
      if((this.game[0][i]!=this.game[0][i+1] && this.game[0][i]!=this.game[0][i-1] && this.game[0][i]!=this.game[1][i]))
      {
        count++
      }
      if((this.game[this.n - 1][i]!=this.game[this.n - 1][i+1] && this.game[this.n - 1][i]!=this.game[this.n - 1][i-1] && this.game[this.n - 1][i]!=this.game[this.n-2][i]))
      {
        count++
      }
    }

    for(let i=1;i<this.n - 1;i++)
    {
      for(let j=1;j<this.n - 1;j++)
      {
        if((this.game[i][j]!=this.game[i][j+1] && this.game[i][j]!=this.game[i][j-1] && this.game[i][j]!=this.game[i+1][j] && this.game[i][j]!=this.game[i-1][j] ))
        {
          count++
        } 
      }
    }
    if(count==16)
    {
      this.gameOver = true
    }
    for(let i=0;i<this.n;i++)
    {
      for(let j=0;j<this.n;j++)
      {
        if(this.game[i][j]==0)
        {
          this.gameOver = false;
        }
      }
    }
    if(this.gameOver && this.highscore<this.sum)
    {
      //console.log(this.highscore,this.sum)
      this.ds.updateHighscore(this.sum)
      this.ds.updateInDB(this.sum,false,"","").subscribe(
        {
          next : res=>{alert(res['message'])},
          error : err=>{console.log("error in updating password",err)}
        }
      )
      sessionStorage.removeItem("highscore")
      let x = this.highscore.toString()
      sessionStorage.setItem("highscore",x)
    }
  }

  newGame()
  {
    document.getElementById("focusbtn")?.focus()
    this.sum = 0
    this.game = new Array(this.n)
    for(let i=0;i<this.n;i++)
    {
      this.game[i]= new Array(this.n);
      for(let j=0;j<this.n;j++)
      {
        this.game[i][j]=0;
      }
    } 
    this.locateRandom()
  }
  
  locateRandom()
  {
    let x,r,c;
    let condition = true;
    let count = 0;
    do{
      x = Math.floor((Math.random()*this.n*this.n-1)+1) 
      r = Math.floor(x/this.n);
      c = x%this.n;
      if(this.game[r][c]==0)
      {
        this.game[r][c]=2;
        condition = false;
      }
      count++;
    }while(condition && count<=this.n*this.n);
  }

  x1=0
  x2=0
  y1=0
  y2=0
  start(event : TouchEvent)
  {
    if(!this.gameOver)
      this.btnName="Continue"
    this.x1 = event.touches[0].clientX;
    this.y1 = event.touches[0].clientY;
  } 
  
  move(event : TouchEvent)
  {
    this.x2 = event.touches[0].clientX;
    this.y2 = event.touches[0].clientY;  
  }

  end(event : any)
  {
    let x= this.x2-this.x1
    let y = this.y2-this.y1
    console.log(x+"  "+y)
    if(!this.gameOver)
    {
      if(x>50 && x>Math.abs(y))
      {
        console.log("swipe right")
        this.rightArrow()
      }
      else if(y>50 && y>Math.abs(x))
      {
        console.log("swipe down")
        this.downArrow()
      }
      else if(x<-50 && x<-Math.abs(y))
      {
        console.log("swipe left")
        this.leftArrow()
      }
      else if(y<-50 && y<-Math.abs(x))
      {
        console.log("swipe up")
        this.upArrow()
      }
    }
    this.gameCheck()
    if(this.gameOver)
    {
      this.btnName="Restart Game"
    }
  }

  getArrow(eventCode : KeyboardEvent)
  {

    if(!this.gameOver)
    {
      if(eventCode.key=="ArrowUp")
      {
        this.upArrow()
      }
      else if(eventCode.key=="ArrowDown")
      {
        this.downArrow()
      }
      else if(eventCode.key=="ArrowLeft")
      {
        this.leftArrow()
      }
      else if(eventCode.key=="ArrowRight")
      {
        this.rightArrow()
      }
    }
    this.gameCheck()
    if(this.gameOver)
    {
      this.btnName = "Restart Game"
    }
  }

  downArrow()
  {
    let i,j,k,x
    x=false

    for(j=0;j<this.n;j++)
    {
      for(i=this.n - 2;i>=0;i--)
      {
        if(this.game[i][j]!=0)
        {
          for(k=i+1;k<this.n;k++)
          {
            if(this.game[k][j]!=0)
            {
              break;
            }
          }

          let y = k*this.n + j

          if(k==this.n)
          {
            x = true;
            this.game[this.n - 1][j] = this.game[i][j]
            this.game[i][j] = 0
          }
          else if(this.game[k][j]==this.game[i][j] && !this.merged[y])
          {
            x = true;
            this.sum = this.sum + 2*this.game[i][j]
            this.game[k][j] = this.game[k][j]*2;
            this.game[i][j] = 0
          }
          else if(k-1 != i)
          {
            this.game[k-1][j] = this.game[i][j]
            this.game[i][j] = 0
            x = true 
          }
        }
      }
    }
    if(x)
    {
      this.merged.fill(false)
      this.locateRandom()
    }
  }


  upArrow()
  {
    let i,j,k,x
    x = false

    for(j=0;j<this.n;j++)
    {
      for(i=1;i<this.n;i++)
      {
        if(this.game[i][j]!=0)
        {
          for(k=i-1;k>=0;k--)
          {
            if(this.game[k][j]!=0)
            {
              break;
            }
          }

          let y = k*this.n + j;

          if(k==-1)
          {
            x=true
            this.game[0][j]=this.game[i][j];
            this.game[i][j]=0
          }
          else if(this.game[k][j]==this.game[i][j] && !this.merged[y])
          {
            this.merged[y] = true
            x= true
            this.sum = this.sum + 2*this.game[i][j]
            this.game[k][j] = 2*this.game[k][j];
            this.game[i][j] = 0
          }
          else if(k+1!=i)
          {
            this.game[k+1][j]=this.game[i][j]
            this.game[i][j] = 0
            x = true
          }
        }
      }
    }
    if(x)
    {
      this.merged.fill(false)
      this.locateRandom()
    }
  }

  rightArrow()
  {
    let i,j,k,x
    x=false
    for(i=0;i<this.n;i++)
    {
      for(j=this.n-2;j>=0;j--)
      {
        if(this.game[i][j]!=0)
        {
          for(k=j+1;k<this.n;k++)
          {
            if(this.game[i][k]!=0)
            {
              break;
            }
          }

          let y = i*this.n+k
          if(k==this.n)
          {
            x=true
            this.game[i][this.n - 1]=this.game[i][j];
            this.game[i][j]=0
          }
          else if(this.game[i][k]==this.game[i][j] && !this.merged[y])
          {
            x=true
            this.merged[y] = true
            this.sum = this.sum + this.game[i][j]*2;
            this.game[i][k] = 2*this.game[i][k];
            this.game[i][j] = 0
          }
          else if(j!=k-1)
          {
            x=true
            this.game[i][k-1] = this.game[i][j]
            this.game[i][j] = 0
          }
        }
      }
    }
    if(x)
    {
      this.locateRandom()
      this.merged.fill(false)
    }
  }

  leftArrow()
  {
    let i,j,k,x 
    x= false;
    for(i=0;i<this.n;i++)
    {
      for(j=1;j<this.n;j++)
      {
        if(this.game[i][j]!=0)
        {
          for(k=j-1;k>=0;k--)
          {
            if(this.game[i][k]!=0)
            {
              break;
            }
          }
          let y = i*this.n+k
          
          if(k==-1)
          {
            this.game[i][0]=this.game[i][j];
            this.game[i][j]=0
            x=true;
          }
          else if(this.game[i][k]==this.game[i][j] && !this.merged[y])
          {
            this.sum=this.sum+2*this.game[i][j];
            this.merged[y]=true;
            this.game[i][k]=2*this.game[i][k]
            this.game[i][j]=0
            x = true;
          }
          else if(j!=k+1)
          {
            let z=this.game[i][j];
            this.game[i][j]=0;
            this.game[i][k+1]=z;
            x=true
          }
        }
      }
    }
    if(x)
    {
      this.locateRandom();
      this.merged.fill(false)
    }
  }
}
