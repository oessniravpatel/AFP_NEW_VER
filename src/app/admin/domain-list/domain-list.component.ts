import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomainService } from '../services/domain.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';

declare var $,unescape	: any;

@Component({
  selector: 'app-domain-list',
  providers: [ DomainService,CommonService ],
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.css']
})
export class DomainListComponent implements OnInit {

	domainList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private domainService: DomainService, private CommonService: CommonService, public globals: Globals) 
  {
	
  }

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
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Domain'})
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
	this.domainService.getAll()
	.then((data) => 
	{ 
		this.domainList = data;	
		setTimeout(function(){
		var table = $('#dataTables-example').DataTable( {
			"oLanguage": {
			"sLengthMenu": "_MENU_ Domains per Page",
						"sInfo": "Showing _START_ to _END_ of _TOTAL_ Domains",
						"sInfoFiltered": "(filtered from _MAX_ total Domains)",
						"sInfoEmpty": "Showing 0 to 0 of 0 Domains"
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
						title: 'DomainsList',
						exportOptions: {
							columns: [ 0, 1, 2 ]
								}
							},
								{
								extend: 'print',
								title: 'Domains List',
								exportOptions: {
								columns: [ 0, 1, 2 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Domains').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
		
		
		$(".domain").addClass("selected");
		},100); 
		this.globals.isLoading = false;	
	}, 
	(error) => 
	{
		//alert('error');
		this.globals.isLoading = false;
		this.router.navigate(['/admin/pagenotfound']);
	});
	this.msgflag = false;
  }
	
	deleteDomain(domain)
	{ 
		this.deleteEntity =  domain;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(domain)
	{ var del={'Userid':this.globals.authData.UserId,'id':domain.DomainId};
		this.domainService.delete(del)
		.then((data) => 
		{
			let index = this.domainList.indexOf(domain);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.domainList.splice(index, 1);
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
			this.globals.message = 'Domain Deleted Successfully';
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

