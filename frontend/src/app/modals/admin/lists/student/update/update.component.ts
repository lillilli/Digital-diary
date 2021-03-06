import {
  Component,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
  Output
} from "@angular/core";
import { MaterializeAction, toast } from "angular2-materialize";
import { HttpService } from "../../../../../services/http.service";
import { Preloader } from "../../../../../services/preloader.service";

@Component({
  selector: "app-admin-lists-update-student-modal",
  templateUrl: "update.component.html",
  styleUrls: ["update.component.css"]
})
export class UpdateStudentModal implements OnInit {
  public user: any = {};
  public photoUrl: string = "";
  public changeStudentModal = new EventEmitter<string | MaterializeAction>();

  @Output() update = new EventEmitter<any>();

  public filesToUpload: Array<File>;

  constructor(
    private httpService: HttpService,
    public preloader: Preloader,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
  }

  updateStudent() {
    let oldBirthDate = this.user.birth_date;

    if (this.user.birth_date) {
      const birthDate = this.user.birth_date.split("/");
      this.user.birth_date = new Date(birthDate[2], birthDate[1], birthDate[0]);
    }

    if (isNaN(Number(this.user.course))) {
      this.user.birth_date = oldBirthDate;
      return toast("Курс должен быть числовым значением!", 4000, "error-toast")
    } else {
      this.user.course = Number(this.user.course)
    }

    if (isNaN(Number(this.user.squad))) {
      this.user.birth_date = oldBirthDate;
      return toast("Взвод должен быть числовым значением!", 4000, "error-toast")
    } else {
      this.user.squad = Number(this.user.squad)
    }

    this.httpService.updateStudentProfile(this.user).subscribe(
      () => {
        toast("Студент обновлён!", 4000, "success-toast");
        this.update.emit();
        this.close();
      },
      error => {
        this.user.birth_date = oldBirthDate;

        if (error === "No user with that id!")
          return toast(
            "Студент не найден, обновите страницу!",
            4000,
            "error-toast"
          );

        toast("Неизвестная ошибка!", 4000, "error-toast");
        console.log(error);
      }
    );
  }

  open(user) {
    this.user = user;
    this.photoUrl = `../../../../../../assets/data/photo/student/${
      this.user.id
    }.jpg`;
    this.httpService.getStudentProfile(this.user.id).subscribe(
      result => {
        this.changeStudentModal.emit({ action: "modal", params: ["open"] });

        result["id"] = this.user.id;
        this.user = result;
      },
      error => {
        if (error === "No user with that id!")
          return toast(
            "Студент не найден, обновите страницу!",
            4000,
            "error-toast"
          );

        toast("Неизвестная ошибка!", 4000, "error-toast");
        console.log(error);
      }
    );
  }

  close() {
    this.changeStudentModal.emit({ action: "modal", params: ["close"] });
  }

  onErrorPhotoUrl() {
    this.photoUrl = `../../../../../../assets/data/photo/student/default.png`;
  }

  fileChangedEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files;
    this.upload();
  }

  //TODO refactor upload, change toast to warning
  upload() {
    toast("Загрузка!", 4000, "success-toast");

    if (
      this.filesToUpload[0].name.slice(
        this.filesToUpload[0].name.lastIndexOf("."),
        this.filesToUpload[0].name.length
      ) !== ".jpg"
    ) {
      return toast("Неподдерживаемый формат, нужен jpg!", 4000, "error-toast");
    }

    this.httpService
      .uploadUserPhoto(this.filesToUpload, this.user.id, "student")
      .then(
        result => {
          toast("Фото успешно обновлено!", 4000, "success-toast");
          this.photoUrl = `../../../../../../assets/data/photo/student/${
            this.user.id
          }.jpg?a=${Math.random()}`;
          this.filesToUpload = [];
        },
        error => {
          this.filesToUpload = [];
          toast("Ошибка загрузки фото!", 4000, "error-toast");
          console.error(error);
        }
      );
  }
}
