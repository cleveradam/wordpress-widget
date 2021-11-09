# CleverAdam Wordpress HTML Snippet

### How to install the snippet

1. In your editor create the desired layout for your **project list** using your preferred site builder. When you're happy with the look, and ensured that it looks and behaves nicely on all screen sizes and supported browsers continue to the next step.

```html
<!-- this container will get repeated for each item fetched from the API -->
<div class="cleveradam_design_placeholder">
  <div class="cleveradam_image">
    <img src="https://picsum.photos/200/300" alt="" />
  </div>
  <div class="cleveradam_title">
    <h3>This is a placeholder title</h3>
  </div>
  <div class="cleveradam_description">
    <div>
      This placerholder description will be replaced by the campaign description
      once loaded from the API.
    </div>
  </div>
  <div class="cleveradam_target">
    <h5>{{funding.target_min}} {{funding.currency}}</h5>
  </div>
  <div class="cleveradam_table">
    <b>Minimum:</b>{{funding.minimum}} {{funding.currency}} <br />
    <b>Return:</b>{{funding.return}}<br />
  </div>
  <div class="cleveradam_gauge"></div>
  <div class="cleveradam_button">
    <a href="#">Go to project</a>
  </div>
</div>
```


2. Add a CSS class names to elements you want to get populated with data from the API including (but not limited to)

- the containing element (e.g. `cleveradam_design_placeholder`)
- the title element (e.g. `cleveradam_title`)
- the description element (e.g. `cleveradam_description`)
- the image element (e.g. `cleveradam_image`)
- the target minimum element (e.g. `cleveradam_target`)
- the is funded element (e.g. `cleveradam_completed`)
- the gauge/chart element (e.g. `cleveradam_gauge`)
- the button/CTA element (e.g. `cleveradam_button`)
- the table element (e.g. `cleveradam_table`)

3. Paste in the widget.js code as a snippet immediately below your **project list**.

4. Update the `adamApiUrl` URL with the URL to your CleverAdam portal in the code.
   **Remember to use the actual domain name, and not the `*.cleveradam.io` versions before going live.**

5. Align the `selectors` with the CSS class names you assigned in step 2.

6. ???

7. Profit!
