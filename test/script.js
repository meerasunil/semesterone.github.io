var Airtable = require("airtable");
var base = new Airtable({
  apiKey: "keyYwqUVpSMHcmshQ",
}).base("appUX3a2EFTq8Lc9h");


let locations = [];

// find the parent container element to which we will append each record
let container = document.querySelector(".content-container");

base("playlist")
  .select({
    // Selecting the first 5 records in Grid view:
    maxRecords: 50,
    view: "Grid view",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record, index) {
        // loop through each year in this record
        record.fields.location.forEach((location) => {
          // if the year is not already in the years array
          // add it to the years array
          if (!locations.includes(location)) locations.push(location);
        });

        // create div element for each record
        let airtableItem = document.createElement("div");
        // add a class to the record element
        airtableItem.classList.add("airtable-item");
        // set the data-year attribute equal to the value of the record year
        // this will be used to sort items
        airtableItem.setAttribute("data-year", record.fields.date);
        // set the data-location attribute equal to the value of the record location
        // this will be used to filter items
        airtableItem.setAttribute("data-location", record.fields.location);

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
        drawerButtonTitle.classList.add("drawer-button--title");
        // render the value of the record's title
        drawerButtonTitle.innerHTML = record.fields.name;
        // append the button element to the airtableItem div element created above
        drawerButton.append(drawerButtonTitle);

        // create a button element hold the title, artist, and year
        let drawerButtonInfo = document.createElement("div");
        // add a class to the button element
        drawerButtonInfo.classList.add("drawer-button--info");
        // render the value of the record's title
        drawerButtonInfo.innerHTML = `${record.fields.Brand}, ${record.fields.date[0]}`;
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
        drawerContentImage.src = record.fields.cover_image[0].url;
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
        let allItems = Array.from(document.querySelectorAll(".airtable-item"));

        /* 
        SORT
        */

        // create the sort function
        function sortItems(e) {
          // close all drawers after sorting
          document
            .querySelectorAll(".airtable-item.is-open")
            .forEach((item) => {
              item.classList.remove("is-open");
            });

          // only sort through filtered items
          let filteredItems = Array.from(
            document.querySelectorAll(".airtable-item")
          );
          let sortedItems;

          // NOTE: below is an example of sorting alphabetical values like titles

          // if toggle data-type == ascend (a-z)
          // if (e?.target.dataset.type == "ascend") {
          //   e.target.setAttribute("data-type", "descend");

          //   sortedItems = filteredItems.sort(function (a, b) {
          //     return a.dataset.title.localeCompare(b.dataset.title);
          //   });
          // } else {
          //   e.target.setAttribute("data-type", "ascend");

          //   sortedItems = filteredItems.sort(function (a, b) {
          //     return b.dataset.title.localeCompare(a.dataset.title);
          //   });
          // }

          // NOTE: below is an example of toggling numeric values like dates

          // check current sort type and compare elements
          if (e?.target.dataset.type == "descend") {
            e?.target.setAttribute("data-type", "ascend");
            e.target.innerHTML = "NEWEST";

            sortedItems = filteredItems.sort(function (a, b) {
              return (
                parseInt(a.dataset.year.toString()) -
                parseInt(b.dataset.year.toString())
              );
            });
          } else {
            e?.target.setAttribute("data-type", "descend");
            e.target.innerHTML = "OLDEST";

            sortedItems = filteredItems.sort(function (a, b) {
              return (
                parseInt(b.dataset.year.toString()) -
                parseInt(a.dataset.year.toString())
              );
            });
          }

          sortedItems.forEach((item) =>
            document.querySelector(".content-container").append(item)
          );
        }

        // attach event listener to sort toggle
        document
          .querySelector(".sort-toggle")
          .addEventListener("click", (e) => {
            sortItems(e);
          });

        /* 
        FILTER 
        */

        // create filter function
        function filterItems(type, tag) {
          let filteredItems;

          // close all drawers after filtering
          document
            .querySelectorAll(".airtable-item.is-open")
            .forEach((item) => {
              item.classList.remove("is-open");
            });

          // filter items based on the type of the filter clicked
          // if all is selected, reset items
          if (tag == "all") {
            filteredItems = allItems;
          } else if (type == "location") {
            filteredItems = allItems.filter((item) =>
              item.dataset.location.includes(tag.dataset.filter)
            );
          }

          //clear the container to make way for filtered items
          container.innerHTML = "";

          console.log('filteredItems', filteredItems);

          // loop through the filtered items and append them to the container
          filteredItems.forEach((item) => {
            container.append(item);
          });
        }

        // now that we have added all of the unique locations to the locations array in the forloop above,
        // we can now loop through the locations array to create each filter
        locations.forEach((location) => {
          // create a filter button for each location
          let filterBtn = document.createElement("button");
          // add a class to the button
          filterBtn.classList.add("filter-btn");
          // set the data-filter equal to the value of the current array element
          filterBtn.setAttribute("data-filter", location);
          // render the location value of the current array element inside the html button
          filterBtn.innerHTML = location;
          // once the button has been created
          // append it to the filters parent container
          document.querySelector(".filters").append(filterBtn);

          // lastly, we add an event listener
          // which listens for a user clicking the button we've just created
          filterBtn.addEventListener("click", (e) => {
            // clear active states on filters
            document
              .querySelectorAll(".filter-btn")
              .forEach((btn) => btn.classList.remove("is-active"));
            // apply active state to selected filter
            e.target.classList.add("is-active");
            // loop through all the airtable items in the document
            // assign type equal to 'location' and tag equal to the target
            filterItems("location", e.target);
          });
        });

        // add an event listener to our 'all' filter which resets the filters
        document
          .querySelector('.filter-btn[data-filter="all"]')
          .addEventListener("click", (e) => {
            document
              .querySelectorAll(".filter-btn")
              .forEach((btn) => btn.classList.remove("is-active"));
            // apply active state to selected filter
            e.target.classList.add("is-active");
            filterItems("location", "all");
          });
      }
    }
  );