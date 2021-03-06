import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, LogoutComponent, SignupComponent }      from './login';
import { ProfileComponent, ProfileEditComponent } from "./profile"
import { CoursesComponent, CoursesFormComponent, CoursesDetailComponent, CoursesApproveComponent, CoursesEnrollComponent } from "./courses";
import { GroupComponent, GroupFormComponent } from "./group"
import { CheckoutComponent } from "./checkout"
import { CheckinComponent } from "./checkin"
import { PaymentsMethodComponent, PaymentsTransferComponent,PaymentsThankyouComponent, PaymentsComponent, PaymentsListComponent, PaymentsDetailComponent, PaymentsReportComponent, PaymentReceiptComponent, PaymentsPaypalComponent} from "./payments"
import { ReportComponent } from "./report/report.component"
import { ReportDetailComponent } from "./report/report-detail.component"
//test
const appRoutes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile/update',
    component: ProfileEditComponent
  },
  {
    path: 'group',
    component: GroupComponent
  },
  {
    path: 'group/:slug',
    component: GroupFormComponent
  },
  {
    path:'courses',
    component: CoursesComponent
  },
  {
    path:'courses/edit/:key',
    component: CoursesFormComponent
  },
  {
    path:'courses/approve/:key',
    component: CoursesApproveComponent
  },
  {
    path:"courses/enroll/:key",
    component:CoursesEnrollComponent
  },
  {
    path:'courses/:key',
    component: CoursesDetailComponent
  },
  {
    path:"checkin",
    component: CheckinComponent
  },
  {
    path:"checkout",
    component:CheckoutComponent
  },
  {
    path:"payment",
    component:PaymentsComponent
  
  },
  {
    path:"payment/list",
    component:PaymentsListComponent
  },
  {
    path:"payment/report",
    component:PaymentsReportComponent
  },
  {
    path:"payment/list/:user_key/:time_key",
    component:PaymentsDetailComponent
  },
  {
    path:"payment/new",
    component:PaymentsMethodComponent
  },
  {
    path:"payment/transfer",
    component:PaymentsTransferComponent
  },
  {
    path:"payment/paypal",
    component:PaymentsPaypalComponent
  },
  {
    path:"payment/receipt/:key",
    component:PaymentReceiptComponent
  },
  {
    path:"payment/:type/thankyou",
    component:PaymentsThankyouComponent
  },
  {
    path:"report",
    component:ReportComponent
  },
  {
    path:"report/:key",
    component:ReportDetailComponent
  },

//PaymentsListComponent
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
