import { Component, OnInit, NgZone, OnChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';

import { ShareDataService } from '../share-data-service.service';

const SERVER = 'https://learn-with-fun.herokuapp.com';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.scss'],
})
export class DialogBodyComponent implements OnInit, OnChanges {
  videoForm: FormGroup;
  fileError = false;

  constructor(
    public dialogRef: MatDialogRef<DialogBodyComponent>,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: ShareDataService,
  ) {
    this.videoForm = this.formBuilder.group({
      title: ['', Validators.required],
      url: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.videoForm.patchValue({
      title: '',
      url: '',
      image: ''
    });
  }

  close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

  saveVideo() {
    //Upload image first
    let imageFormData = new FormData();
    imageFormData.append("file", this.videoForm.value.image);
    let url = `${SERVER}/images/upload`;
    this.http.post(url, imageFormData).subscribe((res: any) => {
      let dto = {
        title: this.videoForm.value.title,
        url: this.videoForm.value.url,
        imgId: res.imgId,
      };

      //Save new video:
      let url2 = `${SERVER}/video/create`;
      this.http.post(url2, dto).subscribe((res) => {
        this.sharedService.notifyParent();
        this.ngZone.run(() => {
          this.dialogRef.close();
        });
      }, err => {
        alert(`Unable to create video: ${err}`);  
      })
    }, err => {
      alert(`Unable to upload image: ${err}`);
    })
  }

  onFileSelect(event: Event) {
    let selectedFile = _.get(event, 'target.files[0]');
    if (selectedFile.size > 307200) {
      this.fileError = true;
      return;
    }
    let extension = selectedFile.name.split('.')[1];
    if (
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png'
    ) {
      this.fileError = false;
      this.videoForm.patchValue({ image: selectedFile });
    } else {
      this.fileError = true;
    }
    _.set(event, 'target.value', null);
  }
}
