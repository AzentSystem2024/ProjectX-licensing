import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyserviceService } from 'src/app/myservice.service';
import { FormBuilder,FormControl,Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  userdata:any;
  internetIp:any;

  constructor(private platformlocation:PlatformLocation,private service:MyserviceService,private fb:FormBuilder,private router:Router) { 
    history.pushState(null,'',location.href);
    this.platformlocation.onPopState(()=>{
      history.pushState(null,'',location.href);
    });

    service.getInternetIp().subscribe(data=>{
      this.internetIp=data;
      
    }) 
  }


  loginForm=this.fb.group({
    LOGIN_NAME:[''],
    PASSWORD:[''],
  });
  


  // UserLogin(){
  //   console.log('userdata',this.userdata);
    
  //   let existingUser = this.userdata.find((user:any) => user.LOGIN_NAME === this.loginForm.value.LOGIN_NAME && user.PASSWORD === this.loginForm.value.PASSWORD);
  //   console.log(existingUser);
    
  //   if(existingUser){
  //     this.router.navigate(['/dashboard']);
  //     const user = { username: existingUser.USER_NAME}; // Replace with actual user data
  //     this.service.setLoggedInUser(user);
  //     const levelName=existingUser.LEVEL_NAME;
  //     this.service.setlevelName(levelName);
  //     localStorage.setItem('levelName', levelName.toString());
  //     const userid=existingUser.ID;
  //     this.service.setUserId(userid);
  //     localStorage.setItem('userId', userid.toString());
      
  //   }
  //   else{
  //     console.log('invalid');
  //     this.loginForm.setErrors({ invalidCredentials: '* Invalid username or password' });
  //   }
  
   
  // }

  UserLogin(){

    // get current UTC time
    const currentUtcTime = new Date().toISOString();
    

    var postData={
      LOGIN_NAME:this.loginForm.value.LOGIN_NAME,
      PASSWORD:this.loginForm.value.PASSWORD, 
      INTERNET_IP:this.internetIp.ip,
      SYSTEM_TIME_UTC:currentUtcTime,
      LOCAL_IP:this.internetIp.ip,
      COMPUTER_NAME:"SYSTEM 1",
      DOMAIN_NAME:"Domain1",
      COMPUTER_USER:"User1"

    }
  
    this.service.verifyLogin(postData).subscribe(response=>{
      if(response.message === "Login Success")
      {
        console.log('login working');
        this.service.saveToken(response.token);
        this.router.navigate(['/dashboard']);
        this.service.setLoggedInUser(response.data.USER_NAME);
        const levelName=response.data.LEVEL_NAME;
        this.service.setlevelName(levelName);
        localStorage.setItem('levelName', levelName.toString());
        const userid=response.data.ID;
        this.service.setUserId(userid);
        localStorage.setItem('userId', userid.toString());
      }
      else{
            console.log('invalid');
            this.loginForm.setErrors({ invalidCredentials: '* Invalid username or password' });
          }
    })
  }


  // getUserData(){
  //   this.service.getUsers().subscribe(
  //     (data:any)=>{
  //       this.userdata=data;
  //       console.log(data);
  //     }
  //   )
  // }

  ngOnInit(): void {
    // this.getUserData();
  }

  togglePasswordVisibility(){

  }


}
