<!DOCTYPE html>
<html>
	<head>
		<% include header %>	
	</head>
	<body class="claro patric">
		<div id="ApplicationContainer" data-dojo-type="dijit/layout/BorderContainer" class="layoutContainer" data-dojo-props="id:'ApplicationContainer',gutters:false,liveSplitters:false">
			<% include p3header %>

			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'" style="padding:0px;border:0px solid #ddd;background:inherit;">
				Workspace Content
			</div>
		</div>
		<% include javascript %>
	</body>
</html>
