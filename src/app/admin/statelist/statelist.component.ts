import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../services/state.service';
import { CommonService } from '../services/common.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-statelist',
  providers: [ StateService,CommonService ],
  templateUrl: './statelist.component.html',
  styleUrls: ['./statelist.component.css']
})
export class StatelistComponent implements OnInit {

	stateList;
	deleteEntity;
	msgflag;
	message;
	type;
	permissionEntity;
	//globals;
	 constructor(private http: Http, private router: Router, private route: ActivatedRoute, 
		private StateService: StateService, private CommonService: CommonService, public globals: Globals) { }

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
			this.CommonService.get_permissiondata({'RoleId':this.globals.authData.RoleId,'screen':'State'})
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
		this.StateService.getAll()
	//.map(res => res.json())
	.then((data) => 
	{
		this.stateList = data;
	setTimeout(function(){
      var table = $('#dataTables-example').DataTable( {
        "oLanguage": {
          "sLengthMenu": "_MENU_ State per Page",
					"sInfo": "Showing _START_ to _END_ of _TOTAL_ State",
					"sInfoFiltered": "(filtered from _MAX_ total State)"
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
						title: 'StatesList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4 ]
								}
							},
								{
								extend: 'print',
								title: 'States List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All States').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
			
			$(".state").addClass("selected");
        $(".gsetting").addClass("active");
        $(".state").parent().removeClass("display_block");	
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

	tableToExcel(table, name)
	{
		var uri = 'data:application/vnd.ms-excel;base64,'
		, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
		, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
		if (!table.nodeType){ table = document.getElementById(table)
		var ctx = {worksheet: name || 'Worksheet', table: table.outerHTML}
		window.location.href = uri + base64(format(template, ctx))}
	}
  
  deleteState(state)
	{ 
		this.deleteEntity =  state;
		$('#Delete_Modal').modal('show');					
	}
  
  deleteConfirm(state)
	{
		var del={'Userid':this.globals.authData.UserId,'id':state.StateId};
		this.StateService.deleteState(del)
		.then((data) => 
		{
			let index = this.stateList.indexOf(state);
			$('#Delete_Modal').modal('hide');
			if (index != -1) {
				this.stateList.splice(index, 1);
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
			this.globals.message = 'State Deleted Successfully';
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
