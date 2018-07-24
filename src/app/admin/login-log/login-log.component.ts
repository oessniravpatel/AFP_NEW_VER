import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuditlogService } from '../services/auditlog.service';
import { Globals } from '.././globals';
declare var $,unescape: any;

@Component({
  selector: 'app-login-log',
  providers: [ AuditlogService ],
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {

	loginlogList;
	
	constructor(private el: ElementRef, private http: Http, private router: Router, private route: ActivatedRoute,
		 private AuditlogService: AuditlogService, public globals: Globals) 
  {
	
  }

  ngOnInit() { 
    
    this.globals.isLoading = true;
    if(this.globals.authData.RoleId==4){
      this.AuditlogService.getLoginLog()
      .then((data) => 
      { 
        this.loginlogList = data;	
        setTimeout(function(){
        var table = $('#dataTables-example').DataTable( {
          "oLanguage": {
          "sLengthMenu": "_MENU_ Log per Page",
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ Log",
                "sInfoFiltered": "(filtered from _MAX_ total Log)",
                "sInfoEmpty": "Showing 0 to 0 of 0 Log"
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
						title: 'LogList',
						exportOptions: {
							columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
								{
								extend: 'print',
								title: 'Log List',
								exportOptions: {
								columns: [ 0, 1, 2, 3, 4, 5 ]
								}
							},
						]
					}).container().appendTo($('#buttons'));
				
				$('.buttons-excel').attr('data-original-title', 'Export All Log').tooltip();
				$('.buttons-print').attr('data-original-title', 'Print').tooltip();
				
				$('#dataTables-example').dataTable();
				$('#dataTables-example_filter input').addClass('input-sm');
		
        $(".loginlog").addClass("selected");
        $(".log").addClass("active");
        $(".loginlog").parent().removeClass("display_block");	
        },100); 	
        this.globals.isLoading = false;
      }, 
      (error) => 
      {
        alert('error');
        this.globals.isLoading = false;
      });    
    } else {		
      this.router.navigate(['/admin/access-denied']);
    }			
  }

}



