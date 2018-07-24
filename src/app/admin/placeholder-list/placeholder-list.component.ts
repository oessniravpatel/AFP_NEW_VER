import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PlaceholderService } from '../services/placeholder.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-placeholder-list',
  providers: [ PlaceholderService,CommonService ],
  templateUrl: './placeholder-list.component.html',
  styleUrls: ['./placeholder-list.component.css']
})
export class PlaceholderListComponent implements OnInit {

	placeholderList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private PlaceholderService: PlaceholderService, private CommonService: CommonService, public globals: Globals) 
  {
	
  }

  ngOnInit() { 
	
	this.globals.isLoading = true;
	$("body").tooltip({
		selector: "[data-toggle='tooltip']"
	});
	//this.globals = this.global;
	if(this.globals.authData.RoleId!=4){
		this.router.navigate(['/admin/access-denied']);
	  }

		this.permissionEntity = {}; 
	if(this.globals.authData.RoleId==4){
		this.permissionEntity.View=1;
		this.permissionEntity.AddEdit=1;
		this.permissionEntity.Delete=1;
		this.default();
	} else {		
		this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'Placeholder Screen'})
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
	//this.globals.msgflag = false;
	this.PlaceholderService.getAll()
	.then((data) => 
	{ 
		this.placeholderList = data;	
		setTimeout(function(){
     var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ Placeholder per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ Placeholder",
					"sInfoFiltered": "(filtered from _MAX_ total Placeholder)",
					"sInfoEmpty": "Showing 0 to 0 of 0 Placeholder"
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
						title: 'PlaceholderList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4 ]
								}
							},
								{
								extend: 'print',
								title: 'Placeholder List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Placeholder').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
	  
	  $(".placeholder").addClass("selected");
	  $(".email").addClass("active");
      $(".placeholder").parent().removeClass("display_block");	
    },500); 
	this.globals.isLoading = false;
	}, 
	(error) => 
	{
		//alert('error');
		this.globals.isLoading = false;
		this.router.navigate(['/admin/pagenotfound']);
	});		
	}
	
	deleteplaceholder(placeholder)
	{ 
		this.deleteEntity =  placeholder;
		$('#Delete_Modal').modal('show');					
	}

	deleteConfirm(placeholder)
	{ 
		this.PlaceholderService.delete(placeholder.PlaceholderId)
		.then((data) => 
		{
			let index = this.placeholderList.indexOf(placeholder);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.placeholderList.splice(index, 1);			
			}	
			this.globals.message = 'Placeholder Deleted Successfully!';
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


