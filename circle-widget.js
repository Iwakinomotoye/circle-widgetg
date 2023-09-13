const htmlContent = `<a class="circle-widget-trigger" href="#">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.79883 16.601C9.09183 18.61 11.8258 20 14.9998 20C15.5898 20 16.1628 19.949 16.7158 19.858L20.9998 22V17.96C22.2408 16.903 22.9998 15.52 22.9998 14C22.9998 12.448 22.2078 11.039 20.9188 9.973" stroke="white" stroke-width="2" stroke-miterlimit="10"/>
  <path d="M11 1C5.477 1 1 4.582 1 9C1 10.797 1.75 12.45 3 13.785V19L7.833 16.584C8.829 16.85 9.892 17 11 17C16.523 17 21 13.418 21 9C21 4.582 16.523 1 11 1Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
  </svg>
</a>
<div class="circle-widget-overlay hidden" style="visibility: hidden;">
  <a href="#" class="button-close">
    Close
  </a>
  <iframe id="circleWidgetIframe">
</div>
`;
let widgetWrapper;
const show = config=>{
    let body;
    let widgetIframe = document.getElementById("circleWidgetIframe");
    const scriptUrl = new URL(document.currentScript.src);
    // let scriptTag = '<link id="circleWidgetStylesheet" rel="stylesheet" href="//' + scriptUrl.host + '/external/widget.css" />';
    let scriptTag = '<link id="circleWidgetStylesheet" rel="stylesheet" href="//' + 'help.optimateai.com/assets/widget-97f41c1bd0d2f3906de56141cdff9e5b350d004e2a2545ceb64d80a2edc791c9.css" />';
    scriptTag += '<style type="text/css">:root {--brand: ' + config.brand_color + "; }</style>";
    const widgetScripts = document.getElementById("circleWidgetStylesheet");
    if (!widgetIframe) {
        const temporary = document.createElement("div");
        temporary.innerHTML = htmlContent;
        body = document.getElementsByTagName("body")[0];
        while (temporary.children.length > 0) {
            body.appendChild(temporary.children[0]);
        }
    }
    if (!widgetScripts) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", scriptTag);
    }
    widgetIframe = document.getElementById("circleWidgetIframe");
    let postSlug = "";
    let spaceSlug = "";
    if (config.post_slug) {
        postSlug = config.post_slug;
    }
    if (config.space_slug) {
        spaceSlug = config.space_slug;
    } else if (config.channel_slug) {
        spaceSlug = config.channel_slug;
    }
    // widgetIframe.src = "//" + scriptUrl.host + "/widget/iframe/" + config.community_public_uid + "?space_slug=" + spaceSlug + "&post_slug=" + postSlug;
    widgetIframe.src = "//" + "help.optimateai.com/widget/iframe/" + config.community_public_uid + "?space_slug=" + spaceSlug + "&post_slug=" + postSlug;
    const widgetTrigger = document.getElementsByClassName("circle-widget-trigger", )[0];
    widgetTrigger.removeEventListener("click", open);
    widgetTrigger.addEventListener("click", open);
}
;
const open = ev=>{
    if (ev) {
        ev.preventDefault();
    }
    widgetWrapper = document.getElementsByClassName("circle-widget-overlay")[0];
    widgetWrapper.classList.add("shown");
    widgetWrapper.classList.remove("hidden");
    widgetWrapper.style.visibility = "visible";
    widgetWrapper.addEventListener("click", close);
    document.getElementById("circleWidgetIframe").contentWindow.postMessage("widgetReload", "*");
}
;
const close = ev=>{
    if (ev) {
        ev.preventDefault();
    }
    widgetWrapper.classList.add("hidden");
    widgetWrapper.classList.remove("shown");
    widgetWrapper.style.visibility = "hidden";
    widgetWrapper.removeEventListener("click", close);
}
;
window.CircleWidget = {};
window.CircleWidget.open = open;
window.CircleWidget.close = close;
const supportedAPI = ["init", "setDefaults"];
const appx = window=>{
    let configurations = {};
    let globalObject = window[window["circleWidget"]];
    const queue = globalObject.q;
    if (queue) {
        for (var i = 0; i < queue.length; i++) {
            if (supportedAPI.indexOf(queue[i][0]) !== -1) {
                configurations = extendObject(configurations, queue[i][1]);
            } else
                apiHandler(queue[i][0]);
        }
    }
    globalObject = apiHandler;
    globalObject.configurations = configurations;
    show({
        community_public_uid: globalObject.configurations.community_public_uid,
        brand_color: globalObject.configurations.brand_color,
        space_slug: globalObject.configurations.space_slug,
        channel_slug: globalObject.configurations.channel_slug,
        post_slug: globalObject.configurations.post_slug,
    });
}
;
const apiHandler = api=>{
    if (!api)
        throw Error("API method required");
    if (supportedAPI.indexOf(api) === -1)
        throw Error(`Method ${api} is not supported`);
    console.warn(`No handler defined for ${api}`);
}
;
const extendObject = (a,b)=>{
    for (var key in b)
        if (Object.prototype.hasOwnProperty.call(b, key))
            a[key] = b[key];
    return a;
}
;
appx(window);
