# GearBest Actually In Stock
[GreaseMonkey](https://addons.mozilla.org/en-GB/firefox/addon/greasemonkey/) script to highlight products that are *actually* in stock on the [GearBest](https://www.gearbest.com) website.

GearBest is a great source of cheap products from China, but the website design is rather poor.  One of the biggest problems is that the "in stock" filter for product searches simply doesn't work.  You have to click on each product in turn to see if it is actually in stock.

This GreaseMonkey script will
* Grey out the whole product panel for those that are not available at any warehouse.
* Grey out the little warehouse selectors under each product for those warehouses where the product is not available.
* Select the warehouse with the cheapest available price on the list of little warehouse selectors under each product.

Typically, for me, I'm only interested in EU warehouses. So I will filter the search by selecting all the EU warehouse checkboxes on the left-hand side.  Then, this script will grey out those products (or warehouse icons under the products) that are not actually in stock.
