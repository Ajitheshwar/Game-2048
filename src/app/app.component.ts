import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Game-2048';
  
  constructor(private ds : DataService){}
  
  ngOnInit(): void {
    this.login = true
    this.formfill = false
    this.notify = this.ds.checklogin()
    this.loggedin = false
    this.ds.setUsername()
    this.changePassword = false;
  }

  changePassword = false;
  loggedin = false
  notify = false;
  login = true
  formfill = false

  allowLogin()
  {
    this.notify = false
    this.loggedin = true;
  }

  closeLogin()
  {
    this.loggedin = false
    this.notify = this.ds.checklogin()
  }

  loginSignIn(value : boolean)
  {
    this.formfill = false
    this.login = value
  }

  focus(event : KeyboardEvent)
  {
    this.formfill = true
    if(!this.changePassword)
    {
      if(event.key=='Enter')
      {
        if(document.activeElement?.id == 'username')
        {
          document.getElementById('password')?.focus()
        }
        else if(document.activeElement?.id == 'password')
        {
          document.getElementById('submit')?.focus()
        }
        else
        {
          document.getElementById('username')?.focus()
        }
      }
    }
    else
    {
      if(event.key=='Enter')
      {
        if(document.activeElement?.id == 'username1')
        {
          document.getElementById('password1')?.focus()
        }
        else if(document.activeElement?.id == 'password1')
        {
          document.getElementById('submit1')?.focus()
        }
        else
        {
          document.getElementById('username1')?.focus()
        }
      }
    }
  }

  closeNotify()
  {
    this.notify = false
  }
  submit(value : any)
  {
    let obj = value
    obj.login = this.login
    if(this.login)
    {
      this.ds.loginSignUp(obj).subscribe(
        {
          next : (res)=> {
            //console.log(res)
            alert(res['message'])
            if(res['message']=="Login Successful")
            {
              sessionStorage.setItem("token",res["token"]);
              this.notify = false;
              this.loggedin = false;
              this.ds.updateHighscore(res["user"].highscore)
              sessionStorage.setItem("username",res["user"].username)
              sessionStorage.setItem("highscore",res["user"].highscore)
              this.ds.setUsername()
            }
          },
          error : (err)=>console.log(err),
        }
       )
    } 
    else
    {
      obj.highscore = 0
      this.ds.loginSignUp(obj).subscribe(
        {
          next : (res)=> {
            //console.log(res)
            alert(res['message'])
          },
          error : (err)=>console.log(err),
        }
       )
    }
  }

  allowPasswordChange()
  {
    this.changePassword=true;
  }

  updatePassword(value : any)
  {
    //console.log(value)
    this.ds.updateInDB(0,true,value.username,value.password).subscribe(
      {
        next : res=>{
          alert(res['message'])
          if(res["message"]=="Password updated")
          {
            this.changePassword = false
          }
        },
        error : err=>{console.log("error in updating password",err)}
      }
    )
  }
}
