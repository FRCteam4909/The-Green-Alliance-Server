var views = [];

function loadData() {
	$.get("http://127.0.0.1:1338/data", function (views) {
		window.views = views;

		views.forEach(function (view) {
			var table = `<div class="table-responsive"><table class="table table-striped"><thead><tr>`;

			view.headers.forEach(function (header) {
				table += "<th>" + header.text + "</th>";
			});

			table += `</tr></thead><tbody>`;

			view.data.forEach(function (datum) {
				table += `<tr>`;

				view.headers.forEach(function (header) {
					table += "<td>" + getDescendantProp(datum, header.value) + "</td>";
				});

				table += `</tr>`;
			});

			table += `</tbody></table></div>`

			$(".main").append(table);
		});
	});
}

/* http://stackoverflow.com/a/8052100 */
function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}


loadData();