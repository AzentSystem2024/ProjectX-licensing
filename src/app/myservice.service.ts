import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  private loggedInUser: any;
  private userId:any;
  private resellerId:any;
  private levelName:any;

  setLoggedInUser(user: any) {
    this.loggedInUser = user;
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  setlevelName(name:any){
    this.levelName=name;
    sessionStorage.setItem('levelName', this.levelName.toString());
  }
  getlevelName() {
    return this.levelName;
  }


  setUserId(user:any){
    this.userId=user;
    sessionStorage.setItem('userId', this.userId.toString());
  }
  getUserId() {
    return this.userId;
  }
  isLoggedIn(): boolean {
    return !!this.loggedInUser && !!this.userId;
  }

  public intIp="https://api.ipify.org/?format=json";

  private apiUrl="http://projectxlicenseapi.diligenzit.com/api/";


  public loginVerify="http://projectxlicenseapi.diligenzit.com/api/users/login";



  public endpoint="http://projectxlicenseapi.diligenzit.com/api/users/List";
  
  public endpoint1="http://projectxlicenseapi.diligenzit.com/api/users/insert";
  public endpoint2="http://103.180.120.134/veztalicense/api/users/delete/";
  public endpoints3="http://103.180.120.134/veztalicense/api/users/Update";
  public endpoint4="http://103.180.120.134/veztalicense/api/UserLevel/List";
  public endpoint5="http://103.180.120.134/veztalicense/api/users/select/";
  public endpoint6="http://projectxlicenseapi.diligenzit.com/api/reseller/List";
  public endpoint7="http://projectxlicenseapi.diligenzit.com/api/reseller/Insert";
  public endpoint8="http://103.180.120.134/veztalicense/api/DropDown/List";
  public endpoint12="http://103.180.120.134/veztalicense/api/dropDown/";
  public endpoint13="http://projectxlicenseapi.diligenzit.com/api/dropDown/";
  public endpoint9="http://projectxlicenseapi.diligenzit.com/api/reseller/select/";
  public endpoint10="http://projectxlicenseapi.diligenzit.com/api/reseller/delete/";
  public endpoint11="http://projectxlicenseapi.diligenzit.com/api/reseller/Update";


  public endpoint01="http://projectxlicenseapi.diligenzit.com/api/customer/List";
  public endpoints02="http://projectxlicenseapi.diligenzit.com/api/customer/insert";
  public endpoint03="http://projectxlicenseapi.diligenzit.com/api/customer/select/";
  public endpoint04="http://projectxlicenseapi.diligenzit.com/api/customer/delete/";
  public endpoint05="http://projectxlicenseapi.diligenzit.com/api/customer/Update";

  public endpoint001="http://projectxlicenseapi.diligenzit.com/api/facilitygroup/List";

  public endpoint0001="http://projectxlicenseapi.diligenzit.com/api/facility/List";
  public endpoint0002="http://projectxlicenseapi.diligenzit.com/api/facility/insert";
  public endpoint0003="http://projectxlicenseapi.diligenzit.com/api/facility/select/";
  public endpoint0004="http://projectxlicenseapi.diligenzit.com/api/facility/delete/";
  public endpoint0005="http://projectxlicenseapi.diligenzit.com/api/facility/Update";
  public endpoint006="http://projectxlicenseapi.diligenzit.com/api/facility/licenserenewal";


  public endpoint011="http://103.180.120.134/veztalicense/api/products/List";
  public endpoint012="http://103.180.120.134/veztalicense/api/product/insert";
  public endpoint013="http://103.180.120.134/veztalicense/api/product/update";
  public endpoint014="http://103.180.120.134/veztalicense/api/product/delete/";
  public endpoint015="http://103.180.120.134/veztalicense/api/product/select/";
 

  public endpoint021="http://103.180.120.134/veztalicense/api/license/List";
  public endpoint022="http://103.180.120.134/veztalicense/api/license/insert";
  public endpoint023="http://103.180.120.134/veztalicense/api/license/delete/";
  public endpoint024="http://103.180.120.134/veztalicense/api/license/select/";
  public endpoint025="http://103.180.120.134/veztalicense/api/license/update";
  public endpoint026="http://103.180.120.134/veztalicense/api/license/licenserenewal";

  public endpoint027="http://projectxlicenseapi.diligenzit.com/api/menugroup/list";
  public endpoint028="http://projectxlicenseapi.diligenzit.com/api/menugroup/insert";
  public endpoint029="http://projectxlicenseapi.diligenzit.com/api/menugroup/update";
  // public endpoint030="http://projectxlicenseapi.diligenzit.com/api/menugroup/delete"
  public endpoint032="http://projectxlicenseapi.diligenzit.com/api/menugroup/select/";
  public endpoint033="http://projectxlicenseapi.diligenzit.com/api/menugroup/delete/"

  public endpoint031="http://projectxlicenseapi.diligenzit.com/api/modules/list";
  public endpoint034="http://projectxlicenseapi.diligenzit.com/api/modules/insert";
  public endpoint035="http://projectxlicenseapi.diligenzit.com/api/modules/update";
  public endpoint036="http://projectxlicenseapi.diligenzit.com/api/modules/delete/";
  public endpoint037="http://projectxlicenseapi.diligenzit.com/api/modules/select/";

  public endpoint038="http://projectxlicenseapi.diligenzit.com/api/menu/list";
  public endpoint039="http://projectxlicenseapi.diligenzit.com/api/menu/insert";
  public endpoint040="http://projectxlicenseapi.diligenzit.com/api/menu/update";
  public endpoint041="http://projectxlicenseapi.diligenzit.com/api/menu/select/";
  public endpoint042="http://projectxlicenseapi.diligenzit.com/api/menu/delete/";

  public endpoint043="http://projectxlicenseapi.diligenzit.com/api/dropdown/list";


  //dashboard
  public dashboardvalue="http://103.180.120.134/veztalicense/api/license/licensedashboard";

  //edition



  constructor(private http:HttpClient) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}')
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
    }
    const storedlevelName = sessionStorage.getItem('levelName');
    if (storedlevelName) {
      this.levelName = storedlevelName;
    }
   }

   private createHeaders() {
    const token = this.getToken();
    console.log('tokenis',token);
    return new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization': `${token}`
    });
  }

   checkLoginNameExists(loginName: string): Observable<boolean> {
    return this.http.post<any[]>(this.endpoint,{}).pipe(
      map(users => {
        return users.some(user => user.LOGIN_NAME === loginName);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string {
    return localStorage.getItem('authToken') || '';
  }


  getInternetIp():Observable<any>{
    return this.http.get(this.intIp);
  }
  
  getUsers():Observable<any>{
    return this.http.post(this.endpoint,{});
}
 getUserLevels(): Observable<{ id: number, levelName: string }[]> {
  return this.http.post<any[]>(this.endpoint4,{}).pipe(
    map(response => response.map(item => ({ id: item.ID, levelName: item.DESCRIPTION })))
  );
}
//customer
getCustomers():Observable<any>{
  return this.http.post(this.endpoint01,{});
}
addCustomer(data:object):Observable<any>{
  return this.http.post(this.endpoints02,data);
 }
 getCustomerById(ID:number,data:any){
  const getEndpoint = `${this.endpoint03}${ID}`;
  return this.http.post(getEndpoint,data);
 }
 deleteCustomer(ID:number,data:any){
  const deleteEndpoint = `${this.endpoint04}${ID}`;
  return this.http.post(deleteEndpoint,data);
 }
 updateCustomer(data:any):Observable<any>{
  return this.http.post(this.endpoint05,data);
 }

 //menugroup
 getMenuGroup():Observable<any>{
  return this.http.post(this.endpoint027,{})
 }

 addMenuGroup(data:object):Observable<any>{
  return this.http.post(this.endpoint028,data);
 }

 updateMenuGroup(data:any):Observable<any>{
  return this.http.post(this.endpoint029,data);
 }

 getMenuGroupById(ID:number,data:any){
  const getEndpoint = `${this.endpoint032}${ID}`;
  return this.http.post(getEndpoint,data);
 }
//endpoint033

deleteGroupMenu(ID: number,data:any): Observable<any> {
  const deleteEndpoint = `${this.endpoint033}${ID}`;
  return this.http.post(deleteEndpoint,data);
}

//menu

  getMenu():Observable<any>{
    return this.http.post(this.endpoint038,{})
 }
 addMenu(data:object):Observable<any>{
  return this.http.post(this.endpoint039,data);
 }

 updateMenu(data:any):Observable<any>{
  return this.http.post(this.endpoint040,data);
 }

 getMenuById(ID:number,data:any){
  const getEndpoint = `${this.endpoint041}${ID}`;
  return this.http.post(getEndpoint,data);
 }

 deleteMenu(ID: number,data:any): Observable<any> {
  const deleteEndpoint = `${this.endpoint042}${ID}`;
  return this.http.post(deleteEndpoint,data);
}

getDropdownList(): Observable<any> {
  const body = { name: "MODULES" };
  return this.http.post(this.endpoint043, body);
}

getMenugroupDropdown(): Observable<any> {
  const body = { name: "MENUGROUPS" };
  return this.http.post(this.endpoint043, body);
}

 //modules
 getModule():Observable<any>{
  return this.http.post(this.endpoint031,{})
 }

 addModule(data:object):Observable<any>{
  return this.http.post(this.endpoint034,data);
 }

 updateModule(data:any):Observable<any>{
  return this.http.post(this.endpoint035,data);
 }

 getModuleById(ID:number,data:any){
  const getEndpoint = `${this.endpoint037}${ID}`;
  return this.http.post(getEndpoint,data);
 }

 deleteModule(ID: number,data:any): Observable<any> {
  const deleteEndpoint = `${this.endpoint036}${ID}`;
  return this.http.post(deleteEndpoint,data);
}

 //facility-group
 getFacilityGroup():Observable<any>{
  return this.http.post(this.endpoint001,{});
}

//reseller
getResellers():Observable<any>{
  return this.http.post(this.endpoint6,{});
}
addResellers(data:object):Observable<any>{
  return this.http.post(this.endpoint7,data);
 }
 getCountryList(): Observable<{ id: number, countryName: string }[]> {
  return this.http.get<any[]>(this.endpoint8).pipe(
    map(response => response.map(item => ({ id: item.ID, countryName: item.COUNTRY_NAME })))
  );
}
getDropDownList(name: string): Observable<{ id: number, description: string }[]> {
  return this.http.post<any[]>(this.endpoint12, { name: name }).pipe(
    map(response => this.mapResponse(response))
  );
}
getSelectDropDown(name:string):Observable<any>{
  return this.http.post<any[]>(this.endpoint12,{name:name});
}

private mapResponse(response: any[]): { id: number, description: string }[] {
  return response.map(item => ({ id: item.ID, description: item.DESCRIPTION }));
}




getResellerById(ID:number,data:any){
  const getEndpoint = `${this.endpoint9}${ID}`;
  return this.http.post(getEndpoint,data);
 }
 deleteReseller(ID:number){
  const deleteEndpoint = `${this.endpoint10}${ID}`;
  return this.http.get(deleteEndpoint);
 }
 updateReseller(data:any):Observable<any>{
  return this.http.post(this.endpoint11,data);
 }
 

 //project

 getProduct():Observable<any>{
  return this.http.get(this.endpoint011);
}
 addProduct(data:object):Observable<any>{
  return this.http.post(this.endpoint012,data);
 }
 getProductById(ID:number){
  const getEndpoint = `${this.endpoint015}${ID}`;
  return this.http.get(getEndpoint);
 }
 deleteProduct(ID:number){
  const deleteEndpoint = `${this.endpoint014}${ID}`;
  return this.http.get(deleteEndpoint);
 }
 updateProduct(data:any):Observable<any>{
  return this.http.post(this.endpoint013,data);
 }


 //license

 getLicense():Observable<any>{
  return this.http.get(this.endpoint021);
}
  addLicense(data:object):Observable<any>{
  return this.http.post(this.endpoint022,data);
 }
 deleteLicense(ID:number){
  const deleteEndpoint = `${this.endpoint023}${ID}`;
  return this.http.get(deleteEndpoint);
 }
 getLicenseById(ID:number){
  const getEndpoint = `${this.endpoint024}${ID}`;
  return this.http.get(getEndpoint);
 }
 updateLicense(data:any):Observable<any>{
  return this.http.post(this.endpoint025,data);
 }
 

 getDashboardValue():Observable<any>{
  return this.http.get(this.dashboardvalue);
}

//projectx
//drodown
getProjectXDropDownList(name: string): Observable<{ id: number, description: string }[]> {
  return this.http.post<any[]>(this.apiUrl+'dropDown/', { name: name }).pipe(
    map(response => this.mapResponse(response))
  );
}

 //facility
 getFacility():Observable<any>{
  return this.http.post(this.apiUrl+'facility/list',{});
}
addFacility(data:object):Observable<any>{
  return this.http.post(this.apiUrl+'facility/insert',data);
 }
 getFacilityById(ID:number,data:any){
  const getEndpoint = `${this.apiUrl+'facility/select/'}${ID}`;
  return this.http.post(getEndpoint,data);
 }
 deleteFacility(ID:number,data:any){
  const deleteEndpoint = `${this.apiUrl+'facility/delete/'}${ID}`;
  return this.http.post(deleteEndpoint,data);
 }
 updateFacility(data:any):Observable<any>{
  return this.http.post(this.apiUrl+'facility/update',data);
 }

 
 //edition
 getEdition():Observable<any>{
  return this.http.post(this.apiUrl+'edition/list',{});
}
getEditionMenu():Observable<any>{
  return this.http.post(this.apiUrl+'edition/customermenulist',{});
}
getEditionMenuList():Observable<any>{
  return this.http.post(this.apiUrl+'edition/editionlist',{});
}
 addEdition(data:object):Observable<any>{
  return this.http.post(this.apiUrl+'edition/insert',data);
 }
 deleteEdition(ID:number,data:any){
  const deleteEndpoint = `${this.apiUrl+'edition/delete/'}${ID}`;
  return this.http.post(deleteEndpoint,data);
 }
 updateEdition(data:any):Observable<any>{
  return this.http.post(this.apiUrl+'edition/update',data);
 }

 getEditionById(ID:number,data:any){
  const getEndpoint = `${this.apiUrl+'edition/select/'}${ID}`;
  return this.http.post(getEndpoint,data);
 }

 //customer view
 getCustomerView(ID:number,data:any):Observable<any>{
  const getEndpoint = `${this.apiUrl+'customer/view/'}${ID}`;
  return this.http.post(getEndpoint,data);
 }

 //insert customer Menu
 addCustomerMenu(data:object):Observable<any>{
  return this.http.post(this.apiUrl+'customer/insertcustomermenutest',data);
 }

//license renewal 
  renewLicense(data:object):Observable<any>{
  return this.http.post(this.apiUrl+'facility/licenserenewal',data);
 }

 //login 
  verifyLogin(data:object):Observable<any>{
  return this.http.post(this.apiUrl+'users/login',data);
 }
 //user
 addUsers(data:object):Observable<any>{
  // const headers = this.createHeaders();
  return this.http.post(this.apiUrl+'users/insert',data);
 }
 getUserById(ID:number,data:any){
  const getEndpoint = `${this.apiUrl+'users/select/'}${ID}`;
  return this.http.post(getEndpoint,data);
 }
 updateUsers(data:any):Observable<any>{
  return this.http.post(this.apiUrl+'users/update',data);
 }
 deleteUsers(ID:number,data:any){
  const deleteEndpoint = `${this.apiUrl+'users/delete/'}${ID}`;
  return this.http.post(deleteEndpoint,data);
 }
 



}
export interface Getdata {
  ID:number;
  IS_INACTIVE: boolean;
  LEVEL_NAME:string;
  LOGIN_NAME:string;
  PASSWORD:string;
  USER_LEVEL:number;
  USER_NAME:string;
}
export interface GetResellerData {
  ID: number;
  CODE: string;
  NAME: string;
  PHONE: string;
  EMAIL: string;
  COUNTRY: string;
}

export interface GetMenuGroup {
  ID : number
  PRODUCT: number;
  MENU_GROUP: string;
  MENU_KEY: string;
  MENU_ORDER : string;
}

export interface GetModule {
  ID : number
  MODULE_NAME: number;
  PRODUCT_ID: string;
  PRODUCT_NAME: string;
}

export interface GetMenu {
  ID : number
  MODULE_NAME: number;
  MENU_GROUP: string;
  MENU_NAME: string;
  MENU_VERSION : number;
  MENU_ORDER : string;
  REMARKS : string;
  MENU_KEY : string;
}

// Define an interface for the edition object
export interface GetEdition {
  EDITION_NAME: string | null;
  ID: number | null;

  edition_menu: any; // Update this type if needed
  flag: any; // Update this type if needed
  message: any; // Update this type if needed
}




