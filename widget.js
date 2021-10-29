(() => {
  // version 1.1.7
  const adamApiUrl =
    "https://[INSERT_YOUR_PLATFORM_SLUG].cleveradam.io/api/integrations/wordpress/projects?locale=da";

  const selectors = {
    container: ".cleveradam_design_placeholder",
    title: ".cleveradam_title h3",
    description: ".cleveradam_description div",
    image: ".cleveradam_image img",
    targetMin: ".cleveradam_target h5",
    isFunded: ".cleveradam_completed",
    gauge: ".cleveradam_gauge",
    button: ".cleveradam_button a",
    table: ".cleveradam_table",
  };

  const tableContent = [
    {
      path: "funding.minimum",
      type: "number",
    },
    {
      path: "funding.return",
      type: "percentage",
    },
    {
      path: "funding.currency",
      type: "string",
    }
  ];

  const styles = `
          .gauge {
              max-height: 150px;
              display: block;
              margin: 0 auto 32px auto;
          }
  
          .gauge .circle {
              fill: none;
              stroke: var(--adam-color-variant);
              stroke-width: 2.8;
          }
  
          .gauge .stroke {
              fill: none;
              stroke: var(--adam-color-accent);
              stroke-width: 2.8;
              stroke-linecap: round;
              shape-rendering: geometricPrecision;
          }
  
          .gauge .text {
              font-size: 0.5rem;
              font-weight: bold;
              font-family: sans-serif;
          }
  
          .gauge .done {
              transform: translate(6px, 6px);
              fill: var(--adam-color-accent);
          }
      `;
  const chartSvg = (percentage) =>
    `<svg viewBox="0 0 36 36" class="gauge">
          <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
          <path class="stroke" stroke-dasharray="${percentage},100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
          <text class="text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"> ${percentage}% </text>
      </svg>`;
  const getPath = (object, path, value) => {
    // credits: https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab#gistcomment-3148552
    const pathArray = Array.isArray(path)
      ? path
      : path.split(".").filter((key) => key);
    const pathArrayFlat = pathArray.flatMap((part) =>
      typeof part === "string" ? part.split(".") : part
    );
    const checkValue = pathArrayFlat.reduce(
      (obj, key) => obj && obj[key],
      object
    );
    return checkValue === undefined ? value : checkValue;
  };
  const doIfPossible = (obj, action) => obj && action(obj);
  const locale =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.userLanguage ||
        navigator.language ||
        navigator.browserLanguage ||
        "en";

  fetch(adamApiUrl)
    .then((response) => response.json())
    .then((response) => {
      const containers = document.querySelectorAll(selectors.container);
      if (!containers || containers.length === 0) return;

      // append styles
      const styleElement = document.createElement("style");
      styleElement.innerText = styles;
      containers[0].insertAdjacentElement("afterend", styleElement);

      for (let x = 0; x < containers.length; x++) {
        const container = containers[x];
        const placeholder = container.cloneNode(true);
        container.style.display = "none";

        for (let i = 0; i < response.length; i++) {
          const data = response[i];

          const percentage = Math.round(
            (data.funding.current / data.funding.target_min) * 100
          );
          const newItem = placeholder.cloneNode(true);

          doIfPossible(
            newItem.querySelector(selectors.title),
            (obj) => (obj.innerText = data.title)
          );

          doIfPossible(
            newItem.querySelector(selectors.description),
            (obj) => (obj.innerText = data.ogData.description)
          );

          doIfPossible(newItem.querySelector(selectors.image), (obj) => {
            const images = data.media.filter((m) => !m.youtube);
            if (images.length === 0) return;
            const url = images[0].url;
            if (!url) return;
            obj.setAttribute("src", url);
            obj.setAttribute("srcSet", "");
            obj.setAttribute("title", "");
          });

          doIfPossible(
            newItem.querySelector(selectors.targetMin),
            (obj) =>
              (obj.innerText = obj.innerText.replaceAll(
                "{{funding.target_min}}",
                new Intl.NumberFormat(locale).format(data.funding.target_min)
              ))
          );

          if (tableContent.length > 0) {
            doIfPossible(newItem.querySelector(selectors.table), (obj) => {
              tableContent.forEach((content) => {
                const value = getPath(data, content.path);
                if (value === undefined) return;
                
                const numberConfig = content?.type === "percentage" ? {
                     style: 'percent',
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2
                  } : {};

                newItem.innerHTML = newItem.innerHTML.replaceAll(
                  `{{${content.path}}}`,
                  content.type === "number" || content.type === "percentage"
                    ? new Intl.NumberFormat(locale, numberConfig).format(value)
                    : value
                );
              });
            });
          }

          doIfPossible(
            newItem.querySelector(selectors.isFunded),
            (obj) => !data.funded && obj.remove()
          );

          doIfPossible(
            newItem.querySelector(selectors.gauge),
            (obj) => (obj.innerHTML = chartSvg(percentage))
          );

          doIfPossible(newItem.querySelector(selectors.button), (obj) =>
            obj.setAttribute("href", data.links.single)
          );

          container.insertAdjacentElement("afterend", newItem);
        }

        container.style.display = "block";
        container.remove();
      }
    });
})();
