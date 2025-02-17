import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../store/Auth/User';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    templateUrl: './boxed-signup.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class BoxedSignupComponent implements OnInit {

    public form!: FormGroup;

    store: any;
    constructor(
        public fb: FormBuilder,
        public http: HttpClient,
        public translate: TranslateService, public storeData: Store<any>, public router: Router, private appSetting: AppService) {
        this.initStore();
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
            email: [''],
            password: [''],
        });
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }

    navigateToDocumentUploadPage() {

        this.register()
        this.router.navigate(['/auth/signup-docs'])
    }
    register() {
        // this.store.dispatch(AuthActions.login({ user }));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        let model = {
            name: this.form.value.name,
            email: this.form.value.email,
            password: this.form.value.password,
        }

        return this.http.post(`http://102.23.120.135:8082/api/v1/register`, model, httpOptions)
            .subscribe((response: any) => {
                console.log('Registered', response);
                localStorage.setItem("token", response.token);
                Swal.fire('Success', 'Account Registered Successfully', 'success')

            }, error => {
                console.error('Error:', error);
            });
    }

}
