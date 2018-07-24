import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { CommonService } from '../services/common.service';
import { Globals } from '../globals';

declare var $,unescape: any;


@Component({
  selector: 'app-companylist',
  providers: [ CompanyService,CommonService ],
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {

	companyList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	 constructor(private http: Http, private router: Router, private route: ActivatedRoute, 
		private CompanyService: CompanyService,private CommonService: CommonService, public globals: Globals) { }

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
				this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Company'})
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
		this.CompanyService.getAllCompany	()
	.then((data) => 
	{ 
		this.companyList = data;	
		setTimeout(function(){			
		var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ Companies per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ Companies",
					"sInfoFiltered": "(filtered from _MAX_ total Companies)",
					retrieve: false
					
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
						title: 'CompaniesList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5]
								}
							},
								{
								extend: 'print',
								title: 'Companies List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Companies').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
	  
	  $(".company").addClass("selected");
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
	this.globals.isLoading = false;
	}

	deleteCompany(company)
	{ 
		this.deleteEntity =  company;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(company)
	{ 	
		var del={'Userid':this.globals.authData.UserId,'id':company.CompanyId};
		this.CompanyService.deleteCompany(del)
		.then((data) => 
		{
			let index = this.companyList.indexOf(company);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.companyList.splice(index, 1);
				//this.router.navigate(['/admin/domain/list']);
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
			this.globals.message = 'Company Deleted Successfully';
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
