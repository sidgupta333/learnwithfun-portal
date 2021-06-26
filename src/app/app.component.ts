import { OnInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';

import { ShareDataService } from './share-data-service.service';

const SERVER = 'https://learn-with-fun.herokuapp.com';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['videoId', 'title', 'url', 'image', 'delete'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private http: HttpClient,
    private matDialog: MatDialog,
    private sharedService: ShareDataService,
  ) {}

  ngOnInit() {
    this.sharedService.shared$.subscribe(res => {
      this.loadVideoData();
    })
  }

  loadVideoData() {
    this.http.get(`${SERVER}/video/getAll`).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<Video>(res);
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.matDialog.open(DialogBodyComponent, dialogConfig);
  }

  deleteVideo(video: Video) {
    const url = `${SERVER}/video/remove/${video.videoId}`;
    this.http.delete(url).subscribe(res => {
      this.sharedService.notifyParent();
    },
    err => {
      alert(`Unable to delete video`);
    });
  }
}

export interface Video {
  videoId: String;
  title: String;
  url: String;
  image: String;
}
