import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent }  from './app.component';

import { LoginComponent, LogoutComponent, SignupComponent } from "./login"
import { CoursesComponent, DaysNumber2ObjectPipe, CoursesDayDisplayComponent, CoursesTeacherDisplayComponent, CoursesSignupButtonComponent, CoursesFormComponent, CoursesGroupFormComponent, CoursesDayFormComponent, CourseTypeComponent, CoursesDetailComponent, CoursesApproveComponent, CoursesEnrollComponent } from './courses'
import { ProfileComponent, ProfileEditComponent } from "./profile"
import { GroupComponent, GroupFormComponent,GroupJoinedDisplayComponent,  GroupFinderComponent } from "./group"
import { MenuComponent, MenuLoginComponent } from "./menu/"
import { UsersFinderComponent, FilterByUserAttributePipe, FilterByUserGroupPipe, FilterByUserScopePipe, UsersDisplayComponent } from "./users"
import { CheckoutComponent, CheckoutBarComponent } from "./checkout"
import { NotificationsComponent } from "./notifications"
import { PaymentsMethodComponent, PaymentsTransferComponent, PaymentsThankyouComponent, PaymentsComponent, PaymentsListComponent, PaymentsDetailComponent, PaymentsReportComponent } from "./payments"
import { CheckinComponent } from "./checkin"
import { AngularFireModule,AuthProviders, AuthMethods , FIREBASE_PROVIDERS} from 'angularfire2';
import { LoginService } from "./login.service"
import { UploadService } from "./upload.service"
import { UserService } from "./user.service"
import { GroupService } from "./group.service"
import { CourseService } from "./course.service"
import { CartService } from "./cart.service"
import { NotificationsService } from  "./notifications.service"
import { PaymentService } from "./payment.service"
import { CheckinService } from "./checkin.service"
import { routing } from './app.routing';
import { Object2ArrayPipe, ObjectTrue2ArrayPipe, FilterByAttributePipe } from "./app.pipe"
import { ReCaptchaModule } from 'angular2-recaptcha';
import { ChartModule }            from 'angular2-highcharts'

//directives
import { HighlightDirective  } from "./app.directives"

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyCf9phOV3kk6HBiskayFjZ_4h8gFFgIQew",
  authDomain: "the-hop-firebase.firebaseapp.com",
  databaseURL: "https://the-hop-firebase.firebaseio.com",
  storageBucket: "the-hop-firebase.appspot.com"
}

const myFirebaseAuthConfig = {
  provider : AuthProviders.Google ,
  method : AuthMethods.Popup
}



@NgModule({
  declarations: [
    AppComponent, LoginComponent, CoursesComponent, MenuComponent,MenuLoginComponent, LogoutComponent, ProfileComponent, ProfileEditComponent, GroupComponent, Object2ArrayPipe, ObjectTrue2ArrayPipe, GroupFormComponent, UsersFinderComponent, GroupJoinedDisplayComponent, FilterByAttributePipe, FilterByUserAttributePipe, DaysNumber2ObjectPipe, CoursesDayDisplayComponent, CoursesTeacherDisplayComponent, CoursesSignupButtonComponent, CoursesFormComponent, FilterByUserGroupPipe, CoursesGroupFormComponent, HighlightDirective, CoursesDayFormComponent, GroupFinderComponent, CourseTypeComponent,CoursesDetailComponent, CheckoutComponent, CheckoutBarComponent, NotificationsComponent, CoursesApproveComponent, PaymentsMethodComponent, PaymentsTransferComponent, PaymentsThankyouComponent, PaymentsComponent, PaymentsListComponent, PaymentsDetailComponent, CheckinComponent, FilterByUserScopePipe, CoursesEnrollComponent, UsersDisplayComponent, SignupComponent, PaymentsReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig,myFirebaseAuthConfig),
    routing,
    ReCaptchaModule,
    ChartModule
  ],
  providers: [
    LoginService,
    UploadService,
    UserService,
    GroupService,
    CourseService,
    CartService,
    NotificationsService,
    PaymentService,
    CheckinService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
