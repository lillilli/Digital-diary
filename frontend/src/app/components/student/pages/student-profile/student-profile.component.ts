import { Component, OnInit } from '@angular/core';
import { toast } from "angular2-materialize";
import { Cookie } from 'ng2-cookies';
import { HttpService } from '../../../../services/http.service';
import { UserService } from '../../../../services/user.service';
import { FadeInOutAnimation } from '../../../../animations/FadeInOutAnimation';

@Component({
  selector: 'app-student-profile',
  templateUrl: 'student-profile.component.html',
  styleUrls: ['student-profile.component.css'],
  animations: [FadeInOutAnimation]
})
export class StudentProfileComponent implements OnInit {

  public student: any;
  public photoUrl: string = '';

  constructor(private httpService: HttpService, private userService: UserService) { }

  ngOnInit() {
    this.student = {};
    const user = this.userService.user;
    this.photoUrl = `../../../../../../assets/data/photo/student/${user.profile_id}.jpg`;

    this.httpService.getStudentProfile(user.profile_id)
      .subscribe((student) => {
        this.student = student;
        this.updateUserData();
      }, (error) => {
        if (error === "No user with that id!")
          return toast('Студент не найден, обновите страницу!', 4000, 'error-toast');

        toast('Неизвестная ошибка!', 4000, 'error-toast');
        console.log(error);
      })
  }

  updateUserData() {
    this.userService.user.name = `${this.student.surname} ${this.student.name[0]}. ${this.student.father_name[0]}.`;
    Cookie.set('diary_name', this.userService.user.name);
  }

  onErrorPhotoUrl() {
    this.photoUrl = `../../../../../../assets/data/photo/student/default.png`;
  }

}
