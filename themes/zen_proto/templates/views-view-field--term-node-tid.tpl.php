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
$alter = false;
if (function_exists('homework_generator_view_form_js')){
	homework_generator_view_form_js();
	$alter = true;
}
if ($alter AND isset($field->items[$row->nid])){
	$term_links = array();
	foreach ($field->items[$row->nid] as $term){
		$term_links[] = l($term['name'], 'taxonomy/term/' . $term['tid'], array("attributes" => array('class' => "assignment-term-click", 'rel'=> "taxonomy/term/" . $term['tid'])));
	}
	print implode (', ', $term_links);
} else {
	print $output; 
}
?>
