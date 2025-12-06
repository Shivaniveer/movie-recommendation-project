const inputs = document.querySelectorAll(".input");
function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});
function toggleContent() {
    var content = document.getElementById("filter");
    if (content.style.display === "none") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  }


//navbar active link
//navbar active link


$(document).ready(function () {
    // Initialize DataTable for your table
    var table = $('#advancedTable').DataTable({
        paging: true, // Enable pagination
        info: false,  // Disable the info display
        searching: false, // Disable built-in search
        order: [],    // Maintain no default sorting
        columnDefs: [
            { orderable: true, targets: "_all" } // Make all columns sortable
        ],
        rowCallback: function (row, data, index) {
            // Custom logic for each row
            if ($(row).attr('id') === 'new-role-row' || $(row).attr('id') === 'new-rule-row') {
                $(row).addClass('always-top');
            }
        },

    });

    // Custom sorting logic to move specific rows to the top
    table.on('order.dt draw.dt', function () {
        var rows = table.rows().nodes();

        var hasVisibleRows = false;

        // Loop through rows to find any visible ones except for hidden ones like 'new-role-row'
        $(rows).each(function () {
            if (!$(this).is(':hidden') && $(this).attr('id') !== 'new-role-row' && $(this).attr('id') !== 'new-rule-row') {
                hasVisibleRows = true;
            }
        });

        // Show "No records found" if there are no visible rows
        if (!hasVisibleRows) {
            if ($('#advancedTable tbody .no-records').length === 0) {
                $('#advancedTable tbody').append('<tr class="no-records"><td colspan="100%">No records found</td></tr>');
            }
        } else {
            $('#advancedTable tbody .no-records').remove();
        }






        var newRoleRow = null, newRuleRow = null;

        // Find the special rows in all data
        $(rows).each(function () {
            if ($(this).attr('id') === 'new-role-row') {
                newRoleRow = this;
            } else if ($(this).attr('id') === 'new-rule-row') {
                newRuleRow = this;
            }
        });

        // Append the special rows to the top
        if (newRoleRow) {
            $(newRoleRow).prependTo('#advancedTable tbody');
        }
        if (newRuleRow) {
            $(newRuleRow).prependTo('#advancedTable tbody');
        }
    });

    // Trigger a redraw to apply the custom logic on load
    table.draw();
});


document.querySelectorAll('.theme-option').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        const selectedTheme = this.dataset.theme;

        // Remove 'active' class from all submenu items
        document.querySelectorAll('.theme-option').forEach(option => {
            option.parentElement.classList.remove('active');
        });

        // Add 'active' class to the current submenu item
        this.parentElement.classList.add('active');

        // Remove all theme-related classes
        document.documentElement.classList.remove('lighttheme', 'standardtheme', 'defaulttheme');

        // Apply the selected theme
        if (selectedTheme === 'lighttheme') {
            document.documentElement.classList.add('lighttheme');
        } else if (selectedTheme === 'standardtheme') {
            document.documentElement.classList.add('standardtheme');
        } else if (selectedTheme === 'default') {
            document.documentElement.classList.add('defaulttheme');
        }

        // Store the selected theme in localStorage
        localStorage.setItem('selectedTheme', selectedTheme);
    });
});

//    // Get all navbar items
//    const navItems = document.querySelectorAll('.sidebar .item, .sidebar [class*="-link"]');
//
//    navItems.forEach(item => {
//        // Get the name of the item
//        const tabName = item.getAttribute('Name');
//
//        // Check if the tab name is in the list of active tabs
//        if (!activeTabs.includes(tabName)  && tabName !== "Logout") {
//            // Check if the 'li' has an 'a' tag
//            const link = item.querySelector('a');
//            if (link) {
//                // If it has an 'a' tag, remove the entire 'li' element
//                item.remove();
//            }
//        }
//    });


//      const allowedUrls = rawAllowedUrls.map(url => decodeURIComponent(url));
//
//        const currentUrl = decodeURIComponent(window.location.pathname);  // Decode the current URL path
//
//    // Determine if any allowed URL permits access to the current URL
//    const isAllowedUrl = allowedUrls.some(allowedUrl => {
//        // Trim the trailing slash if it exists
//        const trimmedAllowedUrl = allowedUrl.endsWith('/') ? allowedUrl.slice(0, -1) : allowedUrl;
//
//        // Check if the current URL matches the trimmed allowed URL or starts with it
//        if (allowedUrl.endsWith('/')) {
//            return currentUrl.startsWith(trimmedAllowedUrl); // Allow any sub-paths
//        } else {
//            return currentUrl === allowedUrl; // Only allow the exact match
//        }
//    });
//
//    if (!isAllowedUrl) {
//        // Redirect to the previous page if the current URL is not allowed
//        const previousUrl = document.referrer; // Get the previous page URL
//
//        alert(previouUrl)
//        if (previousUrl) {
//            alert("You are not allowed to access this page");
//            // If there is a previous URL, redirect to it
//            window.location.href = previousUrl;
//        } else {
//            // If there is no previous URL, redirect to a default page (optional)
//            window.location.href = '/Home'; // Change to your desired default page
//        }
//    }
//






// active link end

// rules html 

//rules end



