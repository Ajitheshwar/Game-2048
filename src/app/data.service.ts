import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements HttpInterceptor{

  constructor(private http : HttpClient) { }

  loggedin = false
  username = ""
  highscore = new BehaviorSubject<any>(0);
  //highScoreObservable = this.highscore.asObservable()

  setUsername()
  {
    let x = sessionStorage.getItem("username")
    if(x==null)
    {
      this.username=""
    }
    else{
      this.username = x;
      this.updateHighscore(sessionStorage.getItem("highscore"))
    }
  }

  updateHighscore(value : any)
  {
    this.highscore.next(value)
  }

  updateInDB(sum : any,changePwd : boolean,username : string,pwd : string) : Observable<any>
  {
    console.log(sum,changePwd,username,pwd)
    
    if(changePwd)
    {
      return this.http.put("",{username : username,changePassword : changePwd,password : pwd})
    }
    else
    {
      return this.http.put("",{username : this.username, highscore : sum,changePassword : changePwd})
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    // Get Token from browser storage 
    let token=sessionStorage.getItem("token")

    //Token existance
    if(token){

      // Add it to header of request object 
      let copyRequest=req.clone({
        headers : req.headers.set("Authorization", "Bearer "+token)
      })

      // pass request object to server
      return next.handle(copyRequest)
    }
    else{
      return next.handle(req)
    }
  }


  checklogin()
  {
    if(sessionStorage.getItem("token")!=null)
    {
      this.loggedin = false
    }
    else
    {
      this.loggedin = true
    }
    return this.loggedin
  }

  
  loginSignUp(obj : any) : Observable<any>
  {
    console.log(obj)
    return this.http.post('',obj);
  }

}
