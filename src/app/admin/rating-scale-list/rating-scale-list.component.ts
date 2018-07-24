import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RatingScaleService } from '../services/rating-scale.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-rating-scale-list',
  providers: [ RatingScaleService,CommonService ],
  templateUrl: './rating-scale-list.component.html',
  styleUrls: ['./rating-scale-list.component.css']
})
export class RatingScaleListComponent implements OnInit {

	ratingList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private RatingScaleService: RatingScaleService, private CommonService: CommonService, public globals: Globals) 
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
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Rating Scale'})
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
		this.RatingScaleService.getAll()
	.then((data) => 
	{ 
		this.ratingList = data;	
		setTimeout(function(){
		var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ Rating Scale per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ Rating Scale",
					"sInfoFiltered": "(filtered from _MAX_ total Rating Scale)",
					"sInfoEmpty": "Showing 0 to 0 of 0 Rating Scale"
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
						title: 'RatingScaleList',
						exportOptions: {
							columns: [ 0, 1, 2, 3 ]
								}
							},
								{
								extend: 'print',
								title: 'Rating Scale List',
								exportOptions: {
								columns: [ 0, 1, 2, 3 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Rating Scale').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
	  
	  $(".rscale").addClass("selected");
        $(".gsetting").addClass("active");
        $(".rscale").parent().removeClass("display_block");	
    },500); 
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
	
	deleteRatingScale(ratingscale)
	{ 
		this.deleteEntity =  ratingscale;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(ratingscale)
	{ 
		var del={'Userid':this.globals.authData.UserId,'id':ratingscale.RatingScaleId};
		this.RatingScaleService.delete(del)
		.then((data) => 
		{
			let index = this.ratingList.indexOf(ratingscale);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.ratingList.splice(index, 1);			
			}	
			this.globals.message = 'Rating Scale Deleted Successfully';
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


