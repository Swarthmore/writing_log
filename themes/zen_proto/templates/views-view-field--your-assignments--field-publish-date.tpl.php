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
$start_date = $node->field_publish_date[LANGUAGE_NONE][0]['value'];
$end_date = $node->field_publish_date[LANGUAGE_NONE][0]['value2'];
?>
<b>
<?php 
print (($node->status) ? t('Yes') : t('No')); 
?>
</b>
<?php
	if ($node->status AND $start_date == $end_date){
		print t('- no end date set');
	} else if ($node->status AND $end_date > time()){
		print t('- active until ') . format_date($end_date, 'short');
	} else if (!$node->status AND $start_date > time() AND $start_date == $end_date) {
		print t('- active on ') . format_date($start_date, 'short');
	} else if (!$node->status AND $start_date > time() AND $start_date  < $end_date) { //simple date validation
		print t('- active on ') . format_date($start_date, 'short') . t(' until ') . format_date($end_date, 'short');
	} else {
		print t('- expired');
	}
?>

