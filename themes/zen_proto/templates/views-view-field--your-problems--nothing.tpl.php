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
$result = db_query("SELECT n.title, ap.entity_id AS nid FROM {field_data_field_problems} ap JOIN {node} n ON ap.entity_id = n.nid WHERE ap.field_problems_value = :pnid", array(':pnid' => $row->nid));
$assign_links = array();
foreach($result AS $assign){
	$assign_links[] = l($assign->title, 'node/' . $assign->nid);
}
if (count($assign_links)){
	print '<div class="assign-ref-link">'. implode('</div><div class="assign-ref-link">', $assign_links) . '</div>';
}
?>
