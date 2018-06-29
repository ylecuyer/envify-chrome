function matchRule(str, rule) {
	return new RegExp(rule.split("*").join(".*")).test(str);
}

function getColorFromUrl(url) {
	var color = null

	env.forEach(function(env) {
		if (matchRule(url, env.match)) {
			color = env.color
		}
	})

	return color
}

function setColorInsideTab(color, visualStyle) {
  if (color == null)
    return

  envify_left_div = document.createElement('div')
  envify_left_div.classList.add('envify')

  if (visualStyle === "left" || visualStyle === "leftright")
    envify_left_div.classList.add('left')

  if (visualStyle === "top" || visualStyle === "topbottom")
    envify_left_div.classList.add('top')

  envify_right_div = document.createElement('div')
  envify_right_div.classList.add('envify')

  if (visualStyle === "right" || visualStyle === "leftright")
    envify_right_div.classList.add('right')

  if (visualStyle === "bottom" || visualStyle === "topbottom")
    envify_right_div.classList.add('bottom')

  envify_right_div.style.backgroundColor = color
  envify_left_div.style.backgroundColor = color
  document.body.classList.add('envify')
  document.body.appendChild(envify_left_div)
  document.body.appendChild(envify_right_div)
}

browser.storage.sync.get(["environments", "visualStyle"]).then((results) => {
  env = []
  let environments = results.environments;
  let visualStyle = results.visualStyle;

  if (environments === undefined) {
    return
  }

  if (visualStyle === undefined) {
	visualStyle = "leftright"
  }

  Object.keys(environments).map(function(value){
    env.push( { match: value, color: environments[value] });
  });

  env.sort(function(a, b) {
    return a.match.length - b.match.length
  })

  setColorInsideTab(getColorFromUrl(window.location.href), visualStyle)
}, function(error){
  console.error("Could not retrieve settings from browser.storage.sync, error was " + error)
});
