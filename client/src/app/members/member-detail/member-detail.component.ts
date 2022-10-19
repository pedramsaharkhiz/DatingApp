import { Message } from './../../_models/message';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from '../../_models/member';
import { TabsetComponent } from 'ngx-tabset';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild('memberTabs',{static:true})memberTabs:TabsetComponent;
  member:Member | undefined;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] ;
  activeTab:TabDirective;
  messages:Message[]=[];
  user:User;

  constructor(public presenceService:PresenceService,private route:ActivatedRoute,
    private messagesService:MessageService,
    private accountService:AccountService,
    private router:Router) {

      this.accountService.currentUser$.pipe(take(1)).subscribe(user=>this.user=user);
      this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
     }
  

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
      this.messagesService.createHubConnection(this.user,this.member.username);

    }else{
      this.messagesService.stopHubConnection();
    }
  }
  ngOnDestroy(): void {
    this.messagesService.stopHubConnection();
  }

}
