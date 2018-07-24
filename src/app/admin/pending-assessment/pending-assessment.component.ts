import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PendingAssessmentService } from '../services/pending-assessment.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-pending-assessment',
  providers: [ PendingAssessmentService,CommonService ],
  templateUrl: './pending-assessment.component.html',
  styleUrls: ['./pending-assessment.component.css']
})
export class PendingAssessmentComponent implements OnInit {

	pendingAssList;
	permissionEntity;
	
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private PendingAssessmentService: PendingAssessmentService, private CommonService: CommonService, public globals: Globals) 
  {
	
  }

  ngOnInit() { 
	
	this.globals.isLoading = true;
	this.permissionEntity = {}; 
	if(this.globals.authData.RoleId==4){
		this.permissionEntity.View=1;
		this.permissionEntity.AddEdit=1;
		this.permissionEntity.Delete=1;
		this.default();
	} else {		
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Pending Assessment'})
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
	this.PendingAssessmentService.getPendingAssessment()
	.then((data) => 
	{ 
		this.pendingAssList = data;	
		setTimeout(function(){
		var table = $('#dataTables-example').DataTable( {
			"oLanguage": {
			"sLengthMenu": "_MENU_ Incomplete Assessments per Page",
						"sInfo": "Showing _START_ to _END_ of _TOTAL_ Incomplete Assessments",
						"sInfoFiltered": "(filtered from _MAX_ total Incomplete Assessments)",
						"sInfoEmpty": "Showing 0 to 0 of 0 Incomplete Assessments"
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
						title: 'IncompleteAssessmentsList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
								{
								extend: 'print',
								title: 'Incomplete Assessments List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Incomplete Assessments').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
		
			$(".pendingass").addClass("selected");
			$(".email").addClass("active");
        	$(".pendingass").parent().removeClass("display_block");
		},100); 
		this.globals.isLoading = false;	
	}, 
	(error) => 
	{
		//alert('error');
		this.globals.isLoading = false;
		this.router.navigate(['/admin/pagenotfound']);
	});
  }

}


