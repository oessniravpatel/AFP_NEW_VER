<?php

class Contact_model extends CI_Model
 {

	public function add_Contact($post_Contact) {
	
		if($post_Contact) {
			
			$Contact_data = array(
				'FirstName' =>  trim($post_Contact['FirstName']),
				'LastName' =>  trim($post_Contact['LastName']),
				'EmailAddress' =>  trim($post_Contact['EmailAddress']),
				'CompanyName' => trim($post_Contact['CompanyName']),
				'Comments' => trim($post_Contact['Comments'])
			
			
			);
			
			$res = $this->db->insert('tblcontactus',$Contact_data);
			if($res) {
						return $res;
					}else{
					return false;
					
				}
			// if($res) {
			// 	$log_data = array(
			// 		'UserId' => trim($post_Contact['CreatedBy']),
			// 		'Module' => 'Contact',
			// 		'Activity' =>'Add'

			// 	);
			// 	$log = $this->db->insert('tblactivitylog',$log_data);
			// 	return true;
			// } else {
			// 	return false;
			// }
	
		} else {
			return false;
		}
	}
	public function get_userdata($CId=Null)
	{
	  if($CId)
	  {
		  
		  $this->db->select('us.UserId,us.CompanyId,us.FirstName,us.LastName,us.EmailAddress,
			tc.CompanyId,tc.Name as CompanyName');
			$this->db->join('tblcompany tc', 'us.CompanyId = tc.CompanyId', 'left');
			$this->db->where('UserId=',$CId);
			$result = $this->db->get('tbluser us');
		
			// $this->db->select('pr.CompanyId,pr.Name,pr.IndustryId,pr.Website,pr.PhoneNumber,ps.IndustryId,ps.IndustryName');
		// $this->db->join('tblmstindustry ps', 'pr.IndustryId = ps.IndustryId', 'left');
		// $this->db->where('CompanyId',$CompanyId);
		// $result = $this->db->get('tblcompany pr');
	

		 // $this->db->select('*');
		 // $this->db->where('UserId',$user_id);
		 // $result=$this->db->get('tbluser');
		 $user_data= array();
		 foreach($result->result() as $row)
		 {
			$user_data=$row;
			
		 }
		 return $user_data;
		 
	  }
	  else
	  {
		  return false;
	  }
	}

	
	
	
}
