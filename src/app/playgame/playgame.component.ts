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

  game = new Array(4)
  merged = new Array(16).fill(false);

  ngOnInit(): void {

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
    if((this.game[3][0]!=this.game[2][0] && this.game[3][0]!=this.game[3][1]))
    {
      count++
    }
    if((this.game[0][3]!=this.game[0][2] && this.game[0][3]!=this.game[1][3]))
    {
      count++
    }
    if((this.game[3][3]!=this.game[3][2] && this.game[3][3]!=this.game[2][3]))
    {
      count++
    }
       
    for(let i=1 ; i<3 ;i++)
    {
      if((this.game[i][0]!=this.game[i+1][0] && this.game[i][0]!=this.game[i-1][0] && this.game[i][0]!=this.game[i][1]))
      {
        count++
      }
      
      if((this.game[i][3]!=this.game[i+1][3] && this.game[i][3]!=this.game[i-1][3] && this.game[i][3]!=this.game[i][2]))
      {
        count++
      }
      if((this.game[0][i]!=this.game[0][i+1] && this.game[0][i]!=this.game[0][i-1] && this.game[0][i]!=this.game[1][i]))
      {
        count++
      }
      if((this.game[3][i]!=this.game[3][i+1] && this.game[3][i]!=this.game[3][i-1] && this.game[3][i]!=this.game[2][i]))
      {
        count++
      }
    }

    for(let i=1;i<3;i++)
    {
      for(let j=1;j<3;j++)
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
    for(let i=0;i<4;i++)
    {
      for(let j=0;j<4;j++)
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
    let y=1;
    for(let i=0;i<4;i++)
    {
      this.game[i]= new Array(4);
      for(let j=0;j<4;j++)
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
      x = Math.floor((Math.random()*15)+1) 
      r = Math.floor(x/4);
      c = x%4;
      if(this.game[r][c]==0)
      {
        this.game[r][c]=2;
        condition = false;
      }
      count++;
    }while(condition && count<=16);
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

    for(j=0;j<4;j++)
    {
      for(i=2;i>=0;i--)
      {
        if(this.game[i][j]!=0)
        {
          for(k=i+1;k<4;k++)
          {
            if(this.game[k][j]!=0)
            {
              break;
            }
          }

          let y = k*4 + j

          if(k==4)
          {
            x = true;
            this.game[3][j] = this.game[i][j]
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

    for(j=0;j<4;j++)
    {
      for(i=1;i<4;i++)
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

          let y = k*4 + j;

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
    for(i=0;i<4;i++)
    {
      for(j=2;j>=0;j--)
      {
        if(this.game[i][j]!=0)
        {
          for(k=j+1;k<4;k++)
          {
            if(this.game[i][k]!=0)
            {
              break;
            }
          }

          let y = i*4+k
          if(k==4)
          {
            x=true
            this.game[i][3]=this.game[i][j];
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
    for(i=0;i<4;i++)
    {
      for(j=1;j<4;j++)
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
          let y = i*4+k
          
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
