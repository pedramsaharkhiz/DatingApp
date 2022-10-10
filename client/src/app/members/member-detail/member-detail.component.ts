import { Message } from './../../_models/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { HttpClientModule} from '@angular/common/http';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-tabset';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { MessageService } from '../../_services/message.service';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static:true})memberTabs:TabsetComponent;
  member:Member | undefined;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] ;
  activeTab:TabDirective;
  messages:Message[]=[];

  constructor(private memberService:MembersService,private route:ActivatedRoute,
    private messagesService:MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.member=data.member;
    })
    this.route.queryParams.subscribe(params=>{
      params.tab?this.selectTab(params.tab):this.selectTab(0);
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
    ]
    this.galleryImages=this.getImages();
  }
  getImages():NgxGalleryImage[]{
    const imageUrls=[];
    for(const photo of this.member!.photos){
      imageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      })
    }
    return imageUrls;
  }
 
  loadMessages(){
    this.messagesService.getMessageThread(this.member.username).subscribe(messages=>{
      this.messages=messages;
    })
  }
  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active=true;
  }
  onTabActivated(data:TabDirective){
    this.activeTab=data;
    if(this.activeTab.heading==='Messages'&&this.messages.length===0){
      this.loadMessages();

    }
  }

}
