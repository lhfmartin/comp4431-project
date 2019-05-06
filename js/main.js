
// Currently selected base layer stage 1 operation
var currentBaseLayerStage1Op = "no-op";

// Currently selected base layer stage 2 operation
var currentBaseLayerStage2Op = "no-op";

// Currently selected shade layer operation
var currentShadeLayerOp = "no-op";

// Currently selected outline layer operation
var currentOutlineLayerOp = "no-op";

// Event handler for the 'click' event of the tabs
// The main goal of this handler is to improve the user experience by adding
// the behaviour of switching tab when the tab is clicked, in additional to
// the default behaviour which switch the tab only when the drop down menu
// items are clicked
function showTab(e) {
    // The target is the 'tab', i.e. the <li>. But most of the time the event
    // is triggered from the <a> inside it, due to the area occupied is much
    // bigger and hence easier to be clicked. So we need to adjust the 'target'
    // if it is not what we want.
    var target = $(e.target);

    // Check if 'target' is actually a <li> element. If not, we need to
    // find the <li> that is a parent of the current selected element.
    if (target.prop("tagName") !== "LI") {
        target = target.parents("li");
    }

    // Find the drop down menu item of this tab that is currently selected
    switch (target.attr("id")) {
        case "base-stage1-dropdown":
            target = target.find("ul li a[href='#" + currentBaseLayerStage1Op + "']");
            break;
        case "base-stage2-dropdown":
            target = target.find("ul li a[href='#" + currentBaseLayerStage2Op + "']");
            break;
        case "shade-dropdown":
            target = target.find("ul li a[href='#" + currentShadeLayerOp + "']");
            break;
        case "outline-dropdown":
            target = target.find("ul li a[href='#" + currentOutlineLayerOp + "']");
            break;
    }

    // Programmatically trigger a 'show' ('show.bs.tab') event on the tab drop down menu item.
    // Since we have set up this:
    // `$('a[data-toggle="tab"]').on('show.bs.tab', changeTabs);`,
    // this event chain will finally trigger the event handler 'changeTabs'.
    target.tab("show");
}

// Event handler for the 'show.bs.tab' event of the tabs.
// This event handler is executed just before the tab pane is really shown to the user.
function changeTabs(e) {
    // The target is the drop down menu item of the tab
    var target = $(e.target);

    // Change the tab title to reflect which operation is selected
    target.parents("li").find("span.title").html(target.html());

    // Change the current operation in different tab
    switch (target.parents("li.dropdown").attr("id")) {
        case "base-stage1-dropdown":
            currentBaseLayerStage1Op = $(e.target).attr("href").substring(1);
            break;
        case "base-stage2-dropdown":
            currentBaseLayerStage2Op = $(e.target).attr("href").substring(1);
            break;
        case "shade-dropdown":
            currentShadeLayerOp = $(e.target).attr("href").substring(1);
            break;
        case "outline-dropdown":
            currentOutlineLayerOp = $(e.target).attr("href").substring(1);
            break;
    }
}

// Set up every things when the document is fully loaded
$(document).ready(function() {
    // Initialize the imageproc module.
    // Get ready for the canvas area and automatically load the input image
    imageproc.init("input", "output", "input-image");

    // Update the input image when the selection is changed
    $("#input-image").on("change", function() { imageproc.updateInputImage(); });

    // Update button to apply all image processing functions
    $("#output-update").on("click", function() { imageproc.apply(); });
    
    // Enable Bootstrap Toggle
    $("input[type=checkbox]").bootstrapToggle();
    $(document).on('click.bs.toggle', 'label[for]', function(e) {
        var $checkbox = $('#' + $(e.currentTarget).attr('for'));
        if (!$checkbox[0] || !$checkbox.data('bs.toggle')) return;
        $checkbox.bootstrapToggle('toggle');
        e.preventDefault();
    });

    // Set up the event handlers
    $('li.dropdown').on("click", showTab); // Tab clicked
    $('a[data-toggle="tab"]').on('show.bs.tab', changeTabs); // Just before tab pane is shown
});
