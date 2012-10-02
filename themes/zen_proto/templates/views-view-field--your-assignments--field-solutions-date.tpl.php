<?php
 /**
  * This template is used to print a single field in a view. It is not
  * actually used in default Views, as this is registered as a theme
  * function which has better performance. For single overrides, the
  * template is perfectly okay.
  *
  * Variables available:
  * - $view: The view object
  * - $field: The field handler object that can process the input
  * - $row: The raw SQL result that can be used
  * - $output: The processed output that will normally be used.
  *
  * When fetching output from the $row, this construct should be used:
  * $data = $row->{$field->field_alias}
  *
  * The above will guarantee that you'll always get the correct data,
  * regardless of any changes in the aliasing that might happen if
  * the view is modified.
  */
?>
<?php
$node = $row->_field_data['nid']['entity'];
$node->solutions = false;
if (isset($node->field_solutions_date[LANGUAGE_NONE][0])){
	$start_date = $node->field_solutions_date[LANGUAGE_NONE][0]['value'];
	$end_date = $node->field_solutions_date[LANGUAGE_NONE][0]['value2'];
	if ($start_date == $end_date){
		$node->solutions = true;
	} else if ($start_date != $end_date AND $end_date > time()){
		$node->solutions = true;
	} 
	if (isset($node->field_publish_date[LANGUAGE_NONE][0])){
		//if the problem end publish date has passed (expired), we can just say no for "Solutions Provided"
		if ($node->field_publish_date[LANGUAGE_NONE][0]['value'] < $node->field_publish_date[LANGUAGE_NONE][0]['value2'] AND $node->field_publish_date[LANGUAGE_NONE][0]['value2'] < time()){
			$node->solutions = false;
		}
	}
}

?>
<b>
<?php 
print (($node->solutions) ? t('Yes') : t('No')); 
?>
</b>
<?php
if ($node->solutions){
	if ($start_date == $end_date){
		print t('- provided on ') . format_date($start_date, 'short');
	} else {
		print t('- provided on ') . format_date($start_date, 'short') . t(' until ') . format_date($end_date, 'short') ;
	}
}
?>

