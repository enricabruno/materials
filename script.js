function fetchMDfile(){

url = "static/data/queries.md";
$.ajax({
  url: url,
  type: "GET",
  dataType: "text",
  success: function (results) {


    var catSection = document.createElement("div");
    catSection.classList.add("catSection")

    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    var html = converter.makeHtml(results);

    // iterate over categories
    var catBlock = html.split("<h1");
    for (var i = 1; i < catBlock.length; i++) {
      const regexH1 = RegExp("^[^;]*<\/h1>");
      const foundH1 = regexH1.exec(catBlock[i]);

      var cqSectionContainer =  document.createElement("div");
      cqSectionContainer.classList.add("cqSectionContainer")

      var ul = document.createElement("ul");
      ul.classList.add("nav")
      ul.classList.add("nav-tabs")
      //ul.id = ul + i
      $(ul).attr("role", "tablist")

      var tabContentSet = document.createElement("div");
      tabContentSet.classList.add("tab-content")

      // iterates over sub-categories
      var subcatBlock = catBlock[i].split("<h2");
      for (var l = 1; l < subcatBlock.length; l++) {
        var subCatSection = document.createElement("div");
        subCatSection.classList.add("subcatSection")

        var subCatDescSection = document.createElement("div");
        subCatDescSection.classList.add("subcatDescSection")

        const regexH2 = RegExp("(.|\n)*?(?=(<h3 ))");
        const foundH2 = regexH2.exec(subcatBlock[l]);

        var cqBlock = subcatBlock[l].split("<h3");
        for (var n = 1; n < cqBlock.length; n++) {
          var cqSection = document.createElement("div");
          cqSection.classList.add("cqSection")

          const regexH3 = RegExp("^[^;]*<\/table>");
          const foundH3 = regexH3.exec(cqBlock[n]);

          $(cqSection).append('<h3 ' + foundH3)

          var button = document.createElement("button");
          var li = document.createElement("li");
          li.classList.add("nav-item")

          navItem = cqSection.getElementsByTagName("H3")[0]
          button.innerHTML = navItem.textContent
          button.classList.add("nav-link") // active
          $(button).attr("data-bs-target", '#' + navItem.id)
          $(button).attr("data-bs-toggle", "tab")
          $(button).attr("role", "tab")
          li.append(button)
          ul.append(li)

          var tabContent = document.createElement("div");
          tabContent.id = navItem.id
          tabContent.classList.add("tab-pane") // show active
          tabContent.classList.add("fade")
          $(tabContent).attr("role", "tabpanel")

          if (n == 1) {
            tabContent.classList.add("show")
            tabContent.classList.add("active")
          }

          console.log(cqSection)

          tabContent.append(cqSection)
          tabContent.append(cqSection.getElementsByTagName("table")[0])
          tabContentSet.append(tabContent)

        }

        var row = document.createElement("div");
        row.classList.add("row")

        $(cqSectionContainer).addClass("col-sm-6")
        $(cqSectionContainer).addClass("p-5")
        $(subCatDescSection).append('<h2 ' + foundH2[0])
        $(subCatDescSection).addClass("col-sm-6")
        $(subCatDescSection).addClass("p-5")
        $(row).append(subCatDescSection)
        $(row).append(cqSectionContainer);
        $(subCatSection).append(row);
        $(row).addClass("row");
        $(subCatSection).addClass("card");

        $(cqSectionContainer).append(ul)
        $(cqSectionContainer).append(tabContentSet)




      }
      $(catSection).append('<h1 ' + foundH1)
      $(catSection).append(subCatSection)

}   $('#picchio').append(catSection)

}
})};



// INDEX get static content

$(function(){
    $("#intro").load("static/intro.html");
  });
$(function(){
    $("#documentationContent").load("static/documentation.html");
  });
$(function(){
    $("#csContent").load("static/casestudies.html");
  });
$(function(){
    $("#csData").load("static/rdfdata.html");
  });
  $(function(){
    $("#queries").load("static/queries.html");
  });

// INDEX build navbar

$(window).load(function() {
  $('#loading').hide();
});

var $content = $('.menu-content');

function showContent(type) {
$content.hide().filter('.' + type).show();
}

$('.nav').on('click', '.menu-btn', function(e) {
showContent(e.currentTarget.hash.slice(1));
e.preventDefault();
});

// show 'about' content only on page load (if you want)
showContent('home');

var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  var active = container.classList.toggle("active-cont");
});

// ZOOM IN ZOOM OUT

var zoom = 1;

$('.zoom').on('click', function(){
  zoom += 0.1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});
$('.zoom-init').on('click', function(){
  zoom = 1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});
$('.zoom-out').on('click', function(){
  zoom -= 0.1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});

// QUERY PAGE BUILDER

// gets JSON file where all queries are stored
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
              var data = JSON.parse(httpRequest.responseText);
              if (callback) callback(data);
          }
      }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}


// CQs PAGE BUILDER

fetchJSONFile('static/data/query-list.json', function(data) {
for (var i = 0; i < data.length; i++){
  var obj = data[i];
  var title = document.createElement("h3");
  var card_body = document.createElement("div");
  card_body.classList.add('query-card-body')
  card_body.classList.add('p-2')

  title.append(obj.section_title);
  $('#card_box').append(title)
  $('#card_box').append(card_body)

  for (var s = 0; s < obj.values.length; s++){
    var p = document.createElement("p");
    var code = document.createElement("pre");

    var query_string =  obj.values[s].SPARQL_query.replace(/\r\n/g, '').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    p.append(obj.values[s].NL_query);
    var button = "\<button type= \"button\" class=\"btn btn-link float-end\" onclick=\"run_query(\'" + query_string + "\', " + i + ", " + s +")\"\>\<i class=\"fas fa-play\"\>\</i\>\</button\>"

    code.append(obj.values[s].SPARQL_query)
    $(card_body).append(p).append(button)
    if (obj.values[s].info) {
      var info_button = "<button type=\"button\" class=\"btn btn-link float-end\" data-bs-toggle=\"collapse\" data-bs-target=\"#info" + i + s + "\" aria-expanded=\"true\" aria-controls=\"info" + i + s + "\"><i class=\"fas fa-info-circle\"\>\</i\></button><div id=\"info" + i + s + "\" class=\"accordion-collapse collapse\" aria-labelledby=\"headingOne\" data-bs-parent=\"#accordionExample\"><div class=\"accordion-body\">" + obj.values[s].info + "</div></div>"
      $(card_body).append(info_button);
    };
    $(card_body).append(code)
    $(card_body).append("<div id='yasr" + i + s + "'></div>")
    $(card_body).append("<hr class=\"bg-danger border-2 border-top border-danger\">")

  }}});
