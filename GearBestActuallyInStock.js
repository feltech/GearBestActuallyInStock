// ==UserScript==
// @name           	GearBest Actually In-Stock
// @namespace      	https://www.gearbest.com
// @description    	Highlight items on GearBest that are *actually* in stock
// @include        	https://www.gearbest.com/*
// @require					https://code.jquery.com/jquery-3.2.1.min.js
// @require					https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// ==/UserScript==
(function () {
  console.log("Loaded in-stock checker");

  let observer = new MutationObserver(observation),
      nodes = [];

  // Watch the product list for when the "href" is set.
  observer.observe(
    document.getElementById("catePageList"),
    {attributes: true, subtree: true, attributeFilter: ["href"]}
  )

  // Process product links once they've been rendered.
  let process = _.debounce(function () {
    try {
      // Stop observing.
      observer.disconnect();

      // Loop each product link checking for in-stock status.
      nodes.forEach(function (el) {
                // Anchor link to product page.
        let $a = $(el),
            // Href to product page without query param (warehouse ID)
            href = $a.attr("href").split("?")[0],
            // Parent panel containing product page link and warehouse list.
            $parent = $a.closest("li"),
            // Warehouse list, which we wish to correct.
            $warehouses = $parent.find("[data-wearhose-id]"),
            // ID->element mapping of warehouses.
            warehouses = {};

        // Create mapping of warehouse ID -> warehouse element;
        $warehouses.toArray().forEach(function (el) {
          let $warehouse = $(el);
          warehouses[$warehouse.attr("data-wearhose-id")] = $warehouse;
        });

        // Query product page and check for actual available warehouses.
        $.get(href).then(function success(page) {

          try {
                // (Parsed) product page.
            let $page = $(page),
                // Actually available warehouse elements.
                $availWarehouses = $page.find("p.warehouse_options input"),
                // Actually available warehouse IDs.
                availWarehouseIDs,
                // Actually available warehouse that has the cheapest price.
                $cheapestWarehouse,
                // The cheapest available price.
                cheapestPrice = 999999999;

            // Get list of actually available warehouse IDs.
            availableWarehouseIDs = $availWarehouses.toArray().map(function (el) {
              return el.value;
            });

            // Remove warehouse options for products that are not actually available there.
            _.each(warehouses, function ($warehouse, warehouseID) {
              if (availableWarehouseIDs.indexOf(warehouseID) === -1) {
                $warehouse.css({opacity: 0.2});
              } else {
                let price = parseInt($warehouse.data().price, 10);
                if (price < cheapestPrice) {
                  cheapestPrice = price;
                  $cheapestWarehouse = $warehouse;
                }
              }
            });

            // If there are no products available in warehouses at all, then grey out panel.
            if (availableWarehouseIDs.length === 0) {
              $parent.css({opacity: 0.4});
            } else {
              // Pick cheapest warehouse.
            $cheapestWarehouse.click();
              var evt = document.createEvent("MouseEvents");
              evt.initEvent("click", true, true);
              $cheapestWarehouse[0].dispatchEvent(evt);
            }

          } catch (e) {
            logger.error("Error processing product page", e);
          }

        }, function error(e) {
          console.log("Error checking warehouses", e);
        });

      });
    } catch (e) {
        console.error("Error processing items", e);
    }
  }, 1000);


  // Observe "href" changes and keep track of the elements we are interested in.
  function observation(mutations) {
    try {
      let newNodes = mutations.map(function (mutation) {
        return mutation.target;
      }).filter(function (el) {
        return $(el).attr("data-module") === "product";
      });

      nodes = _.union(
        nodes,
        newNodes
      );

      process();

    } catch (e) {
     console.error("Error processing mutations", e);
    }
  }

}());
