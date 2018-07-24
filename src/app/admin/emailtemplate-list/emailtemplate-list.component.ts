import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EmailtemplateService } from '../services/emailtemplate.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
import { forEach } from '@angular/router/src/utils/collection';
declare var $,unescape: any;

@Component({
  selector: 'app-emailtemplate-list',
  providers: [ EmailtemplateService,CommonService ],
  templateUrl: './emailtemplate-list.component.html',
  styleUrls: ['./emailtemplate-list.component.css']
})
export class EmailtemplateListComponent implements OnInit {
	
  	EmailList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;

 constructor( private http: Http,public globals: Globals, private router: Router, 
	private EmailtemplateService: EmailtemplateService,private CommonService: CommonService, private route:ActivatedRoute) { }


ngOnInit() {  
	
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
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Email Template'})
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
		this.EmailtemplateService.getAll()
		.then((data) => 
		{ 
			//alert(data);		
			// for(var i=1; i<=data.length; i++){
			// 	data[i].To=data[i].To.toString().replace("1","Admin");	
			// }		
			this.EmailList = data;
			setTimeout(function(){
				var table = $('#dataTables-example').DataTable( {
					"oLanguage": {
						"sLengthMenu": "_MENU_ Email per Page",
						"sInfo": "Showing _START_ to _END_ of _TOTAL_ Email",
						"sInfoFiltered": "(filtered from _MAX_ total Email)"
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
						title: 'EmailTemplateList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5, 6 ]
								}
							},
								{
								extend: 'print',
								title: 'Email Template List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5, 6 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Email Template').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
				
				$(".emailtemplate").addClass("selected");
				$(".email").addClass("active");
        		$(".emailtemplate").parent().removeClass("display_block");	
			},500); 
			this.globals.isLoading = false;
		}, 
		(error) => 
		{
			//alert('error');
			this.globals.isLoading = false;
			this.router.navigate(['/admin/pagenotfound']);
		});	
		//this.msgflag = false;
	}

	deleteEmail(Email)
	{ 
		this.deleteEntity =  Email;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(Email)
	{ 
		this.EmailtemplateService.delete(Email.EmailId)
		.then((data) => 
		{
			let index = this.EmailList.indexOf(Email);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.EmailList.splice(index, 1);
			}	
		this.globals.message = 'Email Template Deleted Successfully!';
			this.globals.type = 'success';
			this.globals.msgflag = true;
		}, 
		(error) => 
		{
			$('#Delete_Modal').modal('hide');
			if(error.text){
				this.globals.message = "You can't delete this record because of their dependency!";
				this.globals.type = 'danger';
				this.globals.msgflag = true;
			}	
		});		
	}
}

