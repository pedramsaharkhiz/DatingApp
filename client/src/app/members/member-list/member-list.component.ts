import { Pagination } from './../../_models/pagination';
import { MembersService } from './../../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams:UserParams;
  user:User;
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}];
  constructor(private memberService: MembersService) { 
    this.userParams=this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }
  resetFilters(){
    this.userParams=this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }


}
