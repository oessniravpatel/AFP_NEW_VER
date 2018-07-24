import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IndustryService } from '../services/industry.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';

declare var $,unescape: any;

@Component({
  selector: 'app-industrylist',
  providers: [ IndustryService,CommonService ],
  templateUrl: './industrylist.component.html',
  styleUrls: ['./industrylist.component.css']
})
export class IndustrylistComponent implements OnInit {

	IndustryList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
 constructor( private http: Http,public globals: Globals, private router: Router, private CommonService: CommonService, private IndustryService: IndustryService,private route:ActivatedRoute) { }

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
			this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Industry'})
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
		this.IndustryService.getAll()
		.then((data) => 
		{ 
			this.IndustryList = data;	
			setTimeout(function(){
			var table = $('#dataTables-example').DataTable( {
					"oLanguage": {
						"sLengthMenu": "_MENU_ Industries per Page",
						"sInfo": "Showing _START_ to _END_ of _TOTAL_ Industries",
						"sInfoFiltered": "(filtered from _MAX_ total Industries)"
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
						title: 'IndustriesList',
						exportOptions: {
							columns: [ 0, 1, 2 ]
								}
							},
								{
								extend: 'print',
								title: 'Industries List',
								exportOptions: {
								columns: [ 0, 1, 2 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Industries').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
				
				$(".industry").addClass("selected");
				$(".gsetting").addClass("active");
				$(".industry").parent().removeClass("display_block");	
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

	deleteIndustry(Industry)
	{ 
		this.deleteEntity =  Industry;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(Industry)
	{ 
		var del={'Userid':this.globals.authData.UserId,'id':Industry.IndustryId};
		this.IndustryService.delete(del)
		.then((data) => 
		{
			let index = this.IndustryList.indexOf(Industry);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.IndustryList.splice(index, 1);
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
			this.globals.message = 'Industry Deleted Successfully';
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
