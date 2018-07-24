import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../services/common.service';
import { UserService } from '../services/user.service';
import { Globals } from '../globals';
declare var $,unescape,newWin: any;
@Component({
  selector: 'app-userlist',
   providers: [ UserService ],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  userList;
 deleteEntity;
	msgflag;
	message;
	type;
	
	permissionEntity;
	//globals;
   constructor(private http: Http,private authService: AuthService, private router: Router, private route: ActivatedRoute, private UserService: UserService,public globals: Globals,private CommonService: CommonService,) { }

  ngOnInit()
  {

	this.globals.isLoading = true;	
		$("body").tooltip({
		selector: "[data-toggle='tooltip']"
	});
		//this.globals = this.global;
	this.permissionEntity = {}; 
	if(this.globals.authData.RoleId==4){
		this.permissionEntity.View=1;
		this.permissionEntity.AddEdit=1;
		this.permissionEntity.Delete=1;
		this.default();
		
	} else {		
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'User'})
	
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
	}

  
  default(){		
	this.UserService.getAllUser(this.globals.authData.RoleId)
	//.map(res => res.json())
	.then((data) => 
	{
		
		this.userList = data;
		setTimeout(function(){
		var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ Users per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ Users",
					"sInfoFiltered": "(filtered from _MAX_ total Users)"
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
						title: 'UsersList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5, 6 ]
								}
							},
								{
								extend: 'print',
								title: 'Users List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5, 6 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Users').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
			
			
			$(".user").addClass("selected");
	},500); 
	this.globals.isLoading = false;	
	}, 
	(error) => 
	{
		this.globals.isLoading = false;
		this.router.navigate(['/admin/pagenotfound']);
		//alert('error');
	});	
    this.msgflag = false;
	}
  
  deleteUser(user)
	{ 
		this.deleteEntity =  user;
		$('#Delete_Modal').modal('show');					
	}
  
  deleteConfirm(user)
	{ 	
		var del={'Userid':this.globals.authData.UserId,'id':user.UserId};
		this.UserService.deleteUser(del)
		.then((data) => 
		{
			let index = this.userList.indexOf(user);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.userList.splice(index, 1);
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
			}			
			//alert(data);
			this.globals.message = 'User Deleted Successfully';
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
  

}
