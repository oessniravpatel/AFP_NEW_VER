import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../services/invitation.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-invitationlist',
  providers: [ InvitationService,CommonService ],
  templateUrl: './invitationlist.component.html',
  styleUrls: ['./invitationlist.component.css']
})
export class InvitationlistComponent implements OnInit {
	InvitationList;
	ReInviteEntity;
	deleteEntity;
	msgflag;
	message;
type;
Disinv;
permissionEntity;
invimsgsuccess;
invimsgrevoke;
invimsgpending;
//globals;
  constructor( private http: Http,public globals: Globals, private router: Router, private CommonService: CommonService, private InvitationService: InvitationService,private route:ActivatedRoute) { }

 

  ngOnInit() { 

	this.globals.isLoading = false;
	//this.globals = this.global;
	this.permissionEntity = {}; 
	if(this.globals.authData.RoleId==4){
		this.permissionEntity.View=1;
		this.permissionEntity.AddEdit=1;
		this.permissionEntity.Delete=1;
		this.default();
	} else {		
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'User Invitation'})
		.then((data) => 
		{
			this.permissionEntity = data;
			if(this.permissionEntity.View==1 ||  this.permissionEntity.AddEdit==1 || this.permissionEntity.Delete==1){
				this.default();
			} else {
				this.router.navigate(['/admin/access-denied']);
			}		
		},
		(error) => 
		{
			//alert('error');
			this.globals.isLoading = false;
			this.router.navigate(['/admin/pagenotfound']);
		});	
	}
	this.InvitationService.invimsg()
	 .then((data) => 
			{
				
				this.invimsgsuccess=data['Success'];
				this.invimsgrevoke=data['Revoke'];
				this.invimsgpending=data['Pending'];

			},
			(error) => 
			{
				//alert('error');
				this.globals.isLoading = false;
				this.router.navigate(['/admin/pagenotfound']);
			});			
	}
	
	default(){
		this.Disinv = '';
		this.InvitationService.getAll()
		.then((data) => 
		{ 
		 // this.InvitationList = data;	
			  this.InvitationList = data['Inv'];
			this.Disinv = data['Disinv'];
		  setTimeout(function(){
			var table = $('#dataTables-example').DataTable( {
			  "oLanguage": {
				"sLengthMenu": "_MENU_ Invitation per Page",
				"sInfo": "Showing _START_ to _END_ of _TOTAL_ Invitation",
				"sInfoFiltered": "(filtered from _MAX_ total Invitation)"
			  },
			  dom: 'lBfrtip',
				buttons: [
							//'pageLength','print','excel'
						 ]
			});
			var buttons = new $.fn.dataTable.Buttons(table, {
				buttons: [
						{
						extend: 'excel',
						title: 'InvitationList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
								{
								extend: 'print',
								title: 'Invitation List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Invitation').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
			
			$(".invitation").addClass("selected");
			$(".email").addClass("active");
        	$(".invitation").parent().removeClass("display_block");
		  },100); 
		  this.globals.isLoading = false;
		}, 
		(error) => 
		{
		 // alert('error');
		 this.globals.isLoading = false;
	     this.router.navigate(['/admin/pagenotfound']);
		});	
		//this.msgflag = false;
	  }
	
	deleteInvitation(Invitation)
	{ 
		this.deleteEntity =  Invitation;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(Invitation)
	{ 
		var del={'Userid':this.globals.authData.UserId,'id':Invitation.UserInvitationId};
		this.InvitationService.delete(del)
		.then((data) => 
		{
			let index = this.InvitationList.indexOf(Invitation);
			this.InvitationList[index].Code ='';
			this.InvitationList[index].Status =2;
			this.InvitationList[index].code = '';
			//this.InvitationList[index].Status =0;
			$('#Delete_Modal').modal('hide');
			// if (index != -1) {
				// this.InvitationList.splice(index, 1);
				//this.router.navigate(['/domain/list']);
				// setTimeout(function(){
				// 	$('#dataTables-example').dataTable( {
				// 		"oLanguage": {
				// 			"sLengthMenu": "_MENU_ Domains per Page",
				// 			"sInfo": "Showing _START_ to _END_ of _TOTAL_ Domains",
				// 			"sInfoFiltered": "(filtered from _MAX_ total Domains)"
				// 		}
				// 	});
				// },3000); 
			// }			
			//alert(data);
			this.globals.message = 'Revoked Successfully';
			this.globals.type = 'success';
			this.globals.msgflag = true;
		}, 
		(error) => 
		{
			$('#Delete_Modal').modal('hide');
			if(error.text){
				this.globals.message = "You can't delete this record because of their dependency";
				this.globals.type = 'danger';
				this.globals.msgflag = true;
			}	
		});	
	}
	
  ReInviteInvitation(Invitation)
	{ 
		this.ReInviteEntity =  Invitation;
		this.ReInviteEntity['UpdatedBy'] =  this.globals.authData.UserId;
		$('#ReInvite_Modal').modal('show');					
	}
	
	ReInviteConfirm(Invitation)
	{ 
	this.globals.isLoading = true;
		this.InvitationService.ReInvite(Invitation)
		.then((data) => 
		{
			this.globals.isLoading = false;
			let index = this.InvitationList.indexOf(Invitation);
			
			this.InvitationList[index].Status =0;
			this.InvitationList[index].Code ='';
			$('#ReInvite_Modal').modal('hide');
			// if (index != -1) {
				// this.InvitationList.splice(index, 1);
				//this.router.navigate(['/domain/list']);
				// setTimeout(function(){
				// 	$('#dataTables-example').dataTable( {
				// 		"oLanguage": {
				// 			"sLengthMenu": "_MENU_ Domains per Page",
				// 			"sInfo": "Showing _START_ to _END_ of _TOTAL_ Domains",
				// 			"sInfoFiltered": "(filtered from _MAX_ total Domains)"
				// 		}
				// 	});
				// },3000); 
			// }			
			//alert(data);
			this.globals.message = 'Email Send Successfully';
			this.globals.type = 'success';
			this.globals.msgflag = true;
		}, 
		(error) => 
		{
			this.globals.isLoading = false;
			$('#ReInvite_Modal').modal('hide');
			if(error.text){
				this.globals.message = "You can't send this Email";
				this.globals.type = 'danger';
				this.globals.msgflag = true;
			}	
		});	
	}

}
