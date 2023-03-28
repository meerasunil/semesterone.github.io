var Airtable = require("airtable");
var base = new Airtable({
  apiKey: "keyYwqUVpSMHcmshQ",
}).base("appUX3a2EFTq8Lc9h");


// create empty array to use later for filters
let locations = [];

// find the parent container element to which we will append each record
let container = document.querySelector(".content-container");

base('Table 1')
  .select({
    // Selecting the first 5 records in Grid view:
    maxRecords: 50,
    view: "Grid view",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record, index) {
        console.log('Retrieved');
        // loop through each year in this record

        // record.fields.location.forEach((location) => {
        //   // if the year is not already in the years array
        //   // add it to the years array
        //   if (!locations.includes(location)) locations.push(location);
        // });

        // create div element for each record
        let airtableItem = document.createElement("div");
        // add a class to the record element
        airtableItem.classList.add("airtable-item");
        // set the data-year attribute equal to the value of the record year
        // this will be used to sort items
        airtableItem.setAttribute("data-Brand", record.fields.brand);
        // set the data-location attribute equal to the value of the record location
        // this will be used to filter items
        airtableItem.setAttribute("data-location", record.fields.location);
        airtableItem.setAttribute("data-packagers", record.fields.packagers);
        airtableItem.setAttribute("data-rating", record.fields.rating);

        /*
        drawer title button
        */

        // create a button element hold the title, artist, and year
        let drawerButton = document.createElement("button");
        // add a class to the button element
        drawerButton.classList.add("drawer-button");

        // create an h2 element for the title
        let drawerButtonTitle = document.createElement("h2");
        // add a class to the button element
        drawerButtonTitle.classList.add("drawer-button--Name");
        // render the value of the record's title
        drawerButtonTitle.innerHTML = record.fields.name;
        // append the button element to the airtableItem div element created above
        drawerButton.append(drawerButtonName);

        // create a button element hold the title, artist, and year
        let drawerButtonInfo = document.createElement("div");
        // add a class to the button element
        drawerButtonInfo.classList.add("drawer-button--info");
        // render the value of the record's title
        drawerButtonInfo.innerHTML = `${record.fields.brand}, ${record.fields.location[0]}`;
        // append the button element to the airtableItem div element created above
        drawerButton.append(drawerButtonInfo);

        // append the button element to the airtableItem div element created above
        airtableItem.append(drawerButton);

        /*
        drawer content
        */

        // create a div element for the record's description, link, and image
        let drawerContent = document.createElement("div");
        // add a class to the img element
        drawerContent.classList.add("drawer-content");
        // if this is the first item in the for loop
        // add class to open it initially
        if (index == 0) {
          airtableItem.classList.add("is-open");
        }

        // create a div element for the record's description
        let drawerContentDescription = document.createElement("div");
        // add a class to the description element
        drawerContentDescription.classList.add("drawer-content--fldsptzJZZb44L4A6");
        // render the record's desription in the html
        drawerContentDescription.innerHTML = record.fields.potentialpackagingsource;
        // append the div element to the airtableItem div element created above
        drawerContent.append(drawerContentDescription);

        // create a div element for the record's description
        let drawerContentImageTable = document.createElement("div");
        // add a class to the description element
        drawerContentImageTable.classList.add("drawer-content--imageTable");
        // append the div element to the airtableItem div element created above
        drawerContent.append(drawerContentImageTable);

        // create an img element for the record's image
        let drawerContentImage = document.createElement("img");
        // add a class to the image element
        drawerContentImage.classList.add("drawer-content--image");
        // set the source of the record's image
        drawerContentImage.src = record.fields.image[0].url;
        // append the img element to the image container element created above
        drawerContentImageTable.append(drawerContentImage);

        // append the drawer content element to the airtableItem div element created above
        airtableItem.append(drawerContent);

        // once all elements are created for this record,
        // append it to the parent container
        container.append(airtableItem);

        // create drawer toggle function
        drawerButton.addEventListener("click", () => {
          airtableItem.classList.toggle("is-open");
        });
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      } else {
        // get all of the rendered records


      }
    }
  );

