import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CompetencyAreaService } from '../services/competency-area.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-competency-area-list',
	providers: [ CompetencyAreaService,CommonService ],
  templateUrl: './competency-area-list.component.html',
  styleUrls: ['./competency-area-list.component.css']
})
export class CompetencyAreaListComponent implements OnInit {
	areaList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private CompetencyAreaService: CompetencyAreaService, private CommonService: CommonService, public globals: Globals) 
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
			this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Competency Area'})
			.then((data) => 
			{
				this.permissionEntity = data;
				if(this.permissionEntity.View==1 ||  this.permissionEntity.AddEdit==1 || this.permissionEntity.Delete==1){
					this.default();
				} else {
					this.router.navigate(['/access-denied']);
				}		
			},
			(error) => 
			{
				//alert('error');
				this.globals.isLoading = false;
				this.router.navigate(['/pagenotfound']);
			});	
		}			
		}
	
	default(){
		this.CompetencyAreaService.getAll()
	.then((data) => 
	{ 
		this.areaList = data;	
		setTimeout(function(){
		var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ Competencies per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ Competencies",
					"sInfoFiltered": "(filtered from _MAX_ total Competencies)",
					"sInfoEmpty": "Showing 0 to 0 of 0 Competencies  "
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
						title: 'CompetenciesList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
								{
								extend: 'print',
								title: 'Competencies List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Competencies').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
	  
	  $(".carea").addClass("selected");
    },500); 
	this.globals.isLoading = false;
	}, 
	(error) => 
	{
		//alert('error');
		this.globals.isLoading = false;
		this.router.navigate(['/pagenotfound']);
	});	
	this.msgflag = false;
	this.globals.isLoading = false;
	}
	
	deletearea(area)
	{ 
		this.deleteEntity =  area;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(area)
	{ 
		var del={'Userid':this.globals.authData.UserId,'id':area.CAreaId};
		this.CompetencyAreaService.delete(del)
		.then((data) => 
		{
			let index = this.areaList.indexOf(area);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.areaList.splice(index, 1);			
			}	
			this.globals.message = 'Competency Area Deleted Successfully!';
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


