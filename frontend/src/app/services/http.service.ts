import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UserService } from './user.service';
import { toast } from "angular2-materialize";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpService {

  private baseUrl = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  private sendRequest(url, body): Observable<any> {
    if (url !== 'sign_in') {
      const user = this.userService.user;

      if (!user.login || !user.password) {
        toast('Критическая ошибка! Перезагрузите страницу!', 4000, 'error-toast');
        return Observable.throw('UserService critical error!');
      }


      Object.assign(body, {login: user.login, password: user.password});
    }

    return this.httpClient.post(this.baseUrl + url, body)
      .catch(this.handleError);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let error;

    try {
      error = JSON.parse(errorResponse.error).message || errorResponse.error;
    } catch (err) {
      error = errorResponse.statusText;
    }

    return Observable.throw(error);
  }






  signIn(login: string, password: string): Observable<any> {
    return this.sendRequest('sign_in', {login, password});
  }






  getStudentList(): Observable<Array<Object>> {
    return this.sendRequest('student/list',{});
  }

  getStudentProfile(id: string): Observable<Object> {
    return this.sendRequest('student/get_profile',{id});
  }

  addStudent(course: string, squad: string, surname: string, name: string, father_name: string, login: string, password: string): Observable<string> {
    return this.sendRequest('student/add',{course, squad, surname, name, father_name, login, password});
  }

  updateStudentProfile(student): Observable<string> {
    return this.sendRequest('student/update',{id: student.id, data: student});
  }






  getTeacherProfile(id): Observable<Object> {
    return this.sendRequest('teacher/get_profile',{id});
  }

  updateTeacherProfile(teacher): Observable<string> {
    return this.sendRequest('teacher/update',{id: teacher.id, data: teacher});
  }

  addTeacher(surname, name, father_name, login, password): Observable<string> {
    return this.sendRequest('teacher/add',{surname, name, father_name, login, password});
  }

  deleteTeachers(ids): Observable<Array<Object>> {
    return this.sendRequest('teacher/delete',{ids});
  }

  getTeacherList(): Observable<Array<Object>> {
    return this.sendRequest('teacher/list',{});
  }






  getSubjectList(): Observable<Array<Object>> {
    return this.sendRequest('discipline/list',{});
  }

  addSubject(name, teacher_id): Observable<string> {
    return this.sendRequest('discipline/add',{name, teacher_id});
  }

  updateSubjectGroups(discipline_id, assigned_group_ids): Observable<string> {
    return this.sendRequest('discipline/update',{discipline_id, assigned_group_ids});
  }

  deleteSubject(id): Observable<string> {
    return this.sendRequest('discipline/delete',{id});
  }






  getGroupsByDisciplineId(discipline_id): Observable<Array<Object>> {
    return this.sendRequest('group/get',{discipline_id});
  }

  getGroupList(): Observable<Array<Object>> {
    return this.sendRequest('group/list',{});
  }

  upGroups(): Observable<Boolean> {
    return this.sendRequest('group/up',{});
  }






  getStudentUserData(student_id) {
    return this.sendRequest('user/get', {student_id});
  }

  getTeacherUserData(teacher_id) {
    return this.sendRequest('user/get', {teacher_id});
  }

  changePassword(id: string, new_password: string, old_password?: string): Observable<string> {
    const params = old_password? {id, new_password, old_password} : {id, new_password};
    return this.sendRequest('user/change_password', params);
  }






  resetAdmin(login: string, password: string, secret_key: string): Observable<string> {
    return this.sendRequest('reset_admin', {login, password, secret_key});
  }
}
