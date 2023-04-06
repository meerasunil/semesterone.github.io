// activate airtable object
var Airtable = require("airtable");

var base = new Airtable({ apiKey: "keyYwqUVpSMHcmshQ"}).base(
  "appuBBpW92U6TCJ3x"
);

let popup = document.createElement("div");
popup.classList.add("popup");
document.body.append(popup);

base("Table 1")
  .select({
    // maxRecords: 50,
    // view: "Grid view",
  })
  .eachPage(function page(records, fetchNextPage) {
    records.forEach(function (record) {
      // pull my airtable data
      // each record will have its own div
      let airtableItem = document.createElement("div");
      // add some data specific meta to my new divs for filtering
      airtableItem.classList.add("airtable-item", record.fields.uses, record.fields.colour);
      airtableItem.setAttribute("data-uses", record.fields.uses);
      
      // create a span for my artist name
      let name = document.createElement("span");
      name.innerHTML = record.fields.name;
      name.classList.add("name");
      let nickname = document.createElement("span")
      nickname.innerHTML = record.fields.nickname;
      nickname.classList.add("nickname");

    
      
      // create a div for the hover state image
      let hoverImage = document.createElement("div");
      hoverImage.classList.add("hover-image");
      hoverImage.style.backgroundImage = `url(${record.fields.photo[0].url})`;
      
      // add a click event listener to the hover image to display a popup
      hoverImage.addEventListener("click", function() {
        console.log("function is working");
        let edibility = record.fields.edibility;
        let uses = record.fields.uses;
        let link = record.fields.link;
        if (edibility === "Edible") {
          if (uses === "Culinary") {
            popup.innerHTML = `This item is edible and has a culinary use. Here is a <a href="${link}" target="_blank">recipe</a>.`;
          } else {
            popup.innerHTML = `This item is edible but is used medicinally. Here is the <a href="${link}" target="_blank">medicinal history</a.`;
          }
        } else {
          popup.innerHTML = `This item is not edible.`;
        }
        popup.classList.add("show");
      });
      
      

      // appending to div holding each airtable record
      airtableItem.append(hoverImage);
      airtableItem.append(name);
      airtableItem.append(nickname);
      // append div to body
      document.body.append(airtableItem);
    });
  });

// set up a event listener for my empowering button
// listen for user clicker, once it is clicker, serach for divs with data-mood, empowering

// get our button using css ID
// assign a event listener to my button to listen for click
let psychedelicsFilterBtn = document.getElementById("Psychedelics");
psychedelicsFilterBtn.addEventListener("click", function(event){ShowHideFilter(event)});

let culinaryFilterBtn = document.getElementById("Culinary");
culinaryFilterBtn.addEventListener("click", function(event){ShowHideFilter(event)});

let medicinalFilterBtn = document.getElementById("Medicinal");
medicinalFilterBtn.addEventListener("click", function(event){ShowHideFilter(event)});

let poisonousFilterBtn = document.getElementById("Poisonous");
poisonousFilterBtn.addEventListener("click", function(event){ShowHideFilter(event)});

let showAllBtn = document.getElementById("ShowAll");
showAllBtn.addEventListener("click", function(event){ShowAll(event)});

function ShowHideFilter(e) {
  console.log("function is working");
  console.log(e.target.id)
  let listofAirtableItems = document.querySelectorAll("div.airtable-item");
  listofAirtableItems.forEach(function SearchFilter(item) {
    item.classList.remove("filter-hide");
    // if div matches the id of the button, show div, otherwise, hide
    if (item.dataset.uses == e.target.id) {
      item.classList.add("filter-show");
    } else {
      item.classList.add("filter-hide");
    }
  });
  
}


function ShowAll(e) {
  let listofAirtableItems = document.querySelectorAll("div.airtable-item");
  listofAirtableItems.forEach( function ShowAllRecords(item){
    if (!item.classList.contains("header")) {
      item.classList.remove("filter-hide");
      item.classList.add("filter-show");
    }
  })
}

